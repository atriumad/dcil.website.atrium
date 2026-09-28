import { Icon } from "./icon";
import { cx, renderAccent } from "./utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  /** Wrap one word in *stars* for the italic serif accent. */
  title: string;
  lede?: string;
  align?: "left" | "center";
  size?: "l" | "m";
  tone?: "default" | "inverse";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  size = "l",
  tone = "default",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cx("dc-sh", `dc-sh-${align}`, `dc-sh-${size}`, tone === "inverse" && "dc-sh-inverse", className)}
    >
      {eyebrow ? (
        <p className="dc-sh-eyebrow">
          <Icon name="sparkle" size={14} />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="dc-sh-title">{renderAccent(title)}</h2>
      {lede ? <p className="dc-sh-lede">{lede}</p> : null}
    </header>
  );
}
