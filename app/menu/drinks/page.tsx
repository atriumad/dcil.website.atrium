import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { NewsletterSection } from "@/components/site/sage";
import { drinkGroups, formatDrinkPrice } from "@/data/drinks";
import { MenuHeader } from "../menu-header";

export const metadata: Metadata = {
  title: "Drinks Menu | Don Chuy's Fresh Mex & Cantina",
  description: "Handmade signature margaritas, flights, tequila, mezcal, cocktails, beer and wine at Don Chuy's Fresh Mex & Cantina.",
};

export default function DrinksMenuPage() {
  return (
    <>
      <SiteHeader active="Menu" />

      <main className="sg">
        <MenuHeader
          current="drinks"
          eyebrow="La barra"
          title="Margaritas made from scratch"
          lede="Handmade signature margaritas, flights, tequila, mezcal and more. Happy hour pricing runs Monday through Thursday."
        />

        <div className="sg-menu-book">
          <div className="mn-bar">
            <nav className="mn-chips" aria-label="Drink categories">
              {drinkGroups.map((group) => (
                <a key={group.slug} href={`#${group.slug}`} className="mn-chip">
                  {group.name.replace(" 16 oz", "")}
                </a>
              ))}
            </nav>
          </div>

          <div className="sg-drinks">
            {drinkGroups.map((group, index) => (
              <section key={group.slug} id={group.slug} className="sg-drink-sec">
                <header className="mn-cat-head">
                  <span className="mn-cat-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mn-cat-title">{group.name}</h2>
                </header>
                {group.subhead ? <p className="sg-drink-sub">{group.subhead}</p> : null}
                {group.intro ? <p className="sg-drink-intro">{group.intro}</p> : null}
                {group.rows ? (
                  <ul className="mn-list">
                    {group.rows.map((row) => (
                      <li key={row.name} className="mn-item">
                        <div className="mn-item-head">
                          <span className="mn-item-name">{row.name}</span>
                          {row.price != null ? (
                            <>
                              <span className="mn-item-dots" aria-hidden="true" />
                              <span className="mn-item-price">{formatDrinkPrice(row.price)}</span>
                            </>
                          ) : null}
                        </div>
                        {row.description ? <p className="mn-item-desc">{row.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {group.lists ? (
                  <div className="sg-drink-lists">
                    {group.lists.map((list) => (
                      <div key={list.title ?? group.slug}>
                        {list.title ? <p className="sg-drink-list-t">{list.title}</p> : null}
                        <ul className="sg-drink-names">
                          {list.names.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
                {group.note ? <p className="sg-drink-note">{group.note}</p> : null}
                {group.callout ? (
                  <p className="sg-drink-callout sg-drink-note">
                    <strong>Did you know?</strong>
                    {group.callout}
                  </p>
                ) : null}
              </section>
            ))}
          </div>
          <p className="sg-menu-note">Drinks are not refundable. Prices and availability may vary by location.</p>
        </div>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
