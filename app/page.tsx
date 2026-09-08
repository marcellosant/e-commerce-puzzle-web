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
    <div>
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
