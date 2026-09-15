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
