"""Extract thirty historical name categories from a SHA-pinned SSA-derived RDA."""
from __future__ import annotations

import argparse
from collections import defaultdict
import hashlib
import json
import os
from pathlib import Path
import tempfile

SOURCE_SHA256 = '1d5c601fa3c5177f4d9edb4c8c2f08fddc8d9bf04372b8a40dc6aecf92bfa324'
SOURCE_COMMIT = '4391c25ea10b8b0589cdbab63067de3bc8b3a628'
SOURCE_URL = f'https://raw.githubusercontent.com/hadley/babynames/{SOURCE_COMMIT}/data/babynames.rda'
MAX_SAFE_INTEGER = 9_007_199_254_740_991
START_YEAR = 1880
END_YEAR = 2009
SOURCE_END_YEAR = 2017
SOURCE_ROWS = 1_924_665
FIXTURE_SHA256 = 'c6bbc9a8e924cae38b51d8cd1c46644d5631370b1bf75cee327bb7ce33b1a664'


def same_file(first: Path, second: Path) -> bool:
    return first.resolve() == second.resolve() or (
        first.exists() and second.exists() and os.path.samefile(first, second)
    )


def validate_paths(source: Path, output: Path, original: Path | None = None) -> Path:
    resolved = source.resolve(strict=True)
    if not resolved.is_file():
        raise ValueError('Source must be a regular file')
    if os.path.lexists(output) and not output.is_file():
        raise ValueError('Existing output must be a regular file')
    if same_file(source, output) or (original is not None and same_file(original, output)):
        raise ValueError('Source and output must be different files, including aliases')
    return resolved


def validate_frame(frame):
    # Imported only after the CLI has checked source bytes against the pinned SHA.
    import numpy as np
    import pandas as pd
    from pandas.api.types import is_bool_dtype, is_numeric_dtype

    if not isinstance(frame, pd.DataFrame) or list(frame.columns) != ['year', 'sex', 'name', 'n', 'prop']:
        raise ValueError('RDA babynames must have the expected five source columns')
    for column, low, high in (('year', START_YEAR, SOURCE_END_YEAR), ('n', 5, MAX_SAFE_INTEGER)):
        values = frame[column].to_numpy()
        if (is_bool_dtype(frame[column].dtype) or not is_numeric_dtype(frame[column].dtype)
                or np.iscomplexobj(values)):
            raise ValueError(f'Source {column} must be numeric integers without coercion')
        if (not np.isfinite(values).all() or not (values == np.floor(values)).all()
                or (values < low).any() or (values > high).any()):
            raise ValueError(f'Source {column} must contain finite safe integers in range {low}..{high}')
    if not frame['sex'].map(lambda value: isinstance(value, str) and value in ('F', 'M')).all():
        raise ValueError('Source sex must be exactly F or M')
    if (not frame['name'].map(lambda value: isinstance(value, str)).all()
            or not frame['name'].str.fullmatch(r'[A-Za-z]{1,40}', na=False).all()):
        raise ValueError('Source name must contain 1..40 ASCII letters without coercion')
    if frame.duplicated(['year', 'sex', 'name']).any():
        raise ValueError('Duplicate source (year, sex, name) key')
    if len(frame) != SOURCE_ROWS:
        raise ValueError(f'Pinned source must contain exactly {SOURCE_ROWS} rows')
    years = np.unique(frame['year'].to_numpy())
    if not np.array_equal(years, np.arange(START_YEAR, SOURCE_END_YEAR + 1)):
        raise ValueError('Pinned source must contain every calendar year 1880..2017')
    return frame


def load_verified_frame(path: Path):
    if hashlib.sha256(path.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError('Source SHA256 does not match the pinned RDA; no decoding attempted')
    import pyreadr

    decoded = pyreadr.read_r(str(path))
    if set(decoded) != {'babynames'}:
        raise ValueError('Pinned RDA must contain exactly the babynames object')
    return validate_frame(decoded['babynames'])


def extract(frame):
    historical = frame.loc[frame['year'] <= END_YEAR, ['year', 'sex', 'name', 'n']]
    counts = defaultdict(lambda: [0] * 13)
    for year, sex, name, count in historical.itertuples(index=False, name=None):
        # Validation precedes these exact conversions; fractional/string/bool values fail.
        year, count = int(year), int(count)
        bucket = (year - START_YEAR) // 10
        updated = counts[(name, sex)][bucket] + count
        if updated > MAX_SAFE_INTEGER:
            raise ValueError('Published decade sum exceeds the safe integer limit')
        counts[(name, sex)][bucket] = updated
    candidates = []
    for (name, sex), series in counts.items():
        total = sum(series)
        if total > MAX_SAFE_INTEGER:
            raise ValueError('Published name total exceeds the safe integer limit')
        ordered = sorted(series, reverse=True)
        if total >= 50_000 and ordered[0] * 100 >= ordered[1] * 115:
            candidates.append((total, name, sex))
    candidates.sort(key=lambda row: (-row[0], row[1], row[2]))
    selected = set()
    selected_names = set()
    for _, name, sex in candidates:
        if name in selected_names:
            continue
        selected_names.add(name)
        selected.add((name, sex))
        if len(selected) == 30:
            break
    if len(selected) != 30:
        raise ValueError('Expected thirty distinct clear-peak qualifying names')
    annual = [
        {'year': int(year), 'sex': sex, 'name': name, 'count': int(count)}
        for year, sex, name, count in historical.itertuples(index=False, name=None)
        if (name, sex) in selected
    ]
    annual.sort(key=lambda row: (row['year'], row['sex'], row['name']))
    if len(annual) != 3707 or {row['year'] for row in annual} != set(range(START_YEAR, END_YEAR + 1)):
        raise ValueError('Expected 3707 selected annual records covering all 130 analysis years')
    return {
        'source': {
            'publisher': 'hadley/babynames', 'url': SOURCE_URL, 'commit': SOURCE_COMMIT,
            'sha256': SOURCE_SHA256, 'license': 'CC0',
            'coverageStartYear': START_YEAR, 'coverageEndYear': SOURCE_END_YEAR,
        },
        'analysis': {'startYear': START_YEAR, 'endYear': END_YEAR},
        'annualCounts': annual,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    staged = None
    try:
        original = validate_paths(args.source, args.output)
        frame = load_verified_frame(original)
        fixture = extract(frame)
        content = (json.dumps(fixture, ensure_ascii=False, sort_keys=True, indent=2,
                              allow_nan=False) + '\n').encode('utf-8')
        digest = hashlib.sha256(content).hexdigest()
        if digest != FIXTURE_SHA256:
            raise ValueError('Regenerated fixture SHA256 disagrees with the fixed historical contract')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(prefix='.c05-extract-', suffix='.tmp',
                                         dir=args.output.parent, delete=False) as temporary:
            temporary.write(content)
            staged = Path(temporary.name)
        validate_paths(args.source, args.output, original)
        if hashlib.sha256(original.read_bytes()).hexdigest() != SOURCE_SHA256:
            raise ValueError('Source changed during extraction; refusing to write output')
        os.replace(staged, args.output)
        staged = None
    except Exception as error:
        parser.exit(1, f'Name sample extraction failed: {error}\n')
    finally:
        if staged is not None:
            staged.unlink(missing_ok=True)
    print(json.dumps({'sourceRows': len(frame), 'sourceCoverage': [START_YEAR, SOURCE_END_YEAR],
        'analysisCoverage': [START_YEAR, END_YEAR], 'selectedNames': 30,
        'annualCounts': len(fixture['annualCounts']), 'omittedAnnualCells': 193,
        'path': str(args.output), 'sha256': digest}, sort_keys=True))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
