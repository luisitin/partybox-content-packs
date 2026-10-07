# C01 Emergency Room — historical pipeline sample

**2025 content is blocked; this is a tested historical sample, not a playable pack.**

The fixture contains 90 real 2017 NEISS cases across 30 products, taken from a
pinned CC0-declared mirror. Output shows partial weighted totals, never national
estimates. Facts and national estimates are null; `complete` is false.

Requirements: Node 24+, npm. Run from `jobs/C01-emergency-room`:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
npm test
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Tests include two independent aggregators over 10,000 inputs, properties with
seeds 1–3 plus 1,000 saved random seeds, JSON Schemas, repeat generation,
invalid-input rejection, CLI safety, and 25 one-at-a-time mutations.
No runtime dependencies or network calls are used by the offline pipeline.
Schemas check shape; runtime also enforces unique IDs, membership and year ordering.

Optional source refresh (Python 3.12; pinned extractor dependencies):

```sh
python3 -m venv /workspace/.partybox-source-venv
/workspace/.partybox-source-venv/bin/python -m pip --cache-dir /workspace/.pip-cache install -r tools/requirements-source.txt
/workspace/.partybox-source-venv/bin/python tools/extract_sample.py \
  --download --cache-dir /workspace/.partybox-source-cache --output-dir /tmp/c01-refresh
cmp fixtures/source.json /tmp/c01-refresh/historical-sample-2017.json
```

The extractor checks both immutable source SHA256s before decoding. It exports
only case IDs, products and weights, without narratives or demographic fields.
Build-time source fetching is separate from offline pack generation.

`BLOCKED.md` lists hosts needed for current data and corroboration. `NEXT.md`
records remaining current-year, fact, manual-row and CI verification work.
`VERIFY.md` records actual outcomes; local passing tests do not establish green CI.
