import argparse
import csv
import hashlib
import json
from pathlib import Path

names = '''Pierre Curie
Marie Curie, née Sklodowska
Theodore Roosevelt
Rudyard Kipling
Rabindranath Tagore
Max Karl Ernst Ludwig Planck
Thomas Woodrow Wilson
Albert Einstein
Niels Henrik David Bohr
Werner Karl Heisenberg
Erwin Schrödinger
Paul Adrien Maurice Dirac
Sir Alexander Fleming
Hermann Hesse
William Faulkner
Earl (Bertrand Arthur William) Russell
Sir Winston Leonard Spencer Churchill
Ernest Miller Hemingway
Albert Camus
John Steinbeck
James Dewey Watson
Jean-Paul Sartre
Martin Luther King Jr.
Richard P. Feynman
Bob Dylan
Mikhail Sergeyevich Gorbachev
Toni Morrison
Nelson Mandela
Barack H. Obama
Malala Yousafzai'''.splitlines()
parser = argparse.ArgumentParser(description='Extract the exact 30-biography historical fixture from an immutable source.')
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
source = args.source
if hashlib.sha256(source.read_bytes()).hexdigest() != '4a82ce9250e0f7fea1fa1df63f8bf793b053f61e13acc7536b66f65342af616a':
    raise ValueError('Historical Nobel source SHA256 mismatch')
if source.resolve() == args.output.resolve():
    raise ValueError('Source and output must differ')
with source.open() as file:
    reader = csv.DictReader(file)
    fieldnames = reader.fieldnames
    data = list(reader)
selected = []
for name in names:
    candidates = [row for row in data if row['full_name'] == name and row['laureate_type'] == 'Individual']
    assert candidates, name
    selected.append(min(candidates, key=lambda row: int(row['prize_year'])))
assert len(selected) == len({row['laureate_id'] for row in selected}) == 30
json_target = args.output
out = {
    'kind': 'historical-offline-pipeline-sample',
    'source_url': 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/78474f0d3496a1f855deeceb63e250f494cbe938/data/2019/2019-05-14/nobel_winners.csv',
    'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'source_repository_license': 'CC0-1.0',
    'upstream_provenance': 'Nobel Foundation laureates CSV via Kaggle; recorded in TidyTuesday source README',
    'upstream_license_independently_verified': False,
    'repository_sample_date': '2019-05-14',
    'max_prize_year': max(int(row['prize_year']) for row in data),
    'current_status_verified': False,
    'sitelinks_verified': False,
    'portrait_licenses_verified': False,
    'rows': [{
        'id': 'nobel-' + row['laureate_id'],
        'name': row['full_name'],
        'birth_date': row['birth_date'],
        'death_date': None if row['death_date'] == 'NA' else row['death_date'],
        'snapshot_status': 'no-death-recorded' if row['death_date'] == 'NA' else 'death-recorded',
        'current_status_verified': False,
        'prize_year': int(row['prize_year']),
        'prize_category': row['category'],
        'wikidata_id': None,
        'sitelinks_count': None,
        'portrait': None,
    } for row in selected],
}
json_target.parent.mkdir(parents=True, exist_ok=True)
json_target.write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'path': str(json_target), 'rows': len(selected), 'source_sha256': out['source_sha256'], 'sample_sha256': hashlib.sha256(json_target.read_bytes()).hexdigest(), 'recorded_dead': sum(row['death_date'] != 'NA' for row in selected), 'status_unknown_today': sum(row['death_date'] == 'NA' for row in selected)}, indent=2))
