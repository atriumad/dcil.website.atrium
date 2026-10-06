import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Button, Icon, Newsletter, Pill, SectionHeader } from "@/components/dc";
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

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <section className={`${pageContainer} pt-[var(--space-7)] md:pt-[var(--space-8)]`}>
          {location.comingSoon ? (
            <div className="flex flex-col items-start gap-[var(--space-5)]">
              <SectionHeader
                eyebrow="Coming soon"
                title={location.name}
                lede="We're not open here yet — check back soon, or visit one of our open locations in the meantime."
              />
              <Pill tone="marigold">Coming soon</Pill>
            </div>
          ) : (
            <>
              <SectionHeader eyebrow="Don Chuy's" title={location.name} lede={location.intro} />

              <div className="mt-[var(--space-6)] grid gap-[var(--space-6)] md:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col gap-[var(--space-4)]">
                  <p className="dc-loc-line">
                    <Icon name="pin" size={18} />
                    {location.address}
                  </p>
                  <p className="dc-loc-line">
                    <Icon name="phone" size={18} />
                    <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
                  </p>
                  <Button href={mapsUrl(location.address)} variant="outline" icon="arrow-up-right" className="self-start">
                    Get Directions
                  </Button>

                  {location.reviews.length ? (
                    <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-5)]">
                      {location.reviews.map((review) => (
                        <blockquote key={review.author} className="dc-quote">
                          <p>&ldquo;{review.quote}&rdquo;</p>
                          <cite>— {review.author}</cite>
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="dc-panel">
                  <p className="dc-panel-title">Hours</p>
                  <ul className="dc-loc-hours">
                    {location.hours.map((row) => (
                      <li key={row.days}>
                        <span>{row.days}</span>
                        <span>{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {location.closing ? <p className="lede mt-[var(--space-6)]">{location.closing}</p> : null}
            </>
          )}
        </section>

        <Newsletter title={location.comingSoon ? "Be the first to know" : undefined} />
      </main>

      <SiteFooter />
    </>
  );
}
