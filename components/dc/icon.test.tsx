import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";
import { iconPaths } from "./icon-paths";

describe("Icon", () => {
  it("ships exactly the 22 icons of the v6 guide", () => {
    expect(Object.keys(iconPaths).sort()).toEqual(
      ["agave", "arrow-right", "arrow-up-right", "avocado", "bag", "beer", "calendar", "chile", "clock", "close", "corn", "flame", "lime", "mail", "margarita", "menu", "phone", "pin", "plus", "sparkle", "taco", "utensils"],
    );
  });
  it("is decorative without a title and uses the thin 1.5 stroke by default", () => {
    const { container } = render(<Icon name="pin" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("stroke-width", "1.5");
  });
  it("gets an accessible name from title", () => {
    const { getByRole } = render(<Icon name="chile" title="Spicy" />);
    expect(getByRole("img", { name: "Spicy" })).toBeInTheDocument();
  });
});
