import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const build = 'dist/src/build.js';
const cli = 'dist/src/cli.js';
const mutations = [
  [
    "daily pageviews replaced by record count",
    "dist/src/build.js",
    "total.pageviews += record.pageviews;",
    "total.pageviews += 1;"
  ],
  [
    "duplicate article/date records accepted",
    "dist/src/build.js",
    "if (total.dates.has(record.date))",
    "if (false)"
  ],
  [
    "missing days accepted by primary aggregation",
    "dist/src/build.js",
    "if (total.dates.size !== expectedDays)",
    "if (false)"
  ],
  [
    "unsafe monthly total accepted",
    "dist/src/build.js",
    "if (!Number.isSafeInteger(total.pageviews))",
    "if (false)"
  ],
  [
    "reference aggregation adds one per day",
    "dist/src/build.js",
    "daily.reduce((sum, record) => sum + record.pageviews, 0)",
    "daily.reduce((sum, record) => sum + 1, 0)"
  ],
  [
    "January previous month retains wrong year",
    "dist/src/build.js",
    "current.month === 1 ? current.year - 1 : current.year",
    "current.year"
  ],
  [
    "previous month replaced by current month",
    "dist/src/build.js",
    "current.month === 1 ? 12 : current.month - 1",
    "current.month"
  ],
  [
    "non-400-divisible century treated as leap year",
    "dist/src/build.js",
    "const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);",
    "const leap = year % 4 === 0;"
  ],
  [
    "invalid day past month end accepted",
    "dist/src/build.js",
    " || day > monthLength(year, month)",
    ""
  ],
  [
    "exact 1.2 ratio excluded by primary",
    "dist/src/build.js",
    "5n * higher < 6n * lower",
    "5n * higher <= 6n * lower"
  ],
  [
    "exact 3 ratio excluded by primary",
    "dist/src/build.js",
    "higher > 3n * lower",
    "higher >= 3n * lower"
  ],
  [
    "pair preference changed from 1.6 to 2",
    "dist/src/build.js",
    "const signed = 5n * higher - 8n * lower;",
    "const signed = 5n * higher - 10n * lower;"
  ],
  [
    "previously used article reused",
    "dist/src/build.js",
    "used.has(candidate.low.article) || used.has(candidate.high.article)",
    "used.has(candidate.low.article) && used.has(candidate.high.article)"
  ],
  [
    "reported pair ratio inverted",
    "dist/src/build.js",
    "ratio: high.pageviews / low.pageviews",
    "ratio: low.pageviews / high.pageviews"
  ],
  [
    "exact 1.2 ratio excluded by reference",
    "dist/src/build.js",
    "higher * 5n < lower * 6n",
    "higher * 5n <= lower * 6n"
  ],
  [
    "equal-distance pair tie order reversed",
    "dist/src/build.js",
    "return lexical(first.low.article, second.low.article) || lexical(first.high.article, second.high.article);",
    "return lexical(second.low.article, first.low.article) || lexical(second.high.article, first.high.article);"
  ],
  [
    "input falsely verified current month accepted",
    "dist/src/build.js",
    "input.current_month_verified !== false || input.independent_verification",
    "input.independent_verification"
  ],
  [
    "stored monthly count may disagree with daily records",
    "dist/src/build.js",
    "if (totals.get(article.article) !== article.pageviews)",
    "if (false)"
  ],
  [
    "sample declared complete",
    "dist/src/build.js",
    "complete: false, buildDate, requestedPeriod,",
    "complete: true, buildDate, requestedPeriod,"
  ],
  [
    "historical source declared current-month verified",
    "dist/src/build.js",
    "currentMonthVerified: false,",
    "currentMonthVerified: true,"
  ],
  [
    "source period replaced by requested recent month",
    "dist/src/build.js",
    "sourcePeriod: { start: fixture.period_start, end: fixture.period_end },",
    "sourcePeriod: requestedPeriod,"
  ],
  [
    "unsupported fact inserted",
    "dist/src/build.js",
    "...pair, fact: null, factStatus:",
    "...pair, fact: 'unsupported statement', factStatus:"
  ],
  [
    "unverified fact declared verified",
    "dist/src/build.js",
    "factStatus: 'unverified' }));",
    "factStatus: 'verified' }));"
  ],
  [
    "CLI explicit sample opt-in ignored",
    "dist/src/cli.js",
    "args.length !== 5 || args[2] !== '--sample' || args[3] !== '--build-date'",
    "args.length !== 5 || args[3] !== '--build-date'"
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
  mutationTestCommand: 'node --test --test-reporter=tap dist/test/*.test.js',
  testScope: 'All compiled C03 job tests establish the baseline and run after every compiled core or CLI mutation.',
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
  const mutationArgs = ['--test', '--test-reporter=tap', ...tests];
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
