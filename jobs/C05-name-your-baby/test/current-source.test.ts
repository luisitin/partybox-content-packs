import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const job = resolve(process.cwd());
const tool = join(job, 'tools/extract_current.py');
const source = join(job, 'fixtures/ssa-names-2026-10-07.zip');
const python = process.env.PARTYBOX_SOURCE_PYTHON ?? 'python3';
const sourceBytes = readFileSync(source); // Missing pinned input is an error, never a skipped test.
const sourceSha = 'cd78e975ed7bb358e018dd62fbe14ced89295e9581c49172ca4eedcb011b3724';
const fixtureSha = '8dd80f3f6dc38705be47541fb994d073270ffe4d861732471c0c339e385905e9';
const sha = (bytes: Buffer): string => createHash('sha256').update(bytes).digest('hex');
const commands: unknown[] = [];

function execute(argv: string[], timeout = 120_000) {
  const startedAtUtc = new Date().toISOString();
  const started = performance.now();
  const result = spawnSync(python, ['-B', ...argv], {
    cwd: job, encoding: 'utf8', timeout, maxBuffer: 2 * 1024 * 1024,
  });
  commands.push({ argv: [python, '-B', ...argv], cwd: job, startedAtUtc,
    durationMilliseconds: performance.now() - started, exitCode: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: result.stdout, stderr: result.stderr });
  if (process.env.PARTYBOX_CURRENT_SOURCE_EVIDENCE) {
    writeFileSync(process.env.PARTYBOX_CURRENT_SOURCE_EVIDENCE, JSON.stringify(commands, null, 2) + '\n');
  }
  assert.equal(result.error, undefined, `Python failed: ${String(result.error)}`);
  assert.equal(result.signal, null, `Python was terminated: ${String(result.signal)}`);
  return result;
}

function invoke(args: string[], withoutSitePackages = false) {
  return execute([...(withoutSitePackages ? ['-S'] : []), tool, ...args]);
}

function failure(args: string[], message: RegExp, withoutSitePackages = false): void {
  const result = invoke(args, withoutSitePackages);
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, message);
}

function temporary(body: (directory: string) => void): void {
  const directory = mkdtempSync(join(tmpdir(), 'partybox-c05-current-source-'));
  try { body(directory); }
  finally { rmSync(directory, { recursive: true, force: true }); }
  assert.deepEqual(readFileSync(source), sourceBytes, 'Official ZIP was altered');
}

test('official extractor performs two uncached full-ZIP regenerations identical to the frozen fixture', { timeout: 240_000 }, () => {
  assert.equal(sha(sourceBytes), sourceSha);
  temporary(directory => {
    const fixture = readFileSync(join(job, 'fixtures/current-source.json'));
    assert.equal(sha(fixture), fixtureSha);
    const outputs = ['first.json', 'second.json'].map(name => join(directory, name));
    for (const output of outputs) {
      const result = invoke(['--source', source, '--output', output]);
      assert.equal(result.status, 0, result.stderr);
      const report = JSON.parse(result.stdout) as Record<string, unknown>;
      assert.equal(report.sourceAnnualRecords, 2_181_032);
      assert.equal(report.selectedNames, 500);
      assert.equal(report.selectedAnnualRecords, 63_643);
      assert.deepEqual(report.coverage, [1880, 2025]);
      assert.equal(report.sha256, fixtureSha);
      assert.deepEqual(readFileSync(output), fixture);
    }
    assert.deepEqual(readFileSync(outputs[0]!), readFileSync(outputs[1]!));
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-current-extract-')), false);
  });
});

test('corrupt and truncated official bytes fail the pinned hash before ZIP decode and preserve destinations', () => {
  temporary(directory => {
    const output = join(directory, 'existing.json');
    const sentinel = Buffer.from('existing output survives\n');
    writeFileSync(output, sentinel);
    const altered = Buffer.from(sourceBytes); altered[0] = altered[0]! ^ 1;
    for (const [name, bytes] of [['altered.zip', altered], ['truncated.zip', sourceBytes.subarray(0, 100)]] as const) {
      const input = join(directory, name); writeFileSync(input, bytes);
      failure(['--source', input, '--output', output], /Archive SHA256.*no ZIP decode attempted/, true);
      assert.deepEqual(readFileSync(output), sentinel);
      assert.deepEqual(readFileSync(input), bytes);
    }
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-current-extract-')), false);
  });
});

test('official source/output direct, normalized, symlink and hardlink aliases are rejected before writing', () => {
  temporary(directory => {
    const input = join(directory, 'input.zip'); copyFileSync(source, input);
    const child = join(directory, 'child'); mkdirSync(child);
    const symbolic = join(directory, 'alias-symlink.zip'); symlinkSync(input, symbolic);
    const hard = join(directory, 'alias-hardlink.zip'); linkSync(input, hard);
    for (const output of [input, `${child}/../input.zip`, symbolic, hard]) {
      failure(['--source', input, '--output', output], /different files, including aliases/);
      assert.deepEqual(readFileSync(input), sourceBytes);
      assert.deepEqual(readFileSync(output), sourceBytes);
    }
    failure(['--source', symbolic, '--output', input], /different files, including aliases/);
    failure(['--source', hard, '--output', input], /different files, including aliases/);
    assert.deepEqual(readFileSync(input), sourceBytes);
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-current-extract-')), false);
  });
});

test('missing inputs, directories, dangling destination links and malformed options preserve existing files', () => {
  temporary(directory => {
    const output = join(directory, 'existing.json');
    const sentinel = Buffer.from('existing output survives\n'); writeFileSync(output, sentinel);
    const inputDirectory = join(directory, 'source-directory'); mkdirSync(inputDirectory);
    const destinationDirectory = join(directory, 'destination-directory'); mkdirSync(destinationDirectory);
    const missingTarget = join(directory, 'uncreated.json');
    const dangling = join(directory, 'dangling.json'); symlinkSync(missingTarget, dangling);
    failure(['--source', join(directory, 'missing.zip'), '--output', output], /No such file or directory/);
    failure(['--source', inputDirectory, '--output', output], /Source must be a regular file/);
    failure(['--source', source, '--output', destinationDirectory], /Output must be a regular file/);
    failure(['--source', source, '--output', dangling], /Output must be a regular file/);
    failure(['--source', source, '--output', output, '--wrong-name'], /unrecognized arguments/);
    failure(['--source', source], /required: --output/);
    failure(['--output', output], /required: --source/);
    assert.deepEqual(readFileSync(output), sentinel);
    assert.deepEqual(readdirSync(destinationDirectory), []);
    assert.equal(existsSync(missingTarget), false);
    assert.equal(readdirSync(directory).some(name => name.startsWith('.c05-current-extract-')), false);
  });
});

const annualBoundaryChecks = String.raw`
import json, runpy, sys
module = runpy.run_path(sys.argv[1])
records = module['records']
class SyntheticArchive:
    def __init__(self, replacement=None, year=1880):
        self.replacement = replacement
        self.year = year
    def read(self, filename):
        assert filename.startswith('yob') and filename.endswith('.txt')
        year = int(filename[3:-4])
        assert 1880 <= year <= 2025
        if year == self.year and self.replacement is not None:
            return self.replacement
        return b'Anna,F,5\n'
base = list(records(SyntheticArchive()))
assert len(base) == 146
assert base[0] == (1880, 'Anna', 'F', 5)
assert base[-1] == (2025, 'Anna', 'F', 5)
# These exercise the annual-record decoder directly. No synthetic archive bypasses
# the immutable SHA guard of the public extractor CLI.
valid = b'Aa,F,9007199254740991\nAnna,F,5\nBb,M,5\n'
boundary = list(records(SyntheticArchive(valid)))
assert boundary[0] == (1880, 'Aa', 'F', 9007199254740991)
assert boundary[2] == (1880, 'Bb', 'M', 5)
assert list(records(SyntheticArchive(b'A'*15+b',F,5\n')))[0][1] == 'A'*15
cases = []
def case(label, text, message, year=1880):
    cases.append((label, text, message, year))
for text in (b'Anna,F', b'Anna,F,5,extra', b'Anna;F;5', b''):
    # An empty file has no row; a blank record is explicitly a malformed row.
    case('column-count-'+repr(text), text+b'\n', 'exactly three columns')
for name in (b'', b'A', b'A'*16, b'Anna1', b'Anna Smith', b'Anne-Marie', b' Anna', b'Anna '):
    case('invalid-name-'+repr(name), name+b',F,5\n', 'Invalid published')
for sex in (b'', b'X', b'f', b'female', b' F'):
    case('invalid-category-'+repr(sex), b'Anna,'+sex+b',5\n', 'Invalid published')
for count in (b'0', b'-5', b'+5', b'05', b'5.0', b'5e2', b'nan', b' 5', b'5 ', b''):
    case('invalid-count-format-'+repr(count), b'Anna,F,'+count+b'\n', 'Invalid published')
for count in (b'1', b'4', b'9007199254740992'):
    case('invalid-safe-count-'+repr(count), b'Anna,F,'+count+b'\n', 'safe integer')
case('duplicate-annual-key', b'Anna,F,10\nAnna,F,5\n', 'Duplicate annual')
case('category-order', b'Anna,M,10\nBeth,F,5\n', 'Invalid annual')
case('count-order', b'Anna,F,5\nBeth,F,10\n', 'Invalid annual')
case('tied-name-order', b'Beth,F,5\nAnna,F,5\n', 'Invalid annual')
case('invalid-final-year', b'Bad-Name,F,5\n', 'Invalid published', 2025)
for label, text, message, year in cases:
    try:
        list(records(SyntheticArchive(text, year)))
    except ValueError as error:
        assert message in str(error), (label, str(error))
    else:
        raise AssertionError('Accepted invalid annual record: '+label)
try:
    list(records(SyntheticArchive('Éva,F,5\n'.encode('utf-8'))))
except UnicodeDecodeError:
    pass
else:
    raise AssertionError('Accepted non-ASCII archive bytes')
print(json.dumps({'syntheticRecordCases':len(cases)+1,'passed':len(cases)+1,'validAnnualYears':len(base),'actualMalformedZipDecoded':False}))
`;

test('synthetic annual records enforce exact fields, safe counts, duplicate keys and publisher ordering', () => {
  const result = execute(['-S', '-c', annualBoundaryChecks, tool], 30_000);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { syntheticRecordCases: number; passed: number; validAnnualYears: number; actualMalformedZipDecoded: boolean };
  assert.equal(report.syntheticRecordCases, 36);
  assert.equal(report.passed, 36);
  assert.equal(report.validAnnualYears, 146);
  assert.equal(report.actualMalformedZipDecoded, false);
  assert.deepEqual(readFileSync(source), sourceBytes);
});
