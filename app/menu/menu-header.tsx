import Link from "next/link";
import type { ReactNode } from "react";

/** Sage header shared by the food and drinks menus, with the Food | Drinks switch. */
export function MenuHeader({ current, title, lede }: { current: "food" | "drinks"; title: string; lede: ReactNode }) {
  return (
    <header className="sg-sage sg-menu-head">
      <h1 className="sg-h2">{title}</h1>
      <p className="sg-body">{lede}</p>
      <nav className="sg-menu-tabs" aria-label="Menus">
        <Link href="/menu" className="sg-menu-tab" aria-current={current === "food" ? "page" : undefined}>
          Food
        </Link>
        <Link href="/menu/drinks" className="sg-menu-tab" aria-current={current === "drinks" ? "page" : undefined}>
          Drinks
        </Link>
      </nav>
    </header>
  );
}
