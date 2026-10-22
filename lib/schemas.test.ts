import { describe, it, expect } from "vitest";
import { locationSchema, menuItemSchema, inquirySchema, eventRequestSchema } from "./schemas";

describe("locationSchema", () => {
  it("accepts a valid open location", () => {
    const result = locationSchema.safeParse({
      slug: "overland-park-ks",
      name: "Overland Park, KS",
      address: "8725 Metcalf Ave, Overland Park, KS 66212",
      phone: "+1 816-603-2124",
      hours: [{ days: "Mon-Thu", time: "11:00 AM - 10:00 PM" }],
      orderUrl: "https://order.chownow.com/order/0000/locations",
      comingSoon: false,
      reviews: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a location missing an address when not coming soon", () => {
    const result = locationSchema.safeParse({
      slug: "bad",
      name: "Bad",
      address: "",
      phone: "",
      hours: [],
      orderUrl: "",
      comingSoon: false,
      reviews: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("menuItemSchema", () => {
  it("accepts a valid item", () => {
    const result = menuItemSchema.safeParse({
      name: "Steak & Lobster",
      description: "A 12 oz. ribeye grilled to order, paired with 6 oz. of butter-garlic lobster.",
      price: null,
      tags: [],
      needsCopyReview: false,
    });
    expect(result.success).toBe(true);
  });
});

describe("inquirySchema", () => {
  it("rejects an invalid email", () => {
    const result = inquirySchema.safeParse({
      type: "general",
      firstName: "Ana",
      lastName: "Lopez",
      email: "not-an-email",
      message: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid contact inquiry", () => {
    const result = inquirySchema.safeParse({
      type: "general",
      firstName: "Ana",
      lastName: "Lopez",
      email: "ana@example.com",
      message: "Hola, quisiera reservar para 8 personas.",
    });
    expect(result.success).toBe(true);
  });
});

describe("eventRequestSchema", () => {
  const base = {
    firstName: "Ana",
    lastName: "Lopez",
    email: "ana@example.com",
    phone: "618-555-0100",
    eventDate: "2026-11-20",
    eventTime: "18:00",
    guestCount: "25",
  };

  it("accepts a dine-in party without catering fields", () => {
    expect(eventRequestSchema.safeParse({ ...base, type: "dine-in-party" }).success).toBe(true);
  });

  it("requires pick up or dine-in for catering", () => {
    expect(eventRequestSchema.safeParse({ ...base, type: "catering" }).success).toBe(false);
    expect(eventRequestSchema.safeParse({ ...base, type: "catering", fulfillment: "pickup" }).success).toBe(true);
  });

  it("rejects a missing guest count", () => {
    expect(eventRequestSchema.safeParse({ ...base, type: "dine-in-party", guestCount: "" }).success).toBe(false);
  });
});
