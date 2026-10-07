import { mkdtemp, readFile, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, dirname, join, resolve } from 'node:path';
import { buildCurrent, parseCurrentFixture, serialiseCurrent } from './current.js';

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([key, item]) => [key, canonical(item)]));
  return value;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length !== 3 || args[2] !== '--current-candidates' || !args[0] || !args[1]) throw new Error('usage: current-cli.js input.json output.json --current-candidates');
  const input = resolve(args[0]);
  const output = resolve(args[1]);
  const inputReal = await realpath(input);
  const inputStat = await stat(input);
  if (!inputStat.isFile()) throw new Error('input must be a regular file');
  const parentReal = await realpath(dirname(output));
  const canonicalOutput = join(parentReal, basename(output));
  if (canonicalOutput === inputReal) throw new Error('output must not overwrite the input source');
  try {
    const outputStat = await stat(output);
    if (!outputStat.isFile()) throw new Error('output must be a regular file destination');
    if ((outputStat.dev === inputStat.dev && outputStat.ino === inputStat.ino) || await realpath(output) === inputReal) throw new Error('output aliases the input source');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }
  const fixture = parseCurrentFixture(JSON.parse(await readFile(input, 'utf8')) as unknown);
  const metricsBytes = JSON.stringify(canonical({ source: fixture.source, analysis: fixture.analysis, annualCounts: fixture.annualCounts, curation: [] }), null, 2) + '\n';
  if (createHash('sha256').update(metricsBytes).digest('hex') !== '8dd80f3f6dc38705be47541fb994d073270ffe4d861732471c0c339e385905e9') throw new Error('current source-derived metrics fail the pinned fixture checksum');
  const content = serialiseCurrent(buildCurrent(fixture));
  let stage: string | undefined;
  try {
    stage = await mkdtemp(join(parentReal, '.c05-current-stage-'));
    const stagedFile = join(stage, 'current-candidates.json');
    await writeFile(stagedFile, content, { encoding: 'utf8', flag: 'wx' });
    await rename(stagedFile, output);
  } finally {
    if (stage !== undefined) await rm(stage, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
});
