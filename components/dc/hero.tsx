import Image from "next/image";
import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { PhotoFrame } from "./photo-frame";
import { cx, renderAccent, scriptWord, type Img } from "./utils";

export interface HeroProps {
  /** photo: full-bleed photo under a navy scrim (default). split: copy beside an outlined arch photo. */
  variant?: "photo" | "split";
  eyebrow?: string;
  /** Wrap ONE word in *stars* for the script accent. */
  title: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  /** Button labels. Pass null to hide a button. */
  primary?: string | null;
  primaryHref?: string;
  secondary?: string | null;
  secondaryHref?: string;
  image?: Img;
  /** Photo variant only: replaces `image` on narrow screens (pass a portrait shot). */
  mobileImage?: Img;
  /** Split variant only. */
  flower?: boolean;
  className?: string;
}

export function Hero({
  variant = "photo",
  eyebrow,
  title,
  script,
  lede,
  primary = "View Menu",
  primaryHref = "#",
  secondary = "Find a Location",
  secondaryHref = "#",
  image,
  mobileImage,
  flower = true,
  className,
}: HeroProps) {
  const word = scriptWord(script);
  const copy = (
    <div className="dc-hero-copy">
      {eyebrow ? <Eyebrow align={variant === "photo" ? "center" : "left"}>{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-hero-script">{word}</span> : null}
      <h1 className="dc-hero-title">{renderAccent(title)}</h1>
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
  );

  if (variant === "split") {
    return (
      <section className={cx("dc-hero", "dc-hero-split", className)}>
        {copy}
        <div className="dc-hero-media">
          <PhotoFrame
            src={image?.src}
            alt={image?.alt}
            focus={image?.focus}
            shape="arch"
            outline
            sizes="(min-width: 900px) 440px, 90vw"
            priority
          />
          {flower ? <Flower className="dc-hero-flower" size={132} /> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={cx("dc-hero", "dc-hero-photo", className)}>
      {image ? (
        <Image
          className={cx("dc-hero-bg", mobileImage && "dc-hero-bg-wide")}
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          style={image.focus ? { objectPosition: image.focus } : undefined}
        />
      ) : null}
      {mobileImage ? (
        <Image
          className="dc-hero-bg dc-hero-bg-tall"
          src={mobileImage.src}
          alt={mobileImage.alt}
          fill
          priority
          sizes="100vw"
          quality={90}
          style={mobileImage.focus ? { objectPosition: mobileImage.focus } : undefined}
        />
      ) : null}
      <span className="dc-hero-scrim" aria-hidden="true" />
      {copy}
      <span className="dc-hero-scroll" aria-hidden="true" />
    </section>
  );
}
