"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "./button";
import { Icon } from "./icon";
import { cx, toLink, type LinkItem } from "./utils";

export interface NavBarProps {
  links?: Array<string | LinkItem>;
  /** Label of the current page's link. */
  active?: string;
  brand?: ReactNode;
  cta?: string | null;
  ctaHref?: string;
  variant?: "cream" | "rose";
  className?: string;
}

export function NavBar({
  links = ["Menu", "Specials", "Happy Hour", "Locations", "About"],
  active,
  brand,
  cta = "Order Online",
  ctaHref = "#",
  variant = "cream",
  className,
}: NavBarProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("dc-navwrap", className)}>
      <nav className={cx("dc-nav", `dc-nav-${variant}`, open && "is-open")} aria-label="Main">
        <Link href="/" className="dc-nav-brand">
          {brand ?? <span className="dc-nav-wordmark">Don Chuy&apos;s</span>}
        </Link>
        <ul className="dc-nav-links">
          {links.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cx("dc-nav-link", label === active && "is-active")}
                  aria-current={label === active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="dc-nav-end">
          {cta ? (
            <Button href={ctaHref} variant={variant === "rose" ? "marigold" : "primary"} size="sm" icon="arrow-up-right">
              {cta}
            </Button>
          ) : null}
          <button
            type="button"
            className="dc-nav-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>
    </div>
  );
}
