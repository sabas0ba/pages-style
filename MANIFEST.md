# Bundle Manifest

GitHub Pages Design System checkpoint 1 の Codex 引き継ぎ用バンドル。

## Files

- `HANDOFF.md` — 詳細な引き継ぎ文書
- `CODEX_PROMPT.md` — Codex にそのまま渡せる作業指示
- `DESIGN.md` — checkpoint 1 design rules
- `saba.css` — shared CSS draft
- `index.html` — sample index
- `portfolio.html` — Portfolio / Landing sample
- `docs.html` — Documentation sample
- `app.html` — Application / Tool sample
- `theme.js` — sample 用 theme override helper
- `SHA256SUMS` — 各ファイルの SHA-256

展開後の working tree には、再現可能な検証経路として `flake.nix`、`flake.lock`、`nix/`、`scripts/`、`Makefile` も追加している。`SHA256SUMS` は ZIP の原本ではなく、現在の checkpoint ファイルを対象とする。

## Codex への渡し方

`CODEX_PROMPT.md` と `HANDOFF.md` を読み、記載された開発規約・branch・checkpoint 方針に従って作業を続行するよう指示する。
