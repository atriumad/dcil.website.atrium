import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export interface PillProps {
  tone?: "outline" | "agave" | "navy" | "teal" | "white" | "marigold" | "rose" | "ink";
  size?: "md" | "sm";
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Pill({ tone = "outline", size = "md", icon, className, children }: PillProps) {
  return (
    <span className={cx("dc-pill", `dc-pill-${tone}`, size === "sm" && "dc-pill-sm", className)}>
      {icon ? <Icon name={icon} size={size === "sm" ? 14 : 16} /> : null}
      {children}
    </span>
  );
}
