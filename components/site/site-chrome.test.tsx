import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter, SiteHeader, pageContainer } from "./site-chrome";

describe("site chrome", () => {
  it("marks the page's link active in the sticky header", () => {
    const { container } = render(<SiteHeader active="Menu" />);
    expect(container.querySelector("header")).toHaveClass("sticky", "top-0");
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Specials" })).toHaveAttribute("href", "/happy-hour");
  });
  it("footer lists every location, with Coming soon for the unopened one", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("heading", { name: "Overland Park, KS" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
  it("exposes the shared page container classes", () => {
    expect(pageContainer).toContain("max-w-[var(--container-max)]");
  });
});
