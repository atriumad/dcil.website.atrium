import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { NewsletterSection, PageHero } from "@/components/site/sage";
import { ContactInquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Contact Us | Don Chuy's Fresh Mex & Cantina",
  description: "Get in touch with Don Chuy's Fresh Mex & Cantina — reach out to your nearest location or send us a message.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main className="sg">
        <PageHero
          title="We'd love to hear from you"
          lede="Please contact us with any questions on special events you are planning, catering for large groups, or anything else that comes to mind."
        />

        <section className="sg-sage sg-formsec">
          <div className="sg-formsec-card sg-frame sg-reveal">
            <div className="sg-formsec-head">
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
