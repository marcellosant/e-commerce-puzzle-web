"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { localizeProduct } from "@/lib/i18n/catalog";
import { Gallery } from "@/components/pdp/Gallery";
import { VariantSelector } from "@/components/pdp/VariantSelector";
import { SpecsList } from "@/components/pdp/SpecsList";
import { StickyBuyBar } from "@/components/pdp/StickyBuyBar";
import { TryOnEntry } from "@/components/tryon/TryOnEntry";

export function ProductDetailView({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? ""
  );
  const { addItem } = useCart();
  const { locale } = useLocale();
  const localized = useMemo(
    () => localizeProduct(product, locale),
    [product, locale]
  );

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12 pb-24 lg:pb-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <Gallery images={product.images} alt={product.name} />

        <div className="mt-6 lg:mt-0 space-y-6">
          <div>
            <h1 className="font-sans uppercase text-h1">{product.name}</h1>
            <p className="font-serif text-body mt-2">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="font-serif text-body text-text-secondary">
            {localized.description}
          </p>

          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />

          <StickyBuyBar
            price={product.price}
            onAdd={() => addItem(product.id, selectedVariantId)}
            soldOut={product.badge === "Sold Out"}
          />

          {product.tryOn && <TryOnEntry slug={product.slug} />}

          <SpecsList specs={localized.specs} />
        </div>
      </div>
    </div>
  );
}
