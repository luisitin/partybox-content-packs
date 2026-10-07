import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { linkSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { Ajv } from 'ajv';
import { aggregateObservedPrimary, aggregateObservedReference, buildCurrent, parseCurrentFixture, serialiseCurrent, type CurrentCuration, type FactReference } from '../src/current.js';
import type { AnnualCount } from '../src/core.js';

const ROOT = process.cwd();
const SOURCE_PATH = join(ROOT, 'fixtures/current-source.json');
const FIXTURE = JSON.parse(readFileSync(SOURCE_PATH, 'utf8')) as any;
const SELECTION = JSON.parse(readFileSync(join(ROOT, 'fixtures/selection.json'), 'utf8')) as string[];
const CLI = fileURLToPath(new URL('../src/current-cli.js', import.meta.url));
const SEEDS = JSON.parse(readFileSync(join(ROOT, 'test/seeds.json'), 'utf8')) as { fixed: number[]; random: number[] };
const clone = <T>(value: T): T => structuredClone(value);
function random(seed: number): (bound: number) => number {
  let state = seed >>> 0;
  return bound => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) % bound;
  };
}
function sparse(next: (bound: number) => number): AnnualCount[] {
  const result: AnnualCount[] = [];
  const used = new Set<string>();
  for (let i = 0, length = 1 + next(18); i < length; i += 1) {
    const name = ['Ada', 'Thomas', 'Ivy'][next(3)]!;
    const sex = next(2) === 0 ? 'F' : 'M';
    const year = 1880 + next(146);
    const key = `${year}:${sex}:${name}`;
    if (used.has(key)) continue;
    used.add(key);
    result.push({ year, sex, name, count: 5 + next(100_000) });
  }
  return result;
}
function proposed(): CurrentCuration {
  return { id: 'ssa:M:Thomas', fact: null, factStatus: 'unverified', factReferences: [], factReview: null, recognitionVerified: false, recognitionReview: null };
}
function refs(): FactReference[] {
  return [
    { url: 'https://example.org/first', publisher: 'First publisher', author: 'First author', title: 'First work', workId: 'work:first', quote: 'A source quotation retained for review.' },
    { url: 'https://example.org/second', publisher: 'Second publisher', author: 'Second author', title: 'Second work', workId: 'work:second', quote: 'A second source quotation retained for review.' },
  ];
}
function withCuration(metadata: CurrentCuration): any { return { ...FIXTURE, curation: [metadata] }; }
function cli(args: string[], timezone = 'UTC') {
  return spawnSync(process.execPath, [CLI, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, TZ: timezone }, timeout: 20_000 });
}

test('official snapshot produces exactly 500 incomplete candidates with observed partial decades', () => {
  const pack = buildCurrent(FIXTURE);
  assert.equal(pack.mode, 'current-candidates');
  assert.equal(pack.complete, false);
  assert.equal(pack.currentMetricsVerified, true);
  assert.equal(pack.rows.length, 500);
  assert.equal(new Set(pack.rows.map(row => row.name)).size, 500);
  assert.equal(pack.rows.filter(row => row.sex === 'M').length, 214);
  assert.equal(pack.rows.filter(row => row.sex === 'F').length, 286);
  assert.equal(pack.rows.reduce((sum, row) => sum + row.totalPublishedCount, 0), 151_696_279);
  assert.deepEqual(pack.rows.map(row => row.id), SELECTION);
  const identities = new Set(pack.rows.map(row => row.id));
  for (const id of ['ssa:M:Micheal', 'ssa:M:Jaxon', 'ssa:F:Makayla', 'ssa:F:Nevaeh', 'ssa:M:Johnathan', 'ssa:M:Jace', 'ssa:M:Ayden', 'ssa:F:Geneva', 'ssa:M:Kaleb', 'ssa:F:Lula', 'ssa:M:Collin', 'ssa:M:Erick', 'ssa:M:Easton']) assert.equal(identities.has(id), false);
  for (const id of ['ssa:F:Ariel', 'ssa:F:Bianca', 'ssa:F:Elise', 'ssa:F:Eliza', 'ssa:F:Tabitha', 'ssa:F:Meredith', 'ssa:M:Emmett', 'ssa:M:Malcolm', 'ssa:M:Kirk', 'ssa:M:Otis', 'ssa:M:Homer', 'ssa:M:Rudolph', 'ssa:M:Pablo']) assert.equal(identities.has(id), true);
  assert.equal(pack.rows[0]!.name, 'Thomas');
  assert.equal(pack.rows[0]!.peakDecade, 1950);
  assert.equal(pack.rows[0]!.peakCount, 454_385);
  assert.equal(pack.rows.at(-1)!.name, 'Pablo');
  assert.equal(pack.rows.at(-1)!.totalPublishedCount, 50_370);
  assert.deepEqual(pack.rows.filter(row => row.peakDecade === 2020).map(row => [row.name, row.peakCount, row.runnerUpCount]), [
    ['Theodore', 65_579, 40_530], ['Mateo', 62_272, 50_604], ['Ezra', 47_728, 38_650], ['Luna', 46_161, 34_179], ['Ivy', 28_572, 23_492],
  ]);
  for (const row of pack.rows) {
    assert.equal(row.sparkline.length, 15);
    assert.equal(row.fact, null);
    assert.equal(row.factStatus, 'unverified');
    assert.equal(row.recognitionVerified, false);
    assert.deepEqual(row.factReferences, []);
    assert.equal(row.factReview, null);
    assert.equal(row.recognitionReview, null);
    assert.ok(BigInt(row.peakCount) * 100n >= BigInt(row.runnerUpCount) * 115n);
    assert.equal(row.totalPublishedCount, row.sparkline.reduce((sum, cell) => sum + cell.count, 0));
    for (const cell of row.sparkline) {
      assert.equal(cell.observedYearCount, cell.decade === 2020 ? 6 : 10);
      assert.equal(cell.unobservedYearCount, cell.decade === 2020 ? 4 : 0);
      assert.equal(cell.publishedYearCount + cell.missingPublishedYearCount, cell.observedYearCount);
    }
  }
  assert.equal(serialiseCurrent(pack), readFileSync(join(ROOT, 'data/current-candidates.json'), 'utf8'));
});

test('10,000 current sparse differentials preserve independent observed-year accounting', () => {
  const next = random(0xc052025);
  for (let i = 0; i < 10_000; i += 1) {
    const records = sparse(next);
    const before = JSON.stringify(records);
    assert.deepEqual(aggregateObservedPrimary(records), aggregateObservedReference(records), `current differential ${i}`);
    assert.equal(JSON.stringify(records), before);
  }
});

test('1,003 saved seeds independently prove sparse published and future coverage properties', () => {
  for (const seed of [...SEEDS.fixed, ...SEEDS.random]) {
    const records = sparse(random(seed));
    for (const row of aggregateObservedPrimary(records)) {
      for (const cell of row.series) {
        const source = records.filter(record => record.name === row.name && record.sex === row.sex && record.year >= cell.decade && record.year < cell.decade + 10);
        assert.equal(cell.count, source.reduce((sum, record) => sum + record.count, 0), `sum seed ${seed}`);
        assert.equal(cell.publishedYearCount, source.length, `coverage seed ${seed}`);
        assert.equal(cell.missingPublishedYearCount, (cell.decade === 2020 ? 6 : 10) - source.length);
        assert.equal(cell.unobservedYearCount, cell.decade === 2020 ? 4 : 0);
      }
    }
  }
});

test('partial peaks use observed sums without projection and unpublished years remain unknown', () => {
  const records: AnnualCount[] = [
    { year: 2010, sex: 'F', name: 'Ada', count: 100 },
    { year: 2011, sex: 'F', name: 'Ada', count: 100 },
    { year: 2020, sex: 'F', name: 'Ada', count: 150 },
    { year: 2025, sex: 'F', name: 'Ada', count: 100 },
  ];
  const row = aggregateObservedPrimary(records)[0]!;
  assert.equal(row.peakDecade, 2020);
  assert.equal(row.peakCount, 250);
  assert.equal(row.runnerUpCount, 200);
  assert.deepEqual(row.series.at(-1), { decade: 2020, count: 250, publishedYearCount: 2, observedYearCount: 6, missingPublishedYearCount: 4, unobservedYearCount: 4 });
  assert.deepEqual(row.series[0], { decade: 1880, count: 0, publishedYearCount: 0, observedYearCount: 10, missingPublishedYearCount: 10, unobservedYearCount: 0 });
  for (const year of [1879, 2026, 2029]) assert.throws(() => aggregateObservedPrimary([{ year, sex: 'F', name: 'Ada', count: 5 }]), /year/);
  assert.throws(() => aggregateObservedReference([{ year: 2026, sex: 'F', name: 'Ada', count: 5 }]), /year/);
  assert.throws(() => aggregateObservedPrimary([{ year: 2020, sex: 'F', name: 'Ada', count: 4 }]), /count/);
  assert.throws(() => aggregateObservedPrimary([records[0]!, records[0]!]), /duplicate/);
});

test('current parser rejects provenance, shape, ordering and identity corruption without modifying input', () => {
  const before = JSON.stringify(FIXTURE);
  const mutations: ((value: any) => void)[] = [
    value => { value.source.sha256 = '0'.repeat(64); },
    value => { value.source.coverageEndYear = 2026; },
    value => { value.source.license = 'MIT'; },
    value => { value.source.datasetIdentifier = 'other'; },
    value => { value.source.extra = true; },
    value => { value.analysis.endYear = 2019; },
    value => { value.analysis.gridEndYear = 2025; },
    value => { value.annualCounts.pop(); },
    value => { value.annualCounts[0].year = 2026; },
    value => { value.annualCounts[0].count = 4; },
    value => { value.annualCounts[0].count = Number.MAX_SAFE_INTEGER + 1; },
    value => { value.annualCounts[0].name = 'A'; },
    value => { value.annualCounts[0].extra = true; },
    value => { value.annualCounts[1] = clone(value.annualCounts[0]); },
    value => { [value.annualCounts[0], value.annualCounts[1]] = [value.annualCounts[1], value.annualCounts[0]]; },
    value => { delete value.curation; },
    value => { value.curation = [{ ...proposed(), id: 'ssa:F:Neverselected' }]; },
  ];
  for (const mutate of mutations) {
    const damaged = clone(FIXTURE);
    mutate(damaged);
    assert.throws(() => parseCurrentFixture(damaged));
  }
  const parsed = parseCurrentFixture(FIXTURE);
  parsed.annualCounts[0]!.count = 999;
  parsed.source.license = 'changed';
  assert.equal(JSON.stringify(FIXTURE), before);
});

test('explicit editorial evidence is carried without inferring verification or final completion', () => {
  const metadata = proposed();
  metadata.fact = 'An editorial proposal retained for later human verification.';
  metadata.factReferences = refs();
  let pack = buildCurrent(withCuration(metadata));
  assert.equal(pack.rows[0]!.factStatus, 'unverified');
  assert.equal(pack.complete, false);
  metadata.factStatus = 'reviewed';
  metadata.factReview = { reviewer: 'test curator', note: 'Synthetic metadata gate fixture, not a verified production fact.' };
  metadata.recognitionVerified = true;
  metadata.recognitionReview = { reviewer: 'test curator', note: 'Synthetic recognition review gate fixture.' };
  pack = buildCurrent(withCuration(metadata));
  assert.equal(pack.rows[0]!.factStatus, 'reviewed');
  assert.equal(pack.rows[0]!.recognitionVerified, true);
  assert.equal(pack.complete, false);
  pack.rows[0]!.factReferences[0]!.quote = 'changed output';
  pack.rows[0]!.factReview!.note = 'changed output';
  assert.equal(metadata.factReferences[0]!.quote, 'A source quotation retained for review.');
  assert.equal(metadata.factReview.note, 'Synthetic metadata gate fixture, not a verified production fact.');
  const damages: ((item: CurrentCuration) => void)[] = [
    item => { item.factReview = null; },
    item => { item.factReferences[1]!.author = 'FIRST AUTHOR'; },
    item => { item.factReferences[1]!.workId = 'WORK:FIRST'; },
    item => { item.factReferences.pop(); },
    item => { item.factReferences[0]!.url = 'http://example.org'; },
    item => { item.factReferences[0]!.url = 'https://user:password@example.org'; },
    item => { item.factReferences[0]!.quote = ''; },
    item => { item.fact = 'x'.repeat(91); },
    item => { item.fact = ' Leading space'; },
    item => { item.fact = 'First\nSecond'; },
    item => { item.recognitionReview = null; },
    item => { item.fact = null; },
  ];
  for (const damage of damages) {
    const item = clone(metadata);
    damage(item);
    assert.throws(() => parseCurrentFixture(withCuration(item)));
  }
  const unicode = proposed();
  unicode.fact = '😀'.repeat(90);
  assert.equal(parseCurrentFixture(withCuration(unicode)).curation[0]!.fact, unicode.fact);
  const duplicate = { ...FIXTURE, curation: [proposed(), proposed()] };
  assert.throws(() => parseCurrentFixture(duplicate), /duplicate curation/);
});

test('strict current schemas validate source and pack and reject inconsistent coverage and review gates', () => {
  const ajv = new Ajv({ strict: true, allErrors: true });
  const sourceValid = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/current-source.schema.json'), 'utf8')));
  const selectionValid = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/selection.schema.json'), 'utf8')));
  const packValid = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/current-pack.schema.json'), 'utf8')));
  const pack = buildCurrent(FIXTURE);
  assert.equal(sourceValid(FIXTURE), true, ajv.errorsText(sourceValid.errors));
  assert.equal(selectionValid(SELECTION), true, ajv.errorsText(selectionValid.errors));
  const damagedSelections: unknown[] = [SELECTION.slice(1), [...SELECTION, SELECTION[0]], { ids: SELECTION }];
  for (const changed of ['ssa:M:Never-selected', 'ssa:X:Thomas', 'ssa:M:A', 'ssa:M:' + 'A'.repeat(16), SELECTION[1]]) {
    const damaged = clone(SELECTION);
    damaged[0] = changed!;
    damagedSelections.push(damaged);
  }
  for (const damaged of damagedSelections) assert.equal(selectionValid(damaged), false);
  assert.equal(packValid(pack), true, ajv.errorsText(packValid.errors));
  const damages: ((value: any) => void)[] = [
    value => { value.complete = true; },
    value => { value.rows[0].sparkline[14].unobservedYearCount = 0; },
    value => { value.rows[0].sparkline[14].missingPublishedYearCount = 4; },
    value => { value.rows[0].sparkline[14].observedYearCount = 10; },
    value => { value.rows[0].sparkline[0].decade = 1890; },
    value => { value.rows[0].factStatus = 'reviewed'; },
    value => { value.rows[0].recognitionVerified = true; },
    value => { value.rows[0].extra = true; },
    value => { value.rows.pop(); },
  ];
  for (const damage of damages) {
    const damaged = clone(pack);
    damage(damaged);
    assert.equal(packValid(damaged), false);
  }
  const damagedSource = clone(FIXTURE);
  damagedSource.annualCounts[0].year = 2026;
  assert.equal(sourceValid(damagedSource), false);
  const proposal = proposed();
  proposal.fact = '😀'.repeat(90);
  assert.equal(sourceValid(withCuration(proposal)), true, ajv.errorsText(sourceValid.errors));
});

test('current pure builder and aggregation do not depend on system clocks or randomness', () => {
  const originalRandom = Math.random;
  const originalNow = Date.now;
  try {
    Math.random = () => { throw new Error('randomness used'); };
    Date.now = () => { throw new Error('clock used'); };
    const first = serialiseCurrent(buildCurrent(FIXTURE));
    assert.equal(serialiseCurrent(buildCurrent(FIXTURE)), first);
    aggregateObservedPrimary([{ year: 2025, sex: 'F', name: 'Ada', count: 5 }]);
    aggregateObservedReference([{ year: 2025, sex: 'F', name: 'Ada', count: 5 }]);
  } finally { Math.random = originalRandom; Date.now = originalNow; }
});

test('current CLI regenerates identical bytes twice across timezones and protects source/output aliases', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-current-cli-'));
  try {
    const first = join(folder, 'first.json');
    const second = join(folder, 'second.json');
    for (const [output, timezone] of [[first, 'UTC'], [second, 'Pacific/Honolulu']] as const) {
      const result = cli([SOURCE_PATH, output, '--current-candidates'], timezone);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.signal, null);
    }
    assert.equal(readFileSync(first, 'utf8'), readFileSync(second, 'utf8'));
    assert.equal(readFileSync(first, 'utf8'), readFileSync(join(ROOT, 'data/current-candidates.json'), 'utf8'));
    const inputCopy = join(folder, 'source.json');
    writeFileSync(inputCopy, readFileSync(SOURCE_PATH));
    const symlink = join(folder, 'symlink.json');
    const hardlink = join(folder, 'hardlink.json');
    symlinkSync(inputCopy, symlink);
    linkSync(inputCopy, hardlink);
    const directory = join(folder, 'directory');
    mkdirSync(directory);
    const invalid = join(folder, 'invalid.json');
    writeFileSync(invalid, '{');
    const changedMetrics = join(folder, 'changed-metrics.json');
    const changed = clone(FIXTURE);
    changed.annualCounts[0].count += 1;
    writeFileSync(changedMetrics, JSON.stringify(changed));
    const beforeSource = readFileSync(inputCopy);
    const beforeOutput = readFileSync(first);
    const rejected = [
      [], [inputCopy, first], [inputCopy, first, '--sample'], [inputCopy, first, '--current-candidates', '--extra'],
      [inputCopy, inputCopy, '--current-candidates'], [inputCopy, symlink, '--current-candidates'], [inputCopy, hardlink, '--current-candidates'],
      [inputCopy, directory, '--current-candidates'], [directory, first, '--current-candidates'], [invalid, first, '--current-candidates'],
      [changedMetrics, first, '--current-candidates'],
      [inputCopy, join(folder, 'missing', 'output.json'), '--current-candidates'], [join(folder, 'absent.json'), first, '--current-candidates'],
    ];
    for (const args of rejected) {
      const result = cli(args);
      assert.equal(result.status, 1, `unexpected result for ${JSON.stringify(args)}: ${result.stderr}`);
      assert.equal(result.signal, null);
    }
    assert.deepEqual(readFileSync(inputCopy), beforeSource);
    assert.deepEqual(readFileSync(first), beforeOutput);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
