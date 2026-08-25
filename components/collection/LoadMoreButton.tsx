"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleContext";

export function LoadMoreButton({ onClick }: { onClick: () => void }) {
  const { t } = useLocale();
  return (
    <Button variant="secondary" size="md" onClick={onClick}>
      {t.collection.loadMore}
    </Button>
  );
}
