import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
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
  return { title: col.name, description: col.description };
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
