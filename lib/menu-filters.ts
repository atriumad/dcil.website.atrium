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
