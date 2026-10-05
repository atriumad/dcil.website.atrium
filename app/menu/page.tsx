import type { Metadata } from "next";
import { menu } from "@/data/menu";
import { locations } from "@/data/locations";
import { Footer, NavBar, Newsletter, PromoBanner, SectionHeader } from "@/components/dc";
import { MenuBrowser } from "./menu-filter";

export const metadata: Metadata = {
  title: "Menu | Don Chuy's Fresh Mex & Cantina",
  description: "Browse the full Don Chuy's menu — tacos, fajitas, mariscos, steaks and more, Josper-grilled and made fresh.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function MenuPage() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <div className={`${container} pt-10 pb-[var(--space-6)]`}>
          <SectionHeader
            size="m"
            eyebrow="La comida"
            title="What are *you* craving?"
            lede="Every dish is Josper-grilled and made fresh. Jump to a section or search for a favorite."
          />
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <MenuBrowser categories={menu} />
          <p className="small mt-[var(--space-6)] text-[var(--ink-muted)]">
            Prices and availability may vary by location.
          </p>
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <PromoBanner
            tone="rose"
            kicker="Planning something bigger?"
            title="CATERING *for* your crowd"
            lede="From office lunches to family celebrations, let us bring the Don Chuy's spread to you."
            cta="Get a Quote"
            ctaHref="/catering"
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
