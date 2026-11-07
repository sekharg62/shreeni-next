import ProductCard from "@/components/ProductCard";
import { getRelatedProducts } from "@/lib/data/catalog";

/** "You may also like" — loaded separately so it never delays the product itself. */
export default async function RelatedProducts({ slug }: { slug: string }) {
  const items = await getRelatedProducts(slug);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-serif text-2xl font-semibold text-dark sm:text-3xl">
        You may also like
      </h2>
      <div className="mt-2 h-0.5 w-16 bg-secondary" />
      {/* Phones: swipeable row. Desktop: 4-column grid. */}
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.map((p) => (
          <li key={p.id} className="w-[70%] shrink-0 snap-start sm:w-auto">
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
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`overflow-hidden rounded-md border border-border ${i > 1 ? "hidden sm:block" : ""}`}>
            <div className="aspect-[3/4] animate-pulse bg-background" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-background" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-background" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
