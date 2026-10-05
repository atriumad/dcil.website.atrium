import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { Footer, FeatureSplit, NavBar, Newsletter } from "@/components/dc";
import { CateringInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Catering | Don Chuy's Fresh Mex & Cantina",
  description: "Bring Don Chuy's Fresh Mex & Cantina to your next event — request a catering quote.",
};

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

export default function CateringPage() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <div className={`${container} pt-6 md:pt-10`}>
          <FeatureSplit
            eyebrow="Catering & events"
            title="Let us bring *Don Chuy's* to your table"
            body="From sizzling specials to family favorites, we can cater your next get-together. Tell us about your event and a location near you will follow up with details."
            image={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table", focus: "50% 60%" }}
          />
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <CateringInquiryForm />
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
