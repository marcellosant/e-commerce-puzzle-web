"use client";

import { Minus, Plus } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
}

export function QuantityStepper({ quantity, onChange, min = 1 }: QuantityStepperProps) {
  const { t } = useLocale();

  return (
    <div className="inline-flex items-center border border-black">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        aria-label={t.cart.decrease}
        className="px-2 py-1 disabled:opacity-30 disabled:pointer-events-none"
      >
        <Minus size={14} />
      </button>
      <span
        aria-label={t.cart.quantity}
        className="min-w-8 text-center font-serif text-body tabular-nums"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={t.cart.increase}
        className="px-2 py-1"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
