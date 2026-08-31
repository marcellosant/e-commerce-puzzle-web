"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { CATEGORIES } from "@/lib/data";
import { categoryName } from "@/lib/i18n/catalog";
import type { Locale } from "@/lib/i18n/dictionaries";
import { SearchBox } from "@/components/layout/SearchBox";

function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const other: Locale = locale === "en" ? "pt" : "en";
  return (
    <button
      type="button"
      onClick={() => setLocale(other)}
      aria-label={`Switch language to ${other === "en" ? "English" : "Português"}`}
      className="font-sans uppercase text-nav border border-black px-2 py-1"
    >
      {locale}
    </button>
  );
}

function CartBagIcon() {
  const { itemCount } = useCart();
  const { t } = useLocale();
  return (
    <Link href="/cart" className="relative" aria-label={t.nav.cart}>
      <ShoppingBag size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-white text-[10px] font-sans">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { locale, t } = useLocale();

  return (
    <header className="sticky top-0 z-40 bg-surface-header border-b border-black">
      {/* Mobile: TopAppBar */}
      <div className="flex lg:hidden items-center justify-between px-4 h-14">
        <Link href="/" className="font-sans uppercase text-button">
          PUZZLE
        </Link>
        <div className="flex items-center gap-4">
          <LocaleToggle />
          <Link href="/favorites" aria-label={t.nav.favorites}>
            <Heart size={20} />
          </Link>
          <CartBagIcon />
        </div>
      </div>

      {/* Desktop: TopNavBar */}
      <div className="hidden lg:grid grid-cols-3 items-center px-8 h-16">
        <nav className="flex items-center gap-4">
          <SearchBox />
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/collection?category=${category.slug}`}
              className="font-sans uppercase text-nav whitespace-nowrap"
            >
              {categoryName(category.slug, locale)}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="justify-self-center font-sans uppercase text-subtitle"
        >
          PUZZLE
        </Link>
        <div className="flex items-center gap-6 justify-self-end">
          <LocaleToggle />
          <Link href="/favorites" aria-label={t.nav.favorites}>
            <Heart size={20} />
          </Link>
          <CartBagIcon />
        </div>
      </div>
    </header>
  );
}
