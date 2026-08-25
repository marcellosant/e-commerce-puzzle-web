"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { colorLabel } from "@/lib/i18n/catalog";
import type { ResolvedOrderItem } from "@/lib/orders";
import { Button } from "@/components/ui/Button";

interface OrderConfirmationProps {
  orderNumber: string;
  email: string;
  items: ResolvedOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function OrderConfirmation({
  orderNumber,
  email,
  items,
  subtotal,
  shipping,
  total,
}: OrderConfirmationProps) {
  const { locale, t } = useLocale();

  return (
    <div className="px-4 lg:px-8 py-16 lg:py-24">
      <div className="max-w-md mx-auto text-center mb-8">
        <h1 className="font-sans uppercase text-h1 mb-3">{t.checkout.orderConfirmedTitle}</h1>
        <p className="font-serif text-body text-text-secondary">
          {t.checkout.orderNumberLabel}: {orderNumber}
        </p>
        <p className="font-serif text-body text-text-secondary mt-2">
          {t.checkout.orderConfirmedBody(email || t.checkout.yourEmail)}
        </p>
      </div>

      <div className="max-w-md mx-auto border border-black p-6 text-left">
        <ul className="divide-y divide-black mb-4">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between py-3">
              <div>
                <p className="font-sans uppercase text-button">{item.name}</p>
                <p className="font-serif text-body text-text-secondary">
                  {item.variantName ? colorLabel(item.variantName, locale) : ""} × {item.quantity}
                </p>
              </div>
              <p className="font-serif text-body">{formatPrice(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-black pt-4 space-y-2">
          <div className="flex justify-between font-serif text-body text-text-secondary">
            <span>{t.checkout.subtotal}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between font-serif text-body text-text-secondary">
            <span>{t.checkout.shipping}</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-sans uppercase text-button pt-2 border-t border-black">
            <span>{t.checkout.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center mt-8">
        <Link href="/collection">
          <Button variant="primary" size="md">
            {t.checkout.continueShopping}
          </Button>
        </Link>
      </div>
    </div>
  );
}
