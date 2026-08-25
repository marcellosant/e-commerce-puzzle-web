import { describe, expect, it } from "vitest";
import {
  badgeLabel,
  categoryName,
  colorLabel,
  frameShapeLabel,
  localizeProduct,
  materialLabel,
} from "@/lib/i18n/catalog";
import { PRODUCTS } from "@/lib/data";

describe("catalog label helpers", () => {
  it("return the English value unchanged for locale 'en'", () => {
    expect(categoryName("sunglasses", "en")).toBe("Sunglasses");
    expect(frameShapeLabel("Cat-Eye", "en")).toBe("Cat-Eye");
    expect(materialLabel("Titanium", "en")).toBe("Titanium");
    expect(badgeLabel("Sold Out", "en")).toBe("Sold Out");
    expect(colorLabel("Jet Black", "en")).toBe("Jet Black");
  });

  it("translate to Portuguese for locale 'pt'", () => {
    expect(categoryName("sunglasses", "pt")).toBe("Óculos de Sol");
    expect(frameShapeLabel("Cat-Eye", "pt")).toBe("Gatinho");
    expect(materialLabel("Titanium", "pt")).toBe("Titânio");
    expect(badgeLabel("Sold Out", "pt")).toBe("Esgotado");
    expect(colorLabel("Jet Black", "pt")).toBe("Preto Ônix");
  });

  it("colorLabel falls back to the original name for an unmapped color", () => {
    expect(colorLabel("Some New Color", "pt")).toBe("Some New Color");
  });
});

describe("localizeProduct", () => {
  it("returns the product unchanged for locale 'en'", () => {
    const product = PRODUCTS[0];
    expect(localizeProduct(product, "en")).toBe(product);
  });

  it("returns translated description and specs for locale 'pt', keeping the name in English", () => {
    const product = PRODUCTS[0];
    const localized = localizeProduct(product, "pt");
    expect(localized.name).toBe(product.name);
    expect(localized.description).not.toBe(product.description);
    expect(localized.specs).not.toEqual(product.specs);
  });

  it("falls back to the original product if no translation exists for its id", () => {
    const untranslated = { ...PRODUCTS[0], id: "not-a-real-id" };
    expect(localizeProduct(untranslated, "pt")).toBe(untranslated);
  });
});
