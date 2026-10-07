import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { Ajv } from 'ajv';
import { buildComplete, serialiseComplete } from '../src/complete-cli.js';
import { buildReviewedCandidates } from '../src/reviewed-cli.js';
import type { CurrentCuration, CurrentFixture } from '../src/current.js';

const ROOT = process.cwd();
const SOURCE_PATH = join(ROOT, 'fixtures/current-source.json');
const SOURCE = JSON.parse(readFileSync(SOURCE_PATH, 'utf8')) as CurrentFixture;
const CURATION = JSON.parse(readFileSync(join(ROOT, 'fixtures/curation.json'), 'utf8')) as CurrentCuration[];
const CLI = fileURLToPath(new URL('../src/complete-cli.js', import.meta.url));
const clone = <T>(value: T): T => structuredClone(value);

/** Missing production facts become visibly synthetic test metadata, never a delivered pack. */
function syntheticCompleteCuration(): CurrentCuration[] {
  return clone(CURATION).map(item => item.factStatus === 'reviewed' ? item : {
    ...item,
    fact: 'Synthetic completion gate fixture; no factual claim about this name.',
    factStatus: 'reviewed',
    factReferences: ['A', 'B'].map(label => ({
      url: `https://example.invalid/c05/test-${label.toLowerCase()}`,
      publisher: `Synthetic test publisher ${label}`, author: `Synthetic test author ${label}`,
      title: `Synthetic completion gate work ${label}`, workId: `synthetic-test:${label.toLowerCase()}`,
      quote: 'Synthetic reference fixture, not source verification.',
    })),
    factReview: { reviewer: 'C05 completion gate test', note: 'Synthetic metadata only; no factual source verification performed.' },
  });
}
function withoutFact(item: CurrentCuration): void {
  item.fact = null; item.factStatus = 'unverified'; item.factReferences = []; item.factReview = null;
}
function cli(args: string[], timezone = 'UTC') {
  return spawnSync(process.execPath, [CLI, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, TZ: timezone }, timeout: 20_000 });
}

test('completion gate accepts all 500 reviews and validates the production golden without changing candidate metrics', () => {
  const editorial = syntheticCompleteCuration();
  const sourceBefore = JSON.stringify(SOURCE);
  const editorialBefore = JSON.stringify(editorial);
  const candidate = buildReviewedCandidates(SOURCE, editorial);
  const complete = buildComplete(SOURCE, editorial);
  assert.equal(candidate.mode, 'current-candidates');
  assert.equal(candidate.complete, false);
  assert.equal(complete.mode, 'name-your-baby');
  assert.equal(complete.complete, true);
  assert.equal(complete.rows.length, 500);
  assert.deepEqual({ ...complete, mode: candidate.mode, complete: candidate.complete }, candidate);
  const ajv = new Ajv({ strict: true, allErrors: true });
  const schema = JSON.parse(readFileSync(join(ROOT, 'schemas/complete-pack.schema.json'), 'utf8')) as any;
  const valid = ajv.compile(schema);
  assert.equal(valid(complete), true, ajv.errorsText(valid.errors));
  assert.equal(valid(candidate), false);
  const goldenPath = join(ROOT, 'data/name-your-baby.json');
  if (CURATION.every(item => item.factStatus === 'reviewed' && item.fact !== null && item.recognitionVerified)) {
    const actual = buildComplete(SOURCE, CURATION);
    const goldenBytes = readFileSync(goldenPath, 'utf8');
    assert.equal(goldenBytes, serialiseComplete(actual));
    assert.equal(valid(JSON.parse(goldenBytes)), true, ajv.errorsText(valid.errors));
  } else {
    assert.equal(existsSync(goldenPath), false, 'incomplete production must not have a complete golden');
  }
  for (const damage of [
    (value: any) => { value.complete = false; },
    (value: any) => { value.rows[0].fact = null; },
    (value: any) => { value.rows[0].factStatus = 'unverified'; },
    (value: any) => { value.rows[0].factReview = null; },
    (value: any) => { value.rows[0].factReferences.splice(1); },
    (value: any) => { value.rows[0].recognitionVerified = false; value.rows[0].recognitionReview = null; },
  ]) {
    const changed = clone(complete); damage(changed); assert.equal(valid(changed), false);
  }
  complete.rows[0]!.factReferences[0]!.quote = 'changed output quotation';
  complete.rows[0]!.factReview.note = 'changed output fact review';
  complete.rows[0]!.recognitionReview.note = 'changed output recognition review';
  complete.rows[0]!.sparkline[0]!.count = 1;
  assert.equal(JSON.stringify(SOURCE), sourceBefore);
  assert.equal(JSON.stringify(editorial), editorialBefore);
});

test('final builder rejects incomplete facts, recognition, source fingerprints and independent-review failures', () => {
  const editorial = syntheticCompleteCuration();
  const incomplete = clone(editorial);
  for (const item of incomplete.slice(0, 125)) withoutFact(item);
  assert.equal(buildReviewedCandidates(SOURCE, incomplete).rows.filter(row => row.fact === null).length, 125);
  assert.throws(() => buildComplete(SOURCE, incomplete), /incomplete fact evidence/);
  const missingLast = clone(editorial); withoutFact(missingLast.at(-1)!);
  assert.throws(() => buildComplete(SOURCE, missingLast), /incomplete fact evidence/);
  const proposal = clone(editorial);
  proposal[0]!.factStatus = 'unverified'; proposal[0]!.factReview = null;
  assert.equal(buildReviewedCandidates(SOURCE, proposal).complete, false);
  assert.throws(() => buildComplete(SOURCE, proposal), /incomplete fact evidence/);
  const unrecognized = clone(editorial);
  unrecognized[0]!.recognitionVerified = false; unrecognized[0]!.recognitionReview = null;
  assert.equal(buildReviewedCandidates(SOURCE, unrecognized).complete, false);
  assert.throws(() => buildComplete(SOURCE, unrecognized), /incomplete recognition evidence/);
  const unrecognizedLast = clone(editorial);
  unrecognizedLast.at(-1)!.recognitionVerified = false; unrecognizedLast.at(-1)!.recognitionReview = null;
  assert.throws(() => buildComplete(SOURCE, unrecognizedLast), /incomplete recognition evidence/);
  const damages: ((item: CurrentCuration) => void)[] = [
    item => { item.factReview = null; },
    item => { item.factReview!.note = ''; },
    item => { item.factReferences.splice(1); },
    item => { item.factReferences[1]!.author = item.factReferences[0]!.author.toUpperCase().replace(/ /g, '  '); },
    item => { item.factReferences[1]!.workId = item.factReferences[0]!.workId.toUpperCase(); },
    item => { item.fact = 'x'.repeat(91); },
    item => { item.recognitionReview = null; },
    item => { item.recognitionReview!.note = ''; },
    item => { item.id = 'ssa:M:Easton'; },
  ];
  for (const damage of damages) {
    const changed = clone(editorial); damage(changed[0]!);
    assert.throws(() => buildComplete(SOURCE, changed));
  }
  assert.throws(() => buildComplete(SOURCE, editorial.slice(1)), /incomplete fact evidence/);
  assert.throws(() => buildComplete(SOURCE, [editorial[0]!, ...editorial.slice(0, -1)]), /duplicate curation/);
  const forged = clone(SOURCE); forged.annualCounts[0]!.count += 1;
  assert.throws(() => buildComplete(forged, editorial), /pinned fixture checksum/);
  const originalNow = Date.now; const originalRandom = Math.random;
  try {
    Date.now = () => { throw new Error('clock used'); }; Math.random = () => { throw new Error('randomness used'); };
    assert.equal(serialiseComplete(buildComplete(SOURCE, editorial)), serialiseComplete(buildComplete(SOURCE, editorial)));
  } finally { Date.now = originalNow; Math.random = originalRandom; }
});

test('complete CLI regenerates disposable outputs twice across timezones and leaves inputs unchanged', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-complete-synthetic-'));
  try {
    const source = join(folder, 'source.json'); const editorial = join(folder, 'synthetic-curation.json');
    const metadata = syntheticCompleteCuration();
    writeFileSync(source, readFileSync(SOURCE_PATH)); writeFileSync(editorial, JSON.stringify(metadata));
    const sourceBefore = readFileSync(source); const editorialBefore = readFileSync(editorial);
    const first = join(folder, 'first.json'); const second = join(folder, 'second.json');
    writeFileSync(first, 'old output will be replaced atomically\n');
    for (const [output, timezone] of [[first, 'UTC'], [second, 'Pacific/Honolulu']] as const) {
      const result = cli([source, editorial, output, '--complete'], timezone);
      assert.equal(result.status, 0, result.stderr); assert.equal(result.signal, null);
    }
    assert.deepEqual(readFileSync(first), readFileSync(second));
    assert.equal(readFileSync(first, 'utf8'), serialiseComplete(buildComplete(SOURCE, metadata)));
    assert.deepEqual(readFileSync(source), sourceBefore); assert.deepEqual(readFileSync(editorial), editorialBefore);
    assert.equal(readdirSync(folder).some(name => name.startsWith('.c05-complete-stage-')), false);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test('complete CLI failures preserve source, curation and sentinel bytes, reject aliases and publish no incomplete file', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-complete-reject-'));
  try {
    const source = join(folder, 'source.json'); const editorial = join(folder, 'synthetic-curation.json');
    const full = syntheticCompleteCuration();
    writeFileSync(source, readFileSync(SOURCE_PATH)); writeFileSync(editorial, JSON.stringify(full));
    const output = join(folder, 'sentinel.json'); writeFileSync(output, 'existing output survives\n');
    const protectedFiles = new Map([[source, readFileSync(source)], [editorial, readFileSync(editorial)], [output, readFileSync(output)]]);
    const aliases: string[] = []; const child = join(folder, 'child'); mkdirSync(child);
    for (const [path, name] of [[source, 'source'], [editorial, 'synthetic-curation']] as const) {
      const symbolic = join(folder, `${name}-symlink.json`); symlinkSync(path, symbolic);
      const hard = join(folder, `${name}-hardlink.json`); linkSync(path, hard);
      aliases.push(path, `${child}/../${name}.json`, symbolic, hard);
    }
    const incomplete = join(folder, 'incomplete.json'); const missing = clone(full); withoutFact(missing[0]!);
    writeFileSync(incomplete, JSON.stringify(missing));
    const noReview = join(folder, 'missing-review.json'); const damaged = clone(full); damaged[0]!.factReview = null;
    writeFileSync(noReview, JSON.stringify(damaged));
    const duplicate = join(folder, 'duplicate.json'); writeFileSync(duplicate, JSON.stringify([full[0]!, ...full.slice(0, -1)]));
    const forged = join(folder, 'forged.json'); const forgedSource = clone(SOURCE); forgedSource.annualCounts[0]!.count += 1;
    writeFileSync(forged, JSON.stringify(forgedSource));
    const broken = join(folder, 'broken.json'); writeFileSync(broken, '{');
    for (const path of [incomplete, noReview, duplicate, forged, broken]) protectedFiles.set(path, readFileSync(path));
    const absentOutput = join(folder, 'must-not-exist.json');
    const rejected = [
      [], [source, editorial, output], [source, editorial, output, '--reviewed-candidates'], [source, editorial, output, '--complete', '--extra'],
      ...aliases.map(alias => [source, editorial, alias, '--complete']),
      [source, editorial, child, '--complete'], [child, editorial, output, '--complete'], [source, child, output, '--complete'],
      [source, incomplete, output, '--complete'], [source, incomplete, absentOutput, '--complete'], [source, noReview, output, '--complete'],
      [source, duplicate, output, '--complete'], [forged, editorial, output, '--complete'], [broken, editorial, output, '--complete'],
      [source, broken, output, '--complete'], [source, editorial, join(folder, 'missing', 'output.json'), '--complete'],
      [join(folder, 'absent-source.json'), editorial, output, '--complete'], [source, join(folder, 'absent-curation.json'), output, '--complete'],
    ];
    for (const args of rejected) {
      const result = cli(args);
      assert.equal(result.status, 1, `unexpected result for ${JSON.stringify(args)}: ${result.stderr}`);
      assert.equal(result.signal, null);
      for (const [path, bytes] of protectedFiles) assert.deepEqual(readFileSync(path), bytes);
      assert.equal(existsSync(absentOutput), false);
      assert.equal(readdirSync(folder).some(name => name.startsWith('.c05-complete-stage-')), false);
    }
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
