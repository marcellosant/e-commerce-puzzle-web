"use client";

import Image from "next/image";
import Link from "next/link";
import type { CategorySlug } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import { categoryName } from "@/lib/i18n/catalog";

interface CategoryCardProps {
  slug: CategorySlug;
  image: string;
}

export function CategoryCard({ slug, image }: CategoryCardProps) {
  const { locale } = useLocale();
  const name = categoryName(slug, locale);
  return (
    <Link
      href={`/collection?category=${slug}`}
      className="group relative block aspect-[3/4] bg-surface-muted border border-black overflow-hidden"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105"
      />
      {/* Always-on scrim: never opacity-toggled, guarantees label contrast (fixes Figma bug) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <span className="absolute bottom-4 left-4 font-sans uppercase text-button text-white">
        {name}
      </span>
    </Link>
  );
}
