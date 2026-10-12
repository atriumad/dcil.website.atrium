"use client";

import { Icon } from "@/components/dc";
import { locations, orderHref, telHref } from "@/data/locations";
import { clockIn, openStatus, timeZoneFor } from "@/lib/hours";
import { useNow } from "./use-now";

const cityOf = (name: string) => name.split(",")[0];

/** "Open today" strip under the hero: is each location open, plus one tap to call or order. */
export function Tonight() {
  const at = useNow();

  return (
    <section id="tonight" className="sg-deep2 sg-tonight" aria-label="Open today">
      <ul className="sg-tonight-list">
        {locations
          .filter((l) => !l.comingSoon)
          .map((l) => {
            const now = at === null ? null : clockIn(timeZoneFor(l.name), at);
            const status = now ? openStatus(l.hours, now.day, now.minutes) : null;
            const order = orderHref(l);
            const online = order.startsWith("http");
            return (
              <li key={l.slug} className="sg-tonight-item">
                <div className="sg-tonight-info">
                  <h2 className="sg-tonight-city">{cityOf(l.name)}</h2>
                  <p className="sg-tonight-status">
                    {status ? (
                      <>
                        <span className={status.open ? "sg-dot is-open" : "sg-dot"} aria-hidden="true" />
                        {status.label}
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="sg-tonight-actions">
                  <a className="sg-tonight-btn" href={telHref(l.phone)} aria-label={`Call ${l.name}`}>
                    <Icon name="phone" size={16} /> Call
                  </a>
                  {online ? (
                    <a className="sg-tonight-btn is-solid" href={order} target="_blank" rel="noopener noreferrer" aria-label={`Order online from ${l.name}`}>
                      <Icon name="bag" size={16} /> Order
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
