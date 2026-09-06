import type {
  Category,
  FrameShape,
  Material,
  Product,
} from "@/types";

// TEMPORARY: every product/category photo below is a stock Unsplash image
// picked (and manually checked) to roughly match that product's shape/style
// — none of this is real Puzzle product photography yet. Swap it all out
// for real shots once they exist; each spot below is a stockPhoto(id) call.

function stockPhoto(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;
}

function stockPhotoPortrait(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=80`;
}

export const CATEGORIES: Category[] = [
  {
    slug: "sunglasses",
    name: "Sunglasses",
    imageSeed: "puzzle-cat-sunglasses",
    image: stockPhotoPortrait("1511499767150-a48a237f0083"),
  },
  {
    slug: "prescription",
    name: "Prescription",
    imageSeed: "puzzle-cat-prescription",
    image: stockPhotoPortrait("1574258495973-f010dfbb5371"),
  },
  {
    slug: "contact-lenses",
    name: "Contact Lenses",
    imageSeed: "puzzle-cat-contacts",
    image: stockPhotoPortrait("1494869042583-f6c911f04b4c"),
  },
  {
    slug: "accessories",
    name: "Accessories",
    imageSeed: "puzzle-cat-accessories",
    image: stockPhotoPortrait("1761896877961-90b19228334f"),
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
      { id: "v1", name: "Jet Black", hex: "#0A0A0A" },
      { id: "v2", name: "Tortoise", hex: "#6B4A2E" },
    ],
    frameShape: "Cat-Eye",
    material: "Acetate",
    specs: {
      material: "Italian acetate",
      lenses: "Polarized CR-39, UV400",
      hardware: "Stainless steel hinges",
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
      "Classic aviator silhouette in brushed titanium, finished with mineral glass lenses for distortion-free clarity.",
    images: [stockPhoto("1511499767150-a48a237f0083")],
    variants: [
      { id: "v1", name: "Gunmetal", hex: "#3A3B3C" },
      { id: "v2", name: "Gold", hex: "#B8975A" },
    ],
    frameShape: "Aviator",
    material: "Titanium",
    specs: {
      material: "Brushed titanium",
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
      "An oversized round frame with a deep, matte finish — engineered for maximum light coverage in an editorial silhouette.",
    images: [stockPhoto("1577803645773-f96470509666")],
    variants: [
      { id: "v1", name: "Matte Black", hex: "#111111" },
      { id: "v2", name: "Olive", hex: "#5C5A44" },
    ],
    frameShape: "Round",
    material: "Acetate",
    specs: {
      material: "Bio-acetate",
      lenses: "Polarized CR-39, UV400",
      hardware: "Spring hinges",
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
      "A clean rectangular optical frame in lightweight titanium — a quiet, precise everyday shape.",
    images: [stockPhoto("1591076482161-42ce6da69f67")],
    variants: [
      { id: "v1", name: "Silver", hex: "#C7C9CB" },
      { id: "v2", name: "Black", hex: "#151515" },
    ],
    frameShape: "Rectangle",
    material: "Titanium",
    specs: {
      material: "Titanium",
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
      "Soft square acetate optical frame with a slightly rounded profile for an approachable, editorial finish.",
    images: [stockPhoto("1574258495973-f010dfbb5371")],
    variants: [
      { id: "v1", name: "Amber", hex: "#8A5A2B" },
      { id: "v2", name: "Black", hex: "#101010" },
    ],
    frameShape: "Square",
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
      "A refined round optical frame in polished metal, paired with keyhole bridge detailing.",
    images: [stockPhoto("1591076482161-42ce6da69f67")],
    variants: [
      { id: "v1", name: "Gold", hex: "#B7975A" },
      { id: "v2", name: "Gunmetal", hex: "#414243" },
    ],
    frameShape: "Round",
    material: "Metal",
    specs: {
      material: "Stainless steel",
      lenses: "Ready for prescription lenses",
      hardware: "Keyhole bridge",
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
      "Monthly disposable contact lenses with a breathable silicone-hydrogel base for all-day comfort.",
    images: [stockPhoto("1494869042583-f6c911f04b4c")],
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
    images: [stockPhoto("1516220362602-dba5272034e7")],
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
    id: "p9",
    slug: "night-shift",
    name: "Night Shift",
    categorySlug: "contact-lenses",
    price: 140,
    description:
      "Extended-wear lenses with a blue-light filtering tint, designed for long screen-heavy days.",
    images: [stockPhoto("1564278692313-b2d65996fc93")],
    variants: [{ id: "v1", name: "Blue Tint", hex: "#D8E3EA" }],
    frameShape: "Round",
    material: "Acetate",
    specs: {
      material: "Silicone hydrogel",
      lenses: "Blue-light filtering",
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
    images: [stockPhoto("1632986636968-04958bfbbf3f")],
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
      "A microfiber lens cloth set in three tonal shades, finished with a woven Puzzle logo.",
    images: [stockPhoto("1737091985926-f9acc594fcbb")],
    variants: [
      { id: "v1", name: "Stone", hex: "#C9C4BB" },
      { id: "v2", name: "Black", hex: "#141414" },
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
  {
    id: "p12",
    slug: "chain-link",
    name: "Chain Link",
    categorySlug: "accessories",
    price: 45,
    badge: "New",
    description:
      "A sculptural stainless-steel eyewear chain with a matte finish, built to hold frames securely.",
    images: [stockPhoto("1761896877961-90b19228334f")],
    variants: [
      { id: "v1", name: "Silver", hex: "#C7C9CB" },
      { id: "v2", name: "Gold", hex: "#B8975A" },
    ],
    frameShape: "Square",
    material: "Metal",
    specs: {
      material: "Stainless steel",
      lenses: "N/A",
      hardware: "Lobster clasp",
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
