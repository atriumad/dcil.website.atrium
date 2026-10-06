import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Newsletter, PromoBanner, SectionHeader } from "@/components/dc";
import { MenuBrowser } from "./menu-filter";

export const metadata: Metadata = {
  title: "Menu | Don Chuy's Fresh Mex & Cantina",
  description: "Browse the full Don Chuy's menu — tacos, fajitas, mariscos, steaks and more, Josper-grilled and made fresh.",
};

export default function MenuPage() {
  return (
    <>
      <SiteHeader active="Menu" />

      <main className="flex flex-1 flex-col gap-[var(--space-7)]">
        <div className={`${pageContainer} pt-[var(--space-7)]`}>
          <SectionHeader
            size="m"
            eyebrow="La comida"
            title="What are you craving?"
            lede="Every dish is Josper-grilled and made fresh. Jump to a section or search for a favorite."
          />
        </div>

        <div className={pageContainer}>
          <MenuBrowser categories={menu} />
          <p className="small mt-[var(--space-6)]">Prices and availability may vary by location.</p>
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Planning something bigger?"
          title="Catering for your crowd"
          lede="From office lunches to family celebrations, let us bring the Don Chuy's spread to you."
          cta="Get a Quote"
          ctaHref="/catering"
        />

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
