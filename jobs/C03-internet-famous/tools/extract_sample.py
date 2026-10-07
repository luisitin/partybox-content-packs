"""Regenerate the pinned June 2020 historical sample with no network calls."""
import argparse
import csv
import hashlib
import itertools
import json
import os
from pathlib import Path
import tempfile

SOURCE_SHA256 = 'f9bc4774dcd1f50ba36efd8ce69057bafab6035358726fece0cb5e660ad71f9f'


def validate_paths(source, output):
    source = source.resolve(strict=True)
    if not source.is_file():
        raise ValueError('Source must be a regular CSV file')
    if source == output.resolve() or (output.exists() and os.path.samefile(source, output)):
        raise ValueError('Source and output must be different files, including aliases')
    if os.path.lexists(output) and not output.is_file():
        raise ValueError('Existing output must be a regular file')
    return source


def verify_source(source):
    digest = hashlib.sha256()
    with source.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    if digest.hexdigest() != SOURCE_SHA256:
        raise ValueError('Source SHA256 does not match the pinned historical CSV')


TITLES = '''Donald_Trump
Avengers:_Endgame
Bible
Kobe_Bryant
Freddie_Mercury
Billie_Eilish
Chernobyl_disaster
Joker_(2019_film)
United_States
Elizabeth_II
Elon_Musk
Barack_Obama
Michael_Jordan
YouTube
Keanu_Reeves
Parasite_(2019_film)
India
Game_of_Thrones
The_Mandalorian
Joaquin_Phoenix
Star_Wars:_The_Rise_of_Skywalker
Cristiano_Ronaldo
Boris_Johnson
Elton_John
Dwayne_Johnson
TikTok
United_Kingdom
Facebook
Jason_Momoa
Scarlett_Johansson
World_War_II
Periodic_table
Google
Lady_Gaga
Michael_Jackson
Jennifer_Aniston
Money_Heist
Jeff_Bezos
Queen_Victoria
World_War_I
China
Ariana_Grande
Tom_Brady
Queen_(band)
Jennifer_Lopez
Clint_Eastwood
LeBron_James
Bradley_Cooper
Lionel_Messi
Darth_Vader
Stranger_Things
Canada
Judy_Garland
Chris_Hemsworth
Leonardo_DiCaprio
Joe_Biden
Taylor_Swift
Robert_Downey_Jr.
Brad_Pitt
Winston_Churchill
Australia
Mahatma_Gandhi
New_York_City
Coca-Cola
Arnold_Schwarzenegger
Tom_Cruise
Tom_Hanks
Star_Wars
Martin_Luther_King_Jr.
Bill_Gates
Bruce_Lee
Elvis_Presley
Justin_Bieber
Ryan_Reynolds
Steve_Jobs
Singapore
Sylvester_Stallone
Angelina_Jolie
John_F._Kennedy
Eminem
Abraham_Lincoln
Muhammad_Ali
Johnny_Depp'''.splitlines()


def build_sample(source):
    titles = TITLES
    daily = {title: [] for title in titles}
    with source.open(encoding='utf-8', newline='') as file:
        for row in csv.DictReader(file):
            if row['article'] in daily and row['date'].startswith('2020-06-'):
                number = float(row['pageviews'])
                if not number.is_integer() or number < 0:
                    raise ValueError(row)
                daily[row['article']].append({'date': row['date'], 'pageviews': int(number)})
    articles = []
    expected_days = {f'2020-06-{day:02d}' for day in range(1, 31)}
    for title in titles:
        records = sorted(daily[title], key=lambda row: row['date'])
        if len(records) != 30 or {row['date'] for row in records} != expected_days:
            continue
        articles.append({'article': title, 'pageviews': sum(row['pageviews'] for row in records), 'daily': records})
    candidates = []
    for left, right in itertools.combinations(articles, 2):
        low, high = sorted([left, right], key=lambda row: (row['pageviews'], row['article']))
        if low['pageviews'] and 1.2 <= high['pageviews'] / low['pageviews'] <= 3:
            candidates.append((abs(high['pageviews'] / low['pageviews'] - 1.6), low['article'], high['article'], low, high))
    candidates.sort(key=lambda row: row[:3])
    selected, used = [], set()
    for _, _, _, low, high in candidates:
        if low['article'] in used or high['article'] in used:
            continue
        selected.append({'id': f'historical-{len(selected)+1:02d}', 'a': low, 'b': high})
        used.update([low['article'], high['article']])
        if len(selected) == 30:
            break
    if len(selected) != 30:
        raise ValueError('Pinned source cannot provide the required 30 disjoint pairs')
    out = {
        'kind': 'historical-offline-pipeline-sample',
        'source_url': 'https://raw.githubusercontent.com/hyperprophet/wikipedia-pageviews-2020/e1d61b4935d863ea7a2c83d9b010e56e2ffc5438/wikipedia_pageviews.csv',
        'source_sha256': SOURCE_SHA256,
        'source_license': 'CC0-1.0',
        'project': 'en.wikipedia',
        'access': 'unrecorded-by-source',
        'agent': 'unrecorded-by-source',
        'period_start': '2020-06-01',
        'period_end': '2020-06-30',
        'current_month_verified': False,
        'independent_verification': 'not yet completed',
        'curation': '83 household-name candidates selected manually; 30 disjoint pairs closest to ratio 1.6 selected deterministically',
        'rows': selected,
    }
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Local copy of the pinned historical CSV')
    parser.add_argument('--output', type=Path, required=True, help='Generated historical sample JSON')
    args = parser.parse_args()
    staged = None
    try:
        source = validate_paths(args.source, args.output)
        verify_source(source)
        out = build_sample(source)
        content = (json.dumps(out, ensure_ascii=False, indent=2, allow_nan=False) + '\n').encode('utf-8')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(prefix='.c03-extract-', suffix='.tmp',
                                         dir=args.output.parent, delete=False) as temporary:
            temporary.write(content)
            staged = Path(temporary.name)
        validate_paths(args.source, args.output)
        os.replace(staged, args.output)
        staged = None
    except Exception as error:
        parser.exit(1, f'Historical sample extraction failed: {error}\n')
    finally:
        if staged is not None:
            staged.unlink(missing_ok=True)
    articles = {article['article'] for row in out['rows'] for article in (row['a'], row['b'])}
    print(json.dumps({
        'path': str(args.output), 'rows': len(out['rows']),
        'distinct_articles': len(articles),
        'daily_observations': sum(len(article['daily']) for row in out['rows'] for article in (row['a'], row['b'])),
        'sha256': hashlib.sha256(content).hexdigest(),
        'source_sha256': SOURCE_SHA256,
        'ratio_min': min(row['b']['pageviews'] / row['a']['pageviews'] for row in out['rows']),
        'ratio_max': max(row['b']['pageviews'] / row['a']['pageviews'] for row in out['rows']),
    }, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
