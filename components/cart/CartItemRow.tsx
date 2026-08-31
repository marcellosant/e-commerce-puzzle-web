"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { colorLabel } from "@/lib/i18n/catalog";
import type { ResolvedOrderItem } from "@/lib/orders";
import { QuantityStepper } from "@/components/cart/QuantityStepper";

export function CartItemRow({ item }: { item: ResolvedOrderItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { locale, t } = useLocale();

  return (
    <li className="flex gap-4 py-6">
      <Link
        href={`/product/${item.slug}`}
        className="relative block h-24 w-24 shrink-0 bg-surface-muted border border-black overflow-hidden"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/product/${item.slug}`} className="font-sans uppercase text-button">
              {item.name}
            </Link>
            {item.variantName && (
              <p className="font-serif text-body text-text-secondary">
                {colorLabel(item.variantName, locale)}
              </p>
            )}
          </div>
          <p className="font-serif text-body whitespace-nowrap">
            {formatPrice(item.lineTotal)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <QuantityStepper
            quantity={item.quantity}
            onChange={(quantity) =>
              updateQuantity(item.productId, item.variantId, quantity)
            }
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            aria-label={t.cart.remove(item.name)}
            className="text-text-secondary hover:text-black transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}
