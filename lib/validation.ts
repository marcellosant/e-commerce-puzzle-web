import type { CheckoutFormState } from "@/components/checkout/types";

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 8;
}

export function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 13 && digits.length <= 19;
}

export function isValidExpiry(value: string): boolean {
  return /^\d{2}\s*\/\s*\d{2}$/.test(value.trim());
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value.trim());
}

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isContactValid(contact: CheckoutFormState["contact"]): boolean {
  return isValidEmail(contact.email) && isValidPhone(contact.phone);
}

export function isAddressValid(address: CheckoutFormState["address"]): boolean {
  return (
    isNonEmpty(address.firstName) &&
    isNonEmpty(address.lastName) &&
    isNonEmpty(address.street) &&
    isNonEmpty(address.city) &&
    isNonEmpty(address.state) &&
    isNonEmpty(address.zip) &&
    isNonEmpty(address.country)
  );
}

export function isPaymentValid(payment: CheckoutFormState["payment"]): boolean {
  return (
    isNonEmpty(payment.nameOnCard) &&
    isValidCardNumber(payment.cardNumber) &&
    isValidExpiry(payment.expiry) &&
    isValidCvc(payment.cvc)
  );
}
