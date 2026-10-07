# C05 Name Your Baby

**Incomplete: independent facts and recognition review are still in progress.**

`data/current-candidates.json` holds 500 names from the official SSA snapshot
covering 1880–2025. Peak count is the largest observed decade subtotal of
published annual counts for one exact spelling and recorded F/M category.
The 2020s contain six observed years (2020–2025), not a completed decade.
Charts must label that partial period; counts are not projected or normalized.
Missing published years and unobserved future years are separate fields.
Neither missing rows nor zero published subtotals prove zero births.

The checksum-pinned CC0 official ZIP is retained under `fixtures/` so SSA
revisions cannot silently change this build. Candidate filters require 50,000
published occurrences and a peak at least 15% above its runner-up. A pinned
500-ID manifest replaces 13 held spellings with reviewed reserves. Usage is
not recognition review. `data/current-reviewed-candidates.json` adds 434 reviewed
facts from two authored works apiece. Recognition has 500 editorial accepts;
66 facts remain unresolved. Its numeric fields match the base pack.
`complete` remains
false. The historical 30-name sample is retained separately.

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
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Regenerate current source input without touching tracked files:

```sh
python3 tools/extract_current.py \
  --source fixtures/ssa-names-2026-10-07.zip \
  --selection fixtures/selection.json --output /tmp/c05-current.json
cmp fixtures/current-source.json /tmp/c05-current.json
```

The historical mirror covers 1880–2017; its sample analyzes 1880–2009 only.
It does not validate exact current counts, which SSA has revised. Tests cover
strict input/provenance, schemas, differential/property cases, repeatability,
partial decades, file preservation and semantic mutations. CI uses the same
immutable inputs. Runtime game logic is pure and offline, with no dependencies.
See SOURCES, VERIFY, CONFLICTS and NEXT for evidence and remaining checks.
