# C04 Ancient or IKEA — metadata pipeline sample

**Museum media access and image-specific licenses are blocked. This is incomplete.**

Thirty real object records contain titles and original date labels. Six have
structured year ranges; 24 retain unknown numeric bounds and centuries.
Metadata permission does not establish permission for referenced photographs.
Images and short facts remain null; original image patterns test the transform.

Run from `jobs/C04-ancient-or-ikea` with Node 24 and Python 3.12:

```sh
npm --cache=/workspace/.npm-cache ci --ignore-scripts
python3 -m venv .portrait-venv
.portrait-venv/bin/python -m pip --cache-dir /workspace/.pip-cache install -r tools/requirements-source.txt
PARTYBOX_PORTRAIT_PYTHON=.portrait-venv/bin/python npm test
npm run generate:sample
sha256sum --check SHA256SUMS.txt
```

Tests cover two independent century-range implementations, 10,000 inputs,
seeds 1–3 and 1,000 saved random seeds, source/schema/provenance validation,
byte-identical builds, CLI preservation and 25 one-at-a-time mutations.
The image tests use original patterns, enforce <=512 pixels and <40,000 bytes,
and preserve alpha, aspect and caller-supplied attribution. Compatible embedded
ICC profiles are converted to sRGB before metadata is removed.

Regenerate from pinned raw metadata cached outside the public repository:

```sh
python3 tools/extract_sample.py \
  --source-dir /workspace/.partybox-source-cache/c04 \
  --output /tmp/c04-refresh.json
cmp fixtures/source.json /tmp/c04-refresh.json
```

SOURCES records exact source URLs, hashes, metadata permissions and limits.
VERIFY records measured checks; NEXT and BLOCKED describe missing full content.
