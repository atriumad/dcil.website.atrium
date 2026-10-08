import Image from "next/image";
import Link from "next/link";
import { homeDishes, tequilaShelf } from "@/data/featured-dishes";
import { locations, orderHref } from "@/data/locations";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import {
  InkButton,
  LocationsSection,
  NewsletterSection,
  SpecialsSection,
} from "@/components/site/sage";
import { HeroVideo } from "@/components/site/hero-video";
import { Tonight } from "@/components/site/tonight";
import { Button, Icon, Pattern, PhotoFrame } from "@/components/dc";

const categories = [
  {
    name: "Tacos",
    href: "/menu#tacos",
    src: "/images/photos/dish-taco-in-hand.webp",
    alt: "A taco held in hand",
  },
  {
    name: "La Cevichería",
    href: "/menu#cevicheria",
    src: "/images/photos/dish-shrimp-ceviche-app.webp",
    alt: "Shrimp ceviche with an avocado rose",
  },
  {
    name: "Steak House",
    href: "/menu#steak-house",
    src: "/images/photos/dish-steak-plate-wide.webp",
    alt: "A grilled steak plate",
  },
  {
    name: "Drinks",
    href: "/menu#drinks",
    src: "/images/photos/drink-red-cocktail-bar.webp",
    alt: "A red margarita on the bar",
  },
];

const social = {
  handle: "@donchuysmo",
  href: "https://www.instagram.com/donchuysmo/",
  images: [
    {
      src: "/images/photos/interior-eagle-mural.webp",
      alt: "Colorful eagle mural on a brick wall inside the restaurant",
    },
    {
      src: "/images/photos/drink-pink-margarita-talavera.webp",
      alt: "A pink margarita served in a blue-rimmed talavera glass",
    },
    {
      src: "/images/photos/dish-grilled-skewer-molcajete.webp",
      alt: "A molcajete of grilled seafood beside carne asada",
    },
    {
      src: "/images/photos/interior-stone-lion.webp",
      alt: "A carved stone lion statue at the restaurant entrance",
    },
    {
      src: "/images/photos/drink-flight-margaritas.webp",
      alt: "A flight of colorful margaritas on a serving stand",
    },
    {
      src: "/images/photos/dish-churros-dipping.webp",
      alt: "Churros with an assortment of dipping sauces",
    },
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
            <Image
              className="sg-hero-poster"
              src="/images/photos/hero-poster.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={80}
            />
            <HeroVideo poster="/images/photos/hero-poster.webp" />
            <span className="sg-hero-scrim" />
          </div>
          <div className="sg-hero-copy">
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

        {/* Open today: status, call, order, happy hour */}
        <Tonight />

        {/* 2. SAGE — statement + collage */}
        <section className="sg-sage sg-story">
          <div className="sg-story-copy sg-reveal">
            <h2 className="sg-h2">{siteContent.taglines[0]}</h2>
            <p className="sg-body">{siteContent.about.body}</p>
          </div>
          <div className="sg-collage sg-reveal">
            <span className="sg-collage-tile" aria-hidden="true">
              <Pattern
                name="talavera-tile"
                tone="sg-tile-on-sage"
                size={72}
                className="sg-fill"
              />
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
        </section>

        {/* 3. DEEP — fresh off the grill: full-bleed photo, copy on top */}
        <section className="sg-deep sg-grill">
          <Image
            src="/images/photos/dish-carne-asada-cutting.webp"
            alt="Carving carne asada on a sizzling platter"
            fill
            sizes="100vw"
            quality={80}
            className="sg-grill-img"
          />
          <span className="sg-grill-scrim" aria-hidden="true" />
          <div className="sg-grill-in sg-reveal">
            <h2 className="sg-h2 sg-on-dark">Fresh off the grill</h2>
            <p className="sg-body sg-on-dark">
              Smoky char, bold flavor, made to order — every dish comes straight
              from our Josper grill to your table.
            </p>
          </div>
        </section>

        {/* 4. SAGE — locations */}
        <LocationsSection
          id="locations"
          photo={{
            src: "/images/photos/interior-bar-bottles.webp",
            alt: "A sunlit corner of the dining room with a palm, a blue booth and talavera tile",
          }}
        />

        {/* 5. DEEP-2 — happy hour card */}
        <SpecialsSection />

        {/* 6. SAGE — featured dishes: two photos beside a hairline list */}
        <section className="sg-sage sg-sig">
          <header className="sg-sig-head sg-reveal">
            <h2 className="sg-h2">Featured dishes</h2>
            <p className="sg-body">
              Delicious, authentic dishes made for lunch or dinner with friends
              and family.
            </p>
            <Link href="/menu" className="sg-link">
              Full Menu <Icon name="arrow-right" size={16} />
            </Link>
          </header>
          <div className="sg-sig-body">
            <div className="sg-sig-photos sg-reveal">
              <PhotoFrame
                className="sg-sig-arch"
                shape="arch"
                outline
                ratio="4 / 5"
                src="/images/photos/dish-steak-plate-wide.webp"
                alt="Grilled steak with white rice, fried yuca and pico de gallo on a blue plate"
                focus="50% 62%"
                sizes="(min-width: 900px) 34vw, 78vw"
              />
              <PhotoFrame
                className="sg-sig-frame"
                shape="frame"
                ratio="1 / 1"
                src="/images/photos/dish-white-fish-plate.webp"
                alt="Three fried empanadas topped with crumbled cheese, with a dipping sauce"
                focus="50% 62%"
                sizes="(min-width: 900px) 20vw, 44vw"
              />
            </div>
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
          </div>
          <p className="sg-sig-foot sg-small">
            We are proud to use the freshest ingredients in our recipes, and our
            Josper grill gives our food that great smoky flavor that makes it
            unique.
          </p>
        </section>

        {/* 7. PHOTO — category wall (scroll-snap strip on mobile) */}
        <section className="sg-cats" aria-label="Menu categories">
          <ul className="sg-cats-strip">
            {categories.map((c) => (
              <li key={c.name} className="sg-cat">
                <Link href={c.href} className="sg-cat-link">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 900px) 25vw, 74vw"
                    quality={75}
                  />
                  <span className="sg-cat-shade" aria-hidden="true" />
                  <span className="sg-cat-name">{c.name}</span>
                  <Icon
                    name="arrow-up-right"
                    size={22}
                    className="sg-cat-arrow"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 8. SAGE — three guest reviews as table checks */}
        <section className="sg-sage sg-reviews">
          <header className="sg-reviews-head sg-reveal">
            <h2 className="sg-h2">Guests say it best</h2>
          </header>
          <ul className="sg-reviews-list">
            {locations
              .filter((l) => l.reviews.length)
              .map((l) => (
                <li key={l.slug} className="sg-check-wrap sg-reveal">
                  <blockquote className="sg-check">
                    <div className="sg-check-head">
                      <span>Don Chuy&rsquo;s</span>
                      <span>{l.name}</span>
                    </div>
                    <p className="sg-check-quote">
                      &ldquo;{l.reviews[0].quote}&rdquo;
                    </p>
                    <footer className="sg-check-foot">
                      <cite>{l.reviews[0].author}</cite>
                      <span>Gracias</span>
                    </footer>
                  </blockquote>
                </li>
              ))}
          </ul>
        </section>

        {/* 9. DEEP-2 — tequila: a large selection that pairs with the food */}
        <section className="sg-deep2 sg-tequila">
          <Pattern
            name="talavera-tile"
            tone="navy-900"
            size={80}
            className="sg-fill sg-tequila-tile"
          />
          <div className="sg-tequila-in">
            <div className="sg-tequila-copy sg-reveal">
              <h2 className="sg-h2 sg-on-dark">Tequila</h2>
              <p className="sg-body sg-on-dark">
                A large selection of tequila that pairs perfectly with our food.
              </p>
              <Button variant="outline" icon="arrow-right" href="/menu/drinks">
                Drinks Menu
              </Button>
            </div>
            <ul className="sg-tequila-list sg-reveal">
              {tequilaShelf.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 10. PHOTO BAND — brand statement */}
        <section className="sg-band" aria-label="Our style">
          <Image
            src="/images/photos/interior-eagle-mural.webp"
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="sg-band-img"
          />
          <span className="sg-band-scrim" aria-hidden="true" />
          <h2 className="sg-h2 sg-on-dark sg-band-title sg-reveal">
            Enjoy the home-style flavor of traditional Mexican cooking, and
            authentic style drinks from all over Mexico
          </h2>
        </section>

        {/* 11. SAGE — let's talk + Instagram */}
        <section className="sg-sage sg-social">
          <header className="sg-social-head sg-reveal">
            <h2 className="sg-h3">Special events, catering or anything else</h2>
            <p className="sg-body">
              Contact us with any questions on special events you are planning,
              catering for large groups, or anything else that comes to mind.
            </p>
            <InkButton href="/contact">Get in touch</InkButton>
            <a href={social.href} className="sg-link">
              Follow {social.handle} <Icon name="arrow-up-right" size={16} />
            </a>
          </header>
          <div className="sg-social-grid">
            {[3, 2, 1, 5]
              .map((i) => social.images[i])
              .map((image) => (
                <a
                  key={image.src}
                  href={social.href}
                  className="sg-social-tile"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 900px) 34vw, 50vw"
                    quality={80}
                  />
                </a>
              ))}
          </div>
        </section>

        {/* 12. DEEP — closing: the page ends on a way in, not a form */}
        <section className="sg-deep sg-closing">
          <Pattern
            name="talavera-tile"
            tone="navy-700"
            size={88}
            className="sg-fill sg-closing-tile"
          />
          <div className="sg-closing-in sg-reveal">
            <h2 className="sg-h2 sg-on-dark">Come as guests. Leave as family.</h2>
            <div className="sg-closing-ctas">
              <Button size="lg" icon="arrow-right" href={orderHref(locations[0])}>
                Order Online
              </Button>
              <Button size="lg" variant="outline" href="#locations">
                Find a Location
              </Button>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <SiteFooter />
    </>
  );
}
