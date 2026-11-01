import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/data/products";

// Prerender one static page per category at build time.
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/sarees/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not Found" };
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({
  params,
}: PageProps<"/sarees/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <ProductGrid
      title={cat.name}
      description={cat.description}
      products={getProductsByCategory(cat.slug)}
    />
  );
}
