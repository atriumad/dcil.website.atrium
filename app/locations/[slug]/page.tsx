import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";
import { Button, Footer, Icon, NavBar, Newsletter, Pill, SectionHeader } from "@/components/dc";
import { buildLocationJsonLd, locationMetaDescription, locationMetaTitle } from "@/lib/seo";

const SIGNATURE_DISH = "Steak & Lobster";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

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

      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <section className={`${container} py-[var(--space-7)] md:py-[var(--space-8)]`}>
          {location.comingSoon ? (
            <SectionHeader
              eyebrow="Coming soon"
              title={location.name}
              lede="We're not open here yet — check back soon, or visit one of our open locations in the meantime."
            />
          ) : (
            <>
              <SectionHeader eyebrow="Don Chuy's" title={location.name} lede={location.intro} />

              <div className="mt-[var(--space-6)] grid gap-[var(--space-6)] md:grid-cols-[1.1fr_.9fr]">
                <div className="flex flex-col gap-[var(--space-4)]">
                  <p className="dc-loc-line body">
                    <Icon name="pin" size={18} />
                    {location.address}
                  </p>
                  <p className="dc-loc-line body">
                    <Icon name="phone" size={18} />
                    <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
                  </p>
                  <Button href={mapsUrl(location.address)} variant="outline" icon="arrow-up-right" className="self-start">
                    Get Directions
                  </Button>

                  {location.reviews.length ? (
                    <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)]">
                      {location.reviews.map((review) => (
                        <blockquote key={review.author} className="dc-mi-featured rounded-[var(--radius-md)] p-[var(--space-4)]">
                          <p className="body italic">&ldquo;{review.quote}&rdquo;</p>
                          <cite className="label not-italic">— {review.author}</cite>
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-[var(--space-3)] rounded-[var(--radius-lg)] border-2 border-[var(--ink)] p-[var(--space-5)]">
                  <p className="label">Hours</p>
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

              {location.closing ? <p className="body-lg mt-[var(--space-6)] italic text-[var(--ink-muted)]">{location.closing}</p> : null}
            </>
          )}
        </section>

        {location.comingSoon ? (
          <section className={`${container} pb-[var(--space-7)]`}>
            <Pill tone="marigold">Coming soon</Pill>
          </section>
        ) : null}

        <div className={`${container} pb-[var(--space-8)]`}>
          <Newsletter title={location.comingSoon ? "Be the first to know" : undefined} />
        </div>
      </main>

      <Footer
        locations={locations.map((l) => ({ city: l.name, address: l.address }))}
        links={[
          { label: "Menu", href: "/menu" },
          { label: "Specials", href: "/happy-hour" },
          { label: "Catering", href: "/catering" },
          { label: "Locations", href: "/locations" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    </>
  );
}
