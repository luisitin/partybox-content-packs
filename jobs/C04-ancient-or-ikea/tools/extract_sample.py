"""Normalize thirty pinned museum metadata records; never fetch media or infer dates."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile

MANIFEST = Path(__file__).resolve().parents[1] / 'fixtures' / 'manifest.json'
MANIFEST_SHA256 = '92e9ddda40c268b99b62a05f0e76da48f56864ee55cb9e5fe5d27339fd46c8b8'
COOPER = 'Cooper Hewitt, Smithsonian Design Museum'
AIC = 'Art Institute of Chicago'


def same_file(first, second):
    return first.resolve() == second.resolve() or (
        first.exists() and second.exists() and os.path.samefile(first, second)
    )


def validate_output(output, inputs):
    if os.path.lexists(output) and not output.is_file():
        raise ValueError('Existing output must be a regular file')
    if any(same_file(source, output) for source in inputs):
        raise ValueError('Output must not replace any source record or manifest, including aliases')


def load_sources(directory, output):
    root = directory.resolve(strict=True)
    if not root.is_dir():
        raise ValueError('Source directory must be a directory')
    validate_output(output, [MANIFEST])
    manifest_bytes = MANIFEST.read_bytes()
    if hashlib.sha256(manifest_bytes).hexdigest() != MANIFEST_SHA256:
        raise ValueError('Source manifest SHA256 does not match the pinned selection')
    manifest = json.loads(manifest_bytes)
    if manifest['schemaVersion'] != 1 or manifest['recordCount'] != 30 or len(manifest['records']) != 30:
        raise ValueError('Manifest must contain exactly thirty pinned records')
    inputs = [MANIFEST]
    verified = []
    for record in manifest['records']:
        name = record['filename']
        if Path(name).name != name or not name.endswith('.json'):
            raise ValueError('Manifest source filenames must be JSON basenames')
        path = (root / name).resolve(strict=True)
        if not path.is_file() or not path.is_relative_to(root):
            raise ValueError('Each source must resolve to a regular file inside source-dir')
        inputs.append(path)
        content = path.read_bytes()
        if hashlib.sha256(content).hexdigest() != record['sha256']:
            raise ValueError(f'Source SHA256 mismatch: {name}')
        verified.append((record, content))
    validate_output(output, inputs)
    # All thirty raw hashes have passed before any museum record is parsed.
    return [(record, json.loads(content)) for record, content in verified], inputs


def normalize(record, data):
    if str(data['id']) != record['id']:
        raise ValueError('Raw source identity disagrees with its pinned manifest')
    if record['museum'] == COOPER:
        if not data.get('date'):
            raise ValueError('Pinned Cooper Hewitt record has no original date label')
        return {
            'museum': COOPER,
            'id': data['id'],
            'title': data['title'],
            'date_display': data['date'],
            'date_start': data.get('year_start'),
            'date_end': data.get('year_end'),
            'image_references': data.get('images') or [],
            'image_bytes_downloaded': False,
            'image_license': 'unverified; explicitly excluded from metadata CC0 grant',
            'metadata_license': 'CC0-1.0',
            'metadata_license_source': 'https://raw.githubusercontent.com/cooperhewitt/collection/4272b8fa73697845507ff40cafeb19310218c896/README.md',
            'source_url': record['url'],
            'source_sha256': record['sha256'],
            'snapshot_commit': '4272b8fa73697845507ff40cafeb19310218c896',
            'snapshot_committed_utc': '2017-02-22T19:19:37Z',
            'independent_facts_checked': False,
        }
    if record['museum'] == AIC:
        if type(data['date_start']) is not int or type(data['date_end']) is not int:
            raise ValueError('Pinned AIC record must have its original numeric date range')
        # AIC descriptions are deliberately excluded from this metadata export.
        return {
            'museum': AIC,
            'id': str(data['id']),
            'title': data['title'],
            'date_display': data['date_display'],
            'date_start': data['date_start'],
            'date_end': data['date_end'],
            'image_id': data['image_id'],
            'source_is_public_domain': data['is_public_domain'],
            'image_bytes_downloaded': False,
            'image_license': 'unverified exact media permission; artwork is tagged public domain in official snapshot',
            'metadata_license': 'CC0-1.0 (description deliberately omitted)',
            'metadata_license_source': 'https://raw.githubusercontent.com/art-institute-of-chicago/api-data/8936f25879fd688fc2412436e5df4e30402bd081/json/info.json',
            'source_url': record['url'],
            'source_sha256': record['sha256'],
            'snapshot_commit': '8936f25879fd688fc2412436e5df4e30402bd081',
            'data_snapshot_updated_utc': '2025-02-16T08:22:20Z',
            'source_record_timestamp': data.get('timestamp'),
            'independent_facts_checked': False,
        }
    raise ValueError('Unsupported museum in pinned manifest')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    staged = None
    try:
        records, inputs = load_sources(args.source_dir, args.output)
        rows = [normalize(record, data) for record, data in records]
        if len(rows) != 30 or len({(row['museum'], row['id']) for row in rows}) != 30:
            raise ValueError('Expected thirty distinct museum objects')
        if sum(row['date_start'] is None and row['date_end'] is None for row in rows) != 24:
            raise ValueError('The twenty-four unknown numeric date ranges must remain unknown')
        content = (json.dumps(rows, ensure_ascii=False, indent=2, allow_nan=False) + '\n').encode('utf-8')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(prefix='.c04-extract-', suffix='.tmp',
                                         dir=args.output.parent, delete=False) as temporary:
            temporary.write(content)
            staged = Path(temporary.name)
        validate_output(args.output, inputs)
        os.replace(staged, args.output)
        staged = None
    except Exception as error:
        parser.exit(1, f'Museum sample extraction failed: {error}\n')
    finally:
        if staged is not None:
            staged.unlink(missing_ok=True)
    print(json.dumps({'path': str(args.output), 'rows': len(rows),
        'cooper_hewitt': sum(row['museum'] == COOPER for row in rows),
        'aic': sum(row['museum'] == AIC for row in rows),
        'numeric_date_ranges': sum(type(row['date_start']) is int and type(row['date_end']) is int for row in rows),
        'image_bytes_downloaded': 0,
        'sha256': hashlib.sha256(content).hexdigest()}, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
