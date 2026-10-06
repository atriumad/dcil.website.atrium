import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(path.join(import.meta.dirname, "..", "app", file), "utf8");

/** CSS files that must be v6-clean. Task 2 appends the dc-*.css files. */
export const CSS_FILES = ["tokens.css", "type.css", "globals.css"];

/** v5 tokens removed in v6. A surviving `var(--x)` renders as an unset (invisible) color. */
const REMOVED = [
  "cream", "ink", "ink-muted", "surface", "paper", "paper-deep", "sage", "sage-100", "sage-200", "sage-alt", "ornament",
  "agave", "agave-900", "teal-surface", "teal-100", "teal-700", "teal-ink", "chuy-rose", "chuy-red", "deep-red",
  "rose-100", "marigold-100", "marigold-700", "on-brand", "on-dark", "script-ink", "shadow-sticker", "shadow-lift",
  "radius-pill", "radius-xl", "space-10",
];

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const token = (name: string) => {
  const match = read("tokens.css").match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token --${name} not found in tokens.css`);
  return match[1];
};

describe("design tokens v6", () => {
  it("defines the palette exactly as the brand guide", () => {
    const css = read("tokens.css");
    for (const [name, value] of Object.entries({
      navy: "#194765", "navy-900": "#0e2f44", "navy-700": "#255b7e", white: "#ffffff", ivory: "#f6f1e7",
      "ivory-muted": "#c5d0d8", marigold: "#ed9d55", rose: "#9f3e49", teal: "#69968f", "on-marigold": "#0e2f44", focus: "#ed9d55",
    })) {
      expect(css, name).toContain(`--${name}: ${value}`);
    }
  });

  it.each(CSS_FILES)("%s uses no token removed from v5", (file) => {
    const css = read(file);
    for (const name of REMOVED) {
      expect(css, `${file} still uses --${name}`).not.toMatch(new RegExp(`var\\(--${name}[,)]`));
    }
    expect(css, `${file} still has a theme switch`).not.toContain("data-theme");
  });

  it("keeps the contrast the guide promises", () => {
    expect(contrast(token("white"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory-muted"), token("navy"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory-muted"), token("navy-900"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("on-marigold"), token("marigold"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("white"), token("rose"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ivory"), token("rose"))).toBeGreaterThanOrEqual(4.5);
    // marigold text on navy: large text only (guide: 19px bold+), so the 3:1 large-text bar applies
    expect(contrast(token("marigold"), token("navy"))).toBeGreaterThanOrEqual(3);
    expect(contrast(token("marigold"), token("navy-900"))).toBeGreaterThanOrEqual(4.5);
  });
});
