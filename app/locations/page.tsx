import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { LocationsSection, NewsletterSection, PageHero } from "@/components/site/sage";

export const metadata: Metadata = {
  title: "Locations | Don Chuy's Fresh Mex & Cantina",
  description: "Find your nearest Don Chuy's Fresh Mex & Cantina — Overland Park KS, Lee's Summit MO, Johnson City TN and soon O'Fallon IL.",
};

export default function LocationsPage() {
  return (
    <>
      <SiteHeader active="Locations" />

      <main className="sg">
        <PageHero
          eyebrow="Visit us"
          title="Find your table"
          lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          image={{ src: "/images/photos/interior-bar-bottles.webp", alt: "A sunlit corner of the dining room with a palm, a blue booth and talavera tile" }}
        />
        <LocationsSection bare detailLinks />
        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
