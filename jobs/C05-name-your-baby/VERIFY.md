# Verification record

Stage: delivered current500-name pack and separate historical30-name pipeline; checks below retain their actual chronology, failures and scope.
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

## KEEP GOING round14: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Allison’s familiar Alison spelling; Skylar’s Skyler spelling relationship; Maggie’s unexplained Margaret meaning; Catherine’s familiar C/K variant; Darryl’s Daryl doubled-R variant. Actual `python /tmp/c05-integrate-quality-round.py 14 /tmp/c05-quality-round-fourteen-approved-two-fact-overlays.json 88d2e0f19a57d7eac4531f29f678533810a7a393180be55a6ae1733d503904a5` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep14-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep14-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep14-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep14-sha.log
```

Actual generator/focused exec session 23514 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.57616704 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep14-completion-evidence.json`.

Round14 actual wrapper command `bash /tmp/c05-quality-run-focused.sh 14` awaited both generators and8 tests before `python /tmp/c05-check-completed-quality-data.py 14` compared both output facts/metrics, all500 recognition records,498 untouched full rows and refreshed17 hashes. Then `sha256sum --check SHA256SUMS.txt` passed17/17; session23514 returned0. Actual `git diff --check` also returned0. Prior current-head CI run37712120146/exacthead5d15edd24442043cfacd0881cb8dcb6baef57a1b completed/success before integration; this is not a result for the next head.

## KEEP GOING round15: 7 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Roman’s repeated-word Latin gloss; Darryl’s familiar spelling-only relationship; Maggie’s hidden pearl meaning; Jeffrey’s ordinary Geoffrey form; Willie’s familiar William contraction. Actual `python /tmp/c05-integrate-quality-round.py 15 /tmp/c05-quality-round-fifteen-seven-approved-fact-overlays.json 3ada8c190963415fe45e4420bdc311f288d5d0c0c20cf4f3473a84a4b98be70a` replaced 7 reviewed facts, preserving 482 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep15-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep15-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep15-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep15-sha.log
```

Actual generator/focused exec session 26857 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 19.138494584 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 7 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep15-completion-evidence.json`.

Round15 actual wrapper `bash /tmp/c05-quality-run-focused.sh 15` waited for both generators and8 tests before `python /tmp/c05-check-completed-quality-data.py 15` checked both generated outputs, all500 metrics/recognitions and482 untouched whole-round rows, then refreshed17 byte hashes. Actual `sha256sum --check SHA256SUMS.txt` passed17/17 and `git diff --check` returned0; session26857 returned0. Before integration, exact round14 head6865e9d44ee277942eb2cde64a375cd61baf5c91/run37712889579 actually passed CI.

The references-only proposalSHAf75d78dc9bbe4525ab1b7504a3639cde45269baad6cc7a4fdf64f1400677fb2f/auditSHA51f1f99a93402c8d753d30a762c7b26fa19a28cf5ea08704b5a9c17dd73b1c3c were independently accepted by root after reading ten full selected Wiki leads and the complete actual human Scooby-Doo paragraph in two untruncated batches. Actual primary guards checked API/body/revision hashes and contiguous whitespace-normalized replacements; per-row canonical snapshots, expected old arrays, unchanged fact/status/review/recognition fields, controls,2–8references and retained author/work groups all passed before mutation. Evidence `/tmp/c05-reference-eleven-root-acceptance.json`; source repair adds zero player gains. Root preserved all482 rows outside the disjoint7fact/11reference-repair sets. Earlier source auditor metadata coverage of276Wiki pins and42 manual contexts is bounded evidence, not a new all500 body audit or deep-lineage certification.

## KEEP GOING round16: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Gwendolyn’s familiar spelling variant; Jayden’s spelling-only relationship; Jeffery’s sentence about another spelling; Kayla’s character identity alone; Julie’s familiar Julia relationship. Actual `python /tmp/c05-integrate-quality-round.py 16 /tmp/c05-round16-four-root-approved.json 4bf845d2c1db415e3be924a11efe4e52986418a37378fca2110858aafaee440d` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep16-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep16-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep16-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep16-sha.log
```

Actual generator/focused exec session 11029 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.389423516999999 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep16-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 16`; generators and eight tests fully completed before the numeric/hash guard and 17 checksums. Actual wrapper session11029 exit0 establishes the sequential result. Prior exact-head CI for round15 head51227aadb63209fe67f2504810a0426a559fcfcd/run37713928277 was completed/success when read at01:43:48Z; this does not establish the next head’s result.

A second independent peer actually reread all ten Wiki leads, the complete human Scooby/Velma context and thirteen dictionary headwords behind round15’s eleven reference-only repairs. Its review SHA caa5c0c2bae566dbd3f76406a8dc73573c4849f34806da6c36fff58f3c386079 and manifestSHA eaf6e5f8039731d3530ff761461423cef53ad52e4ff7015069c3132794107fb7 corroborate the original source-guarded proposal without changing facts, source identities, recognition records or gain counts. This is historical source confirmation, not a new whole-pack lineage certification or reapplication of old guards.

Fresh post-round15 actual content assessment: complete500 fact lines read in two untruncated displays;493 ranked after seven active exclusions,22 complete evidence/recognition records inspected. ArtifactSHA c3d196b28f8a2122bd7467786973666e4e2ab9f82d20333d0576baf7ef8b149e. Cole’s unexplained Cola root and Gloria’s obvious glory gloss are stronger opportunities; Kaylee’s remote syllable hook and Randall’s unexplained Randel need investigation; Valeria’s valid feminine relation should remain if no material improvement exists. This source-body-free editorial assessment is not a participant study, new source verification or zero-gain round.

## KEEP GOING round17: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Julie’s familiar Julia relationship; Max’s basic Maximilian shortening; Charlene’s missing direct modern-name link; Cole’s unexplained Cola root; Gloria’s nearly obvious glory gloss. Actual `python /tmp/c05-integrate-quality-round.py 17 /tmp/c05-round17-three-root-approved.json 4cd638785cd59f27477a3676d726fffb2e0b6074bc858b1b75a5a43a888f9351` replaced 3 reviewed facts, preserving 497 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep17-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep17-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep17-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep17-sha.log
```

Actual generator/focused exec session 15146 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.914754322 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 3 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep17-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 17`; its session15146 completed exit0 before dependent numeric/hash/check-completion work. Both generators ran sequentially, all8 focused tests and17 hashes passed; all500 numeric and recognition records are preserved. Prior exact round16 CI head8ca4e075654e11b3937b8bf2ccf40e57cae174de/run37714870326 actually completed/success when read after reconnect at01:56Z. Next head must be checked separately.

Actual retained-source attribution check parsed the Charlene independent proof’s recorded policy URL and corrected the initially mistyped new documentation link before delivery: https://babynames.com/about/copyright. No new source body or job test was fabricated. Reconnect check actually ran `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, `node --version`, `/workspace/.partybox-source-venv/bin/python --version` and sha256 comparisons on ready approval files: clean branch/current16 head,Node24.19.0,Python3.12.14 and exact retained artifact hashes. This is retained-workspace verification, not a fresh-task install/publication test.

## KEEP GOING round18: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Cole’s unexplained Cola root; Gloria’s nearly obvious glory gloss; Randall’s unexplained Randel relationship; Kaylee’s thin exact-name nautical hook; Debra’s repeated Deborah-root fact. Actual `python /tmp/c05-integrate-quality-round.py 18 /tmp/c05-round18-three-root-approved.json 01e655b09b933bf0795006abd89da302b60443627f0bd80ca7878843ce693fc6` replaced 3 reviewed facts, preserving 497 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep18-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep18-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep18-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep18-sha.log
```

Actual generator/focused exec session 82625 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.527732427 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 3 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep18-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 18`; session82625 completed exit0 before dependent numeric/hash/check-completion operations. Both generators,8focused tests and17hashes passed; all500 numeric and recognition records are preserved. Prior exact round17 CI head2c9858c3aed5a597bca39c24174a0158c7c3b51c/run37715654102 actually completed/success when read02:05:51Z. This does not establish the next head’s result.

Read-only assessment agent read all500 fact lines and18 complete curation records, frozen original snapshotSHA c8e321d976c82e67541a8405fe14cea90f148af2ceecc24885880a9279c21935. Its final v2 assessmentSHA87c83c8c10f5b6fd911812b1737ec9dc6936e00b84e565702d5e759cec3f4274 preserves explicit useful-fact retentions and Vickie’s low-gain clarification hold. Bounded Kaylee auditSHA1c10165e1be78f46cd64766faa88f96ba61ceadddf26611b9e3ff8ff09b09c3e records ten fresh receipts and actual ordered GitHub/registry fallbacks, no two-work Firefly replacement or demonstrated dictionary gain. Root read audit structure and final source outcomes; it does not claim an additional independent body reread of that set. No player study, false-fact claim or zero-gain LOOP entry is inferred.

## KEEP GOING round19: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Danny’s repeated Daniel-root fact; Kathryn’s invisible Katherine family; Mark’s basic Marcus variant; Wayne’s vague greatness reputation; Debra’s repeated Deborah-root fact. Actual `python /tmp/c05-integrate-quality-round.py 19 /tmp/c05-round19-four-root-approved.json ba9af58ef0251cdcc5bee8a07876bb6799757b322ae304e17b8b571dd111fcd4` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep19-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep19-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep19-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep19-sha.log
```

Actual generator/focused exec session 24417 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 16.228946111 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep19-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 19`; sequential session24417 completed exit0 before dependent metric/hash/check-completion work. All8focused tests and17checksums passed, with all500 metrics/recognition records preserved. Prior exact round18 CI head178db15608687fc3fae70dd5b54a8e95f4338558/run37716357171 actually completed/success when read02:14:04Z; the next head needs its own CI. Root compared approved source-author arrays with the new source prose: Fred Frommer,Amy Tikkanen,Thomas V. Quirk,Editors plus Wiki contributors exactly. Six canonical work-ID alias changes are independently guarded against original approval fields, without a fresh-body reread or extra gain claim.

## KEEP GOING round20: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Debra’s repeated Deborah-root fact; Darren’s bare Darrin character identity; Samantha’s bare lead-character identity; Shelly’s plain Frankenstein authorship; implicit uncommon family bridges with no demonstrated replacement gain. Actual `python /tmp/c05-integrate-quality-round.py 20 /tmp/c05-round20-four-root-approved.json 6648e78f2badf6beba001fa91bbd7ddd8d0e170415aa9cde3651e6c16dbe8c10` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep20-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep20-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep20-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep20-sha.log
```

Actual generator/focused exec session 9199 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 17.613572693 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep20-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 20`; actual sequential session9199 completed exit0 before dependent metric/hash/check-completion work. All8focused tests and17checksums passed, preserving all500 numeric and recognition records and496 complete unchanged rows. Source index has430actual distinct URLs. Prior exact round19 CI head3189b9c128bdd4c85c0c0ca22d0a1236d5df7e24/run37717336404 actually completed/success when read02:25:51Z; the next head needs its own result.

Root hash-checked every individual approved overlay before exact-five-field assembly and compared source-author/work arrays. Samantha/Darren share one actual source pair rather than four independent works. Shelly’s contextual BTN entries do not count as challenge corroboration; its Wiki retrospective primary account is not another independent historical witness. Source-only parents/peers performed actual raw-body/identity/credit/quote reads; root does not fabricate film/TV viewing, additional underlying books or whole500 original-body certification.

The actual post19 complete-text assessment read500facts/23complete records and stayed byte-identical at completion; source-free scope and rereads after initial truncated record output are explicit. Root independently verified current curation equaled its frozen snapshot before20. AssessmentSHA5ffe54d05030e02ed42a985b3eaf765a35aef92f64b03b6b150b52361b04f416 supported these content priorities, not participant outcomes or a zero-gain LOOP entry.

## KEEP GOING round21: 5 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Tonya’s hidden Antonia bridge; Cecilia’s unspecified Roman family root; Claudia’s unspecified Roman family root; Marcia’s unspecified Roman family root; Breanna’s repeated Briana literary hook. Actual `python /tmp/c05-integrate-quality-round.py 21 /tmp/c05-round21-five-root-approved.json bdd6b4635a2fada265be0725a40bd940664fb37f9a5088665f76814ea0fc9e33` replaced 5 reviewed facts, preserving 495 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep21-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep21-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep21-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep21-sha.log
```

Actual generator/focused exec session 14650 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 15.025120403 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 5 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep21-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 21`; session14650 exited0 before all dependent completion/hash checks. The full500 metric/recognition guards and495 unchanged-row guard passed, as did8 tests/17 hashes. Root hash-checked the frozen individual approvals, exact-five-field assembly and Breanna review/manifest; no additional root raw-body read is claimed. Tonya visible attribution and source-specific dictionary/encyclopedia limits replace the helper's generic paragraph. Prior exact20 head2eb81898d78c0ab860b9707857b34e64e6bfa774 CI37718934766 was actually completed/success at02:46:22Z. This head needs its own CI.

Two post20 actual complete-text assessments froze curationSHA748b5498c7b90de0cbbe5fdd33372cb745f1a0b32afb2cd0b1bf17e153d43217 and inspected29/30 complete records respectively. Assessment hashes3cb15cde232737172632d6999cf391c9211b4dfbd4ef75c2cf84c48b26e274a7 and4d738db5b3fa7eb5b7152c2ef522b8bb4bfccc277465d8bfbd0d5e7965f4ae2c were actually checked by root. They informed concrete priorities without proving original-body500 source independence, participant outcomes or convergence. Breanna source receipts establish HTTP200 and matching body hashes; no numeric CONNECT/TLS proof was recorded or invented.

## KEEP GOING round22: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Eliza’s repeated Elizabeth contraction; Haley’s repeated hay-clearing fact retained without a proven independent alternative; Brody’s implicit historical town and period; Dustin’s unexplained Norse roots; Alvin’s unexplained older name branches. Actual `python /tmp/c05-integrate-quality-round.py 22 /tmp/c05-round22-four-root-approved.json 0ed984350ca5e9121ead9d6fe18596524ec6ca4030ce505cce15fcbf336c09cf` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep22-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep22-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep22-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep22-sha.log
```

Actual generator/focused exec session 50863 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.453557273 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep22-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 22`; sequential session50863 completed0 before dependent comparisons/hash/check-completion/Git work. All8focused tests/17checksums passed, with all500 metric/recognition records and496 full otherwise unchanged rows. Root hash-checked each individual independent approval before exact-five-field assembly; the new source prose reflects actual author identities (Bauer, Editors, Wiki contributors, BTN and Yonge). Prior21 exact headdeacdf1319e921cd20bb76cf4d3c3755be3905e8 CI37720394415 actually completed/success when read03:02:05Z. This new head needs its own result.

Root actually read full selected Dustin/Alvin Wiki lead/etymology/citation scope and matched raw API page/revision/text/timestamp/body/header hashes; full BTN selected descriptions; and Yonge full Thor section/title/1884/contrasting index. An unrelated long Alvin bearer-list output was truncated and not claimed fully read. Independent reviewer also read all selected raw source contexts; the unavailable Nordic body and underlying Hanks/primary books stay unread/count0. Exact root read scopes and independent acceptance limits remain in portable curation/SOURCES; neither creates whole500 source certification. Post21 assessment/scope/current snapshot hashes matched root before integration; report500full-lines/38complete-records and distinct challenger500/18 are bounded editorial assessments, not participant outcomes or zero-round evidence.

## KEEP GOING round23: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Carole’s implicit Carolus-family hook; Penelope’s modest English-use chronology; Philip’s half-explained horse root; Gerald/Gertrude’s identical spear-only facts; Howard’s unexplained Norse endpoint. Actual `python /tmp/c05-integrate-quality-round.py 23 /tmp/c05-round23-two-prepared-root-approved.json 801bbd7a0e79d9bb10782053b6402e598badf8ab91e0005d1aeddf1a1ea584ad` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep23-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep23-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep23-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep23-sha.log
```

Actual generator/focused exec session 26879 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 13.923754666 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep23-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 23`; session26879 returned0 before dependent500record comparisons/hash/check-completion/Git work. All8focused tests and17checksums passed; all500 metric/recognition records and498 otherwise untouched rows were preserved. Individually hashed independent approvals retain source-author values Roy/Ferry/Wiki, actual per-article human contexts and canonical work grouping. Root does not claim a new raw-body reread or full primary Odyssey/play/audio/chart inspection. Prior22 exact headc6facd82b67f18ec71b052f4cdf7ec933a824f2c CI37721799589 completed/success when actually read03:20:33Z; root reread C05/listed five weaknesses before integrating. This new head needs its own CI.

Root actually checked the frozen post22 assessmentSHAe2a7c974e2e815a52fd64ef49c7127a8a9c96fd8b5c8c4edebef64756b1347a0 and scopeSHAb98952279cb84d2b14457480509c47e159e9bf0ece790f23910760eee93876db against helper's pre23 snapshotSHAcecaebfe5da0c16506cb9e4389e21fb9f2899bdc1517881985db67833220bed3 after integration; do not invent a prior check timestamp. The actual scope500full-lines/33complete-records/2pending-overlays and separate challenger500/16+2 is source-free editorial assessment, not source independence or participant certification. Its prospective fuller name compounds require source review and do not establish a positive or zero-gain round by themselves.

## KEEP GOING round24: 5 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Keith’s unspecified place-name root; Howard’s unexplained Norse endpoint; Philip’s half-explained horse root; Gerald’s spear-only compound; Gertrude’s repeated spear-only compound. Actual `python /tmp/c05-integrate-quality-round.py 24 /tmp/c05-round24-five-root-approved.json 8e96e1aa55cc05d16615f4e121e7c2d35cc60a6e69edf326ac8c31587897b3de` replaced 5 reviewed facts, preserving 495 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep24-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep24-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep24-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep24-sha.log
```

Actual generator/focused exec session 33436 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.759311742 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 5 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep24-completion-evidence.json`.

Root actually ran `bash /tmp/c05-quality-run-focused.sh 24`; sequential session33436 completed0 before dependent500record comparisons/checksums/check-completion/Git. All8focused tests/17checksums passed, preserving495 whole untouched rows and all500 metrics/recognition records. Exactfivefield assembly hash-checked every individually frozen peer approval; root compared actual source-author arrays with source documentation. Howard root actual selected-context/API/header reads precede independent acceptance; other peer raw-body reads are not duplicated as root claims. Per-clause qualifier, compound alternative and copyright/source-lineage limits are portable in curation/SOURCES/CONFLICTS.

Prior23 exact head3aee53d3d0dea0cbc79b9d59b2acb1f6f776f6d1/run37722467720 completed/success when actually read03:29:50Z; root then reread C05/listed5 weaknesses before24. This new head requires its own CI. Root matched sourcecuration4338c15cd106aeb4eaf450a64952098a443bd11b7c858d958a8530375f1f0327 beforeintegration, then later matched helper's pre24 snapshot/reportSHA86c2eb7a301059c2396f3127ea69609de709e82864ff642b7f0c0d07adac4bee/scopeSHA59a9a8cb0d7599479d9096cf8613b7594115e52005832a8e8d43277c82914a40. Actual500full-lines/34complete-records/5pending-overlay scope is source-free editorial assessment, with no new challenger, participant measurement, originalbody500 certification or zero-round conclusion.

## KEEP GOING round25: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Mildred’s strength-only compound; Kevin’s birth-only compound; Louis’s famous-only compound; Bernard’s bear-only compound; Marissa’s bare Illinois place occurrence retained without a demonstrated replacement. Actual `python /tmp/c05-integrate-quality-round.py 25 /tmp/c05-round25-four-root-approved.json 59ae6e5fdb49b671b5a3e2a6a03c9b4ee88be543b5cf8fda91a64eb29b2de5e4` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep25-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep25-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep25-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep25-sha.log
```

Actual generator/focused exec session 93233 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.411808572 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep25-completion-evidence.json`.

Round25 wrapper actual completion was awaited before all hash/finish/Git operations: session93233 exit0. Prior exact round24 CI37723622347 completed/success at head386249d5555ad87d55042737ae177af977c4704a, read03:44:53Z. Root hash-checked all four controlling approvals and exact five-field shape/author identities before assembling bundle59ae6e5fdb49b671b5a3e2a6a03c9b4ee88be543b5cf8fda91a64eb29b2de5e4. The post24 editorial assessment read500 full player lines and40 complete records plus4 pending overlays; report7a5fecf675a87d2554fe4ae6ab5ea44128acd98a8b5ace99e65b246f74aaca8c/scope108363f3577322ac1aac070ee592218d9b10f3af1d1a899aacdfbcd603177f68 were read/hash-checked after integration and snapshot matched saved pre25curation55a8d09c21987a6f94096185b5b33dce0338065accfdc1912498350a487a459e. This is source-free prioritisation, not a source-body500 audit or participant study. Root's first temporary finish-helper extension failed compile before writing (quote-boundary error); corrected extension compiled before integration, with no repository data mutation from the failed command.

## KEEP GOING round26: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Marissa’s bare Illinois place occurrence; Brayden’s thin Braden/Tennessee bridge retained without a proven replacement; Virginia’s unspecified Roman legend; Briana’s mere literary character occurrence retained after scoped plot hold; Dennis’s opaque Dionysios endpoint. Actual `python /tmp/c05-integrate-quality-round.py 26 /tmp/c05-round26-four-root-approved.json 9e73b03e0660bf62e53d2d0a66085d1c70e2dff1f9a7e324a52ee59c7cdac69b` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep26-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep26-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep26-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep26-sha.log
```

Actual generator/focused exec session 72004 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.810998395 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep26-completion-evidence.json`.

Round26 root awaited the actual wrapper session72004 exit0 before finish/hash/Git operations. Exact round25 CI37724353904 succeeded at35ed0e40a89eff17804dc450199b1d7c201ec978, read03:52:36Z; C05 reread03:53:41Z. Root hash-checked controlling individual approvals: Marissa3958600ba4fb139a6c657ee26eb561003933d659a39c20975fb78a4f2243893b; Giovanniac95d444eb6f07fd6a01b2489793c130bacd332fb571e9d15b18b7f93c79230d; Dennis d2281a6452201c0a4093c4257344e13bc47dda1338fe583e3047eff0a8c3791c; Virginia354f4c58dcd6d5a258eceb54e4e3faae1d139a14707ab634c38615dbfcf0c23f. Exact five fields, actual author identities/lengths/notes≤1000 and required visible Marissa attributiond4e92feca80c2840f0320ea9e88fb76b1d4b1eaf7c844b6d8029d167b325a6d9 checked before integration. Post25 snapshot7974827a5f9ad467863e535b64c3dfe043251006666ccd0211b1474210eefb82 matched both current-before and saved pre26; report54cc918ef00d31defe8c832ef4f210f8aef0660d99ee1ba691e0e950c540d9a1/scope88af1b570dbd6a9c160ad862fbe70dbd546b01f3b635a77135a92221fd860fe5 read and hash-checked before integration. Separate source-free challengec4e9cc6a38c12c4ffa72509f03d7971b965d8ab75f32e6c05409c44832306993 bounds actual scope500 lines/10 complete records and no new bodies. No participant/root-all500-body/three-zero-streak claim.

## KEEP GOING round27: 4 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Brayden’s thin Braden/Tennessee bridge retained pending an independent replacement; Briana’s plain character occurrence retained after primary-only plot hold; Lori’s invisible Lorraine bridge; Tammy’s invisible Tamara/Tamar bridge; Stanley’s bare Streetcar character occurrence. Actual `python /tmp/c05-integrate-quality-round.py 27 /tmp/c05-round27-four-root-approved.json 7016155e836e7ee918c1342b08d43f4c7277618dcbe82c1c6b8c006acff33ca9` replaced 4 reviewed facts, preserving 496 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep27-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep27-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep27-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep27-sha.log
```

Actual generator/focused exec session 77140 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 12.766551251000001 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 4 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep27-completion-evidence.json`.

Round27 root awaited actual session77140 exit0 before finish/hashes/Git. Four individual controlling SHA approvals: Walter750280b998130bdc77aabc544c381c5ed048a1d3c98d9b2891e8cf1e373fd7df; Stanley91792b263f3f284253bb24ca83aab7d5c3140333dc0086324c598907421e700d; Lori6c00563cd3875fb63bdb0ffe26ed759ca476545db6b4a319ace4ce638644a48a; Tammyb5276f24f610dae66375f731e331b5e7fe34db1777f94cae26373214190aab61. Exact five fields/actual authors/lengths/notes≤1000/control0 checked, and required Tammy attributionf548aa6f52e38e8a31f6a87a8197c09422ca818926c8986297a14f77e42847f8 read/hash-checked before integration. Prior exact26 CI37725977204 at08c2e4281b051ee539812dc2e5ec1475fecbcbd5 completed/success, read04:14:48Z; C05 reread afterward. Post26 assessment actual500full lines/48complete records+4 separate proposals matched saved pre27aeb79f441c4500ac1eb3fccb2531a6996d362f88485fa5c3d4bf1ec1b43876f3. Report2c237192f806abfc96e45264827014238925df074fe85e6513d7fa548c152b76/scopeaa278a57f0aea4e1231cfa173d20fe5fe0a2bdb70fe9d00bbd1488b48cf57e8a were read/hash-checked before integration; no original-body500, participant or convergence claim. Metadata-only word-count/cast-scope corrections add zero separate fact gains.

## KEEP GOING round28: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Brayden’s thin Braden/Tennessee bridge; Colton’s bare pair of place occurrences retained without a demonstrated replacement; Briana’s mere character occurrence retained after primary-only plot hold; Arlene’s heroine-only opera context; Guy’s novel title/date occurrence pending actual plot review. Actual `python /tmp/c05-integrate-quality-round.py 28 /tmp/c05-round28-two-root-approved.json f819d75b360ce1beb77615fe26913df5060c2f5a8aa9201a995096ece05d0321` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep28-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep28-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep28-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep28-sha.log
```

Actual generator/focused exec session 7686 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 16.570698989 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep28-completion-evidence.json`.

Round28 controlling bundlef819d75b360ce1beb77615fe26913df5060c2f5a8aa9201a995096ece05d0321 was root-checked against each immutable independent approval; every prior numeric/recognition field and498 untouched full records preserved. Before integration root read/hash-matched post27 report/scope/current snapshot at04:26:32Z, then reread C05 after exact prior-head CI green. Actual assessment scope500 full fact lines/55 complete records/2 proposed fact-only overlays, not source-body500. Brayden different-copy copyright guard failure preceded approval and caused no repository change; later42 raw substantive policy matches/36 source-artifact hashes are source-review guards, not job-test counts. Actual mandatory visible attribution accompanied promotion. No measured recognition/participant/convergence claim.

## KEEP GOING round29: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Colton’s bare pair of places retained pending source-qualified origin review; Briana’s character occurrence retained after scoped plot hold; Guy’s novel occurrence pending second authored plot work; Olivia’s bare Twelfth Night character identity; Kelsey’s village occurrence retained without a demonstrated replacement. Actual `python /tmp/c05-integrate-quality-round.py 29 /tmp/c05-round29-two-root-approved.json 47b695fa2a76c9f3a33478c8e5b000f3c2b6c4a0e8eb9a02c3fbe7b2b6ede540` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep29-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep29-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep29-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep29-sha.log
```

Actual generator/focused exec session 65012 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 15.85510107 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep29-completion-evidence.json`.

Round29 root checked individual immutable Olivia/Ronnie approvals and combined47b695fa2a76c9f3a33478c8e5b000f3c2b6c4a0e8eb9a02c3fbe7b2b6ede540; all500 metrics/recognition and498 entire untouchedcuration rows remain identical. Actual8/8 focused tests/17SHAchecks after generator completion, session65012exit0,15.85510107seconds. Reconnected environment retained exact28head/sourcebytes; predecessor fullCI28green reconfirmed before mutation. Post28 editorial report was actually read/hashmatched to pre29snapshot, scope500full lines/48complete rows/2separate candidates notoriginalsourcebodies. New peer independently read Ronnie original rawcontexts/API/receipts/rights, not only old producer notes. Sourceguards24hashes/17copied originals/fivequote matches and Coltonhold59hashes/3APImatches are research checks, not extra jobtest counts. No measured participant gain/convergence.

## KEEP GOING round30: 3 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Otis’s surname/date identity; Guy’s novel occurrence; Shirley’s author/novel occurrence; Natasha’s War and Peace character occurrence pending peer review; Colton’s pair of places retained after unresolved exact-route hold. Actual `python /tmp/c05-integrate-quality-round.py 30 /tmp/c05-round30-three-root-approved.json 666eb367b29bc1697d7edd19767477b62abe4e9bf04a619195974dd389cce15b` replaced 3 reviewed facts, preserving 497 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep30-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep30-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep30-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep30-sha.log
```

Actual generator/focused exec session 21803 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 15.659693011 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 3 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep30-completion-evidence.json`.

Round30 root checked3 immutable individual independent approvals and combined666eb367b29bc1697d7edd19767477b62abe4e9bf04a619195974dd389cce15b, then actual sequentialwrapper21803returned0:8focusedtests/17SHA/15.659693011seconds,all500metricrecognitionand497entireunchangedrows. Freshpost29assessment read/hashmatched topre30curation beforeintegration; scope500factlines/39completerows/109storedrefs/body0 nothumanbody500. Sourceproof49Otis/105Shirley integritymatches andGreyNuttall/WikiAPIchecks are separate research guards, not jobtestcounts. Otis two-fragment bracketellipsis openlyretained, no falsecontiguousquotematch; historical bookreferences remainunread0. Earlierfull42/34/12jobresult remainsseparatelyidentified; currentfullCI29greenwasactuallyread, newheadrerunpending. No participant/empiricalrecognition/convergenceclaim.

## KEEP GOING round31: 1 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Natasha’s bare War and Peace occurrence; Bryce’s generic erosion description pending two-work formation detail; Cora’s bare Mohicans character occurrence pending exact relationship proof; Colton’s place pair retained after exact-route hold; Kelsey’s regional village occurrence retained absent a proven stronger name bridge. Actual `python /tmp/c05-integrate-quality-round.py 31 /tmp/c05-natasha-pierre-independent-review-20261008T050750Z/natasha-pierre-marriage-approved-curation.json 80e53db5065f27c748cc9ebd464422336a177463c969d9e8f23a3a5e3f4a879b` replaced 1 reviewed facts, preserving 499 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep31-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep31-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep31-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep31-sha.log
```

Actual generator/focused exec session 90199 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 15.603813152 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 1 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep31-completion-evidence.json`.

Round31 actual sequentialwrapper90199returned0:8focusedtests/17checksums/15.603813152seconds;499entireunchangedcurationrows andall500metricsrecognitionpreserved. Immutable independent approval80e53db5065f27c748cc9ebd464422336a177463c969d9e8f23a3a5e3f4a879b promoted onlyfourfactfields, exact50charfictionalmarriage. Freshpost30assessment500fullfactlines/30completerows/82storedrefs/sourcebody0wasactuallyread/hashmatched topre31curation; prior30headfullCIgreenchecked. Threequotes/API/34sourcehashchecks are separate peerresearchguards, notjobtestcounts. Article904wordcountmetadata is not an invented measuredhuman-wordtotal. No participant/recognitionmeasurement/deeper-lineage500/convergenceclaim.

## KEEP GOING round32: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Bryce’s generic erosion description; Cora’s bare novel character occurrence; Cody’s surname-only Buffalo Bill identity; Colton’s pair of places retained after exact-route hold; Kelsey’s implicit surname/village bridge retained pending second-authority support. Actual `python /tmp/c05-integrate-quality-round.py 32 /tmp/c05-round32-two-root-approved.json 8818ee00d8b64ea653117204524d78a74267d3df86f1bf0a60d8fb36ebc4a9e8` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep32-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep32-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep32-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep32-sha.log
```

Actual generator/focused exec session 15652 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 16.073630682 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep32-completion-evidence.json`.

## KEEP GOING round33: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Cody’s surname-only Buffalo Bill identity; Shane’s generic western-film identity; Clyde’s plain Scottish river occurrence; Colton’s place pair retained after exact-route hold; Kelsey’s place occurrence pending conditional source-route judgment. Actual `python /tmp/c05-integrate-quality-round.py 33 /tmp/c05-round33-two-root-approved.json 87495bd2a9f98573758dd043cae107f743506b302edafbdcf67644438a15e94e` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep33-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep33-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep33-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep33-sha.log
```

Actual generator/focused exec session 28277 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 16.488824112 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep33-completion-evidence.json`.

## KEEP GOING round34: 2 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Shane’s generic western-film identity; Clyde’s plain Scottish river occurrence retained after one-work construction hold; Colton’s pair of places retained after exact-route hold; Leonard’s missing second-root semantics with Bernard overlap; Briana’s literary occurrence retained after primary-only plot hold. Actual `python /tmp/c05-integrate-quality-round.py 34 /tmp/c05-round34-two-root-approved.json 33c58180c61bea08571760384971fe698f4aa7163232f1566b553552771538cc` replaced 2 reviewed facts, preserving 498 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep34-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep34-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep34-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep34-sha.log
```

Actual generator/focused exec session 4508 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 14.916393003 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 2 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep34-completion-evidence.json`.

## KEEP GOING round35: 1 substantive improvements

Reread C05 in JOBS and listed five weaknesses: Wilma’s implicit international name-family context; Colton’s place pair retained after exact-route hold; Clyde’s river occurrence retained after confirmed one-work construction hold; Briana’s literary occurrence retained after primary-only plot hold; Mariah’s implicit modern family bridge pending independent support. Actual `python /tmp/c05-integrate-quality-round.py 35 /tmp/c05-wilma-walking-three-golds-independent-review-20261008T055819Z/wilma-walking-three-golds-approved-curation.json 30c86349f67c19d17509cc23c64c4358fccafe2de9cb7cca83803792f744753a` replaced 1 reviewed facts, preserving 499 untouched rows and every recognition record. Then from this job folder actually ran:

```sh
npm run generate:reviewed > /tmp/c05-keep35-generate-reviewed.log 2>&1
npm run generate:complete > /tmp/c05-keep35-generate-complete.log 2>&1
node --test dist/test/reviewed.test.js dist/test/complete.test.js > /tmp/c05-keep35-focused-tests.log 2>&1
sha256sum --check SHA256SUMS.txt > /tmp/c05-keep35-sha.log
```

Actual generator/focused exec session 83172 returned exit 0 with persisted status 0: 8/8 tests, zero failures, cancellations, skips or todos; 13.719573797999999 seconds. All 17 refreshed checksums pass. Tests run strict complete/candidate schemas, exact production golden bytes, two-timezone repeatability and 25 protected negative invocations per CLI; root additionally compared all 500 metric records with the unchanged base pack. Candidate modes remain complete:false; the complete pack is complete:true with 500 reviewed facts and recognition records. This catches changed counts, nondeterministic data, forged golden files and source overwrites. Measured gain: 1 changed player-visible facts; no fabricated participant survey or cosmetic convergence. Generator code, numeric SSA source data and dependencies are unchanged, so the earlier full 42-test/34-mutation/12-restored-file result remains separately identified. Evidence `/tmp/c05-keep35-completion-evidence.json`.

Round36 independent static patch review: root read complete report9925d2fd44bfcb6113dbc715ac676f2bea41aecb04cbe2bbb96e2378506e872c and verified21proof entries in manifest28a126083e2127b3099b4826c55b989a6e08c2a89deea72402641b47abd514a3 (scopef8075fb4827eeb2b1393246f89dc6d98097fe0f6b572bdcfaef7fcf1af3bc2f3). Reviewer actually read10complete files/1764lines, mechanically reconstructed local64262-row pin; external editorial bodies and application/build/test executions0. No blocking refactor gap found. At-return input integrity does not authenticate later caller-mutated pack/serializer input. Candidate/reviewed preflight races, absent fsync and cleanup-error-after-rename behavior are pre-existing limits; final CLI additional rechecks remain. Nodecrypto is deterministic in-memory Node24tooling, no browser-API compatibility claim. Review is static evidence, separate from root completed tests.

## Round36: exported verified-metrics boundary (2026-10-08T06:27:17Z)

Independent pre-fix in-memory diagnostic changed only Abigail/F/1880 count12 to13: direct buildCurrent returned currentMetricsVerified:true and total413263 to413264; reviewed/complete paths rejected. Diagnostic SHA c8fd19fffa2133513eb935782697dc127ba022975684e5acf2461b23f2178bbc; challenger report dd668929206774d31ee363c438969e4478056c8e9e99657f5e754185a9938c23, scope60639b5f9c30f4a93e19730ddb34b268daca52aefadf6a15906854bc68a27730. Agent scope23 full repo files/500fact lines/12complete curation records/36references/five metric views; external fact bodies0/one diagnostic/no builds or broad tests. Root read the diagnostic and bounded findings. No delivered-data corruption, participant benefit or all-source certification is claimed.

Moved the existing canonical fingerprint into exported buildCurrent before selection and the verified flag; duplicate candidate/reviewed guards removed. Curation is separately validated and excluded from the numeric fingerprint. Parser and sparse aggregate APIs remain shape validators. M34 now removes the shared builder guard rather than a redundant CLI guard. New API regression rejects changed counts and balanced edits that preserve the total, preserves inputs, and accepts authentic data with reordered object keys and valid curation. CLI alias/staging logic is unchanged.

First command `npm test`, exec39412 exit1 in40.535809096seconds:41/43 tests passed; two source-decoder failures because system Python lacks pyreadr. Mutations/checksum stage was not reached. The command omitted the documented pinned-Python variable; the failure remains recorded.

Correct command `PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python npm test`, actual exec30191 exit0 in503.553857808seconds:43/43full tests, exact43/15/10mutation baselines,34/34independent semantic mutants caught,12compiled files restored byte/hash-exact and17checksums. M34 targetdist/src/current.js: 10executed tests/2actual failing tests, no cancellations. Both source-regeneration suites and timezone/golden checks ran. `git diff --check` passed. Root separately compared all17manifest files byte-for-byte against prior deliveredHEAD and their SHA values: unchanged, including all500facts/metrics/recognitions and complete/reviewed outputs. This substantive API-integrity repair adds0player fact lines;128prior fact improvements remain across35content rounds. No convergence is claimed from the repair.

## KEEP GOING round37: 2 player-visible changes

After exact round36 head24fea3497231a6546f7611782b120e654122adb3/fullCI37737728785 completed/success (root06:32:01Z), reread C05/RULES and listed: Kaylee’s unstated lee spelling cue; repeated family predicates across variants; Hayden’s generic both-sex usage; Diego’s thin namesake identities; Colton’s two-place occurrence. Fresh independent text review actually read500complete factlines, source bodies0; root read full five-findings/audit and matched live curation/pack hashes. Findings SHA e3bfd6aa32fd9aa1e299ff634ad4e1907f7d527953efb5a1a2512ccd3900dd32; audit02dedc8a57a65d5c0c491f7d086e324f082d5fe96b228a761d8d899350a869ff; original source-free scope remains separate from later source-specific approvals.

Actual integration: `python3 /tmp/c05-integrate-quality-round.py 37 /tmp/c05-round37-two-root-approved.json b63babfd140de848b3c22589ed3b6f9523efcaf5a5dff3decbfe91bea908137c`. Copied only four fact fields, preserved 498 untouched full records and every recognition record. Actual sequential command `bash /tmp/c05-quality-run-focused.sh 37` runs `npm run generate:reviewed`, `npm run generate:complete`, `node --test dist/test/reviewed.test.js dist/test/complete.test.js`, then completed-data guards/hash refresh and `sha256sum --check SHA256SUMS.txt`. Exec12745 actually exited0; 8/8 tests, zero failures/cancellations/skips/todos, 15.951125096seconds, 17 hash matches. Both output types reproduce exact golden bytes across timezones; strict schemas/review gates and25protected negative cases perCLI run. Root guards compare all500 numeric/recognition records and exact changed-ID set. Candidate modes remain incomplete; complete pack500reviewed rows.

Measured 2 changed bonus lines. The explicit Kaylee spelling cue is modest relevance/clarity rather than a new nautical fact or etymology; other selected predicates retain their exact source scope/tradeoffs. No participant preference or recognition measurement. Runtime/source code and dependencies have not changed since the actual round36 full43-test/34-mutation/12-restore run; no redundant full local rerun is claimed. Full CI still reruns on each pushed head.

## Separate current code/data challenge after round37

An independent read-only reviewer actually ran `node /tmp/c05-current-offline-challenge-20261008T071533994121Z/pure-diagnostic.mjs > /tmp/c05-current-offline-challenge-20261008T071533994121Z/pure-diagnostic-output.json` from the repository root. Actual exec completed directly, chunk41f57b, exit0,1.716806906seconds; no session ID. Existing compiled exports reproduced every production byte without invoking a CLI/build, preserved source/curation inputs, rejected balanced +1/-1 source corruption, handled the maximum safe published total, rejected overflow, agreed with exact BigInt selection and ran with Date.now/Math.random blocked. This would expose a shared-guard bypass, arithmetic boundary error, input mutation or hidden clock/random dependency in the exercised APIs. No repair was found in this scope.

Its separate peer actually ran `python3 /tmp/c05-schema-player-contract-20261008T071510Z/diagnose.py` from the repository root: direct chunk001f29, exit0,1.014620285seconds. Independent Python reconciled all64,262 source records,500 production numeric rows and7,500 coverage/count cells, both candidate packs and their editorial-field equality. `node /tmp/c05-schema-player-contract-20261008T071510Z/validate-existing-json.mjs` initially returned session10153/chunk5d3622; actual resumed output chunkeb3be0 returned exit0. All8 existing JSON data files passed7strict schemas. These diagnostics catch delivered arithmetic, ordering, coverage, editorial-copy or structural mismatches without importing TypeScript arithmetic. They are separate diagnoses, not additional npm-test counts, mutation runs or original SSA archive acceptance.

Parent reportSHAfc95f49549b41cfd0547541875c316616a26d2550435dc55b42c5d07ead1c47f, read-scopeSHAa19967e4dd6c3440439a2cbd7399dbce09a3aab78f2b4e37460b316f212821b8, manifestSHA466808cf50549bf4916733a807e7687fca82caeeacfdf94930455c43996eaaee; peer reportSHAe8581b9ec768aeeb2649b1699d43f8e153f3875e223bccdadb198770b371a368. Parent personally read20complete files/2445lines plus a partial schema; source bodies0/currentfactlinehumanreads0. Root read the complete reports/parent scope/output/peer receipt and mechanically matched5parent proof files plus manifest. Data curation57e345630962e7f5522479701352413f1c6ee83a5d678f44dd5303a30bf74e2e and production5f3270cdc0f63d484166c2008f761aa1d53ceb6adcfec3f3927726bdb9e14f9f were unchanged while the doc-onlyHEAD advanced fromaf17ec62 tob1eae073. No original factual sources, source lineage, all500 recognition, participant result or KEEP GOING convergence is certified by these checks. Scripts/proofs in /tmp are not promised to survive new tasks; required portable repository tests remain the authority.

## KEEP GOING round38: 2 player-visible changes

After exact round37 headaf17ec62fa3080b574a606836e7924eab57d05de/fullCI37739874388 completed/success and later documentation-checkpoint headb1eae0731ae8051894dfa04a399f6a93b542c3af/fullCI37742223422 completed/success (root07:19Z), reread C05/RULES and listed: Vickie’s implicit Victoria bridge; repeated family predicates across variants; Hayden’s generic both-sex usage; Courtney’s generic surname transfer; Colton’s bare two-place occurrence. Fresh independent text review actually read500complete factlines, source bodies0; root read full five-findings/audit and matched live curation/pack hashes. Findings SHA efd626ba6c11c76cabea5fa91863a719380916434018ad09dc1b87e76b175f4a; audit09b65da5d6db4639886d99c1f3764ac57161dad31df7e078c6637b2b04819b78; original source-free scope remains separate from later source-specific approvals.

Actual integration: `python3 /tmp/c05-integrate-quality-round.py 38 /tmp/c05-round38-two-root-approved.json 75a2ca12548b435de48707528c2cef7847f0e5ef35ad3414b0eefeb6caa334c1`. Copied only four fact fields, preserved 498 untouched full records and every recognition record. Actual sequential command `bash /tmp/c05-quality-run-focused.sh 38` runs `npm run generate:reviewed`, `npm run generate:complete`, `node --test dist/test/reviewed.test.js dist/test/complete.test.js`, then completed-data guards/hash refresh and `sha256sum --check SHA256SUMS.txt`. Exec69248 actually exited0; 8/8 tests, zero failures/cancellations/skips/todos, 15.947478277seconds, 17 hash matches. Both output types reproduce exact golden bytes across timezones; strict schemas/review gates and25protected negative cases perCLI run. Root guards compare all500 numeric/recognition records and exact changed-ID set. Candidate modes remain incomplete; complete pack500reviewed rows.

Measured 2 changed bonus lines. The explicit Vickie short-form bridge is modest relevance/clarity rather than a new Latin meaning; other selected predicates retain their exact source scope/tradeoffs. No participant preference or recognition measurement. Runtime/source code and dependencies have not changed since the actual round36 full43-test/34-mutation/12-restore run; no redundant full local rerun is claimed. Full CI still reruns on each pushed head.

## KEEP GOING round39: Gail's explicit Abigail link

Root reread C05 at07:50:31Z after exact round38 head8a1f7582bcd51e2e14b419653c290576aad140eb/fullCI37745159742 completed/success, actually read07:49:45Z. Five actual findings: Mariah’s implicit Miriam connection; Madelyn’s implicit Magdalene connection; Gail’s implicit Abigail connection; Rhonda’s sparse Rhondda bearer/title link; Jaden’s conditional Jadon association. Fresh independent assessment personally read all500 complete fact lines in five untruncated batches,14 complete curation records and7 numeric pack rows; original external bodies/runtime tests:0. Root read its complete assessment/scope and verified all10 manifest input/proof bindings before integration. Assessment eb1696878819909fefa7533779806ab67c999d3b3e56d4fcfd09ab6b8dc210c3; scope44398aa68d7ddb812b2f66e8145ba5d5e8e8c1e6bab69feee1e1f9a8afd2001b; manifest10ef0901befb2c75030703caaf781e7ac34551093fd08578508577b459776f57. This source-free assessment supplies no original-body acceptance or convergence.

Gail's separate actual-source peer read the complete original Moss Gail HTML and identity/credits, complete stored BTN Gail/Abigail human fields, complete Smith Abigail entry with both senses/boundaries/title/rights and seven full shared modern credit/rights/catalog contexts, scraper/README/robots and llms first45lines. It read one complete current Gail record and Abigail's full fact line; no fresh all500 semantic/source-body transfer. Root read the full approved row, original decision/report/scope and normalization decision, and verified41 producer plus17 peer plus2 addendum descriptors. Canonical approved overlay902fdcc79569b3209248fcf8a0a53c2b02aa4045be60185ef5b6e75bdb9a0a8e; peer decisiona91bdb697819c7b5e460ef6fa334d7b24df9a97955308f7ddd319a5bc9b1064d/reportb070d8ec25e7f633c8fd5d638d5593371d3866d923e34e33581e02ac8748473b/scopec34aabf1bc910d550b8754f4a98a8de89b28bed33b9101a83361c338479eea94. Canonical Moss work-ID/JSONLD-supported author normalization adds no work or source acceptance.

Actual integration: `python3 /tmp/c05-integrate-quality-round.py 39 /tmp/c05-round39-root-approved.json 22fc28fe5dc691f5848a385a1fe107c345e36adbc6f8a6dece6c4365d8adb259`. Copied only four fact fields;499 complete records unchanged and all500 metrics/recognitions preserved. Actual sequential `bash /tmp/c05-quality-run-focused.sh 39` generated reviewed and complete packs, then ran8 focused tests, completed-data guards and17 checksum checks. Exec63728 actually exited0;8/8 passed, zero failures/cancellations/skips/todos, 15.663732281seconds. Both output types repeat exact golden bytes across timezones; strict schemas/review gates and25 protected negative cases perCLI pass. Source fixture, source-selection pins and expected changed-ID set remain guarded.

One84-character bonus line changed: the new short-form connection preserves the concrete biblical story and distinguishes the modern name from its bearer. Modest editorial clarity, not a correction of falsehood or empirical recognition/enjoyment. Runtime/source code and dependencies remain unchanged since the actual round36 full43-test/34-mutation/12-restore run; no redundant full local rerun is claimed. Each pushed head receives fullCI. Cumulative133 editorial changes across38 content rounds; no genuine zero-gain round or convergence established.

## KEEP GOING round40: 1 source-reviewed relevance changes

Exact prior head458281fadc6f81092c4d91692ef42b90ed9e843f/fullCI37747769713 completed/success, root actual read2026-10-08T08:14:44Z, then reread C05. Actual five weaknesses: Mariah’s implicit Miriam connection; Madelyn’s implicit Magdalene connection; Rhonda’s sparse Rhondda title/bearer; Jaden’s conditional Jadon association; Terri’s non-exclusive Theresa association. Fresh post39 assessment f6a5d866cbd6028995580934f43ebdfac8d693d20a1e247ddd76e7879db8e197/scopef767f152f652ebe18dea4bef849fa54cca1cd55cad6fb9ae9ff1df900e1a124c/manifest505321206a79d938fc3daf6754f81f561c61595cf6752e7864454ec8d2cb9909 actually read500complete facts,8complete curation records and full Gail production row; original source bodies0. Root read full assessment/scope and matched all13 manifest bindings and live71b4c/6e186 hashes. Its source-free scope remains separate from selected later actual-source approvals.

Madelyn semantic75-character approval a2a9a0fc86102f41e807250a37f66bbafba7310d8d2d3f16f5aa995e2d81031c/decision43786fbd08cc94f24e3228ef911cfa8c79d6407197c2a5d600595fbaf684a511/reportf74e8ae98eb08fba7c5793965646d9f9abb861992835f63e4b47466b673c48b2/scope61ba7476c33f710adbb4f7c125d62482e5a4e2c910ac449cfc000fd08ef4a4da. Root read all four completely and verified62 producer+19 peer descriptors. Actual peer complete original Moss Madelyn/identity/credits, complete stored BTN three human fields and full original Yonge2658-word section/tables/footnotes/boundaries; earlier own seven full auxiliary HTML/profile/catalog/rights reads explicitly byte-bound, new auxiliary rereads0. It read one complete Madelyn record/all5refs/reviews plus two full fact lines; no new all500 sourcebody/semantic scope. Two credited works support each actual clause, deeper Hanks lineage unknown. Exact-variant HOLD stays unchanged, independent peer962b6d5099650c3fd27c627dd111b8b1e987866b57662ad36026a760ae4752f9/reportd615225f4efd03fde8c88f0ade225a9a3cd91f21749cfc52693894fb09345ea9 fully root read,12 manifest descriptors verified. No meaning match treated as variant identity. Removed unnecessary historical table and narrowed literal cautious prose. Explicit Magdalene headword leaves the line; place/tower lesson remains, with nonexclusive tower/castle scope. Modest editorial clarity, no falsehood correction or empirical gain.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 40 /tmp/c05-round40-root-approved.json 6d40ffb9f458618ab4d8f13a6a6359226c183ac9c04420d9c04d3c1622ce488f` copied only four fact fields. Sequential `bash /tmp/c05-quality-run-focused.sh 40` generated both output modes, ran8focused tests, completed-data guards and17checksums. Exec15769 actually exited0;8/8 passed, zero failures/cancellations/skips/todos, 15.523009380seconds. All500 metrics/recognitions and499 other complete curation rows preserved; exact expected changed-ID set, source and selection pins guarded. Two-timezone byte-exact golden checks, strict schemas/review gates and25 protected negative cases perCLI pass. Runtime/source code and dependencies unchanged since the actual round36 full43-test/34-mutant/12-restore run; no redundant full local run claimed. New exact-head CI remains required.

## KEEP GOING round41: 3 approved card-relevance changes

Exact prior headabd0f51fd5f2700bc0e2668533ca7ab2dd4e70d0/fullCI37749940867 completed/success, root actually read2026-10-08T08:34:01Z, then reread C05. Five actual weaknesses: Mariah’s implicit Miriam connection; Rhonda’s sparse Rhondda title/bearer; Jaden’s optional conditional Jadon association; Terri’s non-exclusive Theresa connection; Kristen’s optional family/history context.

Fresh exact-post40 assessment57ffc85ea49242951373a1ecb2058e1ad650f68ee43515dee0d9c36075c5b5e4/scope7c92cfe0367c52c2e3d5dd28f0d85e2cc39c417bb1e4ebd400af55ac871d6824/manifest04f474930bd600a47888c5c074d9319dcea9cd47b09f828de04125f432bbb390 personally read500 complete facts and8 complete curation records from frozen exact40 snapshots; new external-body reads0, prior8-document Rhonda source peer explicitly retained separately. Root read full assessment/scope and verified10 snapshot/input/proof/historical-peer descriptors plus live b6a054/51d392 hashes before integration. No all500 original-body, rights, numeric or recognition survey is inferred.

Root read the complete approved overlays, decisions, reports where provided, and actual read scopes before integration. Mariah approved91dd60bdce135ac97387e7327ecc0ae3d1da087ac8072a28f9c4f16621d77024/decisioncea2de127ade0e7a287007e189404ce54beba68099d4c1fff5b6b9aca0010370/report93f210db50b2be1d56cd7ef3ae3ab744eb40317dd955ab4efdd5d8a2b7583be8/scope3681ba29a92213840acd4dd759129f890c765080eaa283198f0ed245ecd7033b: actual full13 human BRT narrative paragraphs/credits/history/footer, complete selected Wiki lead/NorthAmerica/immediatecites/API/revision/footer/fullCClegal; primary chart/Billboard/media/artistWiki bodies0. Root verified42 producer+27 own/16 original peer bindings. Rhonda approvedcabb68d278d5e7eb59c8c2b522a1c699ed398734b1e1f3263e3e682d0327fa69/decision74fd4f670190640271d4b15eee6cd3c168db6adeafa2eb5d53cf473e02f5ea18/scope2886ff67f47af34478e4a95bb3afbf2af7ffe569030a4bedcc088b07fa3a79b0: actual8 defined documents including5originalBTNpages, selected full dictionary record, full Wiki biography/raw-render/all30refs as one work and full licence reproduction. Root verified45 producer+52 peer descriptors; underlying Edgar/Beddoe/John/autobiography0. Complete decision serves as report, no separate report invented. Terri approved3ef3c06ab8e32329ae2c418244ebf6eb482d7f839414741a214f31470faca993/decision54be2d9e2817624ce25f45f5b5309d33988ac9460311a35e209d6848e77d3b38/reportffaedf04c8accbffa00677e68f71d33f730f40d71191a85347ca4ee5f86ae8ff/scope9b934c9ed70c83501c2ef90959accf953fdf1576ab0ced3e58ca58cf43d63a1c: actual3complete modern originals/Yonge450-word section/table/Footnote49/front/fullfooter and6original auxiliary author/catalog/rights bodies; linkedlexicon/books0. Root verified69 producer+43 own/27 selected external peer descriptors. All immutable earlier body0 scopes/holds remain unchanged; provenance hashes are not semantic acceptance or extra job tests.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 41 /tmp/c05-round41-three-root-approved.json ebddf1a71b571cf8e47f2acb8b6a0eec3ad3ac26b5baf57d7a4e7ccbb4d109a9` copied only four fact fields and preserved497 other whole records. Sequential `bash /tmp/c05-quality-run-focused.sh 41` runs reviewed/complete generators,8focused tests, completed-data guards and17checksum checks. Exec81262 actually exited0;8/8 pass, zero failures/cancellations/skips/todos, 21.783295759seconds. Both outputs reproduce byte-exact goldens across timezones; strict schemas/review gates and25 protected negative cases perCLI pass. All500 metrics/recognitions and the exact changed-ID set, source/selection pins and untouched full records were guarded. Code/dependencies unchanged since actual full43-test/34-mutant/12-restore round36; no redundant full local run claimed. New pushed-head fullCI is required.

Three bonus lines changed. Mariah84 replaces a valid Miriam sibling lesson with direct same-name bearer/song/1994→2019 learning; the25-year interval and direct card connection justify the loss as an editorial judgment. Rhonda78 adds35characters for personal-name/title/spelling clarity and keeps the feminist lesson; existing quotes were already valid, no Unicode-escape repair. Terri78 adds the optional short-form link and retains the full valid qualified harvesting lesson, with Terry/summer/island alternatives preserved by can/proposed. No participant study, audience recognition/preference or packwide uniqueness claim. Cumulative137 editorial line changes across40 content rounds plus code36; no established consecutive no-player-gain round.

## KEEP GOING round42: 1 approved card-relevance changes

Exact prior head1a8a06a9216ba8c73a277e582933edc6cb66a0d4/fullCI37751675079 completed/success, root actually read2026-10-08T08:49:04Z, then reread C05. Five actual weaknesses: Jaden’s implicit conditional Jadon connection; Kristen’s implicit Christian-family context; Cecil’s unexplained Roman Caecilius root; Valeria’s thin Valerius family relationship; Pauline’s broad feminine-family fact.

Fresh post41 assessment d47d148c7c1a04f548edfa9bdc8f4868a594f1acad9a741bc14bfc06462fb9ca / scope 85fd2a31e878a5cc8caa0e02bad33080f1d3751f32ca358b24ef2635e4607ef2 / manifest cc12ccf28d69b36bb784218e1a006e1dca7a64932ac493723f19a6d81fd873cd personally read all 500 complete facts and 11 complete current curation records. Fresh source bodies for that text pass were 0; the earlier eight-document Rhonda source peer is explicitly separate. Root fully read the assessment and scope, verified all four manifest files and both live curation/production input hashes, and reread C05 after exact41 green. The last three ranked targets are optional depth, not demonstrated falsehoods or mandatory repairs.

Kristen approved overlay 818d37999dda3cd03eef6db5f5cfdee7a5744197205dfcfae74217edc846ad4c / decision 7dc3a0e1777e303ddc70c58173cbee8788c725196de6f7d46a3a035cd628ac79 / report be5ffa16321cbce51ef4778ccda30245f5b57cfa2e4d9f129b3258f5a9a4df8a / scope 3bcc9007025b56aa7a19f237ef2ff015d10e83cf3849e61677ec3e6a555b8132 / manifest 74e260f7bc633b02ef8d5a6c57ac5970079eb334eef248dfe93efa2316f88633. Root fully read the approved five-field overlay, complete decision, report and read scope and verified all 76 own/selected external descriptors plus all 84 producer descriptors. Actual distinct peer read four complete original entries, four full Nameberry author/catalogue/editorial/terms pages, complete 903-word Yonge Christos section/tables/Footnote41 and stored four-headword/five-record human fields. Six previously personally read BTN/Moss auxiliary pages and Yonge front/full footer were explicitly byte-bound; new rereads of those auxiliaries 0. Current complete curation and six bounded related facts were read; no new all500 semantic, production-row, cited-book, whole-book or audience read claimed. Eight recorded requests were 200/CONNECT200/TLS0; peer made no new requests. Provenance guards do not replace actual context/materiality review. Nameberry own books/team and selected semantic presentation are positive work evidence; catalogue overlap and deeper unknown dependence remain disclosed, with no primary-independence certificate. Jaden, Cecil and Valeria have no approval in this delivery.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 42 /tmp/c05-round42-kristen-root-approved.json 818d37999dda3cd03eef6db5f5cfdee7a5744197205dfcfae74217edc846ad4c` copied only four fact fields and preserved499 other whole records. Sequential `bash /tmp/c05-quality-run-focused.sh 42` runs reviewed/complete generators,8focused tests, completed-data guards and17checksum checks. Exec42593 actually exited0;8/8 pass, zero failures/cancellations/skips/todos, 15.352597168seconds. Both outputs reproduce byte-exact goldens across timezones; strict schemas/review gates and25 protected negative cases perCLI pass. All500 metrics/recognitions and the exact changed-ID set, source/selection pins and untouched full records were guarded. Code/dependencies unchanged since actual full43-test/34-mutant/12-restore round36; no redundant full local run claimed. New pushed-head fullCI is required.

One 79-character line replaces the valid 53-character Christian both-sex fact. It retains the complete historical lesson, adds a conditional Kristen meaning cue and avoids the repeated Christian subject of the 83-character producer draft. The 26 added characters increase reading density; Christina already teaches the Christian meaning, so this is card coherence, not pack-unique learning or measured audience benefit. Cumulative 138 editorial changes across 41 content rounds plus code36; no established consecutive no-player-gain round. The higher-ranked Jaden modern-route proposal remains held and its different film replacement is still under actual-source review; Kristen is the worst currently approved material card issue at this milestone.

## Round42 delivery and source-review checkpoint

Exact e855e7800f0a95403c4a2d5687754c1b616343ba passed full CI37755216270; actual GitHub REST read09:18:52Z. Root reread C05 afterward. Jaden/Cecil/Valeria source approvals are not yet integrated. Their complete target records/rows were guarded unchanged on current42 at09:26:17Z, root guardSHA2748dec742c307b4a975bbc4aa14d2d1bc6fadd20e39c69aa1147129e9cfd006; this is not whole500equality transfer or a new data test. Source proof commands included sha256sum --check --quiet manifest.sha256 in the frozen Cecil producer folder (70matches), explicit seven-file relative-key peer-manifest verification and five critical source hashes; the first generic descriptor walker refused that relative-key schema before the explicit check passed. Valeria94 and Jaden43 peer descriptors plus producer50/56 were checked. Full exact source/materiality decisions and original scope limits are in NEXT/temporary freezes. This docs-only checkpoint changes no data/code/dependencies and creates no LOOP round or zero-gain count. Its new pushed-head CI remains separate.

## KEEP GOING round43: 4 approved card-relevance changes

Exact prior head 6d328b0760662dd1ed2876c32088252043d141af/full CI 37757980226 completed/success, root actually read 2026-10-08T09:44:29Z, then reread C05. Five actual weaknesses: Marsha’s unexplained change of subject to Marcia; Jaden’s implicit conditional Jadon connection; Pauline’s thin feminine-family endpoint; Valeria’s unexplained Valerius endpoint; Stephanie’s thin Stephen-family endpoint.

Fresh current42 all500 assessment a5f482935965fc22b9867b46451982a18969dcd8a6a7748b65497731cbd57bb1 / scope 127fc5868d7381022690da57f49a13290c58982ad1e73790f26b01d75fd4a704 / locked ranking v2 5b4ab431ce82ae66f39e225ca46f7ab2ec7d512c539cc1f162af603bfc9b64ec / manifest 7253da2fd108a1caf6ba0fe5b632af76e2ce36405a0e33263c3057426617fe05. The reviewer personally read all500 complete facts and13 complete selected curation records; fresh original-source body reads for that editorial pass were0. Ranking was locked before the combined future overlay was read, with prior Cecil/Rhonda producer knowledge disclosed; this is not a naive new model or participant test. Root fully read report/scope/locked ranking, verified all25 manifest entries and both live data hashes. Its supplied head was round42 e855e780; the later docs-only checkpoint6d328b has the same 4ca20a04 curation and97b8d9d3 production hashes. After actual latest-head full CI success at09:44:29Z, root reread README/RULES/JOBS and C05 README and used the actual five weaknesses. Cecil is an approved optional addition outside that five; source availability did not force its ranking. The malformed initial Valerius explanation was corrected in a separately frozen v2 without changing facts or ranks.

Jaden exact76 overlay f092dc840e94dcc19dc0363d613a2d87757f02beacbb8f30227f4590a2c42371 / decision7ee5409ede64e91b387efe7646926529cd330163cb922a0d321ee54e7a7e10a3 / report e766979846599512c7b101deed4887fbea306ab37283d8b7451e7fd699358482 / scope20e93f7b1a2cb5b2f5a915ab6a7005a85bd930c57c99b28e4dcad305cd1573f1 / manifest c2ee08173fafd1c7530809c81cf76c6adacdb475a79f26c9b6900042d986691a. Root fully read the approved overlay, decision, report and scope and verified56 producer descriptors and43 own/external peer descriptors. Actual peer read the full14-paragraph Gardner narrative, credits/history/footer, complete selected film lead/plot/cast/production/release/refs/external sections and bounded raw revision1378580098 lines; reception body was not read. Root also fully read all14 narrative texts and bounded selected film contexts. No film, memoir, cited book or unselected Jaden biography was read. The deeper shared cast-report lineage remains untraced; no primary-independence claim follows from absent import markers.

Cecil exact84 overlay503c5015cec41a72b7a9f7ce481f7968b2ccf0575119cabf21c4b273004f1e60 / decision99059eaf4977fdc5e372a60bb630a0df77e52101420ea997fd2064d5aabb1e88 / report07705c3bb61f826538839a1c7f7a727dedd953ac1b3ca78c382ff524df2f2c85 / scope09253631f8dae17351142fa7a3cba5a4e6b13c01646a047cfc78eb4d3be446cc / manifest285ad3aeb36f42aa4d8747505416cba6ed4dd642bbe19dc32b8f29b2c171ead9. Root fully read all four decision/approval texts, verified all70 producer hashes,7 own relative-key manifest files and5 critical external bindings. The first generic manifest walker rejected its relative-key schema; a corrected explicit verifier passed, with no zero-entry certificate. Actual peer read17 defined complete document/selected-record units and four complete windows of the partially read Yonge book, including the89-line Caecilius section, prefaces/front and PG licence. DMNES and Yonge supply the possible-blind account; BTN’s documented DMNES catalogue use makes BTN corroboration, not a second semantic authority. Original medieval attestations and listed lexical/classical authorities remain unread; Welsh/Seisyllt alternatives remain held.

Valeria exact60 overlay2914d534317d1e0496c0ee724fbc0a5dcc01256dabf10b5cb09dfbccb6a9da73 / decisione696d2cc4d3a76e0b7f8bc7bd38ec64a4c0c8a1cee5cf6a92cfbb38689cdceb2 / full JSON report79182005356b5234b56e67b58692a21370b322ce838792eccb265dc7db7f18e9 / scopecf8d763658da6e801cef0d5e72c17ba466ec479a4259c2b627cbe1fa5fe9052d / manifest5eb372a7d0ab14ca7ac4ede4c0f4765e6f93c9905a3c44e52b9ff5483c102218. Root fully read overlay/decision/report/scope and verified50 producer plus94 peer own/external descriptors. Actual peer read two complete original BTN entries with relation/citation/credit fields, four full BTN auxiliary pages, complete679-word Valerius and352-word Nomina/Attius sections with footnote/boundaries and full Yonge front/prefaces/PG footer. Yonge’s inherited gentile-name explanation supplies the Roman family-class context, not a fabricated literal phrase. Underlying Lewis/Short and Yonge’s named authorities remain unread; deeper lineage is unknown. Root’s09:26:17Z selected-record guard2748dec742c307b4a975bbc4aa14d2d1bc6fadd20e39c69aa1147129e9cfd006 confirms all three complete records/rows unchanged across42; no whole500 map transfer.

Marsha exact84 approval0c532a5e8b72b56597a847e22077150913cc4658b4ab0d76f0a6ac6b09ccc3b6 / decision4aafb5ba997c730cb557105a3f3ca653851d31d8095a2f1890c13cae04c72812 / reporteee4f53127c35b9a06238f013e75f830cfe67dce010f9de3bba39b2e6d44505d / scope54ea932ebbbd500024b575323af4082df6051e27edeb2752bbb539b560e2828c / manifest2ead06a3cd9e6b17c3267ab898e5121d045b507515afecd974528f84b8253142. Root fully read the approved object, complete decision/report/scope, all four complete modern original visible pages and complete Marcus section/tables/Footnote54; all73 producer and82 peer own/external bindings passed. Actual distinct peer read4 complete modern originals, complete1042-word Marcus and fresh352-word Nomina/Attius sections, boundaries,4 stored human records and3 bounded related fact lines. Eight previously personally read full auxiliary pages and Yonge front/fullfooter were reused by exact bytes; fresh complete auxiliary/front/footer rereads0. Its09:50:36Z complete Marsha-only record/row guard matches current42 inputs; no all500 source/map/metric/CI or participant review is claimed. The producer string-shaped review and producer reviewed status were not approval; peer emits a new five-field reviewer/note object, note993. Nameberry has printed Grace Royal/Sophie Kihm credits and a native additional Marcella route, with known consulted BTN/Yonge/Hanks selected/deeper dependence unresolved. The count is two separately credited editorial presentations per clause, not a certificate of primary independence.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 43 /tmp/c05-round43-four-root-approved.json 502fa8caddd19f1241a1a5aed99657f88fa9a9cea620ac9cd8f372c7c47509ef` copied only four fact fields and preserved 496 other whole records. Sequential `bash /tmp/c05-quality-run-focused.sh 43` runs reviewed/complete generators, 8focused tests, completed-data guards and 17 checksum checks. Exec 73851 actually exited 0; 8/8 pass, zero failures/cancellations/skips/todos, 17.122814205 seconds. Both outputs reproduce byte-exact goldens across timezones; strict schemas/review gates and 25 protected negative cases per CLI pass. All500 metrics/recognitions and the exact changed-ID set, source/selection pins and untouched full records were guarded. Code/dependencies unchanged since actual full 43-test/34-mutant/12-restore round36; no redundant full local run claimed. New pushed-head fullCI is required.

Jaden replaces a valid51-character biblical Jadon judging lesson with76 characters of concrete real-father/screen-son context (+25); the entire old lesson is lost and the modern etymology holds are not resolved. Valeria39→60 (+21) retains the complete feminine relationship and explains Valerius as a Roman family name, with overlap across five other Roman-family cards limiting novelty. Cecil49→84 (+35) retains the Roman connection and adds a qualified blind proposal; Cecilia already teaches related semantics and six characters of headroom remain. These are modest independently assessed editorial benefits, not audience measurements or corrections of false baseline facts.

Marsha65→84 (+19) resolves the worst ranked relevance gap through an explicit conditional modern connection. The entire Roman/Marcius/Marcus lesson remains. Four related proper names and repeated Roman-family content impose density/novelty costs; no additional root lesson or false-baseline correction is claimed. Four accepted changes bring the cumulative count to142 across42 content rounds plus code36, with no established consecutive no-player-gain round.

Research checkpoint after43: exact1fce6/fullCI37760293265 completed/success actually read10:04:05Z; root reread C05/JOBS10:04:26Z. Full fresh assessment/scope/locked ranking read; exit-gated28 manifest/live input hashes pass. Full Bella approval/decision/report/scope read, exit-gated11peer+89producer pins pass. Full Pauline approval/decision/report/scope and producer texts read;67producer SHA checks and90peer descriptors pass. No generators, new fact edits, redundant npm tests, LOOP round or player-gain increment in this docs checkpoint. Its own exact pushed-head full CI must be read separately. Current numeric/recognition/data hashes remain unchanged.

## KEEP GOING round44: 3 approved card-relevance changes

Exact prior head 0a81d0c413417aeafcf25d178b7d94f150d8b1d1/full CI 37763171003 completed/success, root actually read 2026-10-08T10:31:16Z, then reread C05. Five actual weaknesses: Connor’s unexplained Conchobar mac Nessa connection; Bella’s missing Isabella connection; Pauline’s thin Paul-family endpoint; Stephanie’s thin Stephen-family endpoint; Julia’s thin Julius endpoint and reading density.

Fresh current43 assessment c64d3b7a6cb0ec5a059fbadac9d6f310aed39bea959e1e00dfe4da935638cbc4 / scope09fed8d3d94344ce9950baef55e9c582a3cf1259c2812ee036cf2e5b1bd4cab4 / locked ranking a5f66cd7ceb4f02e3b2045690bcd6d752f0bcd2cd00ae0a66db7dbac9a10df25 / manifestedb47d67b3a5211353ca9522e026b27ec4ecb8772a563a3097e045094d776d5e. Actual reviewer personally read all500 complete current facts,15 complete curation/player pairs and225 sparkline cells plus four instruction documents; fresh original bodies0. Ranking was locked10:05:45Z before any future44 candidate/overlay file was read; prior producer/inquiry knowledge disclosed, not a naive model or availability ranking. Root fully read the report, scope and ranking and verified all28 manifest entries and both exact current43 data hashes. Root had actually read fullCI37760293265 completed/success10:04:05Z and reread C05 README/JOBS10:04:26Z. Truncated initial Colton/group5 views were recovered by complete untruncated rereads, not counted as full before recovery. Close alternatives Nicole/Aiden/Helen/Christine/Leslie/Kaylee/Colton/Ricky/Jon/Arlene and strong two-lesson cards are compared, without original-source recertification or empirical gains. Connor, the actual worst, triggered a new producer and distinct original-source inquiry rather than being displaced by ready lower-ranked material. The following docs-only checkpoint kept these identical data hashes: 0a81d0c413417aeafcf25d178b7d94f150d8b1d1/full CI37763171003 completed/success, root actually read10:31:16Z and reread README/RULES/JOBS/C05 README10:38–10:39Z. It created no additional content/zero-gain round.

Pauline exact77 approval07402c5407235d3394a8afa954bbe24318eb138eaac394500333f9a9dd518016 / decision2027af1ba7d6cbe48ce1a2bd4ec79172736c8e59897f5711e2902e76e1274a46 / report3ae77f9f431118115d9719dcca0ee682ab16afe1f71bb1b69d50cea7e844cf79 / scope12945d2b2c67fe35bb94d4ba3dff090e6cb0762eee186ff0d41b1c3872034802 / manifest36e49372e8f3174d75aec3b7d8295143c9b021b3c74e89be1f7d065b27db8419. Root fully read exact approved five-field object, complete decision/report/scope plus complete producer draft/report/scope, verified all67 producer descriptors and17 own/73 external peer descriptors (90). Actual peer personally read four full modern main entries, seven full original auxiliary pages, full1065-word Yonge Paullus/Magnus section and1520-word prefaces/header/front/fullPGfooter/boundaries plus selected glossary rows, both complete selected Lewis–Short XML entries and fullTEIheader, and full pinned PerseusREADME/CClicence. Whole lexicon/book human reads0; official77MB source size/GitBlob identity checked, not human-read. Four early unfrozen original reads were re-bound to exact final raw bytes; no unfrozen draft approval. Family pair BTN+Yonge; gloss pair DMNES+Lewis–Short. Selected BTN→Lewis–Short is grouped and broader DMNES overlap/deeper unknown disclosed, without an absence-marker or primary-independence certificate. Current43 complete Pauline row/record stayed unchanged at dated approval. Six bounded related cards read, no all500 semantic/metric/recognition/CI or empirical claim. Bella53 exact approved objectfa67d337e0d7082866fd3c03bfa3063795bbeb513446935bca2424380dc2f3cc / decision3ad891eddba8167c9151bc561b7c4d22070415be93eb21a543a46a67efdfc01f / reporta697206298a8875d2ef5ce75da8900efce9dcdbe931fbb626dbaf07f2632696a / scopeb70f8ae16156b20c781a8587daf7ec6124ebcd5f6c8d16a47db203fd0e14f14e / manifest6ddf3794cd2f27a48250d68a568c80eecd53b51f38cd3995a86b2ab3224273d7. Root actually fully read the exact object and complete decision/report/scope, then recomputed all11 own and89 producer retained descriptors with hash+byte checks; no unverified producer status transfer. Actual peer personally read16 complete original/auxiliary bodies, four selected non-SSA human projections, four complete Yonge windows including1855-word family section/Foot15 and complete PG rights footer; llms header only14lines, whole source/corpus/index reads0. The precise short-form clause and Isabella→Elizabeth clause both have actual BTN+Moss support; Nameberry's known BTN/Yonge/Hanks catalogue is corroboration only. Moss institutional/database authorship is distinct from a printed individual entry byline. Deeper shared lineage remains unknown. Bella-only complete row/record guards matched current43 at dated10:20:54Z; no pack-wide or CI certification. Connor peer's exact qualified88 object6c75ef3fce6db7ed888013e1d78a9d152e5ed2c114b5dbe8ec444b27b5bdc6c7 / decision2cb9a77d5cbe3dffab5bd41d70bb09cdf26a8e5522437e1ab024fa595c9431bf / reporteb3c837374d805a02362cf154ed4cd455a16abc991ed8f8456f57febbae1bcf4 / scopea18acd11300845ab2dc4e43e2f0f0c56f9568cd9a8a2fc32dde16b9fca222308 / manifesta53e7a55ad2280e9dbd94d94fe07a56155ccedb0c8625a230a4835ffe041e396. Root actually fully read exact approved object and complete decision/report/personal scope, recomputed all94 manifest entries and five critical hashes with exit0, after prior full producer candidate/audit/scope/materiality reads and150 producer hash/byte checks. Actual peer21 personally full human units across20 document/version selections/four credited works; 150 verified descriptors are not150 original reads. Root additionally read full selected Woulfe entry/online notation and BTN Conchobhar plus exact Wiki lead/spelling-note; two initially guessed Woulfe paths failed and were corrected to actual discovered paths before full reads. Whole Woulfe book/underlying originals/Moss loaded external policy0. BTN+Wiki are separately credited direct treatments of both precise form and retained legendary-bearer clauses, with actual Moss/Woulfe corroboration of Conchobhar and explicitly read BTN/Wiki Conchobar bridge. Known BTN catalogue Wiki/Woulfe/MacKillop and shared/deeper untraced literary scholarship remain disclosed; not certified primary independence. Complete actual current target guard at docs0a81 equals original43 pair. Producer85 provisional reviewed status was not accepted; only distinct peer88/note949 is approved. All eight literal/whitespace-normalized excerpts total72 words, with original URLs/source credits/rights.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 44 /tmp/c05-round44-three-root-approved.json 642ab1d3b8f1961ff5cb0d4fd0fef331e6e46a4703f8fb30fc806f368973f8b9` copied only four fact fields and preserved 497 other whole records. Sequential `bash /tmp/c05-quality-run-focused.sh 44` runs reviewed/complete generators, 8focused tests, completed-data guards and 17 checksum checks. Exec 31119 actually exited 0; 8/8 pass, zero failures/cancellations/skips/todos, 15.836122100 seconds. Both outputs reproduce byte-exact goldens across timezones; strict schemas/review gates and 25 protected negative cases per CLI pass. All500 metrics/recognitions and the exact changed-ID set, source/selection pins and untouched full records were guarded. Code/dependencies unchanged since actual full 43-test/34-mutant/12-restore round36; no redundant full local run claimed. New pushed-head fullCI is required.

Pauline47→77 (+30) retains the entire feminine Paul-family lesson and adds the literal Latin small gloss. This is a modest concrete semantic gain with a substantial density cost, no old falsehood repair or bearer swap. Bounded Pablo/Lydia contexts do not duplicate that selected meaning; repeated family themes still limit pack variety, and no all500 novelty or participant measurement is claimed. Bella54→53 (-1) retains the entire surprising Isabella/Elizabeth relationship and adds the direct Bella→Isabella cue. Three names add reading cost, nickname familiarity may limit the gain, and no empirical/global uniqueness assertion is made. 'Can' preserves alternate -bella/Italian routes. Connor50→88 (+38) adds an explicit conditional given-name connection while retaining every part of the full mac Nessa/legendary/Ulster-king lesson. No lesson is lost; repeated Conchobar distinguishes the bare given name from its full bearer. This is a modest individual-card relevance gain with substantial density, only two characters of room and no new story/theme or measured player benefit. Can avoids universal origin, ancestry, whole-patronymic identity and naming-cause assertions. All three delivered changes retain their entire previous lessons; no source hold supplies convergence.

## Post44 exact-source and editorial research checkpoint (2026-10-08T11:16:07Z)

Fresh current44 primary reportfd9e93c46c5659b650d7b176e95332899aefa177005daf9482a57f208cadcac0 / scopeb9fccf3ec830d89c5ef82c3199dac9c1b593dd6b6c00974b0cfc33d7bdfcfa5f / locked ranking868d069047a8e1bb377bf1df2f68231278371719b5884ffbf99e24f55b1ea47b / manifestb97116fbb4ee64ab26a2a6764668830710e7ddfcd28769c0f768e16dccfb07d0. Actual primary reader personally read all500 complete current facts,19 complete curation/player pairs and285 cells, full metric/recognition contexts and four instruction documents, fresh original bodies0. Ranking locked11:02:19.792884Z before any future45 candidate/approval/source packet read; older ranks/ownConnor21 source-unit knowledge and Julia inquiry knowledge disclosed, no naive-model or availability ranking. Root actually fully read complete report/scope/ranking and recomputed all40 manifest entries/four critical hashes with exit0. Baseline actual14f266/4301ea8/5d8d6ec, dated final opaque guard11:06:13.303469Z; producer handoff's approximate11:07:51 was corrected without changing any frozen file. Five form a near-tied editorial cluster, no measured precise ordering. Actual worst Adriana37 has only the relation almost visible as Adrian+a, unlike named-language, wordplay, place and bearer alternatives compared in complete contexts. Current44 Connor/Bella/Pauline exact changes retained every old lesson, with specified repetition/density costs; nine metric/recognition fields per changed row unchanged, not a new SSA extraction. FullCI37766072529 completed/success actually read10:56:09Z and root C05/JOBS reread10:56:45Z preceded this fresh ranking. Current-source dictionary status/quotes/review notes are not original-body recertification. Independent current44 counterassessmentd60d5ab0f120f2f0c14b65cfe76292f55be05a2d161e1c399ffbd132835dd7fd / scopebacfd606d5689354dec9711067fc9567525e1833d82438b97c7284cd5a041e05 / report3b7f0e0e1135b1f191d5a39650981a0ae15f66940d95c99841ab2bc0e63493dd / manifest0687680c4cb7defae44e421ea10320f14b1b5036029af37ff0241ce373950bfe independently read all500 complete facts and9 complete pairs/135 cells, originals0, before any future45 packet or primary44 report. Root actually fully read all three decision texts and verified14 local hash+byte entries/three critical hashes with exit0. Prior Bella source peer/Pauline producer/earlier text research is disclosed, not naive/blind. Counterfive Helen/Arlene/Aiden/Yvonne/Stephanie differs; it treats language/semantic depth and conditional Aiden/Arlene card connections as higher priorities. Root retains primary Adriana as the concrete worst because its entire only lesson is nearly visible Adrian+a, while Helen/Yvonne already teach a language/base-form contrast and Aiden/Arlene already retain specific historical/music hooks. This is a judgment between close editorial priorities, not consensus, measured ordering or proof every variant needs unique trivia. Both reviews explicitly require a richer actual supported candidate to earn reading cost; source status/availability does not determine ranking. Root initiated actual Adriana and Alexandra source inquiries rather than substituting ready Julia for the worst.

Julia exact80 approved object67bdbe6e5dcb275dfc660abc1c60191078b7b4d3736e64cbba72e580e51c9993 / decision2bbdf1683037cd4bce91016a2b4f72d47174e18dd54df2dcc2d944b676f896ed / report681ab22b5af8053e4805e5b76d7eedb3dbf16f08f44736b3c5f6254a6ae06829 / scopeb6fccad251e371268dfa263405d6207065e00bc39b2addea79a19d0293fa10f5 / manifest5e997d50b68d58ed854224265c00d5a66868cf01cc51259611cae41b10e9dc48. Root actually fully read exact five-field object and complete decision/report/scope, recomputed all103 producer plus128 peer local/external hash+byte bindings with exit0, and personally read complete pinned DMNES Julia/Julius and complete1312-word Yonge Julius section/boundaries, plus complete live Julia curation/player pair. Actual peer five complete main pages, three full DMNES and four full BTN auxiliaries, full Yonge section/tables/Foot59–60/immediate boundaries; prior own full front/prefaces/PGfooter exact-byte reused, fresh entire book/classical/medieval bodies0. Initial SVG-skipping extraction retained and corrected to complete printed-body rereads before acceptance. DMNES+Yonge support both qualified necessary clauses; BTN catalogue DMNES and selected classic pointers mean BTN is corroboration only, shared/deeper classical lineage untraced. Peer post44 complete target reread10:50:49Z at14f266/4301/5d8 plus final dated55:18Z guard preserved complete records; root actual58:07Z same data hashes/full target read, not whole500/metrics/recognition/CI certification. Six bounded related lines, no all500 novelty or player measurement.

Actual provenance commands used exit-gated sha256sum --check --quiet for the40-entry primary manifest and Python per-entry hash+byte assertions for14counter/103Julia-producer/128Julia-peer descriptors. Expected critical hashes and current4301/5d8 data equality were asserted. Root actually fully read the accepted object/decision/report/scope and complete live Julia pair. These are bounded evidence checks, not extra job tests, source-human-read counts or participant studies. Data/code/dependencies did not change; no redundant local generation/full test is claimed. LOOP remains at145/43 and zero established no-gain rounds. New docs-head fullCI is separate.

## KEEP GOING round45: 3 approved card-relevance changes

Exact prior head 505ba9cac1bb61895cc5b8cca5988f087f87f227/full CI 37768951023 completed/success, root actually read 2026-10-08T11:21:42Z, then reread C05. Five actual weaknesses: Adriana’s nearly visible feminine-Adrian relation without further context; Alexandra’s bare feminine-Alexander endpoint; Stephanie’s bare feminine-Stephen endpoint and crown replacement’s lesson loss; Nicole’s bare feminine-Nicholas endpoint; Julia’s bare feminine-Julius endpoint.

Fresh current44 primary reportfd9e93c46c5659b650d7b176e95332899aefa177005daf9482a57f208cadcac0 / scopeb9fccf3ec830d89c5ef82c3199dac9c1b593dd6b6c00974b0cfc33d7bdfcfa5f / locked ranking868d069047a8e1bb377bf1df2f68231278371719b5884ffbf99e24f55b1ea47b / manifestb97116fbb4ee64ab26a2a6764668830710e7ddfcd28769c0f768e16dccfb07d0. Actual primary reader personally read all500 complete current facts,19 complete curation/player pairs and285 cells, full metric/recognition contexts and four instruction documents, fresh original bodies0. Ranking locked11:02:19.792884Z before any future45 candidate/approval/source packet read; older ranks/ownConnor21 source-unit knowledge and Julia inquiry knowledge disclosed, no naive-model or availability ranking. Root actually fully read complete report/scope/ranking and recomputed all40 manifest entries/four critical hashes with exit0. Baseline actual14f266/4301ea8/5d8d6ec, dated final opaque guard11:06:13.303469Z; producer handoff's approximate11:07:51 was corrected without changing any frozen file. Five form a near-tied editorial cluster, no measured precise ordering. Actual worst Adriana37 has only the relation almost visible as Adrian+a, unlike named-language, wordplay, place and bearer alternatives compared in complete contexts. Current44 Connor/Bella/Pauline exact changes retained every old lesson, with specified repetition/density costs; nine metric/recognition fields per changed row unchanged, not a new SSA extraction. FullCI37766072529 completed/success actually read10:56:09Z and root C05/JOBS reread10:56:45Z preceded this fresh ranking. Current-source dictionary status/quotes/review notes are not original-body recertification. Independent current44 counterassessmentd60d5ab0f120f2f0c14b65cfe76292f55be05a2d161e1c399ffbd132835dd7fd / scopebacfd606d5689354dec9711067fc9567525e1833d82438b97c7284cd5a041e05 / report3b7f0e0e1135b1f191d5a39650981a0ae15f66940d95c99841ab2bc0e63493dd / manifest0687680c4cb7defae44e421ea10320f14b1b5036029af37ff0241ce373950bfe independently read all500 complete facts and9 complete pairs/135 cells, originals0, before any future45 packet or primary44 report. Root actually fully read all three decision texts and verified14 local hash+byte entries/three critical hashes with exit0. Prior Bella source peer/Pauline producer/earlier text research is disclosed, not naive/blind. Counterfive Helen/Arlene/Aiden/Yvonne/Stephanie differs; it treats language/semantic depth and conditional Aiden/Arlene card connections as higher priorities. Root retains primary Adriana as the concrete worst because its entire only lesson is nearly visible Adrian+a, while Helen/Yvonne already teach a language/base-form contrast and Aiden/Arlene already retain specific historical/music hooks. This is a judgment between close editorial priorities, not consensus, measured ordering or proof every variant needs unique trivia. Both reviews explicitly require a richer actual supported candidate to earn reading cost; source status/availability does not determine ranking. Root initiated actual Adriana and Alexandra source inquiries rather than substituting ready Julia for the worst. Following docs-only checkpoint505ba9cac1bb61895cc5b8cca5988f087f87f227/main4715aec3a77a00c29a1ca788e7863fd4ba1d379f pushed11:16:08Z kept identical4301/5d8data and added no LOOP round. Its own fullCI37768951023 completed/success(updated11:20:17Z), root actually read11:21:42Z, then reread C05/JOBS11:22:14Z. Retained primary/counter rankings are grounded in identical44data, not transferred to a changed45 dataset; latest30-minute deadline11:46:08Z.

Julia exact80 approved object67bdbe6e5dcb275dfc660abc1c60191078b7b4d3736e64cbba72e580e51c9993 / decision2bbdf1683037cd4bce91016a2b4f72d47174e18dd54df2dcc2d944b676f896ed / report681ab22b5af8053e4805e5b76d7eedb3dbf16f08f44736b3c5f6254a6ae06829 / scopeb6fccad251e371268dfa263405d6207065e00bc39b2addea79a19d0293fa10f5 / manifest5e997d50b68d58ed854224265c00d5a66868cf01cc51259611cae41b10e9dc48. Root actually fully read exact five-field object and complete decision/report/scope, recomputed all103 producer plus128 peer local/external hash+byte bindings with exit0, and personally read complete pinned DMNES Julia/Julius and complete1312-word Yonge Julius section/boundaries, plus complete live Julia curation/player pair. Actual peer five complete main pages, three full DMNES and four full BTN auxiliaries, full Yonge section/tables/Foot59–60/immediate boundaries; prior own full front/prefaces/PGfooter exact-byte reused, fresh entire book/classical/medieval bodies0. Initial SVG-skipping extraction retained and corrected to complete printed-body rereads before acceptance. DMNES+Yonge support both qualified necessary clauses; BTN catalogue DMNES and selected classic pointers mean BTN is corroboration only, shared/deeper classical lineage untraced. Peer post44 complete target reread10:50:49Z at14f266/4301/5d8 plus final dated55:18Z guard preserved complete records; root actual58:07Z same data hashes/full target read, not whole500/metrics/recognition/CI certification. Six bounded related lines, no all500 novelty or player measurement.

Adriana exact79 approved object edb2785bded81f4e959a266e9f1c4519eda2d56210b6d92f8f0fcc68101a5897 / decision450dd2b051829414d0bbf4cccc8f4b356e60c81d47d5e94590eb0072557205b6 / report7be1212be2e96003a5f1084723bc3f9f32b7d975b4bb197e4bf3b14e24b0de6f / scope1e3bd68eccab8ebaa66ee1f160b991867a4227e979973219d7bfe741caa66034 / manifest35bb5da4c78c398904fcf8d3dbe29706e37be63acf7d928ddf909cf4b3f820c2. Root actually fully read approved object, complete decision/report/personal scope and original-Moss metadata addendum17760a61bae4bfe26960304011300c37ea5f5c81af95380823735a65a563ecf6, then recomputed all139 peer local/external SHA256+byte descriptors/five critical hashes, actual exit0; all107 producer descriptors separately verified earlier. Peer personally read7 complete selected original main pages and4 fresh complete Moss auxiliaries; own prior fullBTN4/DMNES3 rights/catalogue pages were exact-byte reused, not fresh rereads. Underlying Kajanto/Hanks/medieval bodies0. Complete current target reread11:17:34Z atdocs505 and final dated guard bound unchanged44 data. BTN+Moss support both selected clauses directly; DMNES contextual feminine relation only, its harborAdria is not another Hadria vote. Moss actual ArticleJSONLD JenniferMoss and exact original title/canonical are credited in new approved metadata; absent printed byline/sentence drafting are not inferred. Known BTNcatalogueDMNES and selected Kajanto/Hanks pointers, deeper common scholarship untraced. Root live505/4301/5d8 guard remained exact before splice.

Alexandra exact83 approved object488215fd5c39c2486a8564bf9596c81367b26c475caa4ecf1a97f204775dacf4 / decisioneaaca04660be0976a10067b116e5c3b8bd7f9a2c2861f432ae620644774a714b / reporte009680426505a7593d2c4b6cf5618ffcaf5e596dd09238d0c39934bba99a236 / scope47893b86ab1ca633ed7c8c420c7a5bd4314dde973f360a11e9c0d8d1e9062946 / manifest61aa745968c398da45d017f73caa2299887eed69b2e50629d9e398a74614aae2. Root actually fully read exact object/complete decision/report/scope and attribution/availabilityac4e7e08fffba5b6fd81d1c6b12d08be1cafbda03dac3988d04565465e3681e8, then recomputed all149 peer local/external SHA256+byte descriptors/five critical hashes, actual exit0;126 producer descriptors separately verified earlier. First root combined metadata output truncated; missing exact Alexandra texts were then separately fully read untruncated before acceptance, no full-read claim from the truncated output. Actual peer17 complete original human documents (5 main,9 freshly reread original aux,2 READMEs/fullCClegal),2 complete original LSJ1940 entries/allTEIcreditrevision header, full851-word Yonge section/tables, fullprefaces/PGfooter and bounded120-linefront/30boundary/LSJboundary windows. Whole book/43MBlexicon/classical-medieval bodies0, BTN-linked Intermediate edition unread. DMNES+Yonge family/compound, DMNES+fullLSJ1940 selected lexical senses; Yonge help/men differs, BTNknownDMNES/classiccatalogue corroborationonly, Moss noexactbridge. Actual pin56061ca127f4a2844980baffc5f2b6d1332897b3/tree7331bd82776d39cdb5dab3e7fe6862d9ea187504/fourblobmatches verified by both scoped producers/peers; directPerseusCONNECT403 body0 recovered through officialGitHub, no auth/TLS bypass. Complete target guard11:20:34Z atdocs505 unchanged44, not whole500/CI/metrics certification. Distinct peer retains its own differing current44 five; acceptance does not alter frozen ranking.

Actual integration `python3 /tmp/c05-integrate-quality-round.py 45 /tmp/c05-round45-three-root-approved.json fbc2d2e5ce7b5ce4cf6d70302c09e181ec9653787a883d79efb1c7b3c575c733` copied only four fact fields and preserved 497 other whole records. Sequential `bash /tmp/c05-quality-run-focused.sh 45` runs reviewed/complete generators, 8focused tests, completed-data guards and 17 checksum checks. Exec 65770 actually exited 0; 8/8 pass, zero failures/cancellations/skips/todos, 14.567192331 seconds. Both outputs reproduce byte-exact goldens across timezones; strict schemas/review gates and 25 protected negative cases per CLI pass. All500 metrics/recognitions and the exact changed-ID set, source/selection pins and untouched full records were guarded. Code/dependencies unchanged since actual full 43-test/34-mutant/12-restore round36; no redundant full local run claimed. New pushed-head fullCI is required.

Julia44→80 (+36) retains the entire feminine Julius-family lesson and adds a concrete atypical proposed Greek root. The tentative proposal and extra density impose real reading cost. This is an editorial semantic gain rather than a settled etymology, falsehood repair, bearer-trait claim or empirical preference. No prior lesson is lost. DMNES's limited Greek evidence and Latin*Iovilios/Jove, BTN Jupiter and Yonge divine alternatives remain unselected; source typo downy-beared is literal in its quote, not silently amended.

Adriana37→79 (+42/eight added words) retains the entire feminine-Adrian relation and supplies the specific Italy place-name context. Hadria is another unfamiliar name and the extra reading length is a real cost; Italy makes the extension a modest concrete explanation. Generic place link only: exact Adria/Atri, north/central, harbor/sea/city naming, ancestry, modern Italian language, whole-name translation and an independently proven Moss Hadrianus step remain held. No old falsehood or audience result is claimed. Alexandra42→83 (+41) retains the entire feminine-Alexander relation and adds two ordinary English root senses without Greek lettering/slash alternatives. Nearly doubled length is a real cost, judged a modest optional semantic benefit; no universal sole translation, mythology/royal naming cause or ancestry. Yonge help/men differs from DMNES defend/man; those differences are preserved. Exact two lexical senses have DMNES+LSJ support, not a falsely unanimous two-source whole sentence. All three changes add119 characters in total and retain every prior lesson; broader variety or ranking precision is not measured.

## Round46: reject missing source-reference slots

Full sequential exec90137 actually exited0 in463.341081538seconds:44/44 tests; mutation baselines44/15/11,35/35 caught(25historical/10current),12 compiled files restored byte/hash-exact,17 checksums. Data/facts/metrics/recognition remain identical45.

Original86bb incoming one-reference/two-slot arrays were accepted in both orientations by parseCurrentFixture/buildCurrent/buildReviewedCandidates/buildComplete:8 accepted calls among28 original variant outcomes. Complete:true output serialized a null reference and failed strict schema before any post-return mutation. Dense current JSON was valid and byte-identical; JSON cannot encode holes, so no CLI corruption claim. Root fully read technical report/scope/probe/full outcome proof, verified47 manifest entries/five critical hashes. Original challenge reportadfedf45562317dc74fc9d05302cdea559ff7d2f3742dcdd2521606bde1c9240 / scopef1662ea7d01cc974cc820da051ac4aa8aa3bab9b74a3ba4c57931a90ac95a96d / manifest947cfb6a5bb387cf2308a17352c57eb5b696b8466d95b73c09b06f2910034436 remain immutable. Independent Python proof also matched500 numeric rows/7500 cells from retained derived annual inputs; originalSSA ZIP/source bodies0 in that separate challenge, no source/recognition recertification.

Indexed validation now passes every slot to the existing object/reference validator before normalized source counting. Dense order/field clones and all other gates remain. Dynamic getter/proxy/concurrent-mutation, post-return serializer, browser and filesystem limits are not extended. Independent static reviewer fully read5 files/1043lines and exact diff, no runtime/dist/tests/CI: report9ae7179631f151081c5bf830855fd57f7ca0b0604f1e803e42e8c42aa34c1aa2 / scopef41a8e2a13dd1636e9690a27c044b471fbab94d5ae91d49190ebdabe57af3248 / decisionaa190d082f274d07f7c6eff7909f1cb443c318759ed876a4ea7cbb6960437b73 / manifest26c518ef6999f92987fa1397023a03d2733d98071feabb66396ee10942570837. Root complete report/scope/decision read plus all19 SHA entries/18 payload hash-byte descriptors/five critical hashes verified. Static acceptance and root execution stay separate.

New semantic regression exercises five missing-slot shapes across all4 public entry points, input preservation and4 dense controls. Exact command from this folder: npm run build; node --test --test-name-pattern='public builders reject missing reference slots' dist/test/current.test.js. Before fix exec12311 actually exited1 (1test,0pass,1fail), missing expected exception from parseCurrentFixture; after fix exec60801 actually exited0 (1/1pass,3.374754157seconds). Those are focused runs, not full-suite claims. M35 restores the old skip-slot map behavior as valid compiled JavaScript; the full runner requires all11 current tests, rejects timeout/cancel/skip/invalid runs and restores every compiled byte/hash. M35 was caught with1 failing test; all35 mutants caught.

Actual full command: PARTYBOX_SOURCE_PYTHON=/workspace/.partybox-source-venv/bin/python PARTYBOX_SOURCE_FILE=/workspace/.partybox-source-cache/c05/c05-babynames.rda npm test. Root wrapper python3 /tmp/c05-round46-run-required.py awaited that child, logged status/timing and returned0; unified session90137 actualexit0 was read before this completion record or hashes/Git. The command runs build/alltests, independent10k comparisons/1003 seeds, pinned-source extraction/manual numeric guards, timezone double-generation/strict schemas/negative CLIs,35 semantic mutants with full baselines/restores and17 hashes. Earlier43/34 checks/failures remain historical, not overwritten. New exact pushed-head fullCI is required.

Fresh45 primary locked11:47:33Z before future46 packets: Kristin/Aiden/Arlene/Helen/Nicole. Actual500 untruncated facts,13 complete curation/player pairs/26objects/38curation references, four full instructiondocs, originals0; prior Adriana/Connor/broader source knowledge disclosed, not naive/blind. Root fully read report339128d7057813f4da6fcc8ac48c3a556ea4c187f712a1d8deb1f1a5bb6204d9 / scope993a10d4f066ce6b027e39c5f13a87d780dcac06424b758d2720e0b4198a1656 / lock552515ddc0ab8dae95640adfbed16781474f3ea3776f461250ce60be19357235 / whole-input guardae0d10b40ec41ed6258021e75544a1320368252f77864721b1d81b39c77206dd and verified31 hash+byte descriptors/five critical hashes/manifest e81d5668f1125c08da9b02ec720e9493d4e4cf3b18a8f1e3c8599bb1e4cc674b. Initial reader pair-output truncation was corrected by four actual complete individual outputs before freeze.

Counter locked11:50:57Z before future46 packets/primaryrank: Christy/Arlene/Ricky/Colton/Helen. Actual500facts/13 fullpairs/4instructiondocs, originals0; prior Alexandra/Bella/Pauline/Cecil/Rhonda source history remains separate. Root fully read assessment07367285f44f4e409d68045bce363e8473bf7078517cb70b67a0c2900e31e5e4 / scopefeb6c14036cb64cb95952f4d0cbccdd37151017935eac3dd4b2979dbd5228ac8 / report861a370bfeabb21d107927408ad550785c44b3945b2d002888cf771f87ab5f87 / lock49be16d969ea2caf7a1961932e5931f524ef0748000cd9edaca52254f8533c99 and verified17local+2prior immutable bindings/four critical hashes/manifestf72e4264c0bbaa4f1664089bc4a68a700b0346bcbc0d72934aa7a53bcff8d809. Root combined output truncated43tokens in scope; entire scope was separately reread untruncated before acceptance. Bounded three-row44→45 comparison only: Alexandra/Julia retain family lessons at+41/+36; Debra65 already44 unchanged, early contrary assumption corrected beforefreeze. No500metric/source/recognition recertification. Close editorial ranks differ, no consensus/precision claim. Root separately prioritizes the reproduced hard complete-gate violation over conditional content improvements, with four primary text concerns retained in the five. Existing true lessons remain; no variant needs unique trivia or automatic celebrity replacement.
