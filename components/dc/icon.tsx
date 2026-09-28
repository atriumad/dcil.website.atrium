import { iconPaths, type IconName } from "./icon-paths";
import { cx } from "./utils";

export type { IconName };

export interface IconProps {
  name: IconName;
  size?: number;
  /** Gives the icon an accessible name; without it the icon is decorative (aria-hidden). */
  title?: string;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ name, size = 24, title, className, strokeWidth }: IconProps) {
  const markup = iconPaths[name];
  if (!markup) return null;
  return (
    <svg
      className={cx("dc-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
