# Don Chuy's Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the new multi-page Next.js site for Don Chuy's Fresh Mex & Cantina, replacing the current broken one-page/flipbook-menu site, per `docs/plans/2026-09-15-don-chuys-website-design.md`.

**Architecture:** Next.js 15 App Router + TypeScript, Tailwind CSS v4 + shadcn/ui, hardcoded typed data files under `/data`, Zod-validated Route Handlers + Resend for form email delivery, Vitest + React Testing Library for tests, all images as placeholder assets with real alt text.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zod, Resend, Vitest, @testing-library/react.

---

## Source Data Reference

All copy/data below is transcribed from `Don_Chuys_Auditoria_Copy_Nuevo_Sitio.docx` sections 3–7. Fields marked `TODO` are gaps in the source audit (menu was an unreadable flipbook image, so most prices/descriptions were never captured) and must be confirmed with the client before launch — do not invent prices.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: whole project scaffold in repo root (already contains `.git`, `.gitignore`, `docs/`, the audit `.docx`)

**Step 1:** Run scaffold command:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```

When prompted about the non-empty directory, confirm to proceed (it only contains docs/.git/.gitignore/the audit docx, no conflicting files).

**Step 2:** Verify dev server boots:

```bash
npm run dev -- --port 3100 &
sleep 3
curl -sf http://localhost:3100 > /dev/null && echo OK
kill %1
```

Expected: `OK`.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript and Tailwind"
```

---

### Task 2: Testing setup (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add scripts + devDependencies)
- Test: `lib/sanity.test.ts`

**Step 1:** Install deps:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Step 2:** Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

**Step 3:** Create `vitest.setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

**Step 4:** Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 5: Write the failing sanity test** `lib/sanity.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

**Step 6:** Run: `npm test`
Expected: PASS (1 test). This confirms the harness works before it's load-bearing for real logic.

**Step 7: Commit**

```bash
git add -A
git commit -m "test: set up Vitest and React Testing Library"
```

---

### Task 3: Design tokens and fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1:** In `app/globals.css`, add brand tokens via Tailwind v4 `@theme` (below the existing `@import "tailwindcss";`):

```css
@theme {
  --color-wine: #a73447;
  --color-orange: #f49947;
  --color-teal: #6b9791;
  --color-navy: #104767;
  --color-ink: #222222;

  --font-heading: var(--font-libre-baskerville);
  --font-body: var(--font-work-sans);
}
```

This makes `bg-wine`, `text-navy`, `font-heading`, etc. available as Tailwind utilities.

**Step 2:** In `app/layout.tsx`, load fonts and expose them as CSS variables:

```typescript
import { Libre_Baskerville, Work_Sans } from "next/font/google";

const headingFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

const bodyFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});
```

Apply `${headingFont.variable} ${bodyFont.variable}` as classes on `<html>` or `<body>`, and set `font-body` as the default body class. Full layout wiring happens in Task 14 — this task only adds the font loading and CSS tokens.

**Step 3:** Verify build: `npm run build`. Expected: builds without errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add brand color tokens and Libre Baskerville/Work Sans fonts"
```

---

### Task 4: shadcn/ui base components

**Files:**
- Create: `components.json` (via CLI)
- Create: `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/label.tsx`, `components/ui/select.tsx` (via CLI)
- Create: `lib/utils.ts` (via CLI, `cn` helper)

**Step 1:** Init shadcn:

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input textarea label select
```

**Step 2:** Override the `button` variant colors to use brand tokens instead of shadcn defaults. Edit `components/ui/button.tsx` `buttonVariants`:

```typescript
variant: {
  default: "bg-wine text-white hover:bg-wine/90",
  secondary: "border-2 border-orange text-orange bg-transparent hover:bg-orange/10",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-wine underline-offset-4 hover:underline",
},
```

Keep other variants/sizes as generated.

**Step 3:** Verify build: `npm run build`. Expected: no errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui base components with brand button variants"
```

---

### Task 5: Zod schemas

**Files:**
- Create: `lib/schemas.ts`
- Test: `lib/schemas.test.ts`

**Step 1: Write the failing test** `lib/schemas.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { locationSchema, menuItemSchema, inquirySchema } from "./schemas";

describe("locationSchema", () => {
  it("accepts a valid open location", () => {
    const result = locationSchema.safeParse({
      slug: "overland-park",
      name: "Overland Park, KS",
      address: "8725 Metcalf Ave, Overland Park, KS 66212",
      phone: "+1 816-603-2124",
      hours: [{ days: "Mon-Thu", time: "11:00 AM - 10:00 PM" }],
      orderUrl: "https://order.chownow.com/order/0000/locations",
      comingSoon: false,
      reviews: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a location missing an address when not coming soon", () => {
    const result = locationSchema.safeParse({
      slug: "bad",
      name: "Bad",
      address: "",
      phone: "",
      hours: [],
      orderUrl: "",
      comingSoon: false,
      reviews: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("menuItemSchema", () => {
  it("accepts a valid item", () => {
    const result = menuItemSchema.safeParse({
      name: "Steak & Lobster",
      description: "A 12 oz. ribeye grilled to order, paired with 6 oz. of butter-garlic lobster.",
      price: null,
      tags: [],
      needsCopyReview: false,
    });
    expect(result.success).toBe(true);
  });
});

describe("inquirySchema", () => {
  it("rejects an invalid email", () => {
    const result = inquirySchema.safeParse({
      type: "contact",
      firstName: "Ana",
      lastName: "Lopez",
      email: "not-an-email",
      message: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid contact inquiry", () => {
    const result = inquirySchema.safeParse({
      type: "contact",
      firstName: "Ana",
      lastName: "Lopez",
      email: "ana@example.com",
      message: "Hola, quisiera reservar para 8 personas.",
    });
    expect(result.success).toBe(true);
  });
});
```

**Step 2:** Run: `npm test -- lib/schemas.test.ts`
Expected: FAIL (`./schemas` does not exist).

**Step 3: Implement** `lib/schemas.ts`:

```typescript
import { z } from "zod";

export const reviewSchema = z.object({
  author: z.string().min(1),
  quote: z.string().min(1),
  date: z.string().optional(),
});

export const locationSchema = z
  .object({
    slug: z.string().min(1),
    name: z.string().min(1),
    address: z.string(),
    phone: z.string(),
    hours: z.array(z.object({ days: z.string(), time: z.string() })),
    orderUrl: z.string(),
    comingSoon: z.boolean(),
    reviews: z.array(reviewSchema),
    intro: z.string().optional(),
    closing: z.string().optional(),
  })
  .refine((loc) => loc.comingSoon || loc.address.length > 0, {
    message: "Open locations must have an address",
    path: ["address"],
  });

export const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive().nullable(),
  tags: z.array(z.enum(["vegetarian", "seafood", "spicy", "kids"])),
  needsCopyReview: z.boolean(),
});

export const menuCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  items: z.array(menuItemSchema).min(1),
});

export const inquiryTypeSchema = z.enum(["contact", "catering", "notify-ofallon"]);

export const inquirySchema = z.object({
  type: inquiryTypeSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  eventDate: z.string().optional(),
  guestCount: z.coerce.number().int().positive().optional(),
});

export type Location = z.infer<typeof locationSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryType = z.infer<typeof inquiryTypeSchema>;
```

**Step 4:** Run: `npm test -- lib/schemas.test.ts`
Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Zod schemas for locations, menu items, and inquiries"
```

---

### Task 6: Location data

**Files:**
- Create: `data/locations.ts`
- Test: `data/locations.test.ts`

**Step 1: Write the failing test** `data/locations.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { locations } from "./locations";
import { locationSchema } from "@/lib/schemas";

describe("locations data", () => {
  it("every location is valid per the schema", () => {
    for (const location of locations) {
      const result = locationSchema.safeParse(location);
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    }
  });

  it("has exactly one entry per known slug", () => {
    const slugs = locations.map((l) => l.slug).sort();
    expect(slugs).toEqual(["johnson-city", "lees-summit", "ofallon", "overland-park"]);
  });

  it("no two open locations share the same intro copy", () => {
    const openIntros = locations.filter((l) => !l.comingSoon).map((l) => l.intro);
    expect(new Set(openIntros).size).toBe(openIntros.length);
  });
});
```

**Step 2:** Run: `npm test -- data/locations.test.ts`
Expected: FAIL (`./locations` does not exist).

**Step 3: Implement** `data/locations.ts`:

```typescript
import type { Location } from "@/lib/schemas";

export const locations: Location[] = [
  {
    slug: "overland-park",
    name: "Overland Park, KS",
    address: "8725 Metcalf Ave, Overland Park, KS 66212",
    phone: "+1 816-603-2124",
    // Source audit lists Wed hours inconsistent with the Mon-Thu range —
    // confirm real hours with client before launch (design doc, Out of Scope).
    hours: [
      { days: "Mon-Tue, Thu", time: "11:00 AM - 10:00 PM" },
      { days: "Wed", time: "10:00 AM - 10:30 PM" },
      { days: "Fri-Sun", time: "11:00 AM - 10:30 PM" },
    ],
    orderUrl: "https://order.chownow.com/order/TODO-OVERLAND-PARK/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Alex Iglesias",
        quote:
          "Don Chuy's in Overland Park is an absolute gem! ... And the food? So tasty and on point..!",
      },
    ],
    intro:
      "Step into our Overland Park location and experience the perfect mix of authentic Mexican recipes and fresh, modern flavors.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Overland Park location.",
  },
  {
    slug: "lees-summit",
    name: "Lee's Summit, MO",
    address: "701 SE Melody Ln, Lee's Summit, MO 64063",
    phone: "+1 816-434-5222",
    hours: [{ days: "Every day", time: "11:00 AM - 10:00 PM" }],
    orderUrl: "https://order.chownow.com/order/TODO-LEES-SUMMIT/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Joseph Herbaug",
        quote:
          "This place blew me away. ... I've reviewed molcajete at other restaurants and this one has been my favorite so far.",
      },
    ],
    intro:
      "Our Lee's Summit spot brings the same bold, charcoal-grilled flavor with a cozy neighborhood feel all its own.",
    closing: "Come hungry. Leave happy. We'll save you a seat at our Lee's Summit location.",
  },
  {
    slug: "johnson-city",
    name: "Johnson City, TN",
    address: "3101 W Market St #101, Johnson City, TN 37604",
    phone: "+1 423-328-3475",
    hours: [
      { days: "Mon-Thu", time: "11:00 AM - 10:00 PM" },
      { days: "Fri-Sat", time: "11:00 AM - 10:30 PM" },
      { days: "Sun", time: "11:00 AM - 9:30 PM" },
    ],
    orderUrl: "https://order.chownow.com/order/TODO-JOHNSON-CITY/locations",
    comingSoon: false,
    reviews: [
      {
        author: "Makayla Parker",
        quote:
          "This place has quickly become mine and my husbands favorite place. ... Always amazed to see this place not have many customers, they deserve more!",
      },
    ],
    intro:
      "Discover our Johnson City location, where authentic Mexican recipes meet fresh, modern flavors under that colorful mural you won't stop looking at.",
    closing: "Come hungry. Leave happy. We'll be ready when you are.",
  },
  {
    slug: "ofallon",
    name: "O'Fallon, IL",
    address: "",
    phone: "",
    hours: [],
    orderUrl: "",
    comingSoon: true,
    reviews: [],
  },
];
```

**Step 4:** Run: `npm test -- data/locations.test.ts`
Expected: PASS (3 tests).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add real per-location data with unique copy per city"
```

---

### Task 7: Menu data

**Files:**
- Create: `data/menu.ts`
- Test: `data/menu.test.ts`

**Step 1: Write the failing test** `data/menu.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { menu } from "./menu";
import { menuCategorySchema } from "@/lib/schemas";

describe("menu data", () => {
  it("every category is valid per the schema", () => {
    for (const category of menu) {
      const result = menuCategorySchema.safeParse(category);
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    }
  });

  it("has no duplicate category slugs", () => {
    const slugs = menu.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("flags items still needing copy review instead of shipping fabricated prices", () => {
    const allItems = menu.flatMap((c) => c.items);
    const unreviewed = allItems.filter((i) => i.needsCopyReview);
    expect(unreviewed.every((i) => i.price === null)).toBe(true);
  });
});
```

**Step 2:** Run: `npm test -- data/menu.test.ts`
Expected: FAIL (`./menu` does not exist).

**Step 3: Implement** `data/menu.ts`. Seed every category from audit section 3.7 with `needsCopyReview: true, price: null` placeholders, except the four items with corrected copy from audit section 7.5 (real, polished copy — still `price: null` since no price was ever legible on the source flipbook):

```typescript
import type { MenuCategory } from "@/lib/schemas";

const reviewedItem = (name: string, description: string) => ({
  name,
  description,
  price: null,
  tags: [] as MenuCategory["items"][number]["tags"],
  needsCopyReview: false,
});

const pendingItem = (name: string) => ({
  name,
  description: "TODO: write final copy and confirm price with client.",
  price: null,
  tags: [] as MenuCategory["items"][number]["tags"],
  needsCopyReview: true,
});

export const menu: MenuCategory[] = [
  {
    slug: "botanas",
    name: "Botanas / Dips",
    items: [
      pendingItem("Don Chuy's Dip"),
      pendingItem("Cheese Dip"),
      pendingItem("Queso Fundido"),
      pendingItem("Guacamole"),
      pendingItem("Spinach Crab Dip"),
      pendingItem("Calamari"),
      pendingItem("Coconut Shrimp"),
      pendingItem("Empanadas"),
      pendingItem("Oysters Rockefeller"),
    ],
  },
  { slug: "nachos-wings", name: "Nachos / Wings and Fries", items: [pendingItem("Nachos"), pendingItem("Wings and Fries")] },
  {
    slug: "sopas-ensaladas",
    name: "Sopas y Ensaladas",
    items: [
      pendingItem("Chicken Tortilla Soup"),
      pendingItem("7 Mares"),
      pendingItem("Menudo"),
      pendingItem("Caldo de Camarón"),
      pendingItem("Del Sur Salad"),
      pendingItem("Cali Salad"),
      pendingItem("Taco Salad"),
    ],
  },
  { slug: "a-la-carta", name: "A La Carta", items: [pendingItem("Tamales"), pendingItem("Chile Relleno"), pendingItem("Quesadillas Individuales")] },
  { slug: "the-grill", name: "The Grill / Build Your Own / Combinations / Vegetarian", items: [pendingItem("Build Your Own"), pendingItem("Combinations"), pendingItem("Vegetarian Dishes")] },
  {
    slug: "pollo",
    name: "Pollo",
    items: [pendingItem("Choripollo"), pendingItem("Pollo Chipotlecream"), pendingItem("Mole de Pollo"), pendingItem("Famous ACP's (Arroz, Cheese, Protein)")],
  },
  {
    slug: "steak-house",
    name: "Don Chuy's Steak House",
    items: [
      reviewedItem("Steak & Lobster", "A 12 oz. ribeye grilled to order, paired with 6 oz. of butter-garlic lobster."),
      pendingItem("Ribeye"),
      pendingItem("Cowboy Steak"),
      pendingItem("Steak Vallarta"),
      pendingItem("Tomahawk"),
      pendingItem("Steak Tulum"),
    ],
  },
  { slug: "burgers", name: "Burgers", items: [pendingItem("Classic"), pendingItem("Diablo"), pendingItem("Revolution"), pendingItem("Country Burger")] },
  {
    slug: "tacos",
    name: "Tacos",
    items: [
      pendingItem("Los Pinchis Tacos (Street Tacos)"),
      pendingItem("Tacos Ribeye"),
      pendingItem("Tacos Gobernador"),
      pendingItem("Tacos Regios al Carbón"),
      pendingItem("Tacos Los Cabos"),
    ],
  },
  { slug: "tortas-fajitas", name: "Tortas / Fajitas", items: [pendingItem("Tortas"), pendingItem("Fajitas")] },
  {
    slug: "burritos-enchiladas",
    name: "Burritos y Enchiladas",
    items: [
      pendingItem("Burrito Sinaloa"),
      pendingItem("Burrito California"),
      pendingItem("Burrito King"),
      pendingItem("Burrito Michoacano"),
      pendingItem("Enchiladas Poblanas"),
      pendingItem("Enchiladas Verdes"),
      pendingItem("Enchiladas de Camarón"),
      pendingItem("Enchiladas Seafood"),
    ],
  },
  {
    slug: "cevicheria",
    name: "La Cevichería",
    items: [
      pendingItem("Aguachiles"),
      pendingItem("Cocteles"),
      pendingItem("Molcajete del Mar"),
      pendingItem("Seafood Tower"),
      { ...reviewedItem("La Costa Bowl", "Boiled seafood, crab legs, shrimp, crawfish, potatoes, and corn."), tags: ["seafood"] },
      { ...reviewedItem("Pulpo Zarandeado", "Charcoal-grilled octopus marinated in our traditional zarandeado sauce, served with white rice and salad."), tags: ["seafood"] },
    ],
  },
  {
    slug: "pescados-ostras",
    name: "Pescados y Ostras",
    items: [
      pendingItem("Zarandeado"),
      { ...reviewedItem("Salmón Mango", "8 oz. salmon grilled over charcoal and glazed in our house mango sauce, served over spinach, avocado, and mango pico with rice."), tags: ["seafood"] },
      pendingItem("Mahi Mahi"),
      pendingItem("Oysters"),
    ],
  },
  {
    slug: "quesadillas-mas",
    name: "Quesadillas, Chimichangas, Sides",
    items: [pendingItem("Quesadillas"), pendingItem("Chimichangas"), pendingItem("Sides"), pendingItem("Baked Potato Tijuana Style")],
  },
  { slug: "drinks", name: "Drinks", items: [pendingItem("Refrescos")] },
  {
    slug: "desserts",
    name: "Desserts",
    items: [pendingItem("Flan"), pendingItem("Churros"), pendingItem("Tres Leches"), pendingItem("Chocolava Cake")],
  },
  {
    slug: "especiales",
    name: "Platos a la Carta",
    items: [pendingItem("Chiles Rellenos"), pendingItem("Carne Asada"), pendingItem("Arrachera"), pendingItem("Molcajete"), pendingItem("Parrillada")],
  },
  { slug: "kids", name: "Kids Menu", items: [pendingItem("Kids Menu")], },
  { slug: "lunch-specials", name: "Lunch Specials", items: [pendingItem("Lunch Specials")] },
  { slug: "brunch", name: "Eggs / Huevos / Brunch", items: [pendingItem("Build Your Own Brunch"), pendingItem("Breakfast Burrito"), pendingItem("Chilaquiles Supreme")] },
  {
    slug: "tostadas",
    name: "Tostadas",
    items: [
      {
        ...reviewedItem("Tostada de Ceviche", "Our signature tostada, piled high with octopus, shrimp, or a mix of both — for the truly hungry."),
        tags: ["seafood"],
      },
    ],
  },
];
```

**Step 4:** Run: `npm test -- data/menu.test.ts`
Expected: PASS (3 tests).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add structured menu data replacing the flipbook-image menu"
```

---

### Task 8: Site copy data

**Files:**
- Create: `data/site.ts`
- Test: `data/site.test.ts`

**Step 1: Write the failing test** `data/site.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { siteContent } from "./site";

describe("site content", () => {
  it("has a hero headline and subheadline", () => {
    expect(siteContent.hero.headline.length).toBeGreaterThan(0);
    expect(siteContent.hero.subheadline.length).toBeGreaterThan(0);
  });

  it("has about copy and a tagline list", () => {
    expect(siteContent.about.body.length).toBeGreaterThan(0);
    expect(siteContent.taglines.length).toBeGreaterThan(0);
  });
});
```

**Step 2:** Run: `npm test -- data/site.test.ts` — Expected: FAIL.

**Step 3: Implement** `data/site.ts` (copy from audit section 7):

```typescript
export const siteContent = {
  hero: {
    headline: "Real Mexican Flavor, Fresh Off the Grill",
    subheadline:
      "Family recipes from León, Mexico. Smoky Josper-grilled favorites. A warm welcome every time you walk in.",
    primaryCta: "Order Online",
    secondaryCta: "View Menu",
  },
  about: {
    body:
      "It started in León, Mexico, with recipes passed down through our family — the same way for generations. Today, Don Chuy's brings that tradition to Kansas City, Lee's Summit, and Johnson City, with fresh ingredients, bold flavors, and the smoky char of our Josper grill in every dish. Come as guests. Leave as family.",
  },
  taglines: [
    "Fresh Mex. Real Flavor. Familia First.",
    "Grilled to Perfection, Served with Cariño.",
    "Three (soon four) locations. One unforgettable experience.",
  ],
  seoDefaults: {
    titleTemplate: "%s | Don Chuy's Fresh Mex & Cantina",
    homeTitle: "Don Chuy's Fresh Mex & Cantina | Authentic Mexican Restaurant in Kansas City & Beyond",
    homeDescription:
      "Family-owned Mexican restaurant serving Josper-grilled, authentic dishes in Overland Park KS, Lee's Summit MO, and Johnson City TN.",
  },
} as const;
```

**Step 4:** Run test — Expected: PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add site-wide copy content from brand audit"
```

---

### Task 9: Menu filter logic

**Files:**
- Create: `lib/menu-filters.ts`
- Test: `lib/menu-filters.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { filterMenu } from "./menu-filters";
import { menu } from "@/data/menu";

describe("filterMenu", () => {
  it("returns all categories when no filters are applied", () => {
    expect(filterMenu(menu, { tag: null, query: "" })).toEqual(menu);
  });

  it("filters items by tag and drops empty categories", () => {
    const result = filterMenu(menu, { tag: "seafood", query: "" });
    for (const category of result) {
      expect(category.items.length).toBeGreaterThan(0);
      for (const item of category.items) {
        expect(item.tags).toContain("seafood");
      }
    }
  });

  it("filters items by case-insensitive name search", () => {
    const result = filterMenu(menu, { tag: null, query: "pulpo" });
    const names = result.flatMap((c) => c.items.map((i) => i.name.toLowerCase()));
    expect(names.every((n) => n.includes("pulpo"))).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });
});
```

**Step 2:** Run: `npm test -- lib/menu-filters.test.ts` — Expected: FAIL.

**Step 3: Implement** `lib/menu-filters.ts`:

```typescript
import type { MenuCategory, MenuItem } from "@/lib/schemas";

type MenuFilters = {
  tag: MenuItem["tags"][number] | null;
  query: string;
};

export function filterMenu(categories: MenuCategory[], filters: MenuFilters): MenuCategory[] {
  const query = filters.query.trim().toLowerCase();

  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesTag = !filters.tag || item.tags.includes(filters.tag);
        const matchesQuery = !query || item.name.toLowerCase().includes(query);
        return matchesTag && matchesQuery;
      }),
    }))
    .filter((category) => category.items.length > 0);
}
```

**Step 4:** Run test — Expected: PASS (3 tests).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add menu filtering by tag and search query"
```

---

### Task 10: SEO helpers (metadata + JSON-LD)

**Files:**
- Create: `lib/seo.ts`
- Test: `lib/seo.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { buildLocationJsonLd } from "./seo";
import { locations } from "@/data/locations";

describe("buildLocationJsonLd", () => {
  it("builds a Restaurant schema with address and phone for an open location", () => {
    const overlandPark = locations.find((l) => l.slug === "overland-park")!;
    const jsonLd = buildLocationJsonLd(overlandPark);

    expect(jsonLd["@type"]).toBe("Restaurant");
    expect(jsonLd.name).toContain("Don Chuy's");
    expect(jsonLd.address.streetAddress).toBeDefined();
    expect(jsonLd.telephone).toBe(overlandPark.phone);
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `lib/seo.ts`:

```typescript
import type { Location } from "@/lib/schemas";

export function buildLocationJsonLd(location: Location) {
  const [streetAddress, ...rest] = location.address.split(",");

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Don Chuy's Fresh Mex & Cantina - ${location.name}`,
    telephone: location.phone,
    servesCuisine: "Mexican",
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress?.trim() ?? "",
      addressLocality: rest.join(",").trim(),
    },
    openingHoursSpecification: location.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.time.split(" - ")[0],
      closes: h.time.split(" - ")[1],
    })),
  };
}

export function locationMetaTitle(location: Location) {
  return `Mexican Restaurant in ${location.name} | Don Chuy's Fresh Mex & Cantina`;
}

export function locationMetaDescription(location: Location, signatureDish: string) {
  return `Visit Don Chuy's in ${location.name} for authentic, Josper-grilled Mexican food. Try our ${signatureDish} and order online for pickup.`;
}
```

**Step 4:** Run test — Expected: PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SEO metadata and JSON-LD helpers for location pages"
```

---

### Task 11: Placeholder image assets

**Files:**
- Create: `public/placeholders/hero.svg`, `public/placeholders/dish.svg`, `public/placeholders/location.svg`, `public/placeholders/portrait.svg`
- Create: `components/placeholder-image.tsx`
- Test: `components/placeholder-image.test.tsx`

**Step 1:** Create a simple neutral gray placeholder SVG, reused at different aspect ratios via the wrapper component. `public/placeholders/dish.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#e5e1dc"/>
  <text x="400" y="300" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#a3998c">Image coming soon</text>
</svg>
```

Repeat the same pattern for `hero.svg` (1600x900), `location.svg` (1200x800), `portrait.svg` (600x800) — same fill/text, different `width`/`height`/`viewBox`.

**Step 2: Write the failing test** `components/placeholder-image.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlaceholderImage } from "./placeholder-image";

describe("PlaceholderImage", () => {
  it("renders with the given alt text", () => {
    render(<PlaceholderImage variant="dish" alt="Steak & Lobster at Don Chuy's" width={400} height={300} />);
    expect(screen.getByAltText("Steak & Lobster at Don Chuy's")).toBeInTheDocument();
  });
});
```

**Step 3:** Run — Expected: FAIL.

**Step 4: Implement** `components/placeholder-image.tsx`:

```typescript
import Image from "next/image";

const VARIANT_SRC = {
  hero: "/placeholders/hero.svg",
  dish: "/placeholders/dish.svg",
  location: "/placeholders/location.svg",
  portrait: "/placeholders/portrait.svg",
} as const;

type PlaceholderImageProps = {
  variant: keyof typeof VARIANT_SRC;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function PlaceholderImage({ variant, alt, width, height, className }: PlaceholderImageProps) {
  return (
    <Image
      src={VARIANT_SRC[variant]}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
```

**Step 5:** Run test — Expected: PASS.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add placeholder image assets and wrapper component"
```

---

### Task 12: PapelPicadoDivider component

**Files:**
- Create: `components/papel-picado-divider.tsx`
- Test: `components/papel-picado-divider.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PapelPicadoDivider } from "./papel-picado-divider";

describe("PapelPicadoDivider", () => {
  it("renders as a decorative, non-announced element", () => {
    const { container } = render(<PapelPicadoDivider />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `components/papel-picado-divider.tsx` (simple repeating scalloped/flower motif, brand colors, purely decorative):

```typescript
export function PapelPicadoDivider() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className="h-5 w-full text-orange"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={i * 20 + 10} cy="10" r="6" fill="currentColor" opacity="0.6" />
      ))}
    </svg>
  );
}
```

**Step 4:** Run test — Expected: PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add papel picado decorative divider component"
```

---

### Task 13: Header and Footer

**Files:**
- Create: `components/header.tsx`
- Create: `components/footer.tsx`
- Test: `components/header.test.tsx`
- Test: `components/footer.test.tsx`

**Step 1: Write the failing tests**

`components/header.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";

describe("Header", () => {
  it("links to every top-level page", () => {
    render(<Header />);
    for (const label of ["Menu", "Locations", "Our Story", "Catering", "Contact"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
```

`components/footer.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("does not contain a dead Happy Hour link pointing at home", () => {
    render(<Footer />);
    const happyHour = screen.getByRole("link", { name: "Happy Hour" });
    expect(happyHour).toHaveAttribute("href", "/happy-hour");
  });
});
```

**Step 2:** Run both — Expected: FAIL.

**Step 3: Implement** `components/header.tsx`:

```typescript
import Link from "next/link";
import { locations } from "@/data/locations";

const NAV_LINKS = [
  { href: "/nuestra-historia", label: "Our Story" },
  { href: "/menu", label: "Menu" },
  { href: "/ubicaciones", label: "Locations" },
  { href: "/catering-eventos", label: "Catering" },
  { href: "/contacto", label: "Contact" },
];

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-heading text-xl text-wine">
        Don Chuy's
      </Link>
      <nav className="flex gap-6">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="font-body text-sm">
            {link.label}
          </Link>
        ))}
      </nav>
      <select aria-label="Choose your location" className="rounded border px-2 py-1 text-sm">
        {locations
          .filter((l) => !l.comingSoon)
          .map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name}
            </option>
          ))}
      </select>
    </header>
  );
}
```

**Step 4:** Implement `components/footer.tsx`:

```typescript
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Start" },
  { href: "/nuestra-historia", label: "About" },
  { href: "/menu", label: "Dishes" },
  { href: "/happy-hour", label: "Happy Hour" },
  { href: "/contacto", label: "Contact" },
  { href: "/ubicaciones", label: "Location" },
];

export function Footer() {
  return (
    <footer className="bg-ink px-6 py-10 text-white">
      <nav className="flex flex-wrap gap-4">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
```

**Step 5:** Run both tests — Expected: PASS.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Header with location switcher and Footer with real links"
```

---

### Task 14: Root layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1:** Wire fonts (from Task 3), `Header`, `Footer`, and default metadata:

```typescript
import type { Metadata } from "next";
import { Libre_Baskerville, Work_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { siteContent } from "@/data/site";
import "./globals.css";

const headingFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

const bodyFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteContent.seoDefaults.homeTitle,
    template: siteContent.seoDefaults.titleTemplate,
  },
  description: siteContent.seoDefaults.homeDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body text-ink">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 2:** Run: `npm run build` — Expected: succeeds.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire fonts, header, and footer into root layout"
```

---

### Task 15: DishCard, ReviewCard, LocationCard

**Files:**
- Create: `components/dish-card.tsx`, `components/review-card.tsx`, `components/location-card.tsx`
- Test: `components/dish-card.test.tsx`, `components/review-card.test.tsx`, `components/location-card.test.tsx`

**Step 1: Write the failing tests**

`components/dish-card.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DishCard } from "./dish-card";

describe("DishCard", () => {
  it("renders the dish name and description, and flags unreviewed copy", () => {
    render(
      <DishCard
        item={{ name: "Steak & Lobster", description: "A 12 oz. ribeye...", price: null, tags: [], needsCopyReview: false }}
      />
    );
    expect(screen.getByText("Steak & Lobster")).toBeInTheDocument();
    expect(screen.queryByText(/needs copy review/i)).not.toBeInTheDocument();
  });

  it("shows an internal review flag when needsCopyReview is true", () => {
    render(
      <DishCard item={{ name: "Nachos", description: "TODO", price: null, tags: [], needsCopyReview: true }} />
    );
    expect(screen.getByText(/needs copy review/i)).toBeInTheDocument();
  });
});
```

`components/review-card.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewCard } from "./review-card";

describe("ReviewCard", () => {
  it("renders quote and author", () => {
    render(<ReviewCard review={{ author: "Alex Iglesias", quote: "Absolute gem!" }} />);
    expect(screen.getByText(/Absolute gem!/)).toBeInTheDocument();
    expect(screen.getByText("Alex Iglesias")).toBeInTheDocument();
  });
});
```

`components/location-card.test.tsx`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocationCard } from "./location-card";
import { locations } from "@/data/locations";

describe("LocationCard", () => {
  it("links to the location's own page", () => {
    const overlandPark = locations.find((l) => l.slug === "overland-park")!;
    render(<LocationCard location={overlandPark} />);
    expect(screen.getByRole("link", { name: /overland park/i })).toHaveAttribute(
      "href",
      "/ubicaciones/overland-park"
    );
  });

  it("shows a coming soon state without an order button", () => {
    const ofallon = locations.find((l) => l.slug === "ofallon")!;
    render(<LocationCard location={ofallon} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /order online/i })).not.toBeInTheDocument();
  });
});
```

**Step 2:** Run all three — Expected: FAIL.

**Step 3: Implement** `components/dish-card.tsx`:

```typescript
import type { MenuItem } from "@/lib/schemas";
import { PlaceholderImage } from "./placeholder-image";

export function DishCard({ item }: { item: MenuItem }) {
  return (
    <article className="rounded-lg border p-4">
      <PlaceholderImage variant="dish" alt={item.name} width={400} height={300} />
      <h3 className="font-heading text-lg">{item.name}</h3>
      <p className="text-sm">{item.description}</p>
      {item.needsCopyReview && (
        <p className="text-xs italic text-orange">Needs copy review before launch</p>
      )}
    </article>
  );
}
```

`components/review-card.tsx`:

```typescript
import type { z } from "zod";
import type { reviewSchema } from "@/lib/schemas";

export function ReviewCard({ review }: { review: z.infer<typeof reviewSchema> }) {
  return (
    <blockquote className="rounded-lg bg-teal/10 p-4">
      <p className="italic">"{review.quote}"</p>
      <cite className="mt-2 block font-heading not-italic">{review.author}</cite>
    </blockquote>
  );
}
```

`components/location-card.tsx`:

```typescript
import Link from "next/link";
import type { Location } from "@/lib/schemas";
import { PlaceholderImage } from "./placeholder-image";
import { Button } from "./ui/button";

export function LocationCard({ location }: { location: Location }) {
  return (
    <article className="rounded-lg border p-4">
      <PlaceholderImage variant="location" alt={`Don Chuy's ${location.name} storefront`} width={600} height={400} />
      <h3 className="font-heading text-lg">
        <Link href={`/ubicaciones/${location.slug}`}>{location.name}</Link>
      </h3>
      {location.comingSoon ? (
        <p className="text-sm text-navy">Coming soon</p>
      ) : (
        <>
          <p className="text-sm">{location.address}</p>
          <Button asChild variant="default">
            <a href={location.orderUrl}>Order Online</a>
          </Button>
        </>
      )}
    </article>
  );
}
```

**Step 4:** Run all three tests — Expected: PASS.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add DishCard, ReviewCard, and LocationCard components"
```

---

### Task 16: InquiryForm generic component

**Files:**
- Create: `components/inquiry-form.tsx`
- Test: `components/inquiry-form.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InquiryForm } from "./inquiry-form";

describe("InquiryForm", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shows a validation error when submitting an empty required field", async () => {
    render(<InquiryForm type="contact" />);
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  });

  it("submits valid data to the matching API route and shows a success message", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<InquiryForm type="contact" />);
    await userEvent.type(screen.getByLabelText(/first name/i), "Ana");
    await userEvent.type(screen.getByLabelText(/last name/i), "Lopez");
    await userEvent.type(screen.getByLabelText(/email/i), "ana@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "Hola, quisiera reservar.");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.any(Object)));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `components/inquiry-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type Inquiry, type InquiryType } from "@/lib/schemas";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

const ENDPOINT: Record<InquiryType, string> = {
  contact: "/api/contact",
  catering: "/api/catering",
  "notify-ofallon": "/api/notify-ofallon",
};

export function InquiryForm({ type }: { type: InquiryType }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { type },
  });

  const onSubmit = async (data: Inquiry) => {
    const response = await fetch(ENDPOINT[type], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "success" : "error");
  };

  if (status === "success") {
    return <p role="status">Thanks — we'll be in touch soon!</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("type")} value={type} />
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" {...register("firstName")} />
        {errors.firstName && <p className="text-sm text-wine">{errors.firstName.message}</p>}
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" {...register("lastName")} />
        {errors.lastName && <p className="text-sm text-wine">{errors.lastName.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-wine">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} />
        {errors.message && <p className="text-sm text-wine">{errors.message.message}</p>}
      </div>
      {status === "error" && <p className="text-sm text-wine">Something went wrong. Please try again.</p>}
      <Button type="submit" disabled={isSubmitting}>
        Send
      </Button>
    </form>
  );
}
```

**Step 4:** Install form deps: `npm install react-hook-form @hookform/resolvers`

**Step 5:** Run test — Expected: PASS.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add generic InquiryForm for contact, catering, and O'Fallon notify"
```

---

### Task 17: Shared inquiry email handler

**Files:**
- Create: `lib/create-inquiry-handler.ts`
- Test: `lib/create-inquiry-handler.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { createInquiryHandler } from "./create-inquiry-handler";

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: vi.fn().mockResolvedValue({ id: "test" }) },
    })),
  };
});

describe("createInquiryHandler", () => {
  it("returns 400 for invalid payloads", async () => {
    const handler = createInquiryHandler("contact");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ type: "contact" }),
    });
    const response = await handler(request);
    expect(response.status).toBe(400);
  });

  it("returns 200 and sends an email for a valid payload", async () => {
    const handler = createInquiryHandler("contact");
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        type: "contact",
        firstName: "Ana",
        lastName: "Lopez",
        email: "ana@example.com",
        message: "Hola",
      }),
    });
    const response = await handler(request);
    expect(response.status).toBe(200);
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3:** Install: `npm install resend`

**Step 4: Implement** `lib/create-inquiry-handler.ts`:

```typescript
import { Resend } from "resend";
import { inquirySchema, type InquiryType } from "@/lib/schemas";

export function createInquiryHandler(type: InquiryType) {
  return async function handler(request: Request): Promise<Response> {
    const body = await request.json();
    const result = inquirySchema.safeParse({ ...body, type });

    if (!result.success) {
      return Response.json({ success: false, errors: result.error.flatten() }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Don Chuy's Website <noreply@don-chuys.com>",
      to: process.env.RESTAURANT_INBOX_EMAIL ?? "orders@don-chuys.com",
      subject: `New ${type} inquiry from ${result.data.firstName} ${result.data.lastName}`,
      text: JSON.stringify(result.data, null, 2),
    });

    return Response.json({ success: true }, { status: 200 });
  };
}
```

**Step 5:** Run test — Expected: PASS.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add shared Resend-backed inquiry handler with Zod validation"
```

---

### Task 18: API routes

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `app/api/catering/route.ts`
- Create: `app/api/notify-ofallon/route.ts`

**Step 1:** Each route is a two-line wrapper, e.g. `app/api/contact/route.ts`:

```typescript
import { createInquiryHandler } from "@/lib/create-inquiry-handler";

export const POST = createInquiryHandler("contact");
```

Repeat for `app/api/catering/route.ts` with `"catering"` and `app/api/notify-ofallon/route.ts` with `"notify-ofallon"`.

**Step 2:** Verify build: `npm run build` — Expected: succeeds, three routes listed in output.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add contact, catering, and O'Fallon notify API routes"
```

---

### Task 19: Home page

**Files:**
- Modify: `app/page.tsx`

**Step 1:** Implement using `siteContent`, `menu` (top picks), `locations`:

```typescript
import Link from "next/link";
import { siteContent } from "@/data/site";
import { menu } from "@/data/menu";
import { locations } from "@/data/locations";
import { DishCard } from "@/components/dish-card";
import { LocationCard } from "@/components/location-card";
import { PlaceholderImage } from "@/components/placeholder-image";
import { PapelPicadoDivider } from "@/components/papel-picado-divider";
import { Button } from "@/components/ui/button";

const featuredDishNames = ["Steak & Lobster", "Pulpo Zarandeado", "Salmón Mango", "Tostada de Ceviche"];
const featuredDishes = menu
  .flatMap((c) => c.items)
  .filter((item) => featuredDishNames.includes(item.name));

export default function HomePage() {
  return (
    <>
      <section className="px-6 py-16 text-center">
        <PlaceholderImage variant="hero" alt="Josper grill fire-roasting a steak at Don Chuy's" width={1600} height={900} />
        <h1 className="font-heading text-4xl">{siteContent.hero.headline}</h1>
        <p className="mt-4 text-lg">{siteContent.hero.subheadline}</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/ubicaciones">{siteContent.hero.primaryCta}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/menu">{siteContent.hero.secondaryCta}</Link>
          </Button>
        </div>
      </section>

      <PapelPicadoDivider />

      <section className="px-6 py-16">
        <h2 className="font-heading text-3xl">Featured Dishes</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDishes.map((dish) => (
            <DishCard key={dish.name} item={dish} />
          ))}
        </div>
      </section>

      <section className="bg-navy px-6 py-16 text-white">
        <h2 className="font-heading text-3xl">Our Locations</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <LocationCard key={location.slug} location={location} />
          ))}
        </div>
      </section>
    </>
  );
}
```

**Step 2:** Run: `npm run build && npm test` — Expected: both succeed.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build home page with hero, featured dishes, and locations"
```

---

### Task 20: About page

**Files:**
- Create: `app/nuestra-historia/page.tsx`

**Step 1:** Implement:

```typescript
import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { PlaceholderImage } from "@/components/placeholder-image";

export const metadata: Metadata = {
  title: "Our Story",
  description: siteContent.about.body.slice(0, 155),
};

export default function AboutPage() {
  return (
    <section className="bg-teal/10 px-6 py-16">
      <PlaceholderImage variant="portrait" alt="Don Chuy's family in front of the Josper grill" width={600} height={800} />
      <h1 className="font-heading text-4xl">Our Story</h1>
      <p className="mt-4 max-w-2xl text-lg">{siteContent.about.body}</p>
      <ul className="mt-6 space-y-2">
        {siteContent.taglines.map((tagline) => (
          <li key={tagline} className="font-heading italic text-wine">
            {tagline}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**Step 2:** Run: `npm run build` — Expected: succeeds.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add About/Our Story page as its own route"
```

---

### Task 21: Menu page

**Files:**
- Create: `app/menu/menu-browser.tsx` (client component holding filter state)
- Create: `app/menu/page.tsx`
- Test: `app/menu/menu-browser.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuBrowser } from "./menu-browser";
import { menu } from "@/data/menu";

describe("MenuBrowser", () => {
  it("filters visible dishes as the user types a search query", async () => {
    render(<MenuBrowser categories={menu} />);
    await userEvent.type(screen.getByLabelText(/search the menu/i), "pulpo");
    expect(screen.getByText("Pulpo Zarandeado")).toBeInTheDocument();
    expect(screen.queryByText("Steak & Lobster")).not.toBeInTheDocument();
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `app/menu/menu-browser.tsx`:

```typescript
"use client";

import { useMemo, useState } from "react";
import type { MenuCategory, MenuItem } from "@/lib/schemas";
import { filterMenu } from "@/lib/menu-filters";
import { DishCard } from "@/components/dish-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MenuBrowser({ categories }: { categories: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<MenuItem["tags"][number] | null>(null);

  const filtered = useMemo(() => filterMenu(categories, { query, tag }), [categories, query, tag]);

  return (
    <div>
      <Label htmlFor="menu-search">Search the menu</Label>
      <Input id="menu-search" value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="mt-2 flex gap-2">
        {(["vegetarian", "seafood", "spicy", "kids"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTag(tag === t ? null : t)}
            className={tag === t ? "font-bold text-wine" : ""}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.map((category) => (
        <section key={category.slug} className="mt-8">
          <h2 className="font-heading text-2xl">{category.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <DishCard key={item.name} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

**Step 4:** Implement `app/menu/page.tsx`:

```typescript
import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { MenuBrowser } from "./menu-browser";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse Don Chuy's full menu — steaks, seafood, tacos, and more, Josper-grilled fresh.",
};

export default function MenuPage() {
  return (
    <section className="px-6 py-16">
      <h1 className="font-heading text-4xl">Menu</h1>
      <MenuBrowser categories={menu} />
    </section>
  );
}
```

**Step 5:** Run test + build — Expected: PASS / succeeds.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add real, filterable HTML menu page replacing the flipbook image"
```

---

### Task 22: Locations index + dynamic location page

**Files:**
- Create: `app/ubicaciones/page.tsx`
- Create: `app/ubicaciones/[slug]/page.tsx`
- Test: `app/ubicaciones/[slug]/page.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationPage, { generateStaticParams } from "./page";
import { locations } from "@/data/locations";

describe("LocationPage", () => {
  it("generates static params for every location slug", async () => {
    const params = await generateStaticParams();
    expect(params.map((p) => p.slug).sort()).toEqual(locations.map((l) => l.slug).sort());
  });

  it("renders the coming-soon state for O'Fallon without an order button", async () => {
    const ui = await LocationPage({ params: Promise.resolve({ slug: "ofallon" }) });
    render(ui);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /order online/i })).not.toBeInTheDocument();
  });

  it("renders address and reviews for an open location", async () => {
    const ui = await LocationPage({ params: Promise.resolve({ slug: "overland-park" }) });
    render(ui);
    expect(screen.getByText(/8725 Metcalf Ave/)).toBeInTheDocument();
    expect(screen.getByText(/Alex Iglesias/)).toBeInTheDocument();
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `app/ubicaciones/page.tsx`:

```typescript
import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { LocationCard } from "@/components/location-card";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find your nearest Don Chuy's Fresh Mex & Cantina in Overland Park, Lee's Summit, or Johnson City.",
};

export default function LocationsIndexPage() {
  return (
    <section className="px-6 py-16">
      <h1 className="font-heading text-4xl">Locations</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((location) => (
          <LocationCard key={location.slug} location={location} />
        ))}
      </div>
    </section>
  );
}
```

**Step 4:** Implement `app/ubicaciones/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { buildLocationJsonLd, locationMetaTitle, locationMetaDescription } from "@/lib/seo";
import { PlaceholderImage } from "@/components/placeholder-image";
import { ReviewCard } from "@/components/review-card";
import { InquiryForm } from "@/components/inquiry-form";
import { Button } from "@/components/ui/button";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) return {};
  return {
    title: locationMetaTitle(location),
    description: locationMetaDescription(location, "Steak & Lobster"),
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) notFound();

  if (location.comingSoon) {
    return (
      <section className="px-6 py-16">
        <h1 className="font-heading text-4xl">Don Chuy's {location.name}</h1>
        <p className="mt-4 text-lg">Coming soon! Leave your email and we'll let you know the moment we open.</p>
        <div className="mt-6 max-w-md">
          <InquiryForm type="notify-ofallon" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocationJsonLd(location)) }}
      />
      <PlaceholderImage variant="location" alt={`Don Chuy's ${location.name} storefront`} width={1200} height={800} />
      <h1 className="font-heading text-4xl">Don Chuy's {location.name}</h1>
      <p className="mt-4 max-w-2xl text-lg">{location.intro}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {location.reviews.map((review) => (
          <ReviewCard key={review.author} review={review} />
        ))}
      </div>

      <dl className="mt-6">
        <dt className="font-heading">Address</dt>
        <dd>{location.address}</dd>
        <dt className="font-heading mt-2">Phone</dt>
        <dd>
          <a href={`tel:${location.phone}`}>{location.phone}</a>
        </dd>
        <dt className="font-heading mt-2">Hours</dt>
        {location.hours.map((h) => (
          <dd key={h.days}>
            {h.days}: {h.time}
          </dd>
        ))}
      </dl>

      <Button asChild className="mt-6">
        <a href={location.orderUrl}>Order Online</a>
      </Button>

      <p className="mt-6 italic">{location.closing}</p>
    </section>
  );
}
```

**Step 5:** Run test + build — Expected: PASS / succeeds.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add locations index and per-city dynamic page with JSON-LD"
```

---

### Task 23: Happy Hour, Catering, and Contact pages

**Files:**
- Create: `app/happy-hour/page.tsx`
- Create: `app/catering-eventos/page.tsx`
- Create: `app/contacto/page.tsx`

**Step 1:** Implement `app/happy-hour/page.tsx` (real content, fixing the dead footer link):

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Happy Hour",
  description: "Don Chuy's Happy Hour specials on margaritas, tequila, and appetizers.",
};

export default function HappyHourPage() {
  return (
    <section className="px-6 py-16">
      <h1 className="font-heading text-4xl">Happy Hour</h1>
      <p className="mt-4 text-lg">
        TODO: confirm real Happy Hour days/times and specials with the client per location before launch.
      </p>
    </section>
  );
}
```

**Step 2:** Implement `app/catering-eventos/page.tsx`:

```typescript
import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Catering & Events",
  description: "Book Don Chuy's for catering, private events, and large group dining.",
};

export default function CateringPage() {
  return (
    <section className="px-6 py-16">
      <h1 className="font-heading text-4xl">Catering & Events</h1>
      <p className="mt-4 max-w-2xl text-lg">
        Planning a party, corporate event, or large group dinner? Tell us the details and we'll help you build the
        perfect spread of Josper-grilled favorites.
      </p>
      <div className="mt-6 max-w-md">
        <InquiryForm type="catering" />
      </div>
    </section>
  );
}
```

**Step 3:** Implement `app/contacto/page.tsx`:

```typescript
import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Don Chuy's Fresh Mex & Cantina.",
};

export default function ContactPage() {
  return (
    <section className="px-6 py-16">
      <h1 className="font-heading text-4xl">Let's Talk</h1>
      <p className="mt-4 text-lg">We would love to hear from you!</p>
      <div className="mt-6 max-w-md">
        <InquiryForm type="contact" />
      </div>
    </section>
  );
}
```

**Step 4:** Run: `npm run build` — Expected: succeeds.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Happy Hour, Catering, and Contact pages"
```

---

### Task 24: Sitemap and robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Test: `app/sitemap.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { locations } from "@/data/locations";

describe("sitemap", () => {
  it("includes a URL for every open location", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const location of locations.filter((l) => !l.comingSoon)) {
      expect(urls.some((url) => url.endsWith(`/ubicaciones/${location.slug}`))).toBe(true);
    }
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { locations } from "@/data/locations";

const BASE_URL = "https://www.don-chuys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/nuestra-historia",
    "/menu",
    "/ubicaciones",
    "/happy-hour",
    "/catering-eventos",
    "/contacto",
  ].map((path) => ({ url: `${BASE_URL}${path}` }));

  const locationRoutes = locations.map((location) => ({
    url: `${BASE_URL}/ubicaciones/${location.slug}`,
  }));

  return [...staticRoutes, ...locationRoutes];
}
```

**Step 4:** Implement `app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.don-chuys.com/sitemap.xml",
  };
}
```

**Step 5:** Run test + build — Expected: PASS / succeeds.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sitemap and robots.txt covering every real page"
```

---

### Task 25: Final verification

**Files:** none (verification only)

**Step 1:** Run full test suite: `npm test` — Expected: all tests PASS.

**Step 2:** Run type check: `npx tsc --noEmit` — Expected: no errors.

**Step 3:** Run lint: `npm run lint` — Expected: no errors.

**Step 4:** Run production build: `npm run build` — Expected: succeeds, lists all routes including `/ubicaciones/[slug]` static params for `overland-park`, `lees-summit`, `johnson-city`, `ofallon`.

**Step 5:** Manual mobile check — start `npm run dev`, open in a 390px-wide viewport (Chrome DevTools device toolbar or the claude-in-chrome tools), click through Home → Menu → a location page → Contact, confirm no horizontal scroll and nav is usable. This directly verifies the audit's #1 critical bug is fixed.

**Step 6:** Update root `README.md` with setup steps (`npm install`, `npm run dev`, required env vars `RESEND_API_KEY` and `RESTAURANT_INBOX_EMAIL`) and a short "known TODOs before launch" list: real ChowNow order URLs per location, confirmed hours for Overland Park, O'Fallon opening status, full menu pricing/copy pass, real photography.

**Step 7: Commit**

```bash
git add -A
git commit -m "docs: add README with setup steps and pre-launch TODOs"
```

---

## Pre-Launch TODOs (tracked, not blocking this build)

- Confirm real hours for Overland Park (Wed inconsistency in source audit).
- Confirm O'Fallon opening timeline and address.
- Get real ChowNow order URLs for all three open locations.
- Full menu copywriting + pricing pass (source menu was an unreadable image; only 4 items had legible/rewritten copy).
- Replace placeholder images with the client's selected final photography.
- Decide and populate real Happy Hour specials, or remove the page/link if it won't launch with content.
