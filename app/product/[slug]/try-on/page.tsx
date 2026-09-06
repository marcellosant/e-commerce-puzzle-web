import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/lib/data";
import { TryOnExperience } from "@/components/tryon/TryOnExperience";

interface TryOnPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.filter((product) => product.tryOn).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: TryOnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Same condition the page renders on, so a frame without try-on doesn't
  // get a "Try on ..." title over a 404.
  if (!product?.tryOn) return { title: "Page Not Found" };

  return {
    title: `Try on ${product.name}`,
    description: `See how the ${product.name} looks on you.`,
    // A camera view is useless to a crawler, and the canonical product page
    // already covers this frame.
    robots: { index: false, follow: true },
  };
}

export default async function TryOnPage({ params }: TryOnPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product?.tryOn) {
    notFound();
  }

  return <TryOnExperience productName={product.name} slug={product.slug} />;
}
