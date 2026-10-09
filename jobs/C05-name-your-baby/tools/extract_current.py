"""Deterministically extract the pinned editorial selection of 500 SSA names.

Build-time source extraction; no network requests. Example:
python3 tools/extract_current.py --source fixtures/ssa-names-2026-10-07.zip --selection fixtures/selection.json --output /tmp/c05-current-source.json
"""
from __future__ import annotations
import argparse, hashlib, json, os, re, tempfile, zipfile
from collections import defaultdict
from pathlib import Path

SOURCE_SHA256='cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724'
SOURCE_ROWS=2181032
FIXTURE_SHA256='fd96fecb43209ce8639bc47185c686fcc2157cdae052cbae3c10e582ce88b0e2'
SELECTION_SHA256='2d61d267cc4e711d3d3d09d5232ba22995447175bfad7dcd3f82118258b6fab2'
MAX_SAFE_INTEGER=9007199254740991
PLACEHOLDERS={'Baby','Babyboy','Babygirl','Unknown','Infant','Male','Female'}

def check_paths(source:Path,output:Path,label='Source'):
 resolved=source.resolve(strict=True)
 if not resolved.is_file():raise ValueError(f'{label} must be a regular file')
 if os.path.lexists(output) and not output.is_file():raise ValueError('Output must be a regular file')
 if resolved==output.resolve() or (output.exists() and os.path.samefile(resolved,output)):
  raise ValueError('Source and output must be different files, including aliases')
 return resolved

def parse_selection(value):
 if not isinstance(value,list) or len(value)!=500:
  raise ValueError('Selection must be an array of exactly 500 identities')
 identities=[];names=set();seen=set()
 for identity in value:
  if not isinstance(identity,str) or re.fullmatch(r'ssa:[FM]:[A-Za-z]{2,15}',identity) is None:
   raise ValueError('Selection identities must use exact ssa:category:name spelling')
  _,sex,name=identity.split(':')
  if identity in seen:raise ValueError('Duplicate selection identity')
  if name in names:raise ValueError('Selection requires 500 distinct name spellings')
  seen.add(identity);names.add(name);identities.append((name,sex))
 return identities

def read_selection(path:Path):
 content=path.read_bytes()
 if hashlib.sha256(content).hexdigest()!=SELECTION_SHA256:
  raise ValueError('Selection SHA256 disagrees with the pinned editorial manifest; no JSON decode attempted')
 return parse_selection(json.loads(content))

def records(archive):
 for year in range(1880,2026):
  seen=set();previous=None
  for line in archive.read(f'yob{year}.txt').decode('ascii').splitlines():
   parts=line.split(',')
   if len(parts)!=3:raise ValueError('Annual record must have exactly three columns')
   name,sex,text=parts
   if re.fullmatch(r'[A-Za-z]{2,15}',name) is None or sex not in ('F','M') or re.fullmatch(r'[1-9][0-9]*',text) is None:
    raise ValueError('Invalid published name/category/count fields')
   count=int(text)
   if not 5<=count<=MAX_SAFE_INTEGER:raise ValueError('Count must be a safe integer ≥5')
   key=(name,sex);order=(sex,-count,name)
   if key in seen:raise ValueError('Duplicate annual name/category')
   if previous is not None and order<previous:raise ValueError('Invalid annual category/count/name sort')
   seen.add(key);previous=order
   yield year,name,sex,count

def extract(source:Path,selection):
 if hashlib.sha256(source.read_bytes()).hexdigest()!=SOURCE_SHA256:
  raise ValueError('Archive SHA256 disagrees with current pinned source; no ZIP decode attempted')
 counts=defaultdict(lambda:[0]*15)
 with zipfile.ZipFile(source) as archive:
  names=archive.namelist()
  if len(names)!=147 or len(set(names))!=147 or set(names)!={f'yob{y}.txt' for y in range(1880,2026)}|{'NationalReadMe.pdf'}:
   raise ValueError('Expected exactly 146 annual files 1880–2025 and the national readme')
  if archive.testzip() is not None:raise ValueError('Archive CRC validation failed')
  rows=0
  for year,name,sex,count in records(archive):
   i=(year-1880)//10;series=counts[(name,sex)];series[i]+=count;rows+=1
   if series[i]>MAX_SAFE_INTEGER:raise ValueError('Published decade subtotal exceeds safe integer range')
  if rows!=SOURCE_ROWS:raise ValueError('Unexpected source annual record count')
  candidates=[]
  for (name,sex),series in counts.items():
   total=sum(series);order=sorted(series,reverse=True)
   if total>MAX_SAFE_INTEGER:raise ValueError('Published total exceeds safe integer range')
   if name not in PLACEHOLDERS and total>=50000 and order[0]*100>=order[1]*115:
    candidates.append((total,name,sex))
  candidates.sort(key=lambda r:(-r[0],r[1],r[2]))
  eligible={(name,sex):total for total,name,sex in candidates}
  if any(identity not in eligible for identity in selection):
   raise ValueError('Every selected identity must qualify against the complete published source')
  ranked=sorted(selection,key=lambda identity:(-eligible[identity],identity[0],identity[1]))
  if selection!=ranked:raise ValueError('Selection must follow published-total/name/category rank order')
  selected=set(selection)
  annual=[{'year':year,'name':name,'sex':sex,'count':count} for year,name,sex,count in records(archive) if (name,sex) in selected]
 annual.sort(key=lambda r:(r['year'],r['sex'],r['name']))
 if len(annual)!=64262:raise ValueError('Unexpected selected annual record count')
 return {'source':{'publisher':'US Social Security Administration','url':'https://www.ssa.gov/oact/babynames/names.zip','sha256':SOURCE_SHA256,'license':'CC0','snapshotDate':'2026-10-07','licenseDeclarationUrl':'https://www.ssa.gov/data/data.json','datasetIdentifier':'US-GOV-SSA-338','coverageStartYear':1880,'coverageEndYear':2025},'analysis':{'startYear':1880,'endYear':2025,'gridEndYear':2029},'annualCounts':annual,'curation':[]}

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--source',type=Path,required=True);parser.add_argument('--selection',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
 args=parser.parse_args();source=check_paths(args.source,args.output)
 selection_path=check_paths(args.selection,args.output,'Selection')
 selection=read_selection(selection_path)
 fixture=extract(source,selection)
 content=(json.dumps(fixture,sort_keys=True,indent=2,ensure_ascii=False,allow_nan=False)+'\n').encode()
 if hashlib.sha256(content).hexdigest()!=FIXTURE_SHA256:raise ValueError('Extracted fixture disagrees with the frozen official snapshot contract')
 if hashlib.sha256(source.read_bytes()).hexdigest()!=SOURCE_SHA256:raise ValueError('Source changed during extraction')
 if hashlib.sha256(selection_path.read_bytes()).hexdigest()!=SELECTION_SHA256:raise ValueError('Selection changed during extraction')
 args.output.parent.mkdir(exist_ok=True,parents=True)
 staged=None
 try:
  with tempfile.NamedTemporaryFile(prefix='.c05-current-extract-',suffix='.tmp',dir=args.output.parent,delete=False) as f:
   f.write(content);staged=Path(f.name)
  check_paths(source,args.output)
  check_paths(selection_path,args.output,'Selection')
  if hashlib.sha256(source.read_bytes()).hexdigest()!=SOURCE_SHA256:raise ValueError('Source changed before publication')
  if hashlib.sha256(selection_path.read_bytes()).hexdigest()!=SELECTION_SHA256:raise ValueError('Selection changed before publication')
  os.replace(staged,args.output);staged=None
 finally:
  if staged is not None:staged.unlink(missing_ok=True)
 print(json.dumps({'output':str(args.output),'sha256':hashlib.sha256(content).hexdigest(),'bytes':len(content),'selectionSha256':SELECTION_SHA256,'selectedNames':500,'selectedAnnualRecords':len(fixture['annualCounts']),'sourceAnnualRecords':SOURCE_ROWS,'coverage':[1880,2025]},sort_keys=True))

if __name__=='__main__':main()
