import Image from "next/image";
import type { CSSProperties } from "react";
import type { ColorToken } from "./decor";
import { Icon } from "./icon";
import { Pill } from "./pill";
import { cx } from "./utils";

export interface PhotoFrameProps {
  src?: string;
  alt?: string;
  shape?: "arch" | "circle" | "rounded" | "ticket" | "polaroid";
  ratio?: string;
  sticker?: string;
  stickerTone?: "white" | "marigold" | "rose";
  ground?: ColorToken;
  /** next/image `sizes` hint; set it to the rendered width for good srcset selection. */
  sizes?: string;
  priority?: boolean;
  /** CSS object-position for the crop, e.g. "50% 35%". */
  focus?: string;
  quality?: number;
  className?: string;
  style?: CSSProperties;
}

const defaultRatio = { circle: "1", arch: "4 / 5", rounded: "4 / 3", ticket: "4 / 3", polaroid: "4 / 5" } as const;

export function PhotoFrame({
  src,
  alt = "",
  shape = "arch",
  ratio,
  sticker,
  stickerTone = "white",
  ground,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
  focus,
  quality = 90,
  className,
  style,
}: PhotoFrameProps) {
  const groundVar = ground ? ({ "--dc-ground": `var(--${ground})` } as CSSProperties) : undefined;
  return (
    <figure
      className={cx("dc-photo", `dc-photo-${shape}`, ground && "dc-photo-ground", className)}
      style={{ aspectRatio: ratio ?? defaultRatio[shape], ...groundVar, ...style }}
    >
      {shape === "polaroid" ? <span className="dc-photo-tape" aria-hidden="true" /> : null}
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} quality={quality} priority={priority} style={focus ? { objectPosition: focus } : undefined} />
      ) : (
        <span className="dc-photo-empty">
          <Icon name="utensils" size={32} />
        </span>
      )}
      {sticker ? (
        <Pill tone={stickerTone} className="dc-photo-sticker">
          {sticker}
        </Pill>
      ) : null}
    </figure>
  );
}
