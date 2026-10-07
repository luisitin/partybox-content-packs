# C03 Internet Famous — historical pipeline sample

**Current Wikimedia metrics are blocked. This is an incomplete historical sample.**

Thirty disjoint pairs of recognizable English Wikipedia titles use 1,800 daily
counts from June 2020. The source's access/agent filters were not recorded.
The requested last completed month is derived from an explicit build date;
the output never presents these historical counts as current metrics.

Run from `jobs/C03-internet-famous` with Node 24:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
npm test
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Two monthly aggregators and two pair selectors are compared on 10,000 inputs.
Tests include seeds 1–3 and 1,000 saved random seeds, calendar and safe-integer
limits, inclusive 1.2–3 ratios, no repeated titles, deterministic ties,
schemas, repeat generation, CLI source protection and 25 semantic mutations.
There are no runtime dependencies or network calls in the TypeScript pipeline.

Regenerate the pinned source fixture with Python's standard library:

```sh
python3 tools/extract_sample.py \
  --source /workspace/.partybox-source-cache/c03-hyper-pageviews.csv \
  --output /tmp/c03-refresh.json
cmp fixtures/source.json /tmp/c03-refresh.json
```

SOURCES records the immutable CSV and its required hash, license and limits.
Fact lines remain null until independently verified. See VERIFY, BLOCKED
and NEXT for actual checks and full current-content requirements.
