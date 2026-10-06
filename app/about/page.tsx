import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { FeatureSplit, Hero, Marquee, Newsletter } from "@/components/dc";

export const metadata: Metadata = {
  title: "About Us | Don Chuy's Fresh Mex & Cantina",
  description: "Family recipes from León, Mexico, brought to Kansas City, Lee's Summit and Johnson City with fresh ingredients and Josper-grilled flavor.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="About" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="split"
          eyebrow="Nuestra historia"
          title="Family *roots*, big flavor"
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/dish-shrimp-paella-modelo.webp", alt: "Shrimp ceviche served on a paella pan with Modelo bottles" }}
        />

        <FeatureSplit
          tone="navy-900"
          eyebrow={siteContent.taglines[0]}
          title="Come as guests. Leave as family."
          body={siteContent.about.body}
          image={{ src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant", focus: "50% 35%" }}
        />

        <Marquee items={[...siteContent.taglines]} />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
