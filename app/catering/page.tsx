import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { NewsletterSection, PageHero } from "@/components/site/sage";
import { Button } from "@/components/dc";
import { cateringPackages, cateringTerms } from "@/data/catering";
import { RequestForms } from "./request-forms";

export const metadata: Metadata = {
  title: "Catering & Private Parties in O'Fallon, IL | Don Chuy's Fresh Mex & Cantina",
  description:
    "Taco, enchilada, burrito and fajita bars from $16 per person. Catering for pick up or dine-in, and private dine-in parties at Don Chuy's O'Fallon, IL.",
};

export default function CateringPage() {
  return (
    <>
      <SiteHeader active="Catering" />

      <main className="sg">
        <PageHero
          eyebrow="O'Fallon, IL"
          title="Catering & private parties"
          lede="Bring Don Chuy's to your table or to your event. Available for pick up and dine-in, inside our private spaces."
          ctas={
            <>
              <Button size="lg" href="#request" icon="arrow-right">
                Request catering or a party
              </Button>
              <Button size="lg" variant="outline" disabled aria-disabled="true">
                Reservations: Coming Soon
              </Button>
            </>
          }
        />

        <section className="sg-sage sg-catmenu" aria-labelledby="catering-menu">
          <div className="sg-catmenu-head sg-reveal">
            <h2 id="catering-menu" className="sg-h3">
              Catering menu
            </h2>
            <p className="sg-body">Priced per person. Pick a bar and we&rsquo;ll set it up.</p>
          </div>
          <ul className="sg-catmenu-list">
            {cateringPackages.map((pkg) => (
              <li key={pkg.name} className="sg-catmenu-item sg-reveal">
                <div className="sg-catmenu-price">
                  <span>${pkg.price}</span> per person
                </div>
                <h3 className="sg-catmenu-name">{pkg.name}</h3>
                <p className="sg-catmenu-serves">{pkg.serves}</p>
                <p className="sg-catmenu-inc">{pkg.includes}</p>
              </li>
            ))}
          </ul>
          <ul className="sg-catmenu-terms">
            {cateringTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </section>

        <section id="request" className="sg-deep sg-formsec" aria-labelledby="request-title">
          <div className="sg-formsec-card sg-frame sg-reveal">
            <div className="sg-formsec-head">
              <h2 id="request-title" className="sg-h3 sg-on-dark">
                Plan your event
              </h2>
              <p className="sg-body sg-on-dark">Tell us the details and O&rsquo;Fallon will get back to you to confirm.</p>
            </div>
            <RequestForms />
          </div>
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
