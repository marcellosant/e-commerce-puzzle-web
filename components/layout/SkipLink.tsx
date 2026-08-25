"use client";

import { useLocale } from "@/context/LocaleContext";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:border focus:border-black font-sans uppercase text-nav"
    >
      {t.a11y.skipToContent}
    </a>
  );
}
