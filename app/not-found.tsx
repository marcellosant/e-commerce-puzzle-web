"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="px-4 lg:px-8 py-16 lg:py-24 text-center">
      <p className="font-sans text-subtitle text-text-secondary mb-2">404</p>
      <h1 className="font-sans uppercase text-h1 mb-4">{t.notFound.title}</h1>
      <p className="font-serif text-body text-text-secondary max-w-md mx-auto mb-8">
        {t.notFound.message}
      </p>
      <Link href="/">
        <Button variant="primary" size="md">
          {t.notFound.cta}
        </Button>
      </Link>
    </div>
  );
}
