import { CollectionView } from "@/components/collection/CollectionView";
import type { CategorySlug } from "@/types";

interface CollectionPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function CollectionPage({
  searchParams,
}: CollectionPageProps) {
  const { category, q } = await searchParams;

  return (
    <CollectionView
      key={`${category ?? "all"}:${q ?? ""}`}
      initialCategory={category as CategorySlug | undefined}
      initialQuery={q}
    />
  );
}
