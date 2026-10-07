import { createHash } from 'node:crypto';
import { mkdtemp, readFile, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildCurrent, parseCurrentFixture, serialiseCurrent, type CurrentPack } from './current.js';

const BASE_SHA256 = 'fd96fecb43209ce8639bc47185c686fcc2157cdae052cbae3c10e582ce88b0e2';

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([key, item]) => [key, canonical(item)]));
  }
  return value;
}

/** Add explicit editorial evidence without changing the pinned source-derived metrics. */
export function buildReviewedCandidates(source: unknown, editorial: unknown): CurrentPack {
  const fixture = parseCurrentFixture(source);
  if (fixture.curation.length !== 0) throw new Error('the base source fixture must have empty curation');
  const metricsBytes = JSON.stringify(canonical({ source: fixture.source, analysis: fixture.analysis, annualCounts: fixture.annualCounts, curation: [] }), null, 2) + '\n';
  if (createHash('sha256').update(metricsBytes).digest('hex') !== BASE_SHA256) throw new Error('current source-derived metrics fail the pinned fixture checksum');
  if (!Array.isArray(editorial) || editorial.length === 0) throw new Error('curation must be a nonempty standalone array');
  return buildCurrent({ ...fixture, curation: editorial });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[3] !== '--reviewed-candidates' || !args[0] || !args[1] || !args[2]) {
    throw new Error('usage: reviewed-cli.js input.json curation.json output.json --reviewed-candidates');
  }
  const source = resolve(args[0]);
  const editorial = resolve(args[1]);
  const output = resolve(args[2]);
  const inputs = [];
  for (const [path, label] of [[source, 'source'], [editorial, 'curation']] as const) {
    const actual = await realpath(path);
    const info = await stat(path);
    if (!info.isFile()) throw new Error(`${label} input must be a regular file`);
    inputs.push({ actual, info, label });
  }
  const parentReal = await realpath(dirname(output));
  const canonicalOutput = join(parentReal, basename(output));
  if (inputs.some(input => canonicalOutput === input.actual)) throw new Error('output must not overwrite either input');
  try {
    const outputStat = await stat(output);
    if (!outputStat.isFile()) throw new Error('output must be a regular file destination');
    const outputReal = await realpath(output);
    for (const input of inputs) {
      if ((outputStat.dev === input.info.dev && outputStat.ino === input.info.ino) || outputReal === input.actual) throw new Error(`output aliases the ${input.label} input`);
    }
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }
  const sourceValue = JSON.parse(await readFile(source, 'utf8')) as unknown;
  const editorialValue = JSON.parse(await readFile(editorial, 'utf8')) as unknown;
  const content = serialiseCurrent(buildReviewedCandidates(sourceValue, editorialValue));
  let stage: string | undefined;
  try {
    stage = await mkdtemp(join(parentReal, '.c05-reviewed-stage-'));
    const stagedFile = join(stage, 'current-reviewed-candidates.json');
    await writeFile(stagedFile, content, { encoding: 'utf8', flag: 'wx' });
    await rename(stagedFile, output);
  } finally {
    if (stage !== undefined) await rm(stage, { recursive: true, force: true });
  }
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
    process.exitCode = 1;
  });
}
