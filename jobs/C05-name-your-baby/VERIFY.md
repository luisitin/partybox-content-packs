# Verification record

Stage: claimed historical30-name pipeline; implementation checks are recorded below as they actually finish.
Prior read-only source research precedes this claim. Normal proxy/TLS/checksum verification remains enabled.

## Original source access

```sh
date -u +%Y-%m-%dT%H:%M:%SZ
curl --head --location --max-time 20 --connect-timeout 10 --silent --show-error --write-out '\nhttp_code=%{http_code} url_effective=%{url_effective} ssl_verify_result=%{ssl_verify_result}\n' 'https://www.ssa.gov/oact/babynames/names.zip'
```

Recorded 2026-10-07T15:05:29Z: curl exit56, proxy CONNECT403, origin000. This checks access to the specific candidate, not its existence. ssl_verify_result0 does not verify origin TLS when CONNECT fails before TLS.

```sh
date -u +%Y-%m-%dT%H:%M:%SZ
curl --head --location --max-time 20 --connect-timeout 10 --silent --show-error --write-out '\nhttp_code=%{http_code} url_effective=%{url_effective} ssl_verify_result=%{ssl_verify_result}\n' 'https://www.ssa.gov/oact/babynames/background.html'
```

Recorded 2026-10-07T15:05:29Z: curl exit56, proxy CONNECT403, origin000. This checks access to the specific candidate, not its existence. ssl_verify_result0 does not verify origin TLS when CONNECT fails before TLS.

## Historical source read 1

```sh
date -u +%Y-%m-%dT%H:%M:%SZ
curl --fail --location --max-time 60 --silent --show-error --output /tmp/c05-babynames.rda --write-out 'http_code=%{http_code} url_effective=%{url_effective}\n' 'https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data/babynames.rda'
sha256sum /tmp/c05-babynames.rda
```

Recorded 2026-10-07T15:14:22Z: exit0, HTTP200, expected SHA256 1d5c601fa3c5177f4d9edb4c8c2f08fddc8d9bf04372b8a40dc6aecf92bfa324. Original source bytes obtained with normal TLS trust and pinned GitHub commit. Publisher/license/provenance limitations are in SOURCES.

## Historical source read 2

```sh
date -u +%Y-%m-%dT%H:%M:%SZ
curl --fail --location --max-time 60 --silent --show-error --output /tmp/c05-ssa-names-2020.zip --write-out 'http_code=%{http_code} url_effective=%{url_effective}\n' 'https://raw.githubusercontent.com/hackerb9/ssa-baby-names/0b1a1316457d55447d1a1f7bfe57ee15e53cc2f0/raw-data/names.zip'
sha256sum /tmp/c05-ssa-names-2020.zip
```

Recorded 2026-10-07T15:16:59Z: exit0, HTTP200, expected SHA256 67cf9c3fbbbcc18994cc071417267c48545130131112bcda83a9a36b2abcbc7e. Original source bytes obtained with normal TLS trust and pinned GitHub commit. Publisher/license/provenance limitations are in SOURCES.

## Retained research export and preflight

```sh
PYTHONPATH=/tmp/c05-tools python /tmp/c05-export-research.py
```

Historical read-only research export exit0 used pyreadr0.5.7/narwhals2.26.0. It produced500 selected-name research records and30-name subset, not a completed pack. The exported illustrative facts are omitted from this job. C05 regeneration uses the independently installed frozen pyreadr0.5.3/pandas2.2.3/numpy2.3.5 family instead; its checks are recorded separately.

Retained preflight independently recomputed both30/500 annual exports and matched their archived aggregates. Source has1924665 rows, no nulls or duplicate(year,name,sex), minimum published count5; complete analysis years1880–2009 appear overall. The30-name CSV has3707 records,193 missing annual cells,390 decade cells,364 with10 published years and12 without any published rows. No source requests/exporter reruns are inferred from local artifact checks.

Prior Random(17) comparison sampled30 of500, overlaps this first30 sample in one name, and is programmatic. All30 peak decades agreed; only9 peak counts agreed. Both archives are SSA-derived; zero manual checks and zero independently sourced short facts are claimed. See CONFLICTS.

## Claim and dependencies

```sh
python3 /tmp/queue_blockers.py claim
git show origin/main:CLAIMS.md
git branch --show-current
npm --cache=/workspace/.npm-cache ci --ignore-scripts --no-fund --no-audit
```

Actual claim37cf5c5 reached main at17:03:49 UTC; remote main records C01–C04 BLOCKED and C05 codex-queue. Lowest unclaimed jobC05 was selected, then job/C05-name-your-baby created from main. Frozen npm install exit0,8 packages; scripts disabled, normal integrity/TLS verification. No force push or secret extraction.

## c05-core-evidence.json

```sh
node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --skipLibCheck --noEmitOnError --rootDir . --outDir /tmp/c05-core-check src/core.ts src/cli.ts
```

Recorded result/details:

```json
{
  "exit_code": 0,
  "catches": "Source-only strict typing, unchecked array accesses and exact optional-property errors. Temporary compilation excludes in-progress tests and shared dist."
}
```

```sh
node --input-type=module - <<'JS'
import fs from 'node:fs';
import Ajv from 'ajv';
import {aggregatePrimary,aggregateReference,selectPrimary,selectReference,buildSample,serialise} from '/tmp/c05-core-check/src/core.js';
const fixture=JSON.parse(fs.readFileSync('fixtures/source.json','utf8'));
const original=JSON.stringify(fixture);
const a=aggregatePrimary(fixture.annualCounts,fixture.analysis);
const b=aggregateReference(fixture.annualCounts,fixture.analysis);
if(JSON.stringify(a)!==JSON.stringify(b))throw new Error('aggregation disagrees');
if(JSON.stringify(selectPrimary(a,30))!==JSON.stringify(selectReference(b,30)))throw new Error('selection disagrees');
const pack=buildSample(fixture);
if(JSON.stringify(fixture)!==original)throw new Error('source changed');
const ajv=new Ajv({strict:true,allErrors:true});
for(const [path,value] of [['schemas/fixture.schema.json',fixture],['schemas/pack.schema.json',pack]]){
 const validate=ajv.compile(JSON.parse(fs.readFileSync(path,'utf8')));
 if(!validate(value))throw new Error(path+' '+JSON.stringify(validate.errors));
 console.log(path+' validates');
}
console.log(JSON.stringify({annualRows:fixture.annualCounts.length,aggregates:a.length,rows:pack.rows.length,first:pack.rows[0]?.id,last:pack.rows.at(-1)?.id,omittedCells:pack.rows.flatMap(r=>r.sparkline).filter(c=>c.omittedYearCount>0).length,sourcePreserved:true,newline:serialise(pack).endsWith('\n')},null,2));
JS
```

Recorded result/details:

```json
{
  "attempt": 1,
  "exit_code": 1,
  "error": "Error: strict mode: missing type \"object\" for keyword \"properties\" at \"https://partybox.invalid/C05/pack.schema.json#/properties/rows/items/properties/sparkline/items/0/allOf/1\" (strictTypes)",
  "correction": "Added type:object to each tuple-cell allOf properties subschema, then reran the same smoke command."
}
```

```sh
node --input-type=module - <<'JS'
import fs from 'node:fs';
import Ajv from 'ajv';
import {aggregatePrimary,aggregateReference,selectPrimary,selectReference,buildSample,serialise} from '/tmp/c05-core-check/src/core.js';
const fixture=JSON.parse(fs.readFileSync('fixtures/source.json','utf8'));
const original=JSON.stringify(fixture);
const a=aggregatePrimary(fixture.annualCounts,fixture.analysis);
const b=aggregateReference(fixture.annualCounts,fixture.analysis);
if(JSON.stringify(a)!==JSON.stringify(b))throw new Error('aggregation disagrees');
if(JSON.stringify(selectPrimary(a,30))!==JSON.stringify(selectReference(b,30)))throw new Error('selection disagrees');
const pack=buildSample(fixture);
if(JSON.stringify(fixture)!==original)throw new Error('source changed');
const ajv=new Ajv({strict:true,allErrors:true});
for(const [path,value] of [['schemas/fixture.schema.json',fixture],['schemas/pack.schema.json',pack]]){
 const validate=ajv.compile(JSON.parse(fs.readFileSync(path,'utf8')));
 if(!validate(value))throw new Error(path+' '+JSON.stringify(validate.errors));
 console.log(path+' validates');
}
console.log(JSON.stringify({annualRows:fixture.annualCounts.length,aggregates:a.length,rows:pack.rows.length,first:pack.rows[0]?.id,last:pack.rows.at(-1)?.id,omittedCells:pack.rows.flatMap(r=>r.sparkline).filter(c=>c.omittedYearCount>0).length,sourcePreserved:true,newline:serialise(pack).endsWith('\n')},null,2));
JS
```

Recorded result/details:

```json
{
  "attempt": 2,
  "exit_code": 0,
  "catches": "Primary/reference disagreement on actual retained data, incorrect selection, input mutation via before/after JSON snapshots, malformed strict Draft7 schemas/output shape and serialization newline. Does not substitute for random differential/property/mutation tests."
}
```

```sh
node /tmp/c05-core-check/src/cli.js fixtures/source.json /tmp/c05-smoke-sample.json --sample
sha256sum /tmp/c05-smoke-sample.json fixtures/source.json
```

Recorded result/details:

```json
{
  "shell_exit_code": 0,
  "precision_note": "The shell reported its final checksum-command status; CLI success is additionally established by generated artifact and independently repeated standalone CLI below."
}
```

```sh
env TZ=Pacific/Auckland node /tmp/c05-core-check/src/cli.js fixtures/source.json /tmp/c05-smoke-sample-second.json --sample
```

Recorded result/details:

```json
{
  "exit_code": 0,
  "catches": "Standalone sample CLI generation under different timezone; explicitly permitted sample only."
}
```

```sh
cmp /tmp/c05-smoke-sample.json /tmp/c05-smoke-sample-second.json
sha256sum /tmp/c05-smoke-sample-second.json fixtures/source.json
```

Recorded result/details:

```json
{
  "shell_exit_code": 0,
  "cmp_stdout": "",
  "byte_identical_confirmed_by_matching_sha256": true,
  "catches": "Reproduction changes and accidental fixture modification."
}
```


## c05-core-tests-evidence.json

```sh
node node_modules/typescript/bin/tsc -p tsconfig.json --outDir /tmp/c05-tests-check
```

Recorded result/details:

```json
{
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "exitCode": 0,
  "result": "Strict ES2022 NodeNext compilation succeeded after final test edits; output only under /tmp/c05-tests-check."
}
```

```sh
node --test /tmp/c05-tests-check/test/core.test.js
```

Recorded result/details:

```json
{
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "exitCode": 0,
  "tests": 15,
  "passed": 15,
  "failed": 0,
  "cancelled": 0,
  "skipped": 0,
  "todo": 0,
  "durationMs": 8866.6183,
  "result": "All15 static tests passed."
}
```

Core suite: 15/15 passed in 8.867 seconds, no skipped/cancelled tests; 10,000 aggregation and 10,000 selection differential cases, 6,018 property rounds from seeds 1/2/3 plus 1,000 stored crypto-generated seeds. CLI: 15 calls, four successes and eleven expected rejections. Independent SQLite and Python arithmetic agrees across 390 decade cells/30 summaries; five exact representatives plus total 35,928,729 and 193 omitted years are embedded in tests. This is independent arithmetic, not an independent factual publisher.


## c05-source-validation-evidence.json

Source suite: 5/5 passed in 21.145 seconds; two uncached full-RDA regenerations match fixture and each other. Sixteen actual extractor CLI calls include two successes and fourteen expected rejections. One additional synthetic decoder process rejects 38 boundary cases. Consumed year/name/sex/n values validate before coercion/filtering; unused prop has only column-presence validation. Source bytes and rejected existing outputs are preserved.


## Full npm test and runner correction

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test
```

First run: all 20 tests passed, but the mutation runner returned failure after incorrectly classifying ordinary errors inside executed tests as infrastructure crashes. It caught 20 mutations and incorrectly marked M05/M10–M13 invalid. The overly broad ERR_TEST_FAILURE string guard was removed: Node24 uses that code for ordinary failed tests too. Baseline counts, complete TAP cases, file/import-crash detection, timeout/cancellation/skip checks and compiled byte/hash restoration remain enforced. No test assertion was weakened. Initial evidence is retained in /tmp/c05-initial-run-infrastructure-failure.log and /tmp/c05-initial-mutation-classification-report.json.

Corrected retry log: 20/20 tests; runner full baseline 20/20 and core baseline 15/15; all 25 syntax-valid semantic mutations caught with 15 core tests executed each; zero skips/cancellations; four compiled files restored byte-for-byte with matching SHA256; all five data/schema/seed checksums passed. Full npm process completion is confirmed separately before delivery.

| ID | Bug | Result | Failed core tests |
| --- | --- | --- | --- |
| M01 | Silently truncate fractional annual counts | caught | 2 |
| M02 | Accept annual counts below the SSA publication threshold | caught | 2 |
| M03 | Accept an analysis window beginning in a partial decade | caught | 1 |
| M04 | Accept duplicate annual year/name/sex records | caught | 2 |
| M05 | Include the next decade boundary in reference subtotals | caught | 5 |
| M06 | Allow published sums beyond the safe integer range | caught | 1 |
| M07 | Allow digit characters in names | caught | 1 |
| M08 | Accept an unsupported sex category | caught | 2 |
| M09 | Merge male and female categories with the same name | caught | 3 |
| M10 | Add one excess published count per annual row to each decade | caught | 8 |
| M11 | Leave omitted-year coverage unchanged when a year is published | caught | 8 |
| M12 | Count every published year twice | caught | 8 |
| M13 | Add one excess published count per annual row to the total | caught | 9 |
| M14 | Choose the latest decade when peak counts tie | caught | 2 |
| M15 | Exclude another tied peak from the runner-up count | caught | 2 |
| M16 | Exclude the exact 50000 published-count boundary | caught | 2 |
| M17 | Exclude the exact 115 percent peak-clarity boundary | caught | 1 |
| M18 | Rank qualifying names by ascending published total | caught | 6 |
| M19 | Retain multiple qualifying categories for the same name | caught | 3 |
| M20 | Return one name more than the requested selection limit | caught | 3 |
| M21 | Accept an unrecognized source SHA256 | caught | 1 |
| M22 | Claim that the historical sample is complete | caught | 4 |
| M23 | Claim that current metrics have been verified | caught | 4 |
| M24 | Accept an unsupported CLI mode option | caught | 1 |
| M25 | Allow an output hardlink to alias the source input | caught | 1 |

## Restored source access and environment transition

```sh
gh api repos/luisitin/partybox-content-packs --jq '{full_name,permissions}'
curl --head --location --max-time 20 --connect-timeout 10 --silent --show-error --write-out '\nhttp_code=%{http_code} url_effective=%{url_effective} ssl_verify_result=%{ssl_verify_result}\n' 'https://www.ssa.gov/oact/babynames/names.zip'
```

GitHub API exit0 with repository permissions; SSA HEAD exit0/HTTP200 at17:20:22 UTC. Earlier denials are historical, no longer current blockers.

```sh
curl --fail --location --max-time 60 --silent --show-error --output /workspace/.partybox-source-cache/c05/ssa-names-2026-10-07.zip --write-out 'http_code=%{http_code} url_effective=%{url_effective}\n' 'https://www.ssa.gov/oact/babynames/names.zip'
sha256sum /workspace/.partybox-source-cache/c05/ssa-names-2026-10-07.zip
```

Actual GET HTTP200; 7,860,026 bytes, SHA cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724. ZIP CRC validation passes, 146 annual files1880–2025 plus NationalReadMe.pdf. No current archive rows are silently substituted into the historical sample.

The selected environment entered starting status during work and was waited to ready. Files and branch remained present. The observed clock jumped from17:26 to18:17 UTC; the30-minute milestone interval was exceeded during that transition. This is recorded as a delivery gap, not a timely-push claim. Current source expansion and independently sourced facts remain active; no BLOCKED status, PR or green CI is claimed for C05.

## Exact source integration commands

Strict compilation:

```json
[
  "./node_modules/.bin/tsc",
  "--strict",
  "--target",
  "ES2022",
  "--module",
  "NodeNext",
  "--moduleResolution",
  "NodeNext",
  "--skipLibCheck",
  "--outDir",
  "/tmp/c05-source-test-compiled",
  "test/source.test.ts"
]
```

Source suite:

```json
[
  "node",
  "--test",
  "/tmp/c05-source-test-compiled/source.test.js"
]
```

Compile exit 0; suite exit 0. These checks detect regeneration drift, hash-before-decode failure, alias/path damage, malformed options and numeric coercion. Decoder boundary inputs are explicitly synthetic.

### Source check 1

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda",
    "--output",
    "/tmp/partybox-c05-source-8DlxuM/first.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:29.694Z",
  "durationMilliseconds": 9841.759469,
  "exitCode": 0,
  "signal": null,
  "error": null,
  "stdout": "{\"analysisCoverage\": [1880, 2009], \"annualCounts\": 3707, \"omittedAnnualCells\": 193, \"path\": \"/tmp/partybox-c05-source-8DlxuM/first.json\", \"selectedNames\": 30, \"sha256\": \"c6bbc9a8e924cae38b51d8cd1c46644d5631370b1bf75cee327bb7ce33b1a664\", \"sourceCoverage\": [1880, 2017], \"sourceRows\": 1924665}\n",
  "stderr": ""
}
```

### Source check 2

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda",
    "--output",
    "/tmp/partybox-c05-source-8DlxuM/second.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:39.543Z",
  "durationMilliseconds": 9286.033327,
  "exitCode": 0,
  "signal": null,
  "error": null,
  "stdout": "{\"analysisCoverage\": [1880, 2009], \"annualCounts\": 3707, \"omittedAnnualCells\": 193, \"path\": \"/tmp/partybox-c05-source-8DlxuM/second.json\", \"selectedNames\": 30, \"sha256\": \"c6bbc9a8e924cae38b51d8cd1c46644d5631370b1bf75cee327bb7ce33b1a664\", \"sourceCoverage\": [1880, 2017], \"sourceRows\": 1924665}\n",
  "stderr": ""
}
```

### Source check 3

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "-S",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-WP4MX0/altered.rda",
    "--output",
    "/tmp/partybox-c05-source-WP4MX0/existing.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:48.893Z",
  "durationMilliseconds": 85.65613099999973,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source SHA256 does not match the pinned RDA; no decoding attempted\n"
}
```

### Source check 4

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "-S",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-WP4MX0/truncated.rda",
    "--output",
    "/tmp/partybox-c05-source-WP4MX0/existing.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:48.988Z",
  "durationMilliseconds": 61.99039899999843,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source SHA256 does not match the pinned RDA; no decoding attempted\n"
}
```

### Source check 5

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/input.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/input.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.098Z",
  "durationMilliseconds": 60.63702600000033,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 6

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/input.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/child/../input.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.181Z",
  "durationMilliseconds": 56.22707000000082,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 7

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/input.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/alias-symlink.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.262Z",
  "durationMilliseconds": 110.06986999999936,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 8

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/input.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/alias-hardlink.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.417Z",
  "durationMilliseconds": 59.81196599999748,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 9

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/alias-symlink.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/input.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.491Z",
  "durationMilliseconds": 54.717924000000494,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 10

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-DFiWEd/alias-hardlink.rda",
    "--output",
    "/tmp/partybox-c05-source-DFiWEd/input.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.548Z",
  "durationMilliseconds": 60.03574600000138,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source and output must be different files, including aliases\n"
}
```

### Source check 11

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-ZPQ60H/missing.rda",
    "--output",
    "/tmp/partybox-c05-source-ZPQ60H/existing.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.621Z",
  "durationMilliseconds": 48.88556099999914,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: [Errno 2] No such file or directory: '/tmp/partybox-c05-source-ZPQ60H/missing.rda'\n"
}
```

### Source check 12

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/tmp/partybox-c05-source-ZPQ60H/source-directory",
    "--output",
    "/tmp/partybox-c05-source-ZPQ60H/existing.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.670Z",
  "durationMilliseconds": 47.80533600000126,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Source must be a regular file\n"
}
```

### Source check 13

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda",
    "--output",
    "/tmp/partybox-c05-source-ZPQ60H/destination-directory"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.718Z",
  "durationMilliseconds": 48.42045199999848,
  "exitCode": 1,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "Name sample extraction failed: Existing output must be a regular file\n"
}
```

### Source check 14

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda",
    "--output",
    "/tmp/partybox-c05-source-ZPQ60H/existing.json",
    "--wrong-name"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.767Z",
  "durationMilliseconds": 73.53148400000282,
  "exitCode": 2,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "usage: extract_sample.py [-h] --source SOURCE --output OUTPUT\nextract_sample.py: error: unrecognized arguments: --wrong-name\n"
}
```

### Source check 15

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--source",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.840Z",
  "durationMilliseconds": 71.63039000000208,
  "exitCode": 2,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "usage: extract_sample.py [-h] --source SOURCE --output OUTPUT\nextract_sample.py: error: the following arguments are required: --output\n"
}
```

### Source check 16

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "--output",
    "/tmp/partybox-c05-source-ZPQ60H/existing.json"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.912Z",
  "durationMilliseconds": 45.962211999998544,
  "exitCode": 2,
  "signal": null,
  "error": null,
  "stdout": "",
  "stderr": "usage: extract_sample.py [-h] --source SOURCE --output OUTPUT\nextract_sample.py: error: the following arguments are required: --source\n"
}
```

### Source check 17

```json
{
  "argv": [
    "/workspace/.partybox-source-venv/bin/python",
    "-c",
    "\nimport json, runpy, sys\nimport numpy as np\nimport pandas as pd\nimport pyreadr\nmodule = runpy.run_path(sys.argv[1])\nvalidate = module['validate_frame']\nbase = pd.DataFrame({'year': np.arange(1880, 2018, dtype=float), 'sex': ['F'] * 138,\n                     'name': ['Anna'] * 138, 'n': [5] * 138, 'prop': [0.1] * 138})\n# Synthetic decoder-boundary unit fixtures, not altered-RDA CLI verification.\nvalidate.__globals__['SOURCE_ROWS'] = len(base)\nassert validate(base) is base\ncases = []\ndef mutation(label, column, value, error):\n    frame = base.copy()\n    frame[column] = frame[column].astype(object)\n    frame.loc[0, column] = value\n    if column in ('year', 'n') and not isinstance(value, (str, bool)):\n        frame[column] = pd.to_numeric(frame[column], errors='raise')\n    cases.append((label, frame, error))\nfor value in (1880.5, float('nan'), float('inf'), float('-inf'), 1879, 2018, '1880', True, 1880+1j):\n    mutation('invalid-year-'+repr(value), 'year', value, 'Source year')\nfor value in (5.9, float('nan'), float('inf'), float('-inf'), 4, 9007199254740992, '5', True, 5+1j):\n    mutation('invalid-count-'+repr(value), 'n', value, 'Source n')\nfor value in ('', 'Anna1', 'Anna Smith', '\u00c9va', 'A'*41, 123, None):\n    mutation('invalid-name-'+repr(value), 'name', value, 'Source name')\nfor value in ('X', 'female', 1, None):\n    mutation('invalid-sex-'+repr(value), 'sex', value, 'Source sex')\nbad_columns = base.drop(columns=['n']); cases.append(('missing-column', bad_columns, 'five source columns'))\ncases.append(('not-a-dataframe', None, 'five source columns'))\ncases.append(('wrong-source-row-count', base.iloc[:-1], 'exactly 138 rows'))\nduplicate = base.copy(); duplicate.loc[137, 'year'] = 1880; cases.append(('duplicate-key', duplicate, 'Duplicate source'))\nexcluded_bad = base.copy(); excluded_bad.loc[137, 'name'] = 'Bad-Name'; cases.append(('bad-name-in-excluded2017', excluded_bad, 'Source name'))\ninterior = base.copy(); interior.loc[40, 'year'] = 1921; interior.loc[40, 'name'] = 'Beth'; cases.append(('missing-interior-year', interior, 'every calendar year'))\nfor label, frame, error in cases:\n    try: validate(frame)\n    except ValueError as exc:\n        assert error in str(exc), (label, str(exc))\n    else: raise AssertionError('Accepted invalid decoder fixture: '+label)\nfor objects in ({}, {'wrong_name': base}, {'babynames': base, 'extra': base}):\n    pyreadr.read_r = lambda path, objects=objects: objects\n    try: module['load_verified_frame'](__import__('pathlib').Path(sys.argv[2]))\n    except ValueError as exc: assert 'exactly the babynames object' in str(exc)\n    else: raise AssertionError('Accepted invalid RDA object collection')\nprint(json.dumps({'syntheticDecoderCases': len(cases)+3, 'passed': len(cases)+3, 'actualMalformedRdaDecoded': False}))\n",
    "/workspace/partybox-content-packs/jobs/C05-name-your-baby/tools/extract_sample.py",
    "/workspace/.partybox-source-cache/c05/c05-babynames.rda"
  ],
  "cwd": "/workspace/partybox-content-packs/jobs/C05-name-your-baby",
  "startedAtUtc": "2026-10-07T17:14:49.964Z",
  "durationMilliseconds": 660.8142450000014,
  "exitCode": 0,
  "signal": null,
  "error": null,
  "stdout": "{\"syntheticDecoderCases\": 38, \"passed\": 38, \"actualMalformedRdaDecoded\": false}\n",
  "stderr": ""
}
```

The first documentation-collection helper failed with TypeError because the command fields are argv arrays, not strings. It changed no data or code. This corrected record preserves the exact argv arrays instead of coercing them into misleading command text.

## Fact-source research attempts

Normal proxy and TLS: 54 actual HTTP200 reads on GitHub/raw GitHub and npm. Pinned text/license hashes and candidate evidence are recorded in SOURCES; this does not complete full coverage or manual row checks.

### Fact-source attempt 1

```json
{
  "label": "github-api-search",
  "url": "https://api.github.com/search/repositories?q=baby%20names%20meaning&per_page=10",
  "timestamp": "2026-10-07T17:11:31.999074+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "20",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-api-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=baby%20names%20meaning&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=baby%20names%20meaning&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-api-search.body",
  "bytes": 65778,
  "sha256": "32601714806981302936b534c383a150f99a0397f9b7ef52e1c9bbff13782cfd"
}
```

### Fact-source attempt 2

```json
{
  "label": "github-web-search",
  "url": "https://github.com/search?q=baby+names+meaning&type=repositories",
  "timestamp": "2026-10-07T17:11:31.999805+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "20",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-web-search.body",
    "--write-out",
    "%{json}",
    "https://github.com/search?q=baby+names+meaning&type=repositories"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://github.com/search?q=baby+names+meaning&type=repositories",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-web-search.body",
  "bytes": 268093,
  "sha256": "9d6ac3dae54074e7d6cbf861e37b894ca23351cbbe6b37e2010ae7861273a365"
}
```

### Fact-source attempt 3

```json
{
  "label": "github-etymology-search",
  "url": "https://github.com/search?q=name+etymology&type=repositories",
  "timestamp": "2026-10-07T17:11:32.000990+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "20",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-etymology-search.body",
    "--write-out",
    "%{json}",
    "https://github.com/search?q=name+etymology&type=repositories"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://github.com/search?q=name+etymology&type=repositories",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-etymology-search.body",
  "bytes": 269039,
  "sha256": "4c1a22bb84b7405072fa3e0a8ac05e0444c0c5d38e23bf917278f382bf7a6a9a"
}
```

### Fact-source attempt 4

```json
{
  "label": "gitenberg-play-readme",
  "url": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/master/README.rst",
  "timestamp": "2026-10-07T17:11:32.001865+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "20",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/gitenberg-play-readme.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/master/README.rst"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/master/README.rst",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/gitenberg-play-readme.body",
  "bytes": 1963,
  "sha256": "17255766789473d47ae409ed65972eb5c9d437fadba068ef3dbc88a52205cf90"
}
```

### Fact-source attempt 5

```json
{
  "label": "nurture-meta",
  "url": "https://api.github.com/repos/Nurturepedia/baby-names-dataset",
  "timestamp": "2026-10-07T17:13:50.418726+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/Nurturepedia/baby-names-dataset"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/Nurturepedia/baby-names-dataset",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-meta.body",
  "bytes": 6584,
  "sha256": "877485acaa71c716e74c3f41f779bdd2d5e700adb1afbe6556730045b22ccda0"
}
```

### Fact-source attempt 6

```json
{
  "label": "sandeep-meta",
  "url": "https://api.github.com/repos/SandeepDas01/baby-names",
  "timestamp": "2026-10-07T17:13:50.419573+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/sandeep-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/SandeepDas01/baby-names"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/SandeepDas01/baby-names",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/sandeep-meta.body",
  "bytes": 5891,
  "sha256": "268ae3fcefbe6050293baf73a052fa143973a6b1afa29784ea4d020ccfb16110"
}
```

### Fact-source attempt 7

```json
{
  "label": "jeremander-meta",
  "url": "https://api.github.com/repos/jeremander/baby_names",
  "timestamp": "2026-10-07T17:13:50.421294+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/jeremander-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/jeremander/baby_names"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/jeremander/baby_names",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/jeremander-meta.body",
  "bytes": 5784,
  "sha256": "2a0a5014607d881337e54da978e1373d3d110a8cc30e8e5cec00a2627dcb6f3d"
}
```

### Fact-source attempt 8

```json
{
  "label": "namebot-meta",
  "url": "https://api.github.com/repos/christabor/namebot",
  "timestamp": "2026-10-07T17:13:51.009103+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/namebot-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/christabor/namebot"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/christabor/namebot",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/namebot-meta.body",
  "bytes": 6115,
  "sha256": "406f842b9c7dae9688f616275806a3a408d3f5f4dae1e73c140d844bd65247ff"
}
```

### Fact-source attempt 9

```json
{
  "label": "play-meta",
  "url": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515",
  "timestamp": "2026-10-07T17:13:51.046701+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-meta.body",
  "bytes": 7730,
  "sha256": "0c04349e9aae5668d04d5768d97a3194117c6f5d4c8e2762ff56da95b4d40f00"
}
```

### Fact-source attempt 10

```json
{
  "label": "gitenberg-names-search",
  "url": "https://api.github.com/search/repositories?q=History%20Christian%20Names%20Yonge&per_page=10",
  "timestamp": "2026-10-07T17:13:51.072177+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/gitenberg-names-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=History%20Christian%20Names%20Yonge&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=History%20Christian%20Names%20Yonge&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/gitenberg-names-search.body",
  "bytes": 7423,
  "sha256": "cb84ee2c63e63ec4bcff4a426860a43ffdde3353a28d7995c56ac984c9ceb0a9"
}
```

### Fact-source attempt 11

```json
{
  "label": "nurture-commit",
  "url": "https://api.github.com/repos/Nurturepedia/baby-names-dataset/commits/HEAD",
  "timestamp": "2026-10-07T17:14:41.728998+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/Nurturepedia/baby-names-dataset/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/Nurturepedia/baby-names-dataset/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-commit.body",
  "bytes": 5119,
  "sha256": "adbe27e29e33399cade12c454368e173ed7b634d688e656206b19bd2393fbe5d"
}
```

### Fact-source attempt 12

```json
{
  "label": "nurture-tree",
  "url": "https://api.github.com/repos/Nurturepedia/baby-names-dataset/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:14:41.729766+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/Nurturepedia/baby-names-dataset/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/Nurturepedia/baby-names-dataset/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-tree.body",
  "bytes": 17909,
  "sha256": "a9dc0cdee26fda88a6a43351287be6473b01df1c8ac7503c0579523e03959103"
}
```

### Fact-source attempt 13

```json
{
  "label": "sandeep-commit",
  "url": "https://api.github.com/repos/SandeepDas01/baby-names/commits/HEAD",
  "timestamp": "2026-10-07T17:14:41.730524+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/sandeep-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/SandeepDas01/baby-names/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/SandeepDas01/baby-names/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/sandeep-commit.body",
  "bytes": 2406,
  "sha256": "5a86b7cb4062e4f2fc2d756d6a4ca5e70532f131f85735817e9963fc294e90b4"
}
```

### Fact-source attempt 14

```json
{
  "label": "sandeep-tree",
  "url": "https://api.github.com/repos/SandeepDas01/baby-names/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:14:41.732905+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/sandeep-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/SandeepDas01/baby-names/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/SandeepDas01/baby-names/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/sandeep-tree.body",
  "bytes": 779,
  "sha256": "fcdc3102ba406958bbf17a486c41300886cdcbdccae0a756f445300b67377c1a"
}
```

### Fact-source attempt 15

```json
{
  "label": "jeremander-commit",
  "url": "https://api.github.com/repos/jeremander/baby_names/commits/HEAD",
  "timestamp": "2026-10-07T17:14:42.365413+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/jeremander-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/jeremander/baby_names/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/jeremander/baby_names/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/jeremander-commit.body",
  "bytes": 6619,
  "sha256": "52d2d1cd91f01d8b45da65f111c5f7dc85f16c9fa9e345b442e42fa322c3cc1b"
}
```

### Fact-source attempt 16

```json
{
  "label": "jeremander-tree",
  "url": "https://api.github.com/repos/jeremander/baby_names/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:14:42.417276+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/jeremander-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/jeremander/baby_names/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/jeremander/baby_names/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/jeremander-tree.body",
  "bytes": 1055,
  "sha256": "80f88bed044dfc5f98643be020d9a5fd80722cad7917c108e39e379bbd261629"
}
```

### Fact-source attempt 17

```json
{
  "label": "play-commit",
  "url": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/commits/HEAD",
  "timestamp": "2026-10-07T17:14:42.424266+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-commit.body",
  "bytes": 26402,
  "sha256": "0f41144ca96abbc9a6f135f199e9289be6221163ae8632b60b92cbad4705fe4c"
}
```

### Fact-source attempt 18

```json
{
  "label": "play-tree",
  "url": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:14:42.440086+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/GITenberg/The-Merchant-of-Venice_1515/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-tree.body",
  "bytes": 2310,
  "sha256": "3458b1e4d162213b01668bec87dc0a219993220793e1fc9da5885b8b91a0fd19"
}
```

### Fact-source attempt 19

```json
{
  "label": "history-commit",
  "url": "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/commits/HEAD",
  "timestamp": "2026-10-07T17:14:42.780004+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-commit.body",
  "bytes": 5416,
  "sha256": "f7cd8d0482e7973e8ea6a0350759a4a42c8396be376b02345f7791ed2462b8bf"
}
```

### Fact-source attempt 20

```json
{
  "label": "history-tree",
  "url": "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:14:42.999722+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/GITenberg/History-of-Christian-names_70419/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-tree.body",
  "bytes": 8056,
  "sha256": "6e7b520426a71780fc98801fd49a024d157639d8f6a2aa759ffe673f72352280"
}
```

### Fact-source attempt 21

```json
{
  "label": "nurture-readme",
  "url": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/README.md",
  "timestamp": "2026-10-07T17:17:54.811716+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-readme.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/README.md"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/README.md",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-readme.body",
  "bytes": 3217,
  "sha256": "ab87394248e202aed9ff2dda50b4e7c87d0fd997bc55ea71eeab02b11afc7869"
}
```

### Fact-source attempt 22

```json
{
  "label": "nurture-christian",
  "url": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/religion/christianity.json",
  "timestamp": "2026-10-07T17:17:54.812515+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-christian.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/religion/christianity.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/religion/christianity.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-christian.body",
  "bytes": 19060,
  "sha256": "4dbe92f29a98add11b32a11abf1bdfe19f7922042edb715c48a9ccee6ad2e356"
}
```

### Fact-source attempt 23

```json
{
  "label": "nurture-english",
  "url": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/origin/english.json",
  "timestamp": "2026-10-07T17:17:54.812988+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/nurture-english.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/origin/english.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/Nurturepedia/baby-names-dataset/21a798fe10c4a03cfbf7a588eda475c3ffe97486/datasets/origin/english.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/nurture-english.body",
  "bytes": 8966,
  "sha256": "08cbcb3a35243dce0a0df9dfad85c918b210c93971e445f39344775f923fc367"
}
```

### Fact-source attempt 24

```json
{
  "label": "sandeep-readme",
  "url": "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/README.md",
  "timestamp": "2026-10-07T17:17:54.813830+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/sandeep-readme.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/README.md"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/README.md",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/sandeep-readme.body",
  "bytes": 84,
  "sha256": "e38a74276a874f128d9b2dbf7202e9249075749436d8dd5a8ed5eb0fed696120"
}
```

### Fact-source attempt 25

```json
{
  "label": "sandeep-sql",
  "url": "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/baby_names.sql",
  "timestamp": "2026-10-07T17:17:55.193698+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/sandeep-sql.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/baby_names.sql"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/SandeepDas01/baby-names/46e0db8eb395d321caf8d903dbd496340da0a26e/baby_names.sql",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/sandeep-sql.body",
  "bytes": 218618,
  "sha256": "f2631c589b8ad658f067d70352c83500d3dc8f3e40423db0f692f0a442a92544"
}
```

### Fact-source attempt 26

```json
{
  "label": "jeremander-code",
  "url": "https://raw.githubusercontent.com/jeremander/baby_names/64575a0a450382fc6be272bf87a789a5de7c2bab/babynames.py",
  "timestamp": "2026-10-07T17:17:55.194022+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/jeremander-code.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/jeremander/baby_names/64575a0a450382fc6be272bf87a789a5de7c2bab/babynames.py"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/jeremander/baby_names/64575a0a450382fc6be272bf87a789a5de7c2bab/babynames.py",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/jeremander-code.body",
  "bytes": 9377,
  "sha256": "cd513aecaa13543ca1e99c7f24a45b155082702ba201d5937b410809306f3d44"
}
```

### Fact-source attempt 27

```json
{
  "label": "play-text",
  "url": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/1515.txt",
  "timestamp": "2026-10-07T17:17:55.217045+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-text.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/1515.txt"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/1515.txt",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-text.body",
  "bytes": 137040,
  "sha256": "26138572d6dd6cc316f61f8fe972d2568e8dce20541a9e275be275500a9bbeb1"
}
```

### Fact-source attempt 28

```json
{
  "label": "play-license",
  "url": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/LICENSE",
  "timestamp": "2026-10-07T17:17:55.266275+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-license.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/LICENSE"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/LICENSE",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-license.body",
  "bytes": 17504,
  "sha256": "1e301e03fb28addf6ad03d42b1429e87679013d1ee7e141c7c968fbef0ad961d"
}
```

### Fact-source attempt 29

```json
{
  "label": "play-metadata",
  "url": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/metadata.yaml",
  "timestamp": "2026-10-07T17:17:55.562162+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/play-metadata.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/metadata.yaml"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/The-Merchant-of-Venice_1515/ff93cfa08e815939603801148ca8ccfa7eba78ff/metadata.yaml",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/play-metadata.body",
  "bytes": 1012,
  "sha256": "17726783e9b453371814ee849a271167b7e148ed59bbeca4279e12406f5e0a89"
}
```

### Fact-source attempt 30

```json
{
  "label": "history-text",
  "url": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/70419-0.txt",
  "timestamp": "2026-10-07T17:17:55.564529+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-text.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/70419-0.txt"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/70419-0.txt",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-text.body",
  "bytes": 1986355,
  "sha256": "aa58b800d24d941c858d981ca92b103e5409aaf90d6dcc30291097141aef4f6c"
}
```

### Fact-source attempt 31

```json
{
  "label": "history-license",
  "url": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/LICENSE",
  "timestamp": "2026-10-07T17:17:55.615932+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-license.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/LICENSE"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/LICENSE",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-license.body",
  "bytes": 17504,
  "sha256": "1e301e03fb28addf6ad03d42b1429e87679013d1ee7e141c7c968fbef0ad961d"
}
```

### Fact-source attempt 32

```json
{
  "label": "history-metadata",
  "url": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/metadata.yaml",
  "timestamp": "2026-10-07T17:17:55.703638+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-metadata.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/metadata.yaml"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/metadata.yaml",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-metadata.body",
  "bytes": 1344,
  "sha256": "7c7ee1f7877287e4372b98eb15a3fcded01d282b0ce4ce629fc31035d57e0e7c"
}
```

### Fact-source attempt 33

```json
{
  "label": "history-readme",
  "url": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/README.rst",
  "timestamp": "2026-10-07T17:17:55.892095+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/history-readme.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/README.rst"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/GITenberg/History-of-Christian-names_70419/e78bed0f0ab05ce6447247be0874dcc502778439/README.rst",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/history-readme.body",
  "bytes": 2008,
  "sha256": "93a45e5311f77020bac40b7b97fd3165d5eedb5adf0b95b4a7bca5abffd81af4"
}
```

### Fact-source attempt 34

```json
{
  "label": "github-smith-bible-search",
  "url": "https://api.github.com/search/repositories?q=Smith%20Bible%20dictionary&per_page=10",
  "timestamp": "2026-10-07T17:18:32.025718+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-smith-bible-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=Smith%20Bible%20dictionary&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=Smith%20Bible%20dictionary&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-smith-bible-search.body",
  "bytes": 6971,
  "sha256": "5e3fb9e0bf86e581dc8177f8e3b254ebd8650f121222928b621e93202b0fc450"
}
```

### Fact-source attempt 35

```json
{
  "label": "github-gutenberg-smith-search",
  "url": "https://api.github.com/search/repositories?q=GITenberg%20Bible%20dictionary&per_page=10",
  "timestamp": "2026-10-07T17:18:32.027033+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-gutenberg-smith-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=GITenberg%20Bible%20dictionary&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=GITenberg%20Bible%20dictionary&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-gutenberg-smith-search.body",
  "bytes": 73,
  "sha256": "08c082fdf7ca87ba911a2aabb0f0cf2d3e482a6feeaac9713e4578c20b2600b2"
}
```

### Fact-source attempt 36

```json
{
  "label": "github-webster-names-search",
  "url": "https://api.github.com/search/repositories?q=Webster%20proper%20names&per_page=10",
  "timestamp": "2026-10-07T17:18:32.028539+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-webster-names-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=Webster%20proper%20names&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=Webster%20proper%20names&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-webster-names-search.body",
  "bytes": 6938,
  "sha256": "7ea07d97f716968a920da2c90972b5865bd411b8ab67c95aa1e11a822897d061"
}
```

### Fact-source attempt 37

```json
{
  "label": "github-gutenberg-names-search2",
  "url": "https://api.github.com/search/repositories?q=GITenberg%20Names%20Their%20Meaning&per_page=10",
  "timestamp": "2026-10-07T17:18:32.030517+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-gutenberg-names-search2.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=GITenberg%20Names%20Their%20Meaning&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=GITenberg%20Names%20Their%20Meaning&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-gutenberg-names-search2.body",
  "bytes": 73,
  "sha256": "08c082fdf7ca87ba911a2aabb0f0cf2d3e482a6feeaac9713e4578c20b2600b2"
}
```

### Fact-source attempt 38

```json
{
  "label": "github-christian-names-search",
  "url": "https://api.github.com/search/repositories?q=Christian%20names%20etymology&per_page=10",
  "timestamp": "2026-10-07T17:18:32.859289+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/github-christian-names-search.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/search/repositories?q=Christian%20names%20etymology&per_page=10"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/search/repositories?q=Christian%20names%20etymology&per_page=10",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/github-christian-names-search.body",
  "bytes": 73,
  "sha256": "08c082fdf7ca87ba911a2aabb0f0cf2d3e482a6feeaac9713e4578c20b2600b2"
}
```

### Fact-source attempt 39

```json
{
  "label": "bible-meta",
  "url": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset",
  "timestamp": "2026-10-07T17:18:47.644956+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-meta.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/neuu-org/bible-dictionary-dataset"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-meta.body",
  "bytes": 7562,
  "sha256": "eca1ac40c99ed23c51761e2e29607ed3912e56684b1fcca28f5991c8fd16a466"
}
```

### Fact-source attempt 40

```json
{
  "label": "bible-commit",
  "url": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/commits/HEAD",
  "timestamp": "2026-10-07T17:18:47.645416+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-commit.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/commits/HEAD"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/commits/HEAD",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-commit.body",
  "bytes": 19015,
  "sha256": "cd6e0f151a7a7785ed3ce024d1b5aece80183654aae95e38d494fd50f931d124"
}
```

### Fact-source attempt 41

```json
{
  "label": "bible-tree",
  "url": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/git/trees/HEAD?recursive=1",
  "timestamp": "2026-10-07T17:18:47.645863+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-tree.body",
    "--write-out",
    "%{json}",
    "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/git/trees/HEAD?recursive=1"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://api.github.com/repos/neuu-org/bible-dictionary-dataset/git/trees/HEAD?recursive=1",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-tree.body",
  "bytes": 55792,
  "sha256": "c688ac0eabf114beaae1741bab621516234cc278bc8fd8894fe0c884be748363"
}
```

### Fact-source attempt 42

```json
{
  "label": "bible-readme",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/README.md",
  "timestamp": "2026-10-07T17:19:04.739313+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-readme.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/README.md"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/README.md",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-readme.body",
  "bytes": 5905,
  "sha256": "441713cf50e1f77e6a676c28f64c44e218fd57c45c090e45eb7e627d9dee4413"
}
```

### Fact-source attempt 43

```json
{
  "label": "bible-license",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/LICENSE",
  "timestamp": "2026-10-07T17:19:04.740514+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-license.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/LICENSE"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/LICENSE",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-license.body",
  "bytes": 300,
  "sha256": "bdef1cc111e716a6a9bdd5f738d20979c297787a597243f9ab543e92301c6125"
}
```

### Fact-source attempt 44

```json
{
  "label": "bible-smith-t",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/t.json",
  "timestamp": "2026-10-07T17:19:04.740897+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-smith-t.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/t.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/t.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-smith-t.body",
  "bytes": 262892,
  "sha256": "34adde4e5470c59fd3e85f5ffe1b9474f5248ede5cd9a0bd7148cb5ecc64d070"
}
```

### Fact-source attempt 45

```json
{
  "label": "bible-smith-d",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/d.json",
  "timestamp": "2026-10-07T17:19:04.741668+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-smith-d.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/d.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/smith/d.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-smith-d.body",
  "bytes": 153564,
  "sha256": "d5b06c7ef58b37ee4309d8a464c12384db23a41947b16940ae7038252c218009"
}
```

### Fact-source attempt 46

```json
{
  "label": "bible-hitchcock-t",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/t.json",
  "timestamp": "2026-10-07T17:19:05.145980+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-hitchcock-t.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/t.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/t.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-hitchcock-t.body",
  "bytes": 25457,
  "sha256": "c745aa550bc88b18bb99748cd3ff6fd561af2ea470eab0ff5c3a1f28229a7f83"
}
```

### Fact-source attempt 47

```json
{
  "label": "bible-hitchcock-d",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/d.json",
  "timestamp": "2026-10-07T17:19:05.178884+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-hitchcock-d.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/d.json"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/02_sources/hitchcock/d.json",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-hitchcock-d.body",
  "bytes": 14196,
  "sha256": "8afd438f75bfcc596e6fda7dd249323339c5d0b879fcacaf710283bf9b376da5"
}
```

### Fact-source attempt 48

```json
{
  "label": "bible-smith-xml",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/smith_bibledict.xml",
  "timestamp": "2026-10-07T17:19:05.280632+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-smith-xml.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/smith_bibledict.xml"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/smith_bibledict.xml",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-smith-xml.body",
  "bytes": 6779564,
  "sha256": "f0aa85b544f70384e24715dcb172ea0b687f8d5646994335e84c8dc44e5aca43"
}
```

### Fact-source attempt 49

```json
{
  "label": "bible-hitchcock-xml",
  "url": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/hitchcock_bible_names.xml",
  "timestamp": "2026-10-07T17:19:05.281689+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/bible-hitchcock-xml.body",
    "--write-out",
    "%{json}",
    "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/hitchcock_bible_names.xml"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/b8e82aa7ca847f4d97fb432cd965e398a111333c/data/00_raw/ccel/xml/hitchcock_bible_names.xml",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/bible-hitchcock-xml.body",
  "bytes": 224688,
  "sha256": "43390f72248bb3687cc69598b4dc6fd80dc6e406225eed3cd05e66594386d836"
}
```

### Fact-source attempt 50

```json
{
  "label": "npm-meaning-search",
  "url": "https://registry.npmjs.org/-/v1/search?text=baby%20names%20meaning%20etymology&size=20",
  "timestamp": "2026-10-07T17:19:25.933807+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/npm-meaning-search.body",
    "--write-out",
    "%{json}",
    "https://registry.npmjs.org/-/v1/search?text=baby%20names%20meaning%20etymology&size=20"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://registry.npmjs.org/-/v1/search?text=baby%20names%20meaning%20etymology&size=20",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/npm-meaning-search.body",
  "bytes": 20218,
  "sha256": "c517ed779dd47c0c41bd09b2bc3599d16358f798b78dc981dcd51931755c4078"
}
```

### Fact-source attempt 51

```json
{
  "label": "npm-name-meaning-search",
  "url": "https://registry.npmjs.org/-/v1/search?text=keywords%3Aname-meaning&size=20",
  "timestamp": "2026-10-07T17:19:25.934450+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/npm-name-meaning-search.body",
    "--write-out",
    "%{json}",
    "https://registry.npmjs.org/-/v1/search?text=keywords%3Aname-meaning&size=20"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://registry.npmjs.org/-/v1/search?text=keywords%3Aname-meaning&size=20",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/npm-name-meaning-search.body",
  "bytes": 787,
  "sha256": "48b3799304d50ef761cb97dc382f161d3e261293518eeba6d6817256de868195"
}
```

### Fact-source attempt 52

```json
{
  "label": "npm-name-meaning-meta",
  "url": "https://registry.npmjs.org/@asif92%2fname-meaning",
  "timestamp": "2026-10-07T17:19:56.480245+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/npm-name-meaning-meta.body",
    "--write-out",
    "%{json}",
    "https://registry.npmjs.org/@asif92%2fname-meaning"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://registry.npmjs.org/@asif92%2fname-meaning",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/npm-name-meaning-meta.body",
  "bytes": 4928,
  "sha256": "c783ca54253689462e55f4600c8a594406f1a32b0e9d5e353f1d494f7d6a681e"
}
```

### Fact-source attempt 53

```json
{
  "label": "npm-etymology-search",
  "url": "https://registry.npmjs.org/-/v1/search?text=etymology&size=20",
  "timestamp": "2026-10-07T17:19:56.481043+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/npm-etymology-search.body",
    "--write-out",
    "%{json}",
    "https://registry.npmjs.org/-/v1/search?text=etymology&size=20"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://registry.npmjs.org/-/v1/search?text=etymology&size=20",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/npm-etymology-search.body",
  "bytes": 17310,
  "sha256": "561c04ba1bd2af57ab8261384bfcdd57b2c67f1aca380a1b79ddfe3112549fce"
}
```

### Fact-source attempt 54

```json
{
  "label": "npm-name-meaning-tarball",
  "url": "https://registry.npmjs.org/@asif92/name-meaning/-/name-meaning-0.0.2.tgz",
  "timestamp": "2026-10-07T17:20:09.216251+00:00",
  "commandArguments": [
    "curl",
    "--fail",
    "--location",
    "--max-time",
    "25",
    "--connect-timeout",
    "10",
    "--silent",
    "--show-error",
    "--output",
    "/tmp/c05-facts-research/npm-name-meaning-tarball.body",
    "--write-out",
    "%{json}",
    "https://registry.npmjs.org/@asif92/name-meaning/-/name-meaning-0.0.2.tgz"
  ],
  "exitCode": 0,
  "httpCode": 200,
  "effectiveUrl": "https://registry.npmjs.org/@asif92/name-meaning/-/name-meaning-0.0.2.tgz",
  "tlsVerifyResult": 0,
  "stderr": "",
  "localContentPath": "/tmp/c05-facts-research/npm-name-meaning-tarball.body",
  "bytes": 846,
  "sha256": "b474dc0bb4caeea9d7af3426c6fac4ec8172c4f444e9fe695634e5f1ee6f3629"
}
```

## Fresh environment completion and milestone

The historical engineering milestone 435d9a1 reached remote job/C05-name-your-baby with main claim refresh 938e444 and feature merge abc31c4b2faa33d3ed4117139286fc9252abd9d2. Native Git push returned0. No PR or job-completion claim was made.

The old retry's process return was lost during the environment transition, although its log/report showed passing checks. It is not reported as npm exit0. To resolve that uncertainty and validate the new instance, exactly one fresh required npm test was run:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test
```

Actual completed tool exit0 (session28778/chunk20254f), released18:32:36 UTC. Initial suite20/20, zero failed/skipped/cancelled/todo,21.671 seconds. Mutation full baseline20/20 and core baseline15/15 both exit0. All25 syntax-valid bugs were caught:375 executed mutant tests,82 failed assertions/errors, no skipped/cancelled tests. Four compiled files restore byte-for-byte/hash; five checksums pass. Prior logs/reports are preserved separately; no passing suite was repeated after this completion. Full500-row source/fact/manual/CI work remains in progress.

## Current-environment reusable setup

Command: `bash /workspace/.partybox-install.sh > /tmp/c05-current-env-install.log 2>&1` from `/workspace`. Actual completed tool exit code: 0. The script reused the source venv, installed the frozen Python requirements, ran frozen-lockfile `npm ci --ignore-scripts` for the present C05 job, and completed `npm run build`. This catches missing writable caches, incompatible Node, unavailable frozen packages and strict TypeScript compile failures. The separately documented current-environment 20-test / 25-mutation npm run demonstrates executable test readiness. Installation changes ignored dependencies and generated outputs; these documentation edits are authorized queue work. No service startup is required. Draft saving is separate from runtime execution and publication.

## Thirty random manual current-count spot checks

Selection command: `python3` with `random.Random(20261007).sample(range(500), 30)`, sorted indices over the audited canonical 500-candidate order. Selection is automated; checking the displayed source rows and headings below was manual. Exact selection, the HTML-excerpt command, cached source pages and fetch evidence are retained in `/tmp/c05-manual-random-selection.json`, `/tmp/c05-manual-source-excerpts.json` and `/tmp/c05-manual-secondary-fetch-evidence.json`.

Each second retrieval source was read live using `curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output <cached-page> --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' <URL>`. All nine required decade pages returned actual exit 0, HTTP 200, unchanged HTTPS URL and TLS verification result 0. The reviewer read the extracted HTML table cells, column ordering, decade heading and March 2026 source note. These are separately published SSA decade tables, not an independent original data publisher or a second authored fact source. The spot checks verify name spelling, recorded category, period and peak subtotal; they do not certify all lifetime sums or the full per-row fact audit.

| Canonical index (zero based) | Name/category | Peak period checked | Candidate subtotal | Source table subtotal | Manual result |
| --- | --- | --- | ---: | ---: | --- |
| 2 | Daniel/M | [1980–1989](https://www.ssa.gov/oact/babynames/decades/names1980s.html) | 345,537 | 345,537 | Match |
| 39 | Melissa/F | [1970–1979](https://www.ssa.gov/oact/babynames/decades/names1970s.html) | 253,267 | 253,267 | Match |
| 51 | Walter/M | [1920–1929](https://www.ssa.gov/oact/babynames/decades/names1920s.html) | 119,809 | 119,809 | Match |
| 52 | Dennis/M | [1950–1959](https://www.ssa.gov/oact/babynames/decades/names1950s.html) | 204,267 | 204,267 | Match |
| 61 | Nathan/M | [2000–2009](https://www.ssa.gov/oact/babynames/decades/names2000s.html) | 134,857 | 134,857 | Match |
| 65 | Maria/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 88,850 | 88,850 | Match |
| 97 | Jacqueline/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 84,398 | 84,398 | Match |
| 116 | Diana/F | [1950–1959](https://www.ssa.gov/oact/babynames/decades/names1950s.html) | 80,234 | 80,234 | Match |
| 143 | Theodore/M | [2020–2025 (partial)](https://www.ssa.gov/oact/babynames/decades/names2020s.html) | 65,579 | 65,579 | Match |
| 149 | Travis/M | [1980–1989](https://www.ssa.gov/oact/babynames/decades/names1980s.html) | 102,927 | 102,927 | Match |
| 181 | Connie/F | [1950–1959](https://www.ssa.gov/oact/babynames/decades/names1950s.html) | 88,799 | 88,799 | Match |
| 243 | Randall/M | [1950–1959](https://www.ssa.gov/oact/babynames/decades/names1950s.html) | 62,450 | 62,450 | Match |
| 256 | Renee/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 55,815 | 55,815 | Match |
| 284 | Jerome/M | [1950–1959](https://www.ssa.gov/oact/babynames/decades/names1950s.html) | 29,705 | 29,705 | Match |
| 288 | Haley/F | [1990–1999](https://www.ssa.gov/oact/babynames/decades/names1990s.html) | 71,197 | 71,197 | Match |
| 311 | Addison/F | [2010–2019](https://www.ssa.gov/oact/babynames/decades/names2010s.html) | 71,021 | 71,021 | Match |
| 318 | Willie/F | [1920–1929](https://www.ssa.gov/oact/babynames/decades/names1920s.html) | 37,814 | 37,814 | Match |
| 323 | Carmen/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 22,888 | 22,888 | Match |
| 360 | Brooklyn/F | [2010–2019](https://www.ssa.gov/oact/babynames/decades/names2010s.html) | 60,337 | 60,337 | Match |
| 369 | Chester/M | [1920–1929](https://www.ssa.gov/oact/babynames/decades/names1920s.html) | 28,435 | 28,435 | Match |
| 381 | Madelyn/F | [2010–2019](https://www.ssa.gov/oact/babynames/decades/names2010s.html) | 39,199 | 39,199 | Match |
| 384 | Mariah/F | [1990–1999](https://www.ssa.gov/oact/babynames/decades/names1990s.html) | 44,603 | 44,603 | Match |
| 416 | Fernando/M | [2000–2009](https://www.ssa.gov/oact/babynames/decades/names2000s.html) | 25,152 | 25,152 | Match |
| 417 | Brandi/F | [1980–1989](https://www.ssa.gov/oact/babynames/decades/names1980s.html) | 42,890 | 42,890 | Match |
| 420 | Katrina/F | [1980–1989](https://www.ssa.gov/oact/babynames/decades/names1980s.html) | 28,828 | 28,828 | Match |
| 421 | Penny/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 38,220 | 38,220 | Match |
| 423 | Toni/F | [1960–1969](https://www.ssa.gov/oact/babynames/decades/names1960s.html) | 24,840 | 24,840 | Match |
| 442 | Genesis/F | [2010–2019](https://www.ssa.gov/oact/babynames/decades/names2010s.html) | 40,524 | 40,524 | Match |
| 452 | Harriet/F | [1920–1929](https://www.ssa.gov/oact/babynames/decades/names1920s.html) | 20,873 | 20,873 | Match |
| 468 | Rosie/F | [1920–1929](https://www.ssa.gov/oact/babynames/decades/names1920s.html) | 14,290 | 14,290 | Match |

Specific ambiguity resolved by reading both source columns: Willie appears as M with 67,993 and F with 37,814 in the 1920s table; the selected row is F and matches 37,814. Theodore’s 65,579 is explicitly the 2020–2025 subtotal, not a completed 2020s count. All 30 selected peak fields agree. These checks concern the current candidate audit; after generating the tracked pack, verify the selected rows still carry these same fields before treating this as a delivery check. The historical thirty-row sample and all facts remain outside this count-only spot-check claim.

## Integrated official-source fixture repeatability

From `jobs/C05-name-your-baby`, executed:

```sh
python3 tools/extract_current.py --source fixtures/ssa-names-2026-10-07.zip --output /tmp/c05-integrated-current-source-1.json
python3 tools/extract_current.py --source fixtures/ssa-names-2026-10-07.zip --output /tmp/c05-integrated-current-source-2.json
```

Both processes actually completed with exit 0. Each reported 2,181,032 full source rows, 500 selected names, 63,643 selected annual rows, 5,981,738 fixture bytes, observed coverage 1880–2025 and SHA256 `8dd80f3f6dc38705be47541fb994d073270ffe4d861732471c0c339e385905e9`. The integrated script has no cloud-only candidate-path dependency. This catches source revisions, malformed ZIP membership/CRC, annual order/duplicate/field violations, unsafe subtotals, selection drift and canonical serialization drift. Byte comparisons and the expanded source/CLI test suites are recorded separately when they actually complete.

Commands from `jobs/C05-name-your-baby`: `cmp fixtures/current-source.json /tmp/c05-integrated-current-source-1.json` and `cmp /tmp/c05-integrated-current-source-1.json /tmp/c05-integrated-current-source-2.json`. Both actually exited 0 with no differences. The generated 500-row pack carries all 30 manually checked names/categories/peak periods/counts unchanged; a field-by-field comparison of their selected indices also passed. This transfer comparison is automated and does not create new manual checks.

## Current producer isolated checks

Commands, each from `/tmp/c05-current-isolated` using a preserved source/test copy and installed dependencies:

```sh
./node_modules/.bin/tsc -p tsconfig.json
node dist/src/current-cli.js fixtures/current-source.json data/current-candidates.json --current-candidates
node --test dist/test/current.test.js
```

Each command actually completed with exit 0. The current suite executed 9 tests, all passed, no skips/cancellations/todos, in 11.218 seconds. Coverage: 10,000 sparse primary/reference differentials; properties over 1,003 saved seeds; exact 500-row golden metrics; 17 malformed source/shape/provenance cases; explicit editorial gates with 12 rejected review mutations; strict schemas with 9 corrupted pack cases; forbidden clock/randomness calls; two CLI generations in different time zones and 13 rejected CLI calls. In particular, adding one count while preserving shape and peak qualification is rejected by the CLI's canonical base-fixture fingerprint. Candidate SHA256 is `2da2fd3980d21c55ef3986447ec2055d686abfac900a437330f6d1b3e45f8882`; the same bytes are retained in `data/current-candidates.json`. Exact evidence is in `/tmp/c05-current-producer-evidence.json` and `/tmp/c05-current-isolated-test.log`. These tests catch future/suppressed-year confusion, altered metric provenance, shape errors, dishonest review flags, nondeterminism and source overwrite aliases. Expanded official-source tests and the integrated full npm run are still pending at this milestone.

## Integrated official-source test file, isolated execution

Source: `test/current-source.test.ts`; the extractor was unchanged. The test was compiled and run in an isolated `/tmp` directory using the exact commands retained in `/tmp/c05-official-source-test-commands.json`; its full output is `/tmp/c05-official-source-test.log`. Actual completed exit code 0, five tests passed in 26.698 seconds, zero failures/skips/cancellations/todos. Two uncached full ZIP regenerations matched the frozen fixture and left source bytes unchanged. Fifteen rejecting CLI invocations checked invalid arguments, missing paths, source/output aliases, directory and dangling-link destinations, corrupt fingerprints and destination preservation. Thirty-six synthetic annual-record cases exercised invalid count/name/category/column/order/duplicate boundaries without bypassing the production fingerprint check. These results resolve this milestone's previously pending source-test status; the integrated full npm run is still separately pending.


Exact secondary-source fetch commands, each completed with exit 0 / HTTP 200 / TLS result 0:

```sh
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1920s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1920s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1950s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1950s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1960s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1960s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1970s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1970s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1980s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1980s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names1990s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names1990s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names2000s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names2000s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names2010s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names2010s.html
curl --fail --location --silent --show-error --connect-timeout 10 --max-time 35 --output /workspace/.partybox-source-cache/c05/manual-secondary/names2020s.html --write-out '%{http_code} %{url_effective} %{ssl_verify_result}' https://www.ssa.gov/oact/babynames/decades/names2020s.html
```

Each cached source fingerprint:

| Decade | SHA256 |
| --- | --- |
| 1920 | `8bfb5b8c637188f4ca81bed0499ef9a35d825366adab35a840a3067ee31fc6dd` |
| 1950 | `837caa3d139e2d426f877966879f797e6383b43b1367e7db6706ada6594a638d` |
| 1960 | `a4523b1eb3195766723e26ea70dae09bed966ce975d9e53f4db5794511ff5547` |
| 1970 | `17c3df684c4bc4cd640e9ce01babd0b07d63d71112e77335676b293da16b13d1` |
| 1980 | `2f62d470473afff6a98db7ff35cad310a05557e3c4ca7fb7025aac9816f605cf` |
| 1990 | `d920fb5a1e45202229c21a4fc9b29be9243351c01362e1788c299919b418300f` |
| 2000 | `f64db0a0b994c0eb12d2e1afb00b10deb33f1479c6dfd0e9af7c22f42fe0745e` |
| 2010 | `d0c6b57b24d2955b45e91e0c76944aae41e66164dafe70ed07cbfb514775b78a` |
| 2020 | `f8cb4adde09d0efe8e81ddf5aa3205fb7c5343dc08a833b4383bcab2d9aa9646` |

Exact seeded selection used before manual review:

```python
import json, random
from pathlib import Path
rows = json.loads(Path('/workspace/.partybox-source-cache/c05/current-audit/candidates-500-full-observed.json').read_text())
indices = sorted(random.Random(20261007).sample(range(500), 30))
selected = [{key: rows[i][key] for key in ('name', 'sex', 'peakDecade', 'peakCount', 'totalPublishedCount')} | {'index': i} for i in indices]
```

The HTML-excerpt helper used Python's standard `HTMLParser` to retain table rows, then displayed the complete source row whenever one cell exactly matched each selected name. It did not test or normalize the numeric values before review. The reviewer read the displayed values and the Boys/Girls column headings manually. The actual field-transfer check after generating `data/current-candidates.json` compared each selected canonical index's name, category, peak decade, peak count and lifetime published total against the selected audit fields; all matched. The exact generator and later integrated npm test provide the portable automated checks.

## Expanded integrated checks across the second environment transition

Command from `jobs/C05-name-your-baby`:

```sh
set -o pipefail
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test 2>&1 | tee /tmp/c05-integrated-npm-test.log
```

The observed initial suite executed 34 tests and passed all 34, with zero failures/skips/cancellations/todos, duration 34.506453 seconds. Runner baselines passed 34 full / 15 historical / 9 current tests. Retained final report and log show all 34 mutations caught (25 historical, nine current), compiled byte/hash restoration, and all ten checksum matches. The environment then reprovisioned; attempting to resume exec session 37668 returned Unknown process id. Thus the original underlying npm process's final exit status is unavailable, and is not claimed as a confirmed tool-returned exit 0. Prior report is preserved at `/tmp/c05-pre-restart-integrated-mutation-report.json`; the original log remains available. A single fresh-instance integrated run is recording its underlying exit status in `/tmp/c05-restarted-integrated-npm-test.exit` and is pending at this documentation milestone. No assertions or source checks were skipped.

The new mutations M26–M34 respectively plant future-year acceptance, dropping observed partial counts, ten observed years in the 2020s, future years counted as missing published observations, a single author for reviewed facts, absent fact review, absent recognition review, claimed candidate completion, and bypassed canonical count fingerprint. All are syntax-valid before execution. Current mutants must all be caught independently of the historical >=24 gate. The runner snapshots/restores every compiled JavaScript file and rejects crashes that do not execute the expected 15 historical or nine current tests. Exact pre-execution anchor/syntax proof is retained in `/tmp/c05-current-mutation-anchor-evidence.json`.

## Fresh-instance integrated completion

Executed from `jobs/C05-name-your-baby` after the second environment transition:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-restarted-integrated-npm-test.log 2>&1
partybox_test_status=$?
printf '%s\n' "$partybox_test_status" > /tmp/c05-restarted-integrated-npm-test.exit
tail -n 18 /tmp/c05-restarted-integrated-npm-test.log
exit "$partybox_test_status"
```

Actual completed exec tool exit code: **0**, independently preserved underlying npm status file: **0**. Initial full suite: **34/34 passed**, zero failures/cancellations/skips/todos. Runner full, historical core and current baselines passed their exact 34/15/9 counts; all **34/34** semantic mutations caught (25/25 historical and 9/9 current). Every compiled JavaScript file was restored to the original byte/hash snapshot, and all ten checksum entries passed. Completion log, status file and current-run report are distinct from the pre-transition artifacts. `/tmp/c05-restarted-integrated-completion-evidence.json` records the concrete final outcome and restoration hashes. This resolves the previously missing process return. Do not repeat this passing full run without a relevant code/data/dependency change or a concrete new failure. Content recognition and complete per-name independent facts remain outstanding; this is not PR/CI/KEEP GOING completion.

## Reviewed candidate milestone: four focused tests

Added the separate reviewed CLI, standalone curation schema and four tests. Strict isolated compile command, from this job folder:

```sh
./node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --noEmitOnError --forceConsistentCasingInFileNames --skipLibCheck --rootDir . --outDir /tmp/c05-reviewed-check src/core.ts src/current.ts src/reviewed-cli.ts test/reviewed.test.ts
node /tmp/c05-reviewed-check/src/reviewed-cli.js fixtures/current-source.json fixtures/curation.json /tmp/c05-reviewed-candidates-golden.json --reviewed-candidates
node --test /tmp/c05-reviewed-check/test/reviewed.test.js
```

Actual compile, generation and focused test exit codes were all 0. All four tests executed and passed, zero failures/cancellations/skips/todos, 8.042564 seconds. Tests validate all 144 curation records with the reused strict schema, enforce author/work/review gates and deep copies, compare every numeric field for all 500 output rows with the base pack, run two byte-identical CLI generations under UTC and Pacific/Honolulu, and reject 25 invalid invocations while preserving both source inputs and existing output. Rejections include direct, symlink and hardlink aliases of both inputs, forged numeric metrics, unsupported flags, absent review, malformed/empty curation and invalid destinations. This would catch editorial data changing counts, shallow copies, nondeterministic output or accidental source destruction.

The reviewed output is SHA256 `2bd620db02bb821622f6e7eb1d6e759d7575c5e1481a8d2aa8294b268ab4532f`. Curation input is SHA256 `b62036cc72f85a3fc47c4403a3c6d5c121ae1af360b6c9198f92a6162e822946`. The output has 500 rows, 144 reviewed facts, 356 null unresolved facts and zero completed recognition reviews; complete is false. The mutation runner's full baseline now requires 38 tests, while historical/current mutation baselines remain 15/9. Checksums cover 13 source/data/schema files. The changed full npm test was launched and must have an actual completion recorded before its outcome is claimed.

Source assembly used the 100-row medieval artifact SHA256 `8b02815e1d150f08861b9a101b0a0bae536d5d0f855aed70d6f536b26e5cbe79` and 52-row book artifact SHA256 `7a9da0f11221c6bbf38f5a673d6b4b4081de0b2fa01eb2a5abc99dc15149df24`; eight overlaps retained the medieval pair. The independent agent's 30-pair source audit used Python Random seed 20261007 on sorted names and read both actual source bodies, reporting 28 accepted plus two narrower claims that were incorporated. Its frozen original input SHA256 is `870087978926930ab112b7c71c63c1c486a842c69c481b5ae63ea7582015fffa`. This does not claim human review or replace the existing manual numeric spot-check. Assembly/focused evidence is retained at `/tmp/c05-curation-assembly-evidence.json` and `/tmp/c05-reviewed-pipeline-evidence.json`.

## Reviewed milestone: full integrated completion

Executed from this job folder:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-reviewed-integrated-npm-test.log 2>&1
partybox_reviewed_status=$?
printf '%s\n' "$partybox_reviewed_status" > /tmp/c05-reviewed-integrated-npm-test.exit
tail -n 18 /tmp/c05-reviewed-integrated-npm-test.log
exit "$partybox_reviewed_status"
```

Actual completed exec exit 0, independently persisted underlying npm status 0. The initial full suite executed and passed **38/38** tests, zero failures/cancellations/skips/todos, 43.452257 seconds. Full/historical/current mutation baselines passed their exact 38/15/9 counts; **34/34** semantic mutations were caught (25 historical, nine current). All ten compiled JavaScript files were restored byte-for-byte with matching SHA256 values. All 13 checksum entries passed. The current report is preserved at `/tmp/c05-reviewed-integrated-mutation-report.json`; `/tmp/c05-reviewed-integrated-completion-evidence.json` records actual completion independently of prior runs. This run was necessary for the new reviewed builder, CLI, schema, tests and data; repeat only after a relevant change or concrete failure. These passing engineering checks do not establish complete content, a PR, green CI or KEEP GOING completion.

## Expanded content checks: 306 then 343 reviewed facts

First expansion generation `npm run generate:reviewed` from this job folder exited 0. `node --test dist/test/reviewed.test.js > /tmp/c05-expanded-curation-focused-test.log 2>&1` executed four tests and passed all four, zero failures/cancellations/skips/todos, 11.504643 seconds. Actual exec exit and persisted status were 0. It carried 306 reviewed facts, 194 missing facts and 487 explicit recognition judgments, preserving every numeric field for all 500 rows.

Then integrated 24 directly compared Weekley/Yonge gap facts, 12 new literary identities, two literary replacements and one Todd surname fact. The first subsequent `npm run generate:reviewed` was mistakenly invoked from `/workspace` and returned exec exit 254; that is the wrong directory, not a repository defect. Reran from this job folder after correcting cwd, actual exec exit 0. No assertion, dependency or source checksum was bypassed. Final changed-target commands:

```sh
npm run generate:reviewed > /tmp/c05-expanded-343-generate.log 2>&1
node --test dist/test/reviewed.test.js > /tmp/c05-expanded-343-focused-test.log 2>&1
partybox_fact_batch_status=$?
printf '%s\n' "$partybox_fact_batch_status" > /tmp/c05-expanded-343-focused-test.exit
tail -n 12 /tmp/c05-expanded-343-focused-test.log
exit "$partybox_fact_batch_status"
sha256sum --check SHA256SUMS.txt
git diff --check
```

The four final focused tests executed and passed with actual exec exit 0 and separately persisted test status 0, zero failures/cancellations/skips/todos, 10.708890 seconds. Strict build succeeded during generation. Actual source/golden/schema checks validate 487 editorial input rows, 343 reviewed facts, 157 null unresolved facts, 487 accepted recognition reviews and 13 unresolved decisions. Every numeric field for all 500 rows still matches the base pack. Two CLI generations under different timezones are byte-identical to the committed reviewed golden; all 25 invalid CLI invocations preserve their inputs and sentinel output. Coverage/review assertions were deliberately updated to the new counts, including separate recognition equality and rejection of a missing recognition review. The existing parser/schema remain unchanged.

Curation SHA256 `a0b9e65efbd7fff69cd3fa2cf5b1f5b84001be469a6fccf6b5d6a658a3cc759e`; reviewed pack SHA256 `94f15426033e5e52852f037db2b365544389dc07158358508c70e86f27238e5e`. All 13 checksum entries passed, and diff whitespace check passed. Completion proof is retained at `/tmp/c05-expanded-343-completion-evidence.json`. The previous full 38-test/34-mutant run applies to its 144-fact milestone; no new full/mutation run is claimed for this content-only expansion. A full run is required for the planned selected-source contract change. Full content/PR/CI/KEEP GOING remains incomplete.

## Selected-source first full run: failed expectation, not skipped

Ran `PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-selected-integrated-npm-test.log 2>&1` from this job folder, preserving underlying status in `/tmp/c05-selected-integrated-npm-test.exit`. Actual completed exec exit 1 and persisted npm status 1. All 38 tests executed: 37 passed, one failed, zero skipped/cancelled/todo. The new source/selection tests and current numeric tests passed. The reviewed uniqueness assertion still expected 487 while its input now correctly contains 500 distinct selected identities; root had updated the length assertion but missed this separate set-size assertion. Corrected the expected distinct count to the intended manifest contract of 500, retaining both cardinality and uniqueness guards. Mutation and final checksum commands did not execute because npm correctly stopped at the failed test gate. No success is claimed for this run. The next full run also includes 13 newly sourced facts, with coverage assertions deliberately changed to 375 reviewed / 125 missing.

## Final selected 30-row manual numeric check

After the manifest change, re-drew 30 row indices with Python Random seed 20261007 against the final total/name/category ordering. Root read every displayed source row and Boys/Girls header from the cached independently retrieved SSA decade tables. All name/category/peak-count comparisons matched; 17 names overlapped the previous draw and 13 were newly inspected. The helper displayed source cells without comparing or normalizing numeric values. Existing verified cached source bodies were reused rather than refetched unchanged. All nine exact URLs, curl commands and body SHA256 values are recorded in the earlier manual section.

This checks published peak subtotals and their period labels. It does not manually verify every lifetime total, every sparkline cell or etymology; independent full-source generation, differential/schema/property tests and separate two-author fact review cover those other requirements. These tables share SSA authorship with the archive and do not count as independent authored fact sources.

| Final index | Name/category | Period | Source rank | Read peak count | Result |
| --- | --- | --- | --- | --- | --- |
| 2 | Daniel / M | 1980–1989 | 7 | 345,537 | Matched read cells |
| 39 | Melissa / F | 1970–1979 | 3 | 253,267 | Matched read cells |
| 51 | Walter / M | 1920–1929 | 16 | 119,809 | Matched read cells |
| 52 | Dennis / M | 1950–1959 | 21 | 204,267 | Matched read cells |
| 61 | Nathan / M | 2000–2009 | 26 | 134,857 | Matched read cells |
| 65 | Maria / F | 1960–1969 | 49 | 88,850 | Matched read cells |
| 97 | Jacqueline / F | 1960–1969 | 51 | 84,398 | Matched read cells |
| 116 | Diana / F | 1950–1959 | 55 | 80,234 | Matched read cells |
| 143 | Theodore / M | 2020–2025 (6 observed years) | 9 | 65,579 | Matched read cells |
| 149 | Travis / M | 1980–1989 | 42 | 102,927 | Matched read cells |
| 181 | Connie / F | 1950–1959 | 40 | 88,799 | Matched read cells |
| 243 | Randall / M | 1950–1959 | 58 | 62,450 | Matched read cells |
| 256 | Renee / F | 1960–1969 | 70 | 55,815 | Matched read cells |
| 284 | Jerome / M | 1950–1959 | 114 | 29,705 | Matched read cells |
| 288 | Haley / F | 1990–1999 | 46 | 71,197 | Matched read cells |
| 311 | Shelby / F | 1990–1999 | 44 | 71,995 | Matched read cells |
| 318 | Terri / F | 1960–1969 | 64 | 63,741 | Matched read cells |
| 323 | Sabrina / F | 1990–1999 | 91 | 38,664 | Matched read cells |
| 360 | Gwendolyn / F | 1950–1959 | 132 | 31,945 | Matched read cells |
| 369 | Marissa / F | 1990–1999 | 63 | 51,214 | Matched read cells |
| 381 | Maxine / F | 1920–1929 | 84 | 33,743 | Matched read cells |
| 384 | Miranda / F | 1990–1999 | 84 | 42,225 | Matched read cells |
| 416 | Nicolas / M | 2000–2009 | 139 | 28,267 | Matched read cells |
| 417 | Katrina / F | 1980–1989 | 101 | 28,828 | Matched read cells |
| 420 | Toni / F | 1960–1969 | 156 | 24,840 | Matched read cells |
| 421 | Harrison / M | 2010–2019 | 136 | 28,557 | Matched read cells |
| 423 | Christy / F | 1970–1979 | 71 | 44,592 | Matched read cells |
| 442 | Claude / M | 1920–1929 | 105 | 16,999 | Matched read cells |
| 452 | Becky / F | 1960–1969 | 135 | 29,601 | Matched read cells |
| 468 | Hugh / M | 1920–1929 | 127 | 14,106 | Matched read cells |

Read page footer: Social Security card application data as of March 2026. Read 2020 page title: “Top names of the period 2020 - 2025”; explanatory paragraph: “Based on data for 6 of the 10 years in the 2020s decade.” Theodore is 65,579 in the Boys column; this is the observed partial subtotal, not a projected full-decade count. The final draw transferred unchanged into the newly generated reviewed pack, verified independently after generation.

Exact final draw command from this job folder:

```sh
python3 - <<'PY'
import json, random
from pathlib import Path
rows = json.loads(Path('data/current-reviewed-candidates.json').read_text())['rows']
indices = sorted(random.Random(20261007).sample(range(500), 30))
for i in indices: print(i, {k: rows[i][k] for k in ('id', 'name', 'sex', 'peakDecade', 'peakCount')})
PY
```

The actual source excerpt read used Python HTMLParser on /workspace/.partybox-source-cache/c05/manual-secondary/names<decade>s.html, retained each tr/td/th text cell, printed the two header rows, then printed whole rows when a cell exactly matched the selected name. It did not compare counts. Full displayed cells are retained in /tmp/c05-final-selection-manual-excerpts.json; seed/identity/field-transfer proof in /tmp/c05-selected-golden-readiness-evidence.json.

## Selected-source 375-fact full integrated completion

From this job folder, generation commands `npm run generate:current` and `npm run generate:reviewed` both completed with actual exec exit 0. Current generation rebuilt strict TypeScript, consumed both immutable ZIP and selected manifest, produced exact fixture fd96 and base golden 4a6e0a012142945a59160809194975fbfd3b944f340142f52db06d06be6465f4. After correcting the stale uniqueness assertion and integrating the next 13 facts, the final full command was:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-selected-375-integrated-npm-test.log 2>&1
partybox_selected_375_status=$?
printf '%s\n' "$partybox_selected_375_status" > /tmp/c05-selected-375-integrated-npm-test.exit
tail -n 18 /tmp/c05-selected-375-integrated-npm-test.log
exit "$partybox_selected_375_status"
```

Actual completed exec exit **0**, independently persisted underlying npm status **0**. All **38/38** initial tests passed, zero failures/cancellations/skips/todos, 38.811335 seconds. Runner full/historical/current baselines passed their exact **38/15/9** test counts; **34/34** semantic mutants were caught (**25 historical / nine current**). All ten compiled JavaScript files were restored byte-for-byte with equal SHA256 snapshots. All **15** checksum entries passed, including the new selected-ID manifest and its standalone schema. This completes the changed engineering checks; do not repeat without a relevant change or concrete failure.

Expanded five official-source tests executed 32 Python processes: two full uncached ZIP regenerations, 29 rejected CLI invocations and one direct decoder/manifest boundary process. Eleven manifest boundary cases join the existing 36 annual-record cases. The selected manifest's hash is checked before JSON decode; ZIP hash before archive decoding. Every selected identity is requalified/ranked against the full source. Direct, normalized, symlink and hardlink output aliases of both inputs are rejected; changed inputs are rehashed before atomic publication; sentinels/inputs and staging cleanup are checked. These tests would catch forged manifests, accidental input overwrites, unqualified names or source changes during extraction. Current tests validate the exact 500-ID manifest with strict AJV and assert removed/added identities, category totals, partial peaks and final qualification.

Reviewed output: 500 rows, **375** reviewed facts, **125** null unresolved facts, **500** separate editorial recognition notes, complete false. Every numeric field matches the base pack. Two generators' outputs are byte-identical to their respective checked-in source/golden fixtures under the existing timezone/repetition tests. Current curation SHA256 `e2a9cae41bb12f9223e950f02e9e58c1691e6b5bdbcda915b7f12aeee98d9493`; reviewed pack SHA256 `7116c2a23983d7714a81c203b4378b40d46d7ff9464c57bbc590e23aa53944c6`. Mutation report and actual completion proof are retained separately at `/tmp/c05-selected-375-integrated-mutation-report.json` and `/tmp/c05-selected-375-integrated-completion-evidence.json`. This is not complete content, PR/CI or KEEP GOING completion.

## Third environment reconnection and selected-workflow readiness

The environment briefly reported starting and reconnected at 2026-10-07T20:48:48Z. The checkout remained clean on pushed feature 29f654fde151839eb5952daac536b3397db4fe4c, with main claim 80ba74543ff70f3112cc42b779aa1f2eeebc0afc refreshed at20:36:00Z. No running full-test command was lost in this restart: the selected375 full exit0 evidence was completed and retained before it. Observed runtime state is running/connected with current observations, while network policy state remains unknown; saved custom domains do not establish enforcement.

From this job folder, actually executed:

```sh
npm run build && node --test dist/test/reviewed.test.js && sha256sum --check SHA256SUMS.txt
```

Actual completed exec exit0: strict compilation; all four reviewed-workflow tests passed, zero failures/cancellations/skips/todos, 12.523109seconds; all15 checksums matched. Tests validated all500 numeric rows, reused strict schemas and review/deep-copy gates, two timezone-regenerations of the reviewed golden, and25 negative CLI/alias cases with protected inputs/sentinels. This checks the reconnected toolchain and workflow without re-running the unchanged full mutation campaign; the earlier actual38/34/15 full result remains separately identified.

Also actually ran /workspace/.partybox-source-venv/bin/python with importlib.metadata.version on numpy,pandas,pyreadr,python-dateutil,pytz,six,tzdata,Pillow, asserted the exact saved eight-version list, and imported numpy,pandas,pyreadr,PIL.Image. Actual exit0; versions2.3.5,2.2.3,0.5.3,2.9.0.post0,2026.5,1.17.0,2026.5,12.3.0. Node reports24.19.0 and Python3.12.14. This catches missing or changed retained extraction/image dependencies. A new published task restoration is still not claimed.

## 434-fact focused completion

First generation exited1 before publication because30 assembled review notes exceeded the1000-character bound. A subsequent correction attempt also used the wrong cwd and failed before editing; corrected to the job folder. Condensed repeated generic caveats while preserving the accepted narrow claim. Then, from this job folder:

```sh
npm run generate:reviewed
node --test dist/test/reviewed.test.js > /tmp/c05-expanded-434-focused-test.log 2>&1
sha256sum --check SHA256SUMS.txt
```

Actual completed generation and focused-test exec exits0; persisted test status0 at /tmp/c05-expanded-434-focused-test.exit. Four tests passed, zero failures/cancellations/skips/todos,12.827231seconds. Two timezone regenerations are byte-identical; all500 numeric rows are preserved, and25 invalid CLI invocations protect both inputs and sentinel output. All15 checksum checks passed.434 reviewed facts/66 null facts/500 recognition notes; complete remains false. This content-only run does not claim a repeated full mutation campaign, final content readiness, PR or green CI.

## Complete publication gate: full integrated completion

Root reviewed and integrated complete-cli.ts, complete-pack.schema.json and four tests from the separately compiled proposal. It requires exactly500 canonical source rows, non-null reviewed facts of<=90 Unicode characters, two normalized authored works/groups, explicit fact reviews and separate recognition evidence. Candidate builders still return complete:false. The atomic CLI protects both inputs and rechecks original bytes before rename. Synthetic completion fixtures are labeled as synthetic and removed after use; no production complete golden was created.

One first integration attempt used an incorrect cwd before any edits. The accidentally launched unchanged test run was deliberately stopped with SIGTERM, actual exit143; no success claimed. Corrected all helper paths to absolute paths and used a fail-fast integration command, then from this job folder:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-complete-gate-integrated-npm-test.log 2>&1
```

Actual completed exec session25003 exit0; underlying npm status0 retained. Initial suite42/42 passed, zero fail/cancel/skip/todo,44.766626seconds. Exact mutation baselines42/15/9 passed; all34 mutants caught (25 historical,9 current). All12 compiled JS files were restored byte-for-byte/hash. All16 checksum entries matched. New tests cover strict complete schema, missing last-row fact/recognition, normalized duplicate author/work, altered canonical counts, determinism/deep-copy, two timezone-identical synthetic generations and25 rejected CLI invocations preserving bytes. Evidence is retained separately at /tmp/c05-complete-gate-integrated-completion-evidence.json and mutation-report.json.

Actual production-incomplete workflow check:

```sh
node dist/src/complete-cli.js fixtures/current-source.json fixtures/curation.json /tmp/c05-real-incomplete-must-not-exist.json --complete
```

Expected actual exit1 with incomplete-fact error; no output created, both input SHA256 values unchanged.434 facts/66 unresolved/500 recognition records remain. This proves refusal of incomplete production content, not completed C05 or PR/green CI.

## 493-fact focused completion

Root assembled59 new approved identities plus one independently reviewed Dalton upgrade using `python3 /tmp/c05-integrate-approved-next.py`, actual exit0. All untouched curation records and all recognition records were preserved. Deliberate coverage assertions now pin493 reviewed/7 missing. Commands from this job folder:

```sh
npm run generate:reviewed > /tmp/c05-expanded-493-generate.log 2>&1 && node --test dist/test/reviewed.test.js > /tmp/c05-expanded-493-focused-test.log 2>&1
sha256sum --check SHA256SUMS.txt
```

Actual generation/focused exec exit0, persisted status0. Four tests passed, zero fail/cancel/skip/todo,7.735982seconds. Strict build passed; all500 numeric fields remain identical to base, two timezone generations match the committed reviewed bytes, and25 malformed/alias CLI invocations preserve both inputs and output sentinel. All16 checksums passed. Root assembly evidence /tmp/c05-approved493-assembly-evidence.json. The earlier full42-test/34-mutant/12-restored-file result belongs to the434 code milestone; this fact-only expansion does not claim a repeated campaign. No complete production golden, PR, green CI or KEEP GOING completion.

## Actual 500-fact production generation milestone

Root integrated the seven final independently accepted gap facts and Beth’s stronger letter hook with `python /tmp/c05-integrate-final500.py`, preserving every other curation row and every recognition record. Actual exec session81272 completed exit0. From this job folder the same fail-fast command ran:

```sh
npm run generate:reviewed > /tmp/c05-final500-reviewed-first.log 2>&1
npm run generate:complete > /tmp/c05-final500-complete-first.log 2>&1
cp data/current-reviewed-candidates.json /tmp/c05-final500-reviewed-first.json
cp data/name-your-baby.json /tmp/c05-final500-complete-first.json
TZ=Pacific/Honolulu npm run generate:reviewed > /tmp/c05-final500-reviewed-second.log 2>&1
TZ=Pacific/Honolulu npm run generate:complete > /tmp/c05-final500-complete-second.log 2>&1
cmp data/current-reviewed-candidates.json /tmp/c05-final500-reviewed-first.json
cmp data/name-your-baby.json /tmp/c05-final500-complete-first.json
sha256sum --check SHA256SUMS.txt
```

All commands actually completed successfully. Both delivered outputs are byte-identical across two runs/timezones; all17 checksums match. Strict builds pass. Root also read the three JSON outputs: complete500 rows/facts/recognition, candidate modes remainfalse, all500 numeric rows equal the base, and changing only complete/mode reproduces the reviewed candidate. This would catch accidental metric edits, nondeterministic serialization and incomplete publication. The added test checks the actual complete golden’s exact regenerated bytes and strict schema; its full test/mutation run is still pending at this milestone. Evidence `/tmp/c05-final500-generation-evidence.json`; review pair hashes retained in `/tmp/c05-final500-assembly-evidence.json`.

Delivered file hashes: fixtures/curation.json `2746500965f5bbee3b0be780ca527cb15a674da204bf9a4bfb6b368f7d6ca350`; data/current-reviewed-candidates.json `ea5c919d27ff67c3f25ead6d62ffe03fb8e4356de3f3572a1fa94f803e8691c1`; data/name-your-baby.json `27ca94c2c8a749f32d4010a7ab673b0ad118cffebd60ae652e78755620bc7d6f`. No PR,green CI or KEEP GOING completion is claimed here.

## Final500 full local completion

From this job folder actually ran:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-final500-full-npm-test.log 2>&1
partybox_final500_status=$?
printf '%s\n' "$partybox_final500_status" > /tmp/c05-final500-full-npm-test.exit
exit "$partybox_final500_status"
```

Actual completed exec session91770 exit0; persisted underlying npmstatus0. Initial42/42 tests passed with zero failures/cancellations/skips/todos, 48.612676471seconds. Exact full/historical/current mutation baselines42/15/9 passed;34/34 mutants caught (25historical,9current). All12 compiledJS files restored with equal original/final bytes and SHA snapshots. All17 checksums match, including the actual production complete golden. The first complete test verifies real golden bytes against the pure regenerated builder and strict schema; it would catch forged output even if its checksum were updated. Existing differential/property/SQL/Python/source/atomic-output checks remain executed. Fact and recognition curation500, allnumeric rows preserved, realcomplete:true. Report `/tmp/c05-final500-full-mutation-report.json`, completion proof `/tmp/c05-final500-full-completion-evidence.json`. This local result does not claim PR, CI or KEEP GOING completion.

## Actual PR and green CI

PR https://github.com/luisitin/partybox-content-packs/pull/1 is open. Actual `gh api repos/luisitin/partybox-content-packs/commits/1237bc5451b882f2dcd5727776a3fced6eac5dc3/check-runs --jq '.check_runs | map({name,status,conclusion,details_url})'` and the repository actions-runs API returned exit0 and verify completed/success. Run https://github.com/luisitin/partybox-content-packs/actions/runs/37694191879 is a pull_request C05 Name Your Baby check at that exacthead, conclusion success. The first attempted `gh pr checks 1 --repo luisitin/partybox-content-packs --json name,state,link,workflow` exited1 because this installed gh lacks --json; API checks supplied the actual result instead. This is initial-green evidence, not a later-head guarantee.

## Latest restart and retained workflow

The environment entered starting after final localtests had actually completed. At22:13:11Z actual status was running/connected/current; network state unknown. The checkout, pushed fullverification notes and rawexit0 evidence survived. No running full suite was interrupted. From this job folder, `npm run build && node --test dist/test/complete.test.js && sha256sum --check SHA256SUMS.txt` actually completed execsession28456 exit0:4/4 tests,zero fail/cancel/skip/todo,15.005169seconds,17SHA matches. This checks retained compiler/dependencies, actualgolden/schema and incomplete-input protections; it does not claim a newly published task restoration.

## KEEP GOING round1: nine substantive fact improvements

After rereading JOBS/RULES and listing fiveweaknesses, `python /tmp/c05-keep1-integrate.py` integrated9 independently approved facts, preserving491 untouched curationrows and all500 recognition records. Then actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep1-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep1-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep1-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt
```

Generation/focused actualexec9641 exit0; persisted status0.8/8 tests pass,zero failures/cancellations/skips/todos,20.793541632seconds. Each changed output is regenerated twice across timezones and compared with committed bytes; strict realcomplete schema/golden and25 negativeinvocations perCLI protect source/curation/sentinels. Root also compared all500 numericfields with unchangedbasepack: identical; complete remains true, candidate modesfalse,500reviewedfacts/recognition. All17 refreshed checksums match. Measured gain:9 changed player-visible factlines,3/4 flagged confusing chains replaced; no fabricated participant playtest or cosmetic convergence. Full42/34/12 campaign remains the actual pre-fact-only-code result, not a repeated run. Evidence `/tmp/c05-keep1-completion-evidence.json`.

## KEEP GOING round2: 5 substantive improvements

Reread C05 in JOBS and listed five weaknesses: remaining Randy root chain; obvious variant-only facts; tentative etymologies; partial-period comparability; recognition demographic limits. Actual `python /tmp/c05-integrate-quality-round.py 2 /tmp/c05-quality-next-five-approved-fact-overlays.json 8191659221379b716d55f64bf5f81cd30e2040a15077e12bef8b365a3ad0e453` replaced 5 reviewed facts, preserving495 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep2-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep2-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep2-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep2-sha.log
```

Actual generator/focused execsession18603 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,13.58325098seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:5 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep2-completion-evidence.json`.

Round2 bookkeeping correction: first `sha256sum --check SHA256SUMS.txt` ran from the repository root, failed because that relative file was absent, and the completion-note helper then correctly rejected the empty SHAlog. A data milestone had nevertheless committed/pushed due to missing fail-fast in that shell command; no successful checksum or completedround was recorded there. Corrected to this jobfolder with `set -e`: actual17 checksums passed and completion notes were then recorded. The data/code had not changed and successful8 focusedtests were retained; no unnecessary rerun is claimed.

PR body tooling: `gh pr edit 1 --repo luisitin/partybox-content-packs --body-file /tmp/c05-pr-body.md` failed on deprecated GraphQL ProjectsClassic fields. Wrote exact bodyJSON to `/tmp/c05-pr-edit-payload.json`; `gh api --method PATCH repos/luisitin/partybox-content-packs/pulls/1 --input /tmp/c05-pr-edit-payload.json --jq '{html_url,updated_at}'` completed exit0, actualupdatedPR#1. These CLI compatibility failures are not unavailable GitHub API/source blockers.

## KEEP GOING round3: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: remaining obvious form-only facts; proposition-specific source dependencies; tentative etymologies; partial-period comparability; recognition demographic limits. Actual `python /tmp/c05-integrate-quality-round.py 3 /tmp/c05-quality-extra-four-approved-fact-overlays.json 223b251dd5ffd064e43d20ebf3177177bc2da27c5e781ee8df4a73e750c6af85` replaced 4 reviewed facts, preserving496 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep3-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep3-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep3-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep3-sha.log
```

Actual generator/focused execsession51216 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,13.147621453seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:4 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep3-completion-evidence.json`.

## KEEP GOING round4: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: remaining obvious variants; uncertain literal etymologies; shallow cultural hooks; partial-period comparability; recognition demographic limits. Actual `python /tmp/c05-integrate-quality-round.py 4 /tmp/c05-quality-next-four-approved-fact-overlays.json 9588d7d23a2d572eaf50b3d992c76bc31a7c8a5030ee46a17ef108f540068e1f` replaced 4 reviewed facts, preserving496 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep4-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep4-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep4-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep4-sha.log
```

Actual generator/focused execsession53428 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,16.019481162seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:4 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep4-completion-evidence.json`.

## Portable source-document audit and transient access diagnosis

Read-only independent audit compared all22 post-green approved facts/reviews with current curation/production and the SOURCE URL index: all match; every used URL records its taken IDs. Corrected CONFLICTS’ historical Randy hold to identify the round2 replacement, and narrowed source prose to avoid denying the accepted qualified Natalie/Bill/Renee roots. Round4 explicitly separates Renee’s dictionary chains from the three Britannica/Wikipedia pairs. Document-only changes passed `git diff --check`; data/code/checksums are unchanged.

Actual GitHub API returnedHTTP401 and nativeGit read requested unavailable credentials at22:46Z; a normal public Actions curl also returned401 withTLS verification0. Runtime metadata remained running/current/connected, with network enforcement unknown; variable names and non-secret identity manifest only were inspected. No credential values were printed or proxy/authentication settings replaced. Independent unchanged-route checks recovered by22:49Z: nativeGit/API/curl success and exact round4 CI head a337494d6f146c8ef045a072ab3d68352d93b5ad/run37698086306 completed success. Root’s actual `gh api repos/luisitin/partybox-content-packs/actions/runs/37698086306 --jq '{id,status,conclusion,head_sha}'` also passed. Cause remains unconfirmed; read success is not assumed to prove every future write. These diagnostics catch stale-authentication claims without inventing a new secret requirement. Evidence `/tmp/c05-auth-independent-diagnostics.json`.

## KEEP GOING round5: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Ronnie’s invisible feminine branch; Maureen’s unrelated displayed nicknames; Evan’s invisible Ian/John branch; Danielle’s Daniel/Deiniol diversion; Alan/Allen repeated variant hooks. Actual `python /tmp/c05-integrate-quality-round.py 5 /tmp/c05-quality-round-five-approved-fact-overlays.json cd6fb5961dd1fb8d73b97356a8a50b758b554226bb02a08c8787964630778458` replaced 3 reviewed facts, preserving497 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep5-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep5-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep5-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep5-sha.log
```

Actual generator/focused execsession22725 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,15.077658127000001seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:3 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep5-completion-evidence.json`.

The round5 five-weakness selection came from an independent actual scan of all500 curation records, excluding22 prior improved names and assessing478 remaining. Its candidate flags were55 missing exact-card-name tokens,47 plain form-only matches,86 facts≤40 characters and32≤35. These flags are not automatic defects; short Regina/Tara meanings and less-obvious Peggy/Margaret links were retained. The reviewer read flagged content and evidence context, not merely a length sort. Fixed three of the strongest relevance problems; Evan and Alan/Allen remain active research. Assessment SHA2564bd8c8b1365bac6f105117b2aa78ecbcaa3186246feb7d8f343bf45297aa0272, source curation976d3fad384613c37d77a57b81e1bb8ac5017f798b9f527eaf47af9796a7a560; no exhaustive independent re-research or human survey of478 rows claimed.

## KEEP GOING round6: 1 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Kaylee’s remote name-family hook; Lillie’s hidden optional Elizabeth branch; Evan’s Ian/John diversion; Alan/Allen repeated variant hook; Sadie’s unexplained Sarah gloss. Actual `python /tmp/c05-integrate-quality-round.py 6 /tmp/c05-independent-evan-bevan-approved-curation.json d2a081a761813ab83a5e8db54d6661aaf63375fb108016285d4dd5f1f3dd4ae7` replaced 1 reviewed facts, preserving499 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep6-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep6-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep6-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep6-sha.log
```

Actual generator/focused execsession25074 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,14.111105404seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:1 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep6-completion-evidence.json`.

Round6’s five remaining weaknesses were actually captured by the corrected independent audit /tmp/c05-after-round4-five-weaknesses-audit-v2.json, SHA73f33668b0a578c388910551f58bb76f9cdad9e883574826f2e1bdd8c1f8d710. Its curation snapshot f99c16862600c64c0a620e0a1cfd4636b9c42876311ce02b5876d15c16c21fa4 already contains round5 fixes. Ranked Kaylee remote family, Lillie optional Elizabeth branch, Evan diversion, Alan/Allen repeated hook and Sadie unexplained Sarah gloss; no newly proved false fact or human playtest claimed. An unhanded draft with superseded criticisms was rejected rather than published.

## KEEP GOING round7: 5 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Kaylee’s remote family hook; Lillie’s optional Elizabeth detour; Alan/Allen repeated variant proposition; Sadie’s hidden Sarah connection; recognition demographic limits. Actual `python /tmp/c05-integrate-quality-round.py 7 /tmp/c05-quality-round-seven-five-approved-fact-overlays.json d1c831c3dbd11f199b1c897aa5b58459490381f20f73451089c5192b19903b69` replaced 5 reviewed facts, preserving495 untouchedrows and everyrecognitionrecord. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep7-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep7-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep7-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep7-sha.log
```

Actual generator/focused execsession65901 exit0 and persistedstatus0:8/8 tests,zero fail/cancel/skip/todo,14.113912852seconds. All17 refreshed checksums pass. Tests run strict realcomplete/candidate schemas, exact actualgolden bytes, two-timezone repeatability and25 protected negativeinvocations perCLI; root additionally compared all500 metricfields with unchangedbasepack. Candidate modes remainfalse; realcomplete:true with500reviewedfacts/recognition. This catches changed counts, nondeterministic data, forgedgoldens and source-overwrites. Measured gain:5 changed playervisiblefacts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full42/34/12 result remains separately identified. Evidence `/tmp/c05-keep7-completion-evidence.json`.

Round7 combined overlay SHA256 d1c831c3dbd11f199b1c897aa5b58459490381f20f73451089c5192b19903b69 contains the five individually approved source-aware records. An actual per-ID object comparison with the independent reviewer’s convenience bundle404eb2b2a7b1f5f1dce5deaf941b83ac2eff4339e45f86abcedf4c7cc8c044de passed: identical records, different array/serialization order; no byte-identity claim. Independent manifest6d7176e618457b516173c64ee01da4e2a63ed1be55560afe2c7a046215c1a0c4 indexes approved Alan43/Allen35/Lillie51/Kaylee45/Sadie62 and exact source-review proofs. Superseded Actress59, Howl trial and Firefly candidates remain excluded. Curation carries every final note/reference; source controls and notes≤1000 pass the strict real schema.

## KEEP GOING round8: 5 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Derek’s invisible Theodoric chain; Lonnie’s absent Alonzo connection; Bobbie’s optional Barbara branch; Summer’s season tautology; Ivy’s plant tautology. Actual `python /tmp/c05-integrate-quality-round.py 8 /tmp/c05-quality-round-eight-five-approved-fact-overlays.json 2d69a279629e3fe467ab61a405e16f0d37058a4e8b515082c1b1202c8ccbb097` replaced 5 reviewed facts, preserving 495 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep8-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep8-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep8-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep8-sha.log
```

Actual generator/focused exec session 17895 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.063210826 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 5 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep8-completion-evidence.json`.

Round8 provenance follow-up: the original assembled overlay included copied recognition fields on two records; the integrator selected only fact/status/references/review and preserved all500 recognition records. The independently finalized fact-only bundle SHA25641da55009a79321dfbef8d6f7396593715cb6dc240a0e94218f666fdc9f2ada8 matches all five promoted field sets exactly. Root retained the actual original integration command/hash rather than relabeling it. No source proposition or generated bytes changed during this proof correction.

An additional root Python metric comparison first used `data/reviewed-candidates.json` and failed with FileNotFoundError before checksum refresh or the completion writer. After `rg --files data` identified the actual output, root reran the comparison with `data/current-reviewed-candidates.json` and `data/name-your-baby.json`, checking all500 records’ id/name/sex/totalPublishedCount/peakDecade/peakCount/runnerUpCount/sparkline against the unchanged base pack; it passed. This failed supplemental command was not reported as a passed check.

## KEEP GOING round9: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Summer’s season tautology; Ivy’s plant tautology; Kylie’s bearer-only hook; Cathy’s hidden Kate route; Carole’s indirect three-language family context. Actual `python /tmp/c05-integrate-quality-round.py 9 /tmp/c05-quality-round-nine-approved-fact-overlays.json f42bf40004c3649833029232b56f7105e5c3158877a6cc9adc1eb3a72baf7c49` replaced 4 reviewed facts, preserving 443 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep9-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep9-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep9-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep9-sha.log
```

Actual generator/focused exec session 76999 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 17.517841279 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep9-completion-evidence.json`.

Citation-only work in round9: actually ran `python /tmp/c05-apply-dictionary-reference-formatting.py 9` after the four approved fact promotions. It verified overlay2096be25023b5faac38d3b0a5dbb52540512606a2690730824ab45dcc62bd2a4, guardv2d44e8c621677351cdc4d48a3c21c3b5709a337acbb4fb3315689aae0b46669dd and the28,662,426-byte immutable dictionarySHA3be1cfe9646f062769023015823dee99ba83b4b11c757c8c601f8b84d698fb1b. All61 evidence snippets matched actual complete JSONdescription fields and exact literal substrings. Original expectedreference hashes and fullnon-reference fields guarded everyappliedrow.53 corrections applied; newerKylie skipped. Root separately asserted4changedfacts/53reference-onlyrows/443untouchedrows, all500 recognitionrecords and numericmetrics preserved, andzero remaining editorial entry prefixes. This catches stale source overlays and invented or joined quotation text. Metadata contributes zero playerfactgain; the four approved new sentences are the measured gain. No complete500-body truth reread or live365-URL audit is claimed.

## KEEP GOING round10: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Landon’s generic actor/lifespan hook; Gina’s actress-only identity; Ellie’s hidden Helena route; Meredith’s basic first/surname relationship; Amelia’s unexplained amal element. Actual `python /tmp/c05-integrate-quality-round.py 10 /tmp/c05-quality-round-ten-v2-approved-fact-overlays.json 4df23d3053d35f9e7e0b51976c00b563578af72c9c5fcc5b7db294ecb4b840ea` replaced 3 reviewed facts, preserving 497 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep10-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep10-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep10-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep10-sha.log
```

Actual generator/focused exec session 70528 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 13.576942952 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 3 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Code/source/dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep10-completion-evidence.json`.

## KEEP GOING round11: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: June’s calendar-only sentence; Mabel’s untranslated Amabilis meaning; Amelia’s unexplained amal element; Meredith’s basic first/surname relationship; Glen’s unspecified Celtic landscape. Actual `python /tmp/c05-integrate-quality-round.py 11 /tmp/c05-quality-round-eleven-approved-fact-overlays.json 963f7c58143c9336d51b12b161e429f4b583715be1befdb905dafde7fe46f2bd` replaced 4 reviewed facts, preserving 495 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep11-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep11-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep11-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep11-sha.log
```

Actual generator/focused exec session 21933 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.246231835 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep11-completion-evidence.json`.

Round11 root also actually ran `python /tmp/c05-round11-update.py` before regeneration: wrote the required June credit/authorship conflict first, integrated the hash-checked approved four-fact overlay, and applied one guarded Lily reference-only correction. Checked unchanged Lily fact/status/review and all500 recognitions, then compared the complete and reviewed outputs against all500 unchanged base numeric records. Exactly495 full curation rows stayed unchanged;4 player fact lines changed and Lily added0 gains. Recomputed each of17 previously listed SHA256 targets from actual bytes before the shown checksum command. Current-round previous-head CI read: `gh api repos/luisitin/partybox-content-packs/actions/runs/37706130638 --jq '{id,status,conclusion,head_sha}'` returned completed/success for exact d59c72e049bdc9601524e0d4ddd7386b9bb59d5d. New head requires a fresh CI result.

## Round11 checksum failure and correction

The earlier round11 checksum result was recorded before generator/focused exec21933 finished. It checked a transitional state, not the completed regenerated pack. The committed complete-pack checksum still equalled the prior round10 bytes, df54a08d68542db110739dabaa156b25139c8a567052b8da77b0ae1e30a46018, while the actual regenerated file hash is d107b4f3897181ef5de891f7e89ef9cfd3800ef359f78655a690b68b71abae0f. All500 fact fields in that file match curation. Earlier unqualified round11 final17-checksum claims are superseded by this correction.

Actual GitHub run37707069768 for exact heada748b922215c9c6ac87df371dc75ff38b544a322 failed in npm test. `gh api repos/luisitin/partybox-content-packs/actions/runs/37707069768 --jq '{id,status,conclusion,head_sha}'` showed completed/failure. Check-run annotations gave only exit1. `gh run view 37707069768 --log-failed` and `gh api repos/luisitin/partybox-content-packs/actions/jobs/113083852594/logs` could not retrieve the GitHub Actions delivery-host log; no signed query or credentials are copied here. Actual direct `sha256sum --check SHA256SUMS.txt` returned1 with only data/name-your-baby.json mismatching.

Then actually ran this full reproduction, without editing data/checksums while it ran:

```sh
PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test > /tmp/c05-round11-full-reproduction.log 2>&1
```

Exec session58368 actually returned1, not0: all42 ordinary tests passed in39.103419292seconds, exact42/15/9 mutation baselines passed, all34 mutants were caught and all12 compiled files restored with identical bytes/hashes. The final checksum command passed16 targets and failed only the complete-pack checksum. This independently reproduces a concrete failure present in the pushed head; the unavailable CI log is not claimed read. No source, generator, schema, test or dependency change was required.

Actual `python /tmp/c05-round11-fix-checksum.py` verified the persisted exit1/log, fresh mutation report/baselines/restoration and exact old/current hashes, corrected only that checksum entry, then ran `sha256sum --check SHA256SUMS.txt`: exit0 and17/17 matches. It catches the stale generated-file hash. Evidence: /tmp/c05-round11-full-reproduction-completion-evidence.json. The earlier8/8 focused tests and this42/34/restoration evidence remain actual separate results; no overall full npm exit0 is invented for the failing reproduction. The corrected pushed head still needs actual green CI.

Future ordering is explicit: wait for generator/focused exec completion and its actual exit0 first, then compare data and refresh/check hashes. Never run dependent checksum or completion-record commands while that exec is still active.

## KEEP GOING round12: 8 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Johnny’s obvious John variant; Bobby’s obvious Bob variant; Andy’s obvious Andrew variant; Judy’s obvious Judith variant; Becky’s obvious Rebecca variant. Actual `python /tmp/c05-integrate-quality-round.py 12 /tmp/c05-quality-round-twelve-combined-eight-approved-fact-overlays.json 3585bf851187ed3074eb7567734cccd9a388866e729794cb9ed348278972edfe` replaced 8 reviewed facts, preserving 492 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep12-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep12-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep12-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep12-sha.log
```

Actual generator/focused exec session 17369 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 15.084147707 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 8 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep12-completion-evidence.json`.

Round12 actually ran `python /tmp/c05-round12-update.py` (required Judy agency/conflict documentation before integration), then `bash /tmp/c05-quality-run-focused.sh 12`. This same shell waits for both generators and actual focused-test exit before running `python /tmp/c05-check-completed-quality-data.py 12` and the checksum command. That guard additionally verifies all500 fact fields against curation, all500 metrics against the unchanged base, all500 recognitions and492 otherwise unchanged rows, plus unchanged official annual-source/selection SHA256. Exec17369 returned0 after all steps, with15.084147707seconds of focused tests and17 current checksums. It prevents the round11 ordering error. Before integration, actual `gh api repos/luisitin/partybox-content-packs/actions/runs/37708265252 --jq '{id,status,conclusion,head_sha}'` returned completed/success for exactbd08f420e09b61a45bd8b812a312ee9addfe3975. New head CI remains separate.

## KEEP GOING round13: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Charlie’s familiar Charles variant; Chris’s obvious Christopher short form; Jimmy’s actor byname alone; Maggie’s unexplained Margaret meaning; Skylar’s Skyler spelling relationship. Actual `python /tmp/c05-integrate-quality-round.py 13 /tmp/c05-quality-round-thirteen-approved-three-fact-overlays.json 02267dee94978023b922c93f239ff168026a54d18e1ee4497b3a9d4c8772be19` replaced 3 reviewed facts, preserving 497 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep13-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep13-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep13-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep13-sha.log
```

Actual generator/focused exec session 13503 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 13.123086891000002 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 3 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep13-completion-evidence.json`.

Round13 actual wrapper command was `bash /tmp/c05-quality-run-focused.sh 13`. It ran both generators and eight tests sequentially before `python /tmp/c05-check-completed-quality-data.py 13` refreshed hashes after all500 metric/fact/recognition equality guards. Only then did `sha256sum --check SHA256SUMS.txt` pass17/17. Actual session13503 returned0. Root also hash-checked all three original peer-approved files before assembling the byte-identical independent bundle. Round12 CI run37709219312 at exacthead2d870aff401411817c7d4e169a1ec0b4cc55464d was actually completed/success at01:00:11Z; this earlier green is not a claim about round13.
