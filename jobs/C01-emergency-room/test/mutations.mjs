import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const build = 'dist/src/build.js';
const cli = 'dist/src/cli.js';
const mutations = [
  ['duplicate products counted twice', build, 'for (const code of new Set(injury.products))', 'for (const code of injury.products)'],
  ['case weights replaced by one', build, 'total.sum += injury.weight;', 'total.sum += 1;'],
  ['case count incremented twice', build, 'total.count += 1;', 'total.count += 2;'],
  ['product order reversed', build, '.sort(([first], [second]) => first - second)', '.sort(([first], [second]) => second - first)'],
  ['source product label discarded', build, 'label: labels.get(productCode),', 'label: String(productCode),'],
  ['fractional weighted total rounded', build, 'sampleWeightedSum: total.sum,', 'sampleWeightedSum: Math.round(total.sum),'],
  ['partial weighted sum called national estimate', build, 'sampleCaseCount: total.count,\n        nationalEstimate: null,', 'sampleCaseCount: total.count,\n        nationalEstimate: total.sum,'],
  ['unsupported fact inserted', build, 'nationalEstimate: null,\n        fact: null,', "nationalEstimate: null,\n        fact: 'unsourced statement',"],
  ['unverified fact called verified', build, "factStatus: 'unverified',\n    }));", "factStatus: 'verified',\n    }));"],
  ['sample declared complete', build, 'complete: false,', 'complete: true,'],
  ['historical year replaced by requested year', build, 'year: fixture.sourceYear,', 'year: fixture.requestedYear,'],
  ['requested year replaced by source year', build, 'requestedYear: fixture.requestedYear,', 'requestedYear: fixture.sourceYear,'],
  ['historical sample called production', build, "mode: 'historical-sample',\n        year: fixture.sourceYear,", "mode: 'production',\n        year: fixture.sourceYear,"],
  ['fractional integer fields accepted', build, '!Number.isSafeInteger(value)', 'false'],
  ['zero case weight accepted', build, 'injury.weight <= 0', 'injury.weight < 0'],
  ['whitespace labels accepted', build, 'value.trim().length === 0', 'value.length === 0'],
  ['unsupported input mode accepted', build, "if (input.mode !== 'historical-sample') {", 'if (false) {'],
  ['historical year order ignored', build, 'if (sourceYear >= requestedYear) {', 'if (false) {'],
  ['duplicate product declarations accepted', build, 'if (declared.has(code)) {', 'if (false) {'],
  ['duplicate case identifiers accepted', build, 'if (caseIds.has(caseId)) {', 'if (false) {'],
  ['source weight changed while parsing', build, 'return { caseId, products: codes, weight: injury.weight };', 'return { caseId, products: codes, weight: injury.weight + 1 };'],
  ['weighted sum overflow accepted', build, 'if (!Number.isFinite(total.sum)) {', 'if (false) {'],
  ['serialized trailing newline omitted', build, 'return `${JSON.stringify(value, null, 2)}\\n`;', 'return `${JSON.stringify(value, null, 2)}`;'],
  ['CLI explicit sample flag omitted', cli, "if (args.length !== 3 || args[2] !== '--sample') {", 'if (args.length < 2) {'],
  ['CLI source overwritten by output', cli, 'if (resolve(input) === resolve(output) || (outputInfo !== null && outputInfo.dev === inputInfo.dev && outputInfo.ino === inputInfo.ino)) {', 'if (false) {'],
].map(([name, file, before, after], index) => ({id: index + 1, name, file, before, after}));

const work = '.mutation-work';
mkdirSync(work, {recursive: true});
const lock = join(work, 'running');
mkdirSync(lock);
const originals = new Map();
const report = {
  command: 'node test/mutations.mjs',
  testCommand: 'node --test dist/test/*.test.js',
  requiredKills: 24,
  mutationCount: mutations.length,
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
  // Node 24 defaults to the spec reporter; older runners may use TAP.
  const tests = Number(outcome.stdout.match(/^(?:#|ℹ)\s+tests (\d+)$/m)?.[1] ?? 0);
  const failed = Number(outcome.stdout.match(/^(?:#|ℹ)\s+fail (\d+)$/m)?.[1] ?? 0);
  return {
    status: outcome.status, signal: outcome.signal, error: outcome.error,
    tests, failed,
    stdout: join(work, `${prefix}.stdout.txt`),
    stderr: join(work, `${prefix}.stderr.txt`),
  };
}

try {
  if (mutations.length !== 25) throw new Error('Exactly 25 mutations are required');
  for (const file of [build, cli]) originals.set(file, readFileSync(file, 'utf8'));
  const tests = readdirSync('dist/test').filter(name => name.endsWith('.test.js')).sort()
    .map(name => join('dist/test', name));
  if (tests.length === 0) throw new Error('No compiled test files found');
  const args = ['--test', ...tests];
  report.baseline = saveOutcome('baseline', execute(args));
  if (report.baseline.status !== 0 || report.baseline.signal || report.baseline.error ||
      report.baseline.tests === 0 || report.baseline.failed !== 0) {
    throw new Error('Unmodified baseline test suite must pass and execute tests');
  }
  for (const mutation of mutations) {
    const original = originals.get(mutation.file);
    const occurrences = original.split(mutation.before).length - 1;
    if (occurrences !== 1) {
      throw new Error(`${mutation.name}: expected exactly one target substring; found ${occurrences}`);
    }
    const prefix = `mutation-${String(mutation.id).padStart(2, '0')}`;
    const result = {...mutation, occurrences, syntax: null, suite: null, killed: false};
    try {
      writeFileSync(mutation.file, original.replace(mutation.before, mutation.after));
      result.syntax = saveOutcome(`${prefix}-syntax`, execute(['--check', mutation.file]));
      if (result.syntax.status !== 0 || result.syntax.signal || result.syntax.error) {
        throw new Error(`${mutation.name}: invalid syntax cannot count as a killed mutation`);
      }
      result.suite = saveOutcome(prefix, execute(args));
      if (result.suite.signal || result.suite.error || result.suite.status === null || result.suite.tests === 0) {
        throw new Error(`${mutation.name}: suite execution failed before a usable test outcome`);
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
