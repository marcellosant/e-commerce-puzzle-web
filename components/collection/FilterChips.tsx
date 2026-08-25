"use client";

import type { FilterFacets } from "@/lib/data";
import type { CollectionFilters } from "@/lib/collection-filters";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { frameShapeLabel, materialLabel } from "@/lib/i18n/catalog";

interface FilterChipsProps {
  facets: FilterFacets;
  filters: CollectionFilters;
  onChange: (next: Partial<CollectionFilters>) => void;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 font-sans uppercase text-nav border border-black px-4 py-2 whitespace-nowrap",
        active ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      {label}
    </button>
  );
}

export function FilterChips({ facets, filters, onChange }: FilterChipsProps) {
  const { locale } = useLocale();
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {facets.frameShapes.map((shape) => {
        const active = filters.frameShapes.includes(shape);
        return (
          <Chip
            key={shape}
            label={frameShapeLabel(shape, locale)}
            active={active}
            onClick={() =>
              onChange({
                frameShapes: active
                  ? filters.frameShapes.filter((s) => s !== shape)
                  : [...filters.frameShapes, shape],
              })
            }
          />
        );
      })}
      {facets.materials.map((material) => {
        const active = filters.materials.includes(material);
        return (
          <Chip
            key={material}
            label={materialLabel(material, locale)}
            active={active}
            onClick={() =>
              onChange({
                materials: active
                  ? filters.materials.filter((m) => m !== material)
                  : [...filters.materials, material],
              })
            }
          />
        );
      })}
    </div>
  );
}
