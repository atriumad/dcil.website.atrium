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
