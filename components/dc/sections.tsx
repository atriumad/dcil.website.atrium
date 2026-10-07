import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { Icon, type IconName } from "./icon";
import { Pill } from "./pill";
import { cx, renderAccent, scriptWord } from "./utils";

export function PromoBanner({
  eyebrow,
  title = "Everyday drinks",
  script,
  lede,
  deals = [],
  cta,
  ctaHref = "#",
  tone = "rose",
  className,
}: {
  eyebrow?: string;
  title?: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  deals?: { name: string; price: string; icon?: IconName }[];
  cta?: string;
  ctaHref?: string;
  /** rose is the one feature block per page. */
  tone?: "rose" | "navy-900";
  className?: string;
}) {
  const word = scriptWord(script);
  return (
    <section className={cx("dc-promo", `dc-promo-${tone}`, className)}>
      <Flower variant="mono" tone="white" className="dc-promo-flower" size={null} />
      <div className="dc-promo-copy">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {word ? <span className="dc-promo-script">{word}</span> : null}
        <h2 className="dc-promo-title">{renderAccent(title)}</h2>
        {lede ? <p className="dc-promo-lede">{lede}</p> : null}
        {cta ? (
          <Button href={ctaHref} variant="ivory" icon="arrow-right">
            {cta}
          </Button>
        ) : null}
      </div>
      {deals.length ? (
        <ul className="dc-promo-deals">
          {deals.map((deal) => (
            <li key={deal.name}>
              <Icon name={deal.icon ?? "margarita"} size={24} />
              <span>{deal.name}</span>
              <b>{deal.price}</b>
            </li>
          ))}
        </ul>
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
        {comingSoon ? <Pill tone="marigold">Coming soon</Pill> : null}
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
        <Button href={href} variant="link" icon="arrow-up-right">
          {cta}
        </Button>
      ) : null}
    </article>
  );
}
