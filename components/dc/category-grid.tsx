import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cx, isInternal, type Img } from "./utils";

export interface CategoryGridItem {
  name: string;
  href?: string;
  /** Full-bleed photo under a navy veil. Without it the tile shows `icon` (default utensils). */
  image?: Img;
  icon?: IconName;
}

function Tile({ item, index }: { item: CategoryGridItem; index: number }) {
  const href = item.href ?? "#";
  const body: ReactNode = (
    <>
      {item.image ? (
        <Image
          className="dc-cat-img"
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 560px) 50vw, 100vw"
          quality={90}
          style={item.image.focus ? { objectPosition: item.image.focus } : undefined}
        />
      ) : (
        <span className="dc-cat-icon">
          <Icon name={item.icon ?? "utensils"} size={88} strokeWidth={1} />
        </span>
      )}
      <span className="dc-cat-scrim" aria-hidden="true" />
      <span className="dc-cat-num">{String(index + 1).padStart(2, "0")}</span>
      <span className="dc-cat-foot">
        <span className="dc-cat-name">{item.name}</span>
        <span className="dc-cat-go">
          <Icon name="arrow-right" size={18} />
        </span>
      </span>
    </>
  );
  return isInternal(href) ? (
    <Link href={href} className="dc-cat">
      {body}
    </Link>
  ) : (
    <a href={href} className="dc-cat">
      {body}
    </a>
  );
}

export function CategoryGrid({ items, className }: { items: CategoryGridItem[]; className?: string }) {
  return (
    <div className={cx("dc-cats", className)}>
      {items.map((item, i) => (
        <Tile key={item.name} item={item} index={i} />
      ))}
    </div>
  );
}
