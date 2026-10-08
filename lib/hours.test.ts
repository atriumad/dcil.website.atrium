import { describe, expect, it } from "vitest";
import { locations } from "@/data/locations";
import { clockIn, openStatus, parseClock, parseDays, timeZoneFor } from "./hours";

describe("parseDays", () => {
  it("reads ranges, lists and 'Every day'", () => {
    expect(parseDays("Every day")).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(parseDays("Mon-Tue, Thu").sort()).toEqual([1, 2, 4]);
    expect(parseDays("Fri-Sun").sort()).toEqual([0, 5, 6]);
    expect(parseDays("Wed")).toEqual([3]);
  });
});

describe("parseClock", () => {
  it("converts 12-hour clocks to minutes", () => {
    expect(parseClock("11:00 AM")).toBe(660);
    expect(parseClock("12:00 PM")).toBe(720);
    expect(parseClock("10:30 PM")).toBe(1350);
    expect(parseClock("12:00 AM")).toBe(0);
  });
});

describe("openStatus", () => {
  const overland = locations[0].hours;
  it("says when a location closes while it is open", () => {
    expect(openStatus(overland, 1, 12 * 60)).toEqual({ open: true, label: "Open until 10:00 PM" });
    expect(openStatus(overland, 3, 10 * 60 + 15)).toEqual({ open: true, label: "Open until 10:30 PM" });
  });
  it("says when it opens before opening and closed after closing", () => {
    expect(openStatus(overland, 1, 9 * 60)).toEqual({ open: false, label: "Opens 11:00 AM" });
    expect(openStatus(overland, 1, 22 * 60)).toEqual({ open: false, label: "Closed for tonight" });
  });
  it("returns null with no hours", () => {
    expect(openStatus([], 1, 720)).toBeNull();
  });
  it("parses every open location's printed hours", () => {
    for (const location of locations.filter((l) => l.hours.length)) {
      for (let day = 0; day < 7; day++) expect(openStatus(location.hours, day, 720), `${location.name} day ${day}`).not.toBeNull();
    }
  });
});

describe("time zones", () => {
  it("puts Johnson City on Eastern time and the rest on Central", () => {
    expect(timeZoneFor("Johnson City, TN")).toBe("America/New_York");
    expect(timeZoneFor("Lee's Summit, MO")).toBe("America/Chicago");
  });
  it("reads the weekday and minutes in a zone", () => {
    // 2026-10-08 18:00 UTC is Thursday 13:00 in Chicago and 14:00 in New York.
    const at = Date.UTC(2026, 9, 8, 18, 0);
    expect(clockIn("America/Chicago", at)).toEqual({ day: 4, minutes: 13 * 60 });
    expect(clockIn("America/New_York", at)).toEqual({ day: 4, minutes: 14 * 60 });
  });
});
