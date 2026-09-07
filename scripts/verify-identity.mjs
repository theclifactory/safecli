import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024,
}).trimEnd();
const fail = (message) => { throw new Error(message); };

try {
  let name, email, login, patterns;
  try {
    name = git('config', '--local', '--get', 'safecli.authorName');
    email = git('config', '--local', '--get', 'safecli.authorEmail');
    login = git('config', '--local', '--get', 'safecli.maintainerLogin');
    patterns = readFileSync(git('rev-parse', '--git-path', 'safecli-private-patterns'), 'utf8')
      .split(/\r?\n/).map(line => line.trim().toLowerCase()).filter(Boolean);
  } catch {
    fail('Configure the dedicated maintainer and private scan file first. See CONTRIBUTING.md.');
  }
  if (!name || !login || !patterns.length || !/^\d+\+[a-z\d-]+@users\.noreply\.github\.com$/i.test(email)
      || email.slice(email.indexOf('+') + 1).toLowerCase() !== `${login}@users.noreply.github.com`.toLowerCase()) {
    fail('The approved maintainer identity or private scan file is incomplete.');
  }
  const scan = (text) => {
    const lower = text.toLowerCase();
    if (patterns.some(pattern => lower.includes(pattern))) fail('Private identity text was found. Review locally before continuing.');
  };
  for (const kind of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
    const effective = git('var', kind).match(/^(.*) <([^<>]*)> \d+ [+-]\d{4}$/);
    if (!effective || effective[1] !== name || effective[2] !== email) fail('The effective Git identity is not the approved maintainer.');
  }
  scan(`${name}\n${email}\n${login}`);
  const origin = git('remote', 'get-url', '--push', 'origin');
  if (origin !== 'https://github.com/theclifactory/safecli.git') fail('The push destination is not the approved HTTPS repository.');

  const commits = git('rev-list', '--all').split('\n').filter(Boolean);
  for (const sha of commits) {
    const fields = git('show', '-s', '--format=%an%x00%ae%x00%cn%x00%ce', sha).split('\0');
    if (fields[0] !== name || fields[1] !== email || fields[2] !== name || fields[3] !== email) {
      fail('An existing commit has an unapproved author or committer.');
    }
    scan(git('cat-file', '-p', sha));
    for (const file of git('ls-tree', '-r', '--name-only', '-z', sha).split('\0').filter(Boolean)) {
      scan(file);
      scan(git('show', `${sha}:${file}`));
    }
  }
  for (const file of git('ls-files', '-z').split('\0').filter(Boolean)) {
    scan(file);
    scan(git('show', `:${file}`));
  }
  for (const ref of git('for-each-ref', '--format=%(refname)').split('\n').filter(Boolean)) scan(ref);
  for (const tag of git('tag', '--list').split('\n').filter(Boolean)) {
    if (git('cat-file', '-t', `refs/tags/${tag}`) === 'tag') {
      const raw = git('cat-file', '-p', `refs/tags/${tag}`);
      scan(raw);
      if (!raw.split('\n').some(line => line.startsWith(`tagger ${name} <${email}> `))) fail('An annotated tag has an unapproved tagger.');
    }
  }
  if (process.argv.includes('--push')) {
    let active;
    try { active = execFileSync('gh', ['api', 'user', '--jq', '.login'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
    catch { fail('Cannot verify the GitHub CLI account. Sign in as the dedicated maintainer.'); }
    if (active.toLowerCase() !== login.toLowerCase()) fail('The active GitHub CLI account is not the approved maintainer.');
  }
  process.stdout.write('Identity checks passed for this checkout.\n');
} catch (error) {
  const message = error instanceof Error && !('status' in error) ? error.message : 'A Git check failed. Review the checkout locally.';
  process.stderr.write(`Identity check failed: ${message}\n`);
  process.exitCode = 1;
}
