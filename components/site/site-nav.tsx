"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "@/components/dc";
import type { LinkItem } from "@/components/dc";

export interface SiteNavLink extends LinkItem {
  /** Dropdown entries (rendered under the link). */
  children?: Array<LinkItem & { note?: string; external?: boolean }>;
}

export interface SiteNavProps {
  links: SiteNavLink[];
  /** Label of the current page's link (gets the marigold underline). */
  active?: string;
  /** "Order Now" options: ChowNow where it exists, tap-to-call elsewhere. */
  order: Array<LinkItem & { note?: string; external?: boolean }>;
  /** Float over the page's dark hero with no fill, then settle into the solid bar once the page scrolls. */
  overlay?: boolean;
}

/** Closes an open popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLLIElement | HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

function OptionList({ items, onPick }: { items: NonNullable<SiteNavLink["children"]>; onPick: () => void }) {
  return (
    <ul className="sg-sub" role="list">
      {items.map((item) => (
        <li key={item.label}>
          {item.external ? (
            <a href={item.href} className="sg-sub-link" onClick={onPick}>
              <span>{item.label}</span>
              {item.note ? <small>{item.note}</small> : null}
            </a>
          ) : (
            <Link href={item.href} className="sg-sub-link" onClick={onPick}>
              <span>{item.label}</span>
              {item.note ? <small>{item.note}</small> : null}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function NavItem({ link, active, closeMenu }: { link: SiteNavLink; active?: string; closeMenu: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useDismiss(open, close) as React.RefObject<HTMLLIElement>;
  const isActive = link.label === active;

  if (!link.children?.length) {
    return (
      <li>
        <Link href={link.href} className={`dc-nav-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined} onClick={closeMenu}>
          {link.label}
        </Link>
      </li>
    );
  }
  return (
    <li ref={ref} className={`sg-has-sub${open ? " is-open" : ""}`}>
      <button
        type="button"
        className={`dc-nav-link sg-sub-toggle${isActive ? " is-active" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {link.label}
        <span className="sg-sub-caret" aria-hidden="true" />
      </button>
      <OptionList
        items={[{ label: `All ${link.label.toLowerCase()}`, href: link.href }, ...link.children]}
        onPick={() => {
          close();
          closeMenu();
        }}
      />
    </li>
  );
}

export function SiteNav({ links, active, order, overlay }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const [orderOpen, setOrderOpen] = useState(false);
  const orderRef = useDismiss(orderOpen, () => setOrderOpen(false)) as React.RefObject<HTMLDivElement>;
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="dc-navwrap">
      <nav className={`dc-nav ${overlay ? "dc-nav-over" : "dc-nav-solid"}${overlay && scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`} aria-label="Main">
        <Link href="/" className="dc-nav-brand">
          <Logo size={96} style={{ width: "var(--nav-logo, 64px)" }} />
        </Link>
        <ul className="dc-nav-links">
          {links.map((link) => (
            <NavItem key={link.label} link={link} active={active} closeMenu={closeMenu} />
          ))}
        </ul>
        <div className="dc-nav-end">
          <div ref={orderRef} className={`sg-order${orderOpen ? " is-open" : ""}`}>
            <button type="button" className="sg-order-btn" aria-expanded={orderOpen} aria-haspopup="true" onClick={() => setOrderOpen(!orderOpen)}>
              Order Now
              <span className="sg-sub-caret" aria-hidden="true" />
            </button>
            {orderOpen ? <OptionList items={order} onPick={() => setOrderOpen(false)} /> : null}
          </div>
          <button
            type="button"
            className="dc-nav-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </nav>
    </div>
  );
}
