import { Eyebrow } from "./eyebrow";
import { cx, renderAccent, scriptWord } from "./utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  /** Wrap ONE word in *stars* for the script accent. */
  title: string;
  /** One word in Yellowtail above the title. A phrase is ignored. */
  script?: string;
  lede?: string;
  align?: "left" | "center";
  size?: "l" | "m";
  className?: string;
}

export function SectionHeader({ eyebrow, title, script, lede, align = "left", size = "l", className }: SectionHeaderProps) {
  const word = scriptWord(script);
  return (
    <header className={cx("dc-sh", `dc-sh-${align}`, `dc-sh-${size}`, className)}>
      {eyebrow ? <Eyebrow align={align}>{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-sh-script">{word}</span> : null}
      <h2 className="dc-sh-title">{renderAccent(title)}</h2>
      {lede ? <p className="dc-sh-lede">{lede}</p> : null}
    </header>
  );
}
