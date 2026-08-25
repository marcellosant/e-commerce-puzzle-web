"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, getFeaturedProducts } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { CategoryCard } from "@/components/category/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleContext";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const { t } = useLocale();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden border-b border-black">
        <Image
          src="https://picsum.photos/seed/puzzle-hero/1600/1000"
          alt="Puzzle eyewear editorial hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Always-on scrim so the hero copy stays legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end gap-6 px-4 pb-12 lg:px-8 lg:pb-20">
          <h1 className="font-sans uppercase text-h1 text-white max-w-xl w-full">
            {t.home.heroTitle}
          </h1>
          <Link href="/collection">
            <Button variant="primary" size="md">
              {t.home.heroCta}
            </Button>
          </Link>
        </div>
      </section>

      <Section title={t.home.shopByCategory}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              slug={category.slug}
              imageSeed={category.imageSeed}
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
