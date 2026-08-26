# pages-style

`sabas0ba` 配下の GitHub Pages で再利用する design tokens、components、page profiles の checkpoint 1 です。

## Samples

- `index.html` — sample index
- `portfolio.html` — Portfolio / Landing
- `docs.html` — Documentation
- `app.html` — Application / Tool
- `saba.css` — `saba-` prefix の共通 CSS API
- `theme.js` — sample 用の theme override helper

`index.html` をブラウザで開くと各 sample を確認できます。確認項目は light / dark、desktop / mobile、keyboard focus、reduced motion です。

## Development

開発環境は `sabas0ba/dotfiles` と同じ固定済み nixpkgs revision を使用します。

```console
$ nix develop
$ scripts/check-env.sh
$ make check
```

新規の npm、pip、web font、external theme dependency は使用しません。設計規約と handoff の詳細は `DESIGN.md` および `HANDOFF.md` を参照してください。

## Scope

この checkpoint は design API と 3 use case の確認用です。既存の `sabas0ba/sabas0ba` profile page への適用と distribution 方針の固定は、checkpoint review 後に行います。
