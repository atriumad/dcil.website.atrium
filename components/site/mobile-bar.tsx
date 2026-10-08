"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/dc";

/** Thumb-reach action bar for phones. Appears once the hero has scrolled away; the hero and the "open today" strip carry the same actions above it. */
export function MobileBar({ watch }: { watch: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.querySelector(watch);
    if (!target) {
      const frame = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <nav className={show ? "sg-mbar is-on" : "sg-mbar"} aria-label="Quick actions" inert={!show}>
      <Link href="/menu">
        <Icon name="utensils" size={18} /> Menu
      </Link>
      <Link href="/#tonight">
        <Icon name="phone" size={18} /> Call or order
      </Link>
      <Link href="/locations">
        <Icon name="clock" size={18} /> Hours
      </Link>
    </nav>
  );
}
