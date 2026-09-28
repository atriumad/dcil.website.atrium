import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { Footer, LocationCard, NavBar, Newsletter, SectionHeader } from "@/components/dc";

export const metadata: Metadata = {
  title: "Locations | Don Chuy's Fresh Mex & Cantina",
  description: "Find your nearest Don Chuy's Fresh Mex & Cantina — Overland Park KS, Lee's Summit MO, Johnson City TN and soon O'Fallon IL.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function LocationsPage() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <section className={`${container} py-[var(--space-7)] md:py-[var(--space-8)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your *table*"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="mt-[var(--space-7)] grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <LocationCard
                key={location.slug}
                city={location.name}
                address={location.address || undefined}
                phone={location.phone || undefined}
                hours={location.hours.map((row) => `${row.days}|${row.time}`)}
                comingSoon={location.comingSoon}
                href={`/locations/${location.slug}`}
                cta={location.comingSoon ? null : "View Location"}
              />
            ))}
          </div>
        </section>

        <div className={`${container} pb-[var(--space-8)]`}>
          <Newsletter />
        </div>
      </main>

      <Footer
        locations={locations.map((location) => ({ city: location.name, address: location.address }))}
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
