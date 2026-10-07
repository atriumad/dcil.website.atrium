import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flower, Logo, Marquee, Pattern, TileBand } from "./decor";
import { PhotoFrame } from "./photo-frame";

describe("decor", () => {
  it("Logo is an accessible image sized by prop", () => {
    render(<Logo size={64} />);
    const logo = screen.getByRole("img", { name: "Don Chuy's Fresh Mex and Cantina" });
    expect(logo).toHaveClass("dc-logo");
    expect(logo).toHaveStyle({ width: "64px" });
  });
  it("Flower: color variant has no tint; mono tints with the token; size null defers to CSS", () => {
    const { container } = render(
      <>
        <Flower size={80} />
        <Flower variant="mono" tone="white" size={null} />
      </>,
    );
    const [color, mono] = Array.from(container.querySelectorAll(".dc-flower")) as HTMLElement[];
    expect(color).toHaveClass("dc-flower-color");
    expect(color).toHaveStyle({ width: "80px" });
    expect(mono).toHaveClass("dc-flower-mono");
    expect(mono.style.backgroundColor).toBe("var(--white)");
    expect(mono.style.width).toBe("");
  });
  it("Marquee exposes its words once and hides the repeated track", () => {
    render(<Marquee items={["Fresh Mex", "Cantina"]} />);
    expect(screen.getByRole("marquee", { name: "Fresh Mex, Cantina" })).toBeInTheDocument();
    expect(document.querySelector(".dc-mq-track")).toHaveAttribute("aria-hidden", "true");
  });
  it("TileBand and Pattern are decorative", () => {
    const { container } = render(
      <>
        <TileBand height={36} />
        <Pattern name="talavera-tile" size={64} />
      </>,
    );
    expect(container.querySelector(".dc-tileband")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dc-pattern")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("PhotoFrame", () => {
  it("wraps the photo in a clip with the shape's default ratio", () => {
    const { container } = render(<PhotoFrame src="/a.webp" alt="A plate" shape="circle" />);
    expect(container.querySelector("figure")).toHaveClass("dc-photo", "dc-photo-circle");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "1" });
    expect(screen.getByAltText("A plate")).toBeInTheDocument();
  });
  it("adds the marigold outline and a caption on request", () => {
    const { container } = render(<PhotoFrame src="/a.webp" alt="x" shape="arch" outline caption="The table" />);
    expect(container.querySelector("figure")).toHaveClass("dc-photo-outline");
    expect(screen.getByText("The table").tagName).toBe("FIGCAPTION");
    expect(container.querySelector(".dc-photo-clip")).toHaveStyle({ aspectRatio: "4 / 5" });
  });
  it("shows the utensils placeholder when there is no src", () => {
    const { container } = render(<PhotoFrame shape="frame" />);
    expect(container.querySelector(".dc-photo-empty svg")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
  it("passes the crop focus through as object-position", () => {
    render(<PhotoFrame src="/a.webp" alt="focus" focus="50% 35%" />);
    expect(screen.getByAltText("focus")).toHaveStyle({ objectPosition: "50% 35%" });
  });
});
