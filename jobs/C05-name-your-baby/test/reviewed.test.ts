import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { linkSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { Ajv } from 'ajv';
import { buildReviewedCandidates } from '../src/reviewed-cli.js';
import { serialiseCurrent, type CurrentCuration, type CurrentFixture, type CurrentPack, type CurrentRow } from '../src/current.js';

const ROOT = process.cwd();
const SOURCE_PATH = join(ROOT, 'fixtures/current-source.json');
const CURATION_PATH = join(ROOT, 'fixtures/curation.json');
const OUTPUT_PATH = join(ROOT, 'data/current-reviewed-candidates.json');
const SOURCE = JSON.parse(readFileSync(SOURCE_PATH, 'utf8')) as CurrentFixture;
const CURATION = JSON.parse(readFileSync(CURATION_PATH, 'utf8')) as CurrentCuration[];
const CLI = fileURLToPath(new URL('../src/reviewed-cli.js', import.meta.url));
const clone = <T>(value: T): T => structuredClone(value);
function cli(args: string[], timezone = 'UTC') {
  return spawnSync(process.execPath, [CLI, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, TZ: timezone }, timeout: 20_000 });
}
function metrics(row: CurrentRow): unknown {
  return { id: row.id, name: row.name, sex: row.sex, totalPublishedCount: row.totalPublishedCount, peakDecade: row.peakDecade, peakCount: row.peakCount, runnerUpCount: row.runnerUpCount, sparkline: row.sparkline };
}

test('actual editorial evidence validates with the reused schema and preserves review gates and deep copies', () => {
  const sourceBefore = JSON.stringify(SOURCE);
  const curationBefore = JSON.stringify(CURATION);
  const sourceSchema = JSON.parse(readFileSync(join(ROOT, 'schemas/current-source.schema.json'), 'utf8')) as any;
  const schema = JSON.parse(readFileSync(join(ROOT, 'schemas/curation.schema.json'), 'utf8')) as any;
  const { $schema: _dialect, $id: _identifier, definitions: schemaDefinitions, ...curationShape } = schema;
  assert.deepEqual(curationShape, { ...sourceSchema.properties.curation, minItems: 1 });
  assert.deepEqual(schemaDefinitions, sourceSchema.definitions);
  const ajv = new Ajv({ strict: true, allErrors: true });
  const valid = ajv.compile(schema);
  assert.equal(valid(CURATION), true, ajv.errorsText(valid.errors));
  assert.equal(valid([]), false);
  assert.equal(valid({ curation: CURATION }), false);
  const pack = buildReviewedCandidates(SOURCE, CURATION);
  assert.equal(CURATION.length, 500);
  assert.equal(new Set(CURATION.map(item => item.id)).size, 500);
  assert.equal(CURATION.filter(item => item.factStatus === 'reviewed').length, 375);
  for (const item of CURATION) {
    if (item.factStatus === 'reviewed') {
      assert.ok(item.fact !== null && [...item.fact].length <= 90);
      assert.ok(item.factReview !== null);
      assert.ok(item.factReferences.length >= 2);
    } else {
      assert.equal(item.fact, null);
      assert.equal(item.factReview, null);
      assert.deepEqual(item.factReferences, []);
    }
    assert.equal(item.recognitionVerified, true);
    assert.ok(item.recognitionReview !== null);
  }
  const first = CURATION[0]!;
  const carried = pack.rows.find(row => row.id === first.id)!;
  assert.deepEqual(carried.factReferences, first.factReferences);
  assert.deepEqual(carried.factReview, first.factReview);
  carried.factReferences[0]!.quote = 'changed output quotation';
  carried.factReview!.note = 'changed output note';
  carried.sparkline[0]!.count = 1;
  pack.source.license = 'changed output license';
  assert.equal(JSON.stringify(SOURCE), sourceBefore);
  assert.equal(JSON.stringify(CURATION), curationBefore);
  const damages: ((item: CurrentCuration) => void)[] = [
    item => { item.factReview = null; },
    item => { item.factReferences[1]!.author = item.factReferences[0]!.author.toUpperCase(); },
    item => { item.factReferences[1]!.workId = item.factReferences[0]!.workId.toUpperCase(); },
    item => { item.factReferences.splice(1); },
    item => { item.fact = 'x'.repeat(91); },
    item => { item.fact = null; },
    item => { item.factReferences[0]!.url = 'https://user:password@example.org'; },
    item => { item.recognitionReview = null; },
    item => { item.id = 'ssa:F:Neverselected'; },
  ];
  for (const damage of damages) {
    const damaged = clone(first);
    damage(damaged);
    assert.throws(() => buildReviewedCandidates(SOURCE, [damaged]));
  }
  assert.throws(() => buildReviewedCandidates(SOURCE, [first, first]), /duplicate curation/);
  assert.throws(() => buildReviewedCandidates(SOURCE, []), /nonempty/);
  assert.throws(() => buildReviewedCandidates({ ...SOURCE, curation: [first] }, CURATION), /empty curation/);
});

test('editorial candidates preserve all 500 numeric rows and leave outstanding facts and recognition explicit', () => {
  const pack = buildReviewedCandidates(SOURCE, CURATION);
  const baseline = JSON.parse(readFileSync(join(ROOT, 'data/current-candidates.json'), 'utf8')) as CurrentPack;
  const ajv = new Ajv({ strict: true, allErrors: true });
  const valid = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/current-pack.schema.json'), 'utf8')));
  assert.equal(valid(pack), true, ajv.errorsText(valid.errors));
  assert.equal(pack.mode, 'current-candidates');
  assert.equal(pack.complete, false);
  assert.equal(pack.currentMetricsVerified, true);
  assert.equal(pack.rows.length, 500);
  assert.deepEqual(pack.source, baseline.source);
  assert.deepEqual(pack.analysis, baseline.analysis);
  assert.deepEqual(pack.rows.map(metrics), baseline.rows.map(metrics));
  assert.equal(pack.rows.filter(row => row.factStatus === 'reviewed').length, 375);
  assert.equal(pack.rows.filter(row => row.factStatus === 'unverified').length, 125);
  assert.equal(pack.rows.filter(row => row.recognitionVerified).length, 500);
  const editorial = new Map(CURATION.map(item => [item.id, item]));
  for (const row of pack.rows) {
    const item = editorial.get(row.id);
    if (item !== undefined) {
      assert.equal(row.recognitionVerified, true);
      assert.deepEqual(row.recognitionReview, item.recognitionReview);
      assert.equal(row.fact, item.fact);
      assert.deepEqual(row.factReferences, item.factReferences);
      assert.deepEqual(row.factReview, item.factReview);
    } else {
      assert.equal(row.recognitionVerified, false);
      assert.equal(row.recognitionReview, null);
      assert.equal(row.fact, null);
      assert.equal(row.factStatus, 'unverified');
      assert.deepEqual(row.factReferences, []);
      assert.equal(row.factReview, null);
    }
  }
  assert.equal(serialiseCurrent(pack), readFileSync(OUTPUT_PATH, 'utf8'));
});

test('reviewed CLI regenerates identical committed bytes twice across timezones', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-reviewed-regenerate-'));
  try {
    const first = join(folder, 'first.json');
    const second = join(folder, 'second.json');
    for (const [output, timezone] of [[first, 'UTC'], [second, 'Pacific/Honolulu']] as const) {
      const result = cli([SOURCE_PATH, CURATION_PATH, output, '--reviewed-candidates'], timezone);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.signal, null);
    }
    assert.deepEqual(readFileSync(first), readFileSync(second));
    assert.deepEqual(readFileSync(first), readFileSync(OUTPUT_PATH));
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test('reviewed CLI rejects forged metrics, malformed curation and aliases of both inputs without writing', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-reviewed-reject-'));
  try {
    const source = join(folder, 'source.json');
    const editorial = join(folder, 'curation.json');
    const output = join(folder, 'sentinel.json');
    writeFileSync(source, readFileSync(SOURCE_PATH));
    writeFileSync(editorial, readFileSync(CURATION_PATH));
    writeFileSync(output, 'existing output must survive rejected invocations\n');
    const aliases: string[] = [];
    for (const [path, prefix] of [[source, 'source'], [editorial, 'curation']] as const) {
      const symbolic = join(folder, `${prefix}-symlink.json`);
      const hard = join(folder, `${prefix}-hardlink.json`);
      symlinkSync(path, symbolic);
      linkSync(path, hard);
      aliases.push(path, symbolic, hard);
    }
    const directory = join(folder, 'directory');
    mkdirSync(directory);
    const brokenJSON = join(folder, 'broken.json');
    writeFileSync(brokenJSON, '{');
    const wrongShape = join(folder, 'wrong-shape.json');
    writeFileSync(wrongShape, JSON.stringify({ curation: CURATION }));
    const empty = join(folder, 'empty.json');
    writeFileSync(empty, '[]\n');
    const badReview = join(folder, 'bad-review.json');
    writeFileSync(badReview, JSON.stringify([{ ...CURATION[0]!, factReview: null }]));
    const forged = join(folder, 'forged-source.json');
    const changed = clone(SOURCE);
    changed.annualCounts[0]!.count += 1;
    writeFileSync(forged, JSON.stringify(changed));
    const populatedBase = join(folder, 'populated-base.json');
    writeFileSync(populatedBase, JSON.stringify({ ...SOURCE, curation: [CURATION[0]!] }));
    const beforeSource = readFileSync(source);
    const beforeEditorial = readFileSync(editorial);
    const beforeOutput = readFileSync(output);
    const rejected = [
      [], [source, editorial, output], [source, editorial, output, '--current-candidates'], [source, editorial, output, '--sample'],
      [source, editorial, output, '--reviewed-candidates', '--extra'],
      [source, editorial, '', '--reviewed-candidates'],
      ...aliases.map(alias => [source, editorial, alias, '--reviewed-candidates']),
      [source, editorial, directory, '--reviewed-candidates'], [directory, editorial, output, '--reviewed-candidates'],
      [source, directory, output, '--reviewed-candidates'], [brokenJSON, editorial, output, '--reviewed-candidates'],
      [source, brokenJSON, output, '--reviewed-candidates'], [source, wrongShape, output, '--reviewed-candidates'],
      [source, empty, output, '--reviewed-candidates'], [source, badReview, output, '--reviewed-candidates'],
      [forged, editorial, output, '--reviewed-candidates'], [populatedBase, editorial, output, '--reviewed-candidates'],
      [source, editorial, join(folder, 'missing', 'output.json'), '--reviewed-candidates'],
      [join(folder, 'absent-source.json'), editorial, output, '--reviewed-candidates'],
      [source, join(folder, 'absent-curation.json'), output, '--reviewed-candidates'],
    ];
    for (const args of rejected) {
      const result = cli(args);
      assert.equal(result.status, 1, `unexpected result for ${JSON.stringify(args)}: ${result.stderr}`);
      assert.equal(result.signal, null);
      assert.deepEqual(readFileSync(source), beforeSource);
      assert.deepEqual(readFileSync(editorial), beforeEditorial);
      assert.deepEqual(readFileSync(output), beforeOutput);
    }
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
