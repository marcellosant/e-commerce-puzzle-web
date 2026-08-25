import type { CartItem } from "@/types";
import { getProductById } from "@/lib/data";

export const SHIPPING = 12;

export interface ResolvedOrderItem {
  key: string;
  name: string;
  variantName?: string;
  quantity: number;
  lineTotal: number;
}

export function resolveOrderItems(items: CartItem[]): ResolvedOrderItem[] {
  return items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    const variant = product.variants.find((v) => v.id === item.variantId);
    return [
      {
        key: `${item.productId}-${item.variantId}`,
        name: product.name,
        variantName: variant?.name,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      },
    ];
  });
}

export function generateOrderNumber(): string {
  const random = Math.random().toString(36).slice(2, 6);
  return `PZ-${Date.now().toString(36)}${random}`.toUpperCase();
}
