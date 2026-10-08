"use client";

import { clockIn, openStatus, timeZoneFor, type HoursRow } from "@/lib/hours";
import { useNow } from "./use-now";

/** One line above the hours table: open now (and until when), or when it opens. Empty until mounted. */
export function OpenNow({ name, hours }: { name: string; hours: HoursRow[] }) {
  const at = useNow();
  const now = at === null ? null : clockIn(timeZoneFor(name), at);
  const status = now ? openStatus(hours, now.day, now.minutes) : null;
  return (
    <p className="sg-opennow">
      {status ? (
        <>
          <span className={status.open ? "sg-dot is-open" : "sg-dot"} aria-hidden="true" />
          {status.label}
        </>
      ) : null}
    </p>
  );
}
