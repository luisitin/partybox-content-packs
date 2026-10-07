# C05 Name Your Baby — historical sample

**Incomplete: current-source expansion, independent facts and editorial checks are in progress.**

Thirty names preserve their SSA sex category and thirteen complete decades from
1880–2009. Peak count means the largest decade sum of published annual counts
in that window. It is not an annual maximum, a share or a current lifetime peak.
The source mirror ends in 2017; its partial 2010s decade is excluded.

Sparkline cells count published years and omitted years separately. No published
row does not establish zero births. Recognition and fact verification are false;
short facts are null. Historical usage is an editorial candidate filter only.

From this folder with Node 24 and Python 3.12:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
python3 -m venv /tmp/c05-source-venv
/tmp/c05-source-venv/bin/python -m pip install -r tools/requirements-source.txt
curl --fail --location --output /tmp/c05-babynames.rda \
  'https://raw.githubusercontent.com/hadley/babynames/4391c25ea10b8b0589cdbab63067de3bc8b3a628/data/babynames.rda'
PARTYBOX_SOURCE_PYTHON=/tmp/c05-source-venv/bin/python \
  PARTYBOX_SOURCE_FILE=/tmp/c05-babynames.rda npm test
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Regenerate the source fixture from the checksum-pinned full mirror:

```sh
/tmp/c05-source-venv/bin/python tools/extract_sample.py \
  --source /tmp/c05-babynames.rda --output /tmp/c05-refresh.json
cmp fixtures/source.json /tmp/c05-refresh.json
```

The generator uses exact spelling/category, >=50,000 total reported occurrences,
a >=15% peak/runner-up gap, and descending usage to select 30 distinct names.
Tests exercise independent aggregation and selection over 10,000 cases each,
required seeds, schemas, repeat generation, file preservation and 25 mutations.
CI downloads the same pinned mirror; no fetching happens at play time.
See SOURCES, VERIFY, CONFLICTS and NEXT for evidence and limits.
