import { locations } from "@/data/locations";
import { menu } from "@/data/menu";
import { siteContent } from "@/data/site";
import {
  CategoryGrid,
  ColorSplit,
  DishCard,
  Footer,
  Hero,
  LocationCard,
  Marquee,
  NavBar,
  Newsletter,
  PosterCard,
  PromoBanner,
  SectionHeader,
  SocialGrid,
  SpecialsBoard,
  ValueProps,
} from "@/components/dc";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Specials", href: "/happy-hour" },
  { label: "Locations", href: "/locations" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "/about" },
];

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const container = "mx-auto w-full max-w-[var(--container-max)] px-[var(--gutter-mobile)] md:px-[var(--gutter-desktop)]";

// Real reviewed menu items (needsCopyReview: false) with confirmed descriptions —
// no stock/mismatched photos are used since these dishes have no confirmed photo yet.
const signatureDishes = menu
  .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })))
  .filter((item) => !item.needsCopyReview)
  .filter((item) => ["Steak & Lobster", "Pulpo Zarandeado", "Tostada de Ceviche"].includes(item.name));

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-40">
        <NavBar links={navLinks} cta="Order Online" ctaHref="/locations" />
      </header>

      <main className="flex-1">
        <Hero
          variant="photo"
          eyebrow="Fresh Mex & Cantina"
          title="Real-deal *Mexican* flavor from our family to yours"
          lede={siteContent.hero.subheadline}
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/spread-seafood-boil-wide.webp", alt: "A table spread with a seafood boil, ceviche and grilled steak" }}
          mobileImage={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table" }}
        />

        <div className={`${container} py-[var(--space-8)]`}>
          <ValueProps
            items={[
              { icon: "sparkle", title: "Freshest ingredients", text: "We are proud to use the freshest ingredients in every dish we serve." },
              { icon: "agave", title: "Recipes from León", text: "Family recipes passed down through generations, from León, Mexico." },
              { icon: "flame", title: "Josper-grilled", text: "Smoky char from our Josper grill in every dish, every time." },
              { icon: "utensils", title: "Come for the fun", text: "Come for the food, stay for the fun — every visit feels like family." },
            ]}
          />
        </div>

        <div className={container}>
          <ColorSplit
            tone="marigold"
            eyebrow="Nuestra historia"
            title="Family *roots*, big flavor"
            body={siteContent.about.body}
            cta="Our Story"
            ctaHref="/about"
            image={{ src: "/images/photos/dish-enchilada-hands.webp", alt: "Sharing enchiladas and eggs at the table" }}
          />
        </div>

        <div className="my-[var(--space-8)]">
          <Marquee tone="rose" />
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <SectionHeader align="center" eyebrow="La comida" title="What are *you* craving?" size="m" className="mx-auto mb-[var(--space-6)] text-center" />
          <CategoryGrid
            items={[
              { name: "Tacos", tone: "rose", icon: "taco", href: "/menu#tacos" },
              { name: "La Cevichería", tone: "teal", icon: "lime", href: "/menu#cevicheria" },
              { name: "Steak House", tone: "marigold", icon: "flame", href: "/menu#steak-house" },
              { name: "Drinks", tone: "navy", icon: "margarita", href: "/menu#drinks" },
            ]}
          />
        </div>

        <div className={container}>
          <ColorSplit
            tone="rose"
            reverse
            eyebrow="Fast fresh & delicious"
            title="Fresh *off* the grill"
            body="Smoky char, bold flavor, made to order — every dish comes straight from our Josper grill to your table."
            cta="View Menu"
            ctaHref="/menu"
            image={{ src: "/images/photos/dish-carne-asada-cutting.webp", alt: "Carving carne asada on a sizzling platter" }}
          />
        </div>

        <div className={`${container} py-[var(--space-8)]`}>
          <SectionHeader align="center" eyebrow="Explora" title="This *week*" size="m" className="mx-auto mb-[var(--space-6)] text-center" />
          <div className="grid gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3">
            <PosterCard
              word="TACOS"
              tone="teal"
              title="Tacos al Carbón"
              meta="Charcoal-grilled, every day"
              sticker={"LET'S TACO\n'BOUT IT"}
              href="/menu#tacos"
            />
            <PosterCard word="MARISCOS" tone="rose" title="La Cevichería" meta="Ceviche, aguachiles & more" href="/menu#cevicheria" />
            <PosterCard word="CANTINA" tone="marigold" title="Happy Hour" meta={siteContent.dailySpecials.subtitle} href="/happy-hour" />
          </div>
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <SpecialsBoard
            title={siteContent.dailySpecials.title}
            subtitle={siteContent.dailySpecials.subtitle}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
            plate={{ src: "/images/photos/dish-taco-in-hand.webp", alt: "A street taco held up, part of the 3 tacos daily special" }}
          />
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <SectionHeader align="center" eyebrow="Nuestros favoritos" title="Signature *dishes*" size="m" className="mx-auto mb-[var(--space-6)] text-center" />
          <div className="grid gap-[var(--space-6)] sm:grid-cols-3">
            {signatureDishes.map((dish) => (
              <DishCard
                key={dish.name}
                name={dish.name}
                description={dish.description}
                tags={dish.tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
                variant="plate"
              />
            ))}
          </div>
        </div>

        <div className={`${container} pb-[var(--space-8)]`}>
          <PromoBanner
            tone="marigold"
            kicker="Everyday drinks"
            title="HAPPY *hour*, every hour"
            lede="No clock-watching — these drink prices run every day, all day."
            deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
            cta="Find a Location"
            ctaHref="/locations"
          />
        </div>

        <section id="locations" className={`${container} py-[var(--space-7)] md:py-[var(--space-8)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your *table*"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="mt-[var(--space-7)] grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <LocationCard
                key={location.slug}
                city={location.name}
                address={location.address || undefined}
                phone={location.phone || undefined}
                hours={location.hours.map((row) => `${row.days}|${row.time}`)}
                comingSoon={location.comingSoon}
                href={location.address ? mapsUrl(location.address) : `/locations/${location.slug}`}
              />
            ))}
          </div>
        </section>

        <div className={`${container} pb-[var(--space-8)]`}>
          <SocialGrid
            images={[
              { src: "/images/photos/interior-eagle-mural.webp", alt: "Colorful eagle mural on a brick wall inside the restaurant" },
              { src: "/images/photos/drink-pink-margarita-talavera.webp", alt: "A pink margarita served in a blue-rimmed talavera glass" },
              { src: "/images/photos/dish-grilled-skewer-molcajete.webp", alt: "A molcajete of grilled seafood beside carne asada" },
              { src: "/images/photos/interior-stone-lion.webp", alt: "A carved stone lion statue at the restaurant entrance" },
              { src: "/images/photos/drink-flight-margaritas.webp", alt: "A flight of colorful margaritas on a serving stand" },
              { src: "/images/photos/dish-churros-dipping.webp", alt: "Churros with an assortment of dipping sauces" },
            ]}
          />
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
