import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import {
  LocationsSection,
  NewsletterSection,
  PageHero,
} from "@/components/site/sage";

export const metadata: Metadata = {
  title: "Locations | Don Chuy's Fresh Mex & Cantina",
  description:
    "Find your nearest Don Chuy's Fresh Mex & Cantina — Overland Park KS, Lee's Summit MO, Johnson City TN and O'Fallon IL.",
};

export default function LocationsPage() {
  return (
    <>
      <SiteHeader active="Locations" />

      <main className="sg">
        <PageHero
          title="Find your table"
          lede="Four restaurants, one family. Come for the food, stay for the fun!"
          image={{
            src: "/images/photos/drink-pink-margarita-talavera.webp",
            alt: "A pink hibiscus margarita with a blue-rimmed glass and dried orange",
          }}
        />
        <LocationsSection bare />
        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
