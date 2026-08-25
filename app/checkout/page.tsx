"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { ContactStep } from "@/components/checkout/ContactStep";
import { AddressStep } from "@/components/checkout/AddressStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import {
  EMPTY_CHECKOUT_FORM,
  type CheckoutFormState,
} from "@/components/checkout/types";
import { isAddressValid, isContactValid, isPaymentValid } from "@/lib/validation";
import {
  SHIPPING,
  generateOrderNumber,
  resolveOrderItems,
  type ResolvedOrderItem,
} from "@/lib/orders";

interface ConfirmedOrder {
  orderNumber: string;
  email: string;
  items: ResolvedOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<CheckoutFormState>(
    EMPTY_CHECKOUT_FORM
  );
  const [attemptedSteps, setAttemptedSteps] = useState<Record<number, boolean>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const { clearCart, items, subtotal } = useCart();
  const { t } = useLocale();

  function isStepValid(s: number): boolean {
    if (s === 1) return isContactValid(formState.contact);
    if (s === 2) return isAddressValid(formState.address);
    if (s === 3) return isPaymentValid(formState.payment);
    return true;
  }

  function handleContinue() {
    if (!isStepValid(step)) {
      setAttemptedSteps((prev) => ({ ...prev, [step]: true }));
      return;
    }
    setStep((s) => s + 1);
  }

  function handleSubmit() {
    if (!isStepValid(3)) {
      setAttemptedSteps((prev) => ({ ...prev, 3: true }));
      return;
    }
    const shipping = items.length === 0 ? 0 : SHIPPING;
    setConfirmedOrder({
      orderNumber: generateOrderNumber(),
      email: formState.contact.email,
      items: resolveOrderItems(items),
      subtotal,
      shipping,
      total: subtotal + shipping,
    });
    clearCart();
  }

  if (confirmedOrder) {
    return <OrderConfirmation {...confirmedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="px-4 lg:px-8 py-16 lg:py-24 text-center">
        <h1 className="font-sans uppercase text-h1 mb-4">{t.checkout.emptyBagTitle}</h1>
        <p className="font-serif text-body text-text-secondary mb-6">{t.checkout.bagEmpty}</p>
        <Link href="/collection">
          <Button variant="primary" size="md">
            {t.checkout.continueShopping}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="font-sans uppercase text-h1 mb-6">{t.checkout.title}</h1>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
        <div>
          <StepIndicator currentStep={step} />

          {step === 1 && (
            <ContactStep
              value={formState.contact}
              onChange={(contact) => setFormState({ ...formState, contact })}
              showErrors={!!attemptedSteps[1]}
            />
          )}
          {step === 2 && (
            <AddressStep
              value={formState.address}
              onChange={(address) => setFormState({ ...formState, address })}
              showErrors={!!attemptedSteps[2]}
            />
          )}
          {step === 3 && (
            <PaymentStep
              value={formState.payment}
              onChange={(payment) => setFormState({ ...formState, payment })}
              showErrors={!!attemptedSteps[3]}
            />
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep((s) => s - 1)}
              >
                {t.checkout.back}
              </Button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <Button variant="primary" size="md" onClick={handleContinue}>
                {t.checkout.continue}
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={handleSubmit}>
                {t.checkout.placeOrder}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
