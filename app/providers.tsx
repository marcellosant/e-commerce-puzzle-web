"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/context/LocaleContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <FavoritesProvider>
        <CartProvider>{children}</CartProvider>
      </FavoritesProvider>
    </LocaleProvider>
  );
}
