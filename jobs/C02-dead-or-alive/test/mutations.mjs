import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const build = 'dist/src/build.js';
const cli = 'dist/src/cli.js';
const mutations = [
  ['60-sitelink boundary excluded by primary', build, 'candidate.sitelinks < 60)', 'candidate.sitelinks <= 60)'],
  ['30-day death boundary excluded by primary', build, 'asOfDay - deathDay < 30)', 'asOfDay - deathDay <= 30)'],
  ['unknown sitelinks treated as verified by primary', build, 'candidate.sitelinks === null || candidate.verifiedAsOf', 'candidate.verifiedAsOf'],
  ['stale status verification accepted by primary', build, 'candidate.verifiedAsOf !== asOf || !candidate.portraitVerified', '!candidate.portraitVerified'],
  ['unverified portrait accepted by primary', build, ' || !candidate.portraitVerified) {', ') {'],
  ['primary alive and dead labels reversed', build, "return candidate.deathDate === null ? 'alive' : 'dead';", "return candidate.deathDate === null ? 'dead' : 'alive';"],
  ['60-sitelink boundary excluded by reference', build, 'candidate.sitelinks <= 59)', 'candidate.sitelinks <= 60)'],
  ['30-day death boundary excluded by reference', build, 'elapsedDays >= 30', 'elapsedDays > 30'],
  ['Gregorian year zero accepted', build, 'year < 1 || month < 1 || month > 12', 'year < 0 || month < 1 || month > 12'],
  ['non-400-divisible century treated as leap year', build, 'const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);', 'const leap = year % 4 === 0;'],
  ['invalid day past month end accepted', build, 'day < 1 || day > lengths[month - 1]', 'day < 1'],
  ['UTC calendar rollover accepted by reference', build, '!Number.isFinite(milliseconds) || utc.toISOString().slice(0, 10) !== value', '!Number.isFinite(milliseconds)'],
  ['fractional sitelinks accepted', build, '!Number.isSafeInteger(input.sitelinks) || input.sitelinks < 0', 'input.sitelinks < 0'],
  ['future death date accepted', build, 'deathDay !== null && deathDay > asOfDay', 'false'],
  ['duplicate fixture IDs accepted', build, 'if (ids.has(id))', 'if (false)'],
  ['historical sample called production', build, "return { mode: 'historical-sample', buildDate,", "return { mode: 'production', buildDate,"],
  ['sample declared complete', build, 'complete: false, rows };', 'complete: true, rows };'],
  ['unknown present status guessed alive', build, 'status: null,\n        sitelinks: null,', "status: 'alive',\n        sitelinks: null,"],
  ['unknown sitelinks guessed at eligibility threshold', build, 'sitelinks: null,\n        portrait: null,', 'sitelinks: 60,\n        portrait: null,'],
  ['missing portrait replaced by unlicensed object', build, 'portrait: null,\n        fact: null,', 'portrait: {},\n        fact: null,'],
  ['unsupported fact inserted', build, "fact: null,\n        factStatus: 'unverified',", "fact: 'unsupported statement',\n        factStatus: 'unverified',"],
  ['unknown fact called verified', build, "factStatus: 'unverified',\n    }));", "factStatus: 'verified',\n    }));"],
  ['serialized trailing newline omitted', build, 'return `${JSON.stringify(value, null, 2)}\\n`;', 'return `${JSON.stringify(value, null, 2)}`;'],
  ['CLI explicit sample opt-in ignored', cli, "args.length !== 5 || args[2] !== '--sample' || args[3] !== '--build-date'", "args.length !== 5 || args[3] !== '--build-date'"],
  ['CLI source overwrite protection removed', cli, 'if (resolve(input) === resolve(output) ||\n        (outputStat !== null && (realpathSync(input) === realpathSync(output) ||\n            (inputStat.dev === outputStat.dev && inputStat.ino === outputStat.ino)))) {', 'if (false) {'],
].map(([name, file, before, after], index) => ({id: index + 1, name, file, before, after}));

const work = '.mutation-work';
mkdirSync(work, {recursive: true});
const lock = join(work, 'running');
mkdirSync(lock);
const originals = new Map();
const report = {
  command: 'node test/mutations.mjs',
  baselineTestCommand: 'node --test --test-reporter=tap dist/test/*.test.js',
  mutationTestCommand: 'node --test --test-reporter=tap dist/test/core.test.js',
  testScope: 'All job tests establish the baseline; each compiled core or CLI mutation runs the complete core.test.js suite. Portrait code is unchanged.',
  requiredKills: 24,
  mutationCount: mutations.length,
  sourceSha256: {},
  baseline: null,
  results: [],
  killed: 0,
  survivors: 0,
  restored: false,
  error: null,
};

function execute(args) {
  const outcome = spawnSync(process.execPath, args, {
    encoding: 'utf8', timeout: 60_000, maxBuffer: 16 * 1024 * 1024,
    env: {...process.env, FORCE_COLOR: '0'},
  });
  return {
    status: outcome.status,
    signal: outcome.signal,
    error: outcome.error?.message ?? null,
    stdout: outcome.stdout ?? '',
    stderr: outcome.stderr ?? '',
  };
}

function saveOutcome(prefix, outcome) {
  writeFileSync(join(work, `${prefix}.stdout.txt`), outcome.stdout);
  writeFileSync(join(work, `${prefix}.stderr.txt`), outcome.stderr);
  const count = label => Number(outcome.stdout.match(new RegExp(`^# ${label} (\\d+)$`, 'm'))?.[1] ?? 0);
  return {
    status: outcome.status, signal: outcome.signal, error: outcome.error,
    tests: count('tests'), failed: count('fail'), skipped: count('skipped'),
    cancelled: count('cancelled'),
    stdout: join(work, `${prefix}.stdout.txt`),
    stderr: join(work, `${prefix}.stderr.txt`),
  };
}

function usable(outcome) {
  return outcome.status !== null && !outcome.signal && !outcome.error &&
    outcome.tests > outcome.skipped + outcome.cancelled && outcome.cancelled === 0;
}

try {
  if (mutations.length !== 25) throw new Error('Exactly 25 mutations are required');
  for (const file of [build, cli]) {
    const original = readFileSync(file, 'utf8');
    originals.set(file, original);
    report.sourceSha256[file] = createHash('sha256').update(original).digest('hex');
  }
  // Validate all unique target locations before changing any compiled artifact.
  const targets = new Set();
  for (const mutation of mutations) {
    const target = `${mutation.file}\n${mutation.before}`;
    if (targets.has(target)) throw new Error(`${mutation.name}: duplicate mutation target`);
    targets.add(target);
    const original = originals.get(mutation.file);
    const occurrences = original.split(mutation.before).length - 1;
    if (occurrences !== 1) {
      throw new Error(`${mutation.name}: expected exactly one target substring; found ${occurrences}`);
    }
    if (mutation.before === mutation.after) throw new Error(`${mutation.name}: mutation must change behavior`);
  }
  const tests = readdirSync('dist/test').filter(name => name.endsWith('.test.js')).sort()
    .map(name => join('dist/test', name));
  const coreTest = join('dist/test', 'core.test.js');
  if (tests.length === 0 || !tests.includes(coreTest)) throw new Error('Compiled job and core tests must exist');
  report.baseline = saveOutcome('baseline', execute(['--test', '--test-reporter=tap', ...tests]));
  if (!usable(report.baseline) || report.baseline.status !== 0 || report.baseline.failed !== 0) {
    throw new Error('Unmodified full job test suite must pass and execute tests');
  }
  const mutationArgs = ['--test', '--test-reporter=tap', coreTest];
  for (const mutation of mutations) {
    const original = originals.get(mutation.file);
    const prefix = `mutation-${String(mutation.id).padStart(2, '0')}`;
    const result = {...mutation, occurrences: 1, syntax: null, suite: null, killed: false};
    try {
      writeFileSync(mutation.file, original.replace(mutation.before, mutation.after));
      result.syntax = saveOutcome(`${prefix}-syntax`, execute(['--check', mutation.file]));
      if (result.syntax.status !== 0 || result.syntax.signal || result.syntax.error) {
        throw new Error(`${mutation.name}: invalid syntax cannot count as a killed mutation`);
      }
      result.suite = saveOutcome(prefix, execute(mutationArgs));
      if (!usable(result.suite)) {
        throw new Error(`${mutation.name}: timeout, cancellation, crash, or zero-test result cannot count as a kill`);
      }
      result.killed = result.suite.status !== 0 && result.suite.failed > 0;
      report.results.push(result);
      if (result.killed) report.killed++;
      else report.survivors++;
      console.log(JSON.stringify({id: mutation.id, name: mutation.name,
        killed: result.killed, status: result.suite.status, tests: result.suite.tests,
        failed: result.suite.failed, syntaxStatus: result.syntax.status}));
    } finally {
      writeFileSync(mutation.file, original);
    }
  }
  if (report.killed < report.requiredKills) {
    throw new Error(`Only ${report.killed}/25 mutations caught; at least 24 are required`);
  }
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  for (const [file, original] of originals) writeFileSync(file, original);
  report.restored = [...originals].every(([file, original]) => readFileSync(file, 'utf8') === original);
  if (!report.restored) {
    report.error = 'Original compiled artifacts were not restored';
    process.exitCode = 1;
  }
  writeFileSync(join(work, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  rmSync(lock, {recursive: true, force: true});
  console.log(JSON.stringify({mutationCount: report.mutationCount, killed: report.killed,
    survivors: report.survivors, restored: report.restored, error: report.error,
    report: join(work, 'report.json')}));
}
