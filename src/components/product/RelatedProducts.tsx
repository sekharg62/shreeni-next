import ProductCard from "@/components/ProductCard";
import { getRelatedProducts } from "@/lib/data/catalog";
import { ProductCardSkeleton } from "@/components/productGridLayout";
import SectionTitle from "./SectionTitle";

/** "You may also like" — loaded separately so it never delays the product itself. */
export default async function RelatedProducts({ slug }: { slug: string }) {
  const items = await getRelatedProducts(slug);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <SectionTitle id="related-heading" eyebrow="Complete the look" title="You may also like" />
      {/* Phones: swipeable row, ~2¼ cards so the next one peeks in. Tablet/desktop: grid. */}
      <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.map((p) => (
          <li key={p.id} className="w-[44%] shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-8 w-56 animate-pulse rounded bg-background" />
      <div className="mt-6 grid grid-cols-2 gap-x-2 sm:mt-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <ProductCardSkeleton key={i} className={i > 1 ? "hidden sm:block" : ""} />
        ))}
      </div>
    </div>
  );
}
