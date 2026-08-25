"use client";

import { useMemo, useState } from "react";
import type { CategorySlug } from "@/types";
import { CATEGORIES, PRODUCTS, getFilterFacets } from "@/lib/data";
import { useLocale } from "@/context/LocaleContext";
import { type CollectionFilters, filterProducts } from "@/lib/collection-filters";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { FilterChips } from "@/components/collection/FilterChips";
import { ProductGrid } from "@/components/collection/ProductGrid";
import { LoadMoreButton } from "@/components/collection/LoadMoreButton";

const PAGE_SIZE = 8;

export type { CollectionFilters };

export function CollectionView({
  initialCategory,
  initialQuery,
}: {
  initialCategory?: CategorySlug;
  initialQuery?: string;
}) {
  const { t } = useLocale();
  const facets = useMemo(() => getFilterFacets(), []);
  const [filters, setFilters] = useState<CollectionFilters>({
    category: initialCategory ?? "all",
    frameShapes: [],
    materials: [],
    colors: [],
  });
  const query = initialQuery ?? "";
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProducts = useMemo(
    () => filterProducts(PRODUCTS, filters, query),
    [filters, query]
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  function updateFilters(next: Partial<CollectionFilters>) {
    setFilters((prev) => ({ ...prev, ...next }));
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="font-sans uppercase text-h1 mb-6">{t.collection.title}</h1>

      <div className="lg:hidden mb-6">
        <FilterChips facets={facets} filters={filters} onChange={updateFilters} />
      </div>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <div className="hidden lg:block">
          <FilterSidebar
            categories={CATEGORIES}
            facets={facets}
            filters={filters}
            onChange={updateFilters}
          />
        </div>

        <div>
          <p className="font-serif text-body text-text-secondary mb-4">
            {query.trim()
              ? t.collection.resultsFor(filteredProducts.length, query.trim())
              : t.collection.results(filteredProducts.length)}
          </p>
          <ProductGrid products={visibleProducts} />
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-10">
              <LoadMoreButton onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
