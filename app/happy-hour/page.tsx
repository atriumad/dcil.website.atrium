import type { Metadata } from "next";
import { promoDeals } from "@/data/happy-hour";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { DuoSection, InkButton, NewsletterSection, PageHero, SpecialsSection } from "@/components/site/sage";
import { Button, PromoBanner } from "@/components/dc";

export const metadata: Metadata = {
  title: "Daily Specials & Happy Hour | Don Chuy's Fresh Mex & Cantina",
  description: "Don Chuy's daily specials and everyday happy hour drink deals — a different special every day, all day.",
};

export default function HappyHourPage() {
  return (
    <>
      <SiteHeader active="Specials" />

      <main className="sg">
        <PageHero
          eyebrow="Fresh Mex & Cantina"
          title="Happy hour"
          lede="Monday through Thursday, all day: a different theme and food special each day, plus appetizer and drink deals."
          image={{ src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" }}
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

        <DuoSection
          flip
          eyebrow="Salud"
          title="Every weekday has its own special"
          body="Margaritas and martinis, tacos, whiskey and mezcal, and Ladies Night — each day from Monday to Thursday has its own theme, plus appetizer and drink deals that stay the same all week."
          image={{ src: "/images/photos/drink-cocktail-toast.webp", alt: "Two cocktails raised in a toast" }}
          action={<InkButton href="/locations">Find a Location</InkButton>}
        />

        <SpecialsSection image={{ src: "/images/photos/drink-smoked-cocktail.webp", alt: "A smoked cocktail on the bar" }} />

        <section className="sg-promo">
          <PromoBanner
            tone="rose"
            eyebrow="Monday – Thursday"
            title="Happy hour, all day"
            lede="Drink and appetizer deals from open to close — no clock-watching."
            deals={promoDeals}
            cta="Find a Location"
            ctaHref="/locations"
          />
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
