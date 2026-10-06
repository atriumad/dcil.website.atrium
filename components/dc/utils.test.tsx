import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { isInternal, renderAccent, scriptWord, toLink } from "./utils";

describe("scriptWord", () => {
  it("returns one trimmed word", () => {
    expect(scriptWord(" Salud ")).toBe("Salud");
    expect(scriptWord("Josper-grilled")).toBe("Josper-grilled");
  });
  it("rejects phrases, empties and non-strings (the brand allows script on a single word only)", () => {
    expect(scriptWord("from our casa")).toBeNull();
    expect(scriptWord("")).toBeNull();
    expect(scriptWord("   ")).toBeNull();
    expect(scriptWord(undefined)).toBeNull();
    expect(scriptWord(42)).toBeNull();
  });
});

describe("renderAccent", () => {
  it("wraps one starred word in the script accent", () => {
    const { container } = render(<h1>{renderAccent("Real deal *Mexican* flavor")}</h1>);
    expect(container.textContent).toBe("Real deal Mexican flavor");
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("Mexican");
  });
  it("renders a starred phrase as plain text", () => {
    const { container } = render(<h1>{renderAccent("Let us *bring it* home")}</h1>);
    expect(container.textContent).toBe("Let us bring it home");
    expect(container.querySelector("em")).toBeNull();
  });
  it("leaves unstarred text untouched", () => {
    const { container } = render(<h1>{renderAccent("Find your table")}</h1>);
    expect(container.textContent).toBe("Find your table");
  });
});

describe("links", () => {
  it("tells internal paths from external and protocol-relative URLs", () => {
    expect(isInternal("/menu")).toBe(true);
    expect(isInternal("//cdn.example.com/x")).toBe(false);
    expect(isInternal("https://example.com")).toBe(false);
    expect(isInternal("#top")).toBe(false);
  });
  it("normalizes a plain string to a link", () => {
    expect(toLink("Menu")).toEqual({ label: "Menu", href: "#" });
    expect(toLink({ label: "Menu", href: "/menu" })).toEqual({ label: "Menu", href: "/menu" });
  });
});
