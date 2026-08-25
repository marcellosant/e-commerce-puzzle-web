"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";

interface SectionProps {
  title: string;
  viewAllHref?: string;
  children: ReactNode;
}

export function Section({ title, viewAllHref, children }: SectionProps) {
  const { t } = useLocale();
  return (
    <section className="px-4 lg:px-8 py-10 lg:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sans uppercase text-subtitle">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="font-sans uppercase text-nav border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            {t.home.viewAll}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
