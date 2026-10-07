import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

// next/image renders a plain <img> in unit tests (no loader, no router context).
vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, quality: _quality, ...props }: Record<string, unknown>) =>
    createElement("img", props),
}));
