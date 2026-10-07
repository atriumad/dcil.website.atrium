import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";
import { Input, Newsletter } from "./forms";
import { NavBar } from "./nav-bar";

const links = [
  { label: "Menu", href: "/menu" },
  { label: "Locations", href: "/locations" },
];

describe("NavBar", () => {
  it("marks the active page and shows the logo as the brand link", () => {
    render(<NavBar links={links} active="Menu" />);
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Locations" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Don Chuy's Fresh Mex and Cantina" })).toHaveAttribute("href", "/");
  });
  it("opens and closes the mobile menu with the toggle and closes on navigation", async () => {
    const user = userEvent.setup();
    const { container } = render(<NavBar links={links} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("nav")).toHaveClass("is-open");
    await user.click(screen.getByRole("link", { name: "Menu" }));
    expect(container.querySelector("nav")).not.toHaveClass("is-open");
  });
  it("hides the CTA when cta is null", () => {
    render(<NavBar links={links} cta={null} />);
    expect(screen.queryByRole("link", { name: "Order Online" })).toBeNull();
  });
});

describe("Footer", () => {
  it("lists locations with phones and says Coming soon for one without an address", () => {
    render(
      <Footer
        locations={[
          { city: "Overland Park, KS", address: "8725 Metcalf Ave", phone: "+1 816-603-2124" },
          { city: "O'Fallon, IL" },
        ]}
        links={links}
      />,
    );
    expect(screen.getByRole("heading", { name: "Overland Park, KS" })).toBeInTheDocument();
    expect(screen.getByText("+1 816-603-2124")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute("href", "/menu");
  });
});

describe("Input", () => {
  it("links label and hint, and flags errors", () => {
    render(<Input label="Email" hint="We never share it" error="Enter a valid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.queryByText("We never share it")).toBeNull();
  });
});

describe("Newsletter", () => {
  it("reports the email on submit and does not navigate", async () => {
    const user = userEvent.setup();
    const onSubmitEmail = vi.fn();
    render(<Newsletter onSubmitEmail={onSubmitEmail} />);
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(onSubmitEmail).toHaveBeenCalledWith("ana@example.com");
  });
  it("shows a one-word script accent in a custom title", () => {
    const { container } = render(<Newsletter title="Be the *first* to know" />);
    expect(container.querySelector("em.dc-accent")?.textContent).toBe("first");
  });
});
