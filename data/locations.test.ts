import { describe, it, expect } from "vitest";
import { locations, orderHref } from "./locations";
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
    expect(slugs).toEqual(["johnson-city-tn", "lees-summit-mo", "ofallon-il", "overland-park-ks"]);
  });

  it("orders online in Overland Park (ChowNow) and Lee's Summit (order.online), by phone elsewhere", () => {
    const bySlug = Object.fromEntries(locations.map((l) => [l.slug, orderHref(l)]));
    expect(bySlug["overland-park-ks"]).toBe("https://order.chownow.com/order/42367/locations/64005");
    expect(bySlug["lees-summit-mo"]).toBe("https://order.online/store/don-chuys-fresmex-&-cantina-lee's-summit-24072246");
    expect(bySlug["johnson-city-tn"]).toBe("tel:+14233283475");
    expect(bySlug["ofallon-il"]).toBe("tel:+16182066048");
  });

  it("no two open locations share the same intro copy", () => {
    const openIntros = locations.filter((l) => !l.comingSoon).map((l) => l.intro);
    expect(new Set(openIntros).size).toBe(openIntros.length);
  });
});
