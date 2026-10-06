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
