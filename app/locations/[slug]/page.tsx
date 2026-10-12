import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { instagramHref, locations, orderHref, telHref } from "@/data/locations";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { OpenNow } from "@/components/site/open-now";
import { InkButton, NewsletterSection, PageHero } from "@/components/site/sage";
import { Button, Icon } from "@/components/dc";
import { buildLocationJsonLd, locationMetaDescription, locationMetaTitle } from "@/lib/seo";

const SIGNATURE_DISH = "Steak & Lobster";

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
                  {location.instagram ? (
                    <li>
                      <Icon name="instagram" size={18} />
                      <a
                        href={instagramHref(location)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{location.instagram}
                      </a>
                    </li>
                  ) : null}
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
