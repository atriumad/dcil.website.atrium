import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import {
  NewsletterSection,
  PageHero,
  SpecialsSection,
} from "@/components/site/sage";
import { Button } from "@/components/dc";

export const metadata: Metadata = {
  title: "Daily Specials & Happy Hour | Don Chuy's Fresh Mex & Cantina",
  description:
    "Don Chuy's daily specials and everyday happy hour drink deals — a different special every day, all day.",
};

export default function HappyHourPage() {
  return (
    <>
      <SiteHeader active="Specials" />

      <main className="sg">
        <PageHero
          title="Happy hour"
          lede="Monday through Thursday, all day: a different theme and food special each day, plus appetizer and drink deals."
          image={{
            src: "/images/photos/drink-flight-margaritas.webp",
            alt: "A flight of colorful margaritas on a serving stand",
          }}
          ctas={
            <>
              <Button size="lg" icon="arrow-right" href="/menu">
                View Menu
              </Button>
              <Button size="lg" variant="outline" href="/locations">
                Find a Location
              </Button>
            </>
          }
        />

        <SpecialsSection />

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
