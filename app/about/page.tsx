import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { siteContent } from "@/data/site";
import { FeatureSplit, Footer, Hero, Marquee, NavBar, Newsletter } from "@/components/dc";

export const metadata: Metadata = {
  title: "About Us | Don Chuy's Fresh Mex & Cantina",
  description: "Family recipes from León, Mexico, brought to Kansas City, Lee's Summit and Johnson City with fresh ingredients and Josper-grilled flavor.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function AboutPage() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <div className={`${container} pt-6 md:pt-10`}>
          <Hero
            eyebrow="Nuestra historia"
            title="Family *roots*, big flavor"
            primary="View Menu"
            primaryHref="/menu"
            secondary="Find a Location"
            secondaryHref="/locations"
            image={{ src: "/images/photos/dish-shrimp-paella-modelo.webp", alt: "Shrimp ceviche served on a paella pan with Modelo bottles" }}
          />
        </div>

        <div className={`${container} pb-[var(--space-7)] md:pb-[var(--space-8)]`}>
          <FeatureSplit
            eyebrow={siteContent.taglines[0]}
            title="Come as *guests*. Leave as family."
            body={siteContent.about.body}
            image={{ src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant", focus: "50% 35%" }}
          />
        </div>

        <div className="mb-[var(--space-7)] md:mb-[var(--space-8)]">
          <Marquee tone="agave" items={[...siteContent.taglines]} />
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
