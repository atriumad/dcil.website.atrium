import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Hero, Newsletter, PromoBanner, SpecialsBoard } from "@/components/dc";

export const metadata: Metadata = {
  title: "Daily Specials & Happy Hour | Don Chuy's Fresh Mex & Cantina",
  description: "Don Chuy's daily specials and everyday happy hour drink deals — a different special every day, all day.",
};

export default function HappyHourPage() {
  return (
    <>
      <SiteHeader active="Specials" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="photo"
          eyebrow="Fresh Mex & Cantina"
          script="Salud"
          title="Happy hour"
          lede="A different special every day, plus everyday drink deals — no clock-watching required."
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" }}
        />

        <div className={pageContainer}>
          <SpecialsBoard
            eyebrow={siteContent.dailySpecials.subtitle}
            title={siteContent.dailySpecials.title}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
          />
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Everyday drinks"
          title="Happy hour, every hour"
          lede="No clock-watching — these drink prices run every day, all day."
          deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
          cta="Find a Location"
          ctaHref="/locations"
        />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
