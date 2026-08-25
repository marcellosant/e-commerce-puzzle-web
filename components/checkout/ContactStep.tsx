"use client";

import type { CheckoutFormState } from "@/components/checkout/types";
import { FormField } from "@/components/checkout/FormField";
import { useLocale } from "@/context/LocaleContext";
import { isValidEmail, isValidPhone } from "@/lib/validation";

interface ContactStepProps {
  value: CheckoutFormState["contact"];
  onChange: (value: CheckoutFormState["contact"]) => void;
  showErrors: boolean;
}

export function ContactStep({ value, onChange, showErrors }: ContactStepProps) {
  const { t } = useLocale();
  return (
    <div className="space-y-4">
      <h2 className="font-sans uppercase text-subtitle mb-2">{t.checkout.contact.heading}</h2>
      <FormField
        label={t.checkout.contact.email}
        name="email"
        type="email"
        autoComplete="email"
        value={value.email}
        onChange={(email) => onChange({ ...value, email })}
        error={showErrors && !isValidEmail(value.email) ? t.checkout.errors.email : undefined}
      />
      <FormField
        label={t.checkout.contact.phone}
        name="phone"
        type="tel"
        autoComplete="tel"
        value={value.phone}
        onChange={(phone) => onChange({ ...value, phone })}
        error={showErrors && !isValidPhone(value.phone) ? t.checkout.errors.phone : undefined}
      />
    </div>
  );
}
