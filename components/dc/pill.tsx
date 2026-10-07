import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export interface PillProps {
  tone?: "outline" | "marigold" | "ivory";
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Pill({ tone = "outline", icon, className, children }: PillProps) {
  return (
    <span className={cx("dc-pill", `dc-pill-${tone}`, className)}>
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}
