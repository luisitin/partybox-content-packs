# C02 Dead or Alive — historical pipeline sample

**Current Wikidata status and Commons portraits are blocked. This is not a playable pack.**

The sample has 30 historical Nobel biographies. No-death-recorded is not evidence
of current life: answers, sitelinks, portraits and fact lines remain null.
The output is explicitly historical and incomplete, with an explicit build date.

Run from `jobs/C02-dead-or-alive` with Node 24 and Python 3.12:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
python3 -m venv .portrait-venv
.portrait-venv/bin/python -m pip --cache-dir /workspace/.pip-cache install -r tools/requirements-source.txt
PARTYBOX_PORTRAIT_PYTHON=.portrait-venv/bin/python npm test
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Tests cover independent Gregorian/UTC eligibility implementations, 10,000
inputs, seeds 1–3 plus 1,000 saved random seeds, date/cutoff and missing-evidence
guards, schemas, byte-identical generation, CLI preservation, portrait transforms
on 30 original test patterns, and 25 one-at-a-time mutations.
Pillow is a build-time image tool; offline TypeScript has zero runtime dependencies.

To reproduce the source fixture from the retained, pinned CSV:

```sh
python3 tools/extract_sample.py \
  --source /workspace/.partybox-source-cache/c02-nobel-winners.csv \
  --output /tmp/c02-refresh.json
cmp fixtures/source.json /tmp/c02-refresh.json
```

The source URL and expected hash are in SOURCES. Original test pixels have no
association with the people in the sample. Caller-supplied image attribution
does not establish a verified Commons license. See BLOCKED, VERIFY and NEXT
for outstanding current-data, licensed portrait, source and CI checks.
