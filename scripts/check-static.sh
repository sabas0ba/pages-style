#!/usr/bin/env bash
set -euo pipefail

html_files=(index.html portfolio.html docs.html app.html)

fail() {
  printf 'check-static: %s\n' "$1" >&2
  exit 1
}

sha256sum --check --strict SHA256SUMS >/dev/null || fail "SHA256SUMS と checkpoint files が一致しません"

for html_file in "${html_files[@]}"; do
  test -s "$html_file" || fail "$html_file が存在しないか空です"
  grep -Fqi '<!doctype html>' "$html_file" || fail "$html_file に doctype がありません"
  grep -Fq 'lang="ja"' "$html_file" || fail "$html_file に lang=ja がありません"
  grep -Fq 'name="viewport"' "$html_file" || fail "$html_file に viewport がありません"
  grep -Fq 'href="saba.css"' "$html_file" || fail "$html_file が saba.css を参照していません"
  grep -Fq 'class="saba-skip-link"' "$html_file" || fail "$html_file に skip link がありません"
done

required_css_api=(
  '.saba-page'
  '.saba-prose'
  '.saba-card'
  '.saba-panel'
  '.saba-chip'
  '.saba-button'
  '.saba-button--primary'
  '.saba-grid-background'
  ':focus-visible'
  'prefers-color-scheme: dark'
  'prefers-reduced-motion: reduce'
  ':root[data-theme="dark"]'
  ':root[data-theme="light"]'
)

for selector in "${required_css_api[@]}"; do
  grep -Fq -- "$selector" saba.css || fail "saba.css に $selector がありません"
done

opening_braces=$(grep -o '{' saba.css | wc -l)
closing_braces=$(grep -o '}' saba.css | wc -l)
test "$opening_braces" -eq "$closing_braces" || fail "saba.css の brace 数が一致しません"

grep -Fq 'data-saba-theme-switcher' theme.js || fail 'theme.js に theme switcher 処理がありません'
grep -Fq 'localStorage' theme.js || fail 'theme.js に user override の保存処理がありません'

printf 'static checks passed (%d HTML samples)\n' "${#html_files[@]}"
