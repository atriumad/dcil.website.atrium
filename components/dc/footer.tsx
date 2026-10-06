import Link from "next/link";
import type { ReactNode } from "react";
import { Logo, TileBand } from "./decor";
import { Icon } from "./icon";
import { cx, isInternal, toLink, type LinkItem } from "./utils";

export interface FooterProps {
  /** Defaults to the official logo (168px). */
  brand?: ReactNode;
  tagline?: string;
  locations?: { city: string; address?: string; phone?: string }[];
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
  social = [{ label: "Instagram", href: "https://www.instagram.com/donchuysmo/" }, "Facebook"],
  legal = "© Don Chuy's Fresh Mex & Cantina",
  className,
}: FooterProps) {
  return (
    <footer className={cx("dc-foot", className)}>
      <TileBand height={36} />
      <div className="dc-foot-top">
        {brand ?? <Logo size={168} />}
        <p className="dc-foot-tag">{tagline}</p>
      </div>
      <div className="dc-foot-grid">
        {locations.map((location) => (
          <div key={location.city} className="dc-foot-loc">
            <h4>{location.city}</h4>
            <p>{location.address || "Coming soon"}</p>
            {location.phone ? <p>{location.phone}</p> : null}
          </div>
        ))}
      </div>
      <div className="dc-foot-bottom">
        <ul className="dc-foot-links">
          {links.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>{isInternal(href) ? <Link href={href}>{label}</Link> : <a href={href}>{label}</a>}</li>
            );
          })}
        </ul>
        <ul className="dc-foot-links">
          {social.map((item) => {
            const { label, href } = toLink(item);
            return (
              <li key={label}>
                <a href={href}>
                  {label}
                  <Icon name="arrow-up-right" size={12} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="dc-foot-legal">{legal}</p>
    </footer>
  );
}
