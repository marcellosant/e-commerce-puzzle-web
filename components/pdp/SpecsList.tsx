"use client";

import type { ProductSpecs } from "@/types";
import { useLocale } from "@/context/LocaleContext";

export function SpecsList({ specs }: { specs: ProductSpecs }) {
  const { t } = useLocale();
  const labels = t.product.specLabels;

  return (
    <div>
      <h3 className="font-sans uppercase text-nav mb-3">{t.product.specifications}</h3>
      <dl className="divide-y divide-black border-t border-b border-black">
        {(Object.keys(labels) as (keyof ProductSpecs)[]).map((key) => (
          <div key={key} className="flex justify-between py-3">
            <dt className="font-serif text-body text-text-secondary">
              {labels[key]}
            </dt>
            <dd className="font-serif text-body">{specs[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
