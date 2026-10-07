import Link from "next/link";
import type { ReactNode } from "react";
import { locations } from "@/data/locations";
import {
  Eyebrow,
  Icon,
  Pattern,
  PhotoFrame,
  TileBand,
  type Img,
} from "@/components/dc";
import { HappyHourBoard } from "./happy-hour-board";
import { SgNewsletter } from "./sg-newsletter";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/** Eyebrow for sage grounds: ink rule and ink text. */
export function LightEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="sg-eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

/** Ink button/link for sage grounds (the shared Button is built for dark grounds). */
export function InkButton({
  href,
  children,
  outline,
}: {
  href: string;
  children: ReactNode;
  outline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={outline ? "sg-btn sg-btn-line" : "sg-btn sg-btn-ink"}
    >
      {children} <Icon name="arrow-right" size={16} />
    </Link>
  );
}

/** Inner-page hero: deep ground with a fading tile field, copy left, optional arch photo with an offset outline. */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  ctas,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: Img;
  ctas?: ReactNode;
}) {
  return (
    <section
      className={image ? "sg-phero has-photo" : "sg-phero"}
      aria-labelledby="sg-page-title"
    >
      <Pattern
        name="talavera-tile"
        tone="navy-700"
        size={88}
        className="sg-fill sg-phero-tile"
      />
      <div className="sg-phero-copy">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 id="sg-page-title" className="sg-phero-title">
          {title}
        </h1>
        {lede ? <p className="sg-phero-lede">{lede}</p> : null}
        {ctas ? <div className="sg-phero-ctas">{ctas}</div> : null}
      </div>
      {image ? (
        <PhotoFrame
          className="sg-phero-photo"
          shape="arch"
          outline
          ratio="4 / 5"
          src={image.src}
          alt={image.alt}
          focus={image.focus}
          priority
          sizes="(min-width: 900px) 34vw, 80vw"
        />
      ) : null}
    </section>
  );
}

/** Sage heading + body + arch photo with an offset ink outline. */
export function DuoSection({
  eyebrow,
  title,
  body,
  image,
  action,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: Img;
  action?: ReactNode;
  flip?: boolean;
}) {
  return (
    <section className={flip ? "sg-sage sg-duo is-flip" : "sg-sage sg-duo"}>
      <div className="sg-duo-copy sg-reveal">
        <LightEyebrow>{eyebrow}</LightEyebrow>
        <h2 className="sg-h2">{title}</h2>
        <p className="sg-body">{body}</p>
        {action}
      </div>
      <div className="sg-duo-photo sg-reveal">
        <PhotoFrame
          shape="arch"
          ratio="3 / 4"
          src={image.src}
          alt={image.alt}
          focus={image.focus}
          sizes="(min-width: 900px) 34vw, 80vw"
        />
      </div>
    </section>
  );
}

/** Happy hour as a menu card on a deep-2 tile wall. */
export function SpecialsSection() {
  return (
    <section className="sg-deep2 sg-specials">
      <Pattern name="talavera-tile" tone="navy-900" size={80} className="sg-fill sg-specials-tile" />
      <div className="sg-card sg-reveal">
        <div className="sg-card-in">
          <TileBand height={28} rules={false} />
          <div className="sg-card-body">
            <Eyebrow align="center">Monday – Thursday · all day</Eyebrow>
            <h2 className="sg-h2 sg-on-dark sg-center">Happy hour</h2>
            <HappyHourBoard />
          </div>
          <TileBand height={28} rules={false} />
        </div>
      </div>
    </section>
  );
}

/** Locations as a hairline two-column list on sage. `detailLinks` sends each open location to its own page instead of Google Maps. */
export function LocationsSection({
  eyebrow = "Visit us",
  title = "Find your table",
  lede = "Three restaurants open, a fourth on the way. Come for the food, stay for the fun!",
  photo,
  detailLinks,
  bare,
  id,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  photo?: Img;
  detailLinks?: boolean;
  /** Omit the heading column (pages whose hero already carries the title). */
  bare?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={bare ? "sg-sage sg-locs is-bare" : "sg-sage sg-locs"}
    >
      {bare ? null : (
        <header className="sg-locs-head sg-reveal">
          <LightEyebrow>{eyebrow}</LightEyebrow>
          <h2 className="sg-h2">{title}</h2>
          <p className="sg-body">{lede}</p>
          {photo ? (
            <PhotoFrame
              className="sg-locs-photo"
              shape="arch"
              ratio="3 / 4"
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 900px) 30vw, 90vw"
            />
          ) : null}
        </header>
      )}
      <ul className="sg-locs-list">
        {locations.map((location) => (
          <li key={location.slug} className="sg-loc sg-reveal">
            <a
              className="sg-loc-link"
              href={
                detailLinks || !location.address
                  ? `/locations/${location.slug}`
                  : mapsUrl(location.address)
              }
            >
              <h3 className="sg-loc-city">{location.name}</h3>
              {location.comingSoon ? (
                <span className="sg-loc-soon">Coming soon</span>
              ) : null}
              {location.address ? (
                <p className="sg-loc-addr">{location.address}</p>
              ) : null}
              {location.phone ? (
                <p className="sg-loc-phone">{location.phone}</p>
              ) : null}
              {location.hours.length ? (
                <dl className="sg-loc-hours">
                  {location.hours.map((row) => (
                    <div key={row.days}>
                      <dt>{row.days}</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <Icon name="arrow-up-right" size={24} className="sg-loc-arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Newsletter card straddling the sage strip and the deep foot, then a tile band into the footer. */
export function NewsletterSection({ title }: { title?: string }) {
  return (
    <>
      <section className="sg-news">
        <div className="sg-news-card sg-frame">
          <SgNewsletter title={title} />
        </div>
      </section>
      <TileBand height={36} className="sg-foot-band" />
    </>
  );
}
