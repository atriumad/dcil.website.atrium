import Link from "next/link";
import { Pattern } from "./decor";
import { Icon, type IconName } from "./icon";
import { PhotoFrame } from "./photo-frame";
import { Pill } from "./pill";
import { cx, type Img } from "./utils";

export interface DishCardProps {
  name: string;
  description?: string;
  price?: string;
  image?: Img;
  tags?: string[];
  variant?: "plate" | "photo";
  href?: string;
  className?: string;
}

export function DishCard({ name, description, price, image, tags = [], variant = "plate", href, className }: DishCardProps) {
  return (
    <article className={cx("dc-dish", `dc-dish-${variant}`, className)}>
      <div className="dc-dish-media">
        {variant === "plate" ? <Pattern name="talavera-tile" tone="sage-200" className="dc-dish-pattern" size={56} /> : null}
        <PhotoFrame
          src={image?.src}
          alt={image?.alt}
          shape={variant === "plate" ? "circle" : "rounded"}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        />
        {price ? <span className="dc-dish-price">{price}</span> : null}
      </div>
      <div className="dc-dish-body">
        {tags.length ? (
          <div className="dc-dish-tags">
            {tags.map((tag) => (
              <Pill key={tag} size="sm" tone={tag === "Spicy" ? "rose" : "navy"} icon={tag === "Spicy" ? "chile" : undefined}>
                {tag}
              </Pill>
            ))}
          </div>
        ) : null}
        <h3 className="dc-dish-name">{href ? <Link href={href}>{name}</Link> : name}</h3>
        {description ? <p className="dc-dish-desc">{description}</p> : null}
      </div>
    </article>
  );
}

export interface MenuItemProps {
  name: string;
  /** Pass an empty string to omit the price (items whose real price is not confirmed yet). */
  price: string;
  description?: string;
  tags?: Array<"Spicy" | "Veggie" | (string & {})>;
  featured?: boolean;
  className?: string;
}

const tagIcon = (tag: string): IconName => (tag === "Spicy" ? "chile" : tag === "Veggie" ? "avocado" : "sparkle");

export function MenuItem({ name, description, price, tags = [], featured, className }: MenuItemProps) {
  return (
    <div className={cx("dc-mi", featured && "dc-mi-featured", className)}>
      <div className="dc-mi-head">
        <span className="dc-mi-name">
          {name}
          {tags.map((tag) => (
            <Icon key={tag} name={tagIcon(tag)} size={16} title={tag} className="dc-mi-tag" />
          ))}
        </span>
        {price ? (
          <>
            <span className="dc-mi-dots" aria-hidden="true" />
            <span className="dc-mi-price">{price}</span>
          </>
        ) : null}
      </div>
      {description ? <p className="dc-mi-desc">{description}</p> : null}
    </div>
  );
}

export function MenuSection({
  title,
  note,
  items = [],
  id,
  className,
}: {
  title: string;
  note?: string;
  items: MenuItemProps[];
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cx("dc-ms", className)}>
      <header className="dc-ms-head">
        <h3 className="dc-ms-title">{title}</h3>
        {note ? <span className="dc-ms-note">{note}</span> : null}
      </header>
      <div className="dc-ms-list">
        {items.map((item) => (
          <MenuItem key={item.name} {...item} />
        ))}
      </div>
    </section>
  );
}

export interface SpecialRowProps {
  day: string;
  item: string;
  price?: string;
  note?: string;
  onDark?: boolean;
  className?: string;
}

export function SpecialRow({ day, item, price, note, onDark, className }: SpecialRowProps) {
  return (
    <div className={cx("dc-special", onDark && "dc-special-dark", className)}>
      <span className="dc-pill dc-pill-navy dc-special-day">{day}</span>
      <span className="dc-special-body">
        <span className="dc-special-item">
          {item}
          {price ? " " : null}
          {price ? <b className="dc-special-price">{price}</b> : null}
        </span>
        {note ? <span className="dc-special-note">{note}</span> : null}
      </span>
    </div>
  );
}

export function SpecialsBoard({
  title = "DA!LY SPEC!ALS",
  subtitle = "Every day a special — all day",
  specials = [],
  drinks = [],
  plate,
  className,
}: {
  title?: string;
  subtitle?: string;
  specials: SpecialRowProps[];
  drinks?: { name: string; price: string; icon?: IconName }[];
  /** Floating cutout dish photo with an animated dashed orbit ring, echoing the print posters. */
  plate?: Img;
  className?: string;
}) {
  return (
    <section className={cx("dc-board", className)}>
      <Pattern name="talavera-tile" tone="ornament" className="dc-board-edge dc-board-edge-l" size={56} />
      <Pattern name="talavera-tile" tone="ornament" className="dc-board-edge dc-board-edge-r" size={56} />
      {plate ? (
        <div className="dc-board-plate" aria-hidden="true">
          <svg className="dc-orbit dc-orbit-spin" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" />
          </svg>
          <PhotoFrame src={plate.src} alt={plate.alt} shape="circle" />
        </div>
      ) : null}
      <div className="dc-board-inner">
        <h2 className="dc-board-title">{title}</h2>
        {subtitle ? <p className="dc-board-sub">{subtitle}</p> : null}
        <div className="dc-board-rows">
          {specials.map((special) => (
            <SpecialRow key={special.day} {...special} />
          ))}
        </div>
        {drinks.length ? (
          <div className="dc-board-drinks">
            <Pill tone="outline">Everyday drinks</Pill>
            <div className="dc-board-drinklist">
              {drinks.map((drink) => (
                <span key={drink.name}>
                  <Icon name={drink.icon ?? "margarita"} size={22} />
                  {drink.name} <b>{drink.price}</b>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
