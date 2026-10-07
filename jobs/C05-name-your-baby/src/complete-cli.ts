import { mkdtemp, readFile, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import type { Stats } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { CurrentPack, CurrentRow, EditorialReview } from './current.js';
import { buildReviewedCandidates } from './reviewed-cli.js';

export interface CompleteRow extends Omit<CurrentRow, 'fact' | 'factStatus' | 'factReview' | 'recognitionVerified' | 'recognitionReview'> {
  fact: string;
  factStatus: 'reviewed';
  factReview: EditorialReview;
  recognitionVerified: true;
  recognitionReview: EditorialReview;
}
export interface CompletePack extends Omit<CurrentPack, 'mode' | 'complete' | 'rows'> {
  mode: 'name-your-baby';
  complete: true;
  rows: CompleteRow[];
}

function normalized(value: string): string { return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' '); }

/** Require complete editorial evidence; source truth is established during curation. */
export function buildComplete(source: unknown, editorial: unknown): CompletePack {
  const candidates = buildReviewedCandidates(source, editorial);
  if (candidates.rows.length !== 500) throw new Error('a complete pack requires exactly 500 selected rows');
  const rows: CompleteRow[] = candidates.rows.map(row => {
    if (row.fact === null || row.factStatus !== 'reviewed' || [...row.fact].length > 90 || row.factReview === null || row.factReferences.length < 2
      || new Set(row.factReferences.map(reference => normalized(reference.author))).size < 2
      || new Set(row.factReferences.map(reference => normalized(reference.workId))).size < 2) {
      throw new Error(`incomplete fact evidence for ${row.id}`);
    }
    if (!row.recognitionVerified || row.recognitionReview === null) throw new Error(`incomplete recognition evidence for ${row.id}`);
    return { ...row, fact: row.fact, factStatus: 'reviewed', factReview: row.factReview, recognitionVerified: true, recognitionReview: row.recognitionReview };
  });
  return { ...candidates, mode: 'name-your-baby', complete: true, rows };
}

export function serialiseComplete(pack: CompletePack): string { return JSON.stringify(pack, null, 2) + '\n'; }

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[3] !== '--complete' || !args[0] || !args[1] || !args[2]) {
    throw new Error('usage: complete-cli.js source.json curation.json output.json --complete');
  }
  const source = resolve(args[0]);
  const editorial = resolve(args[1]);
  const output = resolve(args[2]);
  const inputs: { path: string; actual: string; info: Stats; label: string; bytes: Buffer }[] = [];
  for (const [path, label] of [[source, 'source'], [editorial, 'curation']] as const) {
    const actual = await realpath(path);
    const info = await stat(path);
    if (!info.isFile()) throw new Error(`${label} input must be a regular file`);
    inputs.push({ path, actual, info, label, bytes: await readFile(path) });
  }
  const parentReal = await realpath(dirname(output));
  async function checkDestination(): Promise<void> {
    if (inputs.some(input => join(parentReal, basename(output)) === input.actual)) throw new Error('output must not overwrite either input');
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
  }
  await checkDestination();
  const sourceValue = JSON.parse(inputs[0]!.bytes.toString('utf8')) as unknown;
  const editorialValue = JSON.parse(inputs[1]!.bytes.toString('utf8')) as unknown;
  const content = serialiseComplete(buildComplete(sourceValue, editorialValue));
  let stage: string | undefined;
  try {
    stage = await mkdtemp(join(parentReal, '.c05-complete-stage-'));
    const stagedFile = join(stage, 'name-your-baby.json');
    await writeFile(stagedFile, content, { encoding: 'utf8', flag: 'wx' });
    for (const input of inputs) {
      if (await realpath(input.path) !== input.actual || !(await readFile(input.path)).equals(input.bytes)) throw new Error(`${input.label} input changed before publication`);
    }
    await checkDestination();
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
