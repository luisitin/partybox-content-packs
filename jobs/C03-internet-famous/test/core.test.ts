import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { linkSync, readFileSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { Ajv } from "ajv";
import {
  aggregatePrimary, aggregateReference, buildSample, parseFixture, previousMonth,
  selectPairsPrimary, selectPairsReference, serializeSample,
  type DailyRecord, type MonthlyArticle, type Pair,
} from "../src/build.js";

const root = process.cwd();
const BUILD_DATE = "2026-10-07";
type JsonRecord = Record<string, unknown>;
const aggregators = [aggregatePrimary, aggregateReference];
const selectors = [selectPairsPrimary, selectPairsReference];
function fixture(): JsonRecord {
  return JSON.parse(readFileSync(join(root, "fixtures/source.json"), "utf8")) as JsonRecord;
}
function sourceRows(input: JsonRecord): JsonRecord[] { return input["rows"] as JsonRecord[]; }
function firstSourceArticle(input: JsonRecord): JsonRecord {
  const row = sourceRows(input)[0]; assert.ok(row);
  return row["a"] as JsonRecord;
}
function firstDaily(input: JsonRecord): JsonRecord {
  const row = (firstSourceArticle(input)["daily"] as JsonRecord[])[0]; assert.ok(row); return row;
}
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
function daysInMonth(year: number, month: number): number {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}
function month(year: number, value: number): { start: string; end: string; dates: string[] } {
  const prefix = `${String(year).padStart(4, "0")}-${String(value).padStart(2, "0")}`;
  const dates = Array.from({ length: daysInMonth(year, value) }, (_, index) => `${prefix}-${String(index + 1).padStart(2, "0")}`);
  return { start: `${prefix}-01`, end: `${prefix}-${dates.length}`, dates };
}
function recordsFor(year = 2020, value = 6, article = "Example", pageviews = 1): DailyRecord[] {
  return month(year, value).dates.map((date) => ({ article, date, pageviews }));
}
function generatedRecords(next: () => number): { start: string; end: string; records: DailyRecord[] } {
  const period = month(1 + Math.floor(next() * 9999), 1 + Math.floor(next() * 12));
  const count = 1 + Math.floor(next() * 3);
  const records: DailyRecord[] = [];
  for (let index = 0; index < count; index += 1) {
    for (const date of period.dates) records.push({ article: `Article_${index}`, date, pageviews: Math.floor(next() * 10000) });
  }
  return { start: period.start, end: period.end, records };
}
function generatedArticles(next: () => number): MonthlyArticle[] {
  return Array.from({ length: Math.floor(next() * 12) }, (_, index) => ({ article: `Title_${String(index).padStart(2, "0")}`, pageviews: Math.floor(next() * 1000) }));
}
function assertPairs(pairs: readonly Pair[], articles: readonly MonthlyArticle[], limit: number): void {
  const originals = new Map(articles.map((article) => [article.article, article.pageviews]));
  const used = new Set<string>();
  assert.ok(pairs.length <= limit && pairs.length <= Math.floor(articles.length / 2));
  for (const pair of pairs) {
    assert.ok(!used.has(pair.a.article) && !used.has(pair.b.article));
    assert.notEqual(pair.a.article, pair.b.article);
    used.add(pair.a.article); used.add(pair.b.article);
    assert.equal(pair.a.pageviews, originals.get(pair.a.article));
    assert.equal(pair.b.pageviews, originals.get(pair.b.article));
    assert.ok(pair.a.pageviews > 0 && pair.a.pageviews <= pair.b.pageviews);
    const low = BigInt(pair.a.pageviews), high = BigInt(pair.b.pageviews);
    assert.ok(high * 5n >= low * 6n && high <= low * 3n);
    assert.equal(pair.ratio, pair.b.pageviews / pair.a.pageviews);
    assert.ok(Number.isFinite(pair.ratio));
  }
  assert.equal(new Set(pairs.map((pair) => pair.id)).size, pairs.length);
}

test("previousMonth uses the last complete Gregorian calendar month across leap years and year rollover", () => {
  for (const [date, start, end] of [
    [BUILD_DATE, "2026-09-01", "2026-09-30"], ["2026-01-31", "2025-12-01", "2025-12-31"],
    ["2024-03-01", "2024-02-01", "2024-02-29"], ["1900-03-01", "1900-02-01", "1900-02-28"],
    ["2000-03-31", "2000-02-01", "2000-02-29"], ["0099-03-01", "0099-02-01", "0099-02-28"],
    ["2026-12-31", "2026-11-01", "2026-11-30"],
  ]) {
    assert.ok(date && start && end); assert.deepEqual(previousMonth(date), { start, end });
  }
  for (const date of ["2026-02-30", "1900-02-29", "2100-02-29", "0000-01-01", "0001-01-01", "2026-10-07\n", "2026-10-7", "bad"]) {
    assert.throws(() => previousMonth(date), date);
  }
});

test("monthly aggregation sums complete unique days, keeps zero counts and orders titles without mutating input", () => {
  const period = month(2020, 6);
  const records = [...recordsFor(2020, 6, "Zebra", 2), ...recordsFor(2020, 6, "Alpha", 0)].reverse();
  const original = structuredClone(records);
  for (const aggregate of aggregators) {
    assert.deepEqual(aggregate(records, period.start, period.end), [{ article: "Alpha", pageviews: 0 }, { article: "Zebra", pageviews: 60 }]);
    assert.deepEqual(records, original);
    assert.deepEqual(aggregate(recordsFor(2000, 2, "Leap", 1), "2000-02-01", "2000-02-29"), [{ article: "Leap", pageviews: 29 }]);
    assert.deepEqual(aggregate(recordsFor(1900, 2, "Common", 1), "1900-02-01", "1900-02-28"), [{ article: "Common", pageviews: 28 }]);
  }
});

test("aggregation rejects incomplete months, duplicate or omitted dates, out-of-period rows and malformed counts", () => {
  for (const aggregate of aggregators) {
    const records = recordsFor();
    const first = records[0]; assert.ok(first);
    assert.throws(() => aggregate(records.slice(1), "2020-06-01", "2020-06-30"));
    assert.throws(() => aggregate([...records, { ...first }], "2020-06-01", "2020-06-30"));
    for (const date of ["2020-06-31", "2020-05-31", "2020-07-01", "2020-06-1", "2020-06-01\n", "bad"]) {
      assert.throws(() => aggregate([{ ...first, date }, ...records.slice(1)], "2020-06-01", "2020-06-30"), date);
    }
    for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => aggregate([{ ...first, pageviews: value }, ...records.slice(1)], "2020-06-01", "2020-06-30"), `count ${value}`);
    }
    assert.throws(() => aggregate([{ ...first, article: " " }, ...records.slice(1)], "2020-06-01", "2020-06-30"));
    for (const [start, end] of [["2020-06-02", "2020-06-30"], ["2020-06-01", "2020-06-29"], ["2020-06-01", "2020-07-01"], ["2020-07-01", "2020-06-30"], ["1900-02-01", "1900-02-29"]]) {
      assert.ok(start && end); assert.throws(() => aggregate(records, start, end));
    }
  }
});

test("safe-integer monthly totals accept the exact maximum but reject summation overflow", () => {
  for (const aggregate of aggregators) {
    const records = recordsFor(2020, 6, "Limit", 0);
    const first = records[0], second = records[1]; assert.ok(first && second);
    first.pageviews = Number.MAX_SAFE_INTEGER;
    assert.deepEqual(aggregate(records, "2020-06-01", "2020-06-30"), [{ article: "Limit", pageviews: Number.MAX_SAFE_INTEGER }]);
    second.pageviews = 1;
    assert.throws(() => aggregate(records, "2020-06-01", "2020-06-30"));
  }
});

test("independent monthly aggregators agree over 10,000 seeded full-calendar-month cases", () => {
  const next = random(0xC03A661);
  for (let index = 0; index < 10000; index += 1) {
    const generated = generatedRecords(next);
    assert.deepEqual(aggregatePrimary(generated.records, generated.start, generated.end), aggregateReference(generated.records, generated.start, generated.end), `aggregation case ${index}`);
  }
});

test("pair ratios include exactly 1.2 and 3, exclude adjacent integer counts, and reject zero denominators", () => {
  for (const select of selectors) {
    const pair = (low: number, high: number) => select([{ article: "Low", pageviews: low }, { article: "High", pageviews: high }]);
    assert.equal(pair(100, 120).length, 1); assert.equal(pair(100, 119).length, 0);
    assert.equal(pair(100, 300).length, 1); assert.equal(pair(100, 301).length, 0);
    assert.equal(pair(0, 0).length, 0); assert.equal(pair(0, 100).length, 0);
    assert.equal(pair(100, 100).length, 0);
    assert.equal(pair(7505999378950825, 9007199254740990).length, 1);
    assert.equal(pair(7505999378950825, 9007199254740989).length, 0);
    assert.equal(pair(3002399751580330, 9007199254740990).length, 1);
    assert.equal(pair(3002399751580330, Number.MAX_SAFE_INTEGER).length, 0);
  }
});

test("pair selectors prefer ratio 1.6, break ties lexically, never reuse titles, and preserve input", () => {
  const articles: MonthlyArticle[] = [{ article: "D", pageviews: 160 }, { article: "B", pageviews: 100 }, { article: "C", pageviews: 160 }, { article: "A", pageviews: 100 }];
  const original = structuredClone(articles);
  for (const select of selectors) {
    const result = select(articles, 2);
    assert.deepEqual(result.map((pair) => [pair.a.article, pair.b.article]), [["A", "C"], ["B", "D"]]);
    assertPairs(result, articles, 2);
    assert.deepEqual(select([...articles].reverse(), 2), result);
    assert.deepEqual(articles, original);
    assert.equal(select(articles, 1).length, 1); assert.equal(select(articles, 0).length, 0);
    assert.deepEqual(select([], 30), []);
    const best = select([{ article: "Low", pageviews: 100 }, { article: "Near", pageviews: 160 }, { article: "Far", pageviews: 200 }], 1);
    assert.deepEqual(best.map((pair) => [pair.a.article, pair.b.article]), [["Low", "Near"]]);
    for (const invalid of [-1, 1.5, Number.POSITIVE_INFINITY]) assert.throws(() => select(articles, invalid));
    for (const invalid of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => select([{ article: "Bad", pageviews: invalid }]));
    assert.throws(() => select([{ article: "Same", pageviews: 100 }, { article: "Same", pageviews: 160 }]));
    assert.throws(() => select([{ article: " ", pageviews: 100 }]));
  }
});

test("independent pair selectors agree over 10,000 seeded cases including counts, ties, zero and limits", () => {
  const next = random(0xC03FA17);
  for (let index = 0; index < 10000; index += 1) {
    const articles = generatedArticles(next), limit = Math.floor(next() * 7);
    const primary = selectPairsPrimary(articles, limit), reference = selectPairsReference(articles, limit);
    assert.deepEqual(primary, reference, `pair differential case ${index}`);
    assertPairs(primary, articles, limit);
  }
});

test("calendar, aggregation and pairing properties hold for seeds 1, 2, 3 plus 1,000 stored crypto seeds", () => {
  const stored: unknown = JSON.parse(readFileSync(join(root, "test/seeds.json"), "utf8"));
  assert.ok(Array.isArray(stored)); assert.equal(stored.length, 1000); assert.equal(new Set(stored).size, 1000);
  assert.ok(stored.every((value: unknown) => typeof value === "number" && Number.isInteger(value) && value > 3 && value <= 0xFFFFFFFF));
  for (const seed of [1, 2, 3, ...(stored as number[])]) {
    const next = random(seed);
    for (let index = 0; index < 6; index += 1) {
      const generated = generatedRecords(next), original = structuredClone(generated.records);
      const totals = aggregatePrimary(generated.records, generated.start, generated.end);
      assert.deepEqual(aggregatePrimary([...generated.records].reverse(), generated.start, generated.end), totals, `aggregation permutation seed ${seed}`);
      assert.deepEqual(aggregateReference(generated.records, generated.start, generated.end), totals);
      assert.equal(totals.reduce((sum, article) => sum + article.pageviews, 0), generated.records.reduce((sum, record) => sum + record.pageviews, 0));
      assert.deepEqual(generated.records, original);
      const articles = generatedArticles(next), limit = Math.floor(next() * 7);
      const pairs = selectPairsPrimary(articles, limit);
      assert.deepEqual(selectPairsPrimary([...articles].reverse(), limit), pairs, `pair permutation seed ${seed}`);
      assert.deepEqual(selectPairsReference(articles, limit), pairs); assertPairs(pairs, articles, limit);
    }
  }
});

test("real sample preserves source provenance and derives 60 totals from 1,800 historical daily records", () => {
  const input = fixture(), original = structuredClone(input), parsed = parseFixture(input);
  assert.deepEqual(parsed, input); assert.notEqual(parsed, input); assert.notEqual(parsed.rows, input["rows"]);
  const daily: DailyRecord[] = [];
  const monthly: MonthlyArticle[] = [];
  for (const pair of sourceRows(input)) {
    for (const side of ["a", "b"]) {
      const article = pair[side] as JsonRecord;
      monthly.push({ article: article["article"] as string, pageviews: article["pageviews"] as number });
      for (const record of article["daily"] as JsonRecord[]) daily.push({ article: article["article"] as string, date: record["date"] as string, pageviews: record["pageviews"] as number });
    }
  }
  assert.equal(sourceRows(input).length, 30); assert.equal(daily.length, 1800); assert.equal(new Set(monthly.map((article) => article.article)).size, 60);
  monthly.sort((left, right) => left.article < right.article ? -1 : left.article > right.article ? 1 : 0);
  for (const aggregate of aggregators) assert.deepEqual(aggregate(daily, "2020-06-01", "2020-06-30"), monthly);
  const pack = buildSample(input, BUILD_DATE);
  assert.equal(pack.mode, "historical-sample"); assert.equal(pack.complete, false); assert.equal(pack.currentMonthVerified, false);
  assert.equal(pack.buildDate, BUILD_DATE); assert.deepEqual(pack.requestedPeriod, { start: "2026-09-01", end: "2026-09-30" });
  assert.deepEqual(pack.sourcePeriod, { start: "2020-06-01", end: "2020-06-30" });
  assert.equal(pack.project, "en.wikipedia"); assert.equal(pack.access, "unrecorded-by-source"); assert.equal(pack.agent, "unrecorded-by-source");
  assert.equal(pack.rows.length, 30); assertPairs(pack.rows, monthly, 30);
  for (const row of pack.rows) { assert.equal(row.fact, null); assert.equal(row.factStatus, "unverified"); }
  assert.deepEqual(input, original);
  firstDaily(input)["pageviews"] = 0; input["curation"] = "changed original";
  assert.deepEqual(parsed, original);
});

test("fixture guards reject invented verification, incorrect totals, date gaps, reused titles and bad provenance", () => {
  const changes: Array<[string, (input: JsonRecord) => void]> = [
    ["wrong kind", (input) => { input["kind"] = "live"; }],
    ["wrong source URL", (input) => { input["source_url"] = "https://example.invalid/data.csv"; }],
    ["wrong source hash", (input) => { input["source_sha256"] = "a".repeat(64); }],
    ["wrong licence", (input) => { input["source_license"] = "MIT"; }],
    ["claimed current month verification", (input) => { input["current_month_verified"] = true; }],
    ["unknown top field", (input) => { input["extra"] = true; }],
    ["missing top field", (input) => { delete input["curation"]; }],
    ["29 rows", (input) => { sourceRows(input).pop(); }],
    ["31 rows", (input) => { const first = sourceRows(input)[0]; assert.ok(first); sourceRows(input).push(structuredClone(first)); }],
    ["partial period start", (input) => { input["period_start"] = "2020-06-02"; }],
    ["partial period end", (input) => { input["period_end"] = "2020-06-29"; }],
    ["incorrect monthly total", (input) => { const article = firstSourceArticle(input); article["pageviews"] = Number(article["pageviews"]) + 1; }],
    ["negative daily count", (input) => { firstDaily(input)["pageviews"] = -1; }],
    ["fractional daily count", (input) => { firstDaily(input)["pageviews"] = 1.5; }],
    ["unsafe daily count", (input) => { firstDaily(input)["pageviews"] = Number.MAX_SAFE_INTEGER + 1; }],
    ["invalid daily date", (input) => { firstDaily(input)["date"] = "2020-06-31"; }],
    ["missing daily date", (input) => { (firstSourceArticle(input)["daily"] as unknown[]).pop(); }],
    ["duplicate daily date", (input) => { const daily = firstSourceArticle(input)["daily"] as JsonRecord[]; const second = daily[1]; assert.ok(second); firstDaily(input)["date"] = second["date"]; }],
    ["reused article title", (input) => { const first = sourceRows(input)[0]; assert.ok(first); (first["b"] as JsonRecord)["article"] = firstSourceArticle(input)["article"]; }],
    ["unknown daily field", (input) => { firstDaily(input)["tracking"] = true; }],
  ];
  for (const [label, change] of changes) { const input = fixture(); change(input); assert.throws(() => buildSample(input, BUILD_DATE), label); }
  for (const value of [null, [], "sample", 30, { rows: null }]) assert.throws(() => buildSample(value, BUILD_DATE));
  assert.throws(() => buildSample(fixture(), "2026-02-30"));
  const shuffled = fixture(); sourceRows(shuffled).reverse();
  for (const pair of sourceRows(shuffled)) for (const side of ["a", "b"]) ((pair[side] as JsonRecord)["daily"] as unknown[]).reverse();
  assert.equal(serializeSample(buildSample(shuffled, BUILD_DATE)), serializeSample(buildSample(fixture(), BUILD_DATE)));
});

test("fixture/output schemas validate real data and reject invented facts, current verification and missing fields", () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validateFixture = ajv.compile(JSON.parse(readFileSync(join(root, "schemas/fixture.schema.json"), "utf8")) as object);
  const validatePack = ajv.compile(JSON.parse(readFileSync(join(root, "schemas/pack.schema.json"), "utf8")) as object);
  const input = fixture(), pack = buildSample(input, BUILD_DATE);
  assert.equal(validateFixture(input), true, JSON.stringify(validateFixture.errors)); assert.equal(validatePack(pack), true, JSON.stringify(validatePack.errors));
  const missing = structuredClone(input); delete missing["source_sha256"]; assert.equal(validateFixture(missing), false);
  const verified = structuredClone(input); verified["current_month_verified"] = true; assert.equal(validateFixture(verified), false);
  const invented = JSON.parse(serializeSample(pack)) as JsonRecord; const first = sourceRows(invented)[0]; assert.ok(first); first["fact"] = "Invented fact"; assert.equal(validatePack(invented), false);
  const extra = JSON.parse(serializeSample(pack)) as JsonRecord; extra["tracking"] = true; assert.equal(validatePack(extra), false);
});

test("sample bytes equal checked-in output and core uses no implicit clock or randomness", () => {
  const input = fixture(), pack = buildSample(input, BUILD_DATE), bytes = serializeSample(pack);
  assert.deepEqual(JSON.parse(bytes), pack); assert.ok(bytes.endsWith("\n")); assert.equal(readFileSync(join(root, "data/sample.json"), "utf8"), bytes);
  const originalNow = Date.now, originalRandom = Math.random;
  try {
    Date.now = () => { throw new Error("implicit clock used"); }; Math.random = () => { throw new Error("implicit randomness used"); };
    assert.equal(serializeSample(buildSample(input, BUILD_DATE)), bytes);
    assert.deepEqual(previousMonth(BUILD_DATE), { start: "2026-09-01", end: "2026-09-30" });
  } finally { Date.now = originalNow; Math.random = originalRandom; }
});

test("CLI reproduces sample bytes across time zones and rejects wrong modes without replacing existing output", () => {
  const directory = mkdtempSync(join(tmpdir(), "c03-core-"));
  try {
    const input = join(directory, "source.json"), first = join(directory, "first.json"), second = join(directory, "second.json"), third = join(directory, "third.json");
    const original = readFileSync(join(root, "fixtures/source.json")); writeFileSync(input, original);
    const cli = resolve(root, "dist/src/cli.js");
    for (const [target, timezone] of [[first, "UTC"], [second, "Pacific/Kiritimati"], [third, "America/Los_Angeles"]]) {
      assert.ok(target && timezone);
      const result = spawnSync(process.execPath, [cli, input, target, "--sample", "--build-date", BUILD_DATE], { cwd: root, encoding: "utf8", env: { ...process.env, TZ: timezone }, timeout: 10000 });
      assert.equal(result.status, 0, result.stderr); assert.equal(result.error, undefined);
    }
    assert.deepEqual(readFileSync(first), readFileSync(second)); assert.deepEqual(readFileSync(first), readFileSync(third));
    assert.deepEqual(readFileSync(first), readFileSync(join(root, "data/sample.json"))); assert.deepEqual(readFileSync(input), original);
    const previous = Buffer.from("preserve existing output on rejected arguments\n"); writeFileSync(first, previous);
    for (const args of [[input, first], [input, first, "--sample"], [input, first, "--production", "--build-date", BUILD_DATE], [input, first, "--sample", "--build-date", "2026-02-30"]]) {
      const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
      assert.notEqual(result.status, 0); assert.equal(result.error, undefined); assert.deepEqual(readFileSync(first), previous); assert.deepEqual(readFileSync(input), original);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("CLI refuses direct, normalized-path, symlink and hardlink source aliases using disposable copies", () => {
  const directory = mkdtempSync(join(tmpdir(), "c03-alias-"));
  try {
    const input = join(directory, "source.json"), symbolic = join(directory, "symbolic.json"), hard = join(directory, "hard.json");
    const original = readFileSync(join(root, "fixtures/source.json")); writeFileSync(input, original); symlinkSync(input, symbolic); linkSync(input, hard);
    for (const target of [input, join(directory, "subdirectory", "..", "source.json"), symbolic, hard]) {
      const result = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), input, target, "--sample", "--build-date", BUILD_DATE], { cwd: root, encoding: "utf8", timeout: 10000 });
      assert.notEqual(result.status, 0); assert.equal(result.error, undefined); assert.match(result.stderr, /different files/);
      for (const path of [input, symbolic, hard]) assert.deepEqual(readFileSync(path), original);
    }
    const invalid = join(directory, "invalid.json"), existing = join(directory, "existing.json"); writeFileSync(invalid, '{"rows":[]}\n'); writeFileSync(existing, "preserved output\n");
    const result = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), invalid, existing, "--sample", "--build-date", BUILD_DATE], { cwd: root, encoding: "utf8", timeout: 10000 });
    assert.notEqual(result.status, 0); assert.equal(readFileSync(existing, "utf8"), "preserved output\n");
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
