import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

export type ButtonVariant = "primary" | "rose" | "agave" | "navy" | "teal" | "marigold" | "ink" | "cream" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a link instead of a button. Internal paths use next/link. */
  href?: string;
  /** Trailing icon. */
  icon?: IconName;
  iconLeft?: IconName;
  children: ReactNode;
}

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconLeft,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cx("dc-btn", `dc-btn-${variant}`, `dc-btn-${size}`, className);
  const iconSize = size === "lg" ? 20 : 18;
  const content = (
    <>
      {iconLeft ? <Icon name={iconLeft} size={iconSize} /> : null}
      <span>{children}</span>
      {icon ? <Icon name={icon} size={iconSize} className="dc-btn-icon" /> : null}
    </>
  );

  if (href) {
    return isInternal(href) ? (
      <Link href={href} className={cls}>
        {content}
      </Link>
    ) : (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}
