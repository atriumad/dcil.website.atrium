import { Button } from "./button";
import { Flower, Pattern, Stamp, TileBand } from "./decor";
import { PhotoFrame } from "./photo-frame";
import { Pill } from "./pill";
import { cx, renderAccent, type Img } from "./utils";

export interface HeroProps {
  variant?: "split" | "poster" | "photo";
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Button labels. Pass null to hide a button. */
  primary?: string | null;
  primaryHref?: string;
  secondary?: string | null;
  secondaryHref?: string;
  image?: Img;
  plates?: Img[];
  stamp?: boolean;
  className?: string;
}

export function Hero({
  variant = "split",
  eyebrow,
  title,
  lede,
  primary = "View Menu",
  primaryHref = "#",
  secondary = "Find a Location",
  secondaryHref = "#",
  image,
  plates = [],
  stamp = true,
  className,
}: HeroProps) {
  if (variant === "photo") {
    return (
      <section className={cx("dc-hero", "dc-hero-photo", className)}>
        <Flower className="dc-hero-flower dc-hero-flower-l" size={110} />
        <Flower className="dc-hero-flower dc-hero-flower-r" size={84} />
        <div className="dc-hero-photo-copy">
          {eyebrow ? <p className="dc-hero-photo-eyebrow">{eyebrow}</p> : null}
          <h1 className="dc-hero-photo-title">{renderAccent(title)}</h1>
          {lede ? <p className="dc-hero-lede">{lede}</p> : null}
          <div className="dc-hero-ctas">
            {primary ? (
              <Button size="lg" icon="arrow-right" href={primaryHref}>
                {primary}
              </Button>
            ) : null}
            {secondary ? (
              <Button size="lg" variant="outline" href={secondaryHref}>
                {secondary}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="dc-hero-photo-media">
          <span className="dc-hero-photo-band" aria-hidden="true" />
          <div className="dc-hero-photo-img">{image ? <PhotoFrame src={image.src} alt={image.alt} shape="rounded" ratio="21 / 9" priority /> : null}</div>
          {stamp ? <Stamp tone="postmark" className="dc-hero-photo-stamp" size={120} text="DESDE LEÓN · FRESH MEX · " /> : null}
        </div>
        <TileBand height={44} edge="none" />
      </section>
    );
  }
  if (variant === "poster") {
    return (
      <section className={cx("dc-hero", "dc-hero-poster", className)}>
        <Pattern name="talavera-tile" tone="ornament" className="dc-hero-edge dc-hero-edge-l" size={64} />
        <Pattern name="talavera-tile" tone="ornament" className="dc-hero-edge dc-hero-edge-r" size={64} />
        <div className="dc-hero-poster-inner">
          {eyebrow ? <Pill tone="outline">{eyebrow}</Pill> : null}
          <h1 className="dc-hero-hand">{title}</h1>
          {lede ? <p className="dc-hero-lede">{lede}</p> : null}
          <div className="dc-hero-plates">
            {plates.slice(0, 3).map((plate, i) => (
              <PhotoFrame
                key={i}
                src={plate.src}
                alt={plate.alt}
                shape="circle"
                sizes="(min-width: 640px) 260px, 40vw"
                className={`dc-hero-plate dc-hero-plate-${i}`}
              />
            ))}
          </div>
          <div className="dc-hero-ctas">
            {primary ? (
              <Button size="lg" icon="arrow-right" href={primaryHref}>
                {primary}
              </Button>
            ) : null}
            {secondary ? (
              <Button size="lg" variant="cream" href={secondaryHref}>
                {secondary}
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cx("dc-hero", "dc-hero-split", className)}>
      <Pattern name="doodles" tone="paper-deep" className="dc-hero-doodles" size={260} />
      <div className="dc-hero-copy">
        {eyebrow ? (
          <Pill tone="rose" icon="flame">
            {eyebrow}
          </Pill>
        ) : null}
        <h1 className="dc-hero-title">{renderAccent(title)}</h1>
        {lede ? <p className="dc-hero-lede">{lede}</p> : null}
        <div className="dc-hero-ctas">
          {primary ? (
            <Button size="lg" icon="arrow-right" href={primaryHref}>
              {primary}
            </Button>
          ) : null}
          {secondary ? (
            <Button size="lg" variant="outline" iconLeft="pin" href={secondaryHref}>
              {secondary}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="dc-hero-media">
        <PhotoFrame src={image?.src} alt={image?.alt} shape="arch" sizes="(min-width: 900px) 420px, 90vw" priority className="dc-hero-arch" />
        {plates[0] ? (
          <PhotoFrame src={plates[0].src} alt={plates[0].alt} shape="circle" sizes="200px" className="dc-hero-float" />
        ) : null}
        {stamp ? <Stamp className="dc-hero-stamp" /> : null}
      </div>
    </section>
  );
}
