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
