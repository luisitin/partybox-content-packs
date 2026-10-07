export type Sex = 'F' | 'M';
export interface Window { startYear: number; endYear: number }
export interface AnnualCount { year: number; sex: Sex; name: string; count: number }
export interface DecadeCell { decade: number; count: number; publishedYearCount: number; omittedYearCount: number }
export interface NameAggregate {
  name: string;
  sex: Sex;
  totalPublishedCount: number;
  peakDecade: number;
  peakCount: number;
  runnerUpCount: number;
  series: DecadeCell[];
}
export interface Source {
  publisher: string;
  url: string;
  commit: string;
  sha256: string;
  license: string;
  coverageStartYear: number;
  coverageEndYear: number;
}
export interface Fixture { analysis: Window; source: Source; annualCounts: AnnualCount[] }
export interface SampleRow {
  id: string;
  name: string;
  sex: Sex;
  totalPublishedCount: number;
  peakDecade: number;
  peakCount: number;
  runnerUpCount: number;
  sparkline: DecadeCell[];
  fact: null;
  factStatus: 'unverified';
  recognitionVerified: false;
}
export interface SamplePack {
  mode: 'historical-sample';
  complete: false;
  currentMetricsVerified: false;
  analysis: Window & { unit: 'sum-of-published-SSA-name-counts' };
  source: Source;
  rows: SampleRow[];
}

const PINNED_SOURCE: Readonly<Source> = Object.freeze({
  publisher: 'hadley/babynames',
  url: 'https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data/babynames.rda',
  commit: '4391c25ea10b8b0589cdbab63067de3bc8b3a628',
  sha256: '1d5c601fa3c5177f4d9edb4c8c2f08fddc8d9bf04372b8a40dc6aecf92bfa324',
  license: 'CC0',
  coverageStartYear: 1880,
  coverageEndYear: 2017,
});

function object(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}
function exactKeys(value: Record<string, unknown>, keys: readonly string[], label: string): void {
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some(key => !keys.includes(key))) throw new Error(`${label} has unexpected or missing fields`);
}
function safeInteger(value: unknown, minimum: number, label: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) throw new Error(`${label} must be a safe integer >= ${minimum}`);
  return value;
}
function nameValue(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z]{1,40}$/.test(value)) throw new Error('name must contain 1 to 40 ASCII letters');
  return value;
}
function sexValue(value: unknown): Sex {
  if (value !== 'F' && value !== 'M') throw new Error('sex must be F or M');
  return value;
}
function ascii(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function identityOrder(a: Pick<NameAggregate, 'name' | 'sex'>, b: Pick<NameAggregate, 'name' | 'sex'>): number {
  return ascii(a.name, b.name) || ascii(a.sex, b.sex);
}
function safeSum(a: number, b: number): number {
  const sum = a + b;
  if (!Number.isSafeInteger(sum)) throw new Error('published count sum exceeds the safe integer range');
  return sum;
}
function validatedWindow(value: unknown): Window {
  const row = object(value, 'window');
  const startYear = safeInteger(row.startYear, 1880, 'startYear');
  const endYear = safeInteger(row.endYear, 1880, 'endYear');
  if (endYear > 9999 || startYear % 10 !== 0 || endYear % 10 !== 9 || endYear < startYear || endYear - startYear < 19) {
    throw new Error('window must contain at least two complete calendar decades from 1880 through 9999');
  }
  return { startYear, endYear };
}
function annual(value: unknown, window: Window, exact: boolean): AnnualCount {
  const row = object(value, 'annual count');
  if (exact) exactKeys(row, ['year', 'sex', 'name', 'count'], 'annual count');
  const year = safeInteger(row.year, window.startYear, 'year');
  if (year > window.endYear) throw new Error('annual count is outside the analysis window');
  return { year, sex: sexValue(row.sex), name: nameValue(row.name), count: safeInteger(row.count, 5, 'count') };
}
function validatedRecords(value: readonly AnnualCount[], window: Window, exact = false): AnnualCount[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('annual counts must be a nonempty array');
  const seen = new Set<string>();
  return value.map(input => {
    const row = annual(input, window, exact);
    const key = `${row.year}:${row.sex}:${row.name}`;
    if (seen.has(key)) throw new Error('duplicate annual year/name/sex record');
    seen.add(key);
    return row;
  });
}

/** Streaming groups and decade cells; omitted years remain unknown actual counts. */
export function aggregatePrimary(records: readonly AnnualCount[], window: Window): NameAggregate[] {
  const bounds = validatedWindow(window);
  const valid = validatedRecords(records, bounds);
  const groups = new Map<string, { name: string; sex: Sex; total: number; series: DecadeCell[] }>();
  for (const row of valid) {
    const key = `${row.sex}:${row.name}`;
    let group = groups.get(key);
    if (group === undefined) {
      const series: DecadeCell[] = [];
      for (let decade = bounds.startYear; decade <= bounds.endYear; decade += 10) {
        series.push({ decade, count: 0, publishedYearCount: 0, omittedYearCount: 10 });
      }
      group = { name: row.name, sex: row.sex, total: 0, series };
      groups.set(key, group);
    }
    const cell = group.series[Math.floor((row.year - bounds.startYear) / 10)];
    if (cell === undefined) throw new Error('missing decade cell');
    cell.count = safeSum(cell.count, row.count);
    cell.publishedYearCount += 1;
    cell.omittedYearCount -= 1;
    group.total = safeSum(group.total, row.count);
  }
  const results: NameAggregate[] = [];
  for (const group of groups.values()) {
    let peakCount = -1;
    let runnerUpCount = -1;
    let peakDecade = bounds.startYear;
    for (const cell of group.series) {
      if (cell.count > peakCount) {
        runnerUpCount = peakCount;
        peakCount = cell.count;
        peakDecade = cell.decade;
      } else if (cell.count > runnerUpCount) {
        runnerUpCount = cell.count;
      }
    }
    results.push({ name: group.name, sex: group.sex, totalPublishedCount: group.total, peakDecade, peakCount, runnerUpCount, series: group.series });
  }
  return results.sort(identityOrder);
}

/** Independent per-identity/per-decade filtering and reduction. */
export function aggregateReference(records: readonly AnnualCount[], window: Window): NameAggregate[] {
  const bounds = validatedWindow(window);
  const valid = validatedRecords(records, bounds);
  const identities: { name: string; sex: Sex }[] = [];
  for (const row of valid) {
    if (!identities.some(identity => identity.name === row.name && identity.sex === row.sex)) identities.push({ name: row.name, sex: row.sex });
  }
  const output: NameAggregate[] = [];
  for (const identity of identities) {
    const group = valid.filter(row => row.name === identity.name && row.sex === identity.sex);
    const series: DecadeCell[] = [];
    for (let decade = bounds.startYear; decade <= bounds.endYear; decade += 10) {
      const published = group.filter(row => row.year >= decade && row.year < decade + 10);
      const count = published.reduce((sum, row) => safeSum(sum, row.count), 0);
      series.push({ decade, count, publishedYearCount: published.length, omittedYearCount: 10 - published.length });
    }
    const totalPublishedCount = series.reduce((sum, cell) => safeSum(sum, cell.count), 0);
    const ranked = [...series].sort((a, b) => b.count - a.count || a.decade - b.decade);
    const first = ranked[0];
    const second = ranked[1];
    if (first === undefined || second === undefined) throw new Error('at least two decade cells are required');
    output.push({ name: identity.name, sex: identity.sex, totalPublishedCount, peakDecade: first.decade, peakCount: first.count, runnerUpCount: second.count, series });
  }
  return output.sort(identityOrder);
}

function validateAggregates(aggregates: readonly NameAggregate[]): void {
  if (!Array.isArray(aggregates)) throw new Error('aggregates must be an array');
  const identities = new Set<string>();
  for (const input of aggregates) {
    const row = object(input, 'aggregate');
    const name = nameValue(row.name);
    const sex = sexValue(row.sex);
    const key = `${sex}:${name}`;
    if (identities.has(key)) throw new Error('duplicate aggregate name/sex pair');
    identities.add(key);
    const total = safeInteger(row.totalPublishedCount, 0, 'totalPublishedCount');
    const peak = safeInteger(row.peakCount, 0, 'peakCount');
    const runnerUp = safeInteger(row.runnerUpCount, 0, 'runnerUpCount');
    const peakDecade = safeInteger(row.peakDecade, 1880, 'peakDecade');
    if (!Array.isArray(row.series) || row.series.length < 2) throw new Error('aggregate requires at least two decade cells');
    let priorDecade: number | undefined;
    let sum = 0;
    let maximum = -1;
    let earliestMaximum = 0;
    const counts: number[] = [];
    for (const inputCell of row.series) {
      const cell = object(inputCell, 'decade cell');
      const decade = safeInteger(cell.decade, 1880, 'decade');
      if (decade > 9990 || decade % 10 !== 0 || (priorDecade !== undefined && decade !== priorDecade + 10)) throw new Error('decade cells must be contiguous complete decades');
      priorDecade = decade;
      const count = safeInteger(cell.count, 0, 'decade count');
      const published = safeInteger(cell.publishedYearCount, 0, 'publishedYearCount');
      const omitted = safeInteger(cell.omittedYearCount, 0, 'omittedYearCount');
      if (published > 10 || omitted > 10 || published + omitted !== 10 || (published === 0 ? count !== 0 : count < published * 5)) throw new Error('decade publication coverage is inconsistent');
      sum = safeSum(sum, count);
      counts.push(count);
      if (count > maximum) { maximum = count; earliestMaximum = decade; }
    }
    counts.sort((a, b) => b - a);
    if (sum !== total || maximum !== peak || earliestMaximum !== peakDecade || counts[1] !== runnerUp) throw new Error('aggregate totals or peak metadata are inconsistent');
  }
}
function validatedLimit(limit: number): number {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500) throw new Error('limit must be an integer from 1 to 500');
  return limit;
}
function copyAggregate(row: NameAggregate): NameAggregate {
  return { name: row.name, sex: row.sex, totalPublishedCount: row.totalPublishedCount, peakDecade: row.peakDecade, peakCount: row.peakCount, runnerUpCount: row.runnerUpCount, series: row.series.map(cell => ({ ...cell })) };
}

/** Qualify first, rank by published total, then retain distinct exact names. */
export function selectPrimary(aggregates: readonly NameAggregate[], limit: number): NameAggregate[] {
  validatedLimit(limit);
  validateAggregates(aggregates);
  const ranked = aggregates.filter(row => row.totalPublishedCount >= 50000 && BigInt(row.peakCount) * 100n >= BigInt(row.runnerUpCount) * 115n)
    .sort((a, b) => b.totalPublishedCount - a.totalPublishedCount || identityOrder(a, b));
  const names = new Set<string>();
  const selected: NameAggregate[] = [];
  for (const row of ranked) {
    if (names.has(row.name)) continue;
    names.add(row.name);
    selected.push(copyAggregate(row));
    if (selected.length === limit) break;
  }
  return selected;
}

/** Independently find the best remaining qualifying row on each pass. */
export function selectReference(aggregates: readonly NameAggregate[], limit: number): NameAggregate[] {
  validatedLimit(limit);
  validateAggregates(aggregates);
  const selected: NameAggregate[] = [];
  const usedNames = new Set<string>();
  while (selected.length < limit) {
    let best: NameAggregate | undefined;
    for (const row of aggregates) {
      if (usedNames.has(row.name) || row.totalPublishedCount < 50000 || BigInt(row.peakCount) * 100n < BigInt(row.runnerUpCount) * 115n) continue;
      if (best === undefined || row.totalPublishedCount > best.totalPublishedCount ||
        (row.totalPublishedCount === best.totalPublishedCount && (row.name < best.name || (row.name === best.name && row.sex < best.sex)))) best = row;
    }
    if (best === undefined) break;
    usedNames.add(best.name);
    selected.push(copyAggregate(best));
  }
  return selected;
}

export function parseFixture(value: unknown): Fixture {
  const root = object(value, 'fixture');
  exactKeys(root, ['analysis', 'source', 'annualCounts'], 'fixture');
  const analysisObject = object(root.analysis, 'analysis');
  exactKeys(analysisObject, ['startYear', 'endYear'], 'analysis');
  const analysis = validatedWindow(analysisObject);
  if (analysis.startYear !== 1880 || analysis.endYear !== 2009) throw new Error('sample analysis must cover 1880 through 2009');
  const sourceObject = object(root.source, 'source');
  const sourceKeys = Object.keys(PINNED_SOURCE) as (keyof Source)[];
  exactKeys(sourceObject, sourceKeys, 'source');
  for (const key of sourceKeys) if (sourceObject[key] !== PINNED_SOURCE[key]) throw new Error(`unrecognized source ${key}`);
  if (!Array.isArray(root.annualCounts) || root.annualCounts.length !== 3707) throw new Error('fixture must contain exactly 3707 annual records');
  const annualCounts = validatedRecords(root.annualCounts as AnnualCount[], analysis, true);
  const names = new Set(annualCounts.map(row => row.name));
  const pairs = new Set(annualCounts.map(row => `${row.sex}:${row.name}`));
  if (names.size !== 30 || pairs.size !== 30) throw new Error('fixture must contain exactly 30 distinct names and name/sex pairs');
  const years = new Set(annualCounts.map(row => row.year));
  if (years.size !== 130) throw new Error('fixture must have global published coverage of all 130 analysis years');
  for (let i = 1; i < annualCounts.length; i += 1) {
    const prior = annualCounts[i - 1];
    const row = annualCounts[i];
    if (prior === undefined || row === undefined) throw new Error('missing annual record');
    if (row.year < prior.year || (row.year === prior.year && (row.sex < prior.sex || (row.sex === prior.sex && row.name < prior.name)))) throw new Error('fixture records must be ordered by year, sex, then ASCII name');
  }
  return { analysis, source: { ...PINNED_SOURCE }, annualCounts };
}

export function buildSample(value: unknown): SamplePack {
  const fixture = parseFixture(value);
  const selected = selectPrimary(aggregatePrimary(fixture.annualCounts, fixture.analysis), 30);
  if (selected.length !== 30) throw new Error('sample must contain 30 qualifying distinct names');
  return {
    mode: 'historical-sample',
    complete: false,
    currentMetricsVerified: false,
    analysis: { startYear: fixture.analysis.startYear, endYear: fixture.analysis.endYear, unit: 'sum-of-published-SSA-name-counts' },
    source: { ...fixture.source },
    rows: selected.map(row => ({ id: `ssa:${row.sex}:${row.name}`, name: row.name, sex: row.sex, totalPublishedCount: row.totalPublishedCount, peakDecade: row.peakDecade, peakCount: row.peakCount, runnerUpCount: row.runnerUpCount, sparkline: row.series.map(cell => ({ ...cell })), fact: null, factStatus: 'unverified', recognitionVerified: false })),
  };
}

export function serialise(pack: SamplePack): string { return JSON.stringify(pack, null, 2) + '\n'; }
