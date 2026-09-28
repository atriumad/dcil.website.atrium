The brand's signature composition: one food word repeated in giant Eudora `display` type (solid / outline / solid), a cut-out plate on top, a Yellowtail script kicker, crumbs and stickers.

**Consumer provides:** `word` (one word, ≤9 letters: FAJITAS, TACOS, LUNCH, MARGARITA), `image` `{src, alt}` (top-down plate), `tone` (`agave` | `rose` | `marigold` | `sage` | `cream`), `lines` (3 default), `outline`, `script`, `stickers` `[{kind, text, tone, pos: 'tl'|'tr'|'bl'|'br'}]`, `crumbs`, `height`.

- Type auto-fits the container width; the plate covers the centre so the word reads at the edges.
- Max two stickers: one `label` or `burst` + the script kicker.
- Use as hero (`Hero variant="stack"`), inside `PosterCard`, or full-bleed between sections.
