"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";

/**
 * The single, shared bottom navigation used across every screen.
 * There must be no other component named/behaving like a bottom nav in the repo.
 */
export function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useLocale();

  const items = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/collection", label: t.nav.categories, icon: LayoutGrid },
    { href: "/favorites", label: t.nav.favorites, icon: Heart },
    // The brief puts Profile in this slot, but account management needs a
    // backend and is deferred to v2.0. Cart is the more useful destination
    // meanwhile — on mobile it is otherwise only reachable from the header.
    { href: "/cart", label: t.nav.cart, icon: ShoppingBag },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-header border-t border-black">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 font-sans uppercase text-nav",
                  active ? "text-black" : "text-text-secondary"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
