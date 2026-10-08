export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface HoursRow {
  days: string;
  time: string;
}

/** "Every day", "Mon-Tue, Thu", "Fri-Sun" -> weekday indexes (0 = Sunday). Ranges may wrap past Saturday. */
export function parseDays(spec: string): number[] {
  if (/every day/i.test(spec)) return [0, 1, 2, 3, 4, 5, 6];
  const days = new Set<number>();
  for (const part of spec.split(",")) {
    const [from, to = from] = part.trim().split("-").map((p) => DAY_ABBR.indexOf(p.trim().slice(0, 3)));
    if (from < 0 || to < 0) continue;
    for (let d = from; ; d = (d + 1) % 7) {
      days.add(d);
      if (d === to) break;
    }
  }
  return [...days];
}

/** "11:00 AM" -> minutes after midnight. */
export function parseClock(clock: string): number {
  const match = clock.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return NaN;
  const hour = Number(match[1]) % 12;
  return (hour + (match[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(match[2]);
}

/** "11:00 AM - 10:30 PM" -> open/close in minutes plus the printed labels. */
export function parseRange(time: string) {
  const [openLabel, closeLabel] = time.split("-").map((t) => t.trim());
  return { open: parseClock(openLabel), close: parseClock(closeLabel), openLabel, closeLabel };
}

/** One line for the "open today" strip. `day` is 0-6, `minutes` is minutes after midnight, both in the location's own zone. */
export function openStatus(hours: HoursRow[], day: number, minutes: number): { open: boolean; label: string } | null {
  const row = hours.find((r) => parseDays(r.days).includes(day));
  if (!row) return null;
  const { open, close, openLabel, closeLabel } = parseRange(row.time);
  if (Number.isNaN(open) || Number.isNaN(close)) return null;
  if (minutes >= open && minutes < close) return { open: true, label: `Open until ${closeLabel}` };
  if (minutes < open) return { open: false, label: `Opens ${openLabel}` };
  return { open: false, label: "Closed for tonight" };
}

/** Johnson City runs on Eastern time; every other open location is Central. */
export const timeZoneFor = (locationName: string) => (/, TN$/.test(locationName) ? "America/New_York" : "America/Chicago");

/** Weekday and minutes-after-midnight for `at` in `timeZone`. */
export function clockIn(timeZone: string, at: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: DAY_ABBR.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}
