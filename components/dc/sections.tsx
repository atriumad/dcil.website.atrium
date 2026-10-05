import type { CSSProperties } from "react";
import { Button } from "./button";
import { Pattern, type ColorToken } from "./decor";
import { Icon, type IconName } from "./icon";
import { PhotoFrame } from "./photo-frame";
import { Pill } from "./pill";
import { SectionHeader } from "./section-header";
import { cx, renderAccent, type Img } from "./utils";

export function FeatureSplit({
  eyebrow,
  title,
  body,
  cta,
  ctaHref = "#",
  image,
  reverse,
  ground,
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string | string[];
  cta?: string;
  ctaHref?: string;
  image?: Img;
  reverse?: boolean;
  ground?: ColorToken;
  className?: string;
}) {
  const paragraphs = (Array.isArray(body) ? body : [body]).filter(Boolean);
  const groundVar = ground ? ({ "--dc-ground": `var(--${ground})` } as CSSProperties) : undefined;
  return (
    <section className={cx("dc-feat", reverse && "dc-feat-reverse", className)} style={groundVar}>
      <div className="dc-feat-media">
        <PhotoFrame src={image?.src} alt={image?.alt} focus={image?.focus} shape="rounded" ratio="5 / 4" sizes="(min-width: 1240px) 620px, (min-width: 860px) 45vw, 90vw" />
      </div>
      <div className="dc-feat-copy">
        <SectionHeader eyebrow={eyebrow} title={title} size="m" />
        {paragraphs.map((text, i) => (
          <p key={i} className="dc-feat-body">
            {text}
          </p>
        ))}
        {cta ? (
          <Button href={ctaHref} variant="agave" icon="arrow-right">
            {cta}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export function PromoBanner({
  kicker,
  title = "HAPPY *hour*",
  lede,
  deals = [],
  cta = "See Happy Hour",
  ctaHref = "#",
  tone = "marigold",
  className,
}: {
  kicker?: string;
  title?: string;
  lede?: string;
  deals?: { name: string; price: string; icon?: IconName }[];
  cta?: string;
  ctaHref?: string;
  tone?: "marigold" | "rose";
  className?: string;
}) {
  return (
    <section className={cx("dc-promo", `dc-promo-${tone}`, className)}>
      <Pattern name="doodles" tone={tone === "marigold" ? "marigold-700" : "rose-100"} className="dc-promo-doodles" size={220} />
      <div className="dc-promo-copy">
        {kicker ? (
          <Pill tone={tone === "marigold" ? "ink" : "marigold"} icon="clock">
            {kicker}
          </Pill>
        ) : null}
        <h2 className="dc-promo-title">{renderAccent(title)}</h2>
        {lede ? <p className="dc-promo-lede">{lede}</p> : null}
      </div>
      {deals.length ? (
        <ul className="dc-promo-deals">
          {deals.map((deal) => (
            <li key={deal.name}>
              <Icon name={deal.icon ?? "margarita"} size={28} />
              <span>{deal.name}</span>
              <b>{deal.price}</b>
            </li>
          ))}
        </ul>
      ) : null}
      {cta ? (
        <Button href={ctaHref} size="lg" variant={tone === "marigold" ? "ink" : "cream"} icon="arrow-right" className="dc-promo-cta">
          {cta}
        </Button>
      ) : null}
    </section>
  );
}

export interface LocationCardProps {
  city: string;
  address?: string;
  phone?: string;
  /** "Days|Times" strings, e.g. "Mon–Thu|11am–10pm". */
  hours?: string[];
  comingSoon?: boolean;
  href?: string;
  cta?: string | null;
  className?: string;
}

export function LocationCard({
  city,
  address,
  phone,
  hours = [],
  comingSoon,
  href = "#",
  cta = "Get Directions",
  className,
}: LocationCardProps) {
  return (
    <article className={cx("dc-loc", comingSoon && "dc-loc-soon", className)}>
      <header className="dc-loc-head">
        <h3 className="dc-loc-city">{city}</h3>
        {comingSoon ? (
          <Pill tone="marigold" size="sm">
            Coming soon
          </Pill>
        ) : (
          <Icon name="pin" size={22} className="dc-loc-pin" />
        )}
      </header>
      {address ? (
        <p className="dc-loc-line">
          <Icon name="pin" size={16} />
          {address}
        </p>
      ) : null}
      {phone ? (
        <p className="dc-loc-line">
          <Icon name="phone" size={16} />
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
        </p>
      ) : null}
      {hours.length ? (
        <ul className="dc-loc-hours">
          {hours.map((row) => {
            const [days, time] = row.split("|");
            return (
              <li key={row}>
                <span>{days}</span>
                <span>{time}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {cta && !comingSoon ? (
        <Button href={href} variant="outline" size="sm" icon="arrow-up-right">
          {cta}
        </Button>
      ) : null}
    </article>
  );
}
