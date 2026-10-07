import { describe, it, expect } from "vitest";
import { siteContent } from "./site";

describe("site content", () => {
  it("has a hero headline and subheadline", () => {
    expect(siteContent.hero.headline.length).toBeGreaterThan(0);
    expect(siteContent.hero.subheadline.length).toBeGreaterThan(0);
  });

  it("has about copy and a tagline list", () => {
    expect(siteContent.about.body.length).toBeGreaterThan(0);
    expect(siteContent.taglines.length).toBeGreaterThan(0);
  });
});
