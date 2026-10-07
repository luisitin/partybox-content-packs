import {readFileSync, mkdirSync, writeFileSync, existsSync, statSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {aggregatePrimary, serializePack} from './build.js';

try {
  const args = process.argv.slice(2);
  if (args.length !== 3 || args[2] !== '--sample') {
    throw new Error('Usage: node cli.js <input.json> <output.json> --sample');
  }
  const [input, output] = args;
  if (input === undefined || output === undefined) {
    throw new Error('Input and output paths are required');
  }
  const inputInfo = statSync(input);
  const outputInfo = existsSync(output) ? statSync(output) : null;
  if (resolve(input) === resolve(output) || (outputInfo !== null && outputInfo.dev === inputInfo.dev && outputInfo.ino === inputInfo.ino)) {
    throw new Error('Input and output paths must be different');
  }
  const fixture: unknown = JSON.parse(readFileSync(input, 'utf8'));
  const contents = serializePack(aggregatePrimary(fixture));
  mkdirSync(dirname(output), {recursive: true});
  writeFileSync(output, contents, 'utf8');
} catch (error: unknown) {
  process.stderr.write(`${error instanceof Error ? error.message : 'Sample generation failed'}\n`);
  process.exitCode = 1;
}
