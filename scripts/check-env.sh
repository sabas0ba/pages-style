#!/usr/bin/env bash
set -euo pipefail

required_commands=(
  bash
  git
  make
  rg
  shellcheck
  shfmt
)

store_dir=${NIX_STORE_DIR:-/nix/store}
missing=()
foreign=()

for command_name in "${required_commands[@]}"; do
  if ! command_path=$(command -v "$command_name" 2>/dev/null); then
    printf '  MISSING %-12s\n' "$command_name"
    missing+=("$command_name")
    continue
  fi

  command_real_path=$(realpath -e -- "$command_path" 2>/dev/null || printf '%s' "$command_path")
  case "$command_real_path" in
    "$store_dir"/*) printf '  ok      %-12s %s\n' "$command_name" "$command_real_path" ;;
    *)
      printf '  FOREIGN %-12s %s\n' "$command_name" "$command_real_path"
      foreign+=("$command_name")
      ;;
  esac
done

if ((${#missing[@]} != 0)); then
  printf '不足しているコマンド: %s\n' "${missing[*]}" >&2
  exit 1
fi

if ((${#foreign[@]} != 0)); then
  printf 'Nix store 由来でないコマンド: %s\n' "${foreign[*]}" >&2
  exit 1
fi

printf '開発環境は正常です (PAGES_STYLE_ENV=%s)。\n' "${PAGES_STYLE_ENV:-unset}"
