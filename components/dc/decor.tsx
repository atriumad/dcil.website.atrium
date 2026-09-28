import { Fragment, useId, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx } from "./utils";

/** A colour token name from tokens.css, e.g. "sage-200". */
export type ColorToken = string;

export function TileBand({
  tone = "fiesta",
  height = 48,
  edge = "both",
  className,
}: {
  tone?: "fiesta" | "agave" | "rose" | "marigold" | "sage";
  height?: number;
  edge?: "both" | "top" | "none";
  className?: string;
}) {
  return (
    <div
      className={cx("dc-tileband", `dc-tileband-${tone}`, edge !== "none" && `dc-tileband-edge-${edge}`, className)}
      style={{ height }}
      aria-hidden="true"
    >
      <span />
    </div>
  );
}

export function Pattern({
  name = "talavera-tile",
  tone = "sage-200",
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

export function Stamp({
  text = "DESDE LEÓN · FRESH MEX & CANTINA · ",
  icon = "chile",
  size = 132,
  tone = "marigold",
  spin = true,
  className,
}: {
  text?: string;
  icon?: IconName;
  size?: number;
  tone?: "postmark" | "marigold" | "rose" | "teal" | "agave";
  spin?: boolean;
  className?: string;
}) {
  const id = "c" + useId().replace(/:/g, "");
  return (
    <div
      className={cx("dc-stamp", `dc-stamp-${tone}`, spin && tone !== "postmark" && "dc-stamp-spin", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" className="dc-stamp-ring">
        <defs>
          <path id={id} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="272">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="dc-stamp-core">
        <Icon name={icon} size={Math.round(size * 0.28)} />
      </span>
    </div>
  );
}

export function Marquee({
  items = ["Fresh Mex", "Cantina", "Happy Hour", "Daily Specials", "Family recipes"],
  tone = "rose",
  icon = "sparkle",
  speed = 40,
  outline,
  reverse,
  className,
}: {
  items?: string[];
  tone?: "rose" | "marigold" | "agave" | "navy" | "teal";
  icon?: IconName;
  speed?: number;
  outline?: boolean;
  reverse?: boolean;
  className?: string;
}) {
  // The track is duplicated so the -50% translate loops seamlessly; only the label exposes the words once.
  const run = items.map((item, i) => (
    <Fragment key={i}>
      <span className="dc-mq-item">{item}</span>
      <Icon name={icon} size={22} className="dc-mq-sep" />
    </Fragment>
  ));
  return (
    <div
      className={cx("dc-mq", `dc-mq-${tone}`, outline && "dc-mq-outline", reverse && "dc-mq-reverse", className)}
      role="marquee"
      aria-label={items.join(", ")}
    >
      <div className="dc-mq-track" style={{ animationDuration: `${speed}s` }} aria-hidden="true">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}

/* ---------- v4 editorial elements ---------- */
export function Flower({
  size = 88,
  spin,
  className,
  style,
}: {
  size?: number;
  spin?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const petals = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg
      className={cx("dc-flower", spin && "dc-flower-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={style}
    >
      {petals.map((i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="11"
          ry="22"
          transform={`rotate(${i * 45} 50 50)`}
          className={i % 2 ? "dc-flower-b" : "dc-flower-a"}
        />
      ))}
      <circle cx="50" cy="50" r="12" className="dc-flower-c" />
      <circle cx="50" cy="50" r="5" className="dc-flower-d" />
    </svg>
  );
}

export function Sunburst({
  tone = "marigold",
  rays = 24,
  children,
  className,
  style,
}: {
  tone?: "marigold" | "rose" | "teal";
  rays?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cx("dc-sun", `dc-sun-${tone}`, className)}
      style={{ "--dc-rays": `${360 / rays}deg`, ...style } as CSSProperties}
    >
      <span className="dc-sun-rays" aria-hidden="true" />
      <div className="dc-sun-content">{children}</div>
    </div>
  );
}

const CRUMBS: Array<[number, number, "leaf" | "dot" | "chip", number]> = [
  [6, 12, "leaf", 20], [14, 78, "dot", 0], [22, 30, "chip", 35], [30, 88, "leaf", -40], [42, 6, "dot", 0], [55, 94, "chip", 10],
  [66, 18, "leaf", 70], [74, 70, "dot", 0], [84, 40, "chip", -25], [90, 90, "leaf", 15], [8, 55, "chip", 50], [48, 60, "dot", 0],
  [60, 36, "leaf", -60], [94, 12, "dot", 0], [36, 48, "chip", -10], [78, 8, "leaf", 30],
];
const CRUMB_SHAPES: Record<string, string> = {
  leaf: "M2 10C2 5 6 1 12 1c1 6-3 11-10 9z",
  chip: "M1 3l8-2 4 7-6 5-6-4z",
};

export function Crumbs({
  count = 12,
  tones = ["teal", "chuy-red", "marigold", "navy"],
  scale = 1,
  className,
}: {
  count?: number;
  tones?: ColorToken[];
  scale?: number;
  className?: string;
}) {
  return (
    <div className={cx("dc-crumbs", className)} aria-hidden="true">
      {CRUMBS.slice(0, count).map(([t, l, k, r], i) => (
        <svg
          key={i}
          viewBox="0 0 14 14"
          style={{
            top: `${t}%`,
            left: `${l}%`,
            width: (k === "dot" ? 9 : 16) * scale,
            transform: `rotate(${r}deg)`,
            color: `var(--${tones[i % tones.length]})`,
          }}
        >
          {k === "dot" ? <circle cx="7" cy="7" r="6" fill="currentColor" /> : <path d={CRUMB_SHAPES[k]} fill="currentColor" />}
        </svg>
      ))}
    </div>
  );
}
