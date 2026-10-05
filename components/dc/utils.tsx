import type { ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** "Real-deal *Mexican* flavor" → the starred word becomes the Yellowtail script accent. */
export function renderAccent(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className="dc-accent">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

export interface LinkItem {
  label: string;
  href: string;
}

/** Plain strings keep the design system's API; objects carry a real destination. */
export function toLink(item: string | LinkItem): LinkItem {
  return typeof item === "string" ? { label: item, href: "#" } : item;
}

export interface Img {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. "50% 35%". */
  focus?: string;
}
