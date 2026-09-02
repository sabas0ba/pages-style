# Design review samples

`examples/` は `src/saba.css` の public API を検証するための静的ページです。配布物には含めません。`assets/theme.js` も sample 側の実装例であり、CSS API の一部ではありません。

公開URL: <https://sabas0ba.github.io/pages-style/>

Source repository: <https://github.com/sabas0ba/pages-style>

## Profiles

| Page | Purpose | Main review points |
| --- | --- | --- |
| `portfolio.html` | Portfolio (図面) | frame、採番行、hatching thumb、chip、表題欄 |
| `docs.html` | Documentation (仕様書) | 目次、節番号、text measure、code、table、blockquote、print |
| `app.html` | Application (計器盤) | 太罫の区切り、inverse video の状態、panel、form control、terminal、status strip |

## Review matrix

各ページについて次を確認します。

1. `auto` / `light` / `dark`
2. desktop width と mobile width
3. Tab 移動、focus ring、skip link
4. `prefers-reduced-motion: reduce`
5. JavaScript 無効時の OS theme fallback
6. mobile で horizontal overflow がないこと
7. dark が青焼き (紙の切り替え) として成立していること

`index.html` から各ページへ移動できます。公開artifactは`make pages`で生成します。ブラウザruntimeでは外部asset、web font、library、CDNを使用しません。
