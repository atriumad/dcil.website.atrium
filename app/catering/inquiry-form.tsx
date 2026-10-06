"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/dc";
import { inquirySchema } from "@/lib/schemas";

export function CateringInquiryForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = inquirySchema.safeParse({
      type: "catering",
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      message: values.message,
      phone: values.phone || undefined,
      eventDate: values.eventDate || undefined,
      guestCount: values.guestCount || undefined,
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
      <div className="dc-note" role="status">
        <p className="dc-note-title">Thanks — we&rsquo;ve got it</p>
        <p>Someone from Don Chuy&rsquo;s will follow up about your event soon.</p>
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
      <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Input label="Event date" type="date" value={values.eventDate} onChange={set("eventDate")} error={errors.eventDate} />
        <Input label="Guest count" type="number" min={1} value={values.guestCount} onChange={set("guestCount")} error={errors.guestCount} />
      </div>
      <Input label="Tell us about your event" required value={values.message} onChange={set("message")} error={errors.message} />
      <Button type="submit" size="lg" icon="arrow-right" className="self-start">
        Request a Quote
      </Button>
    </form>
  );
}
