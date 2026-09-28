"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/dc";
import { inquirySchema } from "@/lib/schemas";

export function ContactInquiryForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = inquirySchema.safeParse({
      type: "contact",
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      message: values.message,
      phone: values.phone || undefined,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    // No backend endpoint exists yet — this only validates and confirms locally.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="dc-mi-featured rounded-[var(--radius-md)] p-[var(--space-5)]">
        <p className="h-sans">Message sent!</p>
        <p className="body mt-2">Thanks for reaching out — someone from Don Chuy&rsquo;s will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-4)]">
      <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Input label="First name" required value={values.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Input label="Last name" required value={values.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Input label="Email" type="email" required value={values.email} onChange={set("email")} error={errors.email} />
        <Input label="Phone" type="tel" value={values.phone} onChange={set("phone")} error={errors.phone} />
      </div>
      <Input label="Message" required value={values.message} onChange={set("message")} error={errors.message} />
      <Button type="submit" size="lg" icon="arrow-right" className="self-start">
        Send Message
      </Button>
    </form>
  );
}
