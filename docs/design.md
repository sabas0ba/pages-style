# Sabas0ba Pages Design v1 (draft)

`sabas0ba/sabas0ba` の portfolio 表現と `sabas0ba/dotfiles` の document UI を共通語彙へ統合する。
この文書と `src/saba.css` は checkpoint 1 の draft であり、既存 Pages への適用前に API を固定する。

## 目的

- 複数 repository の GitHub Pages を同じ作者・同じ設計体系として認識できるようにする。
- Portfolio / Documentation / Application の用途差を保ったまま、色、typography、spacing、component を共有する。
- 外部 theme、web font、runtime dependency を必要としない。
- 依存する場合は SHA で固定できる静的 asset として扱う。

## Design language

### Color

component から色を直接参照せず、`--saba-*` token を使う。

主要 token:

- `--saba-bg`: page background
- `--saba-surface`: card / panel
- `--saba-surface-raised`: secondary surface
- `--saba-text`: primary text
- `--saba-text-muted`: metadata
- `--saba-border`: separator / outline
- `--saba-accent`: link / focus / active state

Dark theme は `#0d1117` を background とする現行 portfolio を基準にする。
Accent hue は既定 250。portfolio のランダム hue は site-local な演出とし、共通 component の仕様にはしない。

### Typography

- Document body: system sans-serif。日本語glyphは読みやすさを優先し、`BIZ UDPGothic`、`Hiragino Sans`、`Yu Gothic UI`、`Noto Sans CJK JP`の順で利用可能なfontへfallbackする
- Navigation / metadata / UI labels: monospace。日本語glyphは`BIZ UDGothic`または`Noto Sans Mono CJK JP`へfallbackする
- Documentation heading: bodyと同じ日本語sans-serif stack
- Portfolio / Application heading: monospaceを使用可能
- Code: monospace
- Portfolio は site-local override により body も monospace にできる

### Spacing

4 px grid を基準とする。

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px`

### Radius

- small: 4 px
- medium: 9.6 px (`0.6rem`)
- pill: `999px`

### Motion

- UI interaction: 150 ms
- image / larger transition: 300 ms
- `prefers-reduced-motion: reduce` を常に尊重する

## Components

Public class は `saba-` prefix を必須とする。

- `.saba-site-header`
- `.saba-brand`
- `.saba-nav`
- `.saba-card`
- `.saba-panel`
- `.saba-chip`
- `.saba-button`
- `.saba-input`
- `.saba-site-footer`
- `.saba-page`
- `.saba-prose`
- `.saba-grid`
- `.saba-grid-background`

Site 固有 class は `@layer site` で定義し、共通 component より後に上書きする。

## Page profiles

### Portfolio

- dot grid background を使用可能
- card / preview / tag を中心とする
- body monospace を許可
- animation は補助的に使用可能

### Documentation

- body は system sans-serif
- content measure は 48 rem を既定とする
- code / blockquote / table 等の読みやすさを優先する
- dot grid は使用しない

### Application

- header、panel、form control、focus state を共有する
- workspace layout は application 固有 CSS とする
- 共通 CSS に application 固有の sidebar 幅等を入れない

## Theme

共通 CSS は以下を扱う。

1. light token
2. `prefers-color-scheme: dark`
3. `data-theme="light|dark"` による明示 override

Theme selector の保存方法や toggle UI は site 側の責務とし、CSS に JavaScript dependency を持たせない。

checkpoint sample では `examples/assets/theme.js` を site 側 helper の例として使用する。`auto` は `data-theme` を削除して OS 設定へ追従し、`light` / `dark` は利用者の選択を local storage に保存する。JavaScript が無効または storage が利用できない場合も CSS の `prefers-color-scheme` だけで成立させる。この helper は `src/saba.css` の public component API には含めない。

## Accessibility

- `:focus-visible` を定義する
- navigation の現在位置は `aria-current="page"` を使用する
- state を色のみで表現しない
- `prefers-reduced-motion` に対応する
- semantic HTML を優先する
- interactive target は keyboard 操作可能な native element を優先する
- page の先頭に skip link を置く
- theme override の選択状態は `aria-pressed` でも示す

## Distribution

v1 API 固定後、専用 repository への分離を検討する。
各 Pages から latest URL を直接参照せず、固定 revision の `saba.css` を repository 内へ vendor することを既定とする。

例:

```text
docs/assets/vendor/saba.css
```

vendor file には source repository と commit SHA をコメントで記録する。

## Runtime dependency

公開artifactはrepository内のCSS、HTML、JavaScriptだけで完結させる。次を使用しない。

- CDNまたは外部hostのstylesheet / script / font
- CSS `@import`
- JavaScript packageまたはmodule import
- npm / pip等によるbuild dependency

CIとdeploymentに使用するGitHub Actionsおよび`dotfiles`はruntime dependencyに含めず、commit SHAで一意に固定する。

## License

Apache License 2.0を適用する。配布する`src/saba.css`にはSPDX identifierとcopyright noticeを付与する。
