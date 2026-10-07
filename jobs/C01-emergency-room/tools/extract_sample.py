"""Extract a deterministic historical NEISS fixture, never annual estimates."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import urllib.request

import pandas as pd
import pyreadr

COMMIT = '09ed9eba12e10732efb83ef82b4213a020521cc5'
BASE = f'https://raw.githubusercontent.com/hadley/neiss/{COMMIT}/'
EXPECTED_SHA256 = {
    'injuries': '5e903769575e4d3ec5a2b6298cea22414d0a0216f4527a1428b2876cc81a142f',
    'products': 'c028c506eaca1bb9a9bcc459594b37970d466f00601822e84cfc48e1c947eef2',
}
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--injuries', type=Path, help='Existing pinned injuries.rda path')
parser.add_argument('--products', type=Path, help='Existing pinned products.rda path')
parser.add_argument('--output-dir', type=Path, required=True)
parser.add_argument('--download', action='store_true', help='Download any missing source via normal verified HTTPS')
parser.add_argument('--cache-dir', type=Path, help='Download location; defaults to OUTPUT_DIR/source-cache')
args = parser.parse_args()
ROOT = args.output_dir
ROOT.mkdir(parents=True, exist_ok=True)
cache_dir = args.cache_dir or ROOT / 'source-cache'

def source_path(kind, supplied):
    path = supplied or cache_dir / f'{kind}.rda'
    if not path.exists():
        if not args.download:
            parser.error(f'Missing {kind} source {path}; provide its path or use --download')
        path.parent.mkdir(parents=True, exist_ok=True)
        # Default urllib HTTPS retains certificate checks and configured proxy.
        urllib.request.urlretrieve(BASE + f'data/{kind}.rda', str(path))
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != EXPECTED_SHA256[kind]:
        raise ValueError(f'SHA256 mismatch for {kind}: expected {EXPECTED_SHA256[kind]}, got {actual}')
    return path

injury_path = source_path('injuries', args.injuries)
product_path = source_path('products', args.products)
injuries = pyreadr.read_r(str(injury_path))['injuries']
products = pyreadr.read_r(str(product_path))['products']
lookup = {int(row.code): str(row.title) for row in products.itertuples(index=False)}
historical = injuries.loc[pd.to_datetime(injuries['trmt_date']).dt.year.eq(2017)]
historical = historical.sort_values('case_num', kind='stable')

# Keep three real cases for each of the first thirty distinct recognized,
# single-product codes encountered in treatment-year 2017 case-id order.
selected_codes = []
counts = {}
selected = []
audit_rows = []
for row in historical.itertuples(index=False):
    first = None if pd.isna(row.prod1) else int(row.prod1)
    second = None if pd.isna(row.prod2) else int(row.prod2)
    if first not in lookup or first == 0 or second not in (None, 0):
        continue
    if first not in counts:
        if len(selected_codes) == 30:
            continue
        selected_codes.append(first)
        counts[first] = 0
    if counts[first] == 3:
        continue
    weight = float(row.weight)
    if not math.isfinite(weight) or weight <= 0:
        raise ValueError(f'Invalid source weight for {row.case_num}')
    selected.append({'caseId': str(row.case_num), 'products': [first], 'weight': weight})
    audit_rows.append({
        'caseId': str(row.case_num),
        'trmt_date': pd.Timestamp(row.trmt_date).date().isoformat(),
        'prod1': first,
        'prod2': None if second is None else second,
        'weight': weight,
        'productTitle': lookup[first],
    })
    counts[first] += 1
    if len(selected_codes) == 30 and all(count == 3 for count in counts.values()):
        break

assert len(selected_codes) == 30
assert len(selected) == 90
assert len({row['caseId'] for row in selected}) == 90
assert set(counts.values()) == {3}
assert all(row['trmt_date'].startswith('2017-') for row in audit_rows)
fixture = {
    'mode': 'historical-sample',
    'sourceYear': 2017,
    'requestedYear': 2025,
    'source': BASE + 'data/injuries.rda',
    'injuries': sorted(selected, key=lambda row: row['caseId']),
    'products': [{'code': code, 'label': lookup[code]} for code in sorted(selected_codes)],
}

def write_json(name, content):
    path = ROOT / name
    path.write_text(json.dumps(content, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    return {'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

fixture_result = write_json('historical-sample-2017.json', fixture)
audit_result = write_json('historical-sample-2017-audit.json', audit_rows)
metadata = {
    'mode': 'historical-sample',
    'sourceYear': 2017,
    'requestedYear': 2025,
    'nationalEstimate': None,
    'purpose': 'Offline end-to-end pipeline demonstration using historical real records only.',
    'sampling': 'Sort 2017 treatment-year cases by case_num; select first 30 distinct product codes with lookup titles and only one nonzero product; retain first 3 matching cases for each selected code.',
    'injuryCount': len(selected),
    'distinctProductCount': len(selected_codes),
    'casesPerProduct': 3,
    'sourceInjuryCount': len(injuries),
    'source2017InjuryCount': len(historical),
    'sourceProductLookupCount': len(products),
    'sourceCommit': COMMIT,
    'licenseDeclaration': 'CC0 in pinned hadley/neiss DESCRIPTION; primary facts originate from CPSC NEISS.',
    'sources': [
        {'url': BASE + 'data/injuries.rda', 'path': str(injury_path), 'bytes': injury_path.stat().st_size, 'sha256': hashlib.sha256(injury_path.read_bytes()).hexdigest()},
        {'url': BASE + 'data/products.rda', 'path': str(product_path), 'bytes': product_path.stat().st_size, 'sha256': hashlib.sha256(product_path.read_bytes()).hexdigest()},
        {'url': BASE + 'DESCRIPTION', 'use': 'Observed CC0 license declaration'},
    ],
    'outputs': [fixture_result, audit_result],
    'limitations': [
        'These are 90 selected real 2017 cases, not the full-year dataset and not a probability sample for national estimation.',
        'Sums of the retained weights are partial weighted sample totals only; nationalEstimate must remain null.',
        'The fixture is not 2025 data and cannot answer last-year injury totals.',
        'Product labels are byte-for-byte source title strings, including any source truncation or awkward wording.',
        'The actual source product lookup has code and title only; no current/deleted field is inferred.',
        'No narratives, demographics or other personal information are exported.',
        'The product lookup, mirrored manual and injury records share CPSC provenance and are not independent corroboration of estimates.',
    ],
    'extractionCommand': 'python extract_sample.py --injuries /path/to/injuries.rda --products /path/to/products.rda --output-dir /path/to/output',
    'pyreadrVersion': pyreadr.__version__,
    'pandasVersion': pd.__version__,
    'numpyVersion': __import__('numpy').__version__,
}
write_json('sample-metadata.json', metadata)
print(json.dumps({'fixture': fixture_result, 'audit': audit_result, 'injuryCount': len(selected), 'distinctProductCount': len(selected_codes), 'source2017InjuryCount': len(historical)}))
