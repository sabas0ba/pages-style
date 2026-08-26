# GitHub Pages Design System — Codex Handoff

## 1. 目的

`sabas0ba` 配下の GitHub Pages に存在する多数のアプリ・ドキュメントについて、見た目と UI の規約を統一する。

基準は `sabas0ba/sabas0ba` の GitHub Pages。単純コピーではなく、再利用可能な design tokens / components / layouts として抽出する。

対象 use case:

1. Portfolio / Landing
2. Documentation
3. Application / Tool

このバンドルは ChatGPT 側で作成した checkpoint 1 の静的サンプルと、Codex が続きを実装するための引き継ぎ情報をまとめたもの。

## 2. 対象リポジトリ

- Repository: `sabas0ba/sabas0ba`
- Default branch: `main`
- 作業用 branch: `feat/pages-design-system`
- branch は作成済み
- branch 作成時点の HEAD: `465b13439e323e5276fd8088c6378c35ff832d1a`

重要: checkpoint 1 の draft ファイルは GitHub branch へ push していない。この ZIP 内のファイルが現時点の draft。

## 3. 作業前に必ず読むもの

最新版を確認すること。

1. 対象リポジトリ内の `CLAUDE.md`（存在する場合。最優先）
2. `sabas0ba/dotfiles/CLAUDE.md`
3. `sabas0ba/dotfiles/docs/development.md`

共通規約として特に重要な点:

- Nix の開発環境を前提とする
- git branch または worktree 上で作業する
- 外部 shell script / fetch / package installation を無断で行わない
- npm / pip / uv 等の依存追加を無断で行わない
- 新規依存は原則不要
- 依存を追加する場合は SHA 等で一意に固定し、事前承認を得る
- 一時ファイルはリポジトリ配下の git ignored directory に置く
- Conventional Commits を使用する
- 変更後は既存の `make check` 等の検証経路を優先する
- 検査を通すために検査自体を削除・弱体化しない

## 4. 設計方針

既存 `sabas0ba/sabas0ba` から以下を継承する。

- dark-first の落ち着いた配色
- `#0d1117` 系 background
- `#151b23` / `#1c242e` 系 surface
- 細い border と弱い shadow
- OKLCH accent
- mono を UI 表現に利用
- 26px dot grid
- pill tag / chip
- 小さな radius
- hover は border + 微小 transform
- `prefers-reduced-motion`
- light / dark theme

`dotfiles` の文書 UI から以下を取り込む。

- system sans の本文
- mono の code
- `data-theme` と `prefers-color-scheme` の併用
- `focus-visible`
- skip link
- 文書向け line-height
- code / table / blockquote
- print styles
- 色だけで状態を表さない accessibility 方針

要点:

> 外観は `sabas0ba/sabas0ba`、文書としての挙動は `dotfiles` を基準にする。

## 5. checkpoint 1 の成果物

- `saba.css`: 共通 design system v0
- `portfolio.html`: Portfolio / Landing sample
- `docs.html`: Documentation sample
- `app.html`: Application / Tool sample
- `index.html`: sample index
- `DESIGN.md`: design rules

主な CSS API:

- `--saba-*` design tokens
- `.saba-page`
- `.saba-prose`
- `.saba-card`
- `.saba-panel`
- `.saba-chip`
- `.saba-button`
- `.saba-button--primary`
- `.saba-grid-background`

class / custom property は既存アプリとの衝突を避けるため `saba-` prefix を維持する。

## 6. 確定寄りのルール

### Typography

- body: system sans
- UI: mono
- heading: mono または site 用 UI
- code: mono
- Portfolio: body も mono 可

### Spacing

4px 系の段階値を利用する。例: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px。

### Radius

少数 token に限定: small / medium / pill。

### Theme

- OS theme に追従可能
- user override を可能にする
- component rule へ hex color を散在させない
- color は design token 経由

### Motion

- interaction: 約 150ms
- image / larger transition: 約 300ms
- `prefers-reduced-motion` 必須

### Accessibility

最低限:

- semantic HTML
- `:focus-visible`
- `aria-current`
- `aria-pressed`
- keyboard operation
- `prefers-reduced-motion`
- `prefers-color-scheme`
- 色だけで状態を表さない

## 7. 未確定事項

- `saba.css` single-file 維持か、tokens / base / components / docs / app へ分割するか
- Cascade Layers の最終構成
- Portfolio のランダム accent hue をどこまで残すか
- dedicated repository (`sabas0ba/pages-style` 等) への分離時期
- consuming repository への vendor 更新方式

推奨方向:

- API 固定前は過剰分割しない
- random hue は Portfolio 固有に留める
- Docs / App の operation color は固定
- shared CSS を live CDN のように直接参照しない
- consuming repo には revision を記録して vendor し、更新は明示的に行う

## 8. 次の作業

### Phase 1 — checkpoint 1 を branch に取り込む

1. `feat/pages-design-system` を checkout
2. 対象 repo の `CLAUDE.md` を確認
3. `dotfiles` の規約を確認
4. Nix dev shell に入る
5. repository が提供する environment check を実行
6. この bundle の draft を repository structure に合わせて配置
7. Pages workflow / asset path に合わせて調整
8. static samples を local / CI で確認

この段階では `main` の既存 Pages を壊さない。

### Phase 2 — `sabas0ba/sabas0ba` 自身へ適用

現行 `docs/index.html` の inline CSS / JS を次へ分離する。

- common design system
- profile-specific CSS
- profile-specific JS / markup

既存 appearance / interaction の変更は必要最小限とする。

### Phase 3 — design API 固定

Portfolio / Documentation / Application の 3 sample を使い、class naming / tokens / layout primitives を固定する。

### Phase 4 — dedicated repository 化を検討

API 固定後に必要なら `sabas0ba/pages-style` 等へ切り出す。最初から分離しない。

### Phase 5 — 段階的 rollout

最初に 1〜2 repository を pilot とする。全 repository 一括変更はしない。

## 9. 検証状況

checkpoint 1 で確認済み:

- HTML sample 3/3 parse
- CSS brace balance
- 必須 CSS API の存在

未完了:

- headless browser screenshot
- real browser visual regression
- accessibility scanner
- mobile screenshot regression

ChatGPT の作業環境では Chromium headless が DBus 周辺で終了せず、screenshot 自動取得を完了できなかった。

Codex 側に既存の browser / screenshot tool がある場合のみ利用してよい。新規依存追加は行わず、必要ならユーザーへ確認する。

## 10. 実装時の注意

- 現在の profile page を baseline とする
- redesign を目的にしない
- shared CSS に project-specific layout を入れすぎない
- app 固有 layout は consuming project 側へ残す
- docs の readability を mono 統一のために犠牲にしない
- CSS custom properties で theme を切り替える
- hard-coded colors の追加を抑える
- no-JS でも最低限成立させる
- reduced-motion を壊さない
- theme flash を避ける
- external web font を追加しない
- build dependency を追加しない

## 11. Git / PR 方針

推奨 commit 分割:

1. `docs: define pages design system`
2. `feat: add shared pages styles`
3. `feat: add pages design samples`
4. `refactor: apply shared styles to profile page`

PR には次を含める。

- 目的
- design system の scope
- before / after
- Portfolio / Docs / App sample
- light / dark
- desktop / mobile
- reduced-motion への影響
- 実行した検証

視覚変更なので取得可能なら screenshot を添付する。

## 12. 最初の PR の完了条件

- `sabas0ba/sabas0ba` の既存 Pages の見た目が大きく崩れていない
- shared design tokens が独立している
- 3 use case が表現できる
- CSS API が project-specific class に依存していない
- light / dark が成立する
- keyboard focus が見える
- reduced-motion が成立する
- mobile で横 overflow がない
- existing checks が成功する
- 新規 external dependency がない
