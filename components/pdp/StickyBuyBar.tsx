"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useLocale } from "@/context/LocaleContext";

interface StickyBuyBarProps {
  price: number;
  onAdd: () => void;
  soldOut?: boolean;
}

export function StickyBuyBar({ price, onAdd, soldOut }: StickyBuyBarProps) {
  const [added, setAdded] = useState(false);
  const { t } = useLocale();

  function handleClick() {
    onAdd();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="fixed bottom-16 inset-x-0 z-30 bg-white border-t border-black px-4 py-3 lg:static lg:border-0 lg:px-0 lg:py-0 lg:mt-8">
      <div className="flex items-center gap-4 lg:block">
        <span className="font-serif text-body lg:hidden">
          {formatPrice(price)}
        </span>
        <Button
          variant="primary"
          size="full"
          onClick={handleClick}
          disabled={soldOut}
        >
          {soldOut ? t.product.soldOut : added ? t.product.addedToBag : t.product.addToBag}
        </Button>
      </div>
    </div>
  );
}
