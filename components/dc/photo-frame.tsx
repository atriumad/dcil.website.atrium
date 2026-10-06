import Image from "next/image";
import type { CSSProperties } from "react";
import { Icon } from "./icon";
import { cx } from "./utils";

export interface PhotoFrameProps {
  src?: string;
  alt?: string;
  /** arch: stories (use `outline`); circle: dishes; frame: everything else. */
  shape?: "arch" | "circle" | "frame";
  ratio?: string;
  /** Marigold hairline offset 16px down-right. Give the parent `padding: 0 16px 16px 0` so it is not clipped. */
  outline?: boolean;
  caption?: string;
  /** next/image `sizes` hint; set it to the rendered width for good srcset selection. */
  sizes?: string;
  priority?: boolean;
  /** CSS object-position for the crop, e.g. "50% 35%". */
  focus?: string;
  quality?: number;
  className?: string;
  style?: CSSProperties;
}

const defaultRatio = { circle: "1", arch: "4 / 5", frame: "4 / 3" } as const;

export function PhotoFrame({
  src,
  alt = "",
  shape = "frame",
  ratio,
  outline,
  caption,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
  focus,
  quality = 90,
  className,
  style,
}: PhotoFrameProps) {
  return (
    <figure className={cx("dc-photo", `dc-photo-${shape}`, outline && "dc-photo-outline", className)} style={style}>
      <span className="dc-photo-clip" style={{ aspectRatio: ratio ?? defaultRatio[shape] }}>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} quality={quality} priority={priority} style={focus ? { objectPosition: focus } : undefined} />
        ) : (
          <span className="dc-photo-empty">
            <Icon name="utensils" size={32} />
          </span>
        )}
      </span>
      {caption ? <figcaption className="dc-photo-caption">{caption}</figcaption> : null}
    </figure>
  );
}
