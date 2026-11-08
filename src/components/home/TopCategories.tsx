import Link from "next/link";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import Container from "@/components/Container";
import { CACHE_TAGS, CATEGORY_SLUGS } from "@/config/constants";
import { categoryService } from "@/services/categoryService";
import type { CategoryCard } from "@/types/category";

export async function getTopCategories(slug: string): Promise<CategoryCard[]> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  try {
    const categories = await categoryService.children({ slug });
    cacheLife("minutes"); // admin edits show up within about a minute
    return categories;
  } catch (err) {
    // Backend down or parent slug missing: hide the section, retry soon.
    console.error("[TopCategories] could not load categories:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return [];
  }
}

export function CategoryTile({ category }: { category: CategoryCard }) {
  return (
    <Link href={`/sarees/${category.slug}`} className="group flex flex-col items-center gap-3 text-center">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-background transition-colors group-hover:border-secondary">
        {category.posterUrl ? (
          <Image
            src={category.posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1440px) 25vw, 340px"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          // No poster uploaded yet: a branded tile instead of a broken image.
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-dark"
          >
            <span className="font-serif text-6xl font-semibold text-surface/90 sm:text-7xl">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-dark transition-colors group-hover:text-primary sm:text-base">
        {category.name}
      </span>
    </Link>
  );
}

export default async function TopCategories() {
  const categories = await getTopCategories(CATEGORY_SLUGS.homeTopCategoriesParent);
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="scroll-mt-24 bg-surface py-20 sm:py-24" aria-labelledby="top-categories-heading">
      <Container>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Categories</p>
          <h2
            id="top-categories-heading"
            className="mt-3 font-serif text-2xl font-semibold text-dark sm:text-3xl lg:text-4xl"
          >
            Our Top Categories
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryTile category={c} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
