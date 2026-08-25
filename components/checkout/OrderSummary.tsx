"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { colorLabel } from "@/lib/i18n/catalog";
import { SHIPPING, resolveOrderItems } from "@/lib/orders";

export function OrderSummary() {
  const { items, subtotal } = useCart();
  const { locale, t } = useLocale();
  const resolved = resolveOrderItems(items);
  const shipping = items.length === 0 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="border border-black p-6 lg:sticky lg:top-24">
      <h2 className="font-sans uppercase text-subtitle mb-4">{t.checkout.orderSummary}</h2>

      {resolved.length === 0 ? (
        <p className="font-serif text-body text-text-secondary">
          {t.checkout.bagEmpty}
        </p>
      ) : (
        <ul className="divide-y divide-black mb-4">
          {resolved.map((item) => (
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
      )}

      <div className="border-t border-black pt-4 space-y-2">
        <div className="flex justify-between font-serif text-body text-text-secondary">
          <span>{t.checkout.subtotal}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-serif text-body text-text-secondary">
          <span>{t.checkout.shipping}</span>
          <span>{shipping === 0 ? "—" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-sans uppercase text-button pt-2 border-t border-black">
          <span>{t.checkout.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
