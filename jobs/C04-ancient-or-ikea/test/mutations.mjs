import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const build = 'dist/src/build.js';
const cli = 'dist/src/cli.js';
const mutations = [
  [
    "historical year zero accepted",
    "dist/src/build.js",
    " || value === 0",
    ""
  ],
  [
    "fractional historical year accepted",
    "dist/src/build.js",
    "!Number.isInteger(value) || ",
    ""
  ],
  [
    "unsupported BCE year -10000 accepted",
    "dist/src/build.js",
    "value < -9999",
    "value < -10000"
  ],
  [
    "reversed historical range accepted",
    "dist/src/build.js",
    "if (start > end)",
    "if (false)"
  ],
  [
    "primary exact CE century boundary moved forward",
    "dist/src/build.js",
    "Math.ceil(start / 100)",
    "Math.floor(start / 100) + 1"
  ],
  [
    "primary BCE starting century made positive",
    "dist/src/build.js",
    " : -Math.ceil(-start / 100)",
    " : Math.ceil(-start / 100)"
  ],
  [
    "primary final century omitted",
    "dist/src/build.js",
    "century <= last;",
    "century < last;"
  ],
  [
    "primary includes nonexistent century zero",
    "dist/src/build.js",
    "if (century !== 0)",
    "if (true)"
  ],
  [
    "reference CE lower boundary starts one year early",
    "dist/src/build.js",
    "const lower = century < 0 ? century * 100 : (century - 1) * 100 + 1;",
    "const lower = century < 0 ? century * 100 : (century - 1) * 100;"
  ],
  [
    "reference BCE upper boundary extends one year",
    "dist/src/build.js",
    "const upper = century < 0 ? (century + 1) * 100 - 1 : century * 100;",
    "const upper = century < 0 ? (century + 1) * 100 : century * 100;"
  ],
  [
    "reference century intersection accepts either bound",
    "dist/src/build.js",
    "lower <= end && upper >= start",
    "lower <= end || upper >= start"
  ],
  [
    "duplicate museum catalogue IDs accepted",
    "dist/src/build.js",
    "if (ids.has(prefixedId))",
    "if (false)"
  ],
  [
    "source hash pin mismatch accepted",
    "dist/src/build.js",
    " || source_sha256 !== PINNED_HASHES[prefixedId]",
    ""
  ],
  [
    "input falsely claims image bytes downloaded",
    "dist/src/build.js",
    "row.image_bytes_downloaded !== false || ",
    ""
  ],
  [
    "unstructured date labels guessed as 1900",
    "dist/src/build.js",
    "const dateRange = structured ? { start: row.date_start, end: row.date_end } : null;",
    "const dateRange = structured ? { start: row.date_start, end: row.date_end } : { start: 1900, end: 1900 };"
  ],
  [
    "structured source date range extended by 100 years",
    "dist/src/build.js",
    "{ start: row.date_start, end: row.date_end } : null",
    "{ start: row.date_start, end: row.date_end + 100 } : null"
  ],
  [
    "unstructured label called catalogue range evidence",
    "dist/src/build.js",
    "dateEvidence: structured ? 'catalogue-range' : 'unstructured-label'",
    "dateEvidence: 'catalogue-range'"
  ],
  [
    "missing image replaced by unlicensed object",
    "dist/src/build.js",
    "image: null, fact: null",
    "image: {}, fact: null"
  ],
  [
    "unsupported fact inserted",
    "dist/src/build.js",
    "fact: null, factStatus:",
    "fact: 'unsupported statement', factStatus:"
  ],
  [
    "unverified fact declared verified",
    "dist/src/build.js",
    "factStatus: 'unverified',",
    "factStatus: 'verified',"
  ],
  [
    "unverified image license declared verified",
    "dist/src/build.js",
    "imageLicenseVerified: false",
    "imageLicenseVerified: true"
  ],
  [
    "metadata sample declared complete",
    "dist/src/build.js",
    "complete: false, rows };",
    "complete: true, rows };"
  ],
  [
    "metadata sample called production",
    "dist/src/build.js",
    "mode: 'metadata-sample', complete:",
    "mode: 'production', complete:"
  ],
  [
    "CLI explicit sample opt-in ignored",
    "dist/src/cli.js",
    "args.length !== 3 || args[2] !== '--sample'",
    "args.length !== 3"
  ],
  [
    "CLI source overwrite protection removed",
    "dist/src/cli.js",
    "if (resolve(input) === resolve(output) || (outputStat !== null &&\n        (realpathSync(input) === realpathSync(output) || (inputStat.dev === outputStat.dev && inputStat.ino === outputStat.ino)))) {",
    "if (false) {"
  ]
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
  testScope: 'All compiled C04 core and portrait tests establish the baseline; every TypeScript core or CLI mutation runs the complete core.test.js suite. Portrait code is unchanged.',
  requiredKills: 24,
  mutationCount: mutations.length,
  sourceSha256: {},
  restoredSha256: {},
  restoredBySha256: false,
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
  for (const [file] of originals) {
    report.restoredSha256[file] = createHash('sha256').update(readFileSync(file)).digest('hex');
  }
  report.restoredBySha256 = [...originals.keys()].every(file => report.restoredSha256[file] === report.sourceSha256[file]);
  report.restored = report.restoredBySha256 && [...originals].every(([file, original]) => readFileSync(file, 'utf8') === original);
  if (!report.restored) {
    report.error = 'Original compiled artifacts were not restored';
    process.exitCode = 1;
  }
  writeFileSync(join(work, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  rmSync(lock, {recursive: true, force: true});
  console.log(JSON.stringify({mutationCount: report.mutationCount, killed: report.killed,
    survivors: report.survivors, restored: report.restored, sha256Restored: report.restoredBySha256, error: report.error,
    report: join(work, 'report.json')}));
}
