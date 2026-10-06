# Design System v6 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Don Chuy's site from design system v5 ("cantina editorial", cream/sage/agave, rounded, stickers, light+dark) to v6 ("cantina de noche": single navy look, white Eudora titles, one marigold accent, straight corners, script limited to one word).

**Architecture:** Replace the token layer (`tokens.css`, `type.css`, `globals.css`), then replace the component CSS with the Brand Guide's own `bundle.css` split into three files (assets, components, site-specific), then rewrite each `components/dc/*` React component to match the guide's v6 DOM (reference implementation: the guide's `bundle.js`), then rebuild the 7 page groups on a shared `SiteHeader`/`SiteFooter`. Existing behavior (menu scroll-spy and filters, touch scroll animations, responsive hero, inquiry forms, SEO/JSON-LD) is preserved; only colors, shapes, type and DOM change.

**Tech Stack:** Next.js 16.3.5 (App Router, `next/font`, `next/image`), React 19.2.8, Tailwind CSS 4, Vitest 5 + Testing Library (jsdom), TypeScript 5, zod.

**Spec:** `docs/superpowers/specs/2026-10-06-design-system-v6-design.md`
**Reference (source of truth):** `/Users/ventura/Downloads/Don Chuy's Brand Guide` (`index.html`, `tokens.css`, `bundle.css`, `bundle.js`, `img/`, `fonts/`). Task 1 copies it into the repo at `docs/don-chuys-brand-guide-v6/`.

## Global Constraints

Every task's requirements implicitly include this section. Values copied from the spec and the guide.

- `AGENTS.md`: this is NOT the Next.js you know. Before writing code read `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, `12-images.md`, `13-fonts.md`, `14-metadata-and-og-images.md`, and `03-api-reference/04-functions/generate-viewport.md`. Heed deprecation notices.
- Single dark look. No `[data-theme]`, no light variant, no `dark` custom variant. `color-scheme: dark`.
- Palette (exact): `navy #194765`, `navy-900 #0e2f44`, `navy-700 #255b7e`, `white #ffffff`, `ivory #f6f1e7`, `ivory-muted #c5d0d8`, `marigold #ed9d55`, `rose #9f3e49`, `teal #69968f`, `on-marigold #0e2f44`, `line rgba(246,241,231,.22)`, `overlay rgba(14,47,68,.62)`, `focus #ed9d55`.
- Contrast: marigold text on navy only at 19px bold or larger, or as lines/icons (4.48:1). No marigold text on `navy-700`. No `ivory-muted` text on `rose` (use `ivory`). All titles white.
- Fonts: Eudora for titles, always through its lowercase set (`text-transform: lowercase`), Bebas Neue stays in the display stack as fallback for punctuation/`$`/`&`/accents. Figtree for text (weights 400/500/600/700/800). Yellowtail only for ONE word; at most two script words per page. Components must render plain text if given more than one word.
- Shape: radius `0` (buttons, cards, inputs) or `2px` (pills); photos are arch (marigold outline offset 16px), circle (dishes, `--shadow-plate`) or straight frame.
- One marigold accent moment per view. At most ONE `rose` block per page.
- Focus ring: `2px solid var(--focus)`, `outline-offset: 3px`, on every interactive element.
- Logo: only on navy, navy-900, rose or dark photo; min width 56px; never recolored.
- Copy: keep existing copy, prices, hours and location data. No emojis, no exclamation marks in new copy, no invented prices/hours/offers. Allowed copy edits (listed in Task 9/10): shorter hero/page titles taken from the guide's Home template, `Daily Specials` / `Happy hour` instead of the v5 `DA!LY SPEC!ALS` / `HA!PPY HOUR` (Eudora draws `i` as `!` natively), Newsletter lede from the guide.
- Commit trailer on every commit: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Inputs and conditions the spec implies but no happy-path task would exercise. Each has a pinning test in the task named.

1. **Multi-word script.** `script="from our casa"` or `*two words*` must render as normal text, never Yellowtail (Task 3 `renderAccent`/`scriptWord`; Task 4 `SectionHeader`; Task 7 `Hero`).
2. **Leftover v5 tokens.** A `var(--ink)`/`var(--cream)` that survives renders as unset color (invisible text). A guard test fails on any removed token in any app CSS file (Tasks 1 and 2).
3. **Coming-soon location** (no address, phone or hours): `LocationCard` shows the badge and no CTA; `Footer` prints "Coming soon" (Tasks 6 and 8).
4. **Menu edge cases.** Filtering to zero results shows the empty message; photo breaks hide while filtering; the sticky chip bar offset must match the new nav height (Task 11).
5. **Missing images.** `PhotoFrame` with no `src` shows the utensils placeholder; `CategoryGrid` item without `image` falls back to its icon; `Hero` without `mobileImage` renders a single background image (Tasks 5, 7, 8).

## File Structure

| File | Responsibility |
|---|---|
| `app/tokens.css` (rewrite) | v6 tokens only: color, space, radius, shadow, breakpoints, container, z-index |
| `app/type.css` (new) | v6 text classes (`display-*`, `script-*`, `lede`, `body`, `small`, `eyebrow`, `label`, `item`, `price`) with mobile sizes |
| `app/globals.css` (rewrite) | Tailwind imports, shadcn variables mapped to navy, font stacks, base layer |
| `app/dc-assets.css` (new, generated) | Guide `bundle.css` lines 1-12: pattern masks, logo badge, flower images (data URIs) |
| `app/dc-components.css` (new, generated) | Guide `bundle.css` lines 13-end: the v6 component rules |
| `app/dc-site.css` (new) | Site-only: hero image swap, panels/quotes/notes, menu page `.mn-*`, touch motion |
| `app/dc.css` (delete) | v5 component CSS |
| `app/layout.tsx` (modify) | Figtree 600, real metadata, viewport theme color |
| `lib/styles.test.ts` (new) | Guard: v6 tokens present, no removed v5 tokens, contrast pairs |
| `vitest.setup.ts` (modify) | Mock `next/image` to a plain `<img>` |
| `components/dc/utils.tsx` | `cx`, `scriptWord`, `renderAccent`, `isInternal`, `toLink`, types |
| `components/dc/icon.tsx` | Icon, default stroke 1.5 |
| `components/dc/button.tsx`, `pill.tsx`, `eyebrow.tsx` (new), `section-header.tsx` | Primitives |
| `components/dc/decor.tsx` | TileBand, Pattern, Logo, Flower, Marquee (Stamp/Sunburst/Crumbs removed) |
| `components/dc/photo-frame.tsx` | PhotoFrame arch/circle/frame with clip wrapper |
| `components/dc/nav-bar.tsx`, `footer.tsx`, `forms.tsx` | Chrome and forms |
| `components/dc/hero.tsx`, `statement.tsx` (new), `value-props.tsx` (new), `sections.tsx` | Page blocks: Hero, Statement, ValueProps, FeatureSplit, PromoBanner, LocationCard |
| `components/dc/menu.tsx` | DishCard, MenuItem, MenuSection, SpecialRow, SpecialsBoard |
| `components/dc/category-grid.tsx` (new), `social-grid.tsx` (new) | Photo category tiles, Instagram grid |
| `components/dc/creative.tsx` (delete) | Sticker, Stamp users, WordStack, BrandPaper, ColorSplit, PosterCard, old CategoryGrid/SocialGrid/ValueProps |
| `components/dc/index.ts` | Public exports |
| `components/dc/in-view-observer.tsx` | Update touch-motion target list |
| `components/site/site-chrome.tsx` (new) | `SiteHeader`, `SiteFooter`, `pageContainer` shared by all pages |
| `app/**/page.tsx`, `app/menu/menu-filter.tsx`, `app/*/inquiry-form.tsx` | Rebuilt on v6 components |
| `data/site.ts` | `dailySpecials.title` becomes `Daily Specials` |
| `lib/pages.test.ts` (new) | Guard: script-word budget and one-rose-block per page |

**Branch note.** Work happens on branch `feat/design-system-v6`. Between Task 2 and Task 11 the site is visually mid-migration and `tsc` is red on page files that still use removed components; each task runs only its own tests. The branch merges to `main` only after Task 12 is green.

---

### Task 0: Branch, baseline and docs reading

**Files:**
- Create: branch `feat/design-system-v6`

- [ ] **Step 1: Create the branch and commit the spec and plan**

```bash
cd /Users/ventura/Desktop/d/atrium/dcop.website.atrium
git checkout -b feat/design-system-v6
git add docs/superpowers/specs/2026-10-06-design-system-v6-design.md docs/superpowers/plans/2026-10-06-design-system-v6.md
git commit -m "docs: add design system v6 spec and implementation plan

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 2: Record the green baseline**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all pass. If anything is already red, write it down; it is not caused by this migration.

- [ ] **Step 3: Read the Next.js docs named in Global Constraints**

Run: `ls node_modules/next/dist/docs/01-app/01-getting-started/ | grep -E "css|images|fonts|metadata"` then read those four files and `generate-viewport.md`. Note anything that conflicts with the snippets below (for example a renamed `Viewport` field) and apply the docs' version.

---

### Task 1: Foundation — tokens, type classes, globals, layout, guard test

**Files:**
- Create: `lib/styles.test.ts`, `app/type.css`, `docs/don-chuys-brand-guide-v6/` (copy of the guide)
- Modify: `app/tokens.css` (full rewrite), `app/globals.css` (full rewrite), `app/layout.tsx`, `vitest.setup.ts`, `docs/don-chuys-design-system/README.md` (first line)

**Interfaces:**
- Produces: CSS custom properties `--navy --navy-900 --navy-700 --white --ivory --ivory-muted --marigold --rose --teal --on-marigold --line --overlay --focus --space-1..9 --radius-none --radius-sm --radius-round --shadow-plate --shadow-card --bp-* --container-max --container-narrow --gutter-mobile --gutter-desktop --z-sticky --z-drawer`; classes `.display-2xl/xl/l/m/s .script-xl/l .lede .body .small .eyebrow .label .item .price`; Tailwind colors `navy navy-900 navy-700 ivory ivory-muted marigold rose teal`.

- [ ] **Step 1: Write the failing guard test**

Create `lib/styles.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(path.join(import.meta.dirname, "..", "app", file), "utf8");

/** CSS files that must be v6-clean. Task 2 appends the dc-*.css files. */
export const CSS_FILES = ["tokens.css", "type.css", "globals.css"];

/** v5 tokens removed in v6. A surviving `var(--x)` renders as an unset (invisible) color. */
const REMOVED = [
  "cream", "ink", "ink-muted", "surface", "paper", "paper-deep", "sage", "sage-100", "sage-200", "sage-alt", "ornament",
  "agave", "agave-900", "teal-surface", "teal-100", "teal-700", "teal-ink", "chuy-rose", "chuy-red", "deep-red",
  "rose-100", "marigold-100", "marigold-700", "on-brand", "on-dark", "script-ink", "shadow-sticker", "shadow-lift",
  "radius-pill", "radius-xl", "space-10",
];

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const token = (name: string) => {
  const match = read("tokens.css").match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token --${name} not found in tokens.css`);
  return match[1];
};

describe("design tokens v6", () => {
  it("defines the palette exactly as the brand guide", () => {
    const css = read("tokens.css");
    for (const [name, value] of Object.entries({
      navy: "#194765", "navy-900": "#0e2f44", "navy-700": "#255b7e", white: "#ffffff", ivory: "#f6f1e7",
      "ivory-muted": "#c5d0d8", marigold: "#ed9d55", rose: "#9f3e49", teal: "#69968f", "on-marigold": "#0e2f44", focus: "#ed9d55",
    })) {
      expect(css, name).toContain(`--${name}: ${value}`);
    }
  });

  it.each(CSS_FILES)("%s uses no token removed from v5", (file) => {
    const css = read(file);
    for (const name of REMOVED) {
      expect(css, `${file} still uses --${name}`).not.toMatch(new RegExp(`var\\(--${name}[,)]`));
    }
    expect(css, `${file} still has a theme switch`).not.toContain("data-theme");
  });

  it("keeps the contrast the guide promises", () => {
    expect(contrast(token("white"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory-muted"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory-muted"), token("navy-900"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("on-marigold"), token("marigold"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("white"), token("rose"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory"), token("rose"))).toBeGreaterThanOrEqual(4.5);
    // marigold text on navy: large text only (guide: 19px bold+), so the 3:1 large-text bar applies
    expect(contrast(token("marigold"), token("navy"))).toBeGreaterThanOrEqual(3);
    expect(contrast(token("marigold"), token("navy-900"))).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run lib/styles.test.ts`
Expected: FAIL (`type.css` does not exist; `tokens.css` still holds v5 tokens).

- [ ] **Step 3: Copy the guide into the repo and mark v5 superseded**

```bash
G="/Users/ventura/Downloads/Don Chuy's Brand Guide"
mkdir -p docs/don-chuys-brand-guide-v6
cp -R "$G"/. docs/don-chuys-brand-guide-v6/
cmp "$G/fonts/eudora-regular.woff2" app/fonts/eudora-regular.woff2 && echo "eudora identical"
sed -i '' '1s/^/> **Superseded by v6** — see `docs\/don-chuys-brand-guide-v6\/` (the Brand Guide used by the site now).\n\n/' docs/don-chuys-design-system/README.md
```
Expected: `eudora identical`. If `cmp` reports a difference, copy the guide's file over `app/fonts/eudora-regular.woff2`.

- [ ] **Step 4: Rewrite `app/tokens.css`**

```css
/* Don Chuy's design tokens v6 "cantina de noche" — from the Brand Guide's tokens.css.
   @font-face and font stacks are omitted: next/font (app/layout.tsx) injects the fonts and
   globals.css (@theme static) wires --font-display / --font-script / --font-sans. */
:root {
  --navy: #194765;
  --navy-900: #0e2f44;
  --navy-700: #255b7e;
  --white: #ffffff;
  --ivory: #f6f1e7;
  --ivory-muted: #c5d0d8;
  --marigold: #ed9d55;
  --rose: #9f3e49;
  --teal: #69968f;
  --on-marigold: #0e2f44;
  --line: rgba(246, 241, 231, 0.22);
  --overlay: rgba(14, 47, 68, 0.62);
  --focus: #ed9d55;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 40px;
  --space-7: 64px;
  --space-8: 112px;
  --space-9: 160px;

  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-round: 999px;

  --shadow-plate: 0 28px 56px rgba(4, 22, 34, 0.5);
  --shadow-card: 0 18px 40px rgba(4, 22, 34, 0.35);

  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --container-max: 1200px;
  --container-narrow: 720px;
  --gutter-mobile: 24px;
  --gutter-desktop: 56px;
  --z-sticky: 40;
  --z-drawer: 60;

  color-scheme: dark;
}
```

- [ ] **Step 5: Create `app/type.css`**

```css
/* Text styles from the Brand Guide. Eudora is always white and always through its lowercase set. */
.display-2xl, .display-xl, .display-l, .display-m, .display-s {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--white);
  text-wrap: balance;
}
.display-2xl { font-size: 156px; line-height: 0.86; }
.display-xl { font-size: 112px; line-height: 0.88; }
.display-l { font-size: 76px; line-height: 0.9; }
.display-m { font-size: 48px; line-height: 0.94; }
.display-s { font-size: 30px; line-height: 1; }

/* Script: ONE word only. Marigold or white. */
.script-xl { font-family: var(--font-script); font-size: 96px; line-height: 1; font-weight: 400; }
.script-l { font-family: var(--font-script); font-size: 48px; line-height: 1; font-weight: 400; }

.lede { font-family: var(--font-sans); font-size: 21px; line-height: 1.55; font-weight: 400; color: var(--ivory); }
.body { font-family: var(--font-sans); font-size: 16px; line-height: 1.7; font-weight: 400; color: var(--ivory-muted); }
.small { font-family: var(--font-sans); font-size: 13px; line-height: 1.6; font-weight: 400; color: var(--ivory-muted); }
.eyebrow { font-family: var(--font-sans); font-size: 12px; line-height: 1.2; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ivory-muted); }
.label { font-family: var(--font-sans); font-size: 12px; line-height: 1.2; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ivory-muted); }
.item { font-family: var(--font-sans); font-size: 18px; line-height: 1.3; font-weight: 600; color: var(--ivory); }
.price { font-family: var(--font-sans); font-size: 20px; line-height: 1; font-weight: 800; color: var(--marigold); }

@media (max-width: 639px) {
  .display-2xl { font-size: 68px; }
  .display-xl { font-size: 56px; }
  .display-l { font-size: 44px; }
  .display-m { font-size: 36px; }
  .script-xl { font-size: 56px; }
  .lede { font-size: 18px; }
}
```

- [ ] **Step 6: Rewrite `app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./tokens.css";
@import "./type.css";
@import "./dc.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* Don Chuy's v6 palette as utilities (bg-navy-900, text-ivory-muted, ...). Values live in tokens.css. */
  --color-navy: var(--navy);
  --color-navy-900: var(--navy-900);
  --color-navy-700: var(--navy-700);
  --color-ivory: var(--ivory);
  --color-ivory-muted: var(--ivory-muted);
  --color-marigold: var(--marigold);
  --color-rose: var(--rose);
  --color-teal: var(--teal);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

/* Font stacks. `static` so the variables are always emitted: dc-*.css and type.css read them with var(). */
@theme static {
  --font-display: var(--font-eudora), var(--font-bebas), Impact, sans-serif;
  --font-script: var(--font-yellowtail), "Brush Script MT", cursive;
  --font-sans: var(--font-figtree), "Avenir Next", system-ui, sans-serif;
}

:root {
  /* shadcn semantic variables mapped onto the v6 tokens (tokens.css). */
  --background: var(--navy);
  --foreground: var(--ivory);
  --card: var(--navy-900);
  --card-foreground: var(--ivory);
  --popover: var(--navy-900);
  --popover-foreground: var(--ivory);
  --primary: var(--marigold);
  --primary-foreground: var(--on-marigold);
  --secondary: var(--navy-700);
  --secondary-foreground: var(--ivory);
  --muted: var(--navy-900);
  --muted-foreground: var(--ivory-muted);
  --accent: var(--navy-700);
  --accent-foreground: var(--white);
  --destructive: var(--rose);
  --border: var(--line);
  --input: var(--line);
  --ring: var(--focus);
  --chart-1: var(--marigold);
  --chart-2: var(--rose);
  --chart-3: var(--teal);
  --chart-4: var(--navy-700);
  --chart-5: var(--ivory);
  --radius: 0.125rem;
  --sidebar: var(--navy-900);
  --sidebar-foreground: var(--ivory);
  --sidebar-primary: var(--marigold);
  --sidebar-primary-foreground: var(--on-marigold);
  --sidebar-accent: var(--navy-700);
  --sidebar-accent-foreground: var(--white);
  --sidebar-border: var(--line);
  --sidebar-ring: var(--focus);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    @apply font-sans;
  }
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
  body {
    @apply bg-background text-foreground;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 3px;
  }
  ::selection {
    background: var(--marigold);
    color: var(--on-marigold);
  }
}
```

- [ ] **Step 7: Update `app/layout.tsx`**

Replace the whole file:

```tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, Figtree, Yellowtail } from "next/font/google";
import "./globals.css";
import { InViewObserver } from "@/components/dc/in-view-observer";
import { siteContent } from "@/data/site";

// Display: Eudora (brand face, lowercase set draws "i" as "!"; fallback Bebas Neue for punctuation/$/&/accents).
// Script: Yellowtail (one word only). Sans: Figtree (body, UI).
// Stacks are wired to these variables in globals.css (@theme static).
const eudora = localFont({
  src: "./fonts/eudora-regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-eudora",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

// Pages set their own full titles ("About Us | Don Chuy's ..."), so no title template here.
export const metadata: Metadata = {
  title: siteContent.seoDefaults.homeTitle,
  description: siteContent.seoDefaults.homeDescription,
};

export const viewport: Viewport = {
  themeColor: "#194765",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${eudora.variable} ${bebasNeue.variable} ${yellowtail.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        {children}
        <InViewObserver />
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Mock `next/image` in tests**

Replace `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

// next/image renders a plain <img> in unit tests (no loader, no router context).
vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, quality: _quality, ...props }: Record<string, unknown>) =>
    createElement("img", props),
}));
```

- [ ] **Step 9: Run the guard test**

Run: `npx vitest run lib/styles.test.ts`
Expected: PASS (palette, no removed tokens in `tokens.css`/`type.css`/`globals.css`, contrast). The contrast numbers are 9.86, 8.76, 6.28, 8.87, 6.33, 6.44, 5.72, marigold/navy 4.48.

- [ ] **Step 10: Commit**

```bash
git add app/tokens.css app/type.css app/globals.css app/layout.tsx vitest.setup.ts lib/styles.test.ts docs/don-chuys-brand-guide-v6 docs/don-chuys-design-system/README.md
git commit -m "feat: add design system v6 tokens, type classes and base layer

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Component CSS swap — assets, components, site styles

**Files:**
- Create: `app/dc-assets.css`, `app/dc-components.css`, `app/dc-site.css`
- Delete: `app/dc.css`
- Modify: `app/globals.css` (imports), `lib/styles.test.ts` (file list), `components/dc/in-view-observer.tsx` (targets)

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: every `.dc-*` class from the guide (`.dc-btn(-primary|-ivory|-outline|-link|-sm|-md|-lg)`, `.dc-pill(-outline|-marigold|-ivory)`, `.dc-eyebrow(-rule|-center)`, `.dc-sh*`, `.dc-nav(-solid|-transparent)`, `.dc-hero(-photo|-split)` + `-bg -scrim -scroll -copy -title -script -lede -ctas -media -flower`, `.dc-statement*`, `.dc-vp*`, `.dc-feat(-navy|-navy-900|-rose|-reverse)`, `.dc-dish*`, `.dc-cats .dc-cat*`, `.dc-ms* .dc-mi*`, `.dc-special* .dc-board*`, `.dc-promo(-rose|-navy-900)`, `.dc-loc*`, `.dc-social*`, `.dc-field .dc-input`, `.dc-news*`, `.dc-foot*`, `.dc-photo(-clip|-arch|-circle|-frame|-outline|-caption|-empty)`, `.dc-logo`, `.dc-flower(-color|-mono|-spin)`, `.dc-mq*`, `.dc-tileband(-rules)`, `.dc-pattern`, `.dc-accent`) and site classes `.dc-hero-bg-wide .dc-hero-bg-tall .dc-panel .dc-panel-title .dc-quote .dc-note .dc-note-title .mn* `.

- [ ] **Step 1: Extend the guard test first (it will fail)**

In `lib/styles.test.ts` change the `CSS_FILES` line to:

```ts
export const CSS_FILES = ["tokens.css", "type.css", "globals.css", "dc-assets.css", "dc-components.css", "dc-site.css"];
```

Run: `npx vitest run lib/styles.test.ts`
Expected: FAIL (`dc-assets.css` etc. do not exist).

- [ ] **Step 2: Generate the guide-derived CSS (verbatim, no retyping of the data URIs)**

```bash
G="/Users/ventura/Downloads/Don Chuy's Brand Guide"
awk 'NR<=12' "$G/bundle.css" > app/dc-assets.css
awk 'NR>=13' "$G/bundle.css" > app/dc-components.css
head -c 120 app/dc-assets.css; echo; sed -n '1p' app/dc-components.css | cut -c1-140; grep -c "" app/dc-assets.css app/dc-components.css
```
Expected: `dc-assets.css` starts with `/* Don Chuy's web components v6 ...`, 12 lines; `dc-components.css` first line is `/* ===== Don Chuy's web components v6 — fine dining...`, 295 lines.

- [ ] **Step 3: Create `app/dc-site.css`**

```css
/* Site-specific styles on top of the Brand Guide's component CSS (dc-components.css).
   Reads tokens.css only. Sections: hero image swap, panels, menu page, touch motion. */

/* ===== Hero: portrait crop on narrow screens (Hero renders both images when mobileImage is set) ===== */
.dc-hero-bg-tall { display: none; }
@media (max-width: 700px) {
  .dc-hero-bg-wide { display: none; }
  .dc-hero-bg-tall { display: block; }
}

/* ===== Panels, quotes and notes (contact, location detail, form confirmations) ===== */
.dc-panel { display: flex; flex-direction: column; gap: var(--space-3); padding: 32px 28px; background: var(--navy-900); border: 1px solid var(--line); color: var(--ivory); }
.dc-panel-title { margin: 0; font: 700 12px/1.2 var(--font-sans); letter-spacing: 0.2em; text-transform: uppercase; color: var(--ivory-muted); }
.dc-quote { margin: 0; padding: 4px 0 4px 18px; border-left: 2px solid var(--marigold); color: var(--ivory); }
.dc-quote p { margin: 0 0 8px; font: 400 italic 17px/1.6 var(--font-sans); }
.dc-quote cite { font: 700 12px/1.2 var(--font-sans); letter-spacing: 0.16em; text-transform: uppercase; font-style: normal; color: var(--ivory-muted); }
.dc-note { padding: 32px 28px; background: var(--navy-900); border-left: 2px solid var(--marigold); }
.dc-note-title { margin: 0 0 8px; font: 600 18px/1.3 var(--font-sans); color: var(--white); }
.dc-note p { margin: 0; color: var(--ivory-muted); }

/* ===== Menu page — restaurant-carte layout ===== */
.mn { --mn-top: 85px; }
.mn-bar { position: sticky; top: var(--mn-top); z-index: 30; background: var(--navy); border-bottom: 1px solid var(--line); margin-bottom: var(--space-7); }
.mn-chips { display: flex; gap: var(--space-2); overflow-x: auto; scrollbar-width: none; position: relative; }
.mn-chips::-webkit-scrollbar { display: none; }
.mn-chip { flex: none; padding: 18px 14px; font: 700 12px/1 var(--font-sans); letter-spacing: 0.18em; text-transform: uppercase; color: var(--ivory-muted); text-decoration: none; box-shadow: inset 0 -2px 0 transparent; transition: color 0.25s, box-shadow 0.25s; }
.mn-chip:hover { color: var(--white); }
.mn-chip.is-active { color: var(--white); box-shadow: inset 0 -2px 0 var(--marigold); }
.mn-tools { display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--space-3); margin-bottom: var(--space-5); }
.mn-toggle { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 16px; border: 1px solid var(--line); background: none; color: var(--ivory-muted); font: 700 11px/1 var(--font-sans); letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; transition: color 0.25s, border-color 0.25s; }
.mn-toggle:hover { color: var(--white); }
.mn-toggle.is-active { border-color: var(--marigold); color: var(--white); }
.mn-search { flex: 1; min-width: 200px; max-width: 360px; margin-left: auto; }

.mn-book { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }
.mn-cat { width: 100%; scroll-margin-top: calc(var(--mn-top) + 80px); }
.mn-cat-head { display: flex; align-items: baseline; gap: var(--space-4); padding-bottom: var(--space-3); margin-bottom: var(--space-4); border-bottom: 1px solid var(--marigold); }
.mn-cat-num { font: 700 12px/1 var(--font-sans); letter-spacing: 0.24em; color: var(--ivory-muted); }
.mn-cat-title { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 48px; line-height: 0.94; letter-spacing: 0.02em; text-transform: lowercase; color: var(--white); }
.mn-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.mn-list-cols { display: grid; grid-template-columns: 1fr 1fr; column-gap: var(--space-7); }
.mn-item { padding: 18px 0; border-bottom: 1px solid var(--line); }
.mn-item-head { display: flex; align-items: baseline; gap: 12px; }
.mn-item-name { display: inline-flex; align-items: center; gap: 8px; font: 600 18px/1.3 var(--font-sans); color: var(--ivory); }
.mn-item-tag { color: var(--marigold); }
.mn-item-dots { flex: 1; min-width: 24px; }
.mn-item-price { font: 800 20px/1 var(--font-sans); color: var(--marigold); font-variant-numeric: tabular-nums; }
.mn-item-desc { margin: 6px 0 0; font: 400 15px/1.6 var(--font-sans); color: var(--ivory-muted); max-width: 520px; }
.mn-break { display: grid; grid-template-columns: minmax(0, 0.8fr) 1fr; align-items: center; gap: var(--space-7); padding: var(--space-6) clamp(20px, 4vw, 56px); background: var(--navy-900); border: 1px solid var(--line); }
.mn-break.is-flip { grid-template-columns: 1fr minmax(0, 0.8fr); }
.mn-break.is-flip .mn-break-photo { order: 2; }
.mn-break-photo { width: min(100%, 420px); justify-self: center; }
.mn-break-title { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(40px, 5vw, 64px); line-height: 0.92; letter-spacing: 0.02em; text-transform: lowercase; color: var(--white); text-wrap: balance; }
.mn-break-line { margin: var(--space-4) 0 0; font: 400 17px/1.7 var(--font-sans); color: var(--ivory-muted); max-width: 340px; }
.mn-empty { text-align: center; padding: var(--space-8) 0; }
@media (max-width: 640px) {
  .mn { --mn-top: 90px; }
  .mn-list-cols { grid-template-columns: 1fr; }
  .mn-cat-title { font-size: 36px; }
  .mn-break, .mn-break.is-flip { grid-template-columns: 1fr; gap: var(--space-5); padding: var(--space-5) var(--space-4); }
  .mn-break.is-flip .mn-break-photo { order: 0; }
  .mn-book { gap: var(--space-7); }
  .mn-search { max-width: none; }
}

/* ===== Touch motion =====
   No hover on touch, so InViewObserver (components/dc/in-view-observer.tsx) toggles .is-inview while an
   element is on screen and these rules play the motion hover plays on desktop. `has-motion` is only set on
   touch + no reduced-motion, so nothing is hidden for anyone else. */
@media (hover: none) and (prefers-reduced-motion: no-preference) {
  /* Press feedback */
  .dc-btn, .dc-cat, .dc-loc, .dc-social-tile, .dc-tab, .mn-chip, .mn-toggle { transition: scale 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.25s, color 0.25s, border-color 0.25s; }
  .dc-btn:active, .dc-cat:active, .dc-loc:active, .dc-social-tile:active, .dc-tab:active, .mn-chip:active, .mn-toggle:active { scale: 0.97; }

  /* Cards rise in, staggered by --i (set by the observer) */
  .has-motion :is(.dc-cat, .dc-loc, .dc-dish, .dc-social-tile, .mn-cat) { opacity: 0; translate: 0 28px; transition: opacity 0.6s ease, translate 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), scale 0.18s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: calc(var(--i, 0) * 90ms), calc(var(--i, 0) * 90ms), 0s; }
  .has-motion :is(.dc-cat, .dc-loc, .dc-dish, .dc-social-tile, .mn-cat).is-inview { opacity: 1; translate: 0 0; }

  /* Hover end-states (motion only, no color change), reached on entry */
  .has-motion .dc-cat.is-inview .dc-cat-img { transform: scale(1.06); transition-duration: 1.2s; transition-delay: 0.2s; }
  .has-motion .dc-dish.is-inview .dc-dish-media .dc-photo { transform: rotate(6deg) scale(1.03); transition-duration: 0.9s; transition-delay: 0.2s; }
  .has-motion .dc-social-tile.is-inview img { transform: scale(1.05); transition-duration: 1.6s; }

  /* Menu photo breaks: photo and copy arrive from opposite sides */
  .has-motion .mn-break-photo { opacity: 0; translate: -36px 0; transition: opacity 0.7s ease, translate 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .has-motion .mn-break-copy { opacity: 0; translate: 36px 0; transition: opacity 0.7s ease 0.15s, translate 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s; }
  .has-motion .mn-break.is-flip .mn-break-photo { translate: 36px 0; }
  .has-motion .mn-break.is-flip .mn-break-copy { translate: -36px 0; }
  .has-motion .mn-break.is-inview :is(.mn-break-photo, .mn-break-copy) { opacity: 1; translate: 0 0; }
  @media (max-width: 640px) {
    .has-motion .mn-break-photo, .has-motion .mn-break.is-flip .mn-break-photo { translate: 0 32px; }
    .has-motion .mn-break-copy, .has-motion .mn-break.is-flip .mn-break-copy { translate: 0 32px; }
  }

  /* First paint: set the hidden state without animating it */
  .motion-init :is(.dc-cat, .dc-loc, .dc-dish, .dc-social-tile, .mn-cat, .mn-break-photo, .mn-break-copy) { transition: none !important; }
}
```

- [ ] **Step 4: Swap the imports and delete the v5 CSS**

In `app/globals.css` replace the line `@import "./dc.css";` with:

```css
@import "./dc-assets.css";
@import "./dc-components.css";
@import "./dc-site.css";
```

Then: `git rm app/dc.css`

- [ ] **Step 5: Update the touch-motion targets**

In `components/dc/in-view-observer.tsx` replace the `TARGETS` array with:

```ts
const TARGETS = [".dc-cat", ".dc-loc", ".dc-dish", ".dc-social-tile", ".mn-break", ".mn-cat"].join(",");
```

- [ ] **Step 6: Run the guard test**

Run: `npx vitest run lib/styles.test.ts`
Expected: PASS for all six CSS files. If it reports a removed token inside `dc-components.css`, that line came from the guide itself: open the guide's `index.html` to confirm and fix the token to its v6 equivalent in `dc-site.css` instead of editing the generated file.

- [ ] **Step 7: Commit**

```bash
git add app/dc-assets.css app/dc-components.css app/dc-site.css app/globals.css lib/styles.test.ts components/dc/in-view-observer.tsx
git commit -m "feat: replace component CSS with the v6 brand guide styles

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Utilities and Icon

**Files:**
- Modify: `components/dc/utils.tsx`, `components/dc/icon.tsx`
- Test: `components/dc/utils.test.tsx`, `components/dc/icon.test.tsx`

**Interfaces:**
- Produces: `cx(...parts)`, `scriptWord(value: unknown): string | null`, `renderAccent(text: string): ReactNode`, `isInternal(href: string): boolean`, `toLink(item: string | LinkItem): LinkItem`, `LinkItem {label, href}`, `Img {src, alt, focus?}`; `Icon({name,size?,title?,strokeWidth?,className?})` with default stroke 1.5.

- [ ] **Step 1: Write the failing tests**

`components/dc/utils.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { isInternal, renderAccent, scriptWord, toLink } from "./utils";

describe("scriptWord", () => {
  it("returns one trimmed word", () => {
    expect(scriptWord(" Salud ")).toBe("Salud");
    expect(scriptWord("Josper-grilled")).toBe("Josper-grilled");
  });
  it("rejects phrases, empties and non-strings (the brand allows script on a single word only)", () => {
    expect(scriptWord("from our casa")).toBeNull();
    expect(scriptWord("")).toBeNull();
    expect(scriptWord("   ")).toBeNull();
    expect(scriptWord(undefined)).toBeNull();
    expect(scriptWord(42)).toBeNull();
  });
});

describe("renderAccent", () => {
  it("wraps one starred word in the script accent", () => {
    const { container } = render(<h1>{renderAccent("Real deal *Mexican* flavor")}</h1>);
    expect(container.textContent).toBe("Real deal Mexican flavor");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("Mexican");
  });
  it("renders a starred phrase as plain text", () => {
    const { container } = render(<h1>{renderAccent("Let us *bring it* home")}</h1>);
    expect(container.textContent).toBe("Let us bring it home");
    expect(container.querySelector("em")).toBeNull();
  });
  it("leaves unstarred text untouched", () => {
    const { container } = render(<h1>{renderAccent("Find your table")}</h1>);
    expect(container.textContent).toBe("Find your table");
  });
});

describe("links", () => {
  it("tells internal paths from external and protocol-relative URLs", () => {
    expect(isInternal("/menu")).toBe(true);
    expect(isInternal("//cdn.example.com/x")).toBe(false);
    expect(isInternal("https://example.com")).toBe(false);
    expect(isInternal("#top")).toBe(false);
  });
  it("normalizes a plain string to a link", () => {
    expect(toLink("Menu")).toEqual({ label: "Menu", href: "#" });
    expect(toLink({ label: "Menu", href: "/menu" })).toEqual({ label: "Menu", href: "/menu" });
  });
});
```

`components/dc/icon.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import { iconPaths } from "./icon-paths";

describe("Icon", () => {
  it("ships exactly the 22 icons of the v6 guide", () => {
    expect(Object.keys(iconPaths).sort()).toEqual(
      ["agave", "arrow-right", "arrow-up-right", "avocado", "bag", "beer", "calendar", "chile", "clock", "close", "corn", "flame", "lime", "mail", "margarita", "menu", "phone", "pin", "plus", "sparkle", "taco", "utensils"],
    );
  });
  it("is decorative without a title and uses the thin 1.5 stroke by default", () => {
    const { container } = render(<Icon name="pin" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("stroke-width", "1.5");
  });
  it("gets an accessible name from title", () => {
    const { getByRole } = render(<Icon name="chile" title="Spicy" />);
    expect(getByRole("img", { name: "Spicy" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run components/dc/utils.test.tsx components/dc/icon.test.tsx`
Expected: FAIL (`scriptWord`/`isInternal` not exported; stroke width is 2).

- [ ] **Step 3: Rewrite `components/dc/utils.tsx`**

```tsx
import type { ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Brand rule: Yellowtail is for ONE word. Returns the trimmed word, or null for phrases/empties/non-strings. */
export function scriptWord(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" && !/\s/.test(value.trim()) ? value.trim() : null;
}

/** "Real deal *Mexican* flavor" → the starred single word becomes the Yellowtail accent; a starred phrase stays plain. */
export function renderAccent(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (!(part.startsWith("*") && part.endsWith("*"))) return part;
    const inner = part.slice(1, -1);
    return scriptWord(inner) ? (
      <em key={i} className="dc-accent">
        {inner}
      </em>
    ) : (
      inner
    );
  });
}

/** True for same-site paths ("/menu"); false for "#", "https://..." and "//host". */
export const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

export interface LinkItem {
  label: string;
  href: string;
}

/** Plain strings keep the design system's API; objects carry a real destination. */
export function toLink(item: string | LinkItem): LinkItem {
  return typeof item === "string" ? { label: item, href: "#" } : item;
}

export interface Img {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. "50% 35%". */
  focus?: string;
}
```

- [ ] **Step 4: In `components/dc/icon.tsx` change the default stroke**

Replace `strokeWidth={strokeWidth ?? 2}` with `strokeWidth={strokeWidth ?? 1.5}`.

- [ ] **Step 5: Run to verify they pass**

Run: `npx vitest run components/dc/utils.test.tsx components/dc/icon.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/dc/utils.tsx components/dc/icon.tsx components/dc/utils.test.tsx components/dc/icon.test.tsx
git commit -m "feat: enforce one-word script rule and thin icon stroke

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Primitives — Button, Pill, Eyebrow, SectionHeader

**Files:**
- Modify: `components/dc/button.tsx`, `components/dc/pill.tsx`, `components/dc/section-header.tsx`
- Create: `components/dc/eyebrow.tsx`
- Test: `components/dc/primitives.test.tsx`
- Unchanged: `components/dc/category-tabs.tsx` (the guide's tabs are the same component; only the CSS changed in Task 2)

**Interfaces:**
- Consumes: `cx`, `scriptWord`, `renderAccent`, `isInternal` (Task 3).
- Produces: `Button({variant?: "primary"|"ivory"|"outline"|"link", size?: "sm"|"md"|"lg", href?, icon?, iconLeft?, className?, children, ...buttonAttrs})`; `Pill({tone?: "outline"|"marigold"|"ivory", icon?, className?, children})`; `Eyebrow({children, align?: "left"|"center", className?})`; `SectionHeader({eyebrow?, title, script?, lede?, align?: "left"|"center", size?: "l"|"m", className?})`.

- [ ] **Step 1: Write the failing tests**

`components/dc/primitives.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { Pill } from "./pill";
import { SectionHeader } from "./section-header";

describe("Button", () => {
  it("is a primary, medium button by default and never submits by accident", () => {
    render(<Button>View Menu</Button>);
    const button = screen.getByRole("button", { name: "View Menu" });
    expect(button).toHaveClass("dc-btn", "dc-btn-primary", "dc-btn-md");
    expect(button).toHaveAttribute("type", "button");
  });
  it("renders a link for href, with the trailing icon", () => {
    const { container } = render(
      <Button href="/menu" variant="outline" size="lg" icon="arrow-right">
        Menu
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Menu" });
    expect(link).toHaveAttribute("href", "/menu");
    expect(link).toHaveClass("dc-btn-outline", "dc-btn-lg");
    expect(container.querySelector("svg.dc-btn-icon")).toBeInTheDocument();
  });
  it("opens external links as plain anchors", () => {
    render(<Button href="https://example.com">Out</Button>);
    expect(screen.getByRole("link", { name: "Out" })).toHaveAttribute("href", "https://example.com");
  });
});

describe("Pill", () => {
  it("defaults to the outline tone and shows an optional icon", () => {
    const { container } = render(<Pill icon="chile">Spicy</Pill>);
    expect(container.firstElementChild).toHaveClass("dc-pill", "dc-pill-outline");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("Eyebrow", () => {
  it("leads with a marigold rule and centers on request", () => {
    const { container } = render(<Eyebrow align="center">Visit us</Eyebrow>);
    expect(container.firstElementChild).toHaveClass("dc-eyebrow", "dc-eyebrow-center");
    expect(container.querySelector(".dc-eyebrow-rule")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("SectionHeader", () => {
  it("renders eyebrow, a title with one script accent, and a lede", () => {
    const { container } = render(<SectionHeader eyebrow="La comida" title="What are *you* craving?" lede="Pick a plate." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("What are you craving?");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("you");
    expect(screen.getByText("La comida")).toBeInTheDocument();
    expect(screen.getByText("Pick a plate.")).toBeInTheDocument();
  });
  it("shows a one-word script above the title", () => {
    const { container } = render(<SectionHeader script="Salud" title="Everyday drinks" />);
    expect(container.querySelector(".dc-sh-script")?.textContent).toBe("Salud");
  });
  it("drops a multi-word script instead of setting a phrase in Yellowtail", () => {
    const { container } = render(<SectionHeader script="from our casa" title="Everyday drinks" />);
    expect(container.querySelector(".dc-sh-script")).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/dc/primitives.test.tsx`
Expected: FAIL (`./eyebrow` missing, class names differ).

- [ ] **Step 3: Rewrite `components/dc/button.tsx`**

```tsx
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx, isInternal } from "./utils";

export type ButtonVariant = "primary" | "ivory" | "outline" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a link instead of a button. Internal paths use next/link. */
  href?: string;
  /** Trailing icon. */
  icon?: IconName;
  iconLeft?: IconName;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconLeft,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cx("dc-btn", `dc-btn-${variant}`, `dc-btn-${size}`, className);
  const content = (
    <>
      {iconLeft ? <Icon name={iconLeft} size={16} /> : null}
      <span>{children}</span>
      {icon ? <Icon name={icon} size={16} className="dc-btn-icon" /> : null}
    </>
  );

  if (href) {
    return isInternal(href) ? (
      <Link href={href} className={cls}>
        {content}
      </Link>
    ) : (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}
```

- [ ] **Step 4: Rewrite `components/dc/pill.tsx`**

```tsx
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export interface PillProps {
  tone?: "outline" | "marigold" | "ivory";
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Pill({ tone = "outline", icon, className, children }: PillProps) {
  return (
    <span className={cx("dc-pill", `dc-pill-${tone}`, className)}>
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Create `components/dc/eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";
import { cx } from "./utils";

/** Small tracked line above a title, led by a short marigold rule. */
export function Eyebrow({ children, align = "left", className }: { children: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <p className={cx("dc-eyebrow", align === "center" && "dc-eyebrow-center", className)}>
      <span className="dc-eyebrow-rule" aria-hidden="true" />
      {children}
    </p>
  );
}
```

- [ ] **Step 6: Rewrite `components/dc/section-header.tsx`**

```tsx
import { Eyebrow } from "./eyebrow";
import { cx, renderAccent, scriptWord } from "./utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  /** Wrap ONE word in *stars* for the script accent. */
  title: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  align?: "left" | "center";
  size?: "l" | "m";
  className?: string;
}

export function SectionHeader({ eyebrow, title, script, lede, align = "left", size = "l", className }: SectionHeaderProps) {
  const word = scriptWord(script);
  return (
    <header className={cx("dc-sh", `dc-sh-${align}`, `dc-sh-${size}`, className)}>
      {eyebrow ? <Eyebrow align={align}>{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-sh-script">{word}</span> : null}
      <h2 className="dc-sh-title">{renderAccent(title)}</h2>
      {lede ? <p className="dc-sh-lede">{lede}</p> : null}
    </header>
  );
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx vitest run components/dc/primitives.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/dc/button.tsx components/dc/pill.tsx components/dc/eyebrow.tsx components/dc/section-header.tsx components/dc/primitives.test.tsx
git commit -m "feat: rebuild button, pill, eyebrow and section header for v6

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Decor and PhotoFrame

**Files:**
- Rewrite: `components/dc/decor.tsx`, `components/dc/photo-frame.tsx`
- Test: `components/dc/decor.test.tsx`

**Interfaces:**
- Consumes: `Icon`, `cx`.
- Produces: `ColorToken = string`; `TileBand({height?=40, rules?=true, className?})`; `Pattern({name?, tone?="navy-700", size?, className?, style?})`; `Logo({size?=120, label?, className?, style?})`; `Flower({variant?: "color"|"mono", tone?="navy-700", size?: number|null, spin?, className?, style?})` (`size={null}` leaves width to CSS); `Marquee({items?, speed?=60, reverse?, className?})`; `PhotoFrame({src?, alt?, shape?: "arch"|"circle"|"frame", ratio?, outline?, caption?, sizes?, priority?, focus?, quality?=90, className?, style?})`.
- Removed: `Stamp`, `Sunburst`, `Crumbs`.

- [ ] **Step 1: Write the failing tests**

`components/dc/decor.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flower, Logo, Marquee, Pattern, TileBand } from "./decor";
import { PhotoFrame } from "./photo-frame";

describe("decor", () => {
  it("Logo is an accessible image sized by prop", () => {
    render(<Logo size={64} />);
    const logo = screen.getByRole("img", { name: "Don Chuy's Fresh Mex and Cantina" });
    expect(logo).toHaveClass("dc-logo");
    expect(logo).toHaveStyle({ width: "64px" });
  });
  it("Flower: color variant has no tint; mono tints with the token; size null defers to CSS", () => {
    const { container } = render(
      <>
        <Flower size={80} />
        <Flower variant="mono" tone="white" size={null} />
      </>,
    );
    const [color, mono] = Array.from(container.querySelectorAll(".dc-flower")) as HTMLElement[];
    expect(color).toHaveClass("dc-flower-color");
    expect(color).toHaveStyle({ width: "80px" });
    expect(mono).toHaveClass("dc-flower-mono");
    expect(mono.style.backgroundColor).toBe("var(--white)");
    expect(mono.style.width).toBe("");
  });
  it("Marquee exposes its words once and hides the repeated track", () => {
    render(<Marquee items={["Fresh Mex", "Cantina"]} />);
    expect(screen.getByRole("marquee", { name: "Fresh Mex, Cantina" })).toBeInTheDocument();
    expect(document.querySelector(".dc-mq-track")).toHaveAttribute("aria-hidden", "true");
  });
  it("TileBand and Pattern are decorative", () => {
    const { container } = render(
      <>
        <TileBand height={36} />
        <Pattern name="talavera-tile" size={64} />
      </>,
    );
    expect(container.querySelector(".dc-tileband")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dc-pattern")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("PhotoFrame", () => {
  it("wraps the photo in a clip with the shape's default ratio", () => {
    const { container } = render(<PhotoFrame src="/a.webp" alt="A plate" shape="circle" />);
    expect(container.querySelector("figure")).toHaveClass("dc-photo", "dc-photo-circle");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "1" });
    expect(screen.getByAltText("A plate")).toBeInTheDocument();
  });
  it("adds the marigold outline and a caption on request", () => {
    const { container } = render(<PhotoFrame src="/a.webp" alt="x" shape="arch" outline caption="The table" />);
    expect(container.querySelector("figure")).toHaveClass("dc-photo-outline");
    expect(screen.getByText("The table").tagName).toBe("FIGCAPTION");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "4 / 5" });
  });
  it("shows the utensils placeholder when there is no src", () => {
    const { container } = render(<PhotoFrame shape="frame" />);
    expect(container.querySelector(".dc-photo-empty svg")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
  it("passes the crop focus through as object-position", () => {
    render(<PhotoFrame src="/a.webp" alt="focus" focus="50% 35%" />);
    expect(screen.getByAltText("focus")).toHaveStyle({ objectPosition: "50% 35%" });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/dc/decor.test.tsx`
Expected: FAIL (`Logo` is not exported; old Flower is an SVG).

- [ ] **Step 3: Rewrite `components/dc/decor.tsx`**

```tsx
import { Fragment, type CSSProperties } from "react";
import { Icon } from "./icon";
import { cx } from "./utils";

/** A colour token name from tokens.css, e.g. "navy-700". */
export type ColorToken = string;

/** Tone-on-tone talavera strip. Hairline rules top and bottom by default. */
export function TileBand({ height = 40, rules = true, className }: { height?: number; rules?: boolean; className?: string }) {
  return (
    <div className={cx("dc-tileband", rules && "dc-tileband-rules", className)} style={{ height }} aria-hidden="true">
      <span />
    </div>
  );
}

export function Pattern({
  name = "talavera-tile",
  tone = "navy-700",
  size,
  className,
  style,
}: {
  name?: "talavera-tile" | "doodles" | "diamond" | "scallop";
  tone?: ColorToken;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx("dc-pattern", className)}
      style={{
        backgroundColor: `var(--${tone})`,
        WebkitMaskImage: `var(--dc-pattern-${name})`,
        maskImage: `var(--dc-pattern-${name})`,
        WebkitMaskSize: size ? `${size}px` : undefined,
        maskSize: size ? `${size}px` : undefined,
        ...style,
      }}
    />
  );
}

/** Official badge. It carries its own white ground: only on navy, navy-900, rose or a dark photo. Min width 56px. */
export function Logo({
  size = 120,
  label = "Don Chuy's Fresh Mex and Cantina",
  className,
  style,
}: {
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return <span role="img" aria-label={label} className={cx("dc-logo", className)} style={{ width: size, ...style }} />;
}

/** Brand flower: small full-colour accent, or a one-ink watermark. `size={null}` lets CSS decide the width. */
export function Flower({
  variant = "color",
  tone = "navy-700",
  size = 96,
  spin,
  className,
  style,
}: {
  variant?: "color" | "mono";
  tone?: ColorToken;
  size?: number | null;
  spin?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx("dc-flower", variant === "color" ? "dc-flower-color" : "dc-flower-mono", spin && "dc-flower-spin", className)}
      style={{
        width: size ?? undefined,
        ...(variant === "mono" ? { backgroundColor: `var(--${tone})` } : null),
        ...style,
      }}
    />
  );
}

export function Marquee({
  items = ["Fresh Mex", "Cantina", "Desde León", "Daily Specials", "Family recipes"],
  speed = 60,
  reverse,
  className,
}: {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  // The track is duplicated so the -50% translate loops seamlessly; only the label exposes the words once.
  const run = items.map((item, i) => (
    <Fragment key={i}>
      <span className="dc-mq-item">{item}</span>
      <Icon name="sparkle" size={14} className="dc-mq-sep" />
    </Fragment>
  ));
  return (
    <div className={cx("dc-mq", reverse && "dc-mq-reverse", className)} role="marquee" aria-label={items.join(", ")}>
      <div className="dc-mq-track" style={{ animationDuration: `${speed}s` }} aria-hidden="true">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `components/dc/photo-frame.tsx`**

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon } from "./icon";
import { cx } from "./utils";

export interface PhotoFrameProps {
  src?: string;
  alt?: string;
  /** arch: stories (use `outline`); circle: dishes; frame: everything else. */
  shape?: "arch" | "circle" | "frame";
  ratio?: string;
  /** Marigold hairline offset 16px down-right. Give the parent `padding: 0 16px 16px 0` so it is not clipped. */
  outline?: boolean;
  caption?: string;
  /** next/image `sizes` hint; set it to the rendered width for good srcset selection. */
  sizes?: string;
  priority?: boolean;
  /** CSS object-position for the crop, e.g. "50% 35%". */
  focus?: string;
  quality?: number;
  className?: string;
  style?: CSSProperties;
}

const defaultRatio = { circle: "1", arch: "4 / 5", frame: "4 / 3" } as const;

export function PhotoFrame({
  src,
  alt = "",
  shape = "frame",
  ratio,
  outline,
  caption,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
  focus,
  quality = 90,
  className,
  style,
}: PhotoFrameProps) {
  return (
    <figure className={cx("dc-photo", `dc-photo-${shape}`, outline && "dc-photo-outline", className)} style={style}>
      <span className="dc-photo-clip" style={{ aspectRatio: ratio ?? defaultRatio[shape] }}>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} quality={quality} priority={priority} style={focus ? { objectPosition: focus } : undefined} />
        ) : (
          <span className="dc-photo-empty">
            <Icon name="utensils" size={32} />
          </span>
        )}
      </span>
      {caption ? <figcaption className="dc-photo-caption">{caption}</figcaption> : null}
    </figure>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run components/dc/decor.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/dc/decor.tsx components/dc/photo-frame.tsx components/dc/decor.test.tsx
git commit -m "feat: rebuild decor and photo frame for v6, drop stamp/sunburst/crumbs

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Chrome — NavBar, Footer, forms

**Files:**
- Rewrite: `components/dc/nav-bar.tsx`, `components/dc/footer.tsx`, `components/dc/forms.tsx`
- Test: `components/dc/chrome.test.tsx`

**Interfaces:**
- Consumes: `Button`, `Logo`, `Icon`, `TileBand`, `Flower`, `Eyebrow`, `renderAccent`, `cx`, `toLink`, `isInternal`, `LinkItem`.
- Produces: `NavBar({links?, active?, brand?, cta?: string|null, ctaHref?, variant?: "solid"|"transparent", className?})`; `Footer({brand?, tagline?, locations?: {city, address?, phone?}[], links?, social?, legal?, className?})`; `Input({label?, hint?, error?, ...inputAttrs})`; `Newsletter({eyebrow?, title?, lede?, cta?, onSubmitEmail?, className?})`; `FooterProps`, `NavBarProps`, `InputProps`, `NewsletterProps` types.

- [ ] **Step 1: Write the failing tests**

`components/dc/chrome.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";
import { Input, Newsletter } from "./forms";
import { NavBar } from "./nav-bar";

const links = [
  { label: "Menu", href: "/menu" },
  { label: "Locations", href: "/locations" },
];

describe("NavBar", () => {
  it("marks the active page and shows the logo as the brand link", () => {
    render(<NavBar links={links} active="Menu" />);
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Locations" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Don Chuy's Fresh Mex and Cantina" })).toHaveAttribute("href", "/");
  });
  it("opens and closes the mobile menu with the toggle and closes on navigation", async () => {
    const user = userEvent.setup();
    const { container } = render(<NavBar links={links} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("nav")).toHaveClass("is-open");
    await user.click(screen.getByRole("link", { name: "Menu" }));
    expect(container.querySelector("nav")).not.toHaveClass("is-open");
  });
  it("hides the CTA when cta is null", () => {
    render(<NavBar links={links} cta={null} />);
    expect(screen.queryByRole("link", { name: "Order Online" })).toBeNull();
  });
});

describe("Footer", () => {
  it("lists locations with phones and says Coming soon for one without an address", () => {
    render(
      <Footer
        locations={[
          { city: "Overland Park, KS", address: "8725 Metcalf Ave", phone: "+1 816-603-2124" },
          { city: "O'Fallon, IL" },
        ]}
        links={links}
      />,
    );
    expect(screen.getByRole("heading", { name: "Overland Park, KS" })).toBeInTheDocument();
    expect(screen.getByText("+1 816-603-2124")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/menu");
  });
});

describe("Input", () => {
  it("links label and hint, and flags errors", () => {
    render(<Input label="Email" hint="We never share it" error="Enter a valid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.queryByText("We never share it")).toBeNull();
  });
});

describe("Newsletter", () => {
  it("reports the email on submit and does not navigate", async () => {
    const user = userEvent.setup();
    const onSubmitEmail = vi.fn();
    render(<Newsletter onSubmitEmail={onSubmitEmail} />);
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(onSubmitEmail).toHaveBeenCalledWith("ana@example.com");
  });
  it("shows a one-word script accent in a custom title", () => {
    const { container } = render(<Newsletter title="Be the *first* to know" />);
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("first");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/dc/chrome.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Rewrite `components/dc/nav-bar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "./button";
import { Logo } from "./decor";
import { Icon } from "./icon";
import { cx, toLink, type LinkItem } from "./utils";

export interface NavBarProps {
  links?: Array<string | LinkItem>;
  /** Label of the current page's link (gets the marigold underline). */
  active?: string;
  /** Defaults to the official logo (64px). */
  brand?: ReactNode;
  cta?: string | null;
  ctaHref?: string;
  variant?: "solid" | "transparent";
  className?: string;
}

export function NavBar({
  links = ["Menu", "Specials", "Happy Hour", "Locations", "About"],
  active,
  brand,
  cta = "Order Online",
  ctaHref = "#",
  variant = "solid",
  className,
}: NavBarProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("dc-navwrap", className)}>
      <nav className={cx("dc-nav", `dc-nav-${variant}`, open && "is-open")} aria-label="Main">
        <Link href="/" className="dc-nav-brand">
          {brand ?? <Logo size={64} />}
        </Link>
        <ul className="dc-nav-links">
          {links.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cx("dc-nav-link", label === active && "is-active")}
                  aria-current={label === active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="dc-nav-end">
          {cta ? (
            <Button href={ctaHref} variant="outline" size="sm">
              {cta}
            </Button>
          ) : null}
          <button
            type="button"
            className="dc-nav-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `components/dc/footer.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, TileBand } from "./decor";
import { Icon } from "./icon";
import { cx, isInternal, toLink, type LinkItem } from "./utils";

export interface FooterProps {
  /** Defaults to the official logo (168px). */
  brand?: ReactNode;
  tagline?: string;
  locations?: { city: string; address?: string; phone?: string }[];
  links?: Array<string | LinkItem>;
  social?: Array<string | LinkItem>;
  legal?: string;
  className?: string;
}

export function Footer({
  brand,
  tagline = "Fresh Mex & Cantina",
  locations = [],
  links = ["Menu", "Specials", "Happy Hour", "Catering", "Careers", "Contact"],
  social = [{ label: "Instagram", href: "https://www.instagram.com/donchuysmo/" }, "Facebook"],
  legal = "© Don Chuy's Fresh Mex & Cantina",
  className,
}: FooterProps) {
  return (
    <footer className={cx("dc-foot", className)}>
      <TileBand height={36} />
      <div className="dc-foot-top">
        {brand ?? <Logo size={168} />}
        <p className="dc-foot-tag">{tagline}</p>
      </div>
      <div className="dc-foot-grid">
        {locations.map((location) => (
          <div key={location.city} className="dc-foot-loc">
            <h4>{location.city}</h4>
            <p>{location.address || "Coming soon"}</p>
            {location.phone ? <p>{location.phone}</p> : null}
          </div>
        ))}
      </div>
      <div className="dc-foot-bottom">
        <ul className="dc-foot-links">
          {links.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>{isInternal(href) ? <Link href={href}>{label}</Link> : <a href={href}>{label}</a>}</li>
            );
          })}
        </ul>
        <ul className="dc-foot-links">
          {social.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>
                <a href={href}>
                  {label}
                  <Icon name="arrow-up-right" size={12} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="dc-foot-legal">{legal}</p>
    </footer>
  );
}
```

- [ ] **Step 5: Rewrite `components/dc/forms.tsx`**

```tsx
"use client";

import { useId, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { cx, renderAccent } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, id, className, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? `in${auto.replace(/:/g, "")}`;
  const describedBy = hint || error ? `${inputId}-h` : undefined;
  return (
    <div className={cx("dc-field", error && "is-error", className)}>
      {label ? (
        <label htmlFor={inputId} className="dc-field-label">
          {label}
        </label>
      ) : null}
      <input id={inputId} className="dc-input" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint || error ? (
        <p id={describedBy} className="dc-field-hint">
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}

export interface NewsletterProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  cta?: string;
  /** Called with the entered email. Without it the form only prevents the default submit (no backend yet). */
  onSubmitEmail?: (email: string) => void;
  className?: string;
}

export function Newsletter({
  eyebrow = "Newsletter",
  title = "Stay in the loop",
  lede = "New specials, events and Happy Hour news, straight to your inbox.",
  cta = "Sign Up",
  onSubmitEmail,
  className,
}: NewsletterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email === "string" && email) onSubmitEmail?.(email);
  };
  return (
    <section className={cx("dc-news", className)}>
      <Flower variant="mono" tone="navy" className="dc-news-flower" size={null} />
      <div className="dc-news-copy">
        {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
        <h2 className="dc-news-title">{renderAccent(title)}</h2>
        <p className="dc-news-lede">{lede}</p>
      </div>
      <form className="dc-news-form" onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" required placeholder="you@email.com" className="dc-news-input" />
        <Button type="submit" icon="arrow-right">
          {cta}
        </Button>
      </form>
    </section>
  );
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx vitest run components/dc/chrome.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/dc/nav-bar.tsx components/dc/footer.tsx components/dc/forms.tsx components/dc/chrome.test.tsx
git commit -m "feat: rebuild navbar, footer and newsletter for v6

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Page blocks — Hero, Statement, ValueProps, FeatureSplit

**Files:**
- Rewrite: `components/dc/hero.tsx`
- Create: `components/dc/statement.tsx`, `components/dc/value-props.tsx`, `components/dc/feature-split.tsx`
- Test: `components/dc/blocks.test.tsx`

`FeatureSplit` moves out of `sections.tsx` into its own file here; Task 8 rewrites `sections.tsx` with only `PromoBanner` and `LocationCard`, and `index.ts` (Task 8) re-exports `FeatureSplit` from `./feature-split`.

**Interfaces:**
- Consumes: `Button`, `Eyebrow`, `Flower`, `PhotoFrame`, `SectionHeader`, `Icon`, `cx`, `renderAccent`, `scriptWord`, `Img`.
- Produces: `Hero({variant?: "photo"|"split", eyebrow?, title, script?, lede?, primary?: string|null, primaryHref?, secondary?: string|null, secondaryHref?, image?: Img, mobileImage?: Img, flower?=true, className?})` (default variant `photo`); `Statement({eyebrow?, title, script?, body?, className?})`; `ValueProps({items: {icon: IconName, title, text}[], className?})`; `FeatureSplit({eyebrow?, title, script?, body?: string|string[], cta?, ctaHref?, image?: Img, shape?: "arch"|"circle"|"frame", reverse?, tone?: "navy"|"navy-900"|"rose", flower?, className?})`; type `ValuePropItem`.

- [ ] **Step 1: Write the failing tests**

`components/dc/blocks.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureSplit } from "./feature-split";
import { Hero } from "./hero";
import { Statement } from "./statement";
import { ValueProps } from "./value-props";

const table = { src: "/table.webp", alt: "A table spread" };

describe("Hero", () => {
  it("photo variant: background photo under a scrim, title with one script word", () => {
    const { container } = render(<Hero title="Real deal *Mexican* flavor" image={table} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Real deal Mexican flavor");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("Mexican");
    expect(container.querySelector("section.dc-hero-photo img.dc-hero-bg")).toHaveAttribute("alt", "A table spread");
    expect(container.querySelector(".dc-hero-scrim")).toBeInTheDocument();
  });
  it("renders a single background image when there is no mobileImage", () => {
    const { container } = render(<Hero title="Hi" image={table} />);
    expect(container.querySelectorAll("img.dc-hero-bg")).toHaveLength(1);
    expect(container.querySelector(".dc-hero-bg-wide")).toBeNull();
  });
  it("adds a portrait image for narrow screens when mobileImage is given", () => {
    const { container } = render(<Hero title="Hi" image={table} mobileImage={{ src: "/tall.webp", alt: "Close up" }} />);
    expect(container.querySelector("img.dc-hero-bg-wide")).toHaveAttribute("alt", "A table spread");
    expect(container.querySelector("img.dc-hero-bg-tall")).toHaveAttribute("alt", "Close up");
  });
  it("split variant: arch photo with marigold outline and a flower", () => {
    const { container } = render(<Hero variant="split" title="Family roots" image={table} />);
    expect(container.querySelector("section.dc-hero-split")).toBeInTheDocument();
    expect(container.querySelector("figure.dc-photo-arch.dc-photo-outline")).toBeInTheDocument();
    expect(container.querySelector(".dc-hero-flower")).toBeInTheDocument();
  });
  it("hides a button whose label is null and routes the other", () => {
    render(<Hero title="Hi" primary="View Menu" primaryHref="/menu" secondary={null} />);
    expect(screen.getByRole("link", { name: "View Menu" })).toHaveAttribute("href", "/menu");
    expect(screen.queryByRole("link", { name: "Find a Location" })).toBeNull();
  });
  it("sets a one-word script but not a phrase", () => {
    const one = render(<Hero title="Hi" script="Salud" />);
    expect(one.container.querySelector(".dc-hero-script")?.textContent).toBe("Salud");
    one.unmount();
    const phrase = render(<Hero title="Hi" script="follow the flavor" />);
    expect(phrase.container.querySelector(".dc-hero-script")).toBeNull();
  });
});

describe("Statement", () => {
  it("centers an eyebrow, title and body over the brand flower", () => {
    const { container } = render(<Statement eyebrow="Desde León" title="Fresh Mex. Real flavor." body="Come as guests." />);
    expect(screen.getByRole("heading", { level: 2, name: "Fresh Mex. Real flavor." })).toBeInTheDocument();
    expect(screen.getByText("Come as guests.")).toBeInTheDocument();
    expect(container.querySelector(".dc-statement-mark")).toBeInTheDocument();
  });
});

describe("ValueProps", () => {
  it("renders each item with its icon, title and text", () => {
    const { container } = render(<ValueProps items={[{ icon: "flame", title: "Josper-grilled", text: "Smoky char." }]} />);
    expect(screen.getByRole("heading", { level: 3, name: "Josper-grilled" })).toBeInTheDocument();
    expect(screen.getByText("Smoky char.")).toBeInTheDocument();
    expect(container.querySelector("svg.dc-vp-icon")).toBeInTheDocument();
  });
});

describe("FeatureSplit", () => {
  it("uses an outlined arch by default with the chosen tone", () => {
    const { container } = render(<FeatureSplit title="Come as guests" image={table} tone="navy-900" body={["One", "Two"]} cta="Our Story" ctaHref="/about" />);
    expect(container.querySelector("section")).toHaveClass("dc-feat", "dc-feat-navy-900");
    expect(container.querySelector("figure.dc-photo-arch.dc-photo-outline")).toBeInTheDocument();
    expect(screen.getAllByText(/^(One|Two)$/)).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Our Story" })).toHaveAttribute("href", "/about");
  });
  it("frame shape uses the 5/4 ratio and no outline; reverse flips the media", () => {
    const { container } = render(<FeatureSplit title="Catering" image={table} shape="frame" reverse />);
    expect(container.querySelector("figure.dc-photo-frame")).not.toHaveClass("dc-photo-outline");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "5 / 4" });
    expect(container.querySelector("section")).toHaveClass("dc-feat-reverse");
  });
  it("adds the flower only on request", () => {
    const { container, rerender } = render(<FeatureSplit title="X" image={table} />);
    expect(container.querySelector(".dc-feat-flower")).toBeNull();
    rerender(<FeatureSplit title="X" image={table} flower />);
    expect(container.querySelector(".dc-feat-flower")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/dc/blocks.test.tsx`
Expected: FAIL (modules missing / old structure).

- [ ] **Step 3: Rewrite `components/dc/hero.tsx`**

```tsx
import Image from "next/image";
import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { PhotoFrame } from "./photo-frame";
import { cx, renderAccent, scriptWord, type Img } from "./utils";

export interface HeroProps {
  /** photo: full-bleed photo under a navy scrim (default). split: copy beside an outlined arch photo. */
  variant?: "photo" | "split";
  eyebrow?: string;
  /** Wrap ONE word in *stars* for the script accent. */
  title: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  /** Button labels. Pass null to hide a button. */
  primary?: string | null;
  primaryHref?: string;
  secondary?: string | null;
  secondaryHref?: string;
  image?: Img;
  /** Photo variant only: replaces `image` on narrow screens (pass a portrait shot). */
  mobileImage?: Img;
  /** Split variant only. */
  flower?: boolean;
  className?: string;
}

export function Hero({
  variant = "photo",
  eyebrow,
  title,
  script,
  lede,
  primary = "View Menu",
  primaryHref = "#",
  secondary = "Find a Location",
  secondaryHref = "#",
  image,
  mobileImage,
  flower = true,
  className,
}: HeroProps) {
  const word = scriptWord(script);
  const copy = (
    <div className="dc-hero-copy">
      {eyebrow ? <Eyebrow align={variant === "photo" ? "center" : "left"}>{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-hero-script">{word}</span> : null}
      <h1 className="dc-hero-title">{renderAccent(title)}</h1>
      {lede ? <p className="dc-hero-lede">{lede}</p> : null}
      <div className="dc-hero-ctas">
        {primary ? (
          <Button size="lg" icon="arrow-right" href={primaryHref}>
            {primary}
          </Button>
        ) : null}
        {secondary ? (
          <Button size="lg" variant="outline" href={secondaryHref}>
            {secondary}
          </Button>
        ) : null}
      </div>
    </div>
  );

  if (variant === "split") {
    return (
      <section className={cx("dc-hero", "dc-hero-split", className)}>
        {copy}
        <div className="dc-hero-media">
          <PhotoFrame
            src={image?.src}
            alt={image?.alt}
            focus={image?.focus}
            shape="arch"
            outline
            sizes="(min-width: 900px) 440px, 90vw"
            priority
          />
          {flower ? <Flower className="dc-hero-flower" size={132} /> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={cx("dc-hero", "dc-hero-photo", className)}>
      {image ? (
        <Image
          className={cx("dc-hero-bg", mobileImage && "dc-hero-bg-wide")}
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          style={image.focus ? { objectPosition: image.focus } : undefined}
        />
      ) : null}
      {mobileImage ? (
        <Image
          className="dc-hero-bg dc-hero-bg-tall"
          src={mobileImage.src}
          alt={mobileImage.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          style={mobileImage.focus ? { objectPosition: mobileImage.focus } : undefined}
        />
      ) : null}
      <span className="dc-hero-scrim" aria-hidden="true" />
      {copy}
      <span className="dc-hero-scroll" aria-hidden="true" />
    </section>
  );
}
```

- [ ] **Step 4: Create `components/dc/statement.tsx`**

```tsx
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { cx, renderAccent, scriptWord } from "./utils";

/** Centered brand statement: eyebrow, title, short body, flower mark. */
export function Statement({
  eyebrow,
  title,
  script,
  body,
  className,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body?: string;
  className?: string;
}) {
  const word = scriptWord(script);
  return (
    <section className={cx("dc-statement", className)}>
      {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-sh-script">{word}</span> : null}
      <h2 className="dc-statement-title">{renderAccent(title)}</h2>
      {body ? <p className="dc-statement-body">{body}</p> : null}
      <Flower className="dc-statement-mark" size={64} />
    </section>
  );
}
```

- [ ] **Step 5: Create `components/dc/value-props.tsx`**

```tsx
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export interface ValuePropItem {
  icon: IconName;
  title: string;
  text: string;
}

export function ValueProps({ items, className }: { items: ValuePropItem[]; className?: string }) {
  return (
    <div className={cx("dc-vp", className)}>
      {items.map((item) => (
        <div key={item.title} className="dc-vp-item">
          <Icon name={item.icon} size={30} className="dc-vp-icon" />
          <h3 className="dc-vp-title">{item.title}</h3>
          <p className="dc-vp-text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create `components/dc/feature-split.tsx`**

```tsx
import { Button } from "./button";
import { Flower } from "./decor";
import { PhotoFrame } from "./photo-frame";
import { SectionHeader } from "./section-header";
import { cx, type Img } from "./utils";

export function FeatureSplit({
  eyebrow,
  title,
  script,
  body,
  cta,
  ctaHref = "#",
  image,
  shape = "arch",
  reverse,
  tone = "navy",
  flower,
  className,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body?: string | string[];
  cta?: string;
  ctaHref?: string;
  image?: Img;
  shape?: "arch" | "circle" | "frame";
  reverse?: boolean;
  /** rose is the one feature block per page. */
  tone?: "navy" | "navy-900" | "rose";
  flower?: boolean;
  className?: string;
}) {
  const paragraphs = (Array.isArray(body) ? body : [body]).filter(Boolean);
  return (
    <section className={cx("dc-feat", `dc-feat-${tone}`, reverse && "dc-feat-reverse", className)}>
      <div className="dc-feat-media">
        <PhotoFrame
          src={image?.src}
          alt={image?.alt}
          focus={image?.focus}
          shape={shape}
          outline={shape === "arch"}
          ratio={shape === "frame" ? "5 / 4" : undefined}
          sizes="(min-width: 860px) 460px, 90vw"
        />
        {flower ? <Flower className="dc-feat-flower" size={120} /> : null}
      </div>
      <div className="dc-feat-copy">
        <SectionHeader eyebrow={eyebrow} title={title} script={script} size="m" />
        {paragraphs.map((text, i) => (
          <p key={i} className="dc-feat-body">
            {text}
          </p>
        ))}
        {cta ? (
          <Button href={ctaHref} variant="outline" icon="arrow-right">
            {cta}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx vitest run components/dc/blocks.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/dc/hero.tsx components/dc/statement.tsx components/dc/value-props.tsx components/dc/feature-split.tsx components/dc/blocks.test.tsx
git commit -m "feat: add v6 hero, statement, value props and feature split

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Menu components, PromoBanner, LocationCard, CategoryGrid, SocialGrid, exports

**Files:**
- Rewrite: `components/dc/menu.tsx`, `components/dc/sections.tsx`, `components/dc/index.ts`
- Create: `components/dc/category-grid.tsx`, `components/dc/social-grid.tsx`
- Delete: `components/dc/creative.tsx`
- Test: `components/dc/content.test.tsx`

**Interfaces:**
- Consumes: Tasks 3-7 components.
- Produces: `DishCard({name, description?, price?, image?: Img, tags?: string[], href?, className?})`; `MenuItem({name, price, description?, tags?, featured?, className?})` + `MenuItemProps`; `MenuSection({title, note?, items, id?, className?})`; `SpecialRow({day, item, price?, note?, className?})` + `SpecialRowProps`; `SpecialsBoard({eyebrow?, title?="Daily Specials", specials, drinksTitle?="Everyday drinks", drinks?, className?})`; `PromoBanner({eyebrow?, title?, script?, lede?, deals?, cta?, ctaHref?, tone?: "rose"|"navy-900", className?})`; `LocationCard` + `LocationCardProps` (unchanged props); `CategoryGrid({items: CategoryGridItem[], className?})`, `CategoryGridItem {name, href?, image?: Img, icon?: IconName}`; `SocialGrid({eyebrow?, handle?, href?, images: Img[], className?})`.

- [ ] **Step 1: Write the failing tests**

`components/dc/content.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryGrid } from "./category-grid";
import { DishCard, MenuSection, SpecialsBoard } from "./menu";
import { LocationCard, PromoBanner } from "./sections";
import { SocialGrid } from "./social-grid";

describe("DishCard", () => {
  it("shows name and price on one head line, a circle photo, and tags (spicy gets the chile)", () => {
    const { container } = render(
      <DishCard name="Pulpo Zarandeado" price="$24" description="Grilled octopus." tags={["Spicy", "House favorite"]} image={{ src: "/p.webp", alt: "Octopus" }} />,
    );
    const head = container.querySelector(".dc-dish-head")!;
    expect(within(head as HTMLElement).getByText("Pulpo Zarandeado")).toBeInTheDocument();
    expect(within(head as HTMLElement).getByText("$24")).toBeInTheDocument();
    expect(container.querySelector("figure.dc-photo-circle")).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-pill")).toHaveLength(2);
    expect(container.querySelectorAll(".dc-pill svg")).toHaveLength(1);
  });
  it("works with no image, price or tags", () => {
    const { container } = render(<DishCard name="Enchiladas" />);
    expect(container.querySelector(".dc-photo-empty")).toBeInTheDocument();
    expect(container.querySelector(".dc-dish-price")).toBeNull();
    expect(container.querySelector(".dc-dish-tags")).toBeNull();
  });
});

describe("MenuSection", () => {
  it("lists items, omits the price leader for unpriced items and marks featured ones", () => {
    const { container } = render(
      <MenuSection
        title="Mariscos"
        note="From the coast"
        items={[
          { name: "Salmón Mango", price: "$22" },
          { name: "Pulpo", price: "", featured: true, tags: ["Spicy"] },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Mariscos" })).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-mi")).toHaveLength(2);
    expect(container.querySelectorAll(".dc-mi-price")).toHaveLength(1);
    expect(container.querySelector(".dc-mi-featured")).toHaveTextContent("Pulpo");
    expect(screen.getByRole("img", { name: "Spicy" })).toBeInTheDocument();
  });
});

describe("SpecialsBoard", () => {
  it("renders specials as rows, with the drinks list under its own title", () => {
    const { container } = render(
      <SpecialsBoard
        eyebrow="Every day a special"
        specials={[{ day: "Tuesday", item: "3 Tacos for", price: "$5.75", note: "Ground beef" }, { day: "Monday", item: "Carnitas", price: "$10" }]}
        drinks={[{ name: "House Margarita 16oz", price: "$5.75", icon: "margarita" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Daily Specials" })).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-special")).toHaveLength(2);
    expect(screen.getByText("Everyday drinks")).toBeInTheDocument();
    expect(screen.getByText("House Margarita 16oz")).toBeInTheDocument();
  });
  it("omits the drinks block when there are none", () => {
    const { container } = render(<SpecialsBoard specials={[]} />);
    expect(container.querySelector(".dc-board-drinks")).toBeNull();
  });
});

describe("PromoBanner", () => {
  it("is rose by default, lists deals and links the CTA", () => {
    const { container } = render(
      <PromoBanner eyebrow="Everyday drinks" title="Happy hour" lede="All day." deals={[{ name: "Draft Beer 16oz", price: "$4", icon: "beer" }]} cta="Find a Location" ctaHref="/locations" />,
    );
    expect(container.querySelector("section")).toHaveClass("dc-promo", "dc-promo-rose");
    expect(screen.getByText("Draft Beer 16oz")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find a Location" })).toHaveAttribute("href", "/locations");
  });
  it("supports the navy-900 tone and drops a multi-word script", () => {
    const { container } = render(<PromoBanner tone="navy-900" title="Catering" script="for your crowd" />);
    expect(container.querySelector("section")).toHaveClass("dc-promo-navy-900");
    expect(container.querySelector(".dc-promo-script")).toBeNull();
  });
});

describe("LocationCard", () => {
  it("shows address, a tel link, hours rows and a directions link", () => {
    render(<LocationCard city="Lee's Summit, MO" address="701 SE Melody Ln" phone="+1 816-434-5222" hours={["Every day|11am–10pm"]} href="/locations/lees-summit" />);
    expect(screen.getByRole("link", { name: "+1 816-434-5222" })).toHaveAttribute("href", "tel:+18164345222");
    expect(screen.getByText("Every day")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Directions" })).toHaveAttribute("href", "/locations/lees-summit");
  });
  it("coming soon: badge, no CTA, no contact lines", () => {
    const { container } = render(<LocationCard city="O'Fallon, IL" comingSoon />);
    expect(container.querySelector("article")).toHaveClass("dc-loc-soon");
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector(".dc-loc-line")).toBeNull();
  });
  it("hides the CTA when cta is null", () => {
    render(<LocationCard city="X" address="1 Main St" cta={null} />);
    expect(screen.queryByRole("link", { name: "Get Directions" })).toBeNull();
  });
});

describe("CategoryGrid", () => {
  it("numbers the tiles, links them and uses the photo when there is one", () => {
    const { container } = render(
      <CategoryGrid
        items={[
          { name: "Tacos", href: "/menu#tacos", image: { src: "/t.webp", alt: "A taco" } },
          { name: "Drinks", href: "/menu#drinks", icon: "margarita" },
        ]}
      />,
    );
    const tiles = container.querySelectorAll("a.dc-cat");
    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toHaveAttribute("href", "/menu#tacos");
    expect(tiles[0].querySelector(".dc-cat-num")).toHaveTextContent("01");
    expect(tiles[0].querySelector("img.dc-cat-img")).toHaveAttribute("alt", "A taco");
  });
  it("falls back to the icon when an item has no image", () => {
    const { container } = render(<CategoryGrid items={[{ name: "Drinks", icon: "margarita" }, { name: "Other" }]} />);
    const tiles = container.querySelectorAll("a.dc-cat");
    expect(tiles[0].querySelector(".dc-cat-icon svg")).toBeInTheDocument();
    expect(tiles[0].querySelector("img")).toBeNull();
    expect(tiles[1].querySelector(".dc-cat-icon svg")).toBeInTheDocument();
  });
});

describe("SocialGrid", () => {
  it("shows the handle, a follow link and at most six tiles", () => {
    const images = Array.from({ length: 8 }, (_, i) => ({ src: `/s${i}.webp`, alt: `Shot ${i}` }));
    const { container } = render(<SocialGrid images={images} />);
    expect(screen.getByRole("heading", { name: "@donchuysmo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Follow us" })).toHaveAttribute("href", "https://www.instagram.com/donchuysmo/");
    expect(container.querySelectorAll("a.dc-social-tile")).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/dc/content.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Rewrite `components/dc/menu.tsx`**

```tsx
import Link from "next/link";
import { Pattern } from "./decor";
import { Eyebrow } from "./eyebrow";
import { Icon, type IconName } from "./icon";
import { PhotoFrame } from "./photo-frame";
import { Pill } from "./pill";
import { cx, type Img } from "./utils";

export interface DishCardProps {
  name: string;
  description?: string;
  price?: string;
  image?: Img;
  tags?: string[];
  href?: string;
  className?: string;
}

export function DishCard({ name, description, price, image, tags = [], href, className }: DishCardProps) {
  return (
    <article className={cx("dc-dish", className)}>
      <div className="dc-dish-media">
        <Pattern name="talavera-tile" tone="navy" className="dc-dish-pattern" size={64} />
        <PhotoFrame src={image?.src} alt={image?.alt} shape="circle" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 36vw, 70vw" />
      </div>
      <div className="dc-dish-body">
        <div className="dc-dish-head">
          <h3 className="dc-dish-name">{href ? <Link href={href}>{name}</Link> : name}</h3>
          {price ? <span className="dc-dish-price">{price}</span> : null}
        </div>
        {description ? <p className="dc-dish-desc">{description}</p> : null}
        {tags.length ? (
          <div className="dc-dish-tags">
            {tags.map((tag) => (
              <Pill key={tag} icon={tag === "Spicy" ? "chile" : undefined}>
                {tag}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export interface MenuItemProps {
  name: string;
  /** Pass an empty string to omit the price (items whose real price is not confirmed yet). */
  price: string;
  description?: string;
  tags?: Array<"Spicy" | "Veggie" | (string & {})>;
  featured?: boolean;
  className?: string;
}

const tagIcon = (tag: string): IconName => (tag === "Spicy" ? "chile" : tag === "Veggie" ? "avocado" : "sparkle");

export function MenuItem({ name, description, price, tags = [], featured, className }: MenuItemProps) {
  return (
    <div className={cx("dc-mi", featured && "dc-mi-featured", className)}>
      <div className="dc-mi-head">
        <span className="dc-mi-name">
          {name}
          {tags.map((tag) => (
            <Icon key={tag} name={tagIcon(tag)} size={15} title={tag} className="dc-mi-tag" />
          ))}
        </span>
        {price ? (
          <>
            <span className="dc-mi-dots" aria-hidden="true" />
            <span className="dc-mi-price">{price}</span>
          </>
        ) : null}
      </div>
      {description ? <p className="dc-mi-desc">{description}</p> : null}
    </div>
  );
}

export function MenuSection({
  title,
  note,
  items = [],
  id,
  className,
}: {
  title: string;
  note?: string;
  items: MenuItemProps[];
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx("dc-ms", className)}>
      <header className="dc-ms-head">
        <h3 className="dc-ms-title">{title}</h3>
        {note ? <span className="dc-ms-note">{note}</span> : null}
      </header>
      <div className="dc-ms-list">
        {items.map((item) => (
          <MenuItem key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}

export interface SpecialRowProps {
  day: string;
  item: string;
  price?: string;
  note?: string;
  className?: string;
}

export function SpecialRow({ day, item, price, note, className }: SpecialRowProps) {
  return (
    <div className={cx("dc-special", className)}>
      <span className="dc-special-day">{day}</span>
      <span className="dc-special-body">
        <span className="dc-special-item">{item}</span>
        {note ? <span className="dc-special-note">{note}</span> : null}
      </span>
      {price ? <span className="dc-special-price">{price}</span> : null}
    </div>
  );
}

export function SpecialsBoard({
  eyebrow,
  title = "Daily Specials",
  specials = [],
  drinksTitle = "Everyday drinks",
  drinks = [],
  className,
}: {
  eyebrow?: string;
  title?: string;
  specials: SpecialRowProps[];
  drinksTitle?: string;
  drinks?: { name: string; price: string; icon?: IconName }[];
  className?: string;
}) {
  return (
    <section className={cx("dc-board", className)}>
      <div className="dc-board-inner">
        {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
        <h2 className="dc-board-title">{title}</h2>
        <div className="dc-board-rows">
          {specials.map((special) => (
            <SpecialRow key={special.day} {...special} />
          ))}
        </div>
        {drinks.length ? (
          <div className="dc-board-drinks">
            <p className="dc-board-drinks-title">{drinksTitle}</p>
            <div className="dc-board-drinklist">
              {drinks.map((drink) => (
                <span key={drink.name}>
                  <Icon name={drink.icon ?? "margarita"} size={20} />
                  {drink.name}
                  <b>{drink.price}</b>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `components/dc/sections.tsx`**

```tsx
import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { Icon, type IconName } from "./icon";
import { Pill } from "./pill";
import { cx, renderAccent, scriptWord } from "./utils";

export function PromoBanner({
  eyebrow,
  title = "Everyday drinks",
  script,
  lede,
  deals = [],
  cta,
  ctaHref = "#",
  tone = "rose",
  className,
}: {
  eyebrow?: string;
  title?: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  deals?: { name: string; price: string; icon?: IconName }[];
  cta?: string;
  ctaHref?: string;
  /** rose is the one feature block per page. */
  tone?: "rose" | "navy-900";
  className?: string;
}) {
  const word = scriptWord(script);
  return (
    <section className={cx("dc-promo", `dc-promo-${tone}`, className)}>
      <Flower variant="mono" tone="white" className="dc-promo-flower" size={null} />
      <div className="dc-promo-copy">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {word ? <span className="dc-promo-script">{word}</span> : null}
        <h2 className="dc-promo-title">{renderAccent(title)}</h2>
        {lede ? <p className="dc-promo-lede">{lede}</p> : null}
        {cta ? (
          <Button href={ctaHref} variant="ivory" icon="arrow-right">
            {cta}
          </Button>
        ) : null}
      </div>
      {deals.length ? (
        <ul className="dc-promo-deals">
          {deals.map((deal) => (
            <li key={deal.name}>
              <Icon name={deal.icon ?? "margarita"} size={24} />
              <span>{deal.name}</span>
              <b>{deal.price}</b>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export interface LocationCardProps {
  city: string;
  address?: string;
  phone?: string;
  /** "Days|Times" strings, e.g. "Mon–Thu|11am–10pm". */
  hours?: string[];
  comingSoon?: boolean;
  href?: string;
  cta?: string | null;
  className?: string;
}

export function LocationCard({
  city,
  address,
  phone,
  hours = [],
  comingSoon,
  href = "#",
  cta = "Get Directions",
  className,
}: LocationCardProps) {
  return (
    <article className={cx("dc-loc", comingSoon && "dc-loc-soon", className)}>
      <header className="dc-loc-head">
        <h3 className="dc-loc-city">{city}</h3>
        {comingSoon ? <Pill tone="marigold">Coming soon</Pill> : null}
      </header>
      {address ? (
        <p className="dc-loc-line">
          <Icon name="pin" size={16} />
          {address}
        </p>
      ) : null}
      {phone ? (
        <p className="dc-loc-line">
          <Icon name="phone" size={16} />
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
        </p>
      ) : null}
      {hours.length ? (
        <ul className="dc-loc-hours">
          {hours.map((row) => {
            const [days, time] = row.split("|");
            return (
              <li key={row}>
                <span>{days}</span>
                <span>{time}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {cta && !comingSoon ? (
        <Button href={href} variant="link" icon="arrow-up-right">
          {cta}
        </Button>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 5: Create `components/dc/category-grid.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx, isInternal, type Img } from "./utils";

export interface CategoryGridItem {
  name: string;
  href?: string;
  /** Full-bleed photo under a navy veil. Without it the tile shows `icon` (default utensils). */
  image?: Img;
  icon?: IconName;
}

function Tile({ item, index }: { item: CategoryGridItem; index: number }) {
  const href = item.href ?? "#";
  const body: ReactNode = (
    <>
      {item.image ? (
        <Image
          className="dc-cat-img"
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 560px) 50vw, 100vw"
          quality={90}
          style={item.image.focus ? { objectPosition: item.image.focus } : undefined}
        />
      ) : (
        <span className="dc-cat-icon">
          <Icon name={item.icon ?? "utensils"} size={88} strokeWidth={1} />
        </span>
      )}
      <span className="dc-cat-scrim" aria-hidden="true" />
      <span className="dc-cat-num">{String(index + 1).padStart(2, "0")}</span>
      <span className="dc-cat-foot">
        <span className="dc-cat-name">{item.name}</span>
        <span className="dc-cat-go">
          <Icon name="arrow-right" size={18} />
        </span>
      </span>
    </>
  );
  return isInternal(href) ? (
    <Link href={href} className="dc-cat">
      {body}
    </Link>
  ) : (
    <a href={href} className="dc-cat">
      {body}
    </a>
  );
}

export function CategoryGrid({ items, className }: { items: CategoryGridItem[]; className?: string }) {
  return (
    <div className={cx("dc-cats", className)}>
      {items.map((item, i) => (
        <Tile key={item.name} item={item} index={i} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create `components/dc/social-grid.tsx`**

```tsx
import Image from "next/image";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { Icon } from "./icon";
import { cx, type Img } from "./utils";

export function SocialGrid({
  eyebrow = "Instagram",
  handle = "@donchuysmo",
  href = "https://www.instagram.com/donchuysmo/",
  images,
  className,
}: {
  eyebrow?: string;
  handle?: string;
  href?: string;
  images: Img[];
  className?: string;
}) {
  return (
    <section className={cx("dc-social", className)}>
      <header className="dc-social-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="dc-social-handle">{handle}</h2>
        <Button href={href} variant="link" icon="arrow-up-right">
          Follow us
        </Button>
      </header>
      <div className="dc-social-grid">
        {images.slice(0, 6).map((image) => (
          <a key={image.src} href={href} className="dc-social-tile">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 900px) 20vw, 33vw"
              quality={90}
              style={image.focus ? { objectPosition: image.focus } : undefined}
            />
            <span className="dc-social-hover">
              <Icon name="arrow-up-right" size={24} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Rewrite `components/dc/index.ts` and delete `creative.tsx`**

```ts
export { Button, type ButtonProps } from "./button";
export { CategoryGrid, type CategoryGridItem } from "./category-grid";
export { CategoryTabs, type CategoryTabsProps } from "./category-tabs";
export { Flower, Logo, Marquee, Pattern, TileBand, type ColorToken } from "./decor";
export { Eyebrow } from "./eyebrow";
export { FeatureSplit } from "./feature-split";
export { Footer, type FooterProps } from "./footer";
export { Input, Newsletter, type InputProps, type NewsletterProps } from "./forms";
export { Hero, type HeroProps } from "./hero";
export { Icon, type IconName, type IconProps } from "./icon";
export {
  DishCard,
  MenuItem,
  MenuSection,
  SpecialRow,
  SpecialsBoard,
  type DishCardProps,
  type MenuItemProps,
  type SpecialRowProps,
} from "./menu";
export { NavBar, type NavBarProps } from "./nav-bar";
export { PhotoFrame, type PhotoFrameProps } from "./photo-frame";
export { Pill, type PillProps } from "./pill";
export { LocationCard, PromoBanner, type LocationCardProps } from "./sections";
export { SectionHeader, type SectionHeaderProps } from "./section-header";
export { SocialGrid } from "./social-grid";
export { Statement } from "./statement";
export { ValueProps, type ValuePropItem } from "./value-props";
export type { Img, LinkItem } from "./utils";
```

Then: `git rm components/dc/creative.tsx`

- [ ] **Step 8: Run to verify it passes**

Run: `npx vitest run components/dc`
Expected: PASS for all component test files (utils, icon, primitives, decor, chrome, blocks, content).

- [ ] **Step 9: Commit**

```bash
git add components/dc
git commit -m "feat: rebuild menu, promo, location, category and social components for v6

Removes sticker, word stack, poster card, color split and brand paper.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Site chrome and the Home page

**Files:**
- Create: `components/site/site-chrome.tsx`
- Rewrite: `app/page.tsx`
- Modify: `data/site.ts` (`dailySpecials.title`)
- Test: `components/site/site-chrome.test.tsx`

**Interfaces:**
- Consumes: `locations` (`data/locations`), `NavBar`, `Footer`.
- Produces: `pageContainer: string`; `SiteHeader({active?: "Menu"|"Specials"|"Locations"|"Catering"|"About"})`; `SiteFooter()`.

Copy edits in this task (allowed by Global Constraints): Home hero title `Real deal *Mexican* flavor` (was `Real-deal *Mexican* flavor from our family to yours`); Home Statement uses `siteContent.taglines[0]` as title; `Daily Specials` title; the existing `Fresh off the grill` block copy is kept. Confirm these four with the client when reviewing.

- [ ] **Step 1: Write the failing test**

`components/site/site-chrome.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter, SiteHeader, pageContainer } from "./site-chrome";

describe("site chrome", () => {
  it("marks the page's link active in the sticky header", () => {
    const { container } = render(<SiteHeader active="Menu" />);
    expect(container.querySelector("header")).toHaveClass("sticky", "top-0");
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Specials" })).toHaveAttribute("href", "/happy-hour");
  });
  it("footer lists every location, with Coming soon for the unopened one", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("heading", { name: "Overland Park, KS" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
  it("exposes the shared page container classes", () => {
    expect(pageContainer).toContain("max-w-[var(--container-max)]");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run components/site/site-chrome.test.tsx`
Expected: FAIL (module missing).

- [ ] **Step 3: Create `components/site/site-chrome.tsx`**

```tsx
import { Footer, NavBar } from "@/components/dc";
import { locations } from "@/data/locations";

/** Page content width + gutters, shared by every page. */
export const pageContainer = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Catering", href: "/catering" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40">
      <NavBar links={navLinks} active={active} cta="Order Online" ctaHref="/locations" />
    </header>
  );
}

export function SiteFooter() {
  return (
    <Footer
      locations={locations.map((location) => ({
        city: location.name,
        address: location.address || undefined,
        phone: location.phone || undefined,
      }))}
      links={footerLinks}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run components/site/site-chrome.test.tsx`
Expected: PASS.

- [ ] **Step 5: Change the specials title and pin it in the existing site test**

In `data/site.ts` replace `title: "DA!LY SPEC!ALS",` with `title: "Daily Specials",`.

Append to `data/site.test.ts` inside the `describe`:

```ts
  it("names the specials board without v5 glyph tricks (Eudora draws the i as ! itself)", () => {
    expect(siteContent.dailySpecials.title).toBe("Daily Specials");
  });
```

Run: `npx vitest run data/site.test.ts` → Expected: PASS.

- [ ] **Step 6: Rewrite `app/page.tsx`**

```tsx
import { locations } from "@/data/locations";
import { menu } from "@/data/menu";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import {
  Button,
  CategoryGrid,
  DishCard,
  FeatureSplit,
  Hero,
  LocationCard,
  Newsletter,
  PromoBanner,
  SectionHeader,
  SocialGrid,
  SpecialsBoard,
  Statement,
  ValueProps,
} from "@/components/dc";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const formatPrice = (price: number | null) => (price != null ? `$${price.toFixed(2)}` : undefined);

// Real reviewed menu items (needsCopyReview: false) with confirmed descriptions —
// no stock/mismatched photos are used since these dishes have no confirmed photo yet.
const signatureDishes = menu
  .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })))
  .filter((item) => !item.needsCopyReview)
  .filter((item) => ["Steak & Lobster", "Pulpo Zarandeado", "Tostada de Ceviche"].includes(item.name));

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="photo"
          eyebrow="Fresh Mex & Cantina"
          title="Real deal *Mexican* flavor"
          lede={siteContent.hero.subheadline}
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/spread-seafood-boil-wide.webp", alt: "A table spread with a seafood boil, ceviche and grilled steak" }}
          mobileImage={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table" }}
        />

        <div className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <Statement eyebrow="Desde León, Mexico" title={siteContent.taglines[0]} body={siteContent.about.body} />
          <ValueProps
            items={[
              { icon: "sparkle", title: "Freshest ingredients", text: "We are proud to use the freshest ingredients in every dish we serve." },
              { icon: "agave", title: "Recipes from León", text: "Family recipes passed down through generations, from León, Mexico." },
              { icon: "flame", title: "Josper-grilled", text: "Smoky char from our Josper grill in every dish, every time." },
              { icon: "utensils", title: "Come for the fun", text: "Come for the food, stay for the fun — every visit feels like family." },
            ]}
          />
        </div>

        <FeatureSplit
          tone="navy-900"
          flower
          eyebrow="Fast fresh & delicious"
          title="Fresh off the grill"
          body="Smoky char, bold flavor, made to order — every dish comes straight from our Josper grill to your table."
          cta="View Menu"
          ctaHref="/menu"
          image={{ src: "/images/photos/dish-carne-asada-cutting.webp", alt: "Carving carne asada on a sizzling platter" }}
        />

        <div className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeader eyebrow="Nuestros favoritos" title="Signature dishes" lede="The plates our regulars order again and again." />
            <Button variant="link" icon="arrow-right" href="/menu">
              Full Menu
            </Button>
          </div>
          <div className="grid gap-[var(--space-6)] sm:grid-cols-3">
            {signatureDishes.map((dish) => (
              <DishCard
                key={dish.name}
                name={dish.name}
                description={dish.description}
                price={formatPrice(dish.price)}
                tags={dish.tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
              />
            ))}
          </div>
        </div>

        <CategoryGrid
          items={[
            { name: "Tacos", href: "/menu#tacos", image: { src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand" } },
            { name: "La Cevichería", href: "/menu#cevicheria", image: { src: "/images/photos/dish-shrimp-ceviche-app.webp", alt: "Shrimp ceviche with an avocado rose" } },
            { name: "Steak House", href: "/menu#steak-house", image: { src: "/images/photos/dish-steak-plate-wide.webp", alt: "A grilled steak plate" } },
            { name: "Drinks", href: "/menu#drinks", image: { src: "/images/photos/drink-red-cocktail-bar.webp", alt: "A red margarita on the bar" } },
          ]}
        />

        <div className={pageContainer}>
          <SpecialsBoard
            eyebrow={siteContent.dailySpecials.subtitle}
            title={siteContent.dailySpecials.title}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
          />
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Everyday drinks"
          title="Happy hour, every hour"
          lede="No clock-watching — these drink prices run every day, all day."
          deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
          cta="Find a Location"
          ctaHref="/locations"
        />

        <section id="locations" className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your table"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <LocationCard
                key={location.slug}
                city={location.name}
                address={location.address || undefined}
                phone={location.phone || undefined}
                hours={location.hours.map((row) => `${row.days}|${row.time}`)}
                comingSoon={location.comingSoon}
                href={location.address ? mapsUrl(location.address) : `/locations/${location.slug}`}
              />
            ))}
          </div>
        </section>

        <div className={pageContainer}>
          <SocialGrid
            images={[
              { src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant" },
              { src: "/images/photos/drink-pink-margarita-talavera.webp", alt: "A pink margarita served in a blue-rimmed talavera glass" },
              { src: "/images/photos/dish-grilled-skewer-molcajete.webp", alt: "A molcajete of grilled seafood beside carne asada" },
              { src: "/images/photos/interior-stone-lion.webp", alt: "A carved stone lion statue at the restaurant entrance" },
              { src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" },
              { src: "/images/photos/dish-churros-dipping.webp", alt: "Churros with an assortment of dipping sauces" },
            ]}
          />
        </div>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add components/site app/page.tsx data/site.ts data/site.test.ts
git commit -m "feat: rebuild the home page on v6 and add shared site chrome

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Inner pages — About, Happy Hour, Locations (+ detail), Catering, Contact, forms

**Files:**
- Rewrite: `app/about/page.tsx`, `app/happy-hour/page.tsx`, `app/locations/page.tsx`, `app/locations/[slug]/page.tsx`, `app/catering/page.tsx`, `app/contact/page.tsx`
- Modify: `app/catering/inquiry-form.tsx`, `app/contact/inquiry-form.tsx` (confirmation block only)
- Test: `lib/pages.test.ts` (guard added in Task 12; this task only rebuilds)

**Interfaces:**
- Consumes: `SiteHeader`, `SiteFooter`, `pageContainer`, v6 components. Metadata exports and `generateStaticParams`/`generateMetadata` are copied unchanged.

Page copy edits (allowed): About keeps `Family *roots*, big flavor`; Happy Hour hero title `Happy hour` with script `Salud` (was `HA!PPY HOUR`); Happy Hour promo title `Happy hour, every hour`; Catering title `Let us bring Don Chuy's to your table` (no accent) so the page has zero script words.

- [ ] **Step 1: Rewrite `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { FeatureSplit, Hero, Marquee, Newsletter } from "@/components/dc";

export const metadata: Metadata = {
  title: "About Us | Don Chuy's Fresh Mex & Cantina",
  description: "Family recipes from León, Mexico, brought to Kansas City, Lee's Summit and Johnson City with fresh ingredients and Josper-grilled flavor.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="About" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="split"
          eyebrow="Nuestra historia"
          title="Family *roots*, big flavor"
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/dish-shrimp-paella-modelo.webp", alt: "Shrimp ceviche served on a paella pan with Modelo bottles" }}
        />

        <FeatureSplit
          tone="navy-900"
          eyebrow={siteContent.taglines[0]}
          title="Come as guests. Leave as family."
          body={siteContent.about.body}
          image={{ src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant", focus: "50% 35%" }}
        />

        <Marquee items={[...siteContent.taglines]} />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

`Newsletter`, `FeatureSplit`, `PromoBanner` and `Hero` are full-bleed by design (they carry their own padding and background), so pages render them directly and only wrap narrower blocks in `pageContainer`.

- [ ] **Step 2: Rewrite `app/happy-hour/page.tsx`**

```tsx
import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Hero, Newsletter, PromoBanner, SpecialsBoard } from "@/components/dc";

export const metadata: Metadata = {
  title: "Daily Specials & Happy Hour | Don Chuy's Fresh Mex & Cantina",
  description: "Don Chuy's daily specials and everyday happy hour drink deals — a different special every day, all day.",
};

export default function HappyHourPage() {
  return (
    <>
      <SiteHeader active="Specials" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="photo"
          eyebrow="Fresh Mex & Cantina"
          script="Salud"
          title="Happy hour"
          lede="A different special every day, plus everyday drink deals — no clock-watching required."
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" }}
        />

        <div className={pageContainer}>
          <SpecialsBoard
            eyebrow={siteContent.dailySpecials.subtitle}
            title={siteContent.dailySpecials.title}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
          />
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Everyday drinks"
          title="Happy hour, every hour"
          lede="No clock-watching — these drink prices run every day, all day."
          deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
          cta="Find a Location"
          ctaHref="/locations"
        />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Rewrite `app/locations/page.tsx`**

```tsx
import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { LocationCard, Newsletter, SectionHeader } from "@/components/dc";

export const metadata: Metadata = {
  title: "Locations | Don Chuy's Fresh Mex & Cantina",
  description: "Find your nearest Don Chuy's Fresh Mex & Cantina — Overland Park KS, Lee's Summit MO, Johnson City TN and soon O'Fallon IL.",
};

export default function LocationsPage() {
  return (
    <>
      <SiteHeader active="Locations" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <section className={`${pageContainer} flex flex-col gap-[var(--space-7)] pt-[var(--space-7)] md:pt-[var(--space-8)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your table"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <LocationCard
                key={location.slug}
                city={location.name}
                address={location.address || undefined}
                phone={location.phone || undefined}
                hours={location.hours.map((row) => `${row.days}|${row.time}`)}
                comingSoon={location.comingSoon}
                href={`/locations/${location.slug}`}
                cta={location.comingSoon ? null : "View Location"}
              />
            ))}
          </div>
        </section>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 4: Rewrite `app/locations/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Button, Icon, Newsletter, Pill, SectionHeader } from "@/components/dc";
import { buildLocationJsonLd, locationMetaDescription, locationMetaTitle } from "@/lib/seo";

const SIGNATURE_DISH = "Steak & Lobster";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) return {};
  return {
    title: locationMetaTitle(location),
    description: location.comingSoon
      ? `Don Chuy's Fresh Mex & Cantina is coming soon to ${location.name}.`
      : locationMetaDescription(location, SIGNATURE_DISH),
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) notFound();

  const jsonLd = location.comingSoon ? null : buildLocationJsonLd(location);

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}

      <SiteHeader active="Locations" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <section className={`${pageContainer} pt-[var(--space-7)] md:pt-[var(--space-8)]`}>
          {location.comingSoon ? (
            <div className="flex flex-col items-start gap-[var(--space-5)]">
              <SectionHeader
                eyebrow="Coming soon"
                title={location.name}
                lede="We're not open here yet — check back soon, or visit one of our open locations in the meantime."
              />
              <Pill tone="marigold">Coming soon</Pill>
            </div>
          ) : (
            <>
              <SectionHeader eyebrow="Don Chuy's" title={location.name} lede={location.intro} />

              <div className="mt-[var(--space-6)] grid gap-[var(--space-6)] md:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col gap-[var(--space-4)]">
                  <p className="dc-loc-line">
                    <Icon name="pin" size={18} />
                    {location.address}
                  </p>
                  <p className="dc-loc-line">
                    <Icon name="phone" size={18} />
                    <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
                  </p>
                  <Button href={mapsUrl(location.address)} variant="outline" icon="arrow-up-right" className="self-start">
                    Get Directions
                  </Button>

                  {location.reviews.length ? (
                    <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-5)]">
                      {location.reviews.map((review) => (
                        <blockquote key={review.author} className="dc-quote">
                          <p>&ldquo;{review.quote}&rdquo;</p>
                          <cite>— {review.author}</cite>
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="dc-panel">
                  <p className="dc-panel-title">Hours</p>
                  <ul className="dc-loc-hours">
                    {location.hours.map((row) => (
                      <li key={row.days}>
                        <span>{row.days}</span>
                        <span>{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {location.closing ? <p className="lede mt-[var(--space-6)]">{location.closing}</p> : null}
            </>
          )}
        </section>

        <Newsletter title={location.comingSoon ? "Be the first to know" : undefined} />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5: Rewrite `app/catering/page.tsx`**

```tsx
import type { Metadata } from "next";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { FeatureSplit, Newsletter } from "@/components/dc";
import { CateringInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Catering | Don Chuy's Fresh Mex & Cantina",
  description: "Bring Don Chuy's Fresh Mex & Cantina to your next event — request a catering quote.",
};

export default function CateringPage() {
  return (
    <>
      <SiteHeader active="Catering" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <FeatureSplit
          tone="navy-900"
          shape="frame"
          eyebrow="Catering & events"
          title="Let us bring Don Chuy's to your table"
          body="From sizzling specials to family favorites, we can cater your next get-together. Tell us about your event and a location near you will follow up with details."
          image={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table", focus: "50% 60%" }}
        />

        <div className={pageContainer}>
          <CateringInquiryForm />
        </div>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 6: Rewrite `app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Icon, Newsletter, SectionHeader } from "@/components/dc";
import { ContactInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | Don Chuy's Fresh Mex & Cantina",
  description: "Get in touch with Don Chuy's Fresh Mex & Cantina — reach out to your nearest location or send us a message.",
};

export default function ContactPage() {
  const openLocations = locations.filter((l) => !l.comingSoon);

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-[var(--space-7)]">
        <div className={`${pageContainer} pt-[var(--space-7)]`}>
          <SectionHeader eyebrow="Get in touch" title="We'd love to hear from you" lede="Reach your nearest Don Chuy's directly, or send us a message below." />
        </div>

        <div className={`${pageContainer} grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3`}>
          {openLocations.map((location) => (
            <div key={location.slug} className="dc-panel">
              <p className="dc-panel-title">{location.name}</p>
              <p className="dc-loc-line">
                <Icon name="pin" size={16} />
                {location.address}
              </p>
              <p className="dc-loc-line">
                <Icon name="phone" size={16} />
                <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
              </p>
            </div>
          ))}
        </div>

        <div className={pageContainer}>
          <ContactInquiryForm />
        </div>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 7: Update the two form confirmation blocks**

In `app/catering/inquiry-form.tsx` replace the `if (sent) { return (...); }` block with:

```tsx
  if (sent) {
    return (
      <div className="dc-note" role="status">
        <p className="dc-note-title">Thanks — we&rsquo;ve got it</p>
        <p>Someone from Don Chuy&rsquo;s will follow up about your event soon.</p>
      </div>
    );
  }
```

In `app/contact/inquiry-form.tsx` replace the `sent` block's JSX with:

```tsx
      <div className="dc-note" role="status">
        <p className="dc-note-title">Message sent</p>
        <p>Thanks for reaching out — someone from Don Chuy&rsquo;s will get back to you soon.</p>
      </div>
```

(keep the surrounding `if (sent) { return ( ... ); }` of the contact form as is.)

Also in both forms change `<Button type="submit" size="lg" icon="arrow-right" className="self-start">` usages: no change needed (`primary` default). The catering/contact message `Input` stays.

- [ ] **Step 8: Commit**

```bash
git add app/about app/happy-hour app/locations app/catering app/contact
git commit -m "feat: rebuild about, happy hour, locations, catering and contact on v6

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Menu page and menu browser

**Files:**
- Rewrite: `app/menu/page.tsx`
- Modify: `app/menu/menu-filter.tsx`
- Test: `app/menu/menu-filter.test.tsx`

**Interfaces:**
- Consumes: `MenuBrowser({categories})` props unchanged; `filterMenu`; `PhotoFrame`, `Icon`, `Input`.
- Produces: the same `MenuBrowser`; breaks now render `.mn-break-title` (display type) instead of Yellowtail phrases; all breaks use the one navy-900 style.

- [ ] **Step 1: Write the failing test**

`app/menu/menu-filter.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { menu } from "@/data/menu";
import { MenuBrowser } from "./menu-filter";

beforeAll(() => {
  // jsdom has no IntersectionObserver; the scroll-spy only needs it to exist.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
  Element.prototype.scrollTo = vi.fn();
});

describe("MenuBrowser", () => {
  it("renders every category with a chip and a numbered heading", () => {
    const { container } = render(<MenuBrowser categories={menu} />);
    expect(container.querySelectorAll("section.mn-cat")).toHaveLength(menu.length);
    expect(container.querySelectorAll("a.mn-chip")).toHaveLength(menu.length);
    expect(container.querySelector(".mn-cat-num")).toHaveTextContent("01");
  });

  it("photo breaks use display titles, never script phrases, and no rose tone", () => {
    const { container } = render(<MenuBrowser categories={menu} />);
    const breaks = container.querySelectorAll("aside.mn-break");
    expect(breaks.length).toBeGreaterThan(0);
    expect(container.querySelector(".mn-break-script")).toBeNull();
    expect(container.querySelector("[class*='mn-break-rose']")).toBeNull();
    expect(breaks[0].querySelector(".mn-break-title")).toBeInTheDocument();
  });

  it("hides photo breaks while searching and shows the empty message when nothing matches", async () => {
    const user = userEvent.setup();
    const { container } = render(<MenuBrowser categories={menu} />);
    const search = screen.getByRole("searchbox", { name: "Search the menu" });
    await user.type(search, "zzzzzz-no-such-dish");
    expect(container.querySelector("aside.mn-break")).toBeNull();
    expect(screen.getByText(/No dishes match that search/)).toBeInTheDocument();
    expect(container.querySelector("section.mn-cat")).toBeNull();
  });

  it("narrows to matching dishes and drops the breaks", async () => {
    const user = userEvent.setup();
    const { container } = render(<MenuBrowser categories={menu} />);
    const firstItem = menu[0].items[0].name;
    await user.type(screen.getByRole("searchbox", { name: "Search the menu" }), firstItem);
    expect(container.querySelector("aside.mn-break")).toBeNull();
    expect(screen.getAllByText(firstItem).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run app/menu/menu-filter.test.tsx`
Expected: FAIL (breaks still render `.mn-break-script`; `PhotoFrame shape="rounded"` no longer valid so some runs also fail type-check).

- [ ] **Step 3: Update `app/menu/menu-filter.tsx`**

Replace the `breaksAfter` constant and the `Break`/`breakFor` lines (from `/** Split photo breaks ...` through `const breakFor = ...`) with:

```tsx
/** Photo breaks, each shown after the category it belongs to. Portrait shots in a straight frame; one navy-900 style. */
const breaksAfter = {
  "steak-house": { src: "/images/photos/dish-carne-asada-cutting.webp", alt: "Carving carne asada on a sizzling platter", title: "Josper-grilled", line: "Over real fire, made fresh every day.", flip: false },
  tacos: { src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand", title: "Taco night", line: "Street-style, handmade, every night.", flip: true },
  "pescados-ostras": { src: "/images/photos/dish-shrimp-ceviche-app.webp", alt: "Shrimp ceviche with an avocado rose", title: "Fresh from the sea", line: "Ceviche, oysters and mariscos to share.", flip: false },
  drinks: { src: "/images/photos/drink-red-cocktail-bar.webp", alt: "Red margarita on the bar", title: "Raise a glass", line: "Margaritas, flights and cocktails.", flip: true },
  especiales: { src: "/images/photos/spread-seafood-boil-close.webp", alt: "Seafood boil and plates spread across the table", title: "Made for sharing", line: "Bring the whole table. We'll fill it.", flip: false },
} as const;

type Break = (typeof breaksAfter)[keyof typeof breaksAfter];
const breakFor = (slug: string): Break | null => (breaksAfter as Record<string, Break>)[slug] ?? null;
```

Replace the `MenuBreak` function with:

```tsx
function MenuBreak({ src, alt, title, line, flip }: Break) {
  return (
    <aside className={`mn-break${flip ? " is-flip" : ""}`}>
      <PhotoFrame src={src} alt={alt} shape="frame" ratio="4 / 5" sizes="(min-width: 1100px) 420px, 92vw" className="mn-break-photo" />
      <div className="mn-break-copy">
        <p className="mn-break-title">{title}</p>
        <p className="mn-break-line">{line}</p>
      </div>
    </aside>
  );
}
```

In the `MenuBrowser` return, wrap the sticky chips so the bar is a single element (the bar markup is unchanged), and change the empty-state line to `<p className="body mn-empty">...</p>` (already so). No other change: `mn-tools`, `mn-bar`, `mn-chips`, `mn-book`, `mn-cat` markup stays.

- [ ] **Step 4: Rewrite `app/menu/page.tsx`**

```tsx
import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Newsletter, PromoBanner, SectionHeader } from "@/components/dc";
import { MenuBrowser } from "./menu-filter";

export const metadata: Metadata = {
  title: "Menu | Don Chuy's Fresh Mex & Cantina",
  description: "Browse the full Don Chuy's menu — tacos, fajitas, mariscos, steaks and more, Josper-grilled and made fresh.",
};

export default function MenuPage() {
  return (
    <>
      <SiteHeader active="Menu" />

      <main className="flex flex-1 flex-col gap-[var(--space-7)]">
        <div className={`${pageContainer} pt-[var(--space-7)]`}>
          <SectionHeader
            size="m"
            eyebrow="La comida"
            title="What are you craving?"
            lede="Every dish is Josper-grilled and made fresh. Jump to a section or search for a favorite."
          />
        </div>

        <div className={pageContainer}>
          <MenuBrowser categories={menu} />
          <p className="small mt-[var(--space-6)]">Prices and availability may vary by location.</p>
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Planning something bigger?"
          title="Catering for your crowd"
          lede="From office lunches to family celebrations, let us bring the Don Chuy's spread to you."
          cta="Get a Quote"
          ctaHref="/catering"
        />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5: Run the menu tests and then the whole suite**

Run: `npx vitest run app/menu/menu-filter.test.tsx`
Expected: PASS.

Run: `npx tsc --noEmit`
Expected: PASS now (no page imports a removed component). If it reports an error, it names a file still using `ColorSplit`, `PosterCard`, `Sticker`, `Stamp`, `variant="plate"`, `shape="rounded"`, `tone=` on Button, or `subtitle=`/`plate=` on `SpecialsBoard`; fix that call site to the v6 prop.

- [ ] **Step 6: Measure the nav height and set `--mn-top`**

Run `npm run dev`, open `http://localhost:3000/menu` at 1280px wide, and in the browser console run:

```js
[document.querySelector("header.sticky").getBoundingClientRect().height]
```

Resize to 390px wide and run it again. Set `.mn { --mn-top: <desktop>px }` and the `@media (max-width: 640px) { .mn { --mn-top: <mobile>px } }` value in `app/dc-site.css` to those numbers (initial values 85px / 90px are estimates). Scroll the menu: the chip bar must sit flush under the nav with no gap and no overlap, and a category jump (`#tacos`) must land with its title visible below the bar.

- [ ] **Step 7: Commit**

```bash
git add app/menu app/dc-site.css
git commit -m "feat: rebuild the menu page on v6, photo breaks use display titles

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Page guards — script budget and one rose block

**Files:**
- Create: `lib/pages.test.ts`

- [ ] **Step 1: Write the guard test**

`lib/pages.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.join(import.meta.dirname, "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

const PAGES = [
  "app/page.tsx",
  "app/menu/page.tsx",
  "app/menu/menu-filter.tsx",
  "app/locations/page.tsx",
  "app/locations/[slug]/page.tsx",
  "app/about/page.tsx",
  "app/catering/page.tsx",
  "app/contact/page.tsx",
  "app/happy-hour/page.tsx",
];

/** Script words on a page: one-word *accents* in string literals, plus `script="..."` props. */
const scriptWords = (source: string) => (source.match(/\*[^*\s"'`]+\*/g) ?? []).length + (source.match(/\bscript="/g) ?? []).length;
/** Rose blocks on a page: components given the rose tone. */
const roseBlocks = (source: string) => (source.match(/tone="rose"/g) ?? []).length;

describe("page rules from the brand guide", () => {
  it.each(PAGES)("%s has at most two script words", (file) => {
    expect(scriptWords(read(file))).toBeLessThanOrEqual(2);
  });

  it.each(PAGES)("%s has at most one rose block", (file) => {
    expect(roseBlocks(read(file))).toBeLessThanOrEqual(1);
  });

  it("never passes a multi-word script prop", () => {
    for (const file of PAGES) {
      const phrases = read(file).match(/\bscript="[^"]*\s[^"]*"/g) ?? [];
      expect(phrases, `${file} sets a script phrase`).toEqual([]);
    }
  });

  it("no page still uses removed v5 components or props", () => {
    for (const file of PAGES) {
      const source = read(file);
      for (const removed of ["ColorSplit", "PosterCard", "Sticker", "WordStack", "BrandPaper", "Stamp", "Sunburst", 'variant="poster"', 'variant="plate"']) {
        expect(source, `${file} uses ${removed}`).not.toContain(removed);
      }
    }
  });
});
```

- [ ] **Step 2: Run it**

Run: `npx vitest run lib/pages.test.ts`
Expected: PASS. Expected counts: Home has one script word (`*Mexican*`), About one (`*roots*`), Happy Hour one (`script="Salud"`), Menu zero script and one rose, Home one rose, Happy Hour one rose. If a page fails, fix the page (remove a star or a `tone="rose"`), not the test.

- [ ] **Step 3: Commit**

```bash
git add lib/pages.test.ts
git commit -m "test: guard the script-word budget and one rose block per page

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Verification

**Files:** none (fixes found here go in the file that owns the bug, in a follow-up commit).

- [ ] **Step 1: Full automated gate**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all green. `next build` prints a route table with `/`, `/menu`, `/locations`, `/locations/[slug]`, `/about`, `/catering`, `/contact`, `/happy-hour`. Any `next/image` warning about missing `sizes` is a bug to fix in the component that rendered it.

- [ ] **Step 2: No removed token or class survives anywhere**

```bash
grep -rnE "var\(--(cream|ink|ink-muted|agave|agave-900|chuy-rose|chuy-red|deep-red|sage|paper|surface|on-dark|on-brand|script-ink|teal-(100|700|ink|surface)|marigold-(100|700)|rose-100|shadow-sticker|shadow-lift|radius-(pill|xl))" app components --include='*.tsx' --include='*.ts' --include='*.css'
grep -rnE "dc-(stk|ws|paper|poster|split|stamp|sun|crumbs|hero-poster|hero-stack)|data-theme" app components --include='*.tsx' --include='*.ts' --include='*.css'
```
Expected: no output (the second grep may match `.dc-hero-split`, `.dc-split`-prefixed names only inside `dc-components.css` where `dc-hero-split` is v6; confirm any hit is `dc-hero-split`).

- [ ] **Step 3: Visual check at 1280px and 390px, every page**

Run `npm run dev`. Use the chrome-devtools MCP (`new_page`, `resize_page`, `take_screenshot`, `evaluate_script`) for `/`, `/menu`, `/locations`, `/locations/overland-park`, `/locations/ofallon` (open the coming-soon slug from `data/locations.ts`), `/about`, `/catering`, `/contact`, `/happy-hour`. For each page confirm:
  - page ground is navy; every title is white Eudora in lowercase; the only warm color is marigold (buttons, prices, rules, icons) plus at most one rose block;
  - no horizontal scroll: `evaluate_script` → `document.documentElement.scrollWidth <= window.innerWidth`;
  - Tab through the page: every link and button shows the 2px marigold ring with 3px offset;
  - open each new photo used by Task 9/10 (`dish-steak-plate-wide`, `drink-flight-margaritas`, the category tiles) and confirm the `alt` text describes what is in it; correct the `alt` in the page if it does not.

- [ ] **Step 4: Mobile behavior**

At 390px with touch emulation (`emulate` with a touch device): the home hero shows the portrait crop (`dc-hero-bg-tall` visible, `dc-hero-bg-wide` hidden); the nav toggle opens a deep-navy drawer and closes after tapping a link; category tiles, dish cards, location cards and social tiles fade up on scroll (`.is-inview` toggles); menu photo breaks slide in from opposite sides; the menu chip bar stays under the nav while scrolling and the active chip follows the section.

- [ ] **Step 5: Contrast and reduced motion**

Confirm with `evaluate_script` on a sample of text nodes that no `rgb(237, 157, 85)` (marigold) text is smaller than 19px bold on `navy`, and none sits on `navy-700` (`rgb(37, 91, 126)`). With `prefers-reduced-motion: reduce` emulated, the marquee, flower spin and entrance animations are off and every card is visible.

- [ ] **Step 6: Final commit and hand-off**

Commit any fixes from Steps 1-5 (`git add -p`, one commit per fix, message `fix: ...` with the trailer). Then use superpowers:finishing-a-development-branch to decide how `feat/design-system-v6` lands on `main`.

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| Phase 1: tokens, text classes, globals/shadcn mapping, layout fonts, remove theme | 1 |
| Phase 2: rewrite listed components | 3 (Icon/utils), 4 (Button, Pill, SectionHeader, Eyebrow; CategoryTabs unchanged by design), 5 (decor, PhotoFrame), 6 (NavBar, Footer, Input, Newsletter), 7 (Hero, Statement, ValueProps, FeatureSplit), 8 (DishCard, MenuItem/Section, SpecialRow/Board, PromoBanner, LocationCard, CategoryGrid, SocialGrid) |
| Phase 2: add Statement, Logo | 7, 5 |
| Phase 2: remove Sticker, Stamp, Sunburst, WordStack, BrandPaper, ColorSplit, PosterCard + exports | 5, 8 (`creative.tsx` deleted, `index.ts` rewritten), 12 (guard) |
| Phase 2: keep Marquee, Flower, TileBand, Pattern tone-on-tone | 5 |
| Phase 2: script one word | 3, 4, 7, 8 |
| Phase 2: preserve InViewObserver, menu scroll-spy, responsive hero, hover gating | 2 (touch CSS + targets), 7 (hero), 11 |
| Phase 3: all 7 page groups | 9 (Home), 10 (About, Happy Hour, Locations, detail, Catering, Contact), 11 (Menu) |
| Phase 3: one accent, one rose, ≤2 script, content unchanged, metadata fix | 12, Global Constraints, 1 (layout metadata) |
| Phase 4: tsc, ESLint, Vitest, build, contrast, 390/1280 visuals, focus ring, animations | 13 |
| Delivery: phased commits | commits per task; branch note |
| Risks: v5 names in CSS, removed components on Home, Eudora fallback | 1/2 guard tests, 9, 1 (`@theme static` keeps Bebas in stack) |

Deviations from the spec, all deliberate: text classes live in `app/type.css` (not `globals.css`) to keep `globals.css` focused; components get one commit per task and tsc is red between Tasks 2 and 11 (branch-only); Home loses the enchilada photo block and the "from our family to yours" half of the hero title; `SectionHeader`/`PromoBanner` carry a `script` prop; menu photo breaks use display titles because five script phrases would break the two-script-words rule.

**Placeholder scan:** no TBD/TODO; every code step carries the code. The only measured values are `--mn-top` (estimated 85/90 with an explicit measurement step).

**Type consistency:** `scriptWord`, `renderAccent`, `isInternal`, `toLink`, `Img`, `LinkItem` are defined in Task 3 and used with those names in Tasks 4-9. `Button` variants `primary|ivory|outline|link` are used consistently (hero outline, promo ivory, location link, forms primary). `PhotoFrame` shapes `arch|circle|frame` match `FeatureSplit`, `DishCard`, `Hero`, `MenuBreak`. `SpecialsBoard({eyebrow, title, specials, drinksTitle, drinks})` matches its callers in Tasks 9 and 10. `FeatureSplit` lives in `feature-split.tsx` and is exported from `index.ts` in Task 8. `Footer` locations shape `{city,address?,phone?}` matches `SiteFooter`.
