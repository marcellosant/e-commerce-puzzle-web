"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const { t } = useLocale();
  const favoriteProducts = PRODUCTS.filter((product) =>
    favoriteIds.includes(product.id)
  );

  return (
    <div className="px-4 lg:px-8 py-10 lg:py-16">
      <h1 className="font-sans uppercase text-h1 mb-8">{t.favorites.title}</h1>
      {favoriteProducts.length === 0 ? (
        <p className="font-serif text-body text-text-secondary">
          {t.favorites.empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
