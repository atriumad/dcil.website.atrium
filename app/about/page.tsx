import type { Metadata } from "next";
import Image from "next/image";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import {
  DuoSection,
  InkButton,
  NewsletterSection,
  PhotoHero,
} from "@/components/site/sage";

export const metadata: Metadata = {
  title: "About Us | Don Chuy's Fresh Mex & Cantina",
  description:
    "Family recipes from León, Mexico, brought to Kansas City, Lee's Summit and Johnson City with fresh ingredients and Josper-grilled flavor.",
};

// The about copy in siteContent is one paragraph; its first two sentences are the story, the rest is the sign-off.
const [roots, today] = siteContent.about.body.split(/(?<=\.)\s+/);

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="About" overlay />

      <main className="sg">
        <PhotoHero
          title="Family roots, big flavor"
          lede={siteContent.taglines[0]}
          image={{
            src: "/images/photos/interior-eagle-mural.webp",
            alt: "Colorful eagle mural on a brick wall inside the restaurant",
            focus: "50% 38%",
          }}
        />

        <DuoSection
          title="Recipes from León, Mexico"
          body={`${roots} ${today}`}
          image={{
            src: "/images/photos/interior-hanging-flowers.webp",
            alt: "Red flowers and greenery hanging from the dining room ceiling",
          }}
        />

        <section className="sg-deep sg-grill">
          <Image
            src="/images/photos/dish-carne-asada-cutting.webp"
            alt="Carving carne asada on a sizzling platter"
            fill
            sizes="100vw"
            quality={80}
            className="sg-grill-img"
          />
          <span className="sg-grill-scrim" aria-hidden="true" />
          <div className="sg-grill-in sg-reveal">
            <h2 className="sg-h2 sg-on-dark">{siteContent.taglines[1]}</h2>
            <p className="sg-body sg-on-dark">
              Smoky char, bold flavor, made to order — every dish comes straight
              from our Josper grill to your table.
            </p>
          </div>
        </section>

        <DuoSection
          flip
          title="Come as guests. Leave as family."
          body={siteContent.taglines[2]}
          image={{
            src: "/images/photos/table-spread.webp",
            alt: "A table spread with shared plates, a beer and a margarita",
          }}
          action={
            <div className="sg-hhhead-ctas">
              <InkButton href="/locations">Find a Location</InkButton>
              <InkButton href="/menu" outline>
                View Menu
              </InkButton>
            </div>
          }
        />

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
