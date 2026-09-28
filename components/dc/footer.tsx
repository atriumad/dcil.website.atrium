import Link from "next/link";
import type { ReactNode } from "react";
import { TileBand } from "./decor";
import { Icon } from "./icon";
import { cx, toLink, type LinkItem } from "./utils";

export interface FooterProps {
  brand?: ReactNode;
  tagline?: string;
  locations?: { city: string; address?: string }[];
  links?: Array<string | LinkItem>;
  social?: Array<string | LinkItem>;
  legal?: string;
  className?: string;
}

export function Footer({
  brand,
  tagline = "Fresh Mex & Cantina",
  locations = [],
  links = ["Menu", "Specials", "Happy Hour", "Catering", "Careers", "Contact"],
  social = ["Instagram", "Facebook"],
  legal = "© Don Chuy's Fresh Mex & Cantina",
  className,
}: FooterProps) {
  return (
    <footer className={cx("dc-foot", className)}>
      <TileBand tone="marigold" height={40} edge="none" className="dc-foot-band" />
      <div className="dc-foot-grid">
        <div className="dc-foot-brand">
          {brand ?? <span className="dc-foot-wordmark">Don Chuy&apos;s</span>}
          <p className="dc-foot-tag">{tagline}</p>
          <div className="dc-foot-social">
            {social.map((item) => {
              const { label, href } = toLink(item);
              return (
                <a key={label} href={href}>
                  {label}
                  <Icon name="arrow-up-right" size={14} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="dc-foot-col">
          <h4>Visit us</h4>
          <ul>
            {locations.map((location) => (
              <li key={location.city}>
                <b>{location.city}</b>
                <span>{location.address || "Coming soon"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dc-foot-col">
          <h4>Explore</h4>
          <ul>
            {links.map((item) => {
              const { label, href } = toLink(item);
              return (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="dc-foot-legal">{legal}</p>
    </footer>
  );
}
