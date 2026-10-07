import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, symlinkSync, linkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Ajv } from 'ajv';
import {
  aggregatePrimary, aggregateReference, parseFixture, serializePack,
  type Fixture,
} from '../src/build.js';

function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function fixture(seed = 1): Fixture {
  const next = random(seed);
  const codes = Array.from({length: 30}, (_, i) => i + 1);
  return {
    mode: 'historical-sample', sourceYear: 2017, requestedYear: 2025,
    source: 'https://example.com/explicit-test-fixture',
    products: [...codes].reverse().map(code => ({code, label: `Test product ${code}`})),
    injuries: codes.map(code => ({
      caseId: `case-${code}`,
      products: [code, code, codes[Math.floor(next() * codes.length)]!],
      weight: Math.floor(next() * 1000 + 1) / 4,
    })),
  };
}

const actual = JSON.parse(readFileSync('fixtures/source.json', 'utf8')) as unknown;
const seeds = JSON.parse(readFileSync('test/seeds.json', 'utf8')) as number[];

test('known multi-product cases deduplicate within case and retain counts and weights', () => {
  const input = fixture();
  input.injuries = input.products.map(product => ({caseId: `known-${product.code}`, products: [product.code], weight: 2}));
  input.injuries.push({caseId: 'two-products', products: [1, 2, 1], weight: 3.25});
  const output = aggregatePrimary(input);
  assert.deepEqual(output, aggregateReference(input));
  assert.equal(output.rows[0]!.productCode, 1);
  assert.equal(output.rows[29]!.productCode, 30);
  assert.equal(output.rows[0]!.sampleWeightedSum, 5.25);
  assert.equal(output.rows[1]!.sampleWeightedSum, 5.25);
  assert.equal(output.rows[2]!.sampleWeightedSum, 2);
  assert.equal(output.rows[0]!.sampleCaseCount, 2);
  assert.equal(output.rows[2]!.sampleCaseCount, 1);
});

test('two independent aggregation implementations agree over 10,000 generated cases', () => {
  for (let seed = 1; seed <= 10_000; seed++) {
    const input = fixture(seed);
    assert.deepEqual(aggregatePrimary(input), aggregateReference(input), `seed=${seed}`);
  }
});

test('properties for seeds 1,2,3 and 1,000 stored independently random seeds', () => {
  assert.equal(seeds.length, 1000);
  assert.equal(new Set(seeds).size, 1000);
  for (const seed of [1,2,3,...seeds]) {
    const input = fixture(seed);
    const output = aggregatePrimary(input);
    assert.equal(output.rows.length, 30);
    assert.deepEqual(output.rows.map(row => row.productCode), Array.from({length:30}, (_, i) => i + 1));
    assert.equal(serializePack(output), serializePack(aggregatePrimary(structuredClone(input))));
    for (const row of output.rows) {
      const associated = input.injuries.filter(injury => injury.products.includes(row.productCode));
      assert.equal(row.sampleCaseCount, associated.length);
      assert.equal(row.sampleWeightedSum, associated.reduce((total, injury) => total + injury.weight, 0));
      assert.equal(row.label, input.products.find(product => product.code === row.productCode)!.label);
      assert.equal(row.nationalEstimate, null);
      assert.equal(row.fact, null);
      assert.equal(row.factStatus, 'unverified');
    }
    assert.equal(output.complete, false);
    assert.equal(output.mode, 'historical-sample');
    assert.equal(output.year, 2017);
    assert.equal(output.requestedYear, 2025);
  }
});

test('invalid source data fails explicitly instead of quietly corrupting output', () => {
  const changes: Array<[string, (input: Fixture) => void]> = [
    ['zero weight', input => {input.injuries[0]!.weight = 0;}],
    ['negative weight', input => {input.injuries[0]!.weight = -1;}],
    ['NaN weight', input => {input.injuries[0]!.weight = Number.NaN;}],
    ['infinite weight', input => {input.injuries[0]!.weight = Infinity;}],
    ['duplicate case', input => {input.injuries[1]!.caseId = input.injuries[0]!.caseId;}],
    ['empty case ID', input => {input.injuries[0]!.caseId = '';}],
    ['undeclared product', input => {input.injuries[0]!.products.push(999);}],
    ['duplicate product declaration', input => {input.products.push({...input.products[0]!});}],
    ['empty label', input => {input.products[0]!.label = ' ';}],
    ['fractional code', input => {input.products[0]!.code = 1.5;}],
    ['zero code', input => {input.products[0]!.code = 0;}],
    ['missing injury products', input => {input.injuries[0]!.products = [];}],
    ['wrong mode', input => {(input as {mode: string}).mode = 'production';}],
    ['wrong requested year', input => {input.requestedYear = 2016;}],
    ['fractional source year', input => {input.sourceYear = 2017.5;}],
    ['fewer than 30 injuries', input => {input.injuries.pop();}],
    ['fewer than 30 output products', input => {input.products.pop(); input.injuries = input.injuries.map(row => ({...row, products: row.products.filter(code => code !== 1)}));}],
    ['30 declared but only 29 observed products', input => {input.injuries = input.injuries.map(row => ({...row, products: row.products.map(code => code === 30 ? 29 : code)}));}],
    ['overflowed sum', input => {input.injuries[0]!.weight = Number.MAX_VALUE; input.injuries[1]!.weight = Number.MAX_VALUE; input.injuries[0]!.products = [1]; input.injuries[1]!.products = [1,2];}],
  ];
  for (const [label, change] of changes) {
    const input = fixture();
    change(input);
    assert.throws(() => aggregatePrimary(input), label);
    assert.throws(() => aggregateReference(input), label);
  }
  for (const input of [null, {}, [], 'x']) assert.throws(() => parseFixture(input));
});

test('actual historical source sample and pack satisfy JSON Schemas and preserve sample safety', () => {
  const ajv = new Ajv({allErrors: true, strict: true});
  const sourceSchema = JSON.parse(readFileSync('schemas/fixture.schema.json', 'utf8')) as object;
  const packSchema = JSON.parse(readFileSync('schemas/pack.schema.json', 'utf8')) as object;
  const validateSource = ajv.compile(sourceSchema);
  const validatePack = ajv.compile(packSchema);
  assert.ok(validateSource(actual), JSON.stringify(validateSource.errors));
  const sample = parseFixture(actual);
  assert.equal(sample.injuries.length, 90);
  assert.equal(sample.products.length, 30);
  assert.equal(sample.sourceYear, 2017);
  assert.match(sample.source, /09ed9eba12e10732efb83ef82b4213a020521cc5/);
  const output = aggregatePrimary(sample);
  assert.deepEqual(output, aggregateReference(sample));
  assert.ok(validatePack(output), JSON.stringify(validatePack.errors));
  assert.equal(output.rows.length, 30);
  assert.equal(output.year, 2017);
  assert.equal(output.requestedYear, 2025);
  assert.equal(output.complete, false);
  const wrong = {...output, complete: true};
  assert.equal(validatePack(wrong), false);
  assert.equal(validateSource({...sample, sourceYear: '2017'}), false);
});

test('CLI generates byte-identical output twice, matches checked-in data and checksums', () => {
  const directory = mkdtempSync(join(tmpdir(), 'c01-test-'));
  try {
    const first = join(directory, 'first.json');
    const second = join(directory, 'second.json');
    for (const target of [first,second]) {
      const result = spawnSync(process.execPath, ['dist/src/cli.js', 'fixtures/source.json', target, '--sample'], {encoding: 'utf8'});
      assert.equal(result.status, 0, result.stderr);
    }
    assert.equal(readFileSync(first, 'utf8'), readFileSync(second, 'utf8'));
    assert.equal(readFileSync(first, 'utf8'), readFileSync('data/sample.json', 'utf8'));
    assert.ok(readFileSync(first, 'utf8').endsWith('\n'));
    assert.equal(serializePack(aggregatePrimary(actual)), readFileSync(first, 'utf8'));
    const hashes = spawnSync('sha256sum', ['--check', 'SHA256SUMS.txt'], {encoding: 'utf8'});
    assert.equal(hashes.status, 0, hashes.stdout + hashes.stderr);
    const unsafe = spawnSync(process.execPath, ['dist/src/cli.js', 'fixtures/source.json', first], {encoding: 'utf8'});
    assert.notEqual(unsafe.status, 0, 'must require --sample');
    const same = join(directory, 'source.json');
    const sourceBytes = readFileSync('fixtures/source.json', 'utf8');
    writeFileSync(same, sourceBytes);
    const overwrite = spawnSync(process.execPath, ['dist/src/cli.js', same, same, '--sample'], {encoding: 'utf8'});
    assert.notEqual(overwrite.status, 0, 'must not overwrite source with output');
    assert.equal(readFileSync(same, 'utf8'), sourceBytes);
    for (const [label, makeAlias] of [['symlink', symlinkSync], ['hardlink', linkSync]] as const) {
      const alias = join(directory, `${label}.json`);
      makeAlias(same, alias);
      const aliasWrite = spawnSync(process.execPath, ['dist/src/cli.js', same, alias, '--sample'], {encoding: 'utf8'});
      assert.notEqual(aliasWrite.status, 0, `must preserve source via ${label}`);
      assert.equal(readFileSync(same, 'utf8'), sourceBytes);
    }
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});
