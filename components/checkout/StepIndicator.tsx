"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const { t } = useLocale();
  const steps = [t.checkout.steps.contact, t.checkout.steps.address, t.checkout.steps.payment];

  return (
    <ol className="flex items-center gap-4 lg:gap-6 mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const completed = step < currentStep;
        const active = step === currentStep;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border border-black font-sans text-nav",
                completed || active ? "bg-black text-white" : "bg-white text-black"
              )}
            >
              {completed ? <Check size={14} /> : step}
            </span>
            <span
              className={cn(
                "font-sans uppercase text-nav",
                active ? "text-black" : "text-text-secondary"
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
