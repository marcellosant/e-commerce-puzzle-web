"use client";

import type { Category } from "@/types";
import type { FilterFacets } from "@/lib/data";
import type { CollectionFilters } from "@/lib/collection-filters";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { categoryName, colorLabel, frameShapeLabel, materialLabel } from "@/lib/i18n/catalog";

interface FilterSidebarProps {
  categories: Category[];
  facets: FilterFacets;
  filters: CollectionFilters;
  onChange: (next: Partial<CollectionFilters>) => void;
}

export function FilterSidebar({
  categories,
  facets,
  filters,
  onChange,
}: FilterSidebarProps) {
  const { locale, t } = useLocale();
  return (
    <aside className="space-y-8">
      <div>
        <h3 className="font-sans uppercase text-nav mb-3">{t.collection.categoryLabel}</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onChange({ category: "all" })}
              className={cn(
                "font-serif text-body",
                filters.category === "all" ? "text-black" : "text-text-secondary"
              )}
            >
              {t.collection.all}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <button
                onClick={() => onChange({ category: category.slug })}
                className={cn(
                  "font-serif text-body",
                  filters.category === category.slug
                    ? "text-black"
                    : "text-text-secondary"
                )}
              >
                {categoryName(category.slug, locale)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-black pt-6">
        <h3 className="font-sans uppercase text-nav mb-3">{t.collection.frameShapeLabel}</h3>
        <ul className="space-y-2">
          {facets.frameShapes.map((shape) => {
            const active = filters.frameShapes.includes(shape);
            return (
              <li key={shape}>
                <button
                  onClick={() =>
                    onChange({
                      frameShapes: active
                        ? filters.frameShapes.filter((s) => s !== shape)
                        : [...filters.frameShapes, shape],
                    })
                  }
                  className={cn(
                    "font-serif text-body",
                    active ? "text-black" : "text-text-secondary"
                  )}
                >
                  {frameShapeLabel(shape, locale)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-black pt-6">
        <h3 className="font-sans uppercase text-nav mb-3">{t.collection.colorLabel}</h3>
        <div className="flex flex-wrap gap-3">
          {facets.colors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() =>
                  onChange({
                    colors: active
                      ? filters.colors.filter((c) => c !== color.name)
                      : [...filters.colors, color.name],
                  })
                }
                aria-label={colorLabel(color.name, locale)}
                aria-pressed={active}
                className={cn(
                  "h-7 w-7 rounded-full border border-black",
                  active && "ring-2 ring-offset-2 ring-black"
                )}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </div>

      <div className="border-t border-black pt-6">
        <h3 className="font-sans uppercase text-nav mb-3">{t.collection.materialLabel}</h3>
        <ul className="space-y-2">
          {facets.materials.map((material) => {
            const active = filters.materials.includes(material);
            return (
              <li key={material}>
                <button
                  onClick={() =>
                    onChange({
                      materials: active
                        ? filters.materials.filter((m) => m !== material)
                        : [...filters.materials, material],
                    })
                  }
                  className={cn(
                    "font-serif text-body",
                    active ? "text-black" : "text-text-secondary"
                  )}
                >
                  {materialLabel(material, locale)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
