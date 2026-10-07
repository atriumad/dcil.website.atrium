"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Button, Input } from "@/components/dc";
import { locations } from "@/data/locations";
import { inquirySchema, type InquiryType } from "@/lib/schemas";

const types: { value: Exclude<InquiryType, "notify-ofallon">; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "catering", label: "Catering" },
  { value: "event", label: "Event" },
];

const isType = (value: string | null): value is (typeof types)[number]["value"] => types.some((t) => t.value === value);

/** One form for general questions, catering and events (rebuild guide: contact / catering live together). */
export function ContactInquiryForm({ initialType }: { initialType?: string }) {
  // The /catering redirect lands on /contact?type=catering (read in the browser only, so the server render stays "general").
  const urlType = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("type"),
    () => null,
  );
  const [pickedType, setPickedType] = useState<(typeof types)[number]["value"] | null>(null);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const type = pickedType ?? (isType(urlType) ? urlType : isType(initialType ?? null) ? (initialType as (typeof types)[number]["value"]) : "general");

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const withEventFields = type !== "general";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = inquirySchema.safeParse({
      type,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      message: values.message,
      phone: values.phone || undefined,
      location: values.location || undefined,
      eventDate: withEventFields ? values.eventDate || undefined : undefined,
      guestCount: withEventFields ? values.guestCount || undefined : undefined,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    // No backend endpoint exists yet — this only validates and confirms locally. Recipient inbox still to be confirmed.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="dc-note" role="status">
        <p className="dc-note-title">Thanks for submitting!</p>
        <p>We would love to hear from you — someone from Don Chuy&rsquo;s will get back to you soon.</p>
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
        <div className="dc-field">
          <label htmlFor="inq-type" className="dc-field-label">
            Inquiry type
          </label>
          <select id="inq-type" className="dc-input dc-select" value={type} onChange={(e) => setPickedType(e.target.value as (typeof types)[number]["value"])}>
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="dc-field">
          <label htmlFor="inq-location" className="dc-field-label">
            Location
          </label>
          <select id="inq-location" className="dc-input dc-select" value={values.location} onChange={set("location")}>
            <option value="">Any location</option>
            {locations
              .filter((l) => !l.comingSoon)
              .map((l) => (
                <option key={l.slug} value={l.name}>
                  {l.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      {withEventFields ? (
        <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
          <Input label="Event date" type="date" value={values.eventDate} onChange={set("eventDate")} error={errors.eventDate} />
          <Input label="Guest count" type="number" min={1} value={values.guestCount} onChange={set("guestCount")} error={errors.guestCount} />
        </div>
      ) : null}
      <div className="dc-field">
        <label htmlFor="inq-message" className="dc-field-label">
          Write a message
        </label>
        <textarea
          id="inq-message"
          className="dc-input dc-textarea"
          rows={4}
          required
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message ? <p className="dc-field-hint">{errors.message}</p> : null}
      </div>
      <Button type="submit" size="lg" icon="arrow-right" className="self-start">
        Submit
      </Button>
    </form>
  );
}
