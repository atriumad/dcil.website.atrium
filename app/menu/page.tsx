import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { NewsletterSection } from "@/components/site/sage";
import { PromoBanner } from "@/components/dc";
import { MenuBrowser } from "./menu-filter";
import { MenuHeader } from "./menu-header";

export const metadata: Metadata = {
  title: "Menu | Don Chuy's Fresh Mex & Cantina",
  description: "Browse the full Don Chuy's menu — tacos, fajitas, mariscos, steaks and more, Josper-grilled and made fresh.",
};

export default function MenuPage() {
  return (
    <>
      <SiteHeader active="Menu" />

      <main className="sg">
        <MenuHeader
          current="food"
          title="What are you craving?"
          lede="Every dish is Josper-grilled and made fresh. Jump to a section to find a favorite."
        />

        <div className="sg-menu-book">
          <MenuBrowser categories={menu} />
          <p className="sg-menu-note">
            Prices and availability may vary by location. Consuming raw or undercooked meat, poultry, eggs or shellfish may increase your risk of foodborne illness.
          </p>
        </div>

        <section className="sg-promo">
          <PromoBanner
            tone="rose"
            title="Catering for your crowd"
            lede="From office lunches to family celebrations, let us bring the Don Chuy's spread to you."
            cta="Get a Quote"
            ctaHref="/contact?type=catering"
          />
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
