"use client";

import { useState } from "react";
import { CategoryTabs, Input, MenuSection } from "@/components/dc";
import type { MenuItemProps } from "@/components/dc";
import { filterMenu } from "@/lib/menu-filters";
import type { MenuCategory, MenuItem } from "@/lib/schemas";

const tabLabels = ["All", "Seafood", "Vegetarian", "Spicy", "Kids"] as const;

const tagFor = (label: (typeof tabLabels)[number]): MenuItem["tags"][number] | null =>
  label === "All" ? null : (label.toLowerCase() as MenuItem["tags"][number]);

const displayTag = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);

const toMenuItemProps = (item: MenuItem): MenuItemProps => ({
  name: item.name,
  description: item.needsCopyReview ? undefined : item.description,
  price: item.price != null ? `$${item.price.toFixed(2)}` : "",
  tags: item.tags.map(displayTag),
});

export function MenuBrowser({ categories }: { categories: MenuCategory[] }) {
  const [tab, setTab] = useState<(typeof tabLabels)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = filterMenu(categories, { tag: tagFor(tab), query });

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="sticky top-4 z-40 flex flex-wrap items-center gap-[var(--space-4)] rounded-[var(--radius-pill)] bg-[var(--surface)] p-2 shadow-[var(--shadow-card)]">
        <CategoryTabs items={[...tabLabels]} value={tab} onChange={(v) => setTab(v as (typeof tabLabels)[number])} />
        <Input
          type="search"
          placeholder="Search the menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px] flex-1"
          aria-label="Search the menu"
        />
      </div>

      {filtered.length ? (
        <div className="grid gap-[var(--space-6)] md:grid-cols-2">
          {filtered.map((category) => (
            <MenuSection key={category.slug} id={category.slug} title={category.name} items={category.items.map(toMenuItemProps)} />
          ))}
        </div>
      ) : (
        <p className="body text-[var(--ink-muted)]">No dishes match that search. Try another tag or clear the search.</p>
      )}
    </div>
  );
}
