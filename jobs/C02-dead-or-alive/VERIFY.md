# Verification

Date:2026-10-07 UTC. Working directory:jobs/C02-dead-or-alive except
Git/research helper commands. These are sample-pipeline results, not a completed
500-person pack or independently verified current status.

## Setup and fixture regeneration

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts --no-fund --no-audit
```

Result:Exit0,8 locked development packages installed.
Catches:Dependency and compiler availability; initial attempt preceded lock-file copying and failed, corrected before validation.

```sh
/workspace/.partybox-source-venv/bin/python -m pip --cache-dir /workspace/.pip-cache install Pillow==12.3.0
```

Result:Exit0,Pillow12.3.0 installed.
Catches:Build-time WebP encoder availability.

```sh
npm run build
```

Result:Exit0,strict TypeScript build.
Catches:Type/build failures; initial Stats typing was fixed by core author before passing.

```sh
node dist/src/cli.js fixtures/source.json data/sample.json --sample --build-date 2026-10-07
```

Result:Exit0,historical incomplete30-row JSON generated.
Catches:Fixture parsing, explicit date, pure sample mapping and CLI serialization.

```sh
python3 tools/extract_sample.py --source /workspace/.partybox-source-cache/c02-nobel-winners.csv --output /tmp/c02-refresh-a.json
```

Result:Exit0,30 biographies; SHA25605b024a47fe33c7be213dbc6b6944ab9d1b16d04632a809796ad98b7bd9f762a.
Catches:Pinned source checksum, individual/unique-name selection, historical normalization.

```sh
python3 tools/extract_sample.py --source /workspace/.partybox-source-cache/c02-nobel-winners.csv --output /tmp/c02-refresh-b.json
```

Result:Exit0,same fixture hash.
Catches:Repeat extraction nondeterminism.

```sh
cmp fixtures/source.json /tmp/c02-refresh-a.json
```

Result:Exit0,identical.
Catches:Source fixture regeneration drift.

```sh
cmp /tmp/c02-refresh-a.json /tmp/c02-refresh-b.json
```

Result:Exit0,identical.
Catches:Repeated extraction byte drift.

## Live-source research checks

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c02-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/dsfox-idea/humans-top/6447f47b72880e87eb7d0ff33455ac2eed316d85/README.md'
```

Time:2026-10-07 15:14:26 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=9383. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c02-source-license.txt --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/dsfox-idea/humans-top/6447f47b72880e87eb7d0ff33455ac2eed316d85/LICENSE'
```

Time:2026-10-07 15:14:26 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=7048. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c02-humans.csv --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/dsfox-idea/humans-top/6447f47b72880e87eb7d0ff33455ac2eed316d85/humans.csv'
```

Time:2026-10-07 15:14:26 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=483637. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 40 --output /tmp/c02-vetustas-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/0xShady/vetustas-archiva/67c25b02041f58f5ed7c77fd09b2508d58eba6e7/README.md'
```

Time:2026-10-07 15:16:01 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=7089. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 30 --output /tmp/c02-vetustas-script-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/0xShady/vetustas-archiva/67c25b02041f58f5ed7c77fd09b2508d58eba6e7/scripts/README.md'
```

Time:2026-10-07 15:16:20 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=8844. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 30 --output /tmp/c02-nobel-winners.csv --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/78474f0d3496a1f855deeceb63e250f494cbe938/data/2019/2019-05-14/nobel_winners.csv'
```

Time:2026-10-07 15:19:44 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=294027. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 30 --output /tmp/c02-nobel-readme.md --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/78474f0d3496a1f855deeceb63e250f494cbe938/data/2019/2019-05-14/readme.md'
```

Time:2026-10-07 15:19:44 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=5142. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --fail --silent --show-error --location --max-time 30 --output /tmp/c02-nobel-source-license.txt --write-out 'http_code=%{http_code} ssl_verify_result=%{ssl_verify_result} bytes=%{size_download}\n' 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/78474f0d3496a1f855deeceb63e250f494cbe938/LICENSE'
```

Time:2026-10-07 15:19:44 UTC; exit0; http_code=200 ssl_verify_result=0 bytes=7048. Detects source/rights documentation access; does not establish independent corroboration.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://query.wikidata.org/sparql?query=ASK%7Bwd%3AQ42%20wdt%3AP31%20wd%3AQ5%7D&format=json'
```

Time:2026-10-07 15:05:47 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://www.wikidata.org/wiki/Special:EntityData/Q42.json'
```

Time:2026-10-07 15:05:47 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=File%3AAlbert%20Einstein%20Head.jpg&prop=imageinfo&iiprop=url%7Cextmetadata'
```

Time:2026-10-07 15:05:47 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://upload.wikimedia.org/wikipedia/commons/9/91/Albert_Einstein_Head.jpg'
```

Time:2026-10-07 15:05:47 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Albert_Einstein&prop=extracts&explaintext=1'
```

Time:2026-10-07 15:05:47 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

```sh
curl --silent --show-error --location --max-time 20 --dump-header - --output /dev/null --write-out '\nhttp_code=%{http_code} ssl_verify_result=%{ssl_verify_result} remote_ip=%{remote_ip} url_effective=%{url_effective}\n' 'https://www.nobelprize.org/prizes/physics/1921/einstein/biographical/'
```

Time:2026-10-07 15:06:38 UTC; exit56,proxy CONNECT403,origin code000. TLS verification enabled; origin handshake not reached. Detects the actual current-source policy blocker, not an origin404 or invalid certificate.

## Outstanding full-content requirements

Unrun:current Wikidata refresh,60-sitelink checks,500+ recognizable people,
actual verified Commons portraits/attribution,independent fact lines <=90characters,
30 manual random second-source row checks,actual green CI/PR and post-green-PR
KEEP GOING. Historical extraction and synthetic image tests do not substitute
for those checks. Detailed test/mutation and delivery outcomes follow below.

## Final complete local command

```sh
PARTYBOX_PORTRAIT_PYTHON=/workspace/.partybox-source-venv/bin/python npm test > /tmp/c02-final-npm-test.log 2>&1
```

Result: exit 0. Strict build; 26/26 tests passed, zero failed/skipped/cancelled; all six checksums passed. The mutation baseline also passed all 26 tests. Core coverage includes 10,000 differential cases and 24,072 property cases across seeds 1, 2, 3 and 1,000 saved random seeds. It catches calendar errors, fame and recent-death boundaries, stale/missing evidence, invalid fixtures, schema violations, serialization drift, timezone dependence and source/output alias damage.

The first mutation run caught 24/25 and exposed an absent incorrect-flag regression. The final suite rejects a five-argument --production invocation and verifies rejected arguments preserve existing output bytes; final mutation result is 25/25.

## Portrait checks and measured performance correction

```sh
./node_modules/.bin/tsc --target ES2022 --module NodeNext --moduleResolution NodeNext --strict --noUncheckedIndexedAccess --exactOptionalPropertyTypes --noEmitOnError --forceConsistentCasingInFileNames --skipLibCheck --rootDir . --outDir dist test/portrait.test.ts
```

Result: exit 0. Strict targeted compilation passed.

```sh
PARTYBOX_PORTRAIT_PYTHON=/workspace/.partybox-source-venv/bin/python node --test dist/test/portrait.test.js
```

Result: exit 0. 10/10 tests passed in 21.035 seconds, no skipped or cancelled tests.

The portrait suite makes 108 CLI invocations: 65 successful and 43 rejected. Thirty original synthetic PNGs are transformed twice; each WebP is decoded and checked for dimensions, strict <40,000-byte size, no upscaling, hash, attribution and metadata schema. The original 384x384 random-RGBA stress case, 512x512 random-RGB case and valid palette/partial-alpha sources exercise dimension fallback and transparency. Invalid URL/license/author fields, corrupt or animated sources, source-root escapes, 13 aliases and two directory destinations must reject before modifying existing artifacts. The directory guard fixed a partial-write risk found during review. Test images are original patterns, not portraits.

```sh
/workspace/.partybox-source-venv/bin/python - <<'PY'
from PIL import Image
from io import BytesIO
import json,random,time
r=random.Random(1701)
alpha=r.randbytes(256*256)
content=bytearray()
for a in alpha:content.extend((90,130,170,a))
image=Image.frombytes('RGBA',(256,256),bytes(content))
for method in (0,2,4,6):
 start=time.perf_counter();buffer=BytesIO()
 image.save(buffer,format='WEBP',quality=85,method=method,lossless=False,exact=True,alpha_quality=100)
 print(json.dumps({'method':method,'bytes':len(buffer.getvalue()),'seconds':round(time.perf_counter()-start,3)}),flush=True)
PY
```

Result: exit 0 on Python 3.12.14, Pillow 12.3.0, libwebp 1.6.0. On this single synthetic 256x256 alpha-noise input, method 6 took 6.693 seconds and method 4 took 0.018 seconds, both 65,862 bytes. The tool now uses method 4; its deterministic quality/dimension ladder still enforces final size. This measurement is one input/run, not a general performance guarantee or byte-equivalence claim. The original large RGBA test was restored and passed after this correction.

## One-at-a-time semantic mutations

```sh
node test/mutations.mjs
```

Runs the complete baseline, then all 16 core/CLI tests for each changed TypeScript artifact; unchanged portrait code is covered by the baseline. Each mutant passes node --check first. Syntax failures, zero-test results, cancellation and timeout do not count as catches.

| ID | Planted bug | Result | Failed tests |
| --- | --- | --- | --- |
| 1 | 60-sitelink boundary excluded by primary | caught | 5 |
| 2 | 30-day death boundary excluded by primary | caught | 3 |
| 3 | unknown sitelinks treated as verified by primary | caught | 2 |
| 4 | stale status verification accepted by primary | caught | 4 |
| 5 | unverified portrait accepted by primary | caught | 3 |
| 6 | primary alive and dead labels reversed | caught | 5 |
| 7 | 60-sitelink boundary excluded by reference | caught | 5 |
| 8 | 30-day death boundary excluded by reference | caught | 3 |
| 9 | Gregorian year zero accepted | caught | 1 |
| 10 | non-400-divisible century treated as leap year | caught | 3 |
| 11 | invalid day past month end accepted | caught | 4 |
| 12 | UTC calendar rollover accepted by reference | caught | 2 |
| 13 | fractional sitelinks accepted | caught | 1 |
| 14 | future death date accepted | caught | 1 |
| 15 | duplicate fixture IDs accepted | caught | 1 |
| 16 | historical sample called production | caught | 4 |
| 17 | sample declared complete | caught | 4 |
| 18 | unknown present status guessed alive | caught | 4 |
| 19 | unknown sitelinks guessed at eligibility threshold | caught | 4 |
| 20 | missing portrait replaced by unlicensed object | caught | 4 |
| 21 | unsupported fact inserted | caught | 4 |
| 22 | unknown fact called verified | caught | 4 |
| 23 | serialized trailing newline omitted | caught | 2 |
| 24 | CLI explicit sample opt-in ignored | caught | 1 |
| 25 | CLI source overwrite protection removed | caught | 1 |

Result: 25/25 caught; all mutants syntax-valid; no timeouts/cancellations. Compiled source restored byte-for-byte, verified against its original SHA256.

## Reusable cloud setup

```sh
bash /workspace/.partybox-install.sh
```

Result: exit 0; frozen source/image Python dependencies and current checked-out job npm lock installed, strict build passed. This catches missing/wrong runtime and unwritable default-cache setup. The generalized script and branch-aware startup instructions were saved in the environment draft; successful saving does not apply the network policy or publish a snapshot.
