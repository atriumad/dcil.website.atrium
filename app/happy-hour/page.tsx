import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { InkButton, NewsletterSection } from "@/components/site/sage";
import { HappyHourWeek } from "@/components/site/happy-hour-board";
import { PhotoFrame } from "@/components/dc";

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
        <section className="sg-sage sg-hhhead" aria-labelledby="sg-page-title">
          <div className="sg-hhhead-copy">
            <h1 id="sg-page-title" className="sg-h2">
              Happy hour
            </h1>
            <p className="sg-body">
              Monday through Thursday, all day: a different theme and food
              special each day, plus appetizer and drink deals.
            </p>
            <div className="sg-hhhead-ctas">
              <InkButton href="/menu">View Menu</InkButton>
              <InkButton href="/locations" outline>
                Find a Location
              </InkButton>
            </div>
          </div>
          <PhotoFrame
            className="sg-hhhead-photo"
            shape="arch"
            ratio="4 / 5"
            src="/images/photos/drink-flight-margaritas.webp"
            alt="A flight of colorful margaritas on a serving stand"
            priority
            sizes="(min-width: 900px) 30vw, 70vw"
          />
        </section>

        <section className="sg-deep sg-hhweek">
          <HappyHourWeek />
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
