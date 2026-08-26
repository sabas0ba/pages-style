#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'check-workflows: %s\n' "$1" >&2
  exit 1
}

workflow_files=(.github/workflows/*.yml)
test -e "${workflow_files[0]}" || fail "workflow がありません"

for workflow_file in "${workflow_files[@]}"; do
  while IFS= read -r uses_line; do
    action_ref=${uses_line##*@}
    [[ $action_ref =~ ^[0-9a-f]{40}$ ]] || fail "$workflow_file の action が commit SHA で固定されていません: $uses_line"
  done < <(grep -E '^[[:space:]]*uses:' "$workflow_file")
done

dotfiles_ref=$(grep -A1 'repository: sabas0ba/dotfiles' .github/workflows/ci.yml | grep 'ref:' | awk '{ print $2 }')
[[ $dotfiles_ref =~ ^[0-9a-f]{40}$ ]] || fail "dotfiles revision が commit SHA で固定されていません"

printf 'workflow pin checks passed\n'
