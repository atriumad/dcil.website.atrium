"use client";

import type { FormEvent } from "react";
import { Button, Eyebrow, Input } from "@/components/dc";

/** Newsletter form for the deep card at the foot of every page. No backend yet: it only prevents the default submit. */
export function SgNewsletter({ title = "Stay in the loop" }: { title?: string }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  return (
    <form className="sg-news-form" onSubmit={onSubmit}>
      <Eyebrow align="center">Newsletter</Eyebrow>
      <h2 className="sg-h3 sg-on-dark">{title}</h2>
      <p className="sg-body sg-on-dark sg-news-lede">New specials, events and Happy Hour news, straight to your inbox.</p>
      <div className="sg-news-row">
        <Input label="Email" name="email" type="email" autoComplete="email" required placeholder="you@email.com" className="sg-news-input" />
        <Button type="submit" icon="arrow-right">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
