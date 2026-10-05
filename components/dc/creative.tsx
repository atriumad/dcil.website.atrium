import { Fragment, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { Crumbs, Flower, Stamp } from "./decor";
import { Icon, type IconName } from "./icon";
import { PhotoFrame } from "./photo-frame";
import { cx, renderAccent, type Img } from "./utils";

export type StickerKind = "label" | "script" | "burst" | "seal" | "tape";
export interface StickerSpec {
  kind: StickerKind;
  text: string;
  tone?: "rose" | "agave" | "marigold";
  pos?: "tl" | "tr" | "bl" | "br";
}

const ROTATE_BY_KIND: Record<StickerKind, number> = { label: -8, script: -10, burst: 8, seal: 0, tape: -4 };

/** children: text with \n line breaks for label/burst. */
export function Sticker({
  kind = "label",
  tone,
  rotate,
  children,
  className,
  style,
}: {
  kind?: StickerKind;
  tone?: "rose" | "agave" | "marigold";
  rotate?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const txt =
    typeof children === "string"
      ? children.split("\n").map((line, i, arr) => (
          <Fragment key={i}>
            {line}
            {i < arr.length - 1 ? <br /> : null}
          </Fragment>
        ))
      : children;
  const st = { "--dc-rot": `${rotate ?? ROTATE_BY_KIND[kind]}deg`, ...style } as CSSProperties;

  if (kind === "burst") {
    return (
      <span className={cx("dc-stk", "dc-stk-burst", `dc-stk-${tone ?? "marigold"}`, className)} style={st}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 2l8 14 15-7 2 16 16 1-6 15 13 10-13 9 6 15-16 1-2 16-15-7-8 14-8-14-15 7-2-16-16-1 6-15L3 55l13-9-6-15 16-1 2-16 15 7z" />
        </svg>
        <b>{txt}</b>
      </span>
    );
  }
  if (kind === "seal") {
    return (
      <span className={cx("dc-stk", "dc-stk-seal", className)} style={st}>
        <Stamp
          size={typeof style?.width === "number" ? style.width : 108}
          spin={false}
          tone={tone === "agave" ? "agave" : tone === "rose" ? "rose" : "marigold"}
          icon="agave"
          text={typeof children === "string" ? children : "FROM OUR CASA · TO YOURS · "}
        />
      </span>
    );
  }
  return (
    <span className={cx("dc-stk", `dc-stk-${kind}`, tone && `dc-stk-${tone}`, className)} style={st}>
      {txt}
    </span>
  );
}

const STICKER_POS: Record<NonNullable<StickerSpec["pos"]>, CSSProperties> = {
  tl: { top: "7%", left: "5%" },
  tr: { top: "8%", right: "5%" },
  bl: { bottom: "8%", left: "5%" },
  br: { bottom: "8%", right: "5%" },
};

export function WordStack({
  word = "FAJITAS",
  lines = 3,
  image,
  tone = "teal",
  outline = true,
  script,
  stickers = [],
  crumbs = true,
  height,
  className,
}: {
  word?: string;
  lines?: number;
  image?: Img;
  tone?: "teal" | "navy" | "rose" | "marigold" | "sage" | "cream";
  outline?: boolean;
  script?: string;
  stickers?: StickerSpec[];
  crumbs?: boolean;
  height?: number | string;
  className?: string;
}) {
  const w = word.replace(/\*/g, "").toUpperCase();
  const rows = Array.from({ length: lines }, (_, i) => i);
  return (
    <div
      className={cx("dc-ws", `dc-ws-${tone}`, className)}
      style={{ "--dc-chars": Math.max(w.length, 6), ...(height ? { height } : null) } as CSSProperties}
    >
      <div className="dc-ws-words" aria-hidden={image ? undefined : true}>
        {rows.map((i) => (
          <span key={i} className={cx("dc-ws-row", outline && i % 2 === 1 && "dc-ws-row-outline")}>
            {w}
          </span>
        ))}
      </div>
      {crumbs ? <Crumbs count={12} /> : null}
      {image ? <PhotoFrame src={image.src} alt={image.alt} shape="circle" className="dc-ws-plate" /> : null}
      {script ? <span className="dc-ws-script">{script}</span> : null}
      {stickers.map((s, i) => (
        <Sticker key={i} kind={s.kind} tone={s.tone} className="dc-ws-sticker" style={STICKER_POS[s.pos ?? "br"]}>
          {s.text}
        </Sticker>
      ))}
    </div>
  );
}

const PAPER_BITS: Array<["script" | "bold" | "caps" | "icon", string]> = [
  ["script", "sassy salsa"], ["bold", "LET'S TACO\n'BOUT IT"], ["icon", "chile"], ["caps", "DON CHUY'S"], ["script", "hola, amigo"],
  ["icon", "lime"], ["bold", "FRESH\nMEX"], ["caps", "CANTINA"], ["script", "from our casa"], ["icon", "taco"], ["bold", "SPICY\nSOUL"],
  ["caps", "LEÓN · MX"], ["icon", "agave"], ["script", "muy rico"], ["bold", "ALL DAY\nSPECIALS"], ["icon", "margarita"],
];
const PAPER_INKS = ["chuy-rose", "navy", "marigold-700", "teal-700"];
const PAPER_ROTATIONS = [-12, 8, -4, 14, -8, 4, -16, 10];

export function BrandPaper({
  tone = "paper",
  density = 16,
  children,
  className,
  style,
}: {
  tone?: "paper" | "cream" | "white";
  density?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cx("dc-paper", `dc-paper-${tone}`, className)} style={style}>
      <div className="dc-paper-print" aria-hidden="true">
        {Array.from({ length: density }, (_, i) => {
          const [kind, text] = PAPER_BITS[i % PAPER_BITS.length];
          const rotate = PAPER_ROTATIONS[i % PAPER_ROTATIONS.length];
          const ink = `var(--${PAPER_INKS[i % PAPER_INKS.length]})`;
          return (
            <span key={i} className={`dc-paper-bit dc-paper-${kind}`} style={{ color: ink, transform: `rotate(${rotate}deg)` }}>
              {kind === "icon" ? (
                <Icon name={text as IconName} size={34} />
              ) : (
                text.split("\n").map((line, j) => <span key={j}>{line}</span>)
              )}
            </span>
          );
        })}
      </div>
      {children ? <div className="dc-paper-content">{children}</div> : null}
    </div>
  );
}

export function PosterCard({
  word,
  image,
  tone = "teal",
  script,
  sticker,
  title,
  meta,
  href = "#",
  className,
}: {
  word: string;
  image?: Img;
  tone?: "teal" | "navy" | "rose" | "marigold" | "sage" | "cream";
  script?: string;
  sticker?: string;
  title: string;
  meta?: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cx("dc-poster", className)}>
      <WordStack
        word={word}
        image={image}
        tone={tone}
        script={script}
        lines={3}
        stickers={sticker ? [{ kind: "label", text: sticker, pos: "br" }] : []}
        className="dc-poster-art"
      />
      <span className="dc-poster-foot">
        <span>
          <b className="dc-poster-title">{title}</b>
          {meta ? <span className="dc-poster-meta">{meta}</span> : null}
        </span>
        <span className="dc-poster-go">
          <Icon name="arrow-up-right" size={20} />
        </span>
      </span>
    </Link>
  );
}

export interface CategoryGridItem {
  name: string;
  note?: string;
  image?: Img;
  icon?: IconName;
  tone?: "rose" | "agave" | "marigold" | "sage" | "teal" | "navy";
  href?: string;
}

export function CategoryGrid({ items, className }: { items: CategoryGridItem[]; className?: string }) {
  const tones: CategoryGridItem["tone"][] = ["rose", "teal", "marigold", "navy"];
  return (
    <div className={cx("dc-cats", className)}>
      {items.map((item, i) => (
        <Link key={item.name} href={item.href || "#"} className={cx("dc-cat", `dc-cat-${item.tone ?? tones[i % tones.length]}`)}>
          <span className="dc-cat-name">{item.name}</span>
          {item.note ? <span className="dc-cat-note">{item.note}</span> : null}
          {item.image ? (
            <PhotoFrame src={item.image.src} alt={item.image.alt} shape="circle" className="dc-cat-plate" />
          ) : (
            <span className="dc-cat-icon">
              <Icon name={item.icon ?? "utensils"} size={72} strokeWidth={1.6} />
            </span>
          )}
          <span className="dc-cat-go">
            <Icon name="arrow-right" size={22} />
          </span>
        </Link>
      ))}
    </div>
  );
}

export interface ValuePropItem {
  icon: IconName;
  title: string;
  script?: string;
  text: string;
}

export function ValueProps({ items, className }: { items: ValuePropItem[]; className?: string }) {
  return (
    <div className={cx("dc-vp", className)}>
      {items.map((item, i) => (
        <div key={item.title} className="dc-vp-item">
          <span className={`dc-vp-icon dc-vp-icon-${i % 4}`}>
            <Icon name={item.icon} size={34} />
          </span>
          <h3 className="dc-vp-title">{item.title}</h3>
          {item.script ? <span className="dc-vp-script">{item.script}</span> : null}
          <p className="dc-vp-text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function SocialGrid({
  handle = "@donchuysmo",
  href = "https://www.instagram.com/donchuysmo/",
  script = "follow the flavor",
  images,
  className,
}: {
  handle?: string;
  href?: string;
  script?: string;
  images: Img[];
  className?: string;
}) {
  return (
    <section className={cx("dc-social", className)}>
      <header className="dc-social-head">
        <span className="dc-social-script">{script}</span>
        <h2 className="dc-social-handle">{handle}</h2>
        <Button href={href} variant="outline" icon="arrow-up-right">
          Follow on Instagram
        </Button>
      </header>
      <div className="dc-social-grid">
        {images.slice(0, 6).map((image, i) => (
          <a key={image.src} href={href} className={cx("dc-social-tile", `dc-social-tile-${i}`)}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 20vw, 33vw" quality={90} style={image.focus ? { objectPosition: image.focus } : undefined} />
            <span className="dc-social-hover">
              <Icon name="arrow-up-right" size={28} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ColorSplit({
  tone = "marigold",
  eyebrow,
  title,
  body,
  cta,
  ctaHref = "#",
  image,
  caption,
  stamp = "DESDE LEÓN · TO YOUR TABLE · ",
  reverse,
  className,
}: {
  tone?: "marigold" | "rose" | "teal" | "navy";
  eyebrow?: string;
  title: string;
  body?: string | string[];
  cta?: string;
  ctaHref?: string;
  image?: Img;
  caption?: string;
  stamp?: string | null;
  reverse?: boolean;
  className?: string;
}) {
  const paragraphs = (Array.isArray(body) ? body : [body]).filter(Boolean);
  return (
    <section className={cx("dc-split", `dc-split-${tone}`, reverse && "dc-split-reverse", className)}>
      <div className="dc-split-copy">
        {eyebrow ? <span className="dc-split-eyebrow">{eyebrow}</span> : null}
        <h2 className="dc-split-title">{renderAccent(title)}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="dc-split-body">
            {p}
          </p>
        ))}
        {cta ? (
          <Button href={ctaHref} variant={tone === "marigold" ? "navy" : "marigold"} size="sm">
            {cta}
          </Button>
        ) : null}
      </div>
      <div className="dc-split-art">
        <div className="dc-split-tiles" aria-hidden="true" />
        {image ? <PhotoFrame src={image.src} alt={image.alt} focus={image.focus} shape="polaroid" sizes="(min-width: 860px) 320px, 60vw" className="dc-split-photo" /> : null}
        {caption ? (
          <Sticker kind="label" tone="rose" className="dc-split-caption">
            {caption}
          </Sticker>
        ) : null}
        {stamp ? <Stamp tone="postmark" size={112} text={stamp} className="dc-split-stamp" icon="chile" /> : null}
        <Flower size={70} className="dc-split-flower" />
      </div>
    </section>
  );
}
