# Codex 作業指示: sabas0ba GitHub Pages Design System

この bundle の `HANDOFF.md` を最初に全文読むこと。

次に、作業開始前に最新版の以下を確認すること。

1. 対象 repository の `CLAUDE.md`（存在する場合。最優先）
2. `sabas0ba/dotfiles/CLAUDE.md`
3. `sabas0ba/dotfiles/docs/development.md`

## 目的

`sabas0ba/sabas0ba` の現行 GitHub Pages デザインを基準に、複数の GitHub Pages で再利用できる design system を整備する。

checkpoint 1 の draft として以下が含まれている。

- `DESIGN.md`
- `saba.css`
- `portfolio.html`
- `docs.html`
- `app.html`
- `index.html`

## 作業 branch

`feat/pages-design-system`

既に作成済み。`main` へ直接変更しない。

## 最初に行うこと

- repository 状態を確認
- `CLAUDE.md` を確認
- Nix dev shell に入る
- repository が提供する environment check を実行
- 現行 `docs/index.html` / Pages workflow / assets 構成を確認
- bundle の draft との差分を整理

## 制約

- 新規 package dependency を追加しない
- npm / pip / uv 等を無断で使わない
- external shell script を取得・実行しない
- web font を追加しない
- external theme dependency を追加しない
- existing check を削除・弱体化しない
- temporary files は repository 内の git ignored directory に置く
- commit は Conventional Commits
- 依存追加が必要なら作業を止め、候補・理由・固定 revision・security 調査事項を提示して承認を得る

## 実装方針

- `saba-` prefix の CSS API を維持する
- design tokens を CSS custom properties に集約する
- Portfolio / Documentation / Application の 3 use case を維持する
- `sabas0ba/sabas0ba` の現在の見た目を redesign しない
- `dotfiles` の文書 UI の readability / accessibility を取り込む
- `prefers-color-scheme`
- user theme override
- `prefers-reduced-motion`
- `focus-visible`
- keyboard operation
- no-JS fallback

を維持する。

## チェックポイント

既存 profile page へ適用する前に、3 sample の layout / tokens / component API を確認できる状態で一度止めること。

レビュー対象:

- Portfolio
- Documentation
- Application
- light / dark
- desktop / mobile

可能なら screenshot を生成し、作業報告または PR に添付する。既存環境に screenshot tool が無い場合、新規依存を追加せず、その旨を報告する。

## その後

checkpoint が承認されたら `sabas0ba/sabas0ba` 自身へ shared CSS を適用する。

現行 `docs/index.html` の inline CSS/JS を次へ分離する方向を優先する。

- common design system
- profile-specific CSS
- profile-specific JS / markup

既存 appearance / interaction の変更は必要最小限とする。

## 最終検証

repository 既定の check を実行する。`make check` が定義されている場合は必須。

検証結果、未検証事項、browser rendering の確認範囲を PR に明記する。
