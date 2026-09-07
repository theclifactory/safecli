#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);

if (args.length === 0) {
  process.stdout.write('Hello world\n');
} else if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  process.stdout.write('Usage: safecli [--help | --version]\n\nPrint Hello world.\n');
} else if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  process.stdout.write(`${version}\n`);
} else {
  process.stderr.write('Usage: safecli [--help | --version]\n');
  process.exitCode = 2;
}
