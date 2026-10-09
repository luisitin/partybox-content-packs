import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const job = resolve(process.cwd());
const tool = join(job, 'tools/extract_sample.py');
const source = process.env.PARTYBOX_SOURCE_FILE ?? '/workspace/.partybox-source-cache/c05/c05-babynames.rda';
const python = process.env.PARTYBOX_SOURCE_PYTHON ?? 'python3';
const sourceBytes = readFileSync(source); // A missing source fails this suite; it never skips.
const sourceSha = '1d5c601fa3c5177f4d9edb4c8c2f08fddc8d9bf04372b8a40dc6aecf92bfa324';
const fixtureSha = 'c6bbc9a8e924cae38b51d8cd1c46644d5631370b1bf75cee327bb7ce33b1a664';
const sha = (content: Buffer): string => createHash('sha256').update(content).digest('hex');
const commands: unknown[] = [];

function execute(argv: string[], timeout: number) {
  const startedAtUtc = new Date().toISOString();
  const started = performance.now();
  const result = spawnSync(python, argv, {
    cwd: job, encoding: 'utf8', timeout, maxBuffer: 2 * 1024 * 1024,
  });
  commands.push({ argv: [python, ...argv], cwd: job, startedAtUtc,
    durationMilliseconds: performance.now() - started, exitCode: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: result.stdout, stderr: result.stderr });
  if (process.env.PARTYBOX_SOURCE_EVIDENCE) {
    writeFileSync(process.env.PARTYBOX_SOURCE_EVIDENCE, JSON.stringify(commands, null, 2) + '\n');
  }
  return result;
}

function invoke(args: string[], withoutSitePackages = false) {
  const result = execute([...(withoutSitePackages ? ['-S'] : []), tool, ...args], 120_000);
  assert.equal(result.error, undefined, `Python execution failed: ${String(result.error)}`);
  assert.equal(result.signal, null, `Python was terminated: ${String(result.signal)}`);
  return result;
}

function failure(args: string[], message: RegExp, withoutSitePackages = false): void {
  const result = invoke(args, withoutSitePackages);
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, message);
}

function temporary(body: (directory: string) => void): void {
  const directory = mkdtempSync(join(tmpdir(), 'partybox-c05-source-'));
  try { body(directory); }
  finally { rmSync(directory, { recursive: true, force: true }); }
  assert.deepEqual(readFileSync(source), sourceBytes, 'Pinned RDA was altered');
}

test('source extractor performs two uncached full-RDA regenerations identical to the fixture', { timeout: 240_000 }, () => {
  assert.equal(sha(sourceBytes), sourceSha);
  temporary(directory => {
    const fixture = readFileSync(join(job, 'fixtures/source.json'));
    assert.equal(sha(fixture), fixtureSha);
    const outputs = ['first.json', 'second.json'].map(name => join(directory, name));
    for (const output of outputs) {
      const result = invoke(['--source', source, '--output', output]);
      assert.equal(result.status, 0, result.stderr);
      const report = JSON.parse(result.stdout) as Record<string, unknown>;
      assert.equal(report.sourceRows, 1_924_665);
      assert.equal(report.selectedNames, 30);
      assert.equal(report.annualCounts, 3707);
      assert.equal(report.omittedAnnualCells, 193);
      assert.equal(report.sha256, fixtureSha);
      assert.deepEqual(readFileSync(output), fixture);
    }
    assert.deepEqual(readFileSync(outputs[0]!), readFileSync(outputs[1]!));
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-extract-')), false);
  });
});

test('corrupt and truncated RDA bytes fail the pinned hash before decoder imports and preserve output', () => {
  temporary(directory => {
    const output = join(directory, 'existing.json');
    const sentinel = Buffer.from('existing output survives\n');
    writeFileSync(output, sentinel);
    const altered = Buffer.from(sourceBytes); altered[0] = altered[0]! ^ 1;
    for (const [name, bytes] of [['altered.rda', altered], ['truncated.rda', sourceBytes.subarray(0, 100)]] as const) {
      const path = join(directory, name); writeFileSync(path, bytes);
      failure(['--source', path, '--output', output], /Source SHA256.*no decoding attempted/, true);
      assert.deepEqual(readFileSync(output), sentinel);
      assert.deepEqual(readFileSync(path), bytes);
    }
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-extract-')), false);
  });
});

test('source/output exact, normalized, symlink and hardlink aliases are rejected without changing files', () => {
  temporary(directory => {
    const input = join(directory, 'input.rda'); copyFileSync(source, input);
    const child = join(directory, 'child'); mkdirSync(child);
    const symlink = join(directory, 'alias-symlink.rda'); symlinkSync(input, symlink);
    const hardlink = join(directory, 'alias-hardlink.rda'); linkSync(input, hardlink);
    for (const output of [input, `${child}/../input.rda`, symlink, hardlink]) {
      failure(['--source', input, '--output', output], /different files, including aliases/);
      assert.deepEqual(readFileSync(input), sourceBytes);
      assert.deepEqual(readFileSync(output), sourceBytes);
    }
    failure(['--source', symlink, '--output', input], /different files, including aliases/);
    failure(['--source', hardlink, '--output', input], /different files, including aliases/);
    assert.deepEqual(readFileSync(input), sourceBytes);
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-extract-')), false);
  });
});

test('missing inputs, source/output directories and malformed options preserve existing destinations', () => {
  temporary(directory => {
    const output = join(directory, 'existing.json');
    const sentinel = Buffer.from('existing output survives\n'); writeFileSync(output, sentinel);
    const inputDirectory = join(directory, 'source-directory'); mkdirSync(inputDirectory);
    const destinationDirectory = join(directory, 'destination-directory'); mkdirSync(destinationDirectory);
    failure(['--source', join(directory, 'missing.rda'), '--output', output], /No such file or directory/);
    failure(['--source', inputDirectory, '--output', output], /Source must be a regular file/);
    failure(['--source', source, '--output', destinationDirectory], /Existing output must be a regular file/);
    failure(['--source', source, '--output', output, '--wrong-name'], /unrecognized arguments/);
    failure(['--source', source], /required: --output/);
    failure(['--output', output], /required: --source/);
    assert.deepEqual(readFileSync(output), sentinel);
    assert.equal(statSync(destinationDirectory).isDirectory(), true);
    assert.deepEqual(readdirSync(destinationDirectory), []);
    assert.equal(existsSync(join(directory, 'missing.rda')), false);
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-extract-')), false);
  });
});

const decoderBoundaryChecks = String.raw`
import json, runpy, sys
import numpy as np
import pandas as pd
import pyreadr
module = runpy.run_path(sys.argv[1])
validate = module['validate_frame']
base = pd.DataFrame({'year': np.arange(1880, 2018, dtype=float), 'sex': ['F'] * 138,
                     'name': ['Anna'] * 138, 'n': [5] * 138, 'prop': [0.1] * 138})
# Synthetic decoder-boundary unit fixtures, not altered-RDA CLI verification.
validate.__globals__['SOURCE_ROWS'] = len(base)
assert validate(base) is base
cases = []
def mutation(label, column, value, error):
    frame = base.copy()
    frame[column] = frame[column].astype(object)
    frame.loc[0, column] = value
    if column in ('year', 'n') and not isinstance(value, (str, bool)):
        frame[column] = pd.to_numeric(frame[column], errors='raise')
    cases.append((label, frame, error))
for value in (1880.5, float('nan'), float('inf'), float('-inf'), 1879, 2018, '1880', True, 1880+1j):
    mutation('invalid-year-'+repr(value), 'year', value, 'Source year')
for value in (5.9, float('nan'), float('inf'), float('-inf'), 4, 9007199254740992, '5', True, 5+1j):
    mutation('invalid-count-'+repr(value), 'n', value, 'Source n')
for value in ('', 'Anna1', 'Anna Smith', 'Éva', 'A'*41, 123, None):
    mutation('invalid-name-'+repr(value), 'name', value, 'Source name')
for value in ('X', 'female', 1, None):
    mutation('invalid-sex-'+repr(value), 'sex', value, 'Source sex')
bad_columns = base.drop(columns=['n']); cases.append(('missing-column', bad_columns, 'five source columns'))
cases.append(('not-a-dataframe', None, 'five source columns'))
cases.append(('wrong-source-row-count', base.iloc[:-1], 'exactly 138 rows'))
duplicate = base.copy(); duplicate.loc[137, 'year'] = 1880; cases.append(('duplicate-key', duplicate, 'Duplicate source'))
excluded_bad = base.copy(); excluded_bad.loc[137, 'name'] = 'Bad-Name'; cases.append(('bad-name-in-excluded2017', excluded_bad, 'Source name'))
interior = base.copy(); interior.loc[40, 'year'] = 1921; interior.loc[40, 'name'] = 'Beth'; cases.append(('missing-interior-year', interior, 'every calendar year'))
for label, frame, error in cases:
    try: validate(frame)
    except ValueError as exc:
        assert error in str(exc), (label, str(exc))
    else: raise AssertionError('Accepted invalid decoder fixture: '+label)
for objects in ({}, {'wrong_name': base}, {'babynames': base, 'extra': base}):
    pyreadr.read_r = lambda path, objects=objects: objects
    try: module['load_verified_frame'](__import__('pathlib').Path(sys.argv[2]))
    except ValueError as exc: assert 'exactly the babynames object' in str(exc)
    else: raise AssertionError('Accepted invalid RDA object collection')
print(json.dumps({'syntheticDecoderCases': len(cases)+3, 'passed': len(cases)+3, 'actualMalformedRdaDecoded': False}))
`;

test('isolated decoder-boundary fixtures reject invalid values before integer conversion or historical filtering', () => {
  const result = execute(['-c', decoderBoundaryChecks, tool, source], 30_000);
  assert.equal(result.error, undefined, String(result.error));
  assert.equal(result.signal, null);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { syntheticDecoderCases: number; passed: number; actualMalformedRdaDecoded: boolean };
  assert.equal(report.syntheticDecoderCases, 38);
  assert.equal(report.passed, 38);
  assert.equal(report.actualMalformedRdaDecoded, false);
  assert.deepEqual(readFileSync(source), sourceBytes);
});
