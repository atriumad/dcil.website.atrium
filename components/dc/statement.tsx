import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { cx, renderAccent, scriptWord } from "./utils";

/** Centered brand statement: eyebrow, title, short body, flower mark. */
export function Statement({
  eyebrow,
  title,
  script,
  body,
  className,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body?: string;
  className?: string;
}) {
  const word = scriptWord(script);
  return (
    <section className={cx("dc-statement", className)}>
      {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
      {word ? <span className="dc-sh-script">{word}</span> : null}
      <h2 className="dc-statement-title">{renderAccent(title)}</h2>
      {body ? <p className="dc-statement-body">{body}</p> : null}
      <Flower className="dc-statement-mark" size={64} />
    </section>
  );
}
