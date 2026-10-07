"use client";

import { useId, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "./button";
import { Flower } from "./decor";
import { Eyebrow } from "./eyebrow";
import { cx, renderAccent } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, id, className, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? `in${auto.replace(/:/g, "")}`;
  const describedBy = hint || error ? `${inputId}-h` : undefined;
  return (
    <div className={cx("dc-field", error && "is-error", className)}>
      {label ? (
        <label htmlFor={inputId} className="dc-field-label">
          {label}
        </label>
      ) : null}
      <input id={inputId} className="dc-input" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint || error ? (
        <p id={describedBy} className="dc-field-hint">
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}

export interface NewsletterProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  cta?: string;
  /** Called with the entered email. Without it the form only prevents the default submit (no backend yet). */
  onSubmitEmail?: (email: string) => void;
  className?: string;
}

export function Newsletter({
  eyebrow = "Newsletter",
  title = "Stay in the loop",
  lede = "New specials, events and Happy Hour news, straight to your inbox.",
  cta = "Sign Up",
  onSubmitEmail,
  className,
}: NewsletterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email === "string" && email) onSubmitEmail?.(email);
  };
  return (
    <section className={cx("dc-news", className)}>
      <Flower variant="mono" tone="navy" className="dc-news-flower" size={null} />
      <div className="dc-news-copy">
        {eyebrow ? <Eyebrow align="center">{eyebrow}</Eyebrow> : null}
        <h2 className="dc-news-title">{renderAccent(title)}</h2>
        <p className="dc-news-lede">{lede}</p>
      </div>
      <form className="dc-news-form" onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" required placeholder="you@email.com" className="dc-news-input" />
        <Button type="submit" icon="arrow-right">
          {cta}
        </Button>
      </form>
    </section>
  );
}
