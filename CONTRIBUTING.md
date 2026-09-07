# Contributing

Use the dedicated project maintainer identity for this initial repository.
Before accepting other contributors, revise the identity allowlist deliberately.
Keep private account mappings and identity search terms outside tracked files.

## Configure this checkout

The following values must come from the dedicated GitHub account. Copy its exact
ID-based noreply address from GitHub Settings → Emails. Replace the capitalized
values before running these commands.

```sh
git config --local user.useConfigOnly true
git config --local user.name "PUBLIC_AUTHOR_NAME"
git config --local user.email "EXACT_ACCOUNT_NOREPLY_ADDRESS"
git config --local safecli.authorName "PUBLIC_AUTHOR_NAME"
git config --local safecli.authorEmail "EXACT_ACCOUNT_NOREPLY_ADDRESS"
git config --local safecli.maintainerLogin "GITHUB_ALIAS"
git config --local core.hooksPath .githooks
git config --local credential.helper ""
git config --local --add credential.helper '!env -u GH_TOKEN -u GITHUB_TOKEN -u GH_ENTERPRISE_TOKEN -u GITHUB_ENTERPRISE_TOKEN -u GH_HOST GH_CONFIG_DIR="$(git rev-parse --absolute-git-dir)/safecli-gh" gh auth git-credential'
./scripts/gh-project.sh auth login --hostname github.com --git-protocol https --web --skip-ssh-key
```

Sign in as the dedicated maintainer. Use `./scripts/gh-project.sh` for this
project's GitHub administration commands. Its configuration stays inside this
checkout's private Git metadata; credentials use GitHub CLI's normal credential
storage. The wrapper and push check ignore ambient GitHub tokens and host
overrides. Other projects retain their existing GitHub CLI configuration.

Place one private identifying string per line in the file returned by:

```sh
git rev-parse --git-path safecli-private-patterns
```

That file belongs in Git's private metadata, never in source or CI. The checks
do not print the identifying strings or mismatched names/emails.

The pre-commit hook verifies effective author/committer identities, the staged
files, and all locally reachable history. The pre-push hook also checks that the
project's isolated GitHub CLI account matches the expected maintainer. Use the
credential helper above for this HTTPS remote; a different authentication mechanism
must be reviewed separately. Hooks run locally and can be bypassed. They are a
guardrail, not proof that the server, other clones, public actions, or binary
metadata are free of identity links.

## Before a release

1. Verify the browser, editor, Git transport, and registry account identities.
2. Run `npm run check:identity` and `npm test`.
3. Run `npm pack --dry-run` and inspect the actual tarball from `npm pack`.
4. Inspect author/committer metadata, signatures, tags, and release notes.
5. Confirm the destination repository and any registry publisher are correct.
6. Inspect the public result from a separate session after publication.

Keep the repository private until these checks pass. Do not put real names,
private email addresses, private scan terms, credentials, or internal planning
documents in issues, commits, release notes, or workflow logs.

This project is a standalone CLI. It is not yet an OpenClaw code plugin or a
published ClawHub package.
