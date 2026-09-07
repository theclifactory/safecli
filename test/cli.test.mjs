import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../bin/safecli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

test('prints the exact greeting, then exits successfully', () => {
  const result = run();
  assert.equal(result.status, 0);
  assert.equal(result.stdout, 'Hello world\n');
  assert.equal(result.stderr, '');
});

test('help and version are available', () => {
  assert.match(run('--help').stdout, /^Usage: safecli/);
  assert.equal(run('--version').stdout, '0.1.0\n');
});

test('invalid arguments fail without reflecting potentially private input', () => {
  const result = run('private-example-value');
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'Usage: safecli [--help | --version]\n');
});
