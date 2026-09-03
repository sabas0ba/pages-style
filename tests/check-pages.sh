#!/usr/bin/env bash
set -euo pipefail

site_dir=.work/pages

fail() {
  printf 'check-pages: %s\n' "$1" >&2
  exit 1
}

required_files=(
  index.html
  portfolio.html
  docs.html
  app.html
  assets/saba.css
  assets/saba-sea.css
  assets/saba-sea.js
  sea.html
  assets/theme.js
  LICENSE.txt
  .nojekyll
)

for relative_path in "${required_files[@]}"; do
  test -e "$site_dir/$relative_path" || fail "$relative_path が Pages artifact にありません"
done

for html_file in "$site_dir"/*.html; do
  grep -Fq 'href="assets/saba.css"' "$html_file" || fail "$html_file が artifact 内の CSS を参照していません"
  if grep -Fq '../src/' "$html_file"; then
    fail "$html_file に repository layout への参照が残っています"
  fi
done

printf 'Pages artifact checks passed\n'
