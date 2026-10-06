import { Footer, NavBar } from "@/components/dc";
import { locations } from "@/data/locations";

/** Page content width + gutters, shared by every page. */
export const pageContainer = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Catering", href: "/catering" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40">
      <NavBar links={navLinks} active={active} cta="Order Online" ctaHref="/locations" />
    </header>
  );
}

export function SiteFooter() {
  return (
    <Footer
      locations={locations.map((location) => ({
        city: location.name,
        address: location.address || undefined,
        phone: location.phone || undefined,
      }))}
      links={footerLinks}
    />
  );
}
