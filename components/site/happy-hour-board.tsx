"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { formatHhPrice, happyHour, type HhRow } from "@/data/happy-hour";
import { clockIn } from "@/lib/hours";
import { useNow } from "./use-now";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Rows({ rows }: { rows: HhRow[] }) {
  return (
    <ul className="sg-hh-rows">
      {rows.map((row) => (
        <li key={row.name} className="sg-hh-row">
          <span>
            {row.name}
            {row.note ? <small>{row.note}</small> : null}
          </span>
          <span className="sg-hh-price">{formatHhPrice(row)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Mon-Thu tabs. Opens on today's day (Mon-Thu) once mounted; Monday on the server and on Fri-Sun. Always-on deals sit below. */
export function HappyHourBoard() {
  const id = useId();
  // null on the server (Monday opens), the weekday name in the browser.
  const today = useSyncExternalStore(
    () => () => {},
    () => dayNames[new Date().getDay()],
    () => null,
  );
  const todayIndex = happyHour.days.findIndex((d) => d.day === today);
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? (todayIndex >= 0 ? todayIndex : 0);

  const day = happyHour.days[selected];
  return (
    <div className="sg-hh">
      <div className="sg-hh-days" role="tablist" aria-label="Happy hour by day">
        {happyHour.days.map((d, i) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === selected}
            aria-controls={`${id}-panel`}
            className="sg-hh-day"
            onClick={() => setPicked(i)}
          >
            {d.day.slice(0, 3)}
            {todayIndex >= 0 && today === d.day ? <span className="sg-hh-today">Today</span> : null}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} className="sg-hh-group">
        <h3 className="sg-hh-theme">{day.theme}</h3>
        {day.food.length ? (
          <>
            <p className="sg-hh-label">Food special</p>
            <Rows rows={day.food} />
          </>
        ) : null}
        {day.drinks.length ? (
          <>
            <p className="sg-hh-label">Drinks</p>
            <Rows rows={day.drinks} />
          </>
        ) : null}
      </div>
      <div className="sg-hh-all">
        <div className="sg-hh-group">
          <p className="sg-hh-label">Appetizers, every day</p>
          <Rows rows={happyHour.always.appetizers} />
        </div>
        <div className="sg-hh-group">
          <p className="sg-hh-label">Drinks, every day</p>
          <Rows rows={happyHour.always.drinks} />
        </div>
      </div>
    </div>
  );
}

/** The whole Mon-Thu week at once (no tabs), with the everyday deals beside it. Today's column is marked, and leads on phones. */
export function HappyHourWeek() {
  const at = useNow();
  const today = at === null ? null : dayNames[clockIn("America/Chicago", at).day];
  return (
    <div className="sg-hw">
      <ol className="sg-hw-days">
        {happyHour.days.map((d, i) => {
          const isToday = d.day === today;
          return (
            <li key={d.day} className={isToday ? "sg-hw-day is-today" : "sg-hw-day"} style={{ "--o": isToday ? -1 : i } as React.CSSProperties}>
              <header className="sg-hw-head">
                <h2 className="sg-hw-name">{d.day}</h2>
                {isToday ? <span className="sg-hw-flag">Today</span> : null}
              </header>
              <h3 className="sg-hh-theme">{d.theme}</h3>
              {d.food.length ? (
                <div className="sg-hh-group">
                  <p className="sg-hh-label">Food special</p>
                  <Rows rows={d.food} />
                </div>
              ) : null}
              {d.drinks.length ? (
                <div className="sg-hh-group">
                  <p className="sg-hh-label">Drinks</p>
                  <Rows rows={d.drinks} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="sg-hw-all">
        <h2 className="sg-h3 sg-on-dark">Every day</h2>
        <div className="sg-hw-all-lists">
          <div className="sg-hh-group">
            <p className="sg-hh-label">Appetizers</p>
            <Rows rows={happyHour.always.appetizers} />
          </div>
          <div className="sg-hh-group">
            <p className="sg-hh-label">Drinks</p>
            <Rows rows={happyHour.always.drinks} />
          </div>
        </div>
      </div>
    </div>
  );
}
