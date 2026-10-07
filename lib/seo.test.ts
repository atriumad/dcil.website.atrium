import { describe, it, expect } from "vitest";
import { buildLocationJsonLd } from "./seo";
import { locations } from "@/data/locations";

describe("buildLocationJsonLd", () => {
  it("builds a Restaurant schema with address and phone for an open location", () => {
    const overlandPark = locations.find((l) => l.slug === "overland-park-ks")!;
    const jsonLd = buildLocationJsonLd(overlandPark);

    expect(jsonLd["@type"]).toBe("Restaurant");
    expect(jsonLd.name).toContain("Don Chuy's");
    expect(jsonLd.address.streetAddress).toBeDefined();
    expect(jsonLd.telephone).toBe(overlandPark.phone);
  });
});
