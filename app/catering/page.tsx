import type { Metadata } from "next";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import { FeatureSplit, Newsletter } from "@/components/dc";
import { CateringInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Catering | Don Chuy's Fresh Mex & Cantina",
  description: "Bring Don Chuy's Fresh Mex & Cantina to your next event — request a catering quote.",
};

export default function CateringPage() {
  return (
    <>
      <SiteHeader active="Catering" />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <FeatureSplit
          tone="navy-900"
          shape="frame"
          eyebrow="Catering & events"
          title="Let us bring Don Chuy's to your table"
          body="From sizzling specials to family favorites, we can cater your next get-together. Tell us about your event and a location near you will follow up with details."
          image={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table", focus: "50% 60%" }}
        />

        <div className={pageContainer}>
          <CateringInquiryForm />
        </div>

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
