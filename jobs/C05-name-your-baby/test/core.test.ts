import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, symlinkSync, linkSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { Ajv } from 'ajv';
import {
  aggregatePrimary, aggregateReference, selectPrimary, selectReference,
  parseFixture, buildSample, serialise,
  type AnnualCount, type NameAggregate, type Window, type Sex,
} from '../src/core.js';

const ROOT = process.cwd();
const fixturePath = join(ROOT, 'fixtures/source.json');
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as unknown;
const fixtureBytes = readFileSync(fixturePath);
const CLI = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const savedSeeds = JSON.parse(readFileSync(join(ROOT, 'test/seeds.json'), 'utf8')) as {
  algorithm: string; fixed: number[]; random: number[];
};
const WINDOW: Window = { startYear: 1880, endYear: 1899 };
const clone = <T>(value: T): T => structuredClone(value);
const ascii = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

function random(seed: number): (bound: number) => number {
  let state = seed >>> 0;
  return (bound: number) => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) % bound;
  };
}

function shuffled<T>(values: readonly T[], next: (bound: number) => number): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = next(i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

function nameAt(index: number): string {
  return `Name${String.fromCharCode(65 + Math.floor(index / 26))}${String.fromCharCode(65 + index % 26)}`;
}

function aggregateCase(next: (bound: number) => number): { records: AnnualCount[]; window: Window } {
  const startYear = 1880 + next(50) * 10;
  const decades = 2 + next(4);
  const window = { startYear, endYear: startYear + decades * 10 - 1 };
  const records: AnnualCount[] = [];
  const groups = 1 + next(6);
  for (let group = 0; group < groups; group++) {
    const name = nameAt(group >>> 1);
    const sex: Sex = group % 2 ? 'M' : 'F';
    for (let year = startYear; year <= window.endYear; year++) {
      if (next(4) !== 0) records.push({ year, name, sex, count: 5 + next(100_000) });
    }
  }
  if (!records.length) records.push({ year: startYear, name: 'Ada', sex: 'F', count: 5 });
  return { records: shuffled(records, next), window };
}

function madeAggregate(name: string, sex: Sex, counts: readonly number[]): NameAggregate {
  const peakCount = Math.max(...counts);
  const ordered = [...counts].sort((a, b) => b - a);
  return {
    name, sex,
    totalPublishedCount: counts.reduce((sum, count) => sum + count, 0),
    peakDecade: 1880 + counts.indexOf(peakCount) * 10,
    peakCount, runnerUpCount: ordered[1]!,
    series: counts.map((count, index) => ({
      decade: 1880 + index * 10, count,
      publishedYearCount: count ? 1 : 0,
      omittedYearCount: count ? 9 : 10,
    })),
  };
}

function selectionCase(next: (bound: number) => number): NameAggregate[] {
  return shuffled(Array.from({ length: 1 + next(20) }, (_, group) => {
    const counts = Array.from({ length: 2 + next(5) }, () => {
      const style = next(8);
      return style === 0 ? 0 : style === 1 ? 5 + next(100) : 5 + next(300_000);
    });
    return madeAggregate(nameAt(group >>> 1), group % 2 ? 'M' : 'F', counts);
  }), next);
}

function expectedSelection(input: readonly NameAggregate[], limit: number): NameAggregate[] {
  const candidates = input.filter(row => row.totalPublishedCount >= 50_000 &&
    BigInt(row.peakCount) * 100n >= BigInt(row.runnerUpCount) * 115n);
  candidates.sort((a, b) => b.totalPublishedCount - a.totalPublishedCount || ascii(a.name, b.name) || ascii(a.sex, b.sex));
  const result: NameAggregate[] = [];
  const used = new Set<string>();
  for (const candidate of candidates) {
    if (used.has(candidate.name)) continue;
    used.add(candidate.name);
    result.push(clone(candidate));
    if (result.length === limit) break;
  }
  return result;
}

function cli(args: string[], timezone = 'UTC') {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT, encoding: 'utf8', env: { ...process.env, TZ: timezone }, timeout: 10_000,
  });
}

function fixtureMutated(change: (input: any) => void): unknown {
  const value = clone(fixture);
  change(value);
  return value;
}

test('saved property seeds are schema-valid, unique crypto-generated uint32 values', () => {
  const ajv = new Ajv({ strict: true, allErrors: true });
  const valid = ajv.compile({
    type: 'object', additionalProperties: false, required: ['algorithm', 'fixed', 'random'],
    properties: {
      algorithm: { const: 'mulberry32' },
      fixed: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'integer', minimum: 1, maximum: 3 }, uniqueItems: true },
      random: { type: 'array', minItems: 1000, maxItems: 1000, items: { type: 'integer', minimum: 0, maximum: 4_294_967_295 }, uniqueItems: true },
    },
  });
  assert.equal(valid(savedSeeds), true, ajv.errorsText(valid.errors));
  assert.deepEqual(savedSeeds.fixed, [1, 2, 3]);
  assert.equal(new Set([...savedSeeds.fixed, ...savedSeeds.random]).size, 1003);
  assert.equal(valid({ ...savedSeeds, random: savedSeeds.random.slice(1) }), false);
  assert.equal(valid({ ...savedSeeds, random: Array(1000).fill(1) }), false);
});

test('10,000 independently implemented aggregation differential cases preserve sparse evidence', () => {
  const next = random(0x0c050501);
  for (let caseIndex = 0; caseIndex < 10_000; caseIndex++) {
    const { records, window } = aggregateCase(next);
    const before = JSON.stringify(records);
    const primary = aggregatePrimary(records, window);
    assert.deepEqual(primary, aggregateReference(records, window), `aggregation case ${caseIndex}`);
    assert.equal(JSON.stringify(records), before, `input changed in case ${caseIndex}`);
    for (const row of primary) {
      const source = records.filter(record => record.name === row.name && record.sex === row.sex);
      assert.equal(row.totalPublishedCount, source.reduce((sum, record) => sum + record.count, 0));
      assert.equal(row.series.reduce((sum, cell) => sum + cell.publishedYearCount, 0), source.length);
      assert.ok(row.series.every(cell => cell.publishedYearCount + cell.omittedYearCount === 10));
    }
  }
});

test('10,000 independent selectors agree with exact threshold, ordering and name-dedup oracle', () => {
  const next = random(0x0c050502);
  for (let caseIndex = 0; caseIndex < 10_000; caseIndex++) {
    const input = selectionCase(next);
    const limit = 1 + next(500);
    const before = JSON.stringify(input);
    const primary = selectPrimary(input, limit);
    assert.deepEqual(primary, selectReference(input, limit), `selection case ${caseIndex}`);
    assert.deepEqual(primary, expectedSelection(input, limit), `selection oracle case ${caseIndex}`);
    assert.equal(JSON.stringify(input), before);
    assert.equal(new Set(primary.map(row => row.name)).size, primary.length);
  }
});

test('properties run six rounds for fixed 1,2,3 plus 1,000 stored random seeds', () => {
  for (const seed of [...savedSeeds.fixed, ...savedSeeds.random]) {
    const next = random(seed);
    for (let round = 0; round < 6; round++) {
      const { records, window } = aggregateCase(next);
      const baseline = aggregatePrimary(records, window);
      assert.deepEqual(aggregatePrimary(shuffled(records, next), window), baseline, `shuffle seed ${seed}/${round}`);
      assert.deepEqual(aggregateReference(records, window), baseline);
      const scaled = aggregatePrimary(records.map(row => ({ ...row, count: row.count * 2 })), window);
      assert.deepEqual(scaled, baseline.map(row => ({
        ...row, totalPublishedCount: row.totalPublishedCount * 2,
        peakCount: row.peakCount * 2, runnerUpCount: row.runnerUpCount * 2,
        series: row.series.map(cell => ({ ...cell, count: cell.count * 2 })),
      })), `scaling seed ${seed}/${round}`);
      const candidates = selectionCase(next);
      const selected = selectPrimary(candidates, 500);
      assert.deepEqual(selectReference(shuffled(candidates, next), 500), selected);
      assert.deepEqual(selectPrimary(candidates, 1), selected.slice(0, 1));
      assert.deepEqual(selectPrimary(candidates, 2), selected.slice(0, 2));
      assert.deepEqual(selectPrimary(candidates, 500), expectedSelection(candidates, 500));
    }
  }
});

test('known sparse published sums track omission, separate sex categories, and earliest peak ties', () => {
  const records: AnnualCount[] = [
    { year: 1880, name: 'Ada', sex: 'F', count: 5 },
    { year: 1881, name: 'Ada', sex: 'F', count: 10 },
    { year: 1890, name: 'Ada', sex: 'F', count: 15 },
    { year: 1909, name: 'Ada', sex: 'F', count: 20 },
    { year: 1880, name: 'Ada', sex: 'M', count: 50_005 },
    { year: 1880, name: 'Zoe', sex: 'F', count: 20_000 },
    { year: 1899, name: 'Zoe', sex: 'F', count: 20_000 },
  ];
  const expected: NameAggregate[] = [
    { name: 'Ada', sex: 'F', totalPublishedCount: 50, peakDecade: 1900, peakCount: 20, runnerUpCount: 15, series: [
      { decade: 1880, count: 15, publishedYearCount: 2, omittedYearCount: 8 },
      { decade: 1890, count: 15, publishedYearCount: 1, omittedYearCount: 9 },
      { decade: 1900, count: 20, publishedYearCount: 1, omittedYearCount: 9 },
    ] },
    { name: 'Ada', sex: 'M', totalPublishedCount: 50_005, peakDecade: 1880, peakCount: 50_005, runnerUpCount: 0, series: [
      { decade: 1880, count: 50_005, publishedYearCount: 1, omittedYearCount: 9 },
      { decade: 1890, count: 0, publishedYearCount: 0, omittedYearCount: 10 },
      { decade: 1900, count: 0, publishedYearCount: 0, omittedYearCount: 10 },
    ] },
    { name: 'Zoe', sex: 'F', totalPublishedCount: 40_000, peakDecade: 1880, peakCount: 20_000, runnerUpCount: 20_000, series: [
      { decade: 1880, count: 20_000, publishedYearCount: 1, omittedYearCount: 9 },
      { decade: 1890, count: 20_000, publishedYearCount: 1, omittedYearCount: 9 },
      { decade: 1900, count: 0, publishedYearCount: 0, omittedYearCount: 10 },
    ] },
  ];
  for (const aggregate of [aggregatePrimary, aggregateReference]) {
    assert.deepEqual(aggregate(records, { startYear: 1880, endYear: 1909 }), expected);
    assert.deepEqual(aggregate([{ year: 9999, name: 'Z', sex: 'M', count: 5 }], { startYear: 9980, endYear: 9999 }), [madeAggregate('Z', 'M', [0, 5])].map(row => ({
      ...row, peakDecade: 9990, series: row.series.map((cell, index) => ({ ...cell, decade: 9980 + 10 * index })),
    })));
  }
});

test('aggregation rejects invalid rows, duplicate evidence, partial windows and unsafe sums', () => {
  const base: AnnualCount = { year: 1880, name: 'Ada', sex: 'F', count: 5 };
  const invalidRows: unknown[] = [null, {},
    ...[1879, 1900, 1880.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1].map(year => ({ ...base, year })),
    ...[0, 4, -5, 5.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1].map(count => ({ ...base, count })),
    ...['', 'Ada1', 'A-B', 'Éva', 'A'.repeat(41), 'Ada\n', 12].map(name => ({ ...base, name })),
    ...['', 'X', 'f', null].map(sex => ({ ...base, sex })),
  ];
  const windows: unknown[] = [null, {}, { startYear: 1880, endYear: 1889 },
    { startYear: 1881, endYear: 1899 }, { startYear: 1880, endYear: 1898 },
    { startYear: 1870, endYear: 1889 }, { startYear: 1880, endYear: 10009 },
    { startYear: 1900, endYear: 1889 }, { startYear: 1880.5, endYear: 1899 },
    { startYear: NaN, endYear: 1899 }, { startYear: 1880, endYear: Infinity },
  ];
  for (const aggregate of [aggregatePrimary, aggregateReference]) {
    assert.throws(() => aggregate([], WINDOW));
    for (const row of invalidRows) assert.throws(() => aggregate([row as AnnualCount], WINDOW), JSON.stringify(row));
    for (const window of windows) assert.throws(() => aggregate([base], window as Window), JSON.stringify(window));
    assert.throws(() => aggregate([{ ...base, year: 1881 }], { startYear: 1881, endYear: 1909 }), 'partial first decade with in-window evidence');
    assert.throws(() => aggregate([base], { startYear: 1880, endYear: 1908 }), 'partial last decade with in-window evidence');
    assert.throws(() => aggregate([base, { ...base, count: 6 }], WINDOW));
    assert.throws(() => aggregate([{ ...base, count: Number.MAX_SAFE_INTEGER }, { ...base, year: 1881 }], WINDOW));
    assert.throws(() => aggregate([{ ...base, count: Number.MAX_SAFE_INTEGER }, { ...base, year: 1890 }], WINDOW));
    assert.equal(aggregate([{ ...base, count: Number.MAX_SAFE_INTEGER - 5 }, { ...base, year: 1890 }], WINDOW)[0]!.totalPublishedCount, Number.MAX_SAFE_INTEGER);
  }
});

test('selection uses inclusive 50,000 and exact 115% boundaries, including near-safe-max integers', () => {
  const rows = [
    madeAggregate('Exact', 'F', [11_500, 10_000, 10_000, 10_000, 10_000]),
    madeAggregate('BelowRatio', 'F', [11_499, 10_000, 10_000, 10_000, 10_000]),
    madeAggregate('ExactTotal', 'M', [30_000, 20_000]),
    madeAggregate('BelowTotal', 'M', [30_000, 19_999]),
    madeAggregate('OnlyPublishedDecade', 'F', [50_000, 0]),
    madeAggregate('Tied', 'F', [30_000, 30_000]),
    madeAggregate('HugeExact', 'M', [4_600_000_000_000_000, 4_000_000_000_000_000]),
    madeAggregate('HugeBelow', 'M', [4_599_999_999_999_999, 4_000_000_000_000_000]),
    madeAggregate('HugeAbove', 'M', [4_600_000_000_000_001, 4_000_000_000_000_000]),
  ];
  const expected = ['HugeAbove', 'HugeExact', 'Exact', 'ExactTotal', 'OnlyPublishedDecade'];
  for (const select of [selectPrimary, selectReference]) assert.deepEqual(select(rows, 500).map(row => row.name), expected);
});

test('selection breaks ties by ASCII name/sex, deduplicates after qualification, and deep-copies', () => {
  const rows = [
    madeAggregate('Alex', 'M', [40_000, 10_000]), madeAggregate('Alex', 'F', [40_000, 10_000]),
    madeAggregate('alex', 'F', [40_000, 10_000]), madeAggregate('Zoe', 'F', [40_000, 10_000]),
    madeAggregate('Ada', 'M', [50_000, 50_000]), madeAggregate('Ada', 'F', [40_000, 10_000]),
  ];
  const before = clone(rows);
  for (const select of [selectPrimary, selectReference]) {
    const selected = select(rows, 500);
    assert.deepEqual(selected.map(row => `${row.name}:${row.sex}`), ['Ada:F', 'Alex:F', 'Zoe:F', 'alex:F']);
    assert.deepEqual(select(shuffled(rows, random(23)), 2).map(row => row.name), ['Ada', 'Alex']);
    selected[0]!.series[0]!.count = 999;
    selected[0]!.name = 'Changed';
    assert.deepEqual(rows, before);
    assert.deepEqual(select([], 10), []);
  }
});

test('selectors reject malformed consistency metadata, unsafe totals and invalid limits', () => {
  const original = madeAggregate('Ada', 'F', [30_000, 20_000]);
  const cases: unknown[] = [null, {},
    { ...original, name: 'Bad-name' }, { ...original, sex: 'X' },
    { ...original, totalPublishedCount: 49_999 }, { ...original, totalPublishedCount: NaN },
    { ...original, peakCount: 29_999 }, { ...original, runnerUpCount: 0 }, { ...original, peakDecade: 1890 },
    { ...original, series: original.series.slice(1) },
    { ...original, series: [{ ...original.series[0]!, count: -5 }, original.series[1]!] },
    { ...original, series: [{ ...original.series[0]!, count: 5.5 }, original.series[1]!] },
    { ...original, series: [{ ...original.series[0]!, publishedYearCount: 0, omittedYearCount: 10 }, original.series[1]!] },
    { ...original, series: [{ ...original.series[0]!, omittedYearCount: 10 }, original.series[1]!] },
    { ...original, series: [{ ...original.series[0]!, publishedYearCount: 11, omittedYearCount: -1 }, original.series[1]!] },
    { ...original, series: [original.series[0]!, { ...original.series[1]!, decade: 1900 }] },
    { ...original, series: [original.series[1]!, original.series[0]!] },
    { ...original, series: [{ ...original.series[0]!, decade: 1870 }, original.series[1]!] },
    madeAggregate('Overflow', 'M', [Number.MAX_SAFE_INTEGER, 5]),
  ];
  const zero = madeAggregate('Zero', 'F', [0, 0]);
  cases.push({ ...zero, series: [{ decade: 1880, count: 0, publishedYearCount: 1, omittedYearCount: 9 }, zero.series[1]!] });
  for (const select of [selectPrimary, selectReference]) {
    for (const limit of [0, -1, 1.5, 501, NaN, Infinity]) assert.throws(() => select([original], limit));
    for (const value of cases) assert.throws(() => select([value as NameAggregate], 30), JSON.stringify(value));
    assert.throws(() => select([original, clone(original)], 30));
    const tied = madeAggregate('Tie', 'F', [25_000, 25_000]);
    assert.throws(() => select([{ ...tied, peakDecade: 1890 }], 30));
    assert.deepEqual(select([zero], 30), []);
  }
});

test('actual 3,707-row fixture deep-copies provenance and produces 30 honest historical summaries', () => {
  const parsed = parseFixture(fixture);
  assert.deepEqual(parsed, fixture);
  assert.notEqual(parsed, fixture);
  assert.equal(parsed.annualCounts.length, 3707);
  assert.equal(new Set(parsed.annualCounts.map(row => row.year)).size, 130);
  assert.equal(new Set(parsed.annualCounts.map(row => row.name)).size, 30);
  const before = clone(fixture);
  const pack = buildSample(fixture);
  assert.deepEqual(fixture, before);
  assert.equal(pack.mode, 'historical-sample');
  assert.equal(pack.complete, false);
  assert.equal(pack.currentMetricsVerified, false);
  assert.deepEqual(pack.analysis, { startYear: 1880, endYear: 2009, unit: 'sum-of-published-SSA-name-counts' });
  assert.deepEqual(pack.source, parsed.source);
  assert.equal(pack.rows.length, 30);
  const expected = selectReference(aggregateReference(parsed.annualCounts, parsed.analysis), 30);
  for (let index = 0; index < pack.rows.length; index++) {
    const row = pack.rows[index]!;
    const source = expected[index]!;
    assert.deepEqual(row, {
      id: `ssa:${source.sex}:${source.name}`, name: source.name, sex: source.sex,
      totalPublishedCount: source.totalPublishedCount, peakDecade: source.peakDecade,
      peakCount: source.peakCount, runnerUpCount: source.runnerUpCount,
      sparkline: source.series, fact: null, factStatus: 'unverified', recognitionVerified: false,
    });
    assert.equal(row.sparkline.length, 13);
    assert.ok(row.totalPublishedCount >= 50_000);
    assert.ok(BigInt(row.peakCount) * 100n >= BigInt(row.runnerUpCount) * 115n);
  }
  assert.ok(pack.rows.some(row => row.sparkline.some(cell => cell.omittedYearCount > 0)));
  assert.equal(pack.rows.reduce((sum, row) => sum + row.totalPublishedCount, 0), 35_928_729);
  assert.equal(pack.rows.reduce((sum, row) => sum + row.sparkline.reduce((inner, cell) => inner + cell.omittedYearCount, 0), 0), 193);
  assert.equal(pack.rows[0]!.id, 'ssa:M:Thomas');
  assert.equal(pack.rows[29]!.id, 'ssa:F:Donna');
  const independentCases = [
    ['Thomas', 'M', 2_248_621, 1950, 454_195, 350_739, 0],
    ['Donna', 'F', 829_326, 1950, 270_325, 213_453, 0],
    ['Jennifer', 'F', 1_452_768, 1970, 581_772, 440_859, 38],
    ['Barbara', 'F', 1_431_426, 1940, 425_242, 345_706, 0],
    ['Gary', 'M', 896_138, 1950, 329_814, 217_732, 2],
  ] as const;
  for (const [name, sex, total, decade, peak, runner, omitted] of independentCases) {
    const row = pack.rows.find(value => value.name === name && value.sex === sex)!;
    assert.deepEqual([row.totalPublishedCount, row.peakDecade, row.peakCount, row.runnerUpCount], [total, decade, peak, runner]);
    assert.equal(row.sparkline.reduce((sum, cell) => sum + cell.omittedYearCount, 0), omitted);
  }
  parsed.source.publisher = 'Changed';
  parsed.annualCounts[0]!.count = 999;
  assert.deepEqual(fixture, before);
  pack.source.publisher = 'Changed';
  pack.rows[0]!.sparkline[0]!.count = 999;
  assert.deepEqual(fixture, before);
});

test('fixture guards reject forged provenance, extras, wrong cardinality, missing years and noncanonical order', () => {
  const mutations: Array<(input: any) => void> = [
    input => { input.extra = true; }, input => { input.analysis.extra = true; },
    input => { input.source.extra = true; }, input => { input.annualCounts[0].extra = true; },
    input => { input.source.publisher = 'Other'; }, input => { input.source.commit = '0'.repeat(40); },
    input => { input.source.url = input.source.url.replace('raw.githubusercontent.com', 'example.com'); },
    input => { input.source.sha256 = '0'.repeat(64); }, input => { input.source.license = 'MIT'; },
    input => { input.source.coverageStartYear = 1881; }, input => { input.source.coverageEndYear = 2016; },
    input => { input.analysis.startYear = 1890; }, input => { input.analysis.endYear = 2019; },
    input => { input.annualCounts.pop(); }, input => { input.annualCounts.push(clone(input.annualCounts[0])); },
    input => { input.annualCounts[1] = clone(input.annualCounts[0]); },
    input => { input.annualCounts[0].count = 4; }, input => { input.annualCounts[0].count = 5.5; },
    input => { input.annualCounts[0].year = 2010; }, input => { input.annualCounts[0].sex = 'X'; },
    input => { input.annualCounts[0].name = 'Bad-name'; },
    input => { [input.annualCounts[0], input.annualCounts[1]] = [input.annualCounts[1], input.annualCounts[0]]; },
    input => { for (const row of input.annualCounts) if (row.name === 'Brian') row.name = 'Barbara'; },
  ];
  for (const [index, change] of mutations.entries()) {
    const input = fixtureMutated(change);
    assert.throws(() => parseFixture(input), `fixture mutation ${index}`);
    assert.throws(() => buildSample(input), `build mutation ${index}`);
  }
  for (const value of [null, [], {}, 'bad']) assert.throws(() => parseFixture(value));
  const missingYear = clone(parseFixture(fixture));
  const dropped = missingYear.annualCounts.filter(row => row.year === 1880).length;
  missingYear.annualCounts = missingYear.annualCounts.filter(row => row.year !== 1880);
  const present = new Set(missingYear.annualCounts.map(row => `${row.year}:${row.sex}:${row.name}`));
  const pairs = [...new Map(missingYear.annualCounts.map(row => [`${row.sex}:${row.name}`, row])).values()];
  let replacements = 0;
  for (let year = 1881; year <= 2009 && replacements < dropped; year++) {
    for (const row of pairs) {
      const key = `${year}:${row.sex}:${row.name}`;
      if (!present.has(key)) {
        missingYear.annualCounts.push({ year, name: row.name, sex: row.sex, count: 5 });
        present.add(key);
        if (++replacements === dropped) break;
      }
    }
  }
  missingYear.annualCounts.sort((a, b) => a.year - b.year || ascii(a.sex, b.sex) || ascii(a.name, b.name));
  assert.equal(missingYear.annualCounts.length, 3707);
  assert.equal(new Set(missingYear.annualCounts.map(row => row.year)).size, 129);
  assert.throws(() => parseFixture(missingYear), 'global missing year despite correct length/order/unique rows');
});

test('AJV validates actual fixture and pack, rejects claimed verification and inconsistent omission', () => {
  const ajv = new Ajv({ strict: true, allErrors: true });
  const validateFixture = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/fixture.schema.json'), 'utf8')));
  const validatePack = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'schemas/pack.schema.json'), 'utf8')));
  const pack = buildSample(fixture);
  assert.equal(validateFixture(fixture), true, ajv.errorsText(validateFixture.errors));
  assert.equal(validatePack(pack), true, ajv.errorsText(validatePack.errors));
  assert.equal(validateFixture(fixtureMutated(input => { input.source.license = 'MIT'; })), false);
  assert.equal(validateFixture(fixtureMutated(input => { input.annualCounts.pop(); })), false);
  for (const change of [
    (value: any) => { value.complete = true; }, (value: any) => { value.currentMetricsVerified = true; },
    (value: any) => { value.rows[0].fact = 'Invented'; }, (value: any) => { value.rows[0].recognitionVerified = true; },
    (value: any) => { value.rows[0].factStatus = 'verified'; },
    (value: any) => { value.rows[0].sparkline[0].omittedYearCount = 11; },
    (value: any) => { value.rows.pop(); }, (value: any) => { value.extra = 'bad'; },
  ]) {
    const invalid = clone(pack); change(invalid);
    assert.equal(validatePack(invalid), false, 'pack schema accepted false claims/shape');
  }
});

test('core remains deterministic without clock or ambient randomness and matches checked-in golden bytes', () => {
  const now = Date.now;
  const mathRandom = Math.random;
  try {
    Date.now = () => { throw new Error('ambient clock used'); };
    Math.random = () => { throw new Error('ambient randomness used'); };
    const first = serialise(buildSample(fixture));
    assert.equal(first, serialise(buildSample(fixture)));
    assert.ok(first.endsWith('\n'));
    assert.deepEqual(Buffer.from(first), readFileSync(join(ROOT, 'data/sample.json')));
    assert.deepEqual(JSON.parse(first), buildSample(fixture));
  } finally {
    Date.now = now; Math.random = mathRandom;
  }
});

test('CLI creates byte-identical golden outputs across timezones and preserves files on every failure', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-cli-'));
  const input = join(folder, 'source.json'); const first = join(folder, 'first.json'); const second = join(folder, 'second.json');
  try {
    writeFileSync(input, fixtureBytes);
    for (const [output, tz] of [[first, 'Pacific/Kiritimati'], [second, 'America/Los_Angeles']] as const) {
      const result = cli([input, output, '--sample'], tz);
      assert.equal(result.error, undefined);
      assert.equal(result.status, 0, result.stderr);
    }
    assert.deepEqual(readFileSync(first), readFileSync(second));
    assert.deepEqual(readFileSync(first), readFileSync(join(ROOT, 'data/sample.json')));
    assert.deepEqual(readFileSync(input), fixtureBytes);
    const sentinel = Buffer.from(`existing-output-${randomBytes(12).toString('hex')}\n`);
    const invalid = join(folder, 'invalid.json'); writeFileSync(invalid, '{broken');
    const directory = join(folder, 'directory'); mkdirSync(directory);
    const invalidArgs = [[], [input, first], [input, first, '--production'], [input, first, '--sample', 'extra'],
      [input, first, '--sample', '--build-date', '2026-10-07'], [invalid, first, '--sample'],
      [join(folder, 'absent.json'), first, '--sample'], [input, directory, '--sample']];
    for (const args of invalidArgs) {
      writeFileSync(first, sentinel);
      const result = cli(args);
      assert.equal(result.error, undefined);
      assert.notEqual(result.status, 0, `accepted ${JSON.stringify(args)}`);
      assert.deepEqual(readFileSync(first), sentinel, `overwrote destination for ${JSON.stringify(args)}`);
      assert.deepEqual(readFileSync(input), fixtureBytes);
    }
    assert.deepEqual(readFileSync(fixturePath), fixtureBytes);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

test('CLI rejects direct, symlink and hardlink source aliases using disposable copies', () => {
  const folder = mkdtempSync(join(tmpdir(), 'c05-alias-'));
  try {
    const input = join(folder, 'source.json'); writeFileSync(input, fixtureBytes);
    const symbolic = join(folder, 'symbolic.json'); symlinkSync(input, symbolic);
    const hard = join(folder, 'hard.json'); linkSync(input, hard);
    for (const output of [input, symbolic, hard]) {
      const result = cli([input, output, '--sample']);
      assert.equal(result.error, undefined);
      assert.notEqual(result.status, 0, `source alias accepted: ${output}`);
      assert.deepEqual(readFileSync(input), fixtureBytes);
      assert.deepEqual(readFileSync(output), fixtureBytes);
    }
    const independent = join(folder, 'independent.json'); writeFileSync(independent, 'old destination');
    const destinationAlias = join(folder, 'destination-link.json'); symlinkSync(independent, destinationAlias);
    const destinationHard = join(folder, 'destination-hard.json'); linkSync(independent, destinationHard);
    for (const output of [destinationAlias, destinationHard]) {
      const result = cli([input, output, '--sample']);
      assert.equal(result.error, undefined);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(readFileSync(independent, 'utf8'), 'old destination');
      assert.deepEqual(readFileSync(output), Buffer.from(serialise(buildSample(fixture))));
      assert.deepEqual(readFileSync(input), fixtureBytes);
    }
    assert.deepEqual(readFileSync(fixturePath), fixtureBytes);
  } finally { rmSync(folder, { recursive: true, force: true }); }
});
