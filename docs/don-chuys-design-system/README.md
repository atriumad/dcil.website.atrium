# Don Chuy's — Design System v5 ("cantina editorial")

Everything needed to design and build the Don Chuy's Fresh Mex & Cantina website.

## Start here
- **showcase/index.html** — open in a browser: every component live, the full Home page and a light/dark toggle. Works offline.
- **brand-book.md** — voice, colour, type, shape, motion, imagery, editorial and packaging elements.
- **guidelines/** — page templates (Home, Menu, Specials, Locations, About, Catering) and responsive + accessibility rules.

## Folders
| Folder | What |
|---|---|
| `tokens/tokens.json` | Source of truth: don-chuys.com palette + tints (light + dark), type scale, spacing, radius, shadows, breakpoints, container, z-index |
| `tokens/tokens.css` | The same as CSS custom properties + a class per text style + @font-face |
| `fonts/` | **Eudora** (brand display face, Runsell Studio — supplied by the brand, commercial licence), Bebas Neue (fallback for Eudora's missing punctuation/accents), Yellowtail (script), Figtree (text) |
| `components/bundle.js` · `bundle.css` | 34 ready-to-use React 18 components → `window.DonChuys` |
| `components/index.d.ts` | Props for every component |
| `components/src/` | JSX source, icon data and CSS (rebuild with esbuild) |
| `components/<Name>/` | Usage guidelines (README.md) and the preview used in the showcase |
| `assets/icons/` | 22 original line icons (SVG) |
| `assets/patterns/` | fiesta-tile (multicolour, site palette), talavera-tile, doodles, diamond, scallop (SVG) |
| `assets/photos/` | Dish and table crops from Don Chuy's own shoots (replace with originals before launch) |
| `assets/imagery/` | The Lunch Time and Daily Specials posters (campaign reference) |

## Typography note
Eudora is always rendered through its **lowercase set** (`text-transform: lowercase`): clean hand-drawn caps with the brand alternates, and `i` drawn as `!` (DA!LY SPEC!ALS). The font has no punctuation, `$`, `&` or accents; those fall back to Bebas Neue automatically via the `--font-display` stack.

## Use in a page
```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
<script>
  const { Hero, ColorSplit, WordStack } = window.DonChuys;
</script>
```
Without React, use `tokens.css` + the `dc-*` classes in `bundle.css` and the SVG assets.

## Pending before launch
- Official logo files (badge): the name is set in Eudora for now.
- Confirm the Eudora licence covers web embedding.
- High-resolution food photography (ideally cut-outs for WordStack).
- Real menu prices: dish cards and menu sections in the showcase use sample prices. Specials and everyday drinks are real.
- Happy Hour schedule.
