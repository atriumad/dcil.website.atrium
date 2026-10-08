import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locations, orderHref, telHref } from "@/data/locations";
import { locationDishes } from "@/data/featured-dishes";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { OpenNow } from "@/components/site/open-now";
import { InkButton, NewsletterSection, PageHero } from "@/components/site/sage";
import { Button, Icon, PhotoFrame } from "@/components/dc";
import { buildLocationJsonLd, locationMetaDescription, locationMetaTitle } from "@/lib/seo";

const SIGNATURE_DISH = "Steak & Lobster";

// Shared photo set until per-location photography arrives (the guide pulls originals from Atrium).
const gallery = [
  { src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant" },
  { src: "/images/photos/interior-hanging-flowers.webp", alt: "Red flowers and greenery hanging from the dining room ceiling" },
  { src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" },
  { src: "/images/photos/dish-steak-plate-wide.webp", alt: "A grilled steak plate" },
  { src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand" },
  { src: "/images/photos/interior-bar-bottles.webp", alt: "A sunlit corner of the dining room with a palm, a blue booth and talavera tile" },
];

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) return {};
  return {
    title: locationMetaTitle(location),
    description: location.comingSoon
      ? `Don Chuy's Fresh Mex & Cantina is coming soon to ${location.name}.`
      : locationMetaDescription(location, SIGNATURE_DISH),
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) notFound();

  const jsonLd = location.comingSoon ? null : buildLocationJsonLd(location);

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}

      <SiteHeader active="Locations" />

      <main className="sg">
        {location.comingSoon ? (
          <>
            <PageHero
              title={location.name}
              lede="We're not open here yet — check back soon, or visit one of our open locations in the meantime."
            />
            <section className="sg-sage sg-detail">
              <div className="sg-detail-main">
                <InkButton href="/locations">See open locations</InkButton>
              </div>
            </section>
            <NewsletterSection title="Be the first to know" />
          </>
        ) : (
          <>
            <PageHero
              title={location.name}
              lede={location.intro}
              ctas={
                <>
                  <Button size="lg" href={orderHref(location)} icon="arrow-right">
                    Order Now
                  </Button>
                  <Button size="lg" variant="outline" href="/menu">
                    View Menu
                  </Button>
                </>
              }
            />

            <section className="sg-sage sg-detail">
              <div className="sg-detail-main sg-reveal">
                <ul className="sg-facts">
                  <li>
                    <Icon name="pin" size={18} />
                    {location.address}
                  </li>
                  <li>
                    <Icon name="phone" size={18} />
                    <a href={telHref(location.phone)}>{location.phone}</a>
                  </li>
                </ul>
                <InkButton href={mapsUrl(location.address)} outline>
                  Get Directions
                </InkButton>

                {location.reviews.length ? (
                  <div className="sg-quotes">
                    {location.reviews.map((review) => (
                      <blockquote key={review.author} className="sg-quote">
                        <p>&ldquo;{review.quote}&rdquo;</p>
                        <cite>— {review.author}</cite>
                      </blockquote>
                    ))}
                  </div>
                ) : null}

              </div>

              <div className="sg-detail-card sg-frame sg-reveal">
                <p className="dc-panel-title">Hours</p>
                <OpenNow name={location.name} hours={location.hours} />
                <ul className="sg-hours">
                  {location.hours.map((row) => (
                    <li key={row.days}>
                      <span>{row.days}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="sg-deep sg-gallery" aria-label={`Photos of Don Chuy's ${location.name}`}>
              {gallery.map((photo, i) => (
                <PhotoFrame key={photo.src} className={i === 0 ? "sg-gallery-banner" : "sg-gallery-tile"} shape="frame" ratio={i === 0 ? "21 / 9" : "1"} src={photo.src} alt={photo.alt} sizes={i === 0 ? "100vw" : "(min-width: 900px) 20vw, 50vw"} />
              ))}
            </section>

            <section className="sg-sage sg-sig">
              <header className="sg-sig-head sg-reveal">
                <h2 className="sg-h2">Order the favorites</h2>
                <p className="sg-body">A family-owned Mexican spot where authentic flavor meets warm hospitality, a delicious lunch or dinner made with heart.</p>
                <InkButton href="/menu">View Menu</InkButton>
              </header>
              <ol className="sg-feat">
                {locationDishes.map((dish, i) => (
                  <li key={dish.name} className="sg-feat-item sg-reveal">
                    <span className="sg-feat-no" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="sg-h4">{dish.name}</h3>
                      <p className="sg-small">{dish.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="sg-deep sg-mapsec">
              <div className="sg-mapsec-copy sg-reveal">
                <h2 className="sg-h2 sg-on-dark">
                  Don Chuy&rsquo;s <span className="sg-block">{location.name}</span>
                </h2>
                {location.closing ? <p className="sg-body sg-on-dark">{location.closing}</p> : null}
                <p className="sg-body sg-on-dark">{location.address}</p>
                <Button href={mapsUrl(location.address)} variant="outline" icon="arrow-up-right">
                  Get Directions
                </Button>
              </div>
              <iframe
                className="sg-map sg-reveal"
                title={`Map of Don Chuy's ${location.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`}
              />
            </section>

            <NewsletterSection />
          </>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
