import type { Metadata } from "next";
import { locations } from "@/data/locations";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { NewsletterSection, PageHero } from "@/components/site/sage";
import { Eyebrow, Icon } from "@/components/dc";
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

      <main className="sg">
        <PageHero
          eyebrow="Let's talk"
          title="We'd love to hear from you"
          lede="Please contact us with any questions on special events you are planning, catering for large groups, or anything else that comes to mind."
        />

        <section className="sg-sage sg-formsec">
          <ul className="sg-contact-list">
            {openLocations.map((location) => (
              <li key={location.slug} className="sg-reveal">
                <h2 className="sg-h4">{location.name}</h2>
                <p className="sg-facts-line">
                  <Icon name="pin" size={16} />
                  {location.address}
                </p>
                <p className="sg-facts-line">
                  <Icon name="phone" size={16} />
                  <a href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}>{location.phone}</a>
                </p>
              </li>
            ))}
          </ul>

          <div className="sg-formsec-card sg-frame sg-reveal sg-formsec-after">
            <div className="sg-formsec-head">
              <Eyebrow>Contact · catering · events</Eyebrow>
              <h2 className="sg-h3 sg-on-dark">Get in touch</h2>
            </div>
            <ContactInquiryForm />
          </div>
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
