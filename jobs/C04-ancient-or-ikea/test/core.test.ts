import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { linkSync, readFileSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { Ajv } from "ajv";
import { buildSample, centuriesPrimary, centuriesReference, parseFixture, serializeSample } from "../src/build.js";

const root = process.cwd();
type JsonRecord = Record<string, unknown>;
const implementations = [centuriesPrimary, centuriesReference];
function fixture(): JsonRecord[] { return JSON.parse(readFileSync(join(root, "fixtures/source.json"), "utf8")) as JsonRecord[]; }
function first(input: JsonRecord[]): JsonRecord { const row = input[0]; assert.ok(row); return row; }
function aic(input: JsonRecord[]): JsonRecord { const row = input.find((value) => value["museum"] === "Art Institute of Chicago"); assert.ok(row); return row; }
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
}
function randomYear(next: () => number): number {
  const position = Math.floor(next() * 19998);
  return position < 9999 ? position - 9999 : position - 9998;
}
function pointCentury(year: number): number { return Math.sign(year) * Math.ceil(Math.abs(year) / 100); }
function interval(next: () => number): { start: number; end: number } {
  const left = randomYear(next), right = randomYear(next);
  return { start: Math.min(left, right), end: Math.max(left, right) };
}

test("centuries use inclusive historical CE/BCE boundaries with no year or century zero", () => {
  const cases: Array<[number, number, number[]]> = [
    [1, 1, [1]], [1, 100, [1]], [100, 100, [1]], [100, 101, [1, 2]], [101, 200, [2]], [200, 201, [2, 3]],
    [-1, -1, [-1]], [-100, -1, [-1]], [-100, -100, [-1]], [-101, -100, [-2, -1]], [-200, -101, [-2]], [-201, -200, [-3, -2]],
    [-1, 1, [-1, 1]], [-101, 101, [-2, -1, 1, 2]], [1865, 1880, [19]], [1763, 1763, [18]],
    [-9999, -9999, [-100]], [9999, 9999, [100]],
  ];
  for (const implementation of implementations) {
    for (const [start, end, expected] of cases) assert.deepEqual(implementation(start, end), expected, `${start}..${end}`);
    const full = implementation(-9999, 9999);
    assert.deepEqual(full, [...Array.from({ length: 100 }, (_, index) => index - 100), ...Array.from({ length: 100 }, (_, index) => index + 1)]);
    assert.equal(full.includes(0), false);
  }
});

test("century functions reject zero, reversed, fractional, nonfinite and out-of-domain years", () => {
  for (const implementation of implementations) {
    for (const [start, end] of [[0, 1], [-1, 0], [0, 0], [101, 100], [1.5, 2], [-2, -1.5], [-10000, 1], [1, 10000], [Number.NaN, 1], [1, Number.NaN], [Number.NEGATIVE_INFINITY, 1], [1, Number.POSITIVE_INFINITY]]) {
      assert.notEqual(start, undefined); assert.notEqual(end, undefined);
      assert.throws(() => implementation(start as number, end as number), `${start}..${end}`);
    }
  }
});

test("two independent century implementations agree on 10,000 seeded signed historical intervals", () => {
  const next = random(0xC04D1FF);
  for (let index = 0; index < 10000; index += 1) {
    const { start, end } = interval(next);
    assert.deepEqual(centuriesPrimary(start, end), centuriesReference(start, end), `century differential case ${index}: ${start}..${end}`);
  }
});

test("range properties hold for seeds 1, 2, 3 and 1,000 stored cryptographically generated seeds", () => {
  const stored: unknown = JSON.parse(readFileSync(join(root, "test/seeds.json"), "utf8"));
  assert.ok(Array.isArray(stored)); assert.equal(stored.length, 1000); assert.equal(new Set(stored).size, 1000);
  assert.ok(stored.every((value: unknown) => typeof value === "number" && Number.isInteger(value) && value > 3 && value <= 0xFFFFFFFF));
  for (const seed of [1, 2, 3, ...(stored as number[])]) {
    const next = random(seed);
    for (let index = 0; index < 8; index += 1) {
      const { start, end } = interval(next), result = centuriesPrimary(start, end);
      assert.deepEqual(result, centuriesReference(start, end), `seed ${seed}, case ${index}`);
      assert.equal(result[0], pointCentury(start)); assert.equal(result[result.length - 1], pointCentury(end));
      assert.equal(new Set(result).size, result.length); assert.ok(!result.includes(0));
      assert.ok(result.every((century) => Number.isInteger(century) && Math.abs(century) <= 100));
      for (let position = 1; position < result.length; position += 1) {
        const previous = result[position - 1], current = result[position]; assert.ok(previous !== undefined && current !== undefined);
        assert.equal(current - previous, previous === -1 ? 2 : 1);
      }
      assert.deepEqual(centuriesPrimary(-end, -start), [...result].reverse().map((century) => -century));
      const startPosition = start > 0 ? start - 1 : start, endPosition = end > 0 ? end - 1 : end;
      const splitPosition = Math.floor((startPosition + endPosition) / 2), split = splitPosition >= 0 ? splitPosition + 1 : splitPosition;
      const union = [...new Set([...centuriesPrimary(start, split), ...centuriesPrimary(split, end)])];
      assert.deepEqual(union, result);
    }
  }
});

test("parseFixture preserves all official source metadata and image pointers in a detached deep copy", () => {
  const input = fixture(), original = structuredClone(input), parsed = parseFixture(input);
  assert.deepEqual(parsed, original); assert.notEqual(parsed, input); assert.notEqual(parsed[0], input[0]);
  const originalFirst = first(input), parsedFirst = parsed[0]; assert.ok(parsedFirst);
  assert.ok(parsedFirst.museum === "Cooper Hewitt, Smithsonian Design Museum");
  assert.notEqual(parsedFirst.image_references, originalFirst["image_references"]);
  first(input)["title"] = "changed original title"; first(input)["image_license"] = "changed original permission";
  const pointers = first(input)["image_references"] as JsonRecord[];
  const image = pointers[0]; assert.ok(image); const originalSize = image["o"] as JsonRecord; originalSize["url"] = "https://example.invalid/changed.jpg";
  assert.deepEqual(parsed, original);
});

test("real metadata sample has 30 objects, six recorded ranges and 24 unstructured dates without invented centuries", () => {
  const input = fixture(), original = structuredClone(input), pack = buildSample(input);
  assert.equal(input.length, 30); assert.equal(pack.mode, "metadata-sample"); assert.equal(pack.complete, false); assert.equal(pack.rows.length, 30);
  const expected = [...input].sort((left, right) => {
    const museum = String(left["museum"]) < String(right["museum"]) ? -1 : String(left["museum"]) > String(right["museum"]) ? 1 : 0;
    return museum || (String(left["id"]) < String(right["id"]) ? -1 : String(left["id"]) > String(right["id"]) ? 1 : 0);
  }).map((row) => {
    const isAic = row["museum"] === "Art Institute of Chicago";
    const dateRange = typeof row["date_start"] === "number" && typeof row["date_end"] === "number" ? { start: row["date_start"], end: row["date_end"] } : null;
    return {
      id: `${isAic ? "aic" : "cooperhewitt"}-${String(row["id"])}`, museum: row["museum"], title: row["title"], dateDisplay: row["date_display"], dateRange,
      centuries: dateRange === null ? null : centuriesReference(dateRange.start, dateRange.end),
      dateEvidence: dateRange === null ? "unstructured-label" : "catalogue-range", image: null, fact: null, factStatus: "unverified",
      sourceUrl: row["source_url"], sourceSha256: row["source_sha256"], metadataLicense: "CC0-1.0", imageLicenseVerified: false,
      sourceSnapshot: isAic ? row["data_snapshot_updated_utc"] : row["snapshot_committed_utc"],
    };
  });
  assert.deepEqual(pack, { mode: "metadata-sample", complete: false, rows: expected });
  assert.equal(pack.rows.filter((row) => row.dateRange !== null).length, 6); assert.equal(pack.rows.filter((row) => row.centuries === null).length, 24);
  const undatedLabel = pack.rows.find((row) => row.dateDisplay === "n.d."); assert.ok(undatedLabel); assert.deepEqual(undatedLabel.dateRange, { start: 1865, end: 1880 }); assert.deepEqual(undatedLabel.centuries, [19]);
  const shorthand = pack.rows.find((row) => row.dateDisplay === "1853–58"); assert.ok(shorthand); assert.equal(shorthand.dateRange, null); assert.equal(shorthand.centuries, null);
  for (const row of pack.rows) { assert.equal(row.image, null); assert.equal(row.imageLicenseVerified, false); assert.equal(row.fact, null); assert.equal(row.factStatus, "unverified"); }
  assert.deepEqual(input, original);
});

test("titles and date-display qualifiers survive unchanged and shuffled source order gives identical bytes", () => {
  const input = fixture(); first(input)["title"] = "Textile — 原作 / œuvre “ancienne”";
  const expected = serializeSample(buildSample(input)); input.reverse();
  assert.equal(serializeSample(buildSample(input)), expected); assert.ok(expected.includes("Textile — 原作 / œuvre “ancienne”"));
  const pack = buildSample(fixture());
  assert.ok(pack.rows.some((row) => row.dateDisplay === "late 13th–early 14th century" && row.dateRange === null && row.centuries === null));
  assert.ok(pack.rows.some((row) => row.dateDisplay === "ca. 1500" && row.dateRange === null && row.centuries === null));
});

test("fixture guard rejects bad provenance, unknown fields, invented verification, dates and image permissions", () => {
  const changes: Array<[string, (input: JsonRecord[]) => void]> = [
    ["29 rows", (input) => { input.pop(); }], ["31 rows", (input) => { input.push(structuredClone(first(input))); }],
    ["duplicate object", (input) => { input[1] = structuredClone(first(input)); }],
    ["unknown museum", (input) => { first(input)["museum"] = "Unknown Museum"; }],
    ["empty identifier", (input) => { first(input)["id"] = ""; }],
    ["empty title", (input) => { first(input)["title"] = " "; }],
    ["control-character title", (input) => { first(input)["title"] = "bad\u0000title"; }],
    ["empty date display", (input) => { first(input)["date_display"] = ""; }],
    ["unknown source field", (input) => { first(input)["tracking"] = true; }],
    ["missing source field", (input) => { delete first(input)["source_sha256"]; }],
    ["wrong source URL", (input) => { first(input)["source_url"] = "https://example.invalid/object.json"; }],
    ["invalid source hash", (input) => { first(input)["source_sha256"] = "x".repeat(64); }],
    ["changed pinned source hash", (input) => { first(input)["source_sha256"] = "a".repeat(64); }],
    ["wrong snapshot commit", (input) => { first(input)["snapshot_commit"] = "a".repeat(40); }],
    ["wrong metadata licence", (input) => { first(input)["metadata_license"] = "MIT"; }],
    ["wrong metadata licence source", (input) => { first(input)["metadata_license_source"] = "https://example.invalid/LICENSE"; }],
    ["claimed image download", (input) => { first(input)["image_bytes_downloaded"] = true; }],
    ["claimed independent fact checks", (input) => { first(input)["independent_facts_checked"] = true; }],
    ["invented numeric CH date", (input) => { first(input)["date_start"] = 1720; first(input)["date_end"] = 1720; }],
    ["partially missing AIC range", (input) => { aic(input)["date_end"] = null; }],
    ["year zero", (input) => { aic(input)["date_start"] = 0; }],
    ["fractional year", (input) => { aic(input)["date_start"] = 1865.5; }],
    ["reversed range", (input) => { aic(input)["date_start"] = 1900; }],
    ["out-of-domain year", (input) => { aic(input)["date_end"] = 10000; }],
    ["invalid snapshot timestamp", (input) => { first(input)["snapshot_committed_utc"] = "2017-02-30T19:19:37Z"; }],
    ["invented public-domain status", (input) => { aic(input)["source_is_public_domain"] = false; }],
    ["invalid image identifier", (input) => { aic(input)["image_id"] = "not-a-uuid"; }],
  ];
  for (const [label, change] of changes) { const input = fixture(); change(input); assert.throws(() => buildSample(input), label); }
  for (const input of [null, {}, { rows: [] }, "sample", 30, []]) assert.throws(() => buildSample(input));
});

test("fixture and pack schemas validate official metadata and reject invented media, facts and absent provenance", () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validateFixture = ajv.compile(JSON.parse(readFileSync(join(root, "schemas/fixture.schema.json"), "utf8")) as object);
  const validatePack = ajv.compile(JSON.parse(readFileSync(join(root, "schemas/pack.schema.json"), "utf8")) as object);
  const input = fixture(), pack = buildSample(input);
  assert.equal(validateFixture(input), true, JSON.stringify(validateFixture.errors)); assert.equal(validatePack(pack), true, JSON.stringify(validatePack.errors));
  const missing = structuredClone(input); delete first(missing)["source_sha256"]; assert.equal(validateFixture(missing), false);
  const download = structuredClone(input); first(download)["image_bytes_downloaded"] = true; assert.equal(validateFixture(download), false);
  for (const [key, value] of [["image", { url: "https://example.invalid/image.webp" }], ["fact", "Invented fact"], ["imageLicenseVerified", true]]) {
    assert.ok(typeof key === "string"); const bad = JSON.parse(serializeSample(pack)) as JsonRecord; const row = (bad["rows"] as JsonRecord[])[0]; assert.ok(row); row[key] = value; assert.equal(validatePack(bad), false);
  }
  const extra = JSON.parse(serializeSample(pack)) as JsonRecord; extra["tracking"] = true; assert.equal(validatePack(extra), false);
});

test("raw-source manifest schema and identity/provenance match all 30 normalized museum records", () => {
  const manifest = JSON.parse(readFileSync(join(root, "fixtures/manifest.json"), "utf8")) as JsonRecord;
  const ajv = new Ajv({ allErrors: true, strict: true });
  const validate = ajv.compile(JSON.parse(readFileSync(join(root, "schemas/manifest.schema.json"), "utf8")) as object);
  assert.equal(validate(manifest), true, JSON.stringify(validate.errors));
  assert.equal(manifest["schemaVersion"], 1); assert.equal(manifest["recordCount"], 30);
  const records = manifest["records"] as JsonRecord[], source = fixture(); assert.equal(records.length, source.length);
  assert.equal(new Set(records.map((entry) => entry["filename"])).size, 30);
  assert.equal(new Set(records.map((entry) => `${String(entry["museum"])}:${String(entry["id"])}`)).size, 30);
  records.forEach((entry, index) => {
    const row = source[index]; assert.ok(row);
    assert.equal(entry["museum"], row["museum"]); assert.equal(entry["id"], row["id"]);
    assert.equal(entry["url"], row["source_url"]); assert.equal(entry["sha256"], row["source_sha256"]);
  });
  const traversal = structuredClone(manifest); const record = (traversal["records"] as JsonRecord[])[0]; assert.ok(record); record["filename"] = "../outside.json";
  assert.equal(validate(traversal), false);
  const missing = structuredClone(manifest); (missing["records"] as JsonRecord[]).pop(); assert.equal(validate(missing), false);
});

test("sample serialization equals checked-in bytes and core needs no implicit time or randomness", () => {
  const input = fixture(), pack = buildSample(input), bytes = serializeSample(pack);
  assert.deepEqual(JSON.parse(bytes), pack); assert.ok(bytes.endsWith("\n")); assert.equal(readFileSync(join(root, "data/sample.json"), "utf8"), bytes);
  const originalNow = Date.now, originalRandom = Math.random;
  try {
    Date.now = () => { throw new Error("implicit clock used"); }; Math.random = () => { throw new Error("implicit randomness used"); };
    assert.equal(serializeSample(buildSample(input)), bytes); assert.deepEqual(centuriesPrimary(-101, 101), [-2, -1, 1, 2]);
  } finally { Date.now = originalNow; Math.random = originalRandom; }
});

test("CLI reproduces bytes across time zones and rejects --production while preserving existing output", () => {
  const directory = mkdtempSync(join(tmpdir(), "c04-core-"));
  try {
    const input = join(directory, "source.json"), firstOutput = join(directory, "first.json"), second = join(directory, "second.json"), third = join(directory, "third.json");
    const original = readFileSync(join(root, "fixtures/source.json")); writeFileSync(input, original); const cli = resolve(root, "dist/src/cli.js");
    for (const [target, timezone] of [[firstOutput, "UTC"], [second, "Pacific/Kiritimati"], [third, "America/Los_Angeles"]]) {
      assert.ok(target && timezone);
      const result = spawnSync(process.execPath, [cli, input, target, "--sample"], { cwd: root, encoding: "utf8", env: { ...process.env, TZ: timezone }, timeout: 10000 });
      assert.equal(result.status, 0, result.stderr); assert.equal(result.error, undefined);
    }
    assert.deepEqual(readFileSync(firstOutput), readFileSync(second)); assert.deepEqual(readFileSync(firstOutput), readFileSync(third)); assert.deepEqual(readFileSync(firstOutput), readFileSync(join(root, "data/sample.json")));
    const previous = Buffer.from("preserve existing output on rejected arguments\n"); writeFileSync(firstOutput, previous);
    for (const args of [[input, firstOutput], [input, firstOutput, "--production"], [input, firstOutput, "--sample", "unexpected"]]) {
      const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
      assert.notEqual(result.status, 0); assert.equal(result.error, undefined); assert.deepEqual(readFileSync(firstOutput), previous); assert.deepEqual(readFileSync(input), original);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("CLI source aliases are rejected using disposable direct, normalized, symbolic and hardlink copies", () => {
  const directory = mkdtempSync(join(tmpdir(), "c04-alias-"));
  try {
    const input = join(directory, "source.json"), symbolic = join(directory, "symbolic.json"), hard = join(directory, "hard.json");
    const original = readFileSync(join(root, "fixtures/source.json")); writeFileSync(input, original); symlinkSync(input, symbolic); linkSync(input, hard);
    for (const target of [input, `${directory}/./source.json`, symbolic, hard]) {
      const result = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), input, target, "--sample"], { cwd: root, encoding: "utf8", timeout: 10000 });
      assert.notEqual(result.status, 0); assert.equal(result.error, undefined); assert.match(result.stderr, /different files/);
      for (const path of [input, symbolic, hard]) assert.deepEqual(readFileSync(path), original);
    }
    const invalid = join(directory, "invalid.json"), existing = join(directory, "existing.json"); writeFileSync(invalid, "[]\n"); writeFileSync(existing, "preserved output\n");
    const result = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), invalid, existing, "--sample"], { cwd: root, encoding: "utf8", timeout: 10000 });
    assert.notEqual(result.status, 0); assert.equal(readFileSync(existing, "utf8"), "preserved output\n");
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
