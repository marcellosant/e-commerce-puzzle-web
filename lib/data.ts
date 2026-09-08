import type {
  Category,
  FrameShape,
  Material,
  Product,
} from "@/types";

// TEMPORARY: every photo below is stock, not Puzzle product photography.
//
// They were chosen as a set rather than one at a time: product alone, no
// people, plain light background, similar framing. An earlier pass picked each
// photo for its subject and ignored how they sat together, which read as a
// scrapbook rather than a catalogue — and let two shots through with a rival's
// branding visible on the lens.
//
// Because none of these products exist, the attributes follow the photographs
// rather than the other way round: shape, material and colours describe what is
// actually pictured. That keeps the filters honest.
//
// Replacing these means swapping each stockPhoto(id) call; nothing else depends
// on where the images come from.

function stockPhoto(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;
}

function stockPhotoPortrait(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=80`;
}

/**
 * Home page hero, shown as a slideshow behind a fixed headline.
 *
 * These are the one place people are welcome, unlike the catalogue tiles where
 * anything but the product alone broke the set. The landscape earns its place
 * against "See the World in Focus" rather than merely filling space.
 */
export const HERO_SLIDES: readonly string[] = [
  "https://images.unsplash.com/photo-1581459914275-9a180ec34733?w=1600&h=1000&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601307426703-20d19577e455?w=1600&h=1000&fit=crop&q=80",
];

export const CATEGORIES: Category[] = [
  {
    slug: "sunglasses",
    name: "Sunglasses",
    image: stockPhotoPortrait("1508296695146-257a814070b4"),
  },
  {
    slug: "prescription",
    name: "Prescription",
    image: stockPhotoPortrait("1749525694688-03217cfbc52e"),
  },
  {
    slug: "contact-lenses",
    name: "Contact Lenses",
    image: stockPhotoPortrait("1743590363059-ce890f6cc97b"),
  },
  {
    slug: "accessories",
    name: "Accessories",
    image: stockPhotoPortrait("1752127907132-30f67c040633"),
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "meridian",
    name: "Meridian",
    categorySlug: "sunglasses",
    price: 240,
    badge: "Bestseller",
    description:
      "A wide, sculpted acetate frame with a subtle cat-eye lift. Meridian is built for full coverage without sacrificing lightness.",
    images: [stockPhoto("1508296695146-257a814070b4")],
    variants: [
      { id: "v1", name: "Blush", hex: "#E8C4B8" },
      { id: "v2", name: "Tortoise", hex: "#6B4A2E" },
    ],
    frameShape: "Cat-Eye",
    material: "Acetate",
    specs: {
      material: "Italian acetate",
      lenses: "Gradient CR-39, UV400",
      hardware: "Gold-tone metal trim",
      origin: "Made in Italy",
    },
    featured: true,
    tryOn: true,
  },
  {
    id: "p2",
    slug: "solstice",
    name: "Solstice",
    categorySlug: "sunglasses",
    price: 210,
    badge: "New",
    description:
      "A slim round frame in polished metal, fitted with deep green mineral glass for distortion-free clarity.",
    images: [stockPhoto("1511499602539-b3f6b9b79014")],
    variants: [
      { id: "v1", name: "Gold", hex: "#B8975A" },
      { id: "v2", name: "Gunmetal", hex: "#3A3B3C" },
    ],
    frameShape: "Round",
    material: "Metal",
    specs: {
      material: "Polished steel",
      lenses: "Mineral glass, UV400",
      hardware: "Adjustable nose pads",
      origin: "Made in Japan",
    },
    featured: true,
  },
  {
    id: "p3",
    slug: "nocturne",
    name: "Nocturne",
    categorySlug: "sunglasses",
    price: 260,
    description:
      "An oversized round frame in warm metal, with a gradient tint that fades from deep amber to clear.",
    images: [stockPhoto("1649119161997-00ffc8c24e11")],
    variants: [
      { id: "v1", name: "Amber", hex: "#8A5A2B" },
      { id: "v2", name: "Gold", hex: "#B8975A" },
    ],
    frameShape: "Round",
    material: "Metal",
    specs: {
      material: "Stainless steel",
      lenses: "Gradient CR-39, UV400",
      hardware: "Acetate temple tips",
      origin: "Made in Italy",
    },
    featured: true,
  },
  {
    id: "p4",
    slug: "arden",
    name: "Arden",
    categorySlug: "prescription",
    price: 180,
    description:
      "A browline optical frame with a bold acetate top rim and a fine metal underwire — a quiet, precise everyday shape.",
    images: [stockPhoto("1772009288423-96090d2998c7")],
    variants: [
      { id: "v1", name: "Oxblood", hex: "#7B3B3B" },
      { id: "v2", name: "Black", hex: "#151515" },
    ],
    frameShape: "Rectangle",
    material: "Acetate",
    specs: {
      material: "Acetate and steel",
      lenses: "Ready for prescription lenses",
      hardware: "Spring hinges",
      origin: "Made in Japan",
    },
    featured: true,
  },
  {
    id: "p5",
    slug: "vesper",
    name: "Vesper",
    categorySlug: "prescription",
    price: 160,
    badge: "Sold Out",
    description:
      "A soft cat-eye optical frame in black acetate, finished with a flecked shimmer along the upper rim.",
    images: [stockPhoto("1649303922416-75f631e6ac8e")],
    variants: [
      { id: "v1", name: "Black", hex: "#101010" },
      { id: "v2", name: "Tortoise", hex: "#6B4A2E" },
    ],
    frameShape: "Cat-Eye",
    material: "Acetate",
    specs: {
      material: "Italian acetate",
      lenses: "Ready for prescription lenses",
      hardware: "Steel core hinges",
      origin: "Made in Italy",
    },
  },
  {
    id: "p6",
    slug: "harlow",
    name: "Harlow",
    categorySlug: "prescription",
    price: 175,
    badge: "New",
    description:
      "A geometric optical frame in slim metal, with faceted rims and marbled acetate temple tips.",
    images: [stockPhoto("1749525694688-03217cfbc52e")],
    variants: [
      { id: "v1", name: "Black", hex: "#151515" },
      { id: "v2", name: "Gold", hex: "#B7975A" },
    ],
    frameShape: "Square",
    material: "Metal",
    specs: {
      material: "Stainless steel",
      lenses: "Ready for prescription lenses",
      hardware: "Marbled acetate tips",
      origin: "Made in Japan",
    },
  },
  {
    id: "p7",
    slug: "linear",
    name: "Linear",
    categorySlug: "contact-lenses",
    price: 120,
    description:
      "Monthly disposable contact lenses with a breathable silicone-hydrogel base for all-day comfort. Supplied with a case.",
    images: [stockPhoto("1743590363059-ce890f6cc97b")],
    variants: [{ id: "v1", name: "Clear", hex: "#E7E7E7" }],
    frameShape: "Round",
    material: "Acetate",
    specs: {
      material: "Silicone hydrogel",
      lenses: "Monthly disposable",
      hardware: "N/A",
      origin: "Made in Germany",
    },
  },
  {
    id: "p8",
    slug: "daily-clear",
    name: "Daily Clear",
    categorySlug: "contact-lenses",
    price: 130,
    badge: "Bestseller",
    description:
      "Daily disposable lenses with a high water content for extended wear comfort — no case, no solution.",
    images: [stockPhoto("1777380104555-1f47491729a6")],
    variants: [{ id: "v1", name: "Clear", hex: "#EDEDED" }],
    frameShape: "Round",
    material: "Acetate",
    specs: {
      material: "Hydrogel",
      lenses: "Daily disposable",
      hardware: "N/A",
      origin: "Made in Germany",
    },
  },
  {
    id: "p10",
    slug: "case-study",
    name: "Case Study",
    categorySlug: "accessories",
    price: 65,
    description:
      "A rigid, minimalist eyewear case in matte-finished vegan leather with a magnetic clasp.",
    images: [stockPhoto("1752127907132-30f67c040633")],
    variants: [
      { id: "v1", name: "Black", hex: "#0D0D0D" },
      { id: "v2", name: "Sand", hex: "#D8CBB4" },
    ],
    frameShape: "Rectangle",
    material: "Acetate",
    specs: {
      material: "Vegan leather",
      lenses: "N/A",
      hardware: "Magnetic clasp",
      origin: "Made in Portugal",
    },
    featured: true,
  },
  {
    id: "p11",
    slug: "cloth-and-co",
    name: "Cloth & Co",
    categorySlug: "accessories",
    price: 25,
    description:
      "A microfiber lens cloth in a soft, oversized cut, finished with a woven Puzzle logo in the corner.",
    images: [stockPhoto("1565940340677-c98b931ffebd")],
    variants: [
      { id: "v1", name: "White", hex: "#F4F4F2" },
      { id: "v2", name: "Stone", hex: "#C9C4BB" },
    ],
    frameShape: "Square",
    material: "Acetate",
    specs: {
      material: "Microfiber",
      lenses: "N/A",
      hardware: "N/A",
      origin: "Made in Portugal",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((product) => product.featured);
}

export interface FilterFacets {
  frameShapes: FrameShape[];
  materials: Material[];
  colors: { name: string; hex: string }[];
}

export function getFilterFacets(): FilterFacets {
  const frameShapes = Array.from(
    new Set(PRODUCTS.map((product) => product.frameShape))
  );
  const materials = Array.from(
    new Set(PRODUCTS.map((product) => product.material))
  );
  const colorMap = new Map<string, string>();
  for (const product of PRODUCTS) {
    for (const variant of product.variants) {
      colorMap.set(variant.name, variant.hex);
    }
  }
  const colors = Array.from(colorMap.entries()).map(([name, hex]) => ({
    name,
    hex,
  }));

  return { frameShapes, materials, colors };
}
