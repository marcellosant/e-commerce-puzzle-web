import { describe, expect, it } from "vitest";
import { filterProducts, type CollectionFilters } from "@/lib/collection-filters";
import { PRODUCTS } from "@/lib/data";

const NO_FILTERS: CollectionFilters = {
  category: "all",
  frameShapes: [],
  materials: [],
  colors: [],
};

describe("filterProducts", () => {
  it("returns every product when no filters or query are applied", () => {
    expect(filterProducts(PRODUCTS, NO_FILTERS)).toHaveLength(PRODUCTS.length);
  });

  it("filters by category", () => {
    const result = filterProducts(PRODUCTS, { ...NO_FILTERS, category: "sunglasses" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.categorySlug === "sunglasses")).toBe(true);
  });

  it("filters by frame shape (OR within the list)", () => {
    const result = filterProducts(PRODUCTS, {
      ...NO_FILTERS,
      frameShapes: ["Round", "Aviator"],
    });
    expect(result.every((p) => p.frameShape === "Round" || p.frameShape === "Aviator")).toBe(
      true
    );
  });

  it("filters by material", () => {
    const result = filterProducts(PRODUCTS, { ...NO_FILTERS, materials: ["Titanium"] });
    expect(result.every((p) => p.material === "Titanium")).toBe(true);
  });

  it("filters by variant color name", () => {
    const result = filterProducts(PRODUCTS, { ...NO_FILTERS, colors: ["Gold"] });
    expect(result.every((p) => p.variants.some((v) => v.name === "Gold"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by search query, case-insensitively, matching product name", () => {
    const result = filterProducts(PRODUCTS, NO_FILTERS, "meridian");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Meridian");
  });

  it("combines category and query filters", () => {
    const result = filterProducts(PRODUCTS, { ...NO_FILTERS, category: "accessories" }, "chain");
    expect(result).toHaveLength(1);
    expect(result[0].categorySlug).toBe("accessories");
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterProducts(PRODUCTS, NO_FILTERS, "nonexistent-product-xyz")).toEqual([]);
  });
});
