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
```

Place one private identifying string per line in the file returned by:

```sh
git rev-parse --git-path safecli-private-patterns
```

That file belongs in Git's private metadata, never in source or CI. The checks
do not print the identifying strings or mismatched names/emails.

The pre-commit hook verifies effective author/committer identities, the staged
files, and all locally reachable history. The pre-push hook also checks that the
active GitHub CLI account matches the expected maintainer. Use GitHub CLI's
credential helper for this HTTPS remote; a different authentication mechanism
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
