"use client";

import { CATEGORIES, getFeaturedProducts } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { CategoryCard } from "@/components/category/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { useLocale } from "@/context/LocaleContext";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const { t } = useLocale();

  return (
    // Every image on the home page is desaturated, so the landing reads as one
    // monochrome statement and colour arrives only once you start choosing a
    // frame. Applied here rather than inside the cards because it is a decision
    // about this page: the same cards stay in colour in the collection, where
    // colour is something you shop by.
    <div className="[&_img]:grayscale">
      <HeroCarousel />

      <Section title={t.home.shopByCategory}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              slug={category.slug}
              image={category.image}
            />
          ))}
        </div>
      </Section>

      <Section title={t.home.curatedFrames} viewAllHref="/collection">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </div>
  );
}
