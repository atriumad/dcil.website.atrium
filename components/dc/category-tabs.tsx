"use client";

import { useState } from "react";
import { cx } from "./utils";

export interface CategoryTabsProps {
  items?: string[];
  /** Controlled value. Omit to let the tabs keep their own state. */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function CategoryTabs({
  items = ["Tacos", "Fajitas", "Mariscos", "Burritos", "Bowls", "Drinks"],
  value,
  onChange,
  className,
}: CategoryTabsProps) {
  const [inner, setInner] = useState(items[0]);
  const current = value ?? inner;
  return (
    <div className={cx("dc-tabs", className)} role="tablist" aria-label="Menu categories">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={item === current}
          className={cx("dc-tab", item === current && "is-active")}
          onClick={() => {
            setInner(item);
            onChange?.(item);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
