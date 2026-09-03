# Sabas0ba Pages Design v1 (draft)

`sabas0ba/sabas0ba` の portfolio 表現と `sabas0ba/dotfiles` の document UI を共通語彙へ統合する。
この文書と `src/saba.css` は checkpoint 2 の draft であり、既存 Pages への適用前に API を固定する。

## 目的

- 複数 repository の GitHub Pages を同じ作者・同じ設計体系として認識できるようにする。
- Portfolio / Documentation / Application の用途差を保ったまま、色、typography、spacing、component を共有する。
- 外部 theme、web font、runtime dependency を必要としない。
- 依存する場合は SHA で固定できる静的 asset として扱う。

## 意匠の方針: 図面

主題 (reproducible engineering) と表現を一致させ、ページを 1 枚の機械図面として組む。checkpoint 1 の template 的な要素 (角丸 card と影、dot grid、pill、uppercase eyebrow、斜め gradient、GitHub Primer の配色) は採らない。

- 構造は罫線と frame で作る。面の重なりや影で階層を表現しない。
- 角丸は使わない (radius 0)。
- 列挙は採番する (`FIG. 01`)。番号は装飾ではなく、列挙可能な内容にのみ付ける。
- placeholder 面は gradient ではなく hatching で表す。
- 識別情報 (project、sheet、rev、license) は表題欄にまとめる。
- light は製図用紙と墨、dark は青焼き (diazo blueprint) として、別の紙に切り替える。dark は light の単純な反転ではない。

## Design language

### Color

component から色を直接参照せず、`--saba-*` token を使う。

| token | 用途 | light | dark (青焼き) |
| --- | --- | --- | --- |
| `--saba-bg` | 紙 | `#f5f4ee` | `#14293d` |
| `--saba-surface` | panel / input | `#faf9f5` | `#172e44` |
| `--saba-surface-raised` | inline code / th | `#eceae1` | `#1d3852` |
| `--saba-text` | 墨 / 線 | `#2a2924` | `#d8e5f0` |
| `--saba-text-muted` | 注記 | `#6f6c60` | `#8aa4bb` |
| `--saba-border` | 細罫 | `#cfccbd` | `#33506a` |
| `--saba-border-strong` | 太罫 / frame | `#2a2924` | `#d8e5f0` |
| `--saba-accent` | 検図印 (朱) / marker | `#b0402f` | `#e6c37c` |
| `--saba-hatch` | hatching 線 | `rgb(42 41 36 / 18%)` | `rgb(216 229 240 / 16%)` |
| `--saba-grid-line` | 方眼 | `rgb(42 41 36 / 9%)` | `rgb(216 229 240 / 7%)` |

accent の使用箇所は限定する: `aria-current` の下線、表題欄の REV、`:focus-visible`、prose 内 link、primary button の hover。状態の強調は accent ではなく inverse video (地と文字の反転) を優先する。

### Typography

- Document body: system sans-serif。日本語 glyph は読みやすさを優先し、`BIZ UDPGothic`、`Hiragino Sans`、`Yu Gothic UI`、`Noto Sans CJK JP` の順で利用可能な font へ fallback する
- Navigation / metadata / 採番 / 表題欄 / UI labels: monospace。日本語 glyph は `BIZ UDGothic` または `Noto Sans Mono CJK JP` へ fallback する
- 見出し: monospace bold、letter-spacing を詰める (図面の lettering)
- Code: monospace
- uppercase + 広い letter-spacing の eyebrow は使わない。採番 (`SHEET 01`、`FIG. 01`) は図面の注記として mono 小文字サイズで置く

### Spacing

4 px grid を基準とする。

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px`

`--saba-gutter` (1.4rem) が frame 内の水平余白、`--saba-sheet-margin` が紙の外周余白。

### 罫線

- 太罫 (`--saba-border-strong`, 1〜1.5px): frame、header / footer の区切り、prose の h2 上罫
- 細罫 (`--saba-border`, 1px): 行区切り、表、panel
- frame は外周 1.5px + 内側 1px (`outline`) の二重線

### Motion

- UI interaction: 150 ms (border-color のみ)
- hover で要素を動かさない (translate、scale を使わない)
- `prefers-reduced-motion: reduce` を常に尊重する

## Components

Public class は `saba-` prefix を必須とする。

- `.saba-sheet`: 図面 frame。header / main / footer を包む
- `.saba-site-header`, `.saba-brand`, `.saba-nav`, `.saba-theme-switcher`
- `.saba-fig` (`__no`, `__thumb`, `__title`, `__desc`, `__body`): 採番付きの行
- `.saba-hatch`: hatching 面
- `.saba-card`, `.saba-panel`: 細罫の面。影と角丸を持たない
- `.saba-chip`: `[ label ]` 形式の mono ラベル
- `.saba-button`, `.saba-button--primary`, `.saba-input`
- `.saba-titleblock` (`__rev`): 表題欄
- `.saba-site-footer`
- `.saba-page`, `.saba-prose`, `.saba-grid`, `.saba-grid-background` (方眼)
- `saba-sea.css` / `saba-sea.js` (optional): `.saba-sea-bg`, `.saba-tank`, `.saba-fish`。後述の「海 component」

Site 固有 class は `@layer site` で定義し、共通 component より後に上書きする。inline style は使わない。

## Page profiles

### Portfolio (図面)

- `.saba-sheet` で全体を frame に入れる
- hero は採番注記 + mono 見出し
- 作品は `.saba-fig` で採番して列挙し、thumb は `.saba-hatch`
- footer に表題欄

### Documentation (仕様書)

- `.saba-sheet` で frame に入れ、左に目次 (節番号付き)、右に `.saba-prose`
- 見出しは節番号を content に持つ (`1. セットアップ`)
- content measure は 48 rem を既定とする
- 方眼は使わない

### Application (計器盤)

- frame は使わず全面を workspace にする。header と sidebar の区切りは太罫
- sidebar の現在項目、metric の mark は inverse video
- panel は `.saba-panel`、panel 見出しは mono + 細罫
- 最下部に mono の status strip (application 固有 CSS)
- 共通 CSS に application 固有の sidebar 幅等を入れない

## 海 component (saba-sea)

`src/saba-sea.css` と `src/saba-sea.js` は saba.css とは独立した optional の component で、背景の模様と画面下の帯 (水槽) に魚を泳がせる。利用側は両 file を vendor し、`body` の data 属性で組み合わせを選ぶ。JavaScript が背景と帯の DOM を生成するため HTML に要素を置く必要はない。

```html
<link rel="stylesheet" href="assets/vendor/saba-sea.css">
<body data-sea="tide" data-sea-style="pixel" data-fish="saba">
  ...
  <script src="assets/vendor/saba-sea.js" defer></script>
</body>
```

| 属性 | 値 | 役割 |
| --- | --- | --- |
| `data-sea` | `tide` (潮: 鯖縞が流れる) / `deep` (深海: marine snow) / `tank` (水槽: ガラスの反射線、砂と水草) | 背景と帯の模様。無いと component は何もしない |
| `data-sea-style` | `pixel` (既定) / `ascii` / `mono` / `modern` / `calm` / `pop` / `blueprint` | 魚の描画方式 (pixel sprite / 文字 / 線画 / 塗り)、帯と背景の色、動きの速さ |
| `data-fish` | `none` / `saba` / `kingyo` / `medaka` / `fugu` / `kurage` / `tai` / `ika` | 魚の種類。`none` は帯を出さず背景だけ (魚なし版) |

規約:

- 画像を使わない。魚は grid 文字列、文字列、SVG path から描く
- 色は `--saba-sea-*` token で持ち、雰囲気ごとに light / dark の値を定義する。ページ本体の書体や枠は saba.css の責務であり、component は変更しない
- 帯の上で pointer が近づく、click / tap する、待機中の一定確率、のいずれでも反応する。反応は「飛び出し (しぶき) / dash と気泡 / 向きを変える」からランダムに選ぶ。フグは膨らむ、クラゲは拍動して浮く、イカは墨を吐いて逃げる
- sprite は頭が左向きで、右へ進むときだけ反転する。イカは後ろ向きに泳ぐ
- `prefers-reduced-motion: reduce` では背景・波・尾びれ・飛び出しを止め、向きの変更だけ残す。print では表示しない
- `window.sabaSea.setup()` で属性の変更を反映できる

sample は `examples/sea.html` (切替 UI 付き) と `examples/portfolio.html` (既定の組み合わせ)。

## Theme

共通 CSS は以下を扱う。

1. light token (製図用紙)
2. `prefers-color-scheme: dark` (青焼き)
3. `data-theme="light|dark"` による明示 override

Theme selector の保存方法や toggle UI は site 側の責務とし、CSS に JavaScript dependency を持たせない。

checkpoint sample では `examples/assets/theme.js` を site 側 helper の例として使用する。`auto` は `data-theme` を削除して OS 設定へ追従し、`light` / `dark` は利用者の選択を local storage に保存する。JavaScript が無効または storage が利用できない場合も CSS の `prefers-color-scheme` だけで成立させる。この helper は `src/saba.css` の public component API には含めない。

## Accessibility

- `:focus-visible` を定義する
- navigation の現在位置は `aria-current="page"` を使用する
- state を色のみで表現しない (inverse video、下線、採番で示す)
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

公開 artifact は repository 内の CSS、HTML、JavaScript だけで完結させる。次を使用しない。

- CDN または外部 host の stylesheet / script / font
- CSS `@import`
- JavaScript package または module import
- npm / pip 等による build dependency

CI と deployment に使用する GitHub Actions および `dotfiles` は runtime dependency に含めず、commit SHA で一意に固定する。

## License

Apache License 2.0 を適用する。配布する `src/saba.css` には SPDX identifier と copyright notice を付与する。
