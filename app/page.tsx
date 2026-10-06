import { locations } from "@/data/locations";
import { menu } from "@/data/menu";
import { siteContent } from "@/data/site";
import { SiteFooter, SiteHeader, pageContainer } from "@/components/site/site-chrome";
import {
  Button,
  CategoryGrid,
  DishCard,
  FeatureSplit,
  Hero,
  LocationCard,
  Newsletter,
  PromoBanner,
  SectionHeader,
  SocialGrid,
  SpecialsBoard,
  Statement,
  ValueProps,
} from "@/components/dc";

const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const formatPrice = (price: number | null) => (price != null ? `$${price.toFixed(2)}` : undefined);

// Real reviewed menu items (needsCopyReview: false) with confirmed descriptions —
// no stock/mismatched photos are used since these dishes have no confirmed photo yet.
const signatureDishes = menu
  .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })))
  .filter((item) => !item.needsCopyReview)
  .filter((item) => ["Steak & Lobster", "Pulpo Zarandeado", "Tostada de Ceviche"].includes(item.name));

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-[var(--space-8)]">
        <Hero
          variant="photo"
          eyebrow="Fresh Mex & Cantina"
          title="Real deal *Mexican* flavor"
          lede={siteContent.hero.subheadline}
          primary="View Menu"
          primaryHref="/menu"
          secondary="Find a Location"
          secondaryHref="/locations"
          image={{ src: "/images/photos/spread-seafood-boil-wide.webp", alt: "A table spread with a seafood boil, ceviche and grilled steak" }}
          mobileImage={{ src: "/images/photos/spread-seafood-boil-close.webp", alt: "A seafood boil, ceviche and grilled steak spread across the table" }}
        />

        <div className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <Statement eyebrow="Desde León, Mexico" title={siteContent.taglines[0]} body={siteContent.about.body} />
          <ValueProps
            items={[
              { icon: "sparkle", title: "Freshest ingredients", text: "We are proud to use the freshest ingredients in every dish we serve." },
              { icon: "agave", title: "Recipes from León", text: "Family recipes passed down through generations, from León, Mexico." },
              { icon: "flame", title: "Josper-grilled", text: "Smoky char from our Josper grill in every dish, every time." },
              { icon: "utensils", title: "Come for the fun", text: "Come for the food, stay for the fun — every visit feels like family." },
            ]}
          />
        </div>

        <FeatureSplit
          tone="navy-900"
          flower
          eyebrow="Fast fresh & delicious"
          title="Fresh off the grill"
          body="Smoky char, bold flavor, made to order — every dish comes straight from our Josper grill to your table."
          cta="View Menu"
          ctaHref="/menu"
          image={{ src: "/images/photos/dish-carne-asada-cutting.webp", alt: "Carving carne asada on a sizzling platter" }}
        />

        <div className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeader eyebrow="Nuestros favoritos" title="Signature dishes" lede="The plates our regulars order again and again." />
            <Button variant="link" icon="arrow-right" href="/menu">
              Full Menu
            </Button>
          </div>
          <div className="grid gap-[var(--space-6)] sm:grid-cols-3">
            {signatureDishes.map((dish) => (
              <DishCard
                key={dish.name}
                name={dish.name}
                description={dish.description}
                price={formatPrice(dish.price)}
                tags={dish.tags.map((t) => t.charAt(0).toUpperCase() + t.slice(1))}
              />
            ))}
          </div>
        </div>

        <CategoryGrid
          items={[
            { name: "Tacos", href: "/menu#tacos", image: { src: "/images/photos/dish-taco-in-hand.webp", alt: "A taco held in hand" } },
            { name: "La Cevichería", href: "/menu#cevicheria", image: { src: "/images/photos/dish-shrimp-ceviche-app.webp", alt: "Shrimp ceviche with an avocado rose" } },
            { name: "Steak House", href: "/menu#steak-house", image: { src: "/images/photos/dish-steak-plate-wide.webp", alt: "A grilled steak plate" } },
            { name: "Drinks", href: "/menu#drinks", image: { src: "/images/photos/drink-red-cocktail-bar.webp", alt: "A red margarita on the bar" } },
          ]}
        />

        <div className={pageContainer}>
          <SpecialsBoard
            eyebrow={siteContent.dailySpecials.subtitle}
            title={siteContent.dailySpecials.title}
            specials={[...siteContent.dailySpecials.specials]}
            drinks={[...siteContent.dailySpecials.drinks]}
          />
        </div>

        <PromoBanner
          tone="rose"
          eyebrow="Everyday drinks"
          title="Happy hour, every hour"
          lede="No clock-watching — these drink prices run every day, all day."
          deals={siteContent.dailySpecials.drinks.map((drink) => ({ name: drink.name, price: drink.price, icon: drink.icon }))}
          cta="Find a Location"
          ctaHref="/locations"
        />

        <section id="locations" className={`${pageContainer} flex flex-col gap-[var(--space-7)]`}>
          <SectionHeader
            align="center"
            eyebrow="Visit us"
            title="Find your table"
            lede="Three restaurants open, a fourth on the way. Come for the food, stay for the fun!"
          />
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
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

        <div className={pageContainer}>
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

        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
