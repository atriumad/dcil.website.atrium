import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureSplit } from "./feature-split";
import { Hero } from "./hero";
import { Statement } from "./statement";
import { ValueProps } from "./value-props";

const table = { src: "/table.webp", alt: "A table spread" };

describe("Hero", () => {
  it("photo variant: background photo under a scrim, title with one script word", () => {
    const { container } = render(<Hero title="Real deal *Mexican* flavor" image={table} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Real deal Mexican flavor");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("Mexican");
    expect(container.querySelector("section.dc-hero-photo img.dc-hero-bg")).toHaveAttribute("alt", "A table spread");
    expect(container.querySelector(".dc-hero-scrim")).toBeInTheDocument();
  });
  it("renders a single background image when there is no mobileImage", () => {
    const { container } = render(<Hero title="Hi" image={table} />);
    expect(container.querySelectorAll("img.dc-hero-bg")).toHaveLength(1);
    expect(container.querySelector(".dc-hero-bg-wide")).toBeNull();
  });
  it("adds a portrait image for narrow screens when mobileImage is given", () => {
    const { container } = render(<Hero title="Hi" image={table} mobileImage={{ src: "/tall.webp", alt: "Close up" }} />);
    expect(container.querySelector("img.dc-hero-bg-wide")).toHaveAttribute("alt", "A table spread");
    expect(container.querySelector("img.dc-hero-bg-tall")).toHaveAttribute("alt", "Close up");
  });
  it("split variant: arch photo with marigold outline and a flower", () => {
    const { container } = render(<Hero variant="split" title="Family roots" image={table} />);
    expect(container.querySelector("section.dc-hero-split")).toBeInTheDocument();
    expect(container.querySelector("figure.dc-photo-arch.dc-photo-outline")).toBeInTheDocument();
    expect(container.querySelector(".dc-hero-flower")).toBeInTheDocument();
  });
  it("hides a button whose label is null and routes the other", () => {
    render(<Hero title="Hi" primary="View Menu" primaryHref="/menu" secondary={null} />);
    expect(screen.getByRole("link", { name: "View Menu" })).toHaveAttribute("href", "/menu");
    expect(screen.queryByRole("link", { name: "Find a Location" })).toBeNull();
  });
  it("sets a one-word script but not a phrase", () => {
    const one = render(<Hero title="Hi" script="Salud" />);
    expect(one.container.querySelector(".dc-hero-script")?.textContent).toBe("Salud");
    one.unmount();
    const phrase = render(<Hero title="Hi" script="follow the flavor" />);
    expect(phrase.container.querySelector(".dc-hero-script")).toBeNull();
  });
});

describe("Statement", () => {
  it("centers an eyebrow, title and body over the brand flower", () => {
    const { container } = render(<Statement eyebrow="Desde León" title="Fresh Mex. Real flavor." body="Come as guests." />);
    expect(screen.getByRole("heading", { level: 2, name: "Fresh Mex. Real flavor." })).toBeInTheDocument();
    expect(screen.getByText("Come as guests.")).toBeInTheDocument();
    expect(container.querySelector(".dc-statement-mark")).toBeInTheDocument();
  });
});

describe("ValueProps", () => {
  it("renders each item with its icon, title and text", () => {
    const { container } = render(<ValueProps items={[{ icon: "flame", title: "Josper-grilled", text: "Smoky char." }]} />);
    expect(screen.getByRole("heading", { level: 3, name: "Josper-grilled" })).toBeInTheDocument();
    expect(screen.getByText("Smoky char.")).toBeInTheDocument();
    expect(container.querySelector("svg.dc-vp-icon")).toBeInTheDocument();
  });
});

describe("FeatureSplit", () => {
  it("uses an outlined arch by default with the chosen tone", () => {
    const { container } = render(<FeatureSplit title="Come as guests" image={table} tone="navy-900" body={["One", "Two"]} cta="Our Story" ctaHref="/about" />);
    expect(container.querySelector("section")).toHaveClass("dc-feat", "dc-feat-navy-900");
    expect(container.querySelector("figure.dc-photo-arch.dc-photo-outline")).toBeInTheDocument();
    expect(screen.getAllByText(/^(One|Two)$/)).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Our Story" })).toHaveAttribute("href", "/about");
  });
  it("frame shape uses the 5/4 ratio and no outline; reverse flips the media", () => {
    const { container } = render(<FeatureSplit title="Catering" image={table} shape="frame" reverse />);
    expect(container.querySelector("figure.dc-photo-frame")).not.toHaveClass("dc-photo-outline");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "5 / 4" });
    expect(container.querySelector("section")).toHaveClass("dc-feat-reverse");
  });
  it("adds the flower only on request", () => {
    const { container, rerender } = render(<FeatureSplit title="X" image={table} />);
    expect(container.querySelector(".dc-feat-flower")).toBeNull();
    rerender(<FeatureSplit title="X" image={table} flower />);
    expect(container.querySelector(".dc-feat-flower")).toBeInTheDocument();
  });
});
