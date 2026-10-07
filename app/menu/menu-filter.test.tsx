import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { menu } from "@/data/menu";
import { MenuBrowser } from "./menu-filter";

beforeAll(() => {
  // jsdom has no IntersectionObserver; the scroll-spy only needs it to exist.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
  Element.prototype.scrollTo = vi.fn();
});

describe("MenuBrowser", () => {
  it("renders every category with a chip and a numbered heading", () => {
    const { container } = render(<MenuBrowser categories={menu} />);
    expect(container.querySelectorAll("section.mn-cat")).toHaveLength(menu.length);
    expect(container.querySelectorAll("a.mn-chip")).toHaveLength(menu.length);
    expect(container.querySelector(".mn-cat-num")).toHaveTextContent("01");
  });

  it("photo breaks use display titles, never script phrases, and no rose tone", () => {
    const { container } = render(<MenuBrowser categories={menu} />);
    const breaks = container.querySelectorAll("aside.mn-break");
    expect(breaks.length).toBeGreaterThan(0);
    expect(container.querySelector(".mn-break-script")).toBeNull();
    expect(container.querySelector("[class*='mn-break-rose']")).toBeNull();
    expect(breaks[0].querySelector(".mn-break-title")).toBeInTheDocument();
  });

  it("filtering by tag drops the photo breaks", async () => {
    const user = userEvent.setup();
    const { container } = render(<MenuBrowser categories={menu} />);
    await user.click(screen.getAllByRole("button", { pressed: false })[0]);
    expect(container.querySelector("aside.mn-break")).toBeNull();
  });

  it("has no search box", () => {
    render(<MenuBrowser categories={menu} />);
    expect(screen.queryByRole("searchbox")).toBeNull();
  });
});
