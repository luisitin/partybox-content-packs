import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const jobDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = join(jobDirectory, 'dist');
const corePath = join(distDirectory, 'src', 'core.js');
const cliPath = join(distDirectory, 'src', 'cli.js');
const coreTests = join(distDirectory, 'test', 'core.test.js');
const timeoutMilliseconds = 90_000;
const baselineTimeoutMilliseconds = 300_000;
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function allFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      assert(!entry.isSymbolicLink(), `Unexpected symlink in compiled output: ${path}`);
      return entry.isDirectory() ? allFiles(path) : [path];
    });
}

function replaceOnce(source, before, after) {
  assert.notEqual(before, after, 'A mutation must change the implementation');
  assert.equal(source.split(before).length - 1, 1, `Mutation anchor must occur exactly once: ${before}`);
  return source.replace(before, after);
}

function inFunction(source, name, before, after) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert(start >= 0, `Missing mutation function ${name}`);
  assert.equal(source.indexOf(marker, start + marker.length), -1, `Ambiguous mutation function ${name}`);
  const next = source.slice(start + marker.length).search(/\n(?:export )?function /);
  const end = next < 0 ? source.length : start + marker.length + next;
  const section = source.slice(start, end);
  return source.slice(0, start) + replaceOnce(section, before, after) + source.slice(end);
}

// Each entry below changes one behavior in the original compiled implementation.
// Every mutant is applied independently; previous mutants are never cumulative.
const change = (id, description, name, before, after, target = 'core') => ({
  id, description, target, apply: (source) => inFunction(source, name, before, after),
});
const mutations = [
  change('M01', 'Silently truncate fractional annual counts', 'annual',
    "count: safeInteger(row.count, 5, 'count')", "count: safeInteger(Math.floor(row.count), 5, 'count')"),
  change('M02', 'Accept annual counts below the SSA publication threshold', 'annual',
    "safeInteger(row.count, 5, 'count')", "safeInteger(row.count, 0, 'count')"),
  change('M03', 'Accept an analysis window beginning in a partial decade', 'validatedWindow',
    'startYear % 10 !== 0', 'false'),
  change('M04', 'Accept duplicate annual year/name/sex records', 'validatedRecords',
    'if (seen.has(key))', 'if (false && seen.has(key))'),
  change('M05', 'Include the next decade boundary in reference subtotals', 'aggregateReference',
    'row.year < decade + 10', 'row.year <= decade + 10'),
  change('M06', 'Allow published sums beyond the safe integer range', 'safeSum',
    'if (!Number.isSafeInteger(sum))', 'if (false && !Number.isSafeInteger(sum))'),
  change('M07', 'Allow digit characters in names', 'nameValue',
    '/^[A-Za-z]{1,40}$/', '/^[A-Za-z0-9]{1,40}$/'),
  change('M08', 'Accept an unsupported sex category', 'sexValue',
    "value !== 'F' && value !== 'M'", "value !== 'F' && value !== 'M' && value !== 'X'"),
  change('M09', 'Merge male and female categories with the same name', 'aggregatePrimary',
    'const key = `${row.sex}:${row.name}`;', 'const key = `${row.name}`;'),
  change('M10', 'Add one excess published count per annual row to each decade', 'aggregatePrimary',
    'cell.count = safeSum(cell.count, row.count);', 'cell.count = safeSum(cell.count, row.count + 1);'),
  change('M11', 'Leave omitted-year coverage unchanged when a year is published', 'aggregatePrimary',
    'cell.omittedYearCount -= 1;', 'cell.omittedYearCount -= 0;'),
  change('M12', 'Count every published year twice', 'aggregatePrimary',
    'cell.publishedYearCount += 1;', 'cell.publishedYearCount += 2;'),
  change('M13', 'Add one excess published count per annual row to the total', 'aggregatePrimary',
    'group.total = safeSum(group.total, row.count);', 'group.total = safeSum(group.total, row.count + 1);'),
  change('M14', 'Choose the latest decade when peak counts tie', 'aggregatePrimary',
    'if (cell.count > peakCount)', 'if (cell.count >= peakCount)'),
  change('M15', 'Exclude another tied peak from the runner-up count', 'aggregatePrimary',
    'else if (cell.count > runnerUpCount)', 'else if (cell.count > runnerUpCount && cell.count < peakCount)'),
  change('M16', 'Exclude the exact 50000 published-count boundary', 'selectPrimary',
    'row.totalPublishedCount >= 50000', 'row.totalPublishedCount > 50000'),
  change('M17', 'Exclude the exact 115 percent peak-clarity boundary', 'selectPrimary',
    'BigInt(row.peakCount) * 100n >= BigInt(row.runnerUpCount) * 115n',
    'BigInt(row.peakCount) * 100n > BigInt(row.runnerUpCount) * 115n'),
  change('M18', 'Rank qualifying names by ascending published total', 'selectPrimary',
    'b.totalPublishedCount - a.totalPublishedCount', 'a.totalPublishedCount - b.totalPublishedCount'),
  change('M19', 'Retain multiple qualifying categories for the same name', 'selectPrimary',
    'if (names.has(row.name))', 'if (false && names.has(row.name))'),
  change('M20', 'Return one name more than the requested selection limit', 'selectPrimary',
    'if (selected.length === limit)', 'if (selected.length > limit)'),
  change('M21', 'Accept an unrecognized source SHA256', 'parseFixture',
    'if (sourceObject[key] !== PINNED_SOURCE[key])', "if (key !== 'sha256' && sourceObject[key] !== PINNED_SOURCE[key])"),
  change('M22', 'Claim that the historical sample is complete', 'buildSample',
    'complete: false,', 'complete: true,'),
  change('M23', 'Claim that current metrics have been verified', 'buildSample',
    'currentMetricsVerified: false,', 'currentMetricsVerified: true,'),
  change('M24', 'Accept an unsupported CLI mode option', 'main',
    "args[2] !== '--sample'", 'false', 'cli'),
  change('M25', 'Allow an output hardlink to alias the source input', 'main',
    '(outputStat.dev === inputStat.dev && outputStat.ino === inputStat.ino) || await realpath(output) === inputReal',
    'await realpath(output) === inputReal', 'cli'),
];

function completedCounts(output, paths) {
  const counts = {};
  for (const label of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
    const matches = [...output.matchAll(new RegExp(`^# ${label} (\\d+)$`, 'gm'))];
    assert.equal(matches.length, 1, `Missing or ambiguous TAP ${label} summary`);
    counts[label] = Number(matches[0][1]);
  }
  assert(counts.tests > 0, 'A zero-test run cannot validate a mutation');
  assert.equal(counts.tests, counts.pass + counts.fail + counts.cancelled + counts.skipped + counts.todo,
    'TAP outcome counts are inconsistent');
  assert.equal(counts.cancelled, 0, 'Cancelled tests do not count as caught bugs');
  assert.equal(counts.skipped, 0, 'The complete test suite must execute');
  assert.equal(counts.todo, 0, 'TODO tests do not validate behavior');
  assert(!/testTimeoutFailure/.test(output),
    'A test timeout does not count as an executed failing test');
  const fileNames = new Set(paths.flatMap((path) => [path, relative(jobDirectory, path)]));
  for (const heading of output.matchAll(/^# Subtest: (.+)$/gm)) {
    assert(!fileNames.has(heading[1]), 'A test file without executed test cases cannot validate a mutation');
  }
  return counts;
}

function runSuite(paths, timeout = timeoutMilliseconds) {
  assert(paths.length > 0, 'Missing compiled tests');
  const result = spawnSync(process.execPath,
    ['--test', '--test-concurrency=1', '--test-reporter=tap', ...paths], {
      cwd: jobDirectory,
      encoding: 'utf8',
      timeout,
      maxBuffer: 16 * 1024 * 1024,
      env: process.env,
    });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  assert(!result.error, `Test runner failed: ${result.error?.message}\n${output}`);
  assert.equal(result.signal, null, `Test runner was terminated: ${result.signal}\n${output}`);
  const counts = completedCounts(output, paths);
  assert(result.status === 0 || result.status === 1, `Unexpected test exit status ${result.status}\n${output}`);
  assert.equal(result.status === 0, counts.fail === 0, `Test status disagrees with failures\n${output}`);
  return { command: [process.execPath, '--test', '--test-concurrency=1', '--test-reporter=tap', ...paths],
    timeoutMilliseconds: timeout, exitCode: result.status, ...counts, output };
}

function checkSyntax(path) {
  const result = spawnSync(process.execPath, ['--check', path], {
    cwd: jobDirectory, encoding: 'utf8', timeout: timeoutMilliseconds,
  });
  assert(!result.error && result.signal === null && result.status === 0,
    `Mutant is not valid compiled JavaScript: ${result.error?.message ?? result.stderr ?? result.signal}`);
  return { command: [process.execPath, '--check', path], exitCode: result.status };
}

function reportDestination() {
  const arguments_ = process.argv.slice(2);
  if (arguments_.length === 0) return undefined;
  assert.equal(arguments_.length, 2, 'Usage: node test/mutations.mjs [--report /path/report.json]');
  assert.equal(arguments_[0], '--report', 'Usage: node test/mutations.mjs [--report /path/report.json]');
  const path = resolve(arguments_[1]);
  assert(path !== fileURLToPath(import.meta.url) && !path.startsWith(`${distDirectory}/`),
    'The evidence report must not overwrite the runner or compiled files');
  return path;
}

function main() {
  const reportPath = reportDestination();
  assert.equal(mutations.length, 25, 'Exactly 25 semantic mutants are required');
  assert.equal(new Set(mutations.map((mutation) => mutation.id)).size, 25, 'Mutation identifiers must be distinct');
  const snapshot = new Map(allFiles(distDirectory).map((path) => [path, readFileSync(path)]));
  assert(snapshot.has(corePath) && snapshot.has(cliPath) && snapshot.has(coreTests),
    'Run npm run build before the mutation runner');
  const allTests = [...snapshot.keys()].filter((path) => path.startsWith(join(distDirectory, 'test') + '/') && path.endsWith('.test.js'));
  const evidence = { baseline: null, coreBaseline: null, mutations: [], caught: 0, restored: false,
    originalHashes: Object.fromEntries([...snapshot].map(([path, bytes]) => [relative(jobDirectory, path), sha256(bytes)])) };
  let failure;
  try {
    evidence.baseline = runSuite(allTests, baselineTimeoutMilliseconds);
    assert.equal(evidence.baseline.fail, 0, `Unmodified full baseline failed\n${evidence.baseline.output}`);
    evidence.coreBaseline = runSuite([coreTests]);
    assert.equal(evidence.coreBaseline.fail, 0, `Unmodified core baseline failed\n${evidence.coreBaseline.output}`);
    console.log(`Baseline: ${evidence.baseline.pass}/${evidence.baseline.tests} full tests; ${evidence.coreBaseline.pass}/${evidence.coreBaseline.tests} core tests passed.`);
    for (const mutation of mutations) {
      const path = mutation.target === 'cli' ? cliPath : corePath;
      const original = snapshot.get(path);
      const record = { id: mutation.id, description: mutation.description, target: relative(jobDirectory, path),
        status: 'invalid', tests: 0, fail: 0, cancelled: 0 };
      try {
        const altered = mutation.apply(original.toString('utf8'));
        assert.notEqual(altered, original.toString('utf8'), 'Mutation did not alter the implementation');
        record.mutantSha256 = sha256(Buffer.from(altered));
        writeFileSync(path, altered);
        record.syntaxCheck = checkSyntax(path);
        const run = runSuite([coreTests]);
        assert.equal(run.tests, evidence.coreBaseline.tests, 'Every core test must execute for each mutant');
        Object.assign(record, run, { status: run.fail > 0 ? 'caught' : 'survived' });
        if (record.status === 'caught') evidence.caught += 1;
      } catch (error) {
        record.error = error.stack ?? String(error);
      } finally {
        writeFileSync(path, original);
        assert(readFileSync(path).equals(original), `Failed to restore ${path}`);
      }
      evidence.mutations.push(record);
      console.log(`${mutation.id}: ${record.status}; tests=${record.tests}; failed=${record.fail}; cancelled=${record.cancelled}; ${mutation.description}`);
      if (record.error) console.error(record.error);
    }
    assert(evidence.mutations.every((record) => record.status !== 'invalid'), 'An invalid or incomplete run cannot count toward the mutation target');
    assert(evidence.caught >= 24, `Only ${evidence.caught}/25 semantic mutants were caught; at least 24 are required`);
  } catch (error) {
    failure = error;
    evidence.error = error.stack ?? String(error);
  } finally {
    // Restore every original compiled file, even if a check throws midway through a mutant.
    for (const [path, bytes] of snapshot) writeFileSync(path, bytes);
    const current = allFiles(distDirectory);
    assert.deepEqual(current, [...snapshot.keys()], 'The compiled output file set changed during mutations');
    evidence.restoredHashes = Object.fromEntries(current.map((path) => {
      const bytes = readFileSync(path);
      assert(bytes.equals(snapshot.get(path)), `Compiled bytes changed after restoration: ${path}`);
      return [relative(jobDirectory, path), sha256(bytes)];
    }));
    assert.deepEqual(evidence.restoredHashes, evidence.originalHashes, 'Compiled SHA256 hashes changed after restoration');
    evidence.restored = true;
    if (reportPath) writeFileSync(reportPath, `${JSON.stringify(evidence, null, 2)}\n`);
  }
  if (failure) throw failure;
  console.log(`Mutation result: ${evidence.caught}/25 caught; compiled bytes and SHA256 hashes restored.`);
}

try {
  main();
} catch (error) {
  console.error(error.stack ?? String(error));
  process.exitCode = 1;
}
