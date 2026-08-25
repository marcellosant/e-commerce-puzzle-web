"use client";

import type { CheckoutFormState } from "@/components/checkout/types";
import { FormField } from "@/components/checkout/FormField";
import { useLocale } from "@/context/LocaleContext";
import { isValidCardNumber, isValidCvc, isValidExpiry } from "@/lib/validation";

interface PaymentStepProps {
  value: CheckoutFormState["payment"];
  onChange: (value: CheckoutFormState["payment"]) => void;
  showErrors: boolean;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function PaymentStep({ value, onChange, showErrors }: PaymentStepProps) {
  const { t } = useLocale();

  function set<K extends keyof CheckoutFormState["payment"]>(
    key: K,
    fieldValue: string
  ) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-sans uppercase text-subtitle mb-2">{t.checkout.payment.heading}</h2>
      <p className="font-serif text-body text-text-secondary border border-black px-3 py-2 bg-surface-muted">
        {t.checkout.payment.demoNotice}
      </p>
      <FormField
        label={t.checkout.payment.nameOnCard}
        name="nameOnCard"
        autoComplete="cc-name"
        value={value.nameOnCard}
        onChange={(v) => set("nameOnCard", v)}
        error={showErrors && value.nameOnCard.trim().length === 0 ? t.checkout.errors.required : undefined}
      />
      <FormField
        label={t.checkout.payment.cardNumber}
        name="cardNumber"
        autoComplete="cc-number"
        value={value.cardNumber}
        onChange={(v) => set("cardNumber", formatCardNumber(v))}
        error={showErrors && !isValidCardNumber(value.cardNumber) ? t.checkout.errors.cardNumber : undefined}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.checkout.payment.expiry}
          name="expiry"
          autoComplete="cc-exp"
          value={value.expiry}
          onChange={(v) => set("expiry", formatExpiry(v))}
          error={showErrors && !isValidExpiry(value.expiry) ? t.checkout.errors.expiry : undefined}
        />
        <FormField
          label={t.checkout.payment.cvc}
          name="cvc"
          autoComplete="cc-csc"
          value={value.cvc}
          onChange={(v) => set("cvc", v.replace(/\D/g, "").slice(0, 4))}
          error={showErrors && !isValidCvc(value.cvc) ? t.checkout.errors.cvc : undefined}
        />
      </div>
    </div>
  );
}
