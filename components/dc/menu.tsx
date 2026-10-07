import Link from "next/link";
import { Pattern } from "./decor";
import { Eyebrow } from "./eyebrow";
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
  href?: string;
  className?: string;
}

export function DishCard({ name, description, price, image, tags = [], href, className }: DishCardProps) {
  return (
    <article className={cx("dc-dish", className)}>
      <div className="dc-dish-media">
        <Pattern name="talavera-tile" tone="navy" className="dc-dish-pattern" size={64} />
        <PhotoFrame src={image?.src} alt={image?.alt} shape="circle" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 36vw, 70vw" />
      </div>
      <div className="dc-dish-body">
        <div className="dc-dish-head">
          <h3 className="dc-dish-name">{href ? <Link href={href}>{name}</Link> : name}</h3>
          {price ? <span className="dc-dish-price">{price}</span> : null}
        </div>
        {description ? <p className="dc-dish-desc">{description}</p> : null}
        {tags.length ? (
          <div className="dc-dish-tags">
            {tags.map((tag) => (
              <Pill key={tag} icon={tag === "Spicy" ? "chile" : undefined}>
                {tag}
              </Pill>
            ))}
          </div>
        ) : null}
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
            <Icon key={tag} name={tagIcon(tag)} size={15} title={tag} className="dc-mi-tag" />
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
  className?: string;
}

export function SpecialRow({ day, item, price, note, className }: SpecialRowProps) {
  return (
    <div className={cx("dc-special", className)}>
      <span className="dc-special-day">{day}</span>
      <span className="dc-special-body">
        <span className="dc-special-item">{item}</span>
        {note ? <span className="dc-special-note">{note}</span> : null}
      </span>
      {price ? <span className="dc-special-price">{price}</span> : null}
    </div>
  );
}

export function SpecialsBoard({
  eyebrow,
  title = "Daily Specials",
  specials = [],
  drinksTitle = "Everyday drinks",
  drinks = [],
  className,
}: {
  eyebrow?: string;
  title?: string;
  specials: SpecialRowProps[];
  drinksTitle?: string;
  drinks?: { name: string; price: string; icon?: IconName }[];
  className?: string;
}) {
  return (
    <section className={cx("dc-board", className)}>
      <div className="dc-board-inner">
        {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
        <h2 className="dc-board-title">{title}</h2>
        <div className="dc-board-rows">
          {specials.map((special) => (
            <SpecialRow key={special.day} {...special} />
          ))}
        </div>
        {drinks.length ? (
          <div className="dc-board-drinks">
            <p className="dc-board-drinks-title">{drinksTitle}</p>
            <div className="dc-board-drinklist">
              {drinks.map((drink) => (
                <span key={drink.name}>
                  <Icon name={drink.icon ?? "margarita"} size={20} />
                  {drink.name}
                  <b>{drink.price}</b>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
