# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Locals and visitors around the Kansas City metro, Lee's Summit and Johnson City, TN deciding where to eat or drink, mostly on a phone and often at night. Jobs: find the menu, hours and happy hour; order online or call; book events and catering.

## Product Purpose
Marketing and ordering-entry website for Don Chuy's Fresh Mex & Cantina. It gets a hungry visitor from search to a decision (view menu, order, call, visit a location) and supports local SEO per location. Success: more orders, calls and visits, plus event and catering inquiries.

## Positioning
Family recipes from León, Mexico, cooked on a Josper grill. A neighboring Mexican restaurant could not truthfully claim this lineage or the smoky Josper char.

## Operating Context
Multi-location restaurant group. Each location has its own page, phone, hours and ordering path. Ordering is by ChowNow link at Overland Park only; other locations order by phone (tel: link). Content lives in typed data files (`data/site.ts`, `data/locations.ts`, `data/menu.ts`, `data/happy-hour.ts`, `data/drinks.ts`, `data/featured-dishes.ts`). Copy follows the Website Rebuild Guide (`docs/DonChuys_Website_Rebuild_Guide.docx`).

## Capabilities and Constraints
- Locations: Overland Park, KS; Lee's Summit, MO; Johnson City, TN; O'Fallon, IL (coming soon, no phone yet).
- Pages: home, menu, happy hour, about, contact, per-location detail.
- Stack: Next.js (App Router, breaking-change version; read `node_modules/next/dist/docs/` before coding), React, TypeScript, Vitest.
- Tests guard script-word budget and one rose block per page; SEO and schema helpers in `lib/`.
- Taglines in use: "Fresh Mex. Real Flavor. Familia First."; "Grilled to Perfection, Served with Cariño."

## Brand Commitments
Name: Don Chuy's Fresh Mex & Cantina. Voice: warm, family-first, "Come as guests. Leave as family." Premium Mexican grill, tequila-forward. Existing visual commitments are recorded in `.impeccable.md` ("Salvia y noche") and have not been re-confirmed here.

## Evidence on Hand
Brand guide and design system under `docs/` (`don-chuys-brand-guide-v6`, `don-chuys-design-system`), hero loop video and poster in `public/`, featured dish photos, guest reviews in site data. Not on hand: awards, press, verified review counts. Do not fabricate them.

## Product Principles
1. Phone-first, night-time use: menu, hours, order and call are never more than a tap away.
2. Heritage is the proof: León recipes and the Josper grill are stated plainly, never embellished.
3. Each location is its own destination with accurate phone, hours and ordering path.
4. Only claim what is true: no invented reviews, awards or ordering links.
5. Warm and premium, not corporate and not kitsch.

## Accessibility & Inclusion
Target WCAG AA; Lighthouse accessibility currently 100 on audited pages. Touch targets at least 44px, reduced-motion safe, adequate contrast on sage and deep grounds.
