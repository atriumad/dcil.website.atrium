# Design System v6 migration — "cantina de noche"

Date: 2026-10-06
Source of truth: `/Users/ventura/Downloads/Don Chuy's Brand Guide` (`index.html`, `tokens.css`, `bundle.css`, `img/`, `fonts/`)
Replaces: v5 "cantina editorial" (`docs/don-chuys-design-system/`, `app/tokens.css`, `app/dc.css`)

## Goal

Move the site from v5 (cream/paper, sage + agave, rounded, stickers, light/dark toggle) to v6 (single navy look, white Eudora titles, one marigold accent, straight corners, script limited to one word). Success: the site matches the brand guide, keeps WCAG AA contrast, and keeps the recent menu redesign, responsive hero and mobile scroll animations working.

## Scope

In: tokens, typography, theme, all `components/dc/*`, `app/dc.css`, `app/globals.css`, all 7 page groups (Home, Menu, Locations list + detail, About, Catering, Contact, Happy Hour), site metadata.
Out: copy, prices, hours, location data, routing, forms' server behavior. Guide pendings stay open and are not invented: vector logo, real menu prices, per-location specials, Eudora web license.

## Decisions

- Approach B: clean migration in layers. No compatibility aliases for v5 names, no adopting the guide's `bundle.js`.
- Single dark look. Remove `[data-theme]`, light/dark variants and the `dark` custom variant.
- Keep Next.js components in `components/dc`; port visuals from the guide's `bundle.css`.
- Fix the placeholder `metadata` ("Create Next App") during the page phase.

## Phase 1 — Foundation

- `app/tokens.css`: replace with v6 tokens. Colors `navy #194765`, `navy-900 #0e2f44`, `navy-700 #255b7e`, `white`, `ivory #f6f1e7`, `ivory-muted #c5d0d8`, `marigold #ed9d55`, `rose #9f3e49`, `teal #69968f`, `on-marigold`, `line`, `overlay`, `focus`. Plus space-1..9, radius none/sm/round, shadow plate/card, breakpoints, container, gutters, z-index. `@font-face` stays out (next/font injects fonts).
- Remove all v5-only tokens and their uses: `--shadow-sticker`, `--radius-pill`, `--cream`, `--ink`, `--agave`, `--chuy-rose`, `--on-dark`, etc.
- `app/globals.css`: map shadcn variables to navy (`--background` navy, `--foreground` ivory, `--primary` marigold, `--ring` marigold, `--border` line, `--radius` small). Drop the unused v5 `@theme inline` color utilities. Port the guide's text classes (`display-2xl..s`, `script-xl/l`, `lede`, `body`, `small`, `eyebrow`, `label`, `item`, `price`) with mobile sizes (68 / 56 / 44 / 36 px).
- `app/layout.tsx`: keep Eudora, Bebas Neue, Yellowtail, Figtree; add Figtree weight 600 (`item` style). Set `color-scheme: dark`.

## Phase 2 — Components

- Rewrite to the guide's `bundle.css`: Button, Pill, NavBar, CategoryTabs, SectionHeader, Hero, DishCard, CategoryGrid, MenuItem/MenuSection, SpecialRow/SpecialsBoard, FeatureSplit, PromoBanner, LocationCard, SocialGrid, Newsletter, Footer, PhotoFrame, Input, ValueProps, Crumbs.
- Add: `Statement`, `Logo` (min width 56px, clear space a quarter of its width, only on navy, navy-900, rose or dark photo).
- Keep, restyled tone-on-tone: Marquee, Flower, TileBand, Pattern.
- Remove: Sticker, Stamp, Sunburst, WordStack, BrandPaper, ColorSplit, PosterCard, and their CSS and exports in `components/dc/index.ts`.
- Script rule: components render Yellowtail only for a single word; more than one word falls back to normal text.
- Preserve behavior: `InViewObserver`, menu scroll-spy and photo breaks, responsive hero photo, hover gating for touch devices. Only colors, shapes and type change.

## Phase 3 — Pages

- Rework each page onto v6 components. Rules: one marigold accent moment per view; at most one `rose` block per page; photos as arch (outlined), circle (dishes) or straight frame; titles 2–5 words; max two script words per page.
- Content unchanged. Replace removed components with v6 equivalents (e.g. PosterCard grids become CategoryGrid).
- Add guide photos from `img/` only where a page lacks imagery; reuse the existing optimized image pipeline.
- `metadata`: real title and description for the site and per page.

## Phase 4 — Verification

- `tsc --noEmit`, ESLint, Vitest, `next build`.
- Contrast per the guide's table (marigold text on navy only at 19px bold+ or as lines/icons; no marigold text on navy-700; no ivory-muted on rose).
- Visual check at 390px and 1280px for every page: no horizontal scroll, focus ring (2px marigold, 3px offset) on all interactive elements, mobile entrance animations still fire.

## Delivery

One commit per phase so any phase can be reverted alone. Before writing code, read the relevant guide in `node_modules/next/dist/docs/` (AGENTS.md).

## Risks

- 340 CSS variable uses in `dc.css` reference v5 names; a missed rename renders as unset color. Mitigation: grep for removed token names must return zero before Phase 2 ends.
- Removed components are used on Home; Home needs a layout pass, not a find-and-replace.
- Eudora has no punctuation, `$`, `&` or accents; the Bebas Neue fallback must stay in the display stack.
