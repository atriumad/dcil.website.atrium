import type { ReactNode } from "react";
import { cx } from "./utils";

/** Small tracked line above a title, led by a short marigold rule. */
export function Eyebrow({ children, align = "left", className }: { children: ReactNode; align?: "left" | "center"; className?: string }) {
  return (
    <p className={cx("dc-eyebrow", align === "center" && "dc-eyebrow-center", className)}>
      <span className="dc-eyebrow-rule" aria-hidden="true" />
      {children}
    </p>
  );
}
