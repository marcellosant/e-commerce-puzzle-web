import type { CategorySlug, FrameShape, Material, Product } from "@/types";

export interface CollectionFilters {
  category: CategorySlug | "all";
  frameShapes: FrameShape[];
  materials: Material[];
  colors: string[];
}

export function filterProducts(
  products: Product[],
  filters: CollectionFilters,
  query = ""
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.category !== "all" && product.categorySlug !== filters.category) {
      return false;
    }
    if (
      filters.frameShapes.length > 0 &&
      !filters.frameShapes.includes(product.frameShape)
    ) {
      return false;
    }
    if (
      filters.materials.length > 0 &&
      !filters.materials.includes(product.material)
    ) {
      return false;
    }
    if (
      filters.colors.length > 0 &&
      !product.variants.some((variant) => filters.colors.includes(variant.name))
    ) {
      return false;
    }
    if (normalizedQuery && !product.name.toLowerCase().includes(normalizedQuery)) {
      return false;
    }
    return true;
  });
}
