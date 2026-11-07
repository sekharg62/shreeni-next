import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { pageMetadata } from "@/lib/seo";
import {
  collections,
  getCollection,
  getProductsByCollection,
} from "@/data/products";

// Prerender one static page per collection at build time.
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) return { title: "Not Found" };
  // Collections still use placeholder demo products: keep them out of search until they're real.
  return pageMetadata({ title: col.name, description: col.description, path: `/collections/${col.slug}`, noIndex: true });
}

export default async function CollectionPage({
  params,
}: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) notFound();

  return (
    <ProductGrid
      title={col.name}
      description={col.description}
      products={getProductsByCollection(col.slug)}
    />
  );
}
