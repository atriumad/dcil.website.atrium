import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { LocationCard, Newsletter, SectionHeader } from "@/components/dc";

export const metadata: Metadata = {
  title: "Locations | Don Chuy's Fresh Mex & Cantina",
  description: "Find your nearest Don Chuy's Fresh Mex & Cantina — Overland Park KS, Lee's Summit MO, Johnson City TN and soon O'Fallon IL.",
};

export default function LocationsPage() {
  return (
    <>
      <SiteHeader active="Locations" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <section className={`${pageContainer} flex flex-col gap-[var(--space-7)] pt-[var(--space-7)] md:pt-[var(--space-8)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your table"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
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

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
