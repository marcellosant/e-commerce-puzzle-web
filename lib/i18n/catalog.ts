import type {
  CategorySlug,
  FrameShape,
  Material,
  Product,
  ProductBadge,
  ProductSpecs,
} from "@/types";
import type { Locale } from "@/lib/i18n/dictionaries";

const CATEGORY_NAMES: Record<CategorySlug, Record<Locale, string>> = {
  sunglasses: { en: "Sunglasses", pt: "Óculos de Sol" },
  prescription: { en: "Prescription", pt: "Grau" },
  "contact-lenses": { en: "Contact Lenses", pt: "Lentes de Contato" },
  accessories: { en: "Accessories", pt: "Acessórios" },
};

const FRAME_SHAPE_LABELS: Record<FrameShape, Record<Locale, string>> = {
  Round: { en: "Round", pt: "Redonda" },
  Square: { en: "Square", pt: "Quadrada" },
  Aviator: { en: "Aviator", pt: "Aviador" },
  "Cat-Eye": { en: "Cat-Eye", pt: "Gatinho" },
  Rectangle: { en: "Rectangle", pt: "Retangular" },
};

const MATERIAL_LABELS: Record<Material, Record<Locale, string>> = {
  Acetate: { en: "Acetate", pt: "Acetato" },
  Metal: { en: "Metal", pt: "Metal" },
  Titanium: { en: "Titanium", pt: "Titânio" },
};

const BADGE_LABELS: Record<ProductBadge, Record<Locale, string>> = {
  New: { en: "New", pt: "Novo" },
  Bestseller: { en: "Bestseller", pt: "Mais Vendido" },
  "Sold Out": { en: "Sold Out", pt: "Esgotado" },
};

const COLOR_LABELS: Record<string, string> = {
  Blush: "Rosé",
  Tortoise: "Tartaruga",
  Gold: "Dourado",
  Gunmetal: "Chumbo",
  Amber: "Âmbar",
  Oxblood: "Vinho",
  Black: "Preto",
  Clear: "Transparente",
  Sand: "Areia",
  White: "Branco",
  Stone: "Pedra",
};

export function categoryName(slug: CategorySlug, locale: Locale): string {
  return CATEGORY_NAMES[slug][locale];
}

export function frameShapeLabel(shape: FrameShape, locale: Locale): string {
  return FRAME_SHAPE_LABELS[shape][locale];
}

export function materialLabel(material: Material, locale: Locale): string {
  return MATERIAL_LABELS[material][locale];
}

export function badgeLabel(badge: ProductBadge, locale: Locale): string {
  return BADGE_LABELS[badge][locale];
}

/** Color/variant names are canonical English (used for filter matching) — this is display-only. */
export function colorLabel(name: string, locale: Locale): string {
  if (locale === "en") return name;
  return COLOR_LABELS[name] ?? name;
}

interface ProductContentPt {
  description: string;
  specs: ProductSpecs;
}

const PRODUCT_CONTENT_PT: Record<string, ProductContentPt> = {
  p1: {
    description:
      "Uma armação de acetato ampla e esculpida, com uma leve elevação em formato gatinho. A Meridian foi feita para cobertura total sem abrir mão da leveza.",
    specs: {
      material: "Acetato italiano",
      lenses: "CR-39 degradê, UV400",
      hardware: "Detalhe metálico dourado",
      origin: "Feito na Itália",
    },
  },
  p2: {
    description:
      "Armação redonda e fina em metal polido, com vidro mineral verde-escuro para uma nitidez sem distorção.",
    specs: {
      material: "Aço polido",
      lenses: "Vidro mineral, UV400",
      hardware: "Plaquetas nasais ajustáveis",
      origin: "Feito no Japão",
    },
  },
  p3: {
    description:
      "Uma armação redonda super dimensionada em metal quente, com lente degradê que vai do âmbar profundo ao transparente.",
    specs: {
      material: "Aço inoxidável",
      lenses: "CR-39 degradê, UV400",
      hardware: "Ponteiras em acetato",
      origin: "Feito na Itália",
    },
  },
  p4: {
    description:
      "Armação óptica browline com aro superior marcante em acetato e fio metálico fino embaixo — um formato discreto e preciso para o dia a dia.",
    specs: {
      material: "Acetato e aço",
      lenses: "Pronta para lentes de grau",
      hardware: "Dobradiças com mola",
      origin: "Feito no Japão",
    },
  },
  p5: {
    description:
      "Armação óptica gatinho suave em acetato preto, com acabamento matizado e brilho sutil na parte superior do aro.",
    specs: {
      material: "Acetato italiano",
      lenses: "Pronta para lentes de grau",
      hardware: "Dobradiças com núcleo de aço",
      origin: "Feito na Itália",
    },
  },
  p6: {
    description:
      "Armação óptica geométrica em metal fino, com aros facetados e ponteiras em acetato marmorizado.",
    specs: {
      material: "Aço inoxidável",
      lenses: "Pronta para lentes de grau",
      hardware: "Ponteiras em acetato marmorizado",
      origin: "Feito no Japão",
    },
  },
  p7: {
    description:
      "Lentes de contato descartáveis mensais com base de hidrogel de silicone respirável para conforto o dia todo. Acompanha estojo.",
    specs: {
      material: "Hidrogel de silicone",
      lenses: "Descarte mensal",
      hardware: "N/A",
      origin: "Fabricado na Alemanha",
    },
  },
  p8: {
    description:
      "Lentes descartáveis diárias com alto teor de água para conforto prolongado — sem estojo, sem solução.",
    specs: {
      material: "Hidrogel",
      lenses: "Descarte diário",
      hardware: "N/A",
      origin: "Fabricado na Alemanha",
    },
  },
  p10: {
    description:
      "Um estojo minimalista e rígido em couro vegano com acabamento fosco e fecho magnético.",
    specs: {
      material: "Couro vegano",
      lenses: "N/A",
      hardware: "Fecho magnético",
      origin: "Feito em Portugal",
    },
  },
  p11: {
    description:
      "Uma flanela de microfibra em corte amplo e macio, com o logo da Puzzle tecido no canto.",
    specs: {
      material: "Microfibra",
      lenses: "N/A",
      hardware: "N/A",
      origin: "Feito em Portugal",
    },
  },
};

/** Product names stay in English (brand-style naming); only description/specs are localized. */
export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "en") return product;
  const content = PRODUCT_CONTENT_PT[product.id];
  if (!content) return product;
  return { ...product, description: content.description, specs: content.specs };
}
