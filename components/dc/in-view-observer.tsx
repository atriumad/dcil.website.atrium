"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Elements whose hover motion has a touch equivalent in app/dc.css (`.is-inview`). */
const TARGETS = [
  ".dc-cat",
  ".dc-loc",
  ".dc-dish",
  ".dc-ws",
  ".dc-poster",
  ".dc-social-tile",
  ".dc-split-photo",
  ".mn-break",
  ".mn-cat",
].join(",");

/**
 * Touch devices have no hover, so the motion that hover triggers on desktop is driven by
 * viewport visibility instead. Toggles `is-inview` on each target while it is on screen
 * (and removes it when it leaves, so the motion replays on re-entry). Desktop and
 * reduced-motion users are left untouched: `has-motion` is never set, so the CSS never hides anything.
 */
export function InViewObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || reduced) return;

    const root = document.documentElement;
    root.classList.add("has-motion", "motion-init");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle("is-inview", entry.isIntersecting);
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    const seen = new WeakSet<Element>();
    const observe = () => {
      document.querySelectorAll(TARGETS).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Stagger siblings of the same kind (cards in a grid) by their position.
        const siblings = el.parentElement ? [...el.parentElement.children].filter((s) => s.className === el.className) : [el];
        (el as HTMLElement).style.setProperty("--i", String(siblings.indexOf(el) % 4));
        observer.observe(el);
      });
    };
    observe();

    // Client-side filters (menu) mount new targets after hydration.
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Skip the transition for the initial hidden state so nothing visibly fades out on load.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("motion-init")));

    return () => {
      cancelAnimationFrame(raf);
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("has-motion", "motion-init");
      document.querySelectorAll(".is-inview").forEach((el) => el.classList.remove("is-inview"));
    };
  }, [pathname]);

  return null;
}
