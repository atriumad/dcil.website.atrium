import { Footer } from "@/components/dc";
import { locations, orderHref } from "@/data/locations";
import { MobileBar } from "./mobile-bar";
import { SiteNav, type SiteNavLink } from "./site-nav";

/** Page content width + gutters, shared by every page. */
export const pageContainer =
  "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

const navLinks: SiteNavLink[] = [
  { label: "Menu", href: "/menu" },
  { label: "Happy Hour", href: "/happy-hour" },
  {
    label: "Locations",
    href: "/locations",
    children: locations.map((location) => ({
      label: location.name,
      href: `/locations/${location.slug}`,
      note: location.comingSoon ? "Coming soon" : undefined,
    })),
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** ChowNow where a location has it (Overland Park), tap-to-call everywhere else. */
const orderOptions = locations
  .filter((location) => !location.comingSoon)
  .map((location) => {
    const chowNow = location.orderUrl.startsWith("http");
    return {
      label: location.name,
      href: orderHref(location),
      note: chowNow ? "Order online" : `Call ${location.phone}`,
      external: true,
    };
  });

const footerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Happy Hour", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const footerSocial = [
  { label: "Facebook", href: "https://www.facebook.com/DonchuysLS" },
  { label: "Instagram", href: "https://www.instagram.com/donchuysmo/" },
];

export function SiteHeader({ active, overlay }: { active?: string; overlay?: boolean }) {
  return (
    <header className={overlay ? "fixed inset-x-0 top-0 z-40" : "sticky top-0 z-40"}>
      <SiteNav links={navLinks} active={active} order={orderOptions} overlay={overlay} />
    </header>
  );
}

export function SiteFooter() {
  return (
    <>
      <Footer
        locations={locations.map((location) => ({
          city: location.name,
          address: location.address || undefined,
          phone: location.phone || undefined,
          hours: location.hours.map((row) => `${row.days} ${row.time}`),
        }))}
        links={footerLinks}
        social={footerSocial}
        legal={`© ${new Date().getFullYear()} Don Chuy's Fresh Mex & Cantina. All rights reserved.`}
      />
      <MobileBar watch=".sg-hero, .sg-phero, .sg-phoh" />
    </>
  );
}
