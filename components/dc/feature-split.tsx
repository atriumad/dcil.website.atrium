import { Button } from "./button";
import { Flower } from "./decor";
import { PhotoFrame } from "./photo-frame";
import { SectionHeader } from "./section-header";
import { cx, type Img } from "./utils";

export function FeatureSplit({
  eyebrow,
  title,
  script,
  body,
  cta,
  ctaHref = "#",
  image,
  shape = "arch",
  reverse,
  tone = "navy",
  flower,
  className,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body?: string | string[];
  cta?: string;
  ctaHref?: string;
  image?: Img;
  shape?: "arch" | "circle" | "frame";
  reverse?: boolean;
  /** rose is the one feature block per page. */
  tone?: "navy" | "navy-900" | "rose";
  flower?: boolean;
  className?: string;
}) {
  const paragraphs = (Array.isArray(body) ? body : [body]).filter(Boolean);
  return (
    <section className={cx("dc-feat", `dc-feat-${tone}`, reverse && "dc-feat-reverse", className)}>
      <div className="dc-feat-media">
        <PhotoFrame
          src={image?.src}
          alt={image?.alt}
          focus={image?.focus}
          shape={shape}
          outline={shape === "arch"}
          ratio={shape === "frame" ? "5 / 4" : undefined}
          sizes="(min-width: 860px) 460px, 90vw"
        />
        {flower ? <Flower className="dc-feat-flower" size={120} /> : null}
      </div>
      <div className="dc-feat-copy">
        <SectionHeader eyebrow={eyebrow} title={title} script={script} size="m" />
        {paragraphs.map((text, i) => (
          <p key={i} className="dc-feat-body">
            {text}
          </p>
        ))}
        {cta ? (
          <Button href={ctaHref} variant="outline" icon="arrow-right">
            {cta}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
