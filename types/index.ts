export type CategorySlug =
  | "sunglasses"
  | "prescription"
  | "contact-lenses"
  | "accessories";

export interface Category {
  slug: CategorySlug;
  name: string;
  imageSeed: string;
  /** Optional real photo URL; falls back to a Picsum placeholder from imageSeed when unset. */
  image?: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSpecs {
  material: string;
  lenses: string;
  hardware: string;
  origin: string;
}

export type FrameShape =
  | "Round"
  | "Square"
  | "Aviator"
  | "Cat-Eye"
  | "Rectangle";

export type Material = "Acetate" | "Metal" | "Titanium";

export type ProductBadge = "New" | "Bestseller" | "Sold Out";

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  price: number;
  badge?: ProductBadge;
  description: string;
  images: string[];
  variants: ColorVariant[];
  frameShape: FrameShape;
  material: Material;
  specs: ProductSpecs;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
