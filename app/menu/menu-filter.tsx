"use client";

import { Fragment, useEffect, useState } from "react";
import { Icon, Input, PhotoFrame } from "@/components/dc";
import type { IconName } from "@/components/dc";
import { filterMenu } from "@/lib/menu-filters";
import type { MenuCategory, MenuItem } from "@/lib/schemas";

type Tag = MenuItem["tags"][number];

const tagIcon: Record<Tag, IconName> = { spicy: "chile", vegetarian: "avocado", seafood: "sparkle", kids: "sparkle" };
const tagLabel: Record<Tag, string> = { spicy: "Spicy", vegetarian: "Veggie", seafood: "Seafood", kids: "Kids" };

/** Split photo breaks, each shown after the category it belongs to. Portrait shots, so the frame never crops hard. */
const breaksAfter = {
  "steak-house": { src: "/images/photos/dish-carne-asada-cutting.webp", alt: "Carving carne asada on a sizzling platter", script: "Josper-grilled", line: "Over real fire, made fresh every day.", tone: "marigold", flip: false },
  tacos: { src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand", script: "Taco night", line: "Street-style, handmade, every night.", tone: "sage", flip: true },
  "pescados-ostras": { src: "/images/photos/dish-shrimp-ceviche-app.webp", alt: "Shrimp ceviche with an avocado rose", script: "Fresh from the sea", line: "Ceviche, oysters and mariscos to share.", tone: "rose", flip: false },
  drinks: { src: "/images/photos/drink-red-cocktail-bar.webp", alt: "Red margarita on the bar", script: "Raise a glass", line: "Margaritas, flights and cocktails.", tone: "marigold", flip: true },
  especiales: { src: "/images/photos/spread-seafood-boil-close.webp", alt: "Seafood boil and plates spread across the table", script: "Made for sharing", line: "Bring the whole table. We'll fill it.", tone: "sage", flip: false },
} as const;

type Break = (typeof breaksAfter)[keyof typeof breaksAfter];
const breakFor = (slug: string): Break | null => (breaksAfter as Record<string, Break>)[slug] ?? null;

const formatPrice = (price: number | null) => (price != null ? `$${price.toFixed(2)}` : "");

function MenuEntry({ item }: { item: MenuItem }) {
  const description = item.needsCopyReview ? undefined : item.description;
  const price = formatPrice(item.price);
  return (
    <li className="mn-item">
      <div className="mn-item-head">
        <span className="mn-item-name">
          {item.name}
          {item.tags.map((tag) => (
            <Icon key={tag} name={tagIcon[tag]} size={16} title={tagLabel[tag]} className="mn-item-tag" />
          ))}
        </span>
        {price ? (
          <>
            <span className="mn-item-dots" aria-hidden="true" />
            <span className="mn-item-price">{price}</span>
          </>
        ) : null}
      </div>
      {description ? <p className="mn-item-desc">{description}</p> : null}
    </li>
  );
}

function MenuBreak({ src, alt, script, line, tone, flip }: Break) {
  return (
    <aside className={`mn-break mn-break-${tone}${flip ? " is-flip" : ""}`}>
      <PhotoFrame src={src} alt={alt} shape="rounded" ratio="4 / 5" sizes="(min-width: 1100px) 440px, 92vw" className="mn-break-photo" />
      <div className="mn-break-copy">
        <p className="mn-break-script">{script}</p>
        <p className="mn-break-line">{line}</p>
      </div>
    </aside>
  );
}

function MenuCategoryBlock({ category, index }: { category: MenuCategory; index: number }) {
  // Names-only categories read better in two columns; detailed ones need the full line width.
  const detailed = category.items.some((item) => item.price != null || (!item.needsCopyReview && item.description));
  return (
    <section id={category.slug} data-menu-section className="mn-cat">
      <header className="mn-cat-head">
        <span className="mn-cat-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="mn-cat-title">{category.name}</h2>
      </header>
      <ul className={detailed ? "mn-list" : "mn-list mn-list-cols"}>
        {category.items.map((item) => (
          <MenuEntry key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

export function MenuBrowser({ categories }: { categories: MenuCategory[] }) {
  const [tag, setTag] = useState<Tag | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const availableTags = (Object.keys(tagLabel) as Tag[]).filter((t) => categories.some((c) => c.items.some((i) => i.tags.includes(t))));
  const filtered = filterMenu(categories, { tag, query });
  const isFiltering = tag !== null || query.trim() !== "";
  const filteredKey = filtered.map((c) => c.slug).join("|");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-menu-section]");
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [filteredKey]);

  useEffect(() => {
    if (!active) return;
    const chip = document.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const scroller = chip?.parentElement;
    if (!chip || !scroller) return;
    scroller.scrollTo({ left: chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div className="mn">
      <div className="mn-tools">
        {availableTags.map((t) => (
          <button
            key={t}
            type="button"
            className={tag === t ? "mn-toggle is-active" : "mn-toggle"}
            aria-pressed={tag === t}
            onClick={() => setTag(tag === t ? null : t)}
          >
            <Icon name={tagIcon[t]} size={14} />
            {tagLabel[t]}
          </button>
        ))}
        <Input
          type="search"
          placeholder="Search the menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mn-search"
          aria-label="Search the menu"
        />
      </div>
      <div className="mn-bar">
        <nav className="mn-chips" aria-label="Menu categories">
          {filtered.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              data-chip={category.slug}
              className={active === category.slug ? "mn-chip is-active" : "mn-chip"}
              aria-current={active === category.slug ? "true" : undefined}
            >
              {category.name.split(" / ")[0]}
            </a>
          ))}
        </nav>
      </div>

      {filtered.length ? (
        <div className="mn-book">
          {filtered.map((category, index) => {
            const photoBreak = isFiltering ? null : breakFor(category.slug);
            return (
              <Fragment key={category.slug}>
                <MenuCategoryBlock category={category} index={index} />
                {photoBreak ? <MenuBreak {...photoBreak} /> : null}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <p className="body mn-empty">No dishes match that search. Try another filter or clear the search.</p>
      )}
    </div>
  );
}
