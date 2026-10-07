import type { ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Brand rule: Yellowtail is for ONE word. Returns the trimmed word, or null for phrases/empties/non-strings. */
export function scriptWord(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" && !/\s/.test(value.trim()) ? value.trim() : null;
}

/** "Real deal *Mexican* flavor" → the starred single word becomes the Yellowtail accent; a starred phrase stays plain. */
export function renderAccent(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (!(part.startsWith("*") && part.endsWith("*"))) return part;
    const inner = part.slice(1, -1);
    return scriptWord(inner) ? (
      <em key={i} className="dc-accent">
        {inner}
      </em>
    ) : (
      inner
    );
  });
}

/** True for same-site paths ("/menu"); false for "#", "https://..." and "//host". */
export const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

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
