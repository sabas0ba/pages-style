# pages-style

`sabas0ba` 配下の GitHub Pages で再利用する CSS design system の checkpoint 2 です。ページを 1 枚の図面として組む意匠 (frame、罫線、採番、表題欄。dark は青焼き) を採り、実装、検証用 sample、test、設計資料を分離しています。

## Repository layout

```text
src/                    配布対象の実装
  saba.css              `saba-` prefix の CSS API
  saba-sea.css          optional: 海と魚 (saba-sea.js と組)
  saba-sea.js           optional: 海と魚の動作
examples/               design review 専用の静的 sample
  assets/theme.js       sample 用 theme override helper
  index.html            sample index
  portfolio.html        Portfolio (図面)
  docs.html             Documentation (仕様書)
  app.html              Application (計器盤)
  sea.html              Sea component (海 × 雰囲気 × 魚の切替)
tests/                  自動検査
scripts/                Pages artifact 生成
.github/workflows/      CI と Pages deployment
docs/                   active design document
  handoff/              初期 handoff の履歴資料
LICENSE                 Apache License 2.0
```

`examples/` は利用側の実装例であり、配布対象ではありません。public implementation は [src/saba.css](src/saba.css) だけです。

## Design review

公開sampleは <https://sabas0ba.github.io/pages-style/> です。ローカルでは [examples/index.html](examples/index.html) を開き、次の組み合わせを確認します。詳細は [examples/README.md](examples/README.md) を参照してください。

初回deployment前にrepositoryの **Settings → Pages → Source** を **GitHub Actions** に設定します。公開範囲はrepository visibilityとGitHub planのPages設定に従います。

- Portfolio / Documentation / Application / Sea
- auto / light / dark
- desktop / mobile
- keyboard focus / skip link
- reduced motion / no-JavaScript fallback

## Usage

`src/saba.css` を利用側repositoryへvendorし、取得元のcommit SHAを記録します。latest URLをruntimeから直接参照しません。

```html
<link rel="stylesheet" href="assets/vendor/saba.css">

<div class="saba-sheet">
  <header class="saba-site-header">...</header>
  <main>
    <article class="saba-fig">...</article>
  </main>
  <footer class="saba-site-footer">...</footer>
</div>
```

海と魚を出す場合は `src/saba-sea.css` と `src/saba-sea.js` も vendor し、`<body data-sea="tide" data-sea-style="pixel" data-fish="saba">` のように指定します。魚なし版は `data-fish="none"` です。

tokens、components、page profiles、海 component は [docs/design.md](docs/design.md) を参照してください。

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

`make check` は dotfiles の environment check を先に実行し、その後 shellcheck、shfmt、静的sample、Pages artifact、workflow pinを検査します。環境検査とtestを切り分ける場合は、dotfilesのNix shell内で`make test`を使用します。

```console
$ make pages  # .work/pages に公開用artifactを生成
```

CIもcommit SHAで固定した`dotfiles`からcontainer imageを構築し、runtime networkを無効化して`make check`を実行します。

## Dependencies

公開するCSS、HTML、JavaScriptには外部runtime dependencyがありません。npm、pip、CDN、web font、external theme、JavaScript library、CSS `@import`を使用せず、検査で再混入を拒否します。GitHub ActionsとCI用dotfilesはbuild-time dependencyとしてcommit SHAで固定しています。

## License

Apache License 2.0です。詳細は [LICENSE](LICENSE) を参照してください。

## Scope

この checkpoint は図面の意匠での design API と 3 use case の確認用です。既存の `sabas0ba/sabas0ba` profile page への適用と distribution 方針の固定は、checkpoint review 後に行います。設計規約は [docs/design.md](docs/design.md) を参照してください。
