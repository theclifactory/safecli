#!/bin/sh
set -eu
project_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
export GH_CONFIG_DIR="$(git -C "$project_root" rev-parse --absolute-git-dir)/safecli-gh"
unset GH_TOKEN GITHUB_TOKEN GH_ENTERPRISE_TOKEN GITHUB_ENTERPRISE_TOKEN GH_HOST
exec gh "$@"
