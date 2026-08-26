#!/usr/bin/env bash
set -euo pipefail

html_files=(
  examples/index.html
  examples/portfolio.html
  examples/docs.html
  examples/app.html
)
css_file=src/saba.css
theme_helper=examples/assets/theme.js

fail() {
  printf 'check-static: %s\n' "$1" >&2
  exit 1
}

for html_file in "${html_files[@]}"; do
  test -s "$html_file" || fail "$html_file が存在しないか空です"
  grep -Fqi '<!doctype html>' "$html_file" || fail "$html_file に doctype がありません"
  grep -Fq 'lang="ja"' "$html_file" || fail "$html_file に lang=ja がありません"
  grep -Fq 'name="viewport"' "$html_file" || fail "$html_file に viewport がありません"
  grep -Fq 'href="../src/saba.css"' "$html_file" || fail "$html_file が src/saba.css を参照していません"
  grep -Fq 'src="assets/theme.js"' "$html_file" || fail "$html_file が sample theme helper を参照していません"
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
  grep -Fq -- "$selector" "$css_file" || fail "$css_file に $selector がありません"
done

opening_braces=$(grep -o '{' "$css_file" | wc -l)
closing_braces=$(grep -o '}' "$css_file" | wc -l)
test "$opening_braces" -eq "$closing_braces" || fail "$css_file の brace 数が一致しません"

grep -Fq 'data-saba-theme-switcher' "$theme_helper" || fail "$theme_helper に theme switcher 処理がありません"
grep -Fq 'localStorage' "$theme_helper" || fail "$theme_helper に user override の保存処理がありません"

printf 'static checks passed (%d HTML samples)\n' "${#html_files[@]}"
