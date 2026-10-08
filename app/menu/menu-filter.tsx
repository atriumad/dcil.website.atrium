"use client";

import { Fragment, useEffect, useState } from "react";
import { Icon, PhotoFrame } from "@/components/dc";
import type { IconName } from "@/components/dc";
import type { MenuCategory, MenuItem } from "@/lib/schemas";

type Tag = MenuItem["tags"][number];

const tagIcon: Record<Tag, IconName> = { spicy: "chile", vegetarian: "avocado", seafood: "sparkle", kids: "sparkle" };
const tagLabel: Record<Tag, string> = { spicy: "Spicy", vegetarian: "Veggie", seafood: "Seafood", kids: "Kids" };

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
  const [active, setActive] = useState<string | null>(null);

  const filtered = categories;
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
            const photoBreak = breakFor(category.slug);
            return (
              <Fragment key={category.slug}>
                <MenuCategoryBlock category={category} index={index} />
                {photoBreak ? <MenuBreak {...photoBreak} /> : null}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <p className="body mn-empty">No dishes match that filter. Try another one.</p>
      )}
    </div>
  );
}
