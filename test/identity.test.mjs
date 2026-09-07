import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/verify-identity.mjs', import.meta.url));

function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'safecli-test-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' };
  for (const key of Object.keys(env)) if (/^GIT_(AUTHOR|COMMITTER|CONFIG_COUNT|CONFIG_KEY_|CONFIG_VALUE_)/.test(key)) delete env[key];
  const git = (...args) => execFileSync('git', args, { cwd, env, stdio: 'pipe', encoding: 'utf8' });
  git('init', '-b', 'main');
  git('config', 'user.name', 'Project Maintainer');
  git('config', 'user.email', '12345+project-alias@users.noreply.github.com');
  git('config', 'commit.gpgsign', 'false');
  git('remote', 'add', 'origin', 'https://github.com/theclifactory/safecli.git');
  const approve = () => {
    git('config', 'safecli.authorName', 'Project Maintainer');
    git('config', 'safecli.authorEmail', '12345+project-alias@users.noreply.github.com');
    git('config', 'safecli.maintainerLogin', 'project-alias');
    writeFileSync(join(cwd, '.git/safecli-private-patterns'), 'private-person@example.invalid\n');
  };
  const check = () => spawnSync(process.execPath, [script], { cwd, env, encoding: 'utf8' });
  return { cwd, git, approve, check };
}

test('identity gate fails closed until configured', t => {
  const f = fixture(t);
  assert.equal(f.check().status, 1);
});

test('identity gate accepts approved staged source and history', t => {
  const f = fixture(t); f.approve();
  writeFileSync(join(f.cwd, 'hello.txt'), 'Hello world\n');
  f.git('add', '.');
  assert.equal(f.check().status, 0);
  f.git('commit', '-m', 'Add greeting');
  assert.equal(f.check().status, 0);
});

test('identity gate rejects a mismatched effective identity', t => {
  const f = fixture(t); f.approve();
  f.git('config', 'user.email', 'private-person@example.invalid');
  const result = f.check();
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stderr, /private-person@example/);
});

test('correct current settings do not conceal an old identifying commit', t => {
  const f = fixture(t); f.approve();
  f.git('commit', '--allow-empty', '--author', 'Old Identity <private-person@example.invalid>', '-m', 'Old commit');
  assert.equal(f.check().status, 1);
});

test('staged content and historical content are both scanned without exposing matches', t => {
  const f = fixture(t); f.approve();
  writeFileSync(join(f.cwd, 'note.txt'), 'private-person@example.invalid\n');
  f.git('add', '.');
  assert.equal(f.check().status, 1);
  f.git('commit', '-m', 'Add note');
  f.git('rm', 'note.txt');
  f.git('commit', '-m', 'Remove note');
  const result = f.check();
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stderr, /private-person@example/);
});
