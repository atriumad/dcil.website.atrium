Site header. `cream` variant (v4 default): a flat white bar with a hairline bottom border, wordmark left, uppercase links, active link in `chuy-red` with an underline, red CTA right. `rose`: the classic full-width `chuy-rose` bar from the current site.

**Consumer provides:** `links`, `active`, `brand` (logo element; defaults to the name in the display face), `cta` + `ctaHref` (or `null`), `variant`.

- Under 768px of its container the links collapse into a menu button that opens a dropdown panel.
- Make it sticky with `z-sticky` and 16px from the top.
- v2 order: Menu, Specials, Happy Hour, Locations, About + Order Online.
