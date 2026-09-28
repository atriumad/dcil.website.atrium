Don Chuy's Fresh Mex & Cantina: family recipes from León, Mexico, served with a modern twist in Overland Park KS, Lee's Summit MO, Johnson City TN and, soon, O'Fallon IL. The brand is warm, loud in the right places and never stiff. **v4 direction — "cantina editorial":** the colours of the real don-chuys.com (rose, CTA red, deep red, teal, navy, marigold on white), laid out like a modern restaurant site: photo-led heroes on a colour band, flat full-bleed colour blocks next to talavera-tile collage panels with polaroids and postmark stamps, a multicolour fiesta tile band, flower accents and sunbursts — plus the packaging language (WordStack, stickers, crumbs) for campaigns and specials.

## Content fundamentals

- **Voice:** a friendly host, not a menu card. Short, upbeat, inclusive. We talk to guests as "you" and about ourselves as "we"/"our family".
- **Real copy to model:** "Ready for some real-deal Mexican flavor?" · "Come for the food, stay for the fun!" · "From sizzling specials to family favorites" · "We are proud to use the freshest ingredients" · "Fast fresh & delicious" · "Every day a special — all day".
- **Casing:** display headlines, pills, eyebrows and posters are ALL CAPS. Body, ledes and buttons are sentence/title case ("View Menu", "Get Directions").
- **Headline formula:** 2–5 words in `display-*` (Eudora), with ONE small word as a Yellowtail script accent in `script-ink`: FAMILY *roots*, BIG FLAVOR · FRESH *off* THE GRILL · STAY IN THE *loop*. In components write it as `Family *roots*, big flavor`.
- **Script voice:** Yellowtail lines are the brand talking out loud — short, lowercase, playful, Spanglish welcome: *sassy salsa!* · *three per order* · *sizzling!* · *salud!* · *from our casa to yours*. Max one script line per block.
- **Sticker voice:** labels are black italic caps, 2–3 words per line: LET'S TACO / 'BOUT IT · SASSY / SALSA · FROM $7.
- **The `!` swap** (LUNCH T!ME, DA!LY SPEC!ALS) is built into Eudora's lowercase `i`: it appears in every display headline, never in body copy.
- **Spanish:** dish names stay in Spanish with accents (Pulpo Zarandeado, Camarones Zarandeados, Burrito Michoacano). A short English description goes underneath. Section eyebrows may be Spanish ("Nuestra historia").
- **Prices:** `$10`, `$5.75`, `$13.50`. Always with the dish. Only real, current prices go live.
- **Emoji:** none. The `sparkle` icon is our separator and bullet. One exclamation mark per section at most.

## Visual foundations

### Color — the site palette
- **Page:** `surface` (white, as on don-chuys.com). Alternate sections with `teal-100`, `marigold-100` or `rose-100`; `cream` only for collage/paper blocks.
- **Brand colours (from the site):** `chuy-rose` (wordmark, hero band, footer, marquee, tabs), `chuy-red` (primary CTA and active nav only), `deep-red` (display headlines), `teal` / `teal-surface` / `teal-700` (accent, specials board, newsletter), `navy` (day pills, secondary buttons, deep fields), `marigold` (colour blocks, stickers, flowers).
- **Colour blocks:** ColorSplit and promo fields in `marigold`, `chuy-rose`, `teal-700`, `navy` — flat, square, full-bleed.
- **Ratio per page:** ~60% `surface`, ~25% colour blocks (rose/teal/navy), ~15% marigold and red accents. One loud colour block per screen.
- **Text pairs:** `ink` on light grounds; `deep-red` for display on `surface`/tints and on `marigold`; `teal-ink` for eyebrows and icons; `on-dark` on rose, red, teal-700, navy; `ink`/`navy`/`deep-red` on `marigold`.
- **Limits (site values kept exact):** `teal` text and white on `teal-surface` only at 24px+; white on `marigold` never.
- `sage`, `sage-alt`, `ornament`, `agave` stay for social posters only.

### Type — Eudora + Yellowtail + Figtree
- **Eudora** (`display-2xl`…`display-s`): the brand's own face (Runsell Studio; the "DON CHUY'S" wordmark and the poster lettering). Always rendered through its **lowercase set** — clean hand-drawn caps with the brand alternates (underlined o/u/d, and `i` drawn as `!`, which gives LUNCH T!ME and DA!LY SPEC!ALS for free). Type headlines in normal case; components apply `text-transform: lowercase`. The uppercase set is swash caps: use at most one swash initial per headline (`.dc-swash`).
- Eudora has no punctuation, `$`, `&` or accents: those characters fall back to **Bebas Neue**, which matches its weight and width. Keep headlines short and avoid `&` in them (write "and").
- `i` always draws as `!`. For a headline where that hurts reading (long Spanish words), rephrase or set it in `display-s` sans instead.
- **Yellowtail** (`script-*`): the handwritten voice — headline accents, kickers, notes, stickers. Lowercase, rotated −4° to −10°, `script-ink` on light grounds, `marigold` on colour blocks.
- **Figtree** (`body-lg`, `body`, `h-sans`, `eyebrow`, `label`, `nav`, `button`, `sticker`, `price`, `item`, `small`, `caption`): everything you read and click.
- **Mobile sizes:** display-2xl 64 · display-xl 56 · display-l 44 · display-m 36 · script-xl 44 · body-lg 17.
- **Licence:** Eudora is a commercial font supplied by the brand; confirm the licence covers web embedding before launch. Yellowtail, Figtree and Bebas Neue are SIL OFL.

### Shape, borders, shadows
- **Flat and square:** colour blocks, heroes, bands and tiles are full-bleed with square corners. Buttons, inputs and tabs use the site's `radius-sm` (4px) with small uppercase labels. Pills stay for tags and day labels.
- **Lines:** 1px `line` for cards and inputs; no heavy ink outlines.
- **Shadows:** `shadow-card` for lifted cards and deals; `shadow-plate` under round dish photos; polaroids carry a soft photo shadow. No hard offset shadows on web UI.

### Layout & spacing
- Container `container-max` (1240px) with `gutter-desktop` / `gutter-mobile` sides; reading width `container-narrow`.
- Section rhythm: `space-8` (80px) between sections on desktop, `space-7` (48px) on mobile; `space-9` around heroes and promos.
- Grids: dishes 3-up, locations 4-up, menu 2 columns; collapse at `bp-lg` → `bp-sm` → 1.

### Motion
- Quick and springy: 180ms `cubic-bezier(.2,.8,.2,1)` for hovers (buttons lift, arrows nudge, plates rotate 8°).
- Ambient motion only in the `Marquee` (40s loop) and `Stamp` (22s spin). Plates in `WordStack`, `CategoryGrid` and `DishCard` rotate on hover. Everything stops under `prefers-reduced-motion`.
- No parallax, no scroll-jacking, no fade-in on every element.

### Imagery
- Top-down plates cut into circles on tile or sage, with `shadow-plate`. Wide table spreads in arches or rounded frames.
- Real Don Chuy's food on real plateware (talavera blue-rim, speckled stone, cast iron on wood). No stock people, no generic "Mexican" props.
- See **Photography** for the approved crops from the brand's own shoots.

## Editorial elements (v4)

- **Fiesta tile:** original multicolour talavera tile (teal lattice, rose/marigold flower, red centre, navy corners) as `TileBand` under heroes, above the footer and as the collage ground in `ColorSplit`.
- **Photo hero:** centred Ultra headline with a script accent, two CTAs, then a wide photo sitting on a `chuy-rose` band, flowers in the corners and a postmark stamp.
- **ColorSplit:** a flat colour block with the story next to a tile panel holding a taped polaroid, a label sticker, a postmark and a flower. Alternate sides down the page.
- **Flower:** original 8-petal rose/marigold flower with a red centre, max two per section, at section corners.
- **Sunburst:** marigold, rose or teal rays behind a round plate for promos.
- **Postmark stamp:** outline rose seal ("DESDE LEÓN · FRESH MEX") overlapping photo corners.

## Creative elements (packaging language)

- **WordStack:** one food word ×3 in Ultra (solid / outline / solid) filling a colour field, a cut-out plate on top, script kicker, 1 sticker, crumbs. The brand's signature — use in the hero, poster cards and between sections.
- **Stickers:** `label` (cream paper, navy/rose italic caps), `script` (Yellowtail with paper outline), `burst` (starburst price), `seal`, `tape`. Max two per composition, always on image or colour, never over reading text.
- **BrandPaper:** the printed wrapping paper (brand phrases + icons at half strength) as a frame around the specials board, a plate or a promo. One per page.
- **Crumbs:** leaf/chip/dot bits in agave, chuy-red, marigold and sage around food only.
- **Colour fields for posters:** agave, chuy-rose, marigold, sage — never new greens or brand-outside colours.

## Iconography, patterns & ornaments

- **Icons:** the original **Icons** set (22 line icons, 24px, 2px round stroke, `currentColor`). Use via the `Icon` component; the SVG files are drawn in `ink` (#222222) for use in `<img>`.
- **Patterns:** **Patterns** holds original single-ink tiles — `talavera-tile` (geometric four-petal tile), `doodles` (the food icons scattered), `diamond`, `scallop`. Use them through `Pattern` / `TileBand`, coloured by a token, always behind content at low contrast.
- The poster ornaments in **Imagery** remain the reference for campaign art; the web uses the tile patterns instead of redrawing them.
- No logo files yet: `NavBar` and `Footer` set "Don Chuy's" in the display face until the official badge and wordmark are added.

## Components

Foundations `Icon` · Actions `Button`, `Pill` · Editorial `ColorSplit`, `Flower`, `Sunburst` · Creative `WordStack`, `Sticker`, `Crumbs`, `BrandPaper`, `PosterCard` · Decoration `TileBand`, `Pattern`, `Stamp`, `Marquee` · Media `PhotoFrame` · Navigation `NavBar`, `CategoryTabs` · Sections `Hero`, `SectionHeader`, `ValueProps`, `FeatureSplit`, `PromoBanner`, `LocationCard`, `SocialGrid` · Menu `CategoryGrid`, `DishCard`, `MenuItem`, `MenuSection`, `SpecialRow`, `SpecialsBoard` · Forms `Input`, `Newsletter` · Layout `Footer` · Pages `HomePage` (how it all composes). Page recipes are in **Web page templates**.
