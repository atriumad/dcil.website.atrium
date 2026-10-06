import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { Pill } from "./pill";
import { SectionHeader } from "./section-header";

describe("Button", () => {
  it("is a primary, medium button by default and never submits by accident", () => {
    render(<Button>View Menu</Button>);
    const button = screen.getByRole("button", { name: "View Menu" });
    expect(button).toHaveClass("dc-btn", "dc-btn-primary", "dc-btn-md");
    expect(button).toHaveAttribute("type", "button");
  });
  it("renders a link for href, with the trailing icon", () => {
    const { container } = render(
      <Button href="/menu" variant="outline" size="lg" icon="arrow-right">
        Menu
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Menu" });
    expect(link).toHaveAttribute("href", "/menu");
    expect(link).toHaveClass("dc-btn-outline", "dc-btn-lg");
    expect(container.querySelector("svg.dc-btn-icon")).toBeInTheDocument();
  });
  it("opens external links as plain anchors", () => {
    render(<Button href="https://example.com">Out</Button>);
    expect(screen.getByRole("link", { name: "Out" })).toHaveAttribute("href", "https://example.com");
  });
});

describe("Pill", () => {
  it("defaults to the outline tone and shows an optional icon", () => {
    const { container } = render(<Pill icon="chile">Spicy</Pill>);
    expect(container.firstElementChild).toHaveClass("dc-pill", "dc-pill-outline");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("Eyebrow", () => {
  it("leads with a marigold rule and centers on request", () => {
    const { container } = render(<Eyebrow align="center">Visit us</Eyebrow>);
    expect(container.firstElementChild).toHaveClass("dc-eyebrow", "dc-eyebrow-center");
    expect(container.querySelector(".dc-eyebrow-rule")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("SectionHeader", () => {
  it("renders eyebrow, a title with one script accent, and a lede", () => {
    const { container } = render(<SectionHeader eyebrow="La comida" title="What are *you* craving?" lede="Pick a plate." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("What are you craving?");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("you");
    expect(screen.getByText("La comida")).toBeInTheDocument();
    expect(screen.getByText("Pick a plate.")).toBeInTheDocument();
  });
  it("shows a one-word script above the title", () => {
    const { container } = render(<SectionHeader script="Salud" title="Everyday drinks" />);
    expect(container.querySelector(".dc-sh-script")?.textContent).toBe("Salud");
  });
  it("drops a multi-word script instead of setting a phrase in Yellowtail", () => {
    const { container } = render(<SectionHeader script="from our casa" title="Everyday drinks" />);
    expect(container.querySelector(".dc-sh-script")).toBeNull();
  });
});
