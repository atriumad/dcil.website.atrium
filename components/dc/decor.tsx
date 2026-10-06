import { Fragment, type CSSProperties } from "react";
import { Icon } from "./icon";
import { cx } from "./utils";

/** A colour token name from tokens.css, e.g. "navy-700". */
export type ColorToken = string;

/** Tone-on-tone talavera strip. Hairline rules top and bottom by default. */
export function TileBand({ height = 40, rules = true, className }: { height?: number; rules?: boolean; className?: string }) {
  return (
    <div className={cx("dc-tileband", rules && "dc-tileband-rules", className)} style={{ height }} aria-hidden="true">
      <span />
    </div>
  );
}

export function Pattern({
  name = "talavera-tile",
  tone = "navy-700",
  size,
  className,
  style,
}: {
  name?: "talavera-tile" | "doodles" | "diamond" | "scallop";
  tone?: ColorToken;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx("dc-pattern", className)}
      style={{
        backgroundColor: `var(--${tone})`,
        WebkitMaskImage: `var(--dc-pattern-${name})`,
        maskImage: `var(--dc-pattern-${name})`,
        WebkitMaskSize: size ? `${size}px` : undefined,
        maskSize: size ? `${size}px` : undefined,
        ...style,
      }}
    />
  );
}

/** Official badge. It carries its own white ground: only on navy, navy-900, rose or a dark photo. Min width 56px. */
export function Logo({
  size = 120,
  label = "Don Chuy's Fresh Mex and Cantina",
  className,
  style,
}: {
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return <span role="img" aria-label={label} className={cx("dc-logo", className)} style={{ width: size, ...style }} />;
}

/** Brand flower: small full-colour accent, or a one-ink watermark. `size={null}` lets CSS decide the width. */
export function Flower({
  variant = "color",
  tone = "navy-700",
  size = 96,
  spin,
  className,
  style,
}: {
  variant?: "color" | "mono";
  tone?: ColorToken;
  size?: number | null;
  spin?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx("dc-flower", variant === "color" ? "dc-flower-color" : "dc-flower-mono", spin && "dc-flower-spin", className)}
      style={{
        width: size ?? undefined,
        ...(variant === "mono" ? { backgroundColor: `var(--${tone})` } : null),
        ...style,
      }}
    />
  );
}

export function Marquee({
  items = ["Fresh Mex", "Cantina", "Desde León", "Daily Specials", "Family recipes"],
  speed = 60,
  reverse,
  className,
}: {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  // The track is duplicated so the -50% translate loops seamlessly; only the label exposes the words once.
  const run = items.map((item, i) => (
    <Fragment key={i}>
      <span className="dc-mq-item">{item}</span>
      <Icon name="sparkle" size={14} className="dc-mq-sep" />
    </Fragment>
  ));
  return (
    <div className={cx("dc-mq", reverse && "dc-mq-reverse", className)} role="marquee" aria-label={items.join(", ")}>
      <div className="dc-mq-track" style={{ animationDuration: `${speed}s` }} aria-hidden="true">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}
