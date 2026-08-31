"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { resolveOrderItems } from "@/lib/orders";
import { Button } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItemRow";

export default function CartPage() {
  const { items, subtotal, itemCount } = useCart();
  const { t } = useLocale();
  const resolved = resolveOrderItems(items);

  if (resolved.length === 0) {
    return (
      <div className="px-4 lg:px-8 py-16 lg:py-24 text-center">
        <h1 className="font-sans uppercase text-h1 mb-4">{t.cart.title}</h1>
        <p className="font-serif text-body text-text-secondary mb-6">{t.cart.empty}</p>
        <Link href="/collection">
          <Button variant="primary" size="md">
            {t.cart.emptyCta}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="font-sans uppercase text-h1 mb-2">{t.cart.title}</h1>
      <p className="font-serif text-body text-text-secondary mb-6">
        {t.cart.itemCount(itemCount)}
      </p>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
        <ul className="divide-y divide-black border-t border-b border-black">
          {resolved.map((item) => (
            <CartItemRow key={item.key} item={item} />
          ))}
        </ul>

        <div className="mt-8 lg:mt-0 border border-black p-6 lg:sticky lg:top-24">
          <div className="flex justify-between font-sans uppercase text-button pb-4 border-b border-black">
            <span>{t.cart.subtotal}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="font-serif text-body text-text-secondary mt-4 mb-6">
            {t.cart.shippingNote}
          </p>
          <Link href="/checkout" className="block">
            <Button variant="primary" size="full">
              {t.cart.proceedToCheckout}
            </Button>
          </Link>
          <Link
            href="/collection"
            className="block text-center mt-4 font-sans uppercase text-nav underline"
          >
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
