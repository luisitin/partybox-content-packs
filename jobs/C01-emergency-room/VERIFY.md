# Verification

Working directory for repository commands: `jobs/C01-emergency-room`, except
Git commands from the checkout root. Validation date: 2026-10-07 UTC.

## Setup and local end-to-end sample

| Exact command | Observed result | What it catches |
| --- | --- | --- |
| `npm --cache=/workspace/.npm-cache install --ignore-scripts --no-fund --no-audit` | Exit 0; 8 development packages installed, package-lock created. | Dependency/tool availability; default home cache failed earlier, corrected with writable workspace cache. |
| `npm --cache=/workspace/.npm-cache ci --ignore-scripts --no-fund --no-audit` | Exit 0; frozen install from lock succeeds. | Reproducible dependency resolution. |
| `npm run build` | Exit 0; strict TypeScript compilation. An initial assert.throws test typing failure was fixed before validation. | Type errors and build failures. |
| `node dist/src/cli.js fixtures/source.json data/sample.json --sample` | Exit 0; 30 historical sample rows, complete=false, estimates/facts=null. | Real fixture parsing, aggregation and serialization. |
| `node --test dist/test/*.test.js` | 6 tests executed, 6 passed, 0 failed/skipped; repeated after CLI guard change. | 10,000 independent implementation comparisons; seeded properties; invalid inputs; schemas; CLI/repeatability/checksums. |
| `sha256sum --check SHA256SUMS.txt` | Executed by integration test; all recorded files matched. | Accidental data/schema/seed drift. |
| `/workspace/.partybox-source-venv/bin/python -m pip --cache-dir /workspace/.pip-cache install -r tools/requirements-source.txt` | Exit 0; frozen installed versions subsequently recorded. | RData extractor dependencies and supported Python wheels. |
| `/workspace/.partybox-source-venv/bin/python tools/extract_sample.py --injuries /workspace/.partybox-source-cache/injuries.rda --products /workspace/.partybox-source-cache/products.rda --output-dir /tmp/c01-root-refresh` | Exit 0; 90 real cases/30 products from 386,906 2017 source cases. | Pinned source checksum, format, extraction and sample selection. |
| `cmp fixtures/source.json /tmp/c01-root-refresh/historical-sample-2017.json` | Exit 0; identical bytes, SHA256 789df12cd1782d55b64652a866711cf913b368bf5ffd7714d1ff00e7d6224389. | Fixture regeneration drift. |

Property runs use seeds 1, 2, 3 plus 1,000 distinct cryptographically generated
seeds saved in test/seeds.json. Differential testing compares streaming-map
aggregation with independent per-product filtering/reduction over 10,000 inputs.
Known-case assertions independently check weights/counts and product deduplication.
CLI tests regenerate twice, compare checked-in bytes, require --sample, and
reject input/output path equality without changing the fixture.

## Extractor repeatability and integrity (research helper commands)

```sh
PYTHONPATH=/tmp/c01-source/vendor python /tmp/c01-source/extract_sample.py --injuries /tmp/c01-source/downloads/injuries.rda --products /tmp/c01-source/downloads/products.rda --output-dir /tmp/c01-source
```

Observed exit 0: 90 real 2017 cases, 30 codes.

```sh
PYTHONPATH=/tmp/c01-source/vendor python /tmp/c01-source/extract_sample.py --injuries /tmp/c01-source/downloads/injuries.rda --products /tmp/c01-source/downloads/products.rda --output-dir /tmp/c01-source/repeat
```

Observed exit 0: byte-identical fixture.

```sh
PYTHONPATH=/tmp/c01-source/vendor python /tmp/c01-source/extract_sample.py --injuries /tmp/c01-source/downloads/injuries.rda --products /tmp/c01-source/download-test/products.rda --output-dir /tmp/c01-source/download-test --download
```

Observed exit 0: verified HTTPS product download plus full extraction; byte-identical fixture.

```sh
PYTHONPATH=/tmp/c01-source/vendor python /tmp/c01-source/extract_sample.py --injuries /tmp/c01-source/invalid-injuries.rda --products /tmp/c01-source/downloads/products.rda --output-dir /tmp/c01-source/checksum-rejection
```

Observed exit 1: SHA256 mismatch for injuries rejected before parsing. Expected failure: a corrupt source was rejected before parsing.

All successful extraction runs produced byte-identical fixture bytes.
The optional product-download route preserved TLS verification; expected source
SHA256s were enforced. Checksums originate from retrieved immutable bytes and
repeat downloads; no independently published upstream checksums were available.

## Source-access checks

```sh
curl --head --location --max-time 25 'https://www.cpsc.gov/Research--Statistics/NEISS-Injury-Data'
```

Observed exit 56; blocked_by_proxy_CONNECT_403; time: 2026-10-07T15:04:07Z. HTTP status 403 (not captured when null). official NEISS landing page Origin response and TLS handshake not reached; no publication, dataset, or source content verified.

```sh
curl --head --location --max-time 25 'https://www.cpsc.gov/cgibin/NEISSQuery/home.aspx'
```

Observed exit 56; blocked_by_proxy_CONNECT_403; time: 2026-10-07T15:04:07Z. HTTP status 403 (not captured when null). official query-home candidate Origin response and TLS handshake not reached; no publication, dataset, or source content verified.

```sh
curl --head --location --max-time 25 'https://www.cpsc.gov/cgibin/NEISSQuery/Data/2025/NEISS2025.zip'
```

Observed exit 56; blocked_by_proxy_CONNECT_403; time: 2026-10-07T15:04:07Z. HTTP status 403 (not captured when null). tentative 2025 ZIP URL; path guessed, not established Origin response and TLS handshake not reached; no publication, dataset, or source content verified.

```sh
curl --head --location --max-time 25 'https://injuryfacts.nsc.org/home-and-community/safety-topics/sports-and-recreational-injuries/'
```

Observed exit 56; blocked_by_proxy_CONNECT_403; time: 2026-10-07T15:04:07Z. HTTP status 403 (not captured when null). NSC corroboration candidate Origin response and TLS handshake not reached; no publication, dataset, or source content verified.

```sh
curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/README.md
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Historical third-party mirror; no 2025 data or latest-year availability established. Successful HTTP status code not explicitly captured.

```sh
curl --head --location --max-time 25 https://cpsc.gov/Research--Statistics/NEISS-Injury-Data
```

Observed exit 56; blocked_by_proxy_CONNECT_403; time: 2026-10-07T15:04:40Z. HTTP status 403 (not captured when null). Origin response and TLS handshake not reached.

```sh
curl --fail --show-error --silent --location --max-time 25 'https://raw.githubusercontent.com/hadley/neiss/master/DESCRIPTION'
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Historical mirror of CPSC-derived information; cannot independently corroborate current annual estimates. HTTP status code not explicitly captured.

```sh
curl --fail --show-error --silent --location --max-time 25 'https://raw.githubusercontent.com/hadley/neiss/master/man/injuries.Rd'
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Historical mirror of CPSC-derived information; cannot independently corroborate current annual estimates. HTTP status code not explicitly captured.

```sh
curl --fail --show-error --silent --location --max-time 25 'https://raw.githubusercontent.com/hadley/neiss/master/man/products.Rd'
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Historical mirror of CPSC-derived information; cannot independently corroborate current annual estimates. HTTP status code not explicitly captured.

```sh
curl --fail --show-error --silent --location --max-time 25 'https://raw.githubusercontent.com/hadley/neiss/master/data-raw/neiss.R'
```

Observed exit 22; HTTP_404; time: not captured. HTTP status 404 (not captured when null). Attempted path unavailable; DESCRIPTION license declaration remains the observed licensing evidence.

```sh
curl --fail --show-error --silent --location --max-time 25 'https://raw.githubusercontent.com/hadley/neiss/master/LICENSE'
```

Observed exit 22; HTTP_404; time: not captured. HTTP status 404 (not captured when null). Attempted path unavailable; DESCRIPTION license declaration remains the observed licensing evidence.

```sh
curl --fail --show-error --silent --location --max-time 25 https://github.com/hadley/neiss | rg -o '"path":"[^"]+"'
```

Observed exit 0; successful_repository_tree_extract; time: not captured. HTTP status None (not captured when null). Only paths extracted from page; this command did not capture HTTP status. Pipeline command did not use pipefail.

```sh
curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/R/injuries.R
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Same publisher and same document provenance; not an independent second source. Historical schema only; modern schema unverified. HTTP status not captured.

```sh
git ls-remote https://github.com/hadley/neiss.git HEAD
```

Observed exit 0; successful_git_read; time: not captured. HTTP status None (not captured when null). Confirms Git read only; does not establish licensing, current data, or write permission.

```sh
curl --fail --show-error --silent --location --max-time 25 https://github.com/hadley/neiss/tree/master/data-raw | rg -o '"path":"[^"]+"'
```

Observed exit 0; successful_repository_tree_extract; time: not captured. HTTP status None (not captured when null). Only paths extracted; HTTP status not captured. Pipeline command did not use pipefail.

```sh
curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/data-raw/injuries.R
```

Observed exit 0; successful_content_read; time: not captured. HTTP status None (not captured when null). Historical URL pattern only; current downloadable path and dataset availability unverified. HTTP status not captured.

```sh
set -o pipefail; curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/coding-manual.pdf | pdftotext - - | rg -n -i -C 3 'national estimate|1,200|1200|coefficient|unreliable|less than 20|January|2017|2018'
```

Observed exit 0; successful_PDF_text_read_output_truncated; time: not captured. HTTP status None (not captured when null). Broad search output truncated; cannot assert current reliability thresholds from this output. Historical official text hosted by a third party. HTTP status not captured.

```sh
curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/data-raw/query-builder.html | rg -n -i -C 3 'national estimate|1,200|1200|coefficient|unreliable|less than 20|Download|\.zip|statistically'
```

Observed exit 0; successful_HTML_text_read_no_relevant_estimate_evidence; time: not captured. HTTP status None (not captured when null). Did not establish estimate reliability, current query endpoints, or dataset download URLs. HTTP status not captured. Pipeline command did not use pipefail.

```sh
set -o pipefail; curl --fail --show-error --silent --location --max-time 25 https://raw.githubusercontent.com/hadley/neiss/master/coding-manual.pdf | pdftotext - - | sed -n '232,254p;1070,1128p'
```

Observed exit 0; successful_PDF_excerpt_read; time: not captured. HTTP status None (not captured when null). Historical manual; no current schema or instructions verified. Does not establish 2025 counts or estimates. HTTP status not captured.

Pinned documentation requests subsequently returned origin HTTP200 with
normal verified TLS; each of seven pinned URLs in SOURCES was downloaded twice
with identical bytes. The exact helper command family was:

```sh
python3 /tmp/c01-source/provenance/download-docs.py
python3 /tmp/c01-source/provenance/download-docs.py --round repeat
python3 /tmp/c01-source/provenance/download-docs.py --round manual coding-manual.pdf
python3 /tmp/c01-source/provenance/download-docs.py --round manual-repeat coding-manual.pdf
pdftotext -layout /tmp/c01-source/provenance/manual/coding-manual.pdf /tmp/c01-source/provenance/coding-manual.txt
python3 /tmp/c01-source/provenance/verify-provenance.py
```

These establish historical documentation access and repeatability, not current
estimates or independent fact verification. Failed candidate LICENSE, LICENSE.md
and data-raw/coding-manual.pdf requests returned origin404 and were not used.

## Delivery and checks still outstanding

Native Git reads succeeded. Initial claim C01 was pushed to main. Two subsequent
main claim-refresh pushes returned remote Internal Server Error, and fetch proved
that the refresh commit was not on main. A branch push dry-run succeeded; this
is not proof of delivery. Actual milestone push outcomes are recorded below.

GitHub API command `gh api repos/luisitin/partybox-content-packs --jq '{full_name,permissions}'`
returned exit1 Forbidden; it is blocked by current API host policy. No missing
secret was inferred. The network draft was saved but is not applied/published.

Unrun required full-content checks: current2025 source and coverage/reliability,
~500+ balanced rows, two independent factual sources, <=90-character fact lines,
30 manual random second-source row checks, current full-data regeneration and
schema validation, actual green CI, PR, and post-green-PR KEEP GOING.
No historical or programmatic check is represented as a completed manual
independent-source check. This job remains blocked after its tested sample pipeline.

## Final npm test and mutation checks

`npm test` executed the strict build, all 6 tests, then the complete mutation
runner; observed exit0, 6/6 tests passed and 25/25 mutations caught.
CLI preservation now covers normalized paths, symlink aliases and hardlink
aliases; these assertions ran in the final integration test.

Each mutation was planted one at a time in the generated implementation; its
syntax check exited0, its full 6-test suite exited1, and original compiled bytes
were restored in finally. Syntax failures and timeouts were not counted.
The runner first requires a passing baseline and checks exactly one target
occurrence. An initial reporter counter assumed TAP and was corrected to also
recognize Node24 spec output; that failed harness run counted no mutants.

| Mutation | Syntax exit | Suite exit | Failed tests | Outcome |
| --- | --- | --- | --- | --- |
| 1. duplicate products counted twice | 0 | 1 | 3 | caught |
| 2. case weights replaced by one | 0 | 1 | 6 | caught |
| 3. case count incremented twice | 0 | 1 | 5 | caught |
| 4. product order reversed | 0 | 1 | 5 | caught |
| 5. source product label discarded | 0 | 1 | 5 | caught |
| 6. fractional weighted total rounded | 0 | 1 | 5 | caught |
| 7. partial weighted sum called national estimate | 0 | 1 | 5 | caught |
| 8. unsupported fact inserted | 0 | 1 | 5 | caught |
| 9. unverified fact called verified | 0 | 1 | 5 | caught |
| 10. sample declared complete | 0 | 1 | 3 | caught |
| 11. historical year replaced by requested year | 0 | 1 | 3 | caught |
| 12. requested year replaced by source year | 0 | 1 | 3 | caught |
| 13. historical sample called production | 0 | 1 | 3 | caught |
| 14. fractional integer fields accepted | 0 | 1 | 1 | caught |
| 15. zero case weight accepted | 0 | 1 | 1 | caught |
| 16. whitespace labels accepted | 0 | 1 | 1 | caught |
| 17. unsupported input mode accepted | 0 | 1 | 1 | caught |
| 18. historical year order ignored | 0 | 1 | 1 | caught |
| 19. duplicate product declarations accepted | 0 | 1 | 1 | caught |
| 20. duplicate case identifiers accepted | 0 | 1 | 1 | caught |
| 21. source weight changed while parsing | 0 | 1 | 3 | caught |
| 22. weighted sum overflow accepted | 0 | 1 | 1 | caught |
| 23. serialized trailing newline omitted | 0 | 1 | 1 | caught |
| 24. CLI explicit sample flag omitted | 0 | 1 | 1 | caught |
| 25. CLI source overwritten by output | 0 | 1 | 1 | caught |

The ignored `.mutation-work/report.json` and per-mutant stdout/stderr belong to
this run. `npm test` regenerates them; they are not committed source data.
Schemas validate fixture/pack shape; runtime additionally checks IDs, membership,
year ordering and numeric overflow. Full current-data/independent-source/CI
checks remain outstanding as documented above.
