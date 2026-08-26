# pages-style

`sabas0ba` 配下の GitHub Pages で再利用する CSS design system の checkpoint 1 です。実装、検証用 sample、test、設計資料を分離しています。

## Repository layout

```text
src/                    配布対象の実装
  saba.css              `saba-` prefix の CSS API
examples/               design review 専用の静的 sample
  assets/theme.js       sample 用 theme override helper
  index.html            sample index
  portfolio.html        Portfolio / Landing
  docs.html             Documentation
  app.html              Application / Tool
tests/                  自動検査
docs/                   active design document
  handoff/              初期 handoff の履歴資料
```

`examples/` は利用側の実装例であり、配布対象ではありません。public implementation は [src/saba.css](src/saba.css) だけです。

## Design review

ブラウザで [examples/index.html](examples/index.html) を開き、次の組み合わせを確認します。詳細は [examples/README.md](examples/README.md) を参照してください。

- Portfolio / Documentation / Application
- auto / light / dark
- desktop / mobile
- keyboard focus / skip link
- reduced motion / no-JavaScript fallback

## Development environment

開発ツールは、このリポジトリへ重複して定義せず `sabas0ba/dotfiles` の固定済み Nix environment を使用します。両リポジトリを `~/repos` 直下に配置した場合は次の手順です。

```console
$ nix develop ../dotfiles
$ make check
```

配置が異なる場合は `DOTFILES_REPO` を指定します。

```console
$ make check DOTFILES_REPO=/path/to/dotfiles
```

`make check` は dotfiles の environment check を先に実行し、その後 `tests/check-static.sh` を実行します。npm、pip、web font、external theme dependency は使用しません。

## Scope

この checkpoint は design API と 3 use case の確認用です。既存の `sabas0ba/sabas0ba` profile page への適用と distribution 方針の固定は、checkpoint review 後に行います。設計規約は [docs/design.md](docs/design.md) を参照してください。
