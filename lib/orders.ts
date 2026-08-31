import type { CartItem } from "@/types";
import { getProductById } from "@/lib/data";

export const SHIPPING = 12;

export interface ResolvedOrderItem {
  key: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  variantName?: string;
  unitPrice: number;
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
        productId: item.productId,
        variantId: item.variantId,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        variantName: variant?.name,
        unitPrice: product.price,
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
