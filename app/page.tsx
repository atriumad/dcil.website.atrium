import Image from "next/image";
import Link from "next/link";
import {
  dishCardsLarge,
  dishCardsMedium,
  dishesMore,
  tequilaBrands,
  type DishCard,
} from "@/data/featured-dishes";
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

/** Gallery photos for the events section (O'Fallon shoot); swap for real event and catering shots when available. */
const eventPhotos = [
  {
    src: "/images/ofallon/blue-cocktail.webp",
    alt: "A blue cocktail served in a hanging glass on a stand",
    focus: "50% 35%",
  },
  {
    src: "/images/dcop/table-spread.webp",
    alt: "A table set with queso fundido, grilled octopus, steak and sauces",
    focus: "50% 50%",
  },
  {
    src: "/images/dcop/aguachile-mango.webp",
    alt: "Shrimp aguachile with mango and red onion on a gray plate",
    focus: "50% 45%",
  },
  {
    src: "/images/ofallon/shared-table.webp",
    alt: "Guests sharing steak, ceviche and a cocktail at the table",
    focus: "50% 60%",
  },
  {
    src: "/images/dcop/ceviche-table.webp",
    alt: "A table of ceviche tostadas and cocktails beside a tiled wall",
    focus: "50% 45%",
  },
  {
    src: "/images/ofallon/green-cocktail.webp",
    alt: "A green cocktail with an orange slice and mint beside a steak on a stone",
    focus: "50% 55%",
  },
];

function DishTile({
  dish,
  size,
  no,
}: {
  dish: DishCard;
  size: "large" | "medium";
  no: number;
}) {
  return (
    <Link href="/menu" className={`sg-dish sg-dish-${size} sg-reveal`}>
      <Image
        src={dish.src}
        alt={dish.alt}
        fill
        sizes={
          size === "large"
            ? "(min-width: 900px) 590px, 100vw"
            : "(min-width: 900px) 390px, 100vw"
        }
        quality={80}
        style={{ objectPosition: dish.focus }}
      />
      <span className="sg-dish-scrim" aria-hidden="true" />
      <span className="sg-dish-body">
        <span className="sg-dish-no">No. {String(no).padStart(2, "0")}</span>
        <span className="sg-dish-name">{dish.name}</span>
        <span className="sg-dish-desc">{dish.description}</span>
      </span>
      <Icon name="arrow-up-right" size={20} className="sg-dish-arrow" />
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader overlay />

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
            <h2 className="sg-h2 sg-on-dark">{siteContent.taglines[0]}</h2>
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
        <LocationsSection id="locations" />

        {/* 5. DEEP-2 — happy hour card */}
        <SpecialsSection />

        {/* 6. SAGE — featured dishes: photo cards with overlaid copy */}
        <section className="sg-sage sg-dishes">
          <header className="sg-dishes-head sg-reveal">
            <h2 className="sg-h2">Featured dishes</h2>
            <p className="sg-body">
              Delicious, authentic dishes made for lunch or dinner with friends
              and family.
            </p>
          </header>
          <div className="sg-dishes-grid">
            {dishCardsLarge.map((dish, i) => (
              <DishTile key={dish.name} dish={dish} size="large" no={i + 1} />
            ))}
            {dishCardsMedium.map((dish, i) => (
              <DishTile
                key={dish.name}
                dish={dish}
                size="medium"
                no={i + 1 + dishCardsLarge.length}
              />
            ))}
          </div>
          <div className="sg-dishes-more sg-reveal">
            <p className="sg-eyebrow">
              <span aria-hidden="true" />
              Also on the menu
              <span aria-hidden="true" />
            </p>
            <p className="sg-dishes-names">{dishesMore.join(" · ")}</p>
            <InkButton href="/menu">Full Menu</InkButton>
          </div>
          <p className="sg-dishes-foot sg-small">
            We are proud to use the freshest ingredients in our recipes, and our
            Josper grill gives our food that great smoky flavor that makes it
            unique.
          </p>
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
          </div>
          <div
            className="sg-brands"
            role="group"
            aria-label={`Featured tequila brands: ${tequilaBrands.map((b) => b.name).join(", ")}`}
          >
            <ul className="sg-brands-track" aria-hidden="true">
              {[...tequilaBrands, ...tequilaBrands, ...tequilaBrands, ...tequilaBrands].map((brand, i) => (
                <li key={`${brand.name}-${i}`} className="sg-brand">
                  <Image
                    src={brand.src}
                    alt=""
                    width={brand.width}
                    height={brand.height}
                    sizes="200px"
                    loading="eager"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 10. PHOTO BAND — brand statement */}
        <section className="sg-band" aria-label="Our style">
          <Image
            src="/images/photos/spread-seafood-boil-wide.webp"
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="sg-band-img"
          />
          <span className="sg-band-scrim" aria-hidden="true" />
          <h2 className="sg-h2 sg-on-dark sg-band-title sg-reveal">
            Enjoy the home-style flavor of{" "}
            <em className="sg-script">traditional Mexican</em> cooking, and
            authentic style drinks from{" "}
            <em className="sg-script">all over Mexico</em>
          </h2>
        </section>

        {/* 11. SAGE — let's talk + Instagram */}
        <section className="sg-sage sg-social">
          <header className="sg-social-head sg-reveal">
            <h2 className="sg-h3 sg-on-dark">
              Special events, catering or anything else
            </h2>
            <p className="sg-body">
              Contact us with any questions on special events you are planning,
              catering for large groups, or anything else that comes to mind.
            </p>
            <InkButton href="/contact">Get in touch</InkButton>
          </header>
          <ul className="sg-social-grid" aria-label="Event and catering gallery">
            {eventPhotos.map((image) => (
              <li key={image.src} className="sg-social-tile sg-reveal">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1000px) 400px, 50vw"
                  quality={80}
                  style={{ objectPosition: image.focus }}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* 12. DEEP — closing: the page ends on a way in, not a form */}
        <section className="sg-deep sg-closing">
          <Image
            src="/images/ofallon/grill-flame.webp"
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="sg-closing-img"
          />
          <span className="sg-closing-scrim" aria-hidden="true" />
          <div className="sg-closing-in sg-reveal">
            <p className="sg-closing-line">{siteContent.taglines[2]}</p>
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
