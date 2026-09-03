#!/usr/bin/env bash
set -euo pipefail

html_files=(
  examples/index.html
  examples/portfolio.html
  examples/docs.html
  examples/app.html
  examples/sea.html
)
css_file=src/saba.css
sea_css=src/saba-sea.css
sea_js=src/saba-sea.js
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

if grep -Eiq '<script[^>]*src="https?://|<link[^>]*href="https?://' "${html_files[@]}"; then
  fail "sample が外部 script または stylesheet を参照しています"
fi

required_css_api=(
  '.saba-page'
  '.saba-prose'
  '.saba-card'
  '.saba-panel'
  '.saba-chip'
  '.saba-button'
  '.saba-button--primary'
  '.saba-grid-background'
  '.saba-sheet'
  '.saba-fig'
  '.saba-titleblock'
  '.saba-hatch'
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

# data URI 内の xmlns (http://www.w3.org/...) は外部依存ではないため、url( の直後だけを見る
if grep -Eiq '@import|url\([[:space:]]*["'"'"']?https?://' "$css_file"; then
  fail "$css_file に外部 asset dependency があります"
fi

# 図面の設計規約: 影、角丸、blur、斜め gradient を common CSS に持ち込まない。
if grep -Eq 'box-shadow|border-radius|backdrop-filter|linear-gradient\(135deg' "$css_file"; then
  fail "$css_file に設計規約で禁止した装飾 (shadow / radius / blur / 斜め gradient) があります"
fi

# sample の site 固有 style は @layer site に置き、inline style を使わない。
if grep -Eq '<[^>]* style="' "${html_files[@]}"; then
  fail "sample に inline style があります"
fi

# sea component: 属性 API、外部依存なし、module 非依存
for selector in 'body\[data-sea' 'data-sea-style' 'data-fish' '.saba-tank' '.saba-fish' '.saba-sea-bg' 'prefers-reduced-motion: reduce'; do
  grep -Eq -- "$selector" "$sea_css" || fail "$sea_css に $selector がありません"
done
if grep -Eiq '@import|url\([[:space:]]*["'"'"']?https?://' "$sea_css"; then
  fail "$sea_css に外部 asset dependency があります"
fi
for kind in saba kingyo medaka fugu kurage tai ika; do
  grep -Fq "$kind:" "$sea_js" || fail "$sea_js に魚 $kind がありません"
done
grep -Fq 'window.sabaSea' "$sea_js" || fail "$sea_js に setup API がありません"
if grep -Eq '(^|[^[:alnum:]_])import[[:space:]]*(\(|[^;]*from)|https?://' "$sea_js"; then
  fail "$sea_js に module または外部依存があります"
fi
grep -Fq 'data-sea="tide"' examples/portfolio.html || fail "portfolio sample に sea component が組み込まれていません"
grep -Fq 'data-fish="none"' examples/sea.html || fail "sea sample に魚なし版の説明がありません"

grep -Fq 'data-saba-theme-switcher' "$theme_helper" || fail "$theme_helper に theme switcher 処理がありません"
grep -Fq 'localStorage' "$theme_helper" || fail "$theme_helper に user override の保存処理がありません"
if grep -Eq '(^|[^[:alnum:]_])import[[:space:]]*(\(|[^;]*from)' "$theme_helper"; then
  fail "$theme_helper に module dependency があります"
fi

grep -Fq 'BIZ UDPGothic' "$css_file" || fail "$css_file に日本語本文用 font がありません"
grep -Fq 'BIZ UDGothic' "$css_file" || fail "$css_file に日本語 mono 用 font がありません"
grep -Fq 'CSS の使い方' examples/index.html || fail "sample index に CSS の利用説明がありません"
grep -Fq 'https://github.com/sabas0ba/pages-style' examples/index.html || fail "sample index に repository link がありません"
grep -Fq 'Apache License' LICENSE || fail "Apache-2.0 license がありません"

printf 'static checks passed (%d HTML samples)\n' "${#html_files[@]}"
