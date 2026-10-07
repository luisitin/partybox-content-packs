import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { linkSync, readFileSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { Ajv } from "ajv";
import {
  buildSample,
  dateToDayPrimary,
  dateToDayReference,
  evaluateEligibilityPrimary,
  evaluateEligibilityReference,
  parseFixture,
  serializeSample,
  type EligibilityCandidate,
} from "../src/build.js";

const root = process.cwd();
const BUILD_DATE = "2026-10-07";
const MIN_DAY = -719162;
type JsonRecord = Record<string, unknown>;
const implementations = [evaluateEligibilityPrimary, evaluateEligibilityReference];
const dateImplementations = [dateToDayPrimary, dateToDayReference];

function fixture(): JsonRecord {
  return JSON.parse(readFileSync(join(root, "fixtures/source.json"), "utf8")) as JsonRecord;
}
function rows(input: JsonRecord): JsonRecord[] {
  return input["rows"] as JsonRecord[];
}
function firstRow(input: JsonRecord): JsonRecord {
  const row = rows(input)[0];
  assert.ok(row);
  return row;
}
function candidate(overrides: Partial<EligibilityCandidate> = {}): EligibilityCandidate {
  return { sitelinks: 60, deathDate: null, verifiedAsOf: BUILD_DATE, portraitVerified: true, ...overrides };
}
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}
function iso(day: number): string {
  return new Date(day * 86400000).toISOString().slice(0, 10);
}
function randomDate(next: () => number): string {
  const year = 1 + Math.floor(next() * 9999);
  const month = 1 + Math.floor(next() * 12);
  const day = 1 + Math.floor(next() * 28);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function generatedCase(next: () => number): { asOf: string; input: EligibilityCandidate } {
  const asOf = randomDate(next);
  const currentDay = dateToDayReference(asOf);
  const age = [0, 1, 29, 30, 31, 365, 36500][Math.floor(next() * 7)];
  assert.notEqual(age, undefined);
  const deathDate = next() < 0.35 ? null : iso(Math.max(MIN_DAY, currentDay - (age as number)));
  const links = [null, 0, 59, 60, 61, 1000][Math.floor(next() * 6)];
  assert.notEqual(links, undefined);
  const verifiedAsOf = next() < 0.75 ? asOf : next() < 0.5 ? null : iso(Math.max(MIN_DAY, currentDay - 1));
  return { asOf, input: { sitelinks: links as number | null, deathDate, verifiedAsOf, portraitVerified: next() < 0.8 } };
}

test("strict Gregorian dates have independently anchored UTC epoch days, including years below 100", () => {
  const anchors: Array<[string, number]> = [
    ["0001-01-01", -719162], ["0099-12-31", -683004], ["0100-01-01", -683003],
    ["1900-01-01", -25567], ["1900-03-01", -25508], ["1969-12-31", -1],
    ["1970-01-01", 0], ["2000-01-01", 10957], ["2000-03-01", 11017],
    ["9999-12-31", 2932896],
  ];
  for (const implementation of dateImplementations) {
    for (const [value, expected] of anchors) assert.equal(implementation(value), expected, value);
    assert.equal(implementation("2000-03-01") - implementation("2000-02-28"), 2);
    assert.equal(implementation("1900-03-01") - implementation("1900-02-28"), 1);
    assert.equal(implementation("2024-03-01") - implementation("2024-02-28"), 2);
  }
});

test("date parsers reject malformed dates, rollover dates, whitespace, and non-Gregorian leap days", () => {
  const invalid = [
    "", "2026-10-7", "2026-1-07", "2026/10/07", "2026-10-07T00:00:00Z", "2026-10-07Z",
    " 2026-10-07", "2026-10-07 ", "2026-10-07\n", "0000-01-01", "10000-01-01",
    "1900-02-29", "2100-02-29", "2000-02-30", "2026-04-31", "2026-13-01", "2026-00-01", "2026-02-00",
  ];
  for (const implementation of dateImplementations) {
    for (const value of invalid) assert.throws(() => implementation(value), value || "empty date");
  }
});

test("eligibility requires current verification, a verified portrait, and at least 60 sitelinks", () => {
  for (const implementation of implementations) {
    assert.equal(implementation(candidate(), BUILD_DATE), "alive");
    assert.equal(implementation(candidate({ sitelinks: 59 }), BUILD_DATE), "not-famous");
    assert.equal(implementation(candidate({ sitelinks: 0 }), BUILD_DATE), "not-famous");
    assert.equal(implementation(candidate({ sitelinks: 61 }), BUILD_DATE), "alive");
    assert.equal(implementation(candidate({ sitelinks: null }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ portraitVerified: false }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ verifiedAsOf: null }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ verifiedAsOf: "2026-10-06" }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ verifiedAsOf: "2026-10-08" }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ sitelinks: 59, portraitVerified: false }), BUILD_DATE), "unverified");
  }
});

test("death exclusion is strictly less than 30 complete UTC days", () => {
  for (const implementation of implementations) {
    assert.equal(implementation(candidate({ deathDate: "2026-10-07" }), BUILD_DATE), "recent-death");
    assert.equal(implementation(candidate({ deathDate: "2026-09-08" }), BUILD_DATE), "recent-death");
    assert.equal(implementation(candidate({ deathDate: "2026-09-07" }), BUILD_DATE), "dead");
    assert.equal(implementation(candidate({ deathDate: "2026-09-06" }), BUILD_DATE), "dead");
    assert.equal(implementation(candidate({ deathDate: "1955-04-18" }), BUILD_DATE), "dead");
    assert.equal(implementation(candidate({ sitelinks: 59, deathDate: "2026-10-07" }), BUILD_DATE), "not-famous");
    assert.equal(implementation(candidate({ verifiedAsOf: "2026-10-06", deathDate: "1955-04-18" }), BUILD_DATE), "unverified");
    assert.equal(implementation(candidate({ verifiedAsOf: "2000-03-30", deathDate: "2000-02-29" }), "2000-03-30"), "dead");
    assert.equal(implementation(candidate({ verifiedAsOf: "2000-03-29", deathDate: "2000-02-29" }), "2000-03-29"), "recent-death");
    assert.equal(implementation(candidate({ verifiedAsOf: "1900-03-30", deathDate: "1900-02-28" }), "1900-03-30"), "dead");
  }
});

test("invalid or future death and invalid build dates cannot hide behind unverified or fame gates", () => {
  for (const implementation of implementations) {
    for (const deathDate of ["2026-10-08", "2026-02-30", "1900-02-29", "bad", "2026-10-07\n"]) {
      assert.throws(() => implementation(candidate({ deathDate }), BUILD_DATE), deathDate);
      assert.throws(() => implementation(candidate({ deathDate, portraitVerified: false, sitelinks: 0 }), BUILD_DATE), deathDate);
    }
    assert.throws(() => implementation(candidate(), "2026-02-30"));
    assert.throws(() => implementation(candidate({ verifiedAsOf: "bad" }), BUILD_DATE));
    for (const sitelinks of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.throws(() => implementation(candidate({ sitelinks }), BUILD_DATE), `invalid sitelinks ${sitelinks}`);
    }
  }
});

test("two independent eligibility implementations agree over 10,000 reproducible random cases", () => {
  const next = random(0xC02D1FF);
  for (let index = 0; index < 10000; index += 1) {
    const { asOf, input } = generatedCase(next);
    assert.equal(evaluateEligibilityPrimary(input, asOf), evaluateEligibilityReference(input, asOf), `differential case ${index}`);
    assert.equal(dateToDayPrimary(asOf), dateToDayReference(asOf), `date case ${index}: ${asOf}`);
  }
});

test("properties hold for seeds 1, 2, 3 and 1,000 stored cryptographically generated random seeds", () => {
  const stored: unknown = JSON.parse(readFileSync(join(root, "test/seeds.json"), "utf8"));
  assert.ok(Array.isArray(stored));
  assert.equal(stored.length, 1000);
  assert.equal(new Set(stored).size, 1000);
  assert.ok(stored.every((value: unknown) => typeof value === "number" && Number.isInteger(value) && value > 3 && value <= 0xFFFFFFFF));
  for (const seed of [1, 2, 3, ...(stored as number[])]) {
    const next = random(seed);
    for (let index = 0; index < 24; index += 1) {
      const { asOf, input } = generatedCase(next);
      const verified = { ...input, sitelinks: 60, verifiedAsOf: asOf, portraitVerified: true };
      const expected = input.deathDate === null ? "alive" : dateToDayReference(asOf) - dateToDayReference(input.deathDate) < 30 ? "recent-death" : "dead";
      for (const implementation of implementations) {
        assert.equal(implementation(verified, asOf), expected, `seed ${seed}, case ${index}`);
        assert.equal(implementation({ ...verified, sitelinks: 10000 }, asOf), expected);
        assert.equal(implementation({ ...verified, sitelinks: 59 }, asOf), "not-famous");
        assert.equal(implementation({ ...verified, portraitVerified: false }, asOf), "unverified");
        assert.equal(implementation({ ...verified, verifiedAsOf: null }, asOf), "unverified");
      }
    }
  }
});

test("source parsing preserves every source field in a detached deep copy", () => {
  const input = fixture();
  const original = structuredClone(input);
  const parsed = parseFixture(input);
  assert.deepEqual(parsed, original);
  assert.notEqual(parsed, input);
  assert.notEqual(parsed.rows, input["rows"]);
  firstRow(input)["name"] = "changed original";
  input["upstream_provenance"] = "changed provenance";
  assert.deepEqual(parsed, original);
});

test("sample keeps 30 genuine historical biographies without manufacturing current answers or assets", () => {
  const input = fixture();
  const original = structuredClone(input);
  const output = buildSample(input, BUILD_DATE);
  const expectedRows = rows(input).map((row) => ({
    id: row["id"], name: row["name"], birthDate: row["birth_date"], recordedDeathDate: row["death_date"],
    status: null, sitelinks: null, portrait: null, fact: null, factStatus: "unverified",
  })).sort((left, right) => String(left.id).localeCompare(String(right.id), "en"));
  assert.deepEqual(output, { mode: "historical-sample", buildDate: BUILD_DATE, sourceSnapshot: "2019-05-14", complete: false, rows: expectedRows });
  assert.equal(output.rows.length, 30);
  assert.equal(output.rows.filter((row) => row.recordedDeathDate !== null).length, 24);
  assert.equal(output.rows.filter((row) => row.recordedDeathDate === null).length, 6);
  assert.deepEqual(input, original);
});

test("aliases and Unicode names survive and input row permutation cannot change serialized bytes", () => {
  const input = fixture();
  firstRow(input)["name"] = "Professor “Curie” / P. Curie — 物理学者";
  const ordered = serializeSample(buildSample(input, BUILD_DATE));
  rows(input).reverse();
  assert.equal(serializeSample(buildSample(input, BUILD_DATE)), ordered);
  assert.ok(ordered.includes("Professor “Curie” / P. Curie — 物理学者"));
  const anotherDate = buildSample(input, "2026-10-08");
  assert.equal(anotherDate.buildDate, "2026-10-08");
  assert.deepEqual(anotherDate.rows, buildSample(input, BUILD_DATE).rows);
});

test("sample guards reject malformed source metadata, source fields, counts, and verification claims", () => {
  const changes: Array<[string, (input: JsonRecord) => void]> = [
    ["wrong kind", (input) => { input["kind"] = "live"; }],
    ["empty source URL", (input) => { input["source_url"] = ""; }],
    ["invalid source hash", (input) => { input["source_sha256"] = "a".repeat(63); }],
    ["uppercase source hash", (input) => { input["source_sha256"] = "A".repeat(64); }],
    ["empty source licence", (input) => { input["source_repository_license"] = ""; }],
    ["empty upstream provenance", (input) => { input["upstream_provenance"] = ""; }],
    ["claimed upstream licence verification", (input) => { input["upstream_license_independently_verified"] = true; }],
    ["claimed current verification", (input) => { input["current_status_verified"] = true; }],
    ["claimed fame verification", (input) => { input["sitelinks_verified"] = true; }],
    ["claimed portrait verification", (input) => { input["portrait_licenses_verified"] = true; }],
    ["malformed snapshot date", (input) => { input["repository_sample_date"] = "2019-02-30"; }],
    ["prize year beyond snapshot", (input) => { input["max_prize_year"] = 2020; }],
    ["nonintegral prize year", (input) => { input["max_prize_year"] = 2016.5; }],
    ["unknown root field", (input) => { input["extra"] = true; }],
    ["missing root field", (input) => { delete input["source_sha256"]; }],
    ["29 rows", (input) => { rows(input).pop(); }],
    ["31 rows", (input) => { rows(input).push({ ...firstRow(input), id: "extra" }); }],
    ["duplicate ID", (input) => { const second = rows(input)[1]; assert.ok(second); second["id"] = firstRow(input)["id"]; }],
    ["blank ID", (input) => { firstRow(input)["id"] = " "; }],
    ["blank name", (input) => { firstRow(input)["name"] = " "; }],
    ["unknown row field", (input) => { firstRow(input)["extra"] = true; }],
    ["missing row field", (input) => { delete firstRow(input)["death_date"]; }],
    ["claimed row verification", (input) => { firstRow(input)["current_status_verified"] = true; }],
    ["invented Wikidata ID", (input) => { firstRow(input)["wikidata_id"] = "Q1"; }],
    ["invented sitelinks", (input) => { firstRow(input)["sitelinks_count"] = 60; }],
    ["invented portrait", (input) => { firstRow(input)["portrait"] = {}; }],
    ["invalid birth date", (input) => { firstRow(input)["birth_date"] = "1900-02-29"; }],
    ["invalid death date", (input) => { firstRow(input)["death_date"] = "1906-04-31"; }],
    ["death precedes birth", (input) => { firstRow(input)["death_date"] = "1800-01-01"; }],
    ["death after source snapshot", (input) => { firstRow(input)["death_date"] = "2020-01-01"; }],
    ["birth after source snapshot", (input) => { firstRow(input)["birth_date"] = "2020-01-01"; }],
    ["inconsistent recorded status", (input) => { firstRow(input)["snapshot_status"] = "no-death-recorded"; }],
    ["row prize beyond coverage", (input) => { firstRow(input)["prize_year"] = 2017; }],
    ["empty prize category", (input) => { firstRow(input)["prize_category"] = ""; }],
  ];
  for (const [label, change] of changes) {
    const input = fixture(); change(input);
    assert.throws(() => buildSample(input, BUILD_DATE), label);
  }
  for (const input of [null, [], "sample", 30, { rows: null }]) assert.throws(() => buildSample(input, BUILD_DATE));
  assert.throws(() => buildSample(fixture(), "2019-05-13"));
  assert.throws(() => buildSample(fixture(), "2026-02-30"));
});

test("fixture and output schemas validate genuine data and reject missing, extra, or invented fields", () => {
  const ajv = new Ajv({ allErrors: true, strict: true });
  const fixtureSchema = JSON.parse(readFileSync(join(root, "schemas/fixture.schema.json"), "utf8")) as object;
  const packSchema = JSON.parse(readFileSync(join(root, "schemas/pack.schema.json"), "utf8")) as object;
  const validateFixture = ajv.compile(fixtureSchema);
  const validatePack = ajv.compile(packSchema);
  const input = fixture();
  const pack = buildSample(input, BUILD_DATE);
  assert.equal(validateFixture(input), true, JSON.stringify(validateFixture.errors));
  assert.equal(validatePack(pack), true, JSON.stringify(validatePack.errors));
  const badInput = structuredClone(input); delete badInput["source_sha256"];
  assert.equal(validateFixture(badInput), false);
  const badClaim = structuredClone(input); firstRow(badClaim)["current_status_verified"] = true;
  assert.equal(validateFixture(badClaim), false);
  const badPack = JSON.parse(serializeSample(pack)) as JsonRecord;
  firstRow(badPack)["status"] = "alive";
  assert.equal(validatePack(badPack), false);
  const unknown = JSON.parse(serializeSample(pack)) as JsonRecord; unknown["tracking"] = "unexpected";
  assert.equal(validatePack(unknown), false);
  const missing = JSON.parse(serializeSample(pack)) as JsonRecord; delete firstRow(missing)["portrait"];
  assert.equal(validatePack(missing), false);
});

test("sample serialization is stable and byte-identical to the checked-in build", () => {
  const output = buildSample(fixture(), BUILD_DATE);
  const bytes = serializeSample(output);
  assert.deepEqual(JSON.parse(bytes), output);
  assert.ok(bytes.endsWith("\n"));
  assert.equal(serializeSample(buildSample(fixture(), BUILD_DATE)), bytes);
  assert.equal(readFileSync(join(root, "data/sample.json"), "utf8"), bytes);
});

test("pure core uses only explicit dates and no implicit clock or randomness", () => {
  const input = fixture();
  const expected = serializeSample(buildSample(input, BUILD_DATE));
  const originalNow = Date.now;
  const originalRandom = Math.random;
  try {
    Date.now = () => { throw new Error("implicit clock used"); };
    Math.random = () => { throw new Error("implicit randomness used"); };
    assert.equal(serializeSample(buildSample(input, BUILD_DATE)), expected);
    assert.equal(evaluateEligibilityPrimary(candidate(), BUILD_DATE), "alive");
    assert.equal(evaluateEligibilityReference(candidate(), BUILD_DATE), "alive");
  } finally {
    Date.now = originalNow;
    Math.random = originalRandom;
  }
});

test("CLI rebuilds identical sample bytes across runs and time zones and rejects incomplete arguments", () => {
  const directory = mkdtempSync(join(tmpdir(), "c02-core-"));
  try {
    const input = join(directory, "source.json");
    const first = join(directory, "first.json");
    const second = join(directory, "second.json");
    const third = join(directory, "third.json");
    const sourceBytes = readFileSync(join(root, "fixtures/source.json"));
    writeFileSync(input, sourceBytes);
    const cli = resolve(root, "dist/src/cli.js");
    for (const [target, timezone] of [[first, "UTC"], [second, "Pacific/Kiritimati"], [third, "America/Los_Angeles"]]) {
      assert.ok(target); assert.ok(timezone);
      const result = spawnSync(process.execPath, [cli, input, target, "--sample", "--build-date", BUILD_DATE], {
        cwd: root, encoding: "utf8", env: { ...process.env, TZ: timezone }, timeout: 10000,
      });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.error, undefined);
    }
    assert.deepEqual(readFileSync(first), readFileSync(second));
    assert.deepEqual(readFileSync(first), readFileSync(third));
    assert.deepEqual(readFileSync(first), readFileSync(join(root, "data/sample.json")));
    assert.deepEqual(readFileSync(input), sourceBytes);
    const existingOutput = Buffer.from("preserve existing output when arguments are rejected\n");
    writeFileSync(first, existingOutput);
    for (const args of [
      [input, first],
      [input, first, "--sample"],
      [input, first, "--sample", "--build-date", "2026-02-30"],
      [input, first, "--production", "--build-date", BUILD_DATE],
    ]) {
      const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8", timeout: 10000 });
      assert.notEqual(result.status, 0);
      assert.equal(result.error, undefined);
      assert.deepEqual(readFileSync(first), existingOutput);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("CLI protects its source against direct, normalized-path, symlink, and hardlink output aliases", () => {
  const directory = mkdtempSync(join(tmpdir(), "c02-alias-"));
  try {
    const input = join(directory, "source.json");
    const symbolic = join(directory, "symbolic.json");
    const hard = join(directory, "hard.json");
    const original = readFileSync(join(root, "fixtures/source.json"));
    writeFileSync(input, original);
    symlinkSync(input, symbolic);
    linkSync(input, hard);
    for (const target of [input, join(directory, "subdirectory", "..", "source.json"), symbolic, hard]) {
      const result = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), input, target, "--sample", "--build-date", BUILD_DATE], {
        cwd: root, encoding: "utf8", timeout: 10000,
      });
      assert.notEqual(result.status, 0, target);
      assert.equal(result.error, undefined);
      assert.match(result.stderr, /different files/);
      assert.deepEqual(readFileSync(input), original);
      assert.deepEqual(readFileSync(symbolic), original);
      assert.deepEqual(readFileSync(hard), original);
    }
    const invalid = join(directory, "invalid.json");
    const existingOutput = join(directory, "existing.json");
    writeFileSync(invalid, '{"rows":[]}\n');
    writeFileSync(existingOutput, "preserve existing output\n");
    const failed = spawnSync(process.execPath, [resolve(root, "dist/src/cli.js"), invalid, existingOutput, "--sample", "--build-date", BUILD_DATE], {
      cwd: root, encoding: "utf8", timeout: 10000,
    });
    assert.notEqual(failed.status, 0);
    assert.equal(readFileSync(existingOutput, "utf8"), "preserve existing output\n");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
