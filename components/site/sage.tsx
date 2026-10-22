import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { locations, telHref } from "@/data/locations";
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

/** Inner-page hero on a full-bleed photo under a deep scrim, copy bottom-left on the page wrap. Built for the floating header (`SiteHeader overlay`). */
export function PhotoHero({
  title,
  lede,
  image,
  ctas,
}: {
  title: string;
  lede?: string;
  image: Img;
  ctas?: ReactNode;
}) {
  return (
    <section className="sg-phoh" aria-labelledby="sg-page-title">
      <Image
        className="sg-phoh-img"
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        quality={80}
        style={image.focus ? { objectPosition: image.focus } : undefined}
      />
      <span className="sg-phoh-scrim" aria-hidden="true" />
      <div className="sg-phoh-copy">
        <h1 id="sg-page-title" className="sg-phoh-title">
          {title}
        </h1>
        {lede ? <p className="sg-phoh-lede">{lede}</p> : null}
        {ctas ? <div className="sg-phoh-ctas">{ctas}</div> : null}
      </div>
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
  eyebrow?: string;
  title: string;
  body: string;
  image: Img;
  action?: ReactNode;
  flip?: boolean;
}) {
  return (
    <section className={flip ? "sg-sage sg-duo is-flip" : "sg-sage sg-duo"}>
      <div className="sg-duo-copy sg-reveal">
        {eyebrow ? <LightEyebrow>{eyebrow}</LightEyebrow> : null}
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
      <Pattern
        name="talavera-tile"
        tone="navy-900"
        size={80}
        className="sg-fill sg-specials-tile"
      />
      <div className="sg-card sg-reveal">
        <div className="sg-card-in">
          <TileBand height={28} rules={false} />
          <div className="sg-card-body">
            <h2 className="sg-h2 sg-on-dark sg-center">Happy hour</h2>
            <p className="sg-hh-when">Monday – Thursday · all day</p>
            <HappyHourBoard />
          </div>
          <TileBand height={28} rules={false} />
        </div>
      </div>
    </section>
  );
}

const stateNames: Record<string, string> = {
  KS: "Kansas",
  MO: "Missouri",
  TN: "Tennessee",
  IL: "Illinois",
};

/** Card photo per location; only O'Fallon has its own so far, the rest are placeholders. */
const locationPhotos: Record<string, Img> = {
  "overland-park-ks": {
    src: "/images/photos/interior-bar-bottles.webp",
    alt: "A sunlit corner of the dining room with a palm, a blue booth and talavera tile",
  },
  "lees-summit-mo": {
    src: "/images/photos/detail-talavera-cup-flowers.webp",
    alt: "A hand holding a talavera-painted cup with a salted rim beside purple orchids",
  },
  "johnson-city-tn": {
    src: "/images/photos/interior-stone-lion.webp",
    alt: "A carved stone lion statue at the restaurant entrance",
  },
  "ofallon-il": {
    src: "/images/ofallon/old-fashioned.webp",
    alt: "An old fashioned garnished with orange and a cherry on the bar",
  },
};

/** Locations as tall photo cards: state label and city centred over the photo, address and hours at the foot. Each card links to the location's own page. */
export function LocationsSection({
  eyebrow,
  title = "Find your table",
  lede = "Four restaurants, one family. Come for the food, stay for the fun!",
  bare,
  id,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** Omit the heading (pages whose hero already carries the title). */
  bare?: boolean;
  id?: string;
}) {
  // Bare lists sit right under the page h1, so cities are h2 there.
  const CityHeading = bare ? "h2" : "h3";
  return (
    <section
      id={id}
      className={bare ? "sg-sage sg-locs is-bare" : "sg-sage sg-locs"}
    >
      {bare ? null : (
        <header className="sg-locs-head sg-reveal">
          {eyebrow ? <LightEyebrow>{eyebrow}</LightEyebrow> : null}
          <h2 className="sg-h2">{title}</h2>
          <p className="sg-body">{lede}</p>
        </header>
      )}
      <ul className="sg-locs-list">
        {locations.map((location) => {
          const photo = locationPhotos[location.slug];
          const state = stateNames[location.name.split(", ")[1]] ?? "";
          const city = location.name.split(", ")[0];
          return (
            <li key={location.slug} className="sg-loc sg-reveal">
              {/* The city link stretches over the card; the phone link sits above it so both are real, separate links. */}
              <div className="sg-loc-card">
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1000px) 290px, (min-width: 640px) 50vw, 100vw"
                    quality={75}
                  />
                ) : null}
                <span className="sg-loc-scrim" aria-hidden="true" />
                <div className="sg-loc-top">
                  <p className="sg-loc-state">{state}</p>
                  <CityHeading className="sg-loc-city">
                    <Link
                      className="sg-loc-link"
                      aria-label={location.name}
                      href={`/locations/${location.slug}`}
                    >
                      {city}
                    </Link>
                  </CityHeading>
                  {location.comingSoon ? (
                    <span className="sg-loc-soon">Coming soon</span>
                  ) : null}
                </div>
                <div className="sg-loc-foot">
                  {location.address ? (
                    <p className="sg-loc-addr">{location.address}</p>
                  ) : null}
                  {location.phone ? (
                    <p className="sg-loc-phone">
                      <a href={telHref(location.phone)}>{location.phone}</a>
                    </p>
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
                </div>
              </div>
            </li>
          );
        })}
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
