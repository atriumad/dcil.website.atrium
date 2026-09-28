import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { Footer, Icon, NavBar, Newsletter, SectionHeader } from "@/components/dc";
import { ContactInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | Don Chuy's Fresh Mex & Cantina",
  description: "Get in touch with Don Chuy's Fresh Mex & Cantina — reach out to your nearest location or send us a message.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function ContactPage() {
  const openLocations = locations.filter((l) => !l.comingSoon);

  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <div className={`${container} pt-10 pb-[var(--space-6)]`}>
          <SectionHeader eyebrow="Get in touch" title="We'd love to *hear* from you" lede="Reach your nearest Don Chuy's directly, or send us a message below." />
        </div>

        <div className={`${container} pb-[var(--space-7)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3`}>
          {openLocations.map((location) => (
            <div key={location.slug} className="flex flex-col gap-2 rounded-[var(--radius-lg)] border-2 border-[var(--ink)] p-[var(--space-4)]">
              <p className="label">{location.name}</p>
              <p className="dc-loc-line body">
                <Icon name="pin" size={16} />
                {location.address}
              </p>
              <p className="dc-loc-line body">
                <Icon name="phone" size={16} />
                <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
              </p>
            </div>
          ))}
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <ContactInquiryForm />
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
