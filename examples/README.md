# Design review samples

`examples/` は `src/saba.css` の public API を検証するための静的ページです。配布物には含めません。`assets/theme.js` も sample 側の実装例であり、CSS API の一部ではありません。

## Profiles

| Page | Purpose | Main review points |
| --- | --- | --- |
| `portfolio.html` | Portfolio / Landing | dot grid、cards、chips、mono typography |
| `docs.html` | Documentation | text measure、navigation、code、table、blockquote、print |
| `app.html` | Application / Tool | panels、form controls、workspace、overflow、status |

## Review matrix

各ページについて次を確認します。

1. `auto` / `light` / `dark`
2. desktop width と mobile width
3. Tab 移動、focus ring、skip link
4. `prefers-reduced-motion: reduce`
5. JavaScript 無効時の OS theme fallback
6. mobile で horizontal overflow がないこと

`index.html` から各ページへ移動できます。外部 asset、web font、build step は不要です。
