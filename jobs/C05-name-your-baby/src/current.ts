import { createHash } from 'node:crypto';
import { aggregatePrimary, aggregateReference, selectPrimary, type AnnualCount, type NameAggregate, type Sex } from './core.js';

export interface CurrentSource {
  publisher: string;
  url: string;
  sha256: string;
  license: string;
  snapshotDate: string;
  coverageStartYear: number;
  coverageEndYear: number;
  datasetIdentifier: string;
  licenseDeclarationUrl: string;
}
export interface CurrentAnalysis { startYear: number; endYear: number; gridEndYear: number }
export interface CurrentCell {
  decade: number;
  count: number;
  publishedYearCount: number;
  observedYearCount: number;
  missingPublishedYearCount: number;
  unobservedYearCount: number;
}
export interface CurrentAggregate extends Omit<NameAggregate, 'series'> { series: CurrentCell[] }
export interface FactReference { url: string; publisher: string; author: string; title: string; workId: string; quote: string }
export interface EditorialReview { reviewer: string; note: string }
export interface CurrentCuration {
  id: string;
  fact: string | null;
  factStatus: 'unverified' | 'reviewed';
  factReferences: FactReference[];
  factReview: EditorialReview | null;
  recognitionVerified: boolean;
  recognitionReview: EditorialReview | null;
}
export interface CurrentFixture { source: CurrentSource; analysis: CurrentAnalysis; annualCounts: AnnualCount[]; curation: CurrentCuration[] }
export interface CurrentRow extends Omit<CurrentAggregate, 'series'>, CurrentCuration { sparkline: CurrentCell[] }
export interface CurrentPack {
  mode: 'current-candidates';
  complete: false;
  currentMetricsVerified: true;
  source: CurrentSource;
  analysis: CurrentAnalysis & { unit: 'sum-of-published-SSA-name-counts'; peakBasis: 'maximum-observed-published-decade-subtotal' };
  rows: CurrentRow[];
}

export const CURRENT_SOURCE: Readonly<CurrentSource> = Object.freeze({
  publisher: 'US Social Security Administration',
  url: 'https://www.ssa.gov/oact/babynames/names.zip',
  sha256: 'cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724',
  license: 'CC0',
  snapshotDate: '2026-10-07',
  coverageStartYear: 1880,
  coverageEndYear: 2025,
  datasetIdentifier: 'US-GOV-SSA-338',
  licenseDeclarationUrl: 'https://www.ssa.gov/data/data.json',
});
const ANALYSIS: Readonly<CurrentAnalysis> = Object.freeze({ startYear: 1880, endYear: 2025, gridEndYear: 2029 });
const GRID = Object.freeze({ startYear: 1880, endYear: 2029 });
const METADATA_KEYS = ['id', 'fact', 'factStatus', 'factReferences', 'factReview', 'recognitionVerified', 'recognitionReview'] as const;

function object(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value);
  if (actual.length !== expected.length || actual.some(key => !expected.includes(key))) throw new Error(`${label} has unexpected or missing fields`);
}
function integer(value: unknown, minimum: number, maximum: number, label: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum || value > maximum) throw new Error(`${label} must be a safe integer from ${minimum} through ${maximum}`);
  return value;
}
function text(value: unknown, maximum: number, label: string): string {
  if (typeof value !== 'string' || value.trim() !== value || [...value].length === 0 || [...value].length > maximum || /[\x00-\x1f\x7f]/.test(value)) throw new Error(`${label} must be nonempty trimmed text without controls, at most ${maximum} characters`);
  return value;
}
function sex(value: unknown): Sex {
  if (value !== 'F' && value !== 'M') throw new Error('sex must be F or M');
  return value;
}
function name(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z]{2,15}$/.test(value)) throw new Error('current SSA names must contain 2 through 15 ASCII letters');
  return value;
}
function observedRecords(value: unknown): AnnualCount[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('annualCounts must be a nonempty array');
  const seen = new Set<string>();
  return value.map(input => {
    const row = object(input, 'annual count');
    keys(row, ['year', 'sex', 'name', 'count'], 'annual count');
    const result: AnnualCount = { year: integer(row.year, 1880, 2025, 'year'), sex: sex(row.sex), name: name(row.name), count: integer(row.count, 5, Number.MAX_SAFE_INTEGER, 'count') };
    const id = `${result.year}:${result.sex}:${result.name}`;
    if (seen.has(id)) throw new Error('duplicate annual year/name/sex record');
    seen.add(id);
    return result;
  });
}

/** A zero count is a published subtotal, never a claim that no children had this name. */
export function aggregateObservedPrimary(records: readonly AnnualCount[]): CurrentAggregate[] {
  const valid = observedRecords(records);
  return aggregatePrimary(valid, GRID).map(row => ({ ...row, series: row.series.map(cell => {
    const observedYearCount = Math.min(10, 2025 - cell.decade + 1);
    return { decade: cell.decade, count: cell.count, publishedYearCount: cell.publishedYearCount, observedYearCount, missingPublishedYearCount: observedYearCount - cell.publishedYearCount, unobservedYearCount: 10 - observedYearCount };
  }) }));
}

/** Separate source-year coverage counting accompanies the independent legacy aggregator. */
export function aggregateObservedReference(records: readonly AnnualCount[]): CurrentAggregate[] {
  const valid = observedRecords(records);
  const aggregates = aggregateReference(valid, GRID);
  return aggregates.map(row => {
    const series: CurrentCell[] = [];
    for (const cell of row.series) {
      let observedYearCount = 0;
      let publishedYearCount = 0;
      for (let year = cell.decade; year < cell.decade + 10; year += 1) {
        if (year > 2025) continue;
        observedYearCount += 1;
        if (valid.some(record => record.year === year && record.name === row.name && record.sex === row.sex)) publishedYearCount += 1;
      }
      series.push({ decade: cell.decade, count: cell.count, publishedYearCount, observedYearCount, missingPublishedYearCount: observedYearCount - publishedYearCount, unobservedYearCount: 10 - observedYearCount });
    }
    return { name: row.name, sex: row.sex, totalPublishedCount: row.totalPublishedCount, peakDecade: row.peakDecade, peakCount: row.peakCount, runnerUpCount: row.runnerUpCount, series };
  });
}

function review(value: unknown, label: string): EditorialReview | null {
  if (value === null) return null;
  const row = object(value, label);
  keys(row, ['reviewer', 'note'], label);
  return { reviewer: text(row.reviewer, 200, `${label}.reviewer`), note: text(row.note, 1000, `${label}.note`) };
}
function reference(value: unknown): FactReference {
  const row = object(value, 'fact reference');
  keys(row, ['url', 'publisher', 'author', 'title', 'workId', 'quote'], 'fact reference');
  const url = text(row.url, 2000, 'reference URL');
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('reference URL must be absolute HTTPS'); }
  if (!/^https:\/\/[^\s/@]+(?:\/[^\s]*)?$/.test(url) || parsed.protocol !== 'https:' || parsed.username !== '' || parsed.password !== '' || parsed.hostname === '' || /\s/.test(url)) throw new Error('reference URL must be absolute HTTPS without credentials or whitespace');
  return { url, publisher: text(row.publisher, 200, 'reference publisher'), author: text(row.author, 200, 'reference author'), title: text(row.title, 200, 'reference title'), workId: text(row.workId, 200, 'reference workId'), quote: text(row.quote, 2000, 'reference quote') };
}
function normalized(value: string): string { return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' '); }
function curation(value: unknown, identities: ReadonlySet<string>): CurrentCuration[] {
  if (!Array.isArray(value) || value.length > 500) throw new Error('curation must be an array of at most 500 records');
  const seen = new Set<string>();
  return value.map(input => {
    const row = object(input, 'curation record');
    keys(row, METADATA_KEYS, 'curation record');
    const id = text(row.id, 22, 'curation id');
    if (!/^ssa:[FM]:[A-Za-z]{2,15}$/.test(id) || !identities.has(id)) throw new Error('curation id is not a selected source identity');
    if (seen.has(id)) throw new Error('duplicate curation identity');
    seen.add(id);
    const fact = row.fact === null ? null : text(row.fact, 90, 'fact');
    if (row.factStatus !== 'unverified' && row.factStatus !== 'reviewed') throw new Error('factStatus must be unverified or reviewed');
    const factStatus = row.factStatus;
    if (!Array.isArray(row.factReferences) || row.factReferences.length > 8) throw new Error('factReferences must contain at most eight references');
    const factReferences: FactReference[] = [];
    for (let index = 0; index < row.factReferences.length; index += 1) {
      factReferences.push(reference(row.factReferences[index]));
    }
    const factReview = review(row.factReview, 'fact review');
    if (fact === null && (factStatus !== 'unverified' || factReferences.length !== 0)) throw new Error('a null fact must be unverified and have no references');
    if (factStatus === 'reviewed') {
      if (fact === null || factReview === null || factReferences.length < 2 || new Set(factReferences.map(item => normalized(item.author))).size < 2 || new Set(factReferences.map(item => normalized(item.workId))).size < 2) throw new Error('a reviewed fact requires an explicit review and two independently authored works');
    } else if (factReview !== null) throw new Error('an unverified fact cannot carry a completed review');
    if (typeof row.recognitionVerified !== 'boolean') throw new Error('recognitionVerified must be an explicit boolean');
    const recognitionReview = review(row.recognitionReview, 'recognition review');
    if (row.recognitionVerified !== (recognitionReview !== null)) throw new Error('recognition verification requires its own explicit review');
    return { id, fact, factStatus, factReferences, factReview, recognitionVerified: row.recognitionVerified, recognitionReview };
  });
}

export function parseCurrentFixture(value: unknown): CurrentFixture {
  const root = object(value, 'current fixture');
  keys(root, ['source', 'analysis', 'annualCounts', 'curation'], 'current fixture');
  const source = object(root.source, 'current source');
  const sourceKeys = Object.keys(CURRENT_SOURCE) as (keyof CurrentSource)[];
  keys(source, sourceKeys, 'current source');
  for (const key of sourceKeys) if (source[key] !== CURRENT_SOURCE[key]) throw new Error(`unrecognized current source ${key}`);
  const analysis = object(root.analysis, 'current analysis');
  keys(analysis, ['startYear', 'endYear', 'gridEndYear'], 'current analysis');
  for (const key of ['startYear', 'endYear', 'gridEndYear'] as const) if (analysis[key] !== ANALYSIS[key]) throw new Error(`unrecognized current analysis ${key}`);
  if (!Array.isArray(root.annualCounts) || root.annualCounts.length !== 64262) throw new Error('current fixture requires exactly 64262 annual records');
  const annualCounts = observedRecords(root.annualCounts);
  const names = new Set(annualCounts.map(row => row.name));
  const identities = new Set(annualCounts.map(row => `ssa:${row.sex}:${row.name}`));
  if (names.size !== 500 || identities.size !== 500) throw new Error('current fixture requires exactly 500 distinct names and name/category pairs');
  if (new Set(annualCounts.map(row => row.year)).size !== 146) throw new Error('current fixture requires global coverage of all 146 observed years');
  for (let i = 1; i < annualCounts.length; i += 1) {
    const previous = annualCounts[i - 1]!;
    const row = annualCounts[i]!;
    if (row.year < previous.year || (row.year === previous.year && (row.sex < previous.sex || (row.sex === previous.sex && row.name < previous.name)))) throw new Error('current annual records must be ordered by year, sex, then ASCII name');
  }
  return { source: { ...CURRENT_SOURCE }, analysis: { ...ANALYSIS }, annualCounts, curation: curation(root.curation, identities) };
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([key, item]) => [key, canonical(item)]));
  return value;
}

/** Only the pinned source-derived annual counts may carry a verified metrics claim. */
export function buildCurrent(value: unknown): CurrentPack {
  const fixture = parseCurrentFixture(value);
  const metricsBytes = JSON.stringify(canonical({ source: fixture.source, analysis: fixture.analysis, annualCounts: fixture.annualCounts, curation: [] }), null, 2) + '\n';
  if (createHash('sha256').update(metricsBytes).digest('hex') !== 'fd96fecb43209ce8639bc47185c686fcc2157cdae052cbae3c10e582ce88b0e2') throw new Error('current source-derived metrics fail the pinned fixture checksum');
  const selected = selectPrimary(aggregatePrimary(fixture.annualCounts, GRID), 500);
  if (selected.length !== 500) throw new Error('current candidate fixture requires 500 qualifying distinct names');
  const editorial = new Map(fixture.curation.map(row => [row.id, row]));
  return {
    mode: 'current-candidates', complete: false, currentMetricsVerified: true,
    source: { ...fixture.source },
    analysis: { ...fixture.analysis, unit: 'sum-of-published-SSA-name-counts', peakBasis: 'maximum-observed-published-decade-subtotal' },
    rows: selected.map(row => {
      const id = `ssa:${row.sex}:${row.name}`;
      const metadata = editorial.get(id) ?? { id, fact: null, factStatus: 'unverified' as const, factReferences: [], factReview: null, recognitionVerified: false, recognitionReview: null };
      return {
        name: row.name, sex: row.sex, totalPublishedCount: row.totalPublishedCount, peakDecade: row.peakDecade, peakCount: row.peakCount, runnerUpCount: row.runnerUpCount,
        sparkline: row.series.map(cell => {
          const observedYearCount = Math.min(10, fixture.analysis.endYear - cell.decade + 1);
          return { decade: cell.decade, count: cell.count, publishedYearCount: cell.publishedYearCount, observedYearCount, missingPublishedYearCount: observedYearCount - cell.publishedYearCount, unobservedYearCount: 10 - observedYearCount };
        }),
        ...metadata,
      };
    }),
  };
}

export function serialiseCurrent(pack: CurrentPack): string { return JSON.stringify(pack, null, 2) + '\n'; }
