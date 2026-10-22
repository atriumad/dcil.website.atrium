"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/dc";
import { cateringPackages } from "@/data/catering";
import { eventRequestSchema, type EventRequestType } from "@/lib/schemas";

const tabs: { value: EventRequestType; label: string; hint: string }[] = [
  { value: "dine-in-party", label: "Dine-In Party", hint: "Book a private space at O'Fallon for your group." },
  { value: "catering", label: "Catering", hint: "Pick a bar and tell us how you'd like it: pick up or dine-in." },
];

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  eventDate: "",
  eventTime: "",
  guestCount: "",
  fulfillment: "",
  package: "",
  notes: "",
};

/** Two O'Fallon request forms behind tabs. No backend endpoint yet: validates and confirms locally, like the contact form. */
export function RequestForms() {
  const [type, setType] = useState<EventRequestType>("dine-in-party");
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<EventRequestType | null>(null);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const switchTab = (next: EventRequestType) => {
    setType(next);
    setErrors({});
    setSent(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCatering = type === "catering";
    const result = eventRequestSchema.safeParse({
      type,
      ...values,
      fulfillment: isCatering ? values.fulfillment || undefined : undefined,
      package: isCatering ? values.package || undefined : undefined,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    // TODO: no endpoint yet. Recipient inbox for O'Fallon requests still to be confirmed.
    setSent(type);
    setValues(empty);
  };

  const active = tabs.find((t) => t.value === type)!;

  return (
    <div className="sg-req">
      <div className="sg-req-tabs" role="tablist" aria-label="Request type">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={`req-tab-${t.value}`}
            aria-selected={type === t.value}
            aria-controls="req-panel"
            className="sg-req-tab"
            onClick={() => switchTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="req-panel" role="tabpanel" aria-labelledby={`req-tab-${type}`} className="sg-req-panel">
        {sent ? (
          <div className="dc-note" role="status">
            <p className="dc-note-title">Request received</p>
            <p>
              Thanks! Someone from Don Chuy&rsquo;s O&rsquo;Fallon will contact you to confirm your {sent === "catering" ? "catering order" : "party"}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[var(--space-4)]">
            <p className="sg-body sg-on-dark">{active.hint}</p>
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <Input label="First name" required value={values.firstName} onChange={set("firstName")} error={errors.firstName} />
              <Input label="Last name" required value={values.lastName} onChange={set("lastName")} error={errors.lastName} />
            </div>
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <Input label="Email" type="email" required value={values.email} onChange={set("email")} error={errors.email} />
              <Input label="Phone" type="tel" required value={values.phone} onChange={set("phone")} error={errors.phone} />
            </div>
            <div className="grid gap-[var(--space-4)] sm:grid-cols-3">
              <Input label={type === "catering" ? "Event / pick up date" : "Party date"} type="date" required value={values.eventDate} onChange={set("eventDate")} error={errors.eventDate} />
              <Input label="Time" type="time" required value={values.eventTime} onChange={set("eventTime")} error={errors.eventTime} />
              <Input label="Guests" type="number" min={1} required value={values.guestCount} onChange={set("guestCount")} error={errors.guestCount} />
            </div>
            {type === "catering" ? (
              <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
                <div className={errors.fulfillment ? "dc-field is-error" : "dc-field"}>
                  <label htmlFor="req-fulfillment" className="dc-field-label">
                    Pick up or dine-in
                  </label>
                  <select id="req-fulfillment" className="dc-input dc-select" value={values.fulfillment} onChange={set("fulfillment")} aria-invalid={errors.fulfillment ? true : undefined}>
                    <option value="">Choose one</option>
                    <option value="pickup">Pick up</option>
                    <option value="dine-in">Dine-in (private space)</option>
                  </select>
                  {errors.fulfillment ? <p className="dc-field-hint">{errors.fulfillment}</p> : null}
                </div>
                <div className="dc-field">
                  <label htmlFor="req-package" className="dc-field-label">
                    Menu
                  </label>
                  <select id="req-package" className="dc-input dc-select" value={values.package} onChange={set("package")}>
                    <option value="">Not sure yet</option>
                    {cateringPackages.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} (${p.price} per person)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
            <div className="dc-field">
              <label htmlFor="req-notes" className="dc-field-label">
                Anything else we should know?
              </label>
              <textarea id="req-notes" className="dc-input dc-textarea" rows={4} value={values.notes} onChange={set("notes")} />
            </div>
            <Button type="submit" size="lg" icon="arrow-right" className="self-start">
              {type === "catering" ? "Request catering" : "Request a party"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
