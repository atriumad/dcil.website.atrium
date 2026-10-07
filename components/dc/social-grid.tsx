import Image from "next/image";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { Icon } from "./icon";
import { cx, type Img } from "./utils";

export function SocialGrid({
  eyebrow = "Instagram",
  handle = "@donchuysmo",
  href = "https://www.instagram.com/donchuysmo/",
  images,
  className,
}: {
  eyebrow?: string;
  handle?: string;
  href?: string;
  images: Img[];
  className?: string;
}) {
  return (
    <section className={cx("dc-social", className)}>
      <header className="dc-social-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="dc-social-handle">{handle}</h2>
        <Button href={href} variant="link" icon="arrow-up-right">
          Follow us
        </Button>
      </header>
      <div className="dc-social-grid">
        {images.slice(0, 6).map((image) => (
          <a key={image.src} href={href} className="dc-social-tile">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 900px) 20vw, 33vw"
              quality={90}
              style={image.focus ? { objectPosition: image.focus } : undefined}
            />
            <span className="dc-social-hover">
              <Icon name="arrow-up-right" size={24} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
