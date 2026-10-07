import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryGrid } from "./category-grid";
import { DishCard, MenuSection, SpecialsBoard } from "./menu";
import { LocationCard, PromoBanner } from "./sections";
import { SocialGrid } from "./social-grid";

describe("DishCard", () => {
  it("shows name and price on one head line, a circle photo, and tags (spicy gets the chile)", () => {
    const { container } = render(
      <DishCard name="Pulpo Zarandeado" price="$24" description="Grilled octopus." tags={["Spicy", "House favorite"]} image={{ src: "/p.webp", alt: "Octopus" }} />,
    );
    const head = container.querySelector(".dc-dish-head")!;
    expect(within(head as HTMLElement).getByText("Pulpo Zarandeado")).toBeInTheDocument();
    expect(within(head as HTMLElement).getByText("$24")).toBeInTheDocument();
    expect(container.querySelector("figure.dc-photo-circle")).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-pill")).toHaveLength(2);
    expect(container.querySelectorAll(".dc-pill svg")).toHaveLength(1);
  });
  it("works with no image, price or tags", () => {
    const { container } = render(<DishCard name="Enchiladas" />);
    expect(container.querySelector(".dc-photo-empty")).toBeInTheDocument();
    expect(container.querySelector(".dc-dish-price")).toBeNull();
    expect(container.querySelector(".dc-dish-tags")).toBeNull();
  });
});

describe("MenuSection", () => {
  it("lists items, omits the price leader for unpriced items and marks featured ones", () => {
    const { container } = render(
      <MenuSection
        title="Mariscos"
        note="From the coast"
        items={[
          { name: "Salmón Mango", price: "$22" },
          { name: "Pulpo", price: "", featured: true, tags: ["Spicy"] },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Mariscos" })).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-mi")).toHaveLength(2);
    expect(container.querySelectorAll(".dc-mi-price")).toHaveLength(1);
    expect(container.querySelector(".dc-mi-featured")).toHaveTextContent("Pulpo");
    expect(screen.getByRole("img", { name: "Spicy" })).toBeInTheDocument();
  });
});

describe("SpecialsBoard", () => {
  it("renders specials as rows, with the drinks list under its own title", () => {
    const { container } = render(
      <SpecialsBoard
        eyebrow="Every day a special"
        specials={[{ day: "Tuesday", item: "3 Tacos for", price: "$5.75", note: "Ground beef" }, { day: "Monday", item: "Carnitas", price: "$10" }]}
        drinks={[{ name: "House Margarita 16oz", price: "$5.75", icon: "margarita" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Daily Specials" })).toBeInTheDocument();
    expect(container.querySelectorAll(".dc-special")).toHaveLength(2);
    expect(screen.getByText("Everyday drinks")).toBeInTheDocument();
    expect(screen.getByText("House Margarita 16oz")).toBeInTheDocument();
  });
  it("omits the drinks block when there are none", () => {
    const { container } = render(<SpecialsBoard specials={[]} />);
    expect(container.querySelector(".dc-board-drinks")).toBeNull();
  });
});

describe("PromoBanner", () => {
  it("is rose by default, lists deals and links the CTA", () => {
    const { container } = render(
      <PromoBanner eyebrow="Everyday drinks" title="Happy hour" lede="All day." deals={[{ name: "Draft Beer 16oz", price: "$4", icon: "beer" }]} cta="Find a Location" ctaHref="/locations" />,
    );
    expect(container.querySelector("section")).toHaveClass("dc-promo", "dc-promo-rose");
    expect(screen.getByText("Draft Beer 16oz")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find a Location" })).toHaveAttribute("href", "/locations");
  });
  it("supports the navy-900 tone and drops a multi-word script", () => {
    const { container } = render(<PromoBanner tone="navy-900" title="Catering" script="for your crowd" />);
    expect(container.querySelector("section")).toHaveClass("dc-promo-navy-900");
    expect(container.querySelector(".dc-promo-script")).toBeNull();
  });
});

describe("LocationCard", () => {
  it("shows address, a tel link, hours rows and a directions link", () => {
    render(<LocationCard city="Lee's Summit, MO" address="701 SE Melody Ln" phone="+1 816-434-5222" hours={["Every day|11am–10pm"]} href="/locations/lees-summit" />);
    expect(screen.getByRole("link", { name: "+1 816-434-5222" })).toHaveAttribute("href", "tel:+18164345222");
    expect(screen.getByText("Every day")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Directions" })).toHaveAttribute("href", "/locations/lees-summit");
  });
  it("coming soon: badge, no CTA, no contact lines", () => {
    const { container } = render(<LocationCard city="O'Fallon, IL" comingSoon />);
    expect(container.querySelector("article")).toHaveClass("dc-loc-soon");
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector(".dc-loc-line")).toBeNull();
  });
  it("hides the CTA when cta is null", () => {
    render(<LocationCard city="X" address="1 Main St" cta={null} />);
    expect(screen.queryByRole("link", { name: "Get Directions" })).toBeNull();
  });
});

describe("CategoryGrid", () => {
  it("numbers the tiles, links them and uses the photo when there is one", () => {
    const { container } = render(
      <CategoryGrid
        items={[
          { name: "Tacos", href: "/menu#tacos", image: { src: "/t.webp", alt: "A taco" } },
          { name: "Drinks", href: "/menu#drinks", icon: "margarita" },
        ]}
      />,
    );
    const tiles = container.querySelectorAll("a.dc-cat");
    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toHaveAttribute("href", "/menu#tacos");
    expect(tiles[0].querySelector(".dc-cat-num")).toHaveTextContent("01");
    expect(tiles[0].querySelector("img.dc-cat-img")).toHaveAttribute("alt", "A taco");
  });
  it("falls back to the icon when an item has no image", () => {
    const { container } = render(<CategoryGrid items={[{ name: "Drinks", icon: "margarita" }, { name: "Other" }]} />);
    const tiles = container.querySelectorAll("a.dc-cat");
    expect(tiles[0].querySelector(".dc-cat-icon svg")).toBeInTheDocument();
    expect(tiles[0].querySelector("img")).toBeNull();
    expect(tiles[1].querySelector(".dc-cat-icon svg")).toBeInTheDocument();
  });
});

describe("SocialGrid", () => {
  it("shows the handle, a follow link and at most six tiles", () => {
    const images = Array.from({ length: 8 }, (_, i) => ({ src: `/s${i}.webp`, alt: `Shot ${i}` }));
    const { container } = render(<SocialGrid images={images} />);
    expect(screen.getByRole("heading", { name: "@donchuysmo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Follow us" })).toHaveAttribute("href", "https://www.instagram.com/donchuysmo/");
    expect(container.querySelectorAll("a.dc-social-tile")).toHaveLength(6);
  });
});
