import Image from "next/image";
import Link from "next/link";
import { homeDishes, tequilaShelf } from "@/data/featured-dishes";
import { locations } from "@/data/locations";
import { promoDeals } from "@/data/happy-hour";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { InkButton, LightEyebrow, LocationsSection, NewsletterSection, SpecialsSection } from "@/components/site/sage";
import { Button, Eyebrow, Flower, Icon, Pattern, PhotoFrame, PromoBanner, type IconName } from "@/components/dc";

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "sparkle", title: "Freshest ingredients", text: "We are proud to use the freshest ingredients in every dish we serve." },
  { icon: "agave", title: "Recipes from León", text: "Family recipes passed down through generations, from León, Mexico." },
  { icon: "flame", title: "Josper-grilled", text: "Smoky char from our Josper grill in every dish, every time." },
  { icon: "utensils", title: "Come for the fun", text: "Come for the food, stay for the fun — every visit feels like family." },
];

const categories = [
  { name: "Tacos", href: "/menu#tacos", src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand" },
  { name: "La Cevichería", href: "/menu#cevicheria", src: "/images/photos/dish-shrimp-ceviche-app.webp", alt: "Shrimp ceviche with an avocado rose" },
  { name: "Steak House", href: "/menu#steak-house", src: "/images/photos/dish-steak-plate-wide.webp", alt: "A grilled steak plate" },
  { name: "Drinks", href: "/menu#drinks", src: "/images/photos/drink-red-cocktail-bar.webp", alt: "A red margarita on the bar" },
];

const social = {
  handle: "@donchuysmo",
  href: "https://www.instagram.com/donchuysmo/",
  images: [
    { src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant" },
    { src: "/images/photos/drink-pink-margarita-talavera.webp", alt: "A pink margarita served in a blue-rimmed talavera glass" },
    { src: "/images/photos/dish-grilled-skewer-molcajete.webp", alt: "A molcajete of grilled seafood beside carne asada" },
    { src: "/images/photos/interior-stone-lion.webp", alt: "A carved stone lion statue at the restaurant entrance" },
    { src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" },
    { src: "/images/photos/dish-churros-dipping.webp", alt: "Churros with an assortment of dipping sauces" },
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="sg">
        {/* 1. HERO — looping video under a deep scrim, copy bottom-left on the header's gutter */}
        <section className="sg-hero" aria-labelledby="sg-hero-title">
          <div className="sg-hero-media" aria-hidden="true">
            <Image className="sg-hero-poster" src="/images/photos/hero-poster.webp" alt="" fill priority sizes="100vw" quality={80} />
            <video className="sg-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/images/photos/hero-poster.webp" aria-hidden="true">
              <source src="/videos/hero.webm" type="video/webm" />
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <span className="sg-hero-scrim" />
          </div>
          <div className="sg-hero-copy">
            <Eyebrow>Fresh Mex &amp; Cantina</Eyebrow>
            <h1 id="sg-hero-title" className="sg-hero-title">
              Ready for some real-deal Mexican flavor?
            </h1>
            <p className="sg-hero-lede">{siteContent.hero.subheadline}</p>
            <div className="sg-hero-ctas">
              <Button size="lg" icon="arrow-right" href="/menu">
                View Menu
              </Button>
              <Button size="lg" variant="outline" href="/locations">
                Find a Location
              </Button>
            </div>
          </div>
        </section>

        {/* 2. SAGE — statement + collage, then the four values */}
        <section className="sg-sage sg-story">
          <div className="sg-story-copy sg-reveal">
            <LightEyebrow>Desde León, Mexico</LightEyebrow>
            <h2 className="sg-h2">{siteContent.taglines[0]}</h2>
            <p className="sg-body">{siteContent.about.body}</p>
            <InkButton href="/menu">View Menu</InkButton>
          </div>
          <div className="sg-collage sg-reveal">
            <span className="sg-collage-tile" aria-hidden="true">
              <Pattern name="talavera-tile" tone="sg-tile-on-sage" size={72} className="sg-fill" />
            </span>
            <PhotoFrame
              className="sg-collage-arch"
              shape="arch"
              ratio="3 / 4"
              src="/images/photos/interior-hanging-flowers.webp"
              alt="Red flowers and greenery hanging from the dining room ceiling"
              sizes="(min-width: 900px) 30vw, 62vw"
            />
            <PhotoFrame
              className="sg-collage-circle"
              shape="circle"
              src="/images/photos/dish-shrimp-ceviche-margarita.webp"
              alt="Shrimp ceviche with an avocado rose beside a red margarita"
              sizes="(min-width: 900px) 20vw, 42vw"
            />
            <PhotoFrame
              className="sg-collage-frame"
              shape="frame"
              ratio="4 / 3"
              src="/images/photos/table-spread.webp"
              alt="A table spread with shared plates, a beer and a margarita"
              sizes="(min-width: 900px) 22vw, 46vw"
            />
          </div>
          <ul className="sg-values">
            {values.map((v, i) => (
              <li key={v.title} className="sg-value sg-reveal">
                <span className="sg-value-no">0{i + 1}</span>
                <span className="sg-medal" aria-hidden="true">
                  <Icon name={v.icon} size={24} />
                </span>
                <h3 className="sg-h4">{v.title}</h3>
                <p className="sg-small">{v.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. DEEP — fresh off the grill: tile field, arch, framed card overlapping */}
        <section className="sg-deep sg-grill">
          <div className="sg-grill-field">
            <Pattern name="talavera-tile" tone="navy-700" size={80} className="sg-fill sg-grill-tile" />
            <PhotoFrame
              className="sg-grill-photo"
              shape="arch"
              outline
              ratio="4 / 5"
              src="/images/photos/dish-carne-asada-cutting.webp"
              alt="Carving carne asada on a sizzling platter"
              sizes="(min-width: 900px) 32vw, 78vw"
            />
          </div>
          <div className="sg-grill-card sg-frame sg-reveal">
            <Flower variant="mono" tone="navy-900" size={null} className="sg-grill-flower" />
            <Eyebrow>Fast fresh &amp; delicious</Eyebrow>
            <h2 className="sg-h2 sg-on-dark">Fresh off the grill</h2>
            <p className="sg-body sg-on-dark">Smoky char, bold flavor, made to order — every dish comes straight from our Josper grill to your table.</p>
            <Button icon="arrow-right" href="/menu">
              View Menu
            </Button>
          </div>
        </section>

        {/* 4. SAGE — featured dishes: ten rows on a hairline two-column card */}
        <section className="sg-sage sg-sig">
          <header className="sg-sig-head sg-reveal">
            <div>
              <LightEyebrow>Nuestros favoritos</LightEyebrow>
              <h2 className="sg-h2">Featured dishes</h2>
            </div>
            <p className="sg-body">Delicious, authentic dishes made for lunch or dinner with friends and family.</p>
            <Link href="/menu" className="sg-link">
              Full Menu <Icon name="arrow-right" size={16} />
            </Link>
          </header>
          <ol className="sg-feat">
            {homeDishes.map((dish, i) => (
              <li key={dish.name} className="sg-feat-item sg-reveal">
                <span className="sg-feat-no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="sg-h4">{dish.name}</h3>
                  <p className="sg-small">{dish.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sg-sig-foot sg-small">We are proud to use the freshest ingredients in our recipes, and our Josper grill gives our food that great smoky flavor that makes it unique.</p>
        </section>

        {/* 5. PHOTO — category wall (scroll-snap strip on mobile) */}
        <section className="sg-cats" aria-label="Menu categories">
          <ul className="sg-cats-strip">
            {categories.map((c, i) => (
              <li key={c.name} className="sg-cat">
                <Link href={c.href} className="sg-cat-link">
                  <Image src={c.src} alt={c.alt} fill sizes="(min-width: 900px) 25vw, 74vw" quality={75} />
                  <span className="sg-cat-shade" aria-hidden="true" />
                  <span className="sg-cat-no">0{i + 1}</span>
                  <span className="sg-cat-name">{c.name}</span>
                  <Icon name="arrow-up-right" size={22} className="sg-cat-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. SAGE — three curated guest reviews */}
        <section className="sg-sage sg-reviews">
          <header className="sg-reviews-head sg-reveal">
            <LightEyebrow>Testimonials</LightEyebrow>
            <h2 className="sg-h2">Guests say it best</h2>
          </header>
          <ul className="sg-reviews-list">
            {locations
              .filter((l) => l.reviews.length)
              .map((l) => (
                <li key={l.slug} className="sg-review sg-reveal">
                  <blockquote className="sg-quote">
                    <p>&ldquo;{l.reviews[0].quote}&rdquo;</p>
                    <cite>
                      {l.reviews[0].author} · {l.name}
                    </cite>
                  </blockquote>
                </li>
              ))}
          </ul>
        </section>

        {/* 7. DEEP-2 — tequila: a large selection that pairs with the food */}
        <section className="sg-deep2 sg-tequila">
          <Pattern name="talavera-tile" tone="navy-900" size={80} className="sg-fill sg-tequila-tile" />
          <div className="sg-tequila-in sg-reveal">
            <Eyebrow>Top shelf</Eyebrow>
            <h2 className="sg-h2 sg-on-dark">A large selection of tequila that pairs perfectly with our food</h2>
            <ul className="sg-tequila-list">
              {tequilaShelf.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <Button variant="outline" icon="arrow-right" href="/menu/drinks">
              Drinks Menu
            </Button>
          </div>
        </section>

        {/* 8. SAGE — locations */}
        <LocationsSection
          id="locations"
          photo={{ src: "/images/photos/interior-bar-bottles.webp", alt: "A sunlit corner of the dining room with a palm, a blue booth and talavera tile" }}
        />

        {/* 9. PHOTO BAND — brand statement */}
        <section className="sg-band" aria-label="Our style">
          <Image src="/images/photos/interior-eagle-mural.webp" alt="" fill sizes="100vw" quality={75} className="sg-band-img" />
          <span className="sg-band-scrim" aria-hidden="true" />
          <h2 className="sg-h2 sg-on-dark sg-band-title sg-reveal">Enjoy the home-style flavor of traditional Mexican cooking, and authentic style drinks from all over Mexico</h2>
        </section>

        {/* 10. DEEP-2 — happy hour card */}
        <SpecialsSection />

        {/* 11. ROSE — the one feature block */}
        <section className="sg-promo">
          <PromoBanner
            tone="rose"
            eyebrow="Monday – Thursday"
            title="Happy hour, all day"
            lede="Drink and appetizer deals from open to close — no clock-watching."
            deals={promoDeals}
            cta="Find a Location"
            ctaHref="/locations"
          />
        </section>

        {/* 12. SAGE — let's talk + Instagram */}
        <section className="sg-sage sg-social">
          <header className="sg-social-head sg-reveal">
            <LightEyebrow>Let&rsquo;s talk</LightEyebrow>
            <h2 className="sg-h3">Special events, catering or anything else</h2>
            <p className="sg-body">Contact us with any questions on special events you are planning, catering for large groups, or anything else that comes to mind.</p>
            <InkButton href="/contact">Get in touch</InkButton>
            <a href={social.href} className="sg-link">
              Follow {social.handle} <Icon name="arrow-up-right" size={16} />
            </a>
          </header>
          <div className="sg-social-grid">
            {social.images.map((image) => (
              <a key={image.src} href={social.href} className="sg-social-tile">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 20vw, 33vw" quality={75} />
              </a>
            ))}
          </div>
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
