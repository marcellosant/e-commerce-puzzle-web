"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/format";
import { badgeLabel, colorLabel } from "@/lib/i18n/catalog";
import { Badge } from "@/components/ui/Badge";

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { locale, t } = useLocale();
  const fav = isFavorite(product.id);
  const primaryVariant = product.variants[0];
  const soldOut = product.badge === "Sold Out";

  return (
    <div className="group">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square bg-surface-muted border border-black overflow-hidden"
      >
        {product.badge && (
          <Badge className="absolute top-3 left-3 z-10">
            {badgeLabel(product.badge, locale)}
          </Badge>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-label={fav ? t.product.removeFromFavorites : t.product.addToFavorites}
          aria-pressed={fav}
          className="absolute top-3 right-3 z-10 text-black"
        >
          <Heart size={20} fill={fav ? "#000" : "none"} />
        </button>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={`object-cover rounded-product transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105 ${
            soldOut ? "opacity-50" : ""
          }`}
        />
      </Link>
      <div className="mt-3 space-y-1">
        <p className="font-sans uppercase text-button">{product.name}</p>
        {primaryVariant && (
          <p className="font-serif text-body text-text-secondary">
            {colorLabel(primaryVariant.name, locale)}
          </p>
        )}
        <p className="font-serif text-body">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
