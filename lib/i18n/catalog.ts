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
  "Jet Black": "Preto Ônix",
  Tortoise: "Tartaruga",
  Gunmetal: "Chumbo",
  Gold: "Dourado",
  "Matte Black": "Preto Fosco",
  Olive: "Verde-Oliva",
  Silver: "Prata",
  Black: "Preto",
  Amber: "Âmbar",
  Clear: "Transparente",
  "Blue Tint": "Tom Azulado",
  Sand: "Areia",
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
      lenses: "CR-39 polarizada, UV400",
      hardware: "Dobradiças em aço inoxidável",
      origin: "Feito na Itália",
    },
  },
  p2: {
    description:
      "Silhueta clássica de aviador em titânio escovado, com lentes de vidro mineral para uma nitidez sem distorção.",
    specs: {
      material: "Titânio escovado",
      lenses: "Vidro mineral, UV400",
      hardware: "Plaquetas nasais ajustáveis",
      origin: "Feito no Japão",
    },
  },
  p3: {
    description:
      "Uma armação redonda super dimensionada com acabamento fosco profundo — projetada para cobertura máxima de luz em uma silhueta editorial.",
    specs: {
      material: "Bioacetato",
      lenses: "CR-39 polarizada, UV400",
      hardware: "Dobradiças com mola",
      origin: "Feito na Itália",
    },
  },
  p4: {
    description:
      "Uma armação óptica retangular e discreta em titânio leve — um formato silencioso e preciso para o dia a dia.",
    specs: {
      material: "Titânio",
      lenses: "Pronta para lentes de grau",
      hardware: "Dobradiças com mola",
      origin: "Feito no Japão",
    },
  },
  p5: {
    description:
      "Armação óptica quadrada e suave em acetato, com perfil levemente arredondado para um acabamento editorial e acolhedor.",
    specs: {
      material: "Acetato italiano",
      lenses: "Pronta para lentes de grau",
      hardware: "Dobradiças com núcleo de aço",
      origin: "Feito na Itália",
    },
  },
  p6: {
    description:
      "Uma armação óptica redonda e refinada em metal polido, com detalhe de ponte em buraco de fechadura.",
    specs: {
      material: "Aço inoxidável",
      lenses: "Pronta para lentes de grau",
      hardware: "Ponte estilo buraco de fechadura",
      origin: "Feito no Japão",
    },
  },
  p7: {
    description:
      "Lentes de contato descartáveis mensais com base de hidrogel de silicone respirável para conforto o dia todo.",
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
  p9: {
    description:
      "Lentes de uso prolongado com filtro para luz azul, feitas para dias longos na frente da tela.",
    specs: {
      material: "Hidrogel de silicone",
      lenses: "Filtro de luz azul",
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
      "Um kit de flanelas de microfibra em três tons, finalizado com o logo da Puzzle tecido.",
    specs: {
      material: "Microfibra",
      lenses: "N/A",
      hardware: "N/A",
      origin: "Feito em Portugal",
    },
  },
  p12: {
    description:
      "Uma corrente escultural em aço inoxidável com acabamento fosco, feita para segurar a armação com segurança.",
    specs: {
      material: "Aço inoxidável",
      lenses: "N/A",
      hardware: "Fecho tipo lagosta",
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
