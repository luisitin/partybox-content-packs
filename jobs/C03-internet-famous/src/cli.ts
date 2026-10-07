import {readFileSync, mkdirSync, realpathSync, statSync, writeFileSync} from 'node:fs';
import type {Stats} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {buildSample, serializeSample} from './build.js';

function existingStat(path: string): Stats | null {
  try {return statSync(path)} catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null;
    throw error;
  }
}
try {
  const args = process.argv.slice(2);
  if (args.length !== 5 || args[2] !== '--sample' || args[3] !== '--build-date') {
    throw new Error('Usage: node cli.js <input.json> <output.json> --sample --build-date YYYY-MM-DD');
  }
  const [input, output, , , buildDate] = args;
  if (input === undefined || output === undefined || buildDate === undefined) throw new Error('Input, output and build date are required');
  const inputStat = statSync(input);
  const outputStat = existingStat(output);
  if (resolve(input) === resolve(output) || (outputStat !== null &&
      (realpathSync(input) === realpathSync(output) || (inputStat.dev === outputStat.dev && inputStat.ino === outputStat.ino)))) {
    throw new Error('Input and output must be different files');
  }
  const fixture: unknown = JSON.parse(readFileSync(input, 'utf8'));
  const contents = serializeSample(buildSample(fixture, buildDate));
  mkdirSync(dirname(output), {recursive: true});
  writeFileSync(output, contents, 'utf8');
} catch (error: unknown) {
  process.stderr.write(`${error instanceof Error ? error.message : 'Sample generation failed'}\n`);
  process.exitCode = 1;
}
