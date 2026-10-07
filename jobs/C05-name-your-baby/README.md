# C05 Name Your Baby

`data/name-your-baby.json` delivers 500 familiar names with reviewed short
facts, peak decades, peak counts and 15-cell decade sparklines. Each fact
retains two authored source works, brief supporting quotes and a review note.
Recognition is editorial judgment about broad US familiarity, not a survey.
The base and reviewed candidate packs remain available for comparison.

Counts come from the checksum-pinned official SSA snapshot, 1880–2025.
Peak count is the largest observed decade subtotal for an exact spelling and
recorded F/M category. The 2020s contain six observed years (2020–2025);
label that period partial. Counts are not projected or normalized. Missing
published years and unobserved future years are separate fields. Missing
records or zero published subtotals do not prove zero births. Pre-1937
applications are incomplete; territorial records are outside this dataset.

Selection requires 50,000 published occurrences and a peak at least 15%
above its runner-up. A pinned 500-ID manifest replaces 13 uncertain forms
with reviewed reserves. Every complete row passes fact and recognition
gates; candidate builders always keep `complete: false`.

With Node 24 and Python 3.12, from this folder:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
python3 -m venv /tmp/c05-source-venv
/tmp/c05-source-venv/bin/python -m pip install -r tools/requirements-source.txt
curl --fail --location --output /tmp/c05-babynames.rda \
  'https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data/babynames.rda'
PARTYBOX_SOURCE_PYTHON=/tmp/c05-source-venv/bin/python \
  PARTYBOX_SOURCE_FILE=/tmp/c05-babynames.rda npm test
npm run generate:current
npm run generate:reviewed
npm run generate:complete
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Regenerate the current source without touching tracked files:

```sh
python3 tools/extract_current.py \
  --source fixtures/ssa-names-2026-10-07.zip \
  --selection fixtures/selection.json --output /tmp/c05-current.json
cmp fixtures/current-source.json /tmp/c05-current.json
```

The separate historical 30-name sample analyzes 1880–2009. Tests cover
schemas, two independent implementations, stored property seeds, byte
repeatability, partial decades, input preservation and semantic mutations.
The complete golden is checked against regenerated production bytes and its
strict schema. Runtime game logic is pure, offline and dependency-free.
See SOURCES, VERIFY, CONFLICTS and NEXT for attribution and delivery status.
