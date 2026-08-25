"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { PRODUCTS } from "@/lib/data";

const STORAGE_KEY = "puzzle-cart-v1";

interface CartContextValue {
  items: CartItem[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function getProductPrice(productId: string): number {
  const product = PRODUCTS.find((p) => p.id === productId);
  return product?.price ?? 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // One-time read from localStorage on mount — there's no way to know this
      // value before the client renders, so it can't be computed during render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(JSON.parse(stored));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + getProductPrice(item.productId) * item.quantity,
      0
    );

    return {
      items,
      itemCount,
      subtotal,
      addItem: (productId, variantId, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find(
            (item) =>
              item.productId === productId && item.variantId === variantId
          );
          if (existing) {
            return prev.map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { productId, variantId, quantity }];
        });
      },
      removeItem: (productId, variantId) => {
        setItems((prev) =>
          prev.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          )
        );
      },
      updateQuantity: (productId, variantId, quantity) => {
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          )
        );
      },
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
