import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { Icon, Newsletter, SectionHeader } from "@/components/dc";
import { ContactInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | Don Chuy's Fresh Mex & Cantina",
  description: "Get in touch with Don Chuy's Fresh Mex & Cantina — reach out to your nearest location or send us a message.",
};

export default function ContactPage() {
  const openLocations = locations.filter((l) => !l.comingSoon);

  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-[var(--space-7)]">
        <div className={`${pageContainer} pt-[var(--space-7)]`}>
          <SectionHeader eyebrow="Get in touch" title="We'd love to hear from you" lede="Reach your nearest Don Chuy's directly, or send us a message below." />
        </div>

        <div className={`${pageContainer} grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3`}>
          {openLocations.map((location) => (
            <div key={location.slug} className="dc-panel">
              <p className="dc-panel-title">{location.name}</p>
              <p className="dc-loc-line">
                <Icon name="pin" size={16} />
                {location.address}
              </p>
              <p className="dc-loc-line">
                <Icon name="phone" size={16} />
                <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
              </p>
            </div>
          ))}
        </div>

        <div className={pageContainer}>
          <ContactInquiryForm />
        </div>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
