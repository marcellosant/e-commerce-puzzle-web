"use client";

import type { CheckoutFormState } from "@/components/checkout/types";
import { FormField } from "@/components/checkout/FormField";
import { useLocale } from "@/context/LocaleContext";

interface AddressStepProps {
  value: CheckoutFormState["address"];
  onChange: (value: CheckoutFormState["address"]) => void;
  showErrors: boolean;
}

export function AddressStep({ value, onChange, showErrors }: AddressStepProps) {
  const { t } = useLocale();

  function set<K extends keyof CheckoutFormState["address"]>(
    key: K,
    fieldValue: string
  ) {
    onChange({ ...value, [key]: fieldValue });
  }

  function requiredError(fieldValue: string): string | undefined {
    return showErrors && fieldValue.trim().length === 0
      ? t.checkout.errors.required
      : undefined;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-sans uppercase text-subtitle mb-2">{t.checkout.address.heading}</h2>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.checkout.address.firstName}
          name="firstName"
          autoComplete="given-name"
          value={value.firstName}
          onChange={(v) => set("firstName", v)}
          error={requiredError(value.firstName)}
        />
        <FormField
          label={t.checkout.address.lastName}
          name="lastName"
          autoComplete="family-name"
          value={value.lastName}
          onChange={(v) => set("lastName", v)}
          error={requiredError(value.lastName)}
        />
      </div>
      <FormField
        label={t.checkout.address.street}
        name="street"
        autoComplete="street-address"
        value={value.street}
        onChange={(v) => set("street", v)}
        error={requiredError(value.street)}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.checkout.address.city}
          name="city"
          autoComplete="address-level2"
          value={value.city}
          onChange={(v) => set("city", v)}
          error={requiredError(value.city)}
        />
        <FormField
          label={t.checkout.address.state}
          name="state"
          autoComplete="address-level1"
          value={value.state}
          onChange={(v) => set("state", v)}
          error={requiredError(value.state)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t.checkout.address.zip}
          name="zip"
          autoComplete="postal-code"
          value={value.zip}
          onChange={(v) => set("zip", v)}
          error={requiredError(value.zip)}
        />
        <FormField
          label={t.checkout.address.country}
          name="country"
          autoComplete="country-name"
          value={value.country}
          onChange={(v) => set("country", v)}
          error={requiredError(value.country)}
        />
      </div>
    </div>
  );
}
