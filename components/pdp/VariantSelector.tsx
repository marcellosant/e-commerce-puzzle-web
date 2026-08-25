"use client";

import type { ColorVariant } from "@/types";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { useLocale } from "@/context/LocaleContext";
import { colorLabel } from "@/lib/i18n/catalog";

interface VariantSelectorProps {
  variants: ColorVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  const { locale, t } = useLocale();
  const selected = variants.find((v) => v.id === selectedVariantId);

  return (
    <div>
      <h3 className="font-sans uppercase text-nav mb-3">
        {t.product.color}
        {selected ? ` — ${colorLabel(selected.name, locale)}` : ""}
      </h3>
      <div className="flex gap-3">
        {variants.map((variant) => (
          <ColorSwatch
            key={variant.id}
            hex={variant.hex}
            label={colorLabel(variant.name, locale)}
            selected={variant.id === selectedVariantId}
            onSelect={() => onSelect(variant.id)}
          />
        ))}
      </div>
    </div>
  );
}
