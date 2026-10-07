# Verification

Checks were performed on 2026-10-07 UTC. The complete content requirements remain separate from historical pipeline checks. Proxy CONNECT denial precedes origin TLS; normal certificate verification stays enabled.

## Source access research

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/data-poems/us-attention-data/6122c84d2cacfdda905d998ab2d0692831f9816f/README.md'
```

Time: 2026-10-07 15:14:26 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=4045. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-source-license.txt --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/data-poems/us-attention-data/6122c84d2cacfdda905d998ab2d0692831f9816f/LICENSE'
```

Time: 2026-10-07 15:14:26 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=1069. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-metadata.json --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/data-poems/us-attention-data/6122c84d2cacfdda905d998ab2d0692831f9816f/wikipedia_pageviews_metadata.json'
```

Time: 2026-10-07 15:14:26 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=947. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-pageviews.json --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/data-poems/us-attention-data/6122c84d2cacfdda905d998ab2d0692831f9816f/wikipedia_pageviews.json'
```

Time: 2026-10-07 15:14:26 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=2540808. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-hyper-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/README.md'
```

Time: 2026-10-07 15:16:01 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=198. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-hyper-license.txt --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/LICENSE'
```

Time: 2026-10-07 15:16:01 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=7048. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c03-hyper-pageviews.csv --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/wikipedia_pageviews.csv'
```

Time: 2026-10-07 15:16:01 UTC; exit 0; http_code=200 ssl_verify_result=0 bytes=19768436. Catches inaccessible source/documentation and transport failures; a successful download does not establish current data or independent corroboration.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Albert_Einstein&prop=extracts&explaintext=1'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin code 000. Catches the current source-access blocker. TLS verification was enabled; origin certificate negotiation never occurred.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Albert_Einstein/monthly/2026090100/2026093000'
```

Time: 2026-10-07 15:05:47 UTC; exit 56; proxy CONNECT 403, origin code 000. Catches the current source-access blocker. TLS verification was enabled; origin certificate negotiation never occurred.

## Initial dependency setup

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts --no-fund --no-audit
```

Result: exit 0; eight locked development packages installed. Catches missing package/compiler availability and avoids the unwritable default npm cache. Detailed generation, schema, property, differential, mutation and delivery outcomes follow after execution.

## Outstanding full-content checks

Unrun: current September 2026 API metrics, roughly 500+ pairs and measured recognition, two-source fact lines, 30 random manual independent checks, actual green CI/PR and post-green KEEP GOING. A local historical sample result never substitutes for these checks.

## Core smoke and schema checks

```sh
node --input-type=module - <<'JS'
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {parseFixture,buildSample,aggregatePrimary,aggregateReference,selectPairsPrimary,selectPairsReference,previousMonth} from './src/build.ts';
const raw=JSON.parse(readFileSync('fixtures/source.json','utf8'));
assert.deepEqual(parseFixture(raw),raw);
const records=raw.rows.flatMap(row=>[row.a,row.b].flatMap(article=>article.daily.map(day=>({article:article.article,...day}))));
const first=aggregatePrimary(records,raw.period_start,raw.period_end);
assert.deepEqual(first,aggregateReference(records,raw.period_start,raw.period_end));
assert.deepEqual(selectPairsPrimary(first),selectPairsReference(first));
const pack=buildSample(raw,'2026-10-07');
assert.equal(pack.rows.length,30);
assert.deepEqual(pack.rows.map(row=>[row.id,row.a.article,row.b.article]),raw.rows.map(row=>[row.id,row.a.article,row.b.article]));
console.log(JSON.stringify({sourceRows:raw.rows.length,dailyRecords:records.length,monthlyArticles:first.length,pairs:pack.rows.length,firstPair:pack.rows[0],requestedPeriod:previousMonth('2026-10-07'),sourcePreserved:true,independentAggregatorsAndSelectorsEqual:true}));
JS
```

Result: exit 0. Fixture parsing preserves source shape and values in returned copy. Independent aggregation agrees for all 1,800 daily records and60 articles in actual fixture. Independent pair selection agrees for actual articles. All 30 computed source pair IDs and titles match stored source pair choices. Explicit 2026-10-07 requested period resolves to September 2026.
Limits: This smoke printed sourcePreserved:true but did not snapshot raw input before/after; use the dedicated later immutability/source-alias tests for stronger preservation evidence. This actual-fixture comparison is not the required 10,000 random-case run.

```sh
npm run build
```

Result: exit 0. Strict ES2022 NodeNext compilation of files present at this point.
Limits: Test worker had not finished test/core.test.ts yet; this was the early source build, not the later full test baseline.

```sh
node --input-type=module - <<'JS'
import {readFileSync} from 'node:fs';
import {Ajv} from 'ajv';
import assert from 'node:assert/strict';
import {buildSample} from './dist/src/build.js';
const fixture=JSON.parse(readFileSync('fixtures/source.json','utf8'));
const pack=buildSample(fixture,'2026-10-07');
const ajv=new Ajv({strict:true,allErrors:true});
for(const[path,value]of [['schemas/fixture.schema.json',fixture],['schemas/pack.schema.json',pack]]){
 const validate=ajv.compile(JSON.parse(readFileSync(path,'utf8')));
 assert.ok(validate(value),JSON.stringify(validate.errors));
}
console.log('Actual source fixture and30-pair output pass both strict AJV schemas');
JS
```

Result: exit 0. Both Draft7 schemas compile with AJV strict:true and allErrors:true. Actual 1,800-daily-record fixture validates against fixture schema. Constructed 30-pair historical output validates against pack schema.
Limits: Schema covers shape and safety flags; runtime guards separately validate actual calendar dates, complete per-article month coverage, uniqueness, monthly sums, and exact rational pairing.

```sh
node dist/src/cli.js fixtures/source.json data/sample.json --sample --build-date 2026-10-07
```

Result: exit 0; historical 30-pair golden file generated. Catches parser/aggregation/selection/serialization integration and explicit build-date handling.

```sh
npm run build
node --test dist/test/core.test.js
```

Results: strict full compilation exit 0. First baseline was 13/15 because two golden-data checks ran before data/sample.json existed (ENOENT). After the generator completed, the same compiled suite passed 15/15. No implementation or test change was needed. These catch missing delivery artifacts as well as logic failures.

## Pinned source regeneration and input protection

```sh
python tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /tmp/c03-refresh-a.json
```

Result: exit 0; 30 disjoint pairs, 60 titles, 1,800 daily observations; fixture SHA256 80c0939ec053bedd821a217ec30ede1eb5862dc3be39e15cc9420ba40990bb04. Catches source hash drift, incomplete dates, invalid counts and extraction nondeterminism.

```sh
python tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /tmp/c03-refresh-b.json
```

Result: exit 0; 30 disjoint pairs, 60 titles, 1,800 daily observations; fixture SHA256 80c0939ec053bedd821a217ec30ede1eb5862dc3be39e15cc9420ba40990bb04. Catches source hash drift, incomplete dates, invalid counts and extraction nondeterminism.

```sh
cmp /tmp/c03-refresh-a.json /tmp/c03-refresh-b.json
cmp /tmp/c03-refresh-a.json /workspace/.partybox-research/c03-monthly-sample30.json
cmp /tmp/c03-refresh-a.json fixtures/source.json
```

Results: each exit 0; all files byte-identical. Catches fixture drift against both the retained research sample and repeat extraction. These are same-origin comparisons, not independent factual corroboration.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /tmp/partybox-c03-final-checks-ov10i1ax/corrupt.csv --output /tmp/partybox-c03-final-checks-ov10i1ax/output.json
```

Result: expected exit 1; corrupt source rejected before CSV processing; source bytes unchanged. Catches corrupt/tampered source input before parsing.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /workspace/.partybox-source-cache/c03-hyper-pageviews.csv
```

Result: expected exit 1; same-path source overwrite rejected; source bytes unchanged. Catches source alias damage or invalid output destination.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /workspace/.partybox-source-cache/./c03-hyper-pageviews.csv
```

Result: expected exit 1; normalized-path source overwrite rejected; source bytes unchanged. Catches source alias damage or invalid output destination.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /tmp/partybox-c03-final-checks-ov10i1ax/source-alias.csv
```

Result: expected exit 1; symlink source overwrite rejected; source bytes unchanged. Catches source alias damage or invalid output destination.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /tmp/partybox-c03-final-checks-ov10i1ax/pinned-copy.csv --output /tmp/partybox-c03-final-checks-ov10i1ax/source-hardlink.csv
```

Result: expected exit 1; hardlink source overwrite rejected; source bytes unchanged. Catches source alias damage or invalid output destination.

```sh
python /workspace/partybox-content-packs/jobs/C03-internet-famous/tools/extract_sample.py --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv --output /tmp/partybox-c03-final-checks-ov10i1ax/directory-output
```

Result: expected exit 1; directory output rejected; source bytes unchanged. Catches source alias damage or invalid output destination.

Resolved failures: initial wrapper indentation placed spaces into candidate title literals, preventing 30 pairs; moving the unchanged literal to module level restored exact fixture bytes. An initial hardlink harness attempted /workspace-to-/tmp linking and hit EXDEV; a disposable source copy and hardlink on the same filesystem fixed the harness. No tracked source was changed by either failure.

## Live pinned documentation review

```sh
curl --proto =https --proto-redir =https --location --fail-with-body --silent --show-error --connect-timeout 15 --max-time 90 --output - --write-out '
C03_CURL_METADATA:%{json}' https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/README.md
```

Result: exact command executed twice, exit 0 and HTTP 200 each time, TLS peer verification result 0; repeated SHA256 872f0f2990c012200fc230dd629deffee91ead94409b9fafbfb706fa191dd4bf. Catches source-document access/integrity drift; only one publisher family.

```sh
curl --proto =https --proto-redir =https --location --fail-with-body --silent --show-error --connect-timeout 15 --max-time 90 --output - --write-out '
C03_CURL_METADATA:%{json}' https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/LICENSE
```

Result: exact command executed twice, exit 0 and HTTP 200 each time, TLS peer verification result 0; repeated SHA256 a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499. Catches source-document access/integrity drift; only one publisher family.

The README distinguishes a Jan–June 2020 article-selection description from an observation interval of 2019-01-01 through 2020-06-30. The relation is unexplained; no complete full-2020 coverage or documented access/agent filter is inferred. The actual selected June coverage is checked from the data.

## Final complete local command

```sh
npm test > /tmp/c03-final-npm-test.log 2>&1
```

Result: exit 0; strict full build, 15/15 tests passed, zero failures/skips/cancellations; all five checksums passed. Independent monthly aggregators agree over 10,000 cases; independent sort/greedy and repeated-scan pair selectors agree over another 10,000. Properties run 6,018 cases across seeds 1, 2, 3 plus 1,000 saved random seeds. Checks catch calendar/period errors, duplicate/missing days, unsafe counts/sums, exact 1.2 and 3 ratio errors (including MAX_SAFE_INTEGER boundaries), nondeterministic ties/title reuse, input mutation, historical provenance/schema drift, incorrect CLI flags and output/source-alias damage. CLI tests regenerate matching bytes in multiple timezones.

## One-at-a-time semantic mutations

```sh
node test/mutations.mjs
```

Complete 15-test baseline passes; each of 25 unique bugs is syntax-checked and then runs all 15 tests. Syntax failures, timeouts, cancellation and zero-test results never count as catches.

| ID | Planted bug | Result | Failed tests |
| --- | --- | --- | --- |
| 1 | daily pageviews replaced by record count | caught | 9 |
| 2 | duplicate article/date records accepted | caught | 1 |
| 3 | missing days accepted by primary aggregation | caught | 1 |
| 4 | unsafe monthly total accepted | caught | 1 |
| 5 | reference aggregation adds one per day | caught | 5 |
| 6 | January previous month retains wrong year | caught | 1 |
| 7 | previous month replaced by current month | caught | 4 |
| 8 | non-400-divisible century treated as leap year | caught | 4 |
| 9 | invalid day past month end accepted | caught | 3 |
| 10 | exact 1.2 ratio excluded by primary | caught | 3 |
| 11 | exact 3 ratio excluded by primary | caught | 3 |
| 12 | pair preference changed from 1.6 to 2 | caught | 8 |
| 13 | previously used article reused | caught | 6 |
| 14 | reported pair ratio inverted | caught | 7 |
| 15 | exact 1.2 ratio excluded by reference | caught | 3 |
| 16 | equal-distance pair tie order reversed | caught | 3 |
| 17 | input falsely verified current month accepted | caught | 1 |
| 18 | stored monthly count may disagree with daily records | caught | 1 |
| 19 | sample declared complete | caught | 4 |
| 20 | historical source declared current-month verified | caught | 4 |
| 21 | source period replaced by requested recent month | caught | 4 |
| 22 | unsupported fact inserted | caught | 4 |
| 23 | unverified fact declared verified | caught | 4 |
| 24 | CLI explicit sample opt-in ignored | caught | 1 |
| 25 | CLI source overwrite protection removed | caught | 1 |

Result: 25/25 caught, all syntax-valid; no timeout/cancellation. Both compiled files restored byte-for-byte with matching before/after SHA256. These measured sample checks do not claim current-source, manual fact or green CI completion.
