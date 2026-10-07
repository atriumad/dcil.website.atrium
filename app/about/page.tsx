import type { Metadata } from "next";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import {
  DuoSection,
  InkButton,
  NewsletterSection,
  PageHero,
} from "@/components/site/sage";

export const metadata: Metadata = {
  title: "About Us | Don Chuy's Fresh Mex & Cantina",
  description:
    "Family recipes from León, Mexico, brought to Kansas City, Lee's Summit and Johnson City with fresh ingredients and Josper-grilled flavor.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="About" />

      <main className="sg">
        <PageHero
          title="Family roots, big flavor"
          image={{
            src: "/images/photos/dish-shrimp-paella-modelo.webp",
            alt: "Shrimp ceviche served on a paella pan with Modelo bottles",
          }}
        />

        <DuoSection
          title="Come as guests. Leave as family."
          body={siteContent.about.body}
          image={{
            src: "/images/photos/interior-eagle-mural.webp",
            alt: "Colorful eagle mural on a brick wall inside the restaurant",
            focus: "50% 35%",
          }}
          action={<InkButton href="/locations">Find a Location</InkButton>}
        />

        <section className="sg-tags">
          <ul className="sg-tags-list">
            {siteContent.taglines.map((line) => (
              <li key={line} className="sg-reveal">
                <p className="sg-h3">{line}</p>
              </li>
            ))}
          </ul>
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
