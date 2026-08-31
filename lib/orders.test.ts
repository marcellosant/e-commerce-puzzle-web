import { describe, expect, it } from "vitest";
import { generateOrderNumber, resolveOrderItems } from "@/lib/orders";
import { PRODUCTS } from "@/lib/data";

describe("resolveOrderItems", () => {
  it("resolves product name, variant name, and line total from a cart item", () => {
    const product = PRODUCTS[0];
    const variant = product.variants[0];
    const resolved = resolveOrderItems([
      { productId: product.id, variantId: variant.id, quantity: 2 },
    ]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toMatchObject({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      variantName: variant.name,
      unitPrice: product.price,
      quantity: 2,
      lineTotal: product.price * 2,
    });
  });

  it("keeps ids and slug so the cart can link to and mutate the line", () => {
    const product = PRODUCTS[1];
    const variant = product.variants[0];
    const [resolved] = resolveOrderItems([
      { productId: product.id, variantId: variant.id, quantity: 1 },
    ]);

    expect(resolved.key).toBe(`${product.id}-${variant.id}`);
    expect(resolved.slug).toBe(product.slug);
    expect(resolved.lineTotal).toBe(resolved.unitPrice);
  });

  it("silently drops items referencing a product that no longer exists", () => {
    const resolved = resolveOrderItems([
      { productId: "does-not-exist", variantId: "v1", quantity: 1 },
    ]);
    expect(resolved).toHaveLength(0);
  });

  it("returns an empty list for an empty cart", () => {
    expect(resolveOrderItems([])).toEqual([]);
  });
});

describe("generateOrderNumber", () => {
  it("produces a PZ-prefixed, uppercase order number", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^PZ-[A-Z0-9]+$/);
  });

  it("produces distinct values across calls", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});
