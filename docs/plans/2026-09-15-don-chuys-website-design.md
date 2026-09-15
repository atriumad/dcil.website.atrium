# Don Chuy's Fresh Mex & Cantina — New Website Design

Source: `Don_Chuys_Auditoria_Copy_Nuevo_Sitio.docx` (TBS Advertising, full audit of don-chuys.com, September 2026).

## Goal

Replace the current one-page, non-responsive site (broken on mobile, duplicated copy between locations, menu as an unindexable flipbook image, inconsistent CTA colors) with a multi-page Next.js site that fixes every issue the audit identified, while keeping the brand's warm, family, "cariño" voice and its strongest visual asset (dish photography).

## Decisions (confirmed with client)

- Content/menu/locations data: hardcoded TypeScript/JSON data files in the repo (no CMS).
- Reviews: static, curated real reviews per location (no live Google Places API for v1).
- Styling: Tailwind CSS + shadcn/ui.
- Forms: Next.js Route Handlers + Resend for email delivery (no third-party form service).
- Deployment: Vercel.
- Images: left as placeholders for this phase; real photography/selection happens later. Every image slot ships with real alt text and correct dimensions/aspect ratio so drop-in later requires no layout changes.
- No live browsing of don-chuys.com — the audit document is the source of truth for existing copy/structure/visuals.

## Tech Stack

- Next.js 15, App Router, TypeScript, React Server Components by default.
- Tailwind CSS + shadcn/ui for accessible base components (buttons, forms, dialogs, nav).
- `next/font/google`: **Libre Baskerville** for headings (kept from current brand), a warm humanist sans (**Mulish** or **Work Sans** — final pick during implementation) for body copy, replacing the current generic Arial.
- Zod for form validation (client + server).
- Resend for transactional email from form submissions.
- Vercel for hosting/deploy, preview deployments per PR.

## Information Architecture

Current site is a single page with anchors (Home/About/Dishes/Contact/Location) plus a flipbook menu and near-duplicate per-city landing pages. New site becomes fully multi-page so each location and each topic can rank independently in Google:

```
/                              Home
/nuestra-historia              About — León origin story, Josper grill differentiator
/menu                          Real HTML menu, filterable by category + tags (vegetarian, seafood)
/ubicaciones                   Locations index
/ubicaciones/overland-park
/ubicaciones/lees-summit
/ubicaciones/johnson-city
/ubicaciones/ofallon           Coming soon + "notify me" form (fixes today's dead-end page)
/happy-hour                    Real content with hours/promos (fixes dead footer link)
/catering-eventos              New — catering/private events, not covered at all today
/contacto                      Contact form + map, separated from catering
/api/contact                   Route handler → Resend
/api/catering                  Route handler → Resend
/api/notify-ofallon            Route handler → Resend
```

Deferred (phase 2, not in this build): Gift Cards, Careers/Empleos, Blog/Promos.

## Data Layer

Hardcoded, typed data files under `/data`:

- `data/locations.ts` — one entry per city: slug, address, phone, hours, ChowNow order link, coming-soon flag, hero image slot, curated reviews, unique intro/closing copy (no shared paragraphs — this directly fixes the Lee's Summit/Overland Park duplicate-copy bug in the audit).
- `data/menu.ts` — full menu recreated as real structured data (category → items → name/description/price/tags), copy corrected per audit section 7.5/7.7 (no "marined", "wirth", "stuff", "cooed" typos).
- `data/reviews.ts` — curated real reviews per location (3-4 each), rotates instead of one fixed review.
- `data/site.ts` — global site content: taglines, hero headlines/subheadlines, About copy, SEO defaults — all pulled from audit section 7.

## Component System

- `Header` — nav + location switcher (replaces anchor-only nav).
- `Footer` — real links only (no dead "Happy Hour" link once that page exists).
- `Button` — one primary style (wine `#A73447`) for the single most important action ("Order Online"), one secondary/outline style (orange `#F49947`) for "View Menu"/"See Location". Lime green CTA removed per audit recommendation.
- `HeroSection`, `DishCard`, `MenuCategory`, `LocationCard`, `ReviewCard`, `ContactForm`/`CateringForm` (shared, parameterized), `PapelPicadoDivider` (SVG, brand motif reused from the menu's paper-cutout flower decoration instead of staying trapped inside a PDF).

## Visual System

Color tokens (Tailwind theme extend), each with a fixed role instead of today's three competing button colors:

| Token | Hex | Role |
|---|---|---|
| `wine` | `#A73447` | Primary CTA, nav accents |
| `orange` | `#F49947` | Secondary CTA, decorative accents |
| `teal` | `#6B9791` | Section background: story/ambience |
| `navy` | `#104767` | Section background: locations |
| `ink` | `#222222` | Body text |

Typography: Libre Baskerville for H1–H3, warm sans for body/UI. Mobile-first breakpoints validated at 375px/390px/414px before any layout is considered done — this is the audit's #1 critical bug (site currently breaks completely below desktop width).

## SEO

- Per-page `generateMetadata` (unique title/description per audit section 7.6 — every location page names its city, an address, and a signature dish; no more identical meta description across all pages).
- `LocalBusiness`/`Restaurant` JSON-LD per location page (address, phone, hours, geo).
- `sitemap.ts` and `robots.ts` (Next.js Metadata Route conventions).
- Open Graph + Twitter card tags, canonical URLs.
- Real semantic HTML menu (fixes: menu currently unindexable image flipbook).

## Forms

Each form (`contact`, `catering`, `notify-ofallon`) is a client component with Zod validation, submitting to its own Route Handler, which validates again server-side and sends via Resend to the restaurant's inbox. No third-party form SaaS, no client-side-only validation.

## Image Placeholder Strategy

All `next/image` slots use a neutral placeholder asset (`/public/placeholders/*`) sized to the real final aspect ratio, with real, descriptive `alt` text already written (good for SEO/accessibility from day one). Swapping in final photography later is a data/asset change only, never a layout change.

## Out of Scope (this phase)

- Live Google Places review integration.
- CMS/editorial workflow for non-developers.
- Gift cards, careers page, blog.
- Final photography selection/shoot (client-side task, tracked separately per audit section 8).
- Resolving the Overland Park Wed-hours inconsistency and O'Fallon opening status — needs client confirmation before shipping copy (audit section 8, step 1).
