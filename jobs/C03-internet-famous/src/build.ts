export interface DailyRecord {article: string; date: string; pageviews: number}
export interface MonthlyArticle {article: string; pageviews: number}
export interface Pair {id: string; a: MonthlyArticle; b: MonthlyArticle; ratio: number}
export interface Period {start: string; end: string}
export interface FixtureDaily {date: string; pageviews: number}
export interface FixtureArticle extends MonthlyArticle {daily: FixtureDaily[]}
export interface FixturePair {id: string; a: FixtureArticle; b: FixtureArticle}
export interface Fixture {
  kind: 'historical-offline-pipeline-sample';
  source_url: string;
  source_sha256: string;
  source_license: 'CC0-1.0';
  project: 'en.wikipedia';
  access: 'unrecorded-by-source';
  agent: 'unrecorded-by-source';
  period_start: '2020-06-01';
  period_end: '2020-06-30';
  current_month_verified: false;
  independent_verification: 'not yet completed';
  curation: string;
  rows: FixturePair[];
}
export interface SampleRow extends Pair {fact: null; factStatus: 'unverified'}
export interface SamplePack {
  mode: 'historical-sample';
  complete: false;
  buildDate: string;
  requestedPeriod: Period;
  sourcePeriod: Period;
  currentMonthVerified: false;
  project: 'en.wikipedia';
  access: 'unrecorded-by-source';
  agent: 'unrecorded-by-source';
  rows: SampleRow[];
}

export const SOURCE_URL = 'https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/wikipedia_pageviews.csv';
export const SOURCE_SHA256 = 'f9bc4774dcd1f50ba36efd8ce69057bafab6035358726fece0cb5e660ad71f9f';

function object(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${field} must be an object`);
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: string[], field: string): void {
  if (Object.keys(value).length !== expected.length || expected.some(key => !Object.hasOwn(value, key))) {
    throw new TypeError(`${field} must contain exactly the declared fields`);
  }
}
function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0 || /[\u0000-\u001f\u007f-\u009f]/.test(value)) {
    throw new TypeError(`${field} must be nonempty text without control characters`);
  }
  return value;
}
function count(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new RangeError(`${field} must be a nonnegative safe integer`);
  return value;
}
function lexical(first: string, second: string): number {return first < second ? -1 : first > second ? 1 : 0}
function monthLength(year: number, month: number): number {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!;
}
function date(value: string): {year: number; month: number; day: number} {
  if (typeof value !== 'string') throw new TypeError('date must be a string');
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (matched === null) throw new RangeError('date must be YYYY-MM-DD');
  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthLength(year, month)) {
    throw new RangeError('invalid Gregorian date');
  }
  return {year, month, day};
}
function iso(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
export function previousMonth(buildDate: string): Period {
  const current = date(buildDate);
  const year = current.month === 1 ? current.year - 1 : current.year;
  const month = current.month === 1 ? 12 : current.month - 1;
  if (year < 1) throw new RangeError('previous month is outside the supported Gregorian calendar');
  return {start: iso(year, month, 1), end: iso(year, month, monthLength(year, month))};
}
function checkedPeriod(periodStart: string, periodEnd: string): number {
  const start = date(periodStart);
  const end = date(periodEnd);
  const days = monthLength(start.year, start.month);
  if (start.day !== 1 || start.year !== end.year || start.month !== end.month || end.day !== days) {
    throw new RangeError('period must be one complete calendar month');
  }
  return days;
}
function checkedRecords(records: readonly DailyRecord[], start: string, end: string): DailyRecord[] {
  if (!Array.isArray(records) || records.length === 0) throw new RangeError('daily records must be a nonempty array');
  return records.map((value: unknown): DailyRecord => {
    const row = object(value, 'daily record');
    keys(row, ['article', 'date', 'pageviews'], 'daily record');
    const article = text(row.article, 'article');
    const recordDate = text(row.date, 'record date');
    date(recordDate);
    if (recordDate < start || recordDate > end) throw new RangeError('daily record is outside the source period');
    return {article, date: recordDate, pageviews: count(row.pageviews, 'daily pageviews')};
  });
}

/** Stream monthly totals and track each article's set of calendar dates. */
export function aggregatePrimary(records: readonly DailyRecord[], periodStart: string, periodEnd: string): MonthlyArticle[] {
  const expectedDays = checkedPeriod(periodStart, periodEnd);
  const totals = new Map<string, {pageviews: number; dates: Set<string>}>();
  for (const record of checkedRecords(records, periodStart, periodEnd)) {
    const total = totals.get(record.article) ?? {pageviews: 0, dates: new Set<string>()};
    if (total.dates.has(record.date)) throw new RangeError('duplicate article/date record');
    total.dates.add(record.date);
    total.pageviews += record.pageviews;
    if (!Number.isSafeInteger(total.pageviews)) throw new RangeError('monthly pageview sum exceeds safe integer range');
    totals.set(record.article, total);
  }
  return [...totals.entries()].sort(([first], [second]) => lexical(first, second)).map(([article, total]) => {
    if (total.dates.size !== expectedDays) throw new RangeError('article is missing daily records from the full month');
    return {article, pageviews: total.pageviews};
  });
}

/** Independently select each article's records, validate dates, then reduce. */
export function aggregateReference(records: readonly DailyRecord[], periodStart: string, periodEnd: string): MonthlyArticle[] {
  const expectedDays = checkedPeriod(periodStart, periodEnd);
  const source = checkedRecords(records, periodStart, periodEnd);
  const articles = [...new Set(source.map(record => record.article))].sort(lexical);
  return articles.map(article => {
    const daily = source.filter(record => record.article === article);
    if (daily.length !== expectedDays || new Set(daily.map(record => record.date)).size !== expectedDays) {
      throw new RangeError('article requires exactly one record for every calendar day');
    }
    const pageviews = daily.reduce((sum, record) => sum + record.pageviews, 0);
    if (!Number.isSafeInteger(pageviews)) throw new RangeError('monthly pageview sum exceeds safe integer range');
    return {article, pageviews};
  });
}

function checkedArticles(articles: readonly MonthlyArticle[], limit: number): MonthlyArticle[] {
  if (!Array.isArray(articles)) throw new TypeError('articles must be an array');
  count(limit, 'pair limit');
  const titles = new Set<string>();
  return articles.map((value: unknown): MonthlyArticle => {
    const row = object(value, 'monthly article');
    keys(row, ['article', 'pageviews'], 'monthly article');
    const article = text(row.article, 'article');
    if (titles.has(article)) throw new RangeError('monthly article titles must be unique');
    titles.add(article);
    return {article, pageviews: count(row.pageviews, 'monthly pageviews')};
  });
}
interface RankedPair {low: MonthlyArticle; high: MonthlyArticle; distance: bigint; denominator: bigint}
function rankedPair(first: MonthlyArticle, second: MonthlyArticle): RankedPair | null {
  const ascending = first.pageviews < second.pageviews || (first.pageviews === second.pageviews && first.article < second.article);
  const low = ascending ? first : second;
  const high = ascending ? second : first;
  if (low.pageviews === 0) return null;
  const lower = BigInt(low.pageviews);
  const higher = BigInt(high.pageviews);
  if (5n * higher < 6n * lower || higher > 3n * lower) return null;
  const signed = 5n * higher - 8n * lower;
  return {low, high, distance: signed < 0n ? -signed : signed, denominator: lower};
}
function rankedCompare(first: RankedPair, second: RankedPair): number {
  const crossFirst = first.distance * second.denominator;
  const crossSecond = second.distance * first.denominator;
  if (crossFirst !== crossSecond) return crossFirst < crossSecond ? -1 : 1;
  return lexical(first.low.article, second.low.article) || lexical(first.high.article, second.high.article);
}
function outputPair(low: MonthlyArticle, high: MonthlyArticle, index: number): Pair {
  return {id: `historical-${String(index + 1).padStart(2, '0')}`, a: {...low}, b: {...high}, ratio: high.pageviews / low.pageviews};
}

/** Rank all eligible pairs exactly, then greedily retain unused titles. */
export function selectPairsPrimary(articles: readonly MonthlyArticle[], limit = 30): Pair[] {
  const source = checkedArticles(articles, limit);
  const candidates: RankedPair[] = [];
  for (let first = 0; first < source.length; first++) {
    for (let second = first + 1; second < source.length; second++) {
      const pair = rankedPair(source[first]!, source[second]!);
      if (pair !== null) candidates.push(pair);
    }
  }
  candidates.sort(rankedCompare);
  const used = new Set<string>();
  const result: Pair[] = [];
  for (const candidate of candidates) {
    if (result.length >= limit) break;
    if (used.has(candidate.low.article) || used.has(candidate.high.article)) continue;
    result.push(outputPair(candidate.low, candidate.high, result.length));
    used.add(candidate.low.article);
    used.add(candidate.high.article);
  }
  return result;
}

/** Repeatedly scan remaining pairs for their exact minimum; never sort pairs. */
export function selectPairsReference(articles: readonly MonthlyArticle[], limit = 30): Pair[] {
  let remaining = checkedArticles(articles, limit);
  const result: Pair[] = [];
  while (result.length < limit && remaining.length >= 2) {
    let best: {low: MonthlyArticle; high: MonthlyArticle; delta: bigint} | null = null;
    for (let left = 0; left < remaining.length; left++) {
      for (let right = left + 1; right < remaining.length; right++) {
        const first = remaining[left]!;
        const second = remaining[right]!;
        let low = first;
        let high = second;
        if (first.pageviews > second.pageviews || (first.pageviews === second.pageviews && first.article > second.article)) {
          low = second;
          high = first;
        }
        if (low.pageviews === 0) continue;
        const lower = BigInt(low.pageviews);
        const higher = BigInt(high.pageviews);
        if (higher * 5n < lower * 6n || lower * 3n < higher) continue;
        const delta = higher * 5n >= lower * 8n ? higher * 5n - lower * 8n : lower * 8n - higher * 5n;
        let preferred = best === null;
        if (best !== null) {
          const currentCross = delta * BigInt(best.low.pageviews);
          const bestCross = best.delta * lower;
          preferred = currentCross < bestCross || (currentCross === bestCross &&
            (low.article < best.low.article || (low.article === best.low.article && high.article < best.high.article)));
        }
        if (preferred) best = {low, high, delta};
      }
    }
    if (best === null) break;
    result.push(outputPair(best.low, best.high, result.length));
    const lowTitle = best.low.article;
    const highTitle = best.high.article;
    remaining = remaining.filter(article => article.article !== lowTitle && article.article !== highTitle);
  }
  return result;
}

export function parseFixture(value: unknown): Fixture {
  const input = object(value, 'fixture');
  keys(input, ['kind', 'source_url', 'source_sha256', 'source_license', 'project', 'access', 'agent',
    'period_start', 'period_end', 'current_month_verified', 'independent_verification', 'curation', 'rows'], 'fixture');
  if (input.kind !== 'historical-offline-pipeline-sample' || input.source_url !== SOURCE_URL ||
      input.source_sha256 !== SOURCE_SHA256 || input.source_license !== 'CC0-1.0' || input.project !== 'en.wikipedia' ||
      input.access !== 'unrecorded-by-source' || input.agent !== 'unrecorded-by-source' ||
      input.period_start !== '2020-06-01' || input.period_end !== '2020-06-30' ||
      input.current_month_verified !== false || input.independent_verification !== 'not yet completed') {
    throw new TypeError('fixture must retain the pinned historical source and unverified metric metadata');
  }
  const curation = text(input.curation, 'curation');
  if (!Array.isArray(input.rows) || input.rows.length !== 30) throw new RangeError('fixture requires exactly 30 historical source pairs');
  const ids = new Set<string>();
  const titles = new Set<string>();
  const records: DailyRecord[] = [];
  function article(value: unknown): FixtureArticle {
    const source = object(value, 'fixture article');
    keys(source, ['article', 'pageviews', 'daily'], 'fixture article');
    const title = text(source.article, 'article');
    if (titles.has(title)) throw new RangeError('fixture requires 60 unique article titles');
    titles.add(title);
    const pageviews = count(source.pageviews, 'stored monthly pageviews');
    if (!Array.isArray(source.daily) || source.daily.length !== 30) throw new RangeError('article requires 30 June daily records');
    const daily = source.daily.map((value: unknown): FixtureDaily => {
      const day = object(value, 'fixture daily record');
      keys(day, ['date', 'pageviews'], 'fixture daily record');
      const record = {date: text(day.date, 'daily date'), pageviews: count(day.pageviews, 'daily pageviews')};
      records.push({article: title, ...record});
      return record;
    });
    return {article: title, pageviews, daily};
  }
  const rows = input.rows.map((value: unknown): FixturePair => {
    const row = object(value, 'fixture pair');
    keys(row, ['id', 'a', 'b'], 'fixture pair');
    const id = text(row.id, 'pair id');
    if (!/^historical-(0[1-9]|[12][0-9]|30)$/.test(id) || ids.has(id)) throw new RangeError('fixture requires unique historical-01 through historical-30 IDs');
    ids.add(id);
    return {id, a: article(row.a), b: article(row.b)};
  });
  const totals = new Map(aggregatePrimary(records, '2020-06-01', '2020-06-30').map(article => [article.article, article.pageviews]));
  for (const row of rows) for (const article of [row.a, row.b]) {
    if (totals.get(article.article) !== article.pageviews) throw new RangeError('stored monthly pageviews disagree with daily records');
  }
  return {kind: 'historical-offline-pipeline-sample', source_url: SOURCE_URL, source_sha256: SOURCE_SHA256,
    source_license: 'CC0-1.0', project: 'en.wikipedia', access: 'unrecorded-by-source', agent: 'unrecorded-by-source',
    period_start: '2020-06-01', period_end: '2020-06-30', current_month_verified: false,
    independent_verification: 'not yet completed', curation, rows};
}

export function buildSample(input: unknown, buildDate: string): SamplePack {
  const requestedPeriod = previousMonth(buildDate);
  const fixture = parseFixture(input);
  if (buildDate <= fixture.period_end) throw new RangeError('historical sample buildDate must be after its source period');
  const records = fixture.rows.flatMap(row => [row.a, row.b].flatMap(article =>
    article.daily.map(day => ({article: article.article, ...day}))));
  const articles = aggregatePrimary(records, fixture.period_start, fixture.period_end);
  const pairs = selectPairsPrimary(articles, 30);
  if (pairs.length !== 30) throw new RangeError('historical sample must produce 30 eligible disjoint pairs');
  const rows = pairs.map((pair): SampleRow => ({...pair, fact: null, factStatus: 'unverified'}));
  return {mode: 'historical-sample', complete: false, buildDate, requestedPeriod,
    sourcePeriod: {start: fixture.period_start, end: fixture.period_end}, currentMonthVerified: false,
    project: fixture.project, access: fixture.access, agent: fixture.agent, rows};
}

export function serializeSample(value: SamplePack): string {return `${JSON.stringify(value, null, 2)}\n`}
