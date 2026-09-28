import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { siteContent } from "@/data/site";
import { Footer, Hero, NavBar, Newsletter, PromoBanner, SpecialsBoard } from "@/components/dc";

export const metadata: Metadata = {
  title: "Daily Specials & Happy Hour | Don Chuy's Fresh Mex & Cantina",
  description: "Don Chuy's daily specials and everyday happy hour drink deals — a different special every day, all day.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function HappyHourPage() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <div className={`${container} pt-6 md:pt-10`}>
          <Hero
            variant="poster"
            eyebrow="Fresh Mex & Cantina"
            title="HA!PPY HOUR"
            lede="A different special every day, plus everyday drink deals — no clock-watching required."
            primary="View Menu"
            primaryHref="/menu"
            secondary="Find a Location"
            secondaryHref="/locations"
          />
        </div>

        <div className={`${container} py-[var(--space-7)] md:py-[var(--space-8)]`}>
          <SpecialsBoard
            title={siteContent.dailySpecials.title}
            subtitle={siteContent.dailySpecials.subtitle}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
            plate={{ src: "/images/photos/dish-taco-in-hand.webp", alt: "A street taco held up, part of the 3 tacos daily special" }}
          />
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <PromoBanner
            tone="marigold"
            kicker="Everyday drinks"
            title="HAPPY *hour*, every hour"
            lede="No clock-watching — these drink prices run every day, all day."
            deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
            cta="Find a Location"
            ctaHref="/locations"
          />
        </div>

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
