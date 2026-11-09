/**
 * Shared layout for every product grid (categories, wishlist, collections), so they always match.
 * Cards are borderless, so rows get some air: phones 2 columns (12px apart, 28px between rows),
 * tablet/desktop roomier 3–4 columns.
 */
export const PRODUCT_GRID = "grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4";

/** Loading placeholder shaped like a ProductCard: photo, category label, two-line name, price. */
export function ProductCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="aspect-[3/4] animate-pulse rounded-md bg-border/50" />
      <div className="space-y-2 px-0.5 pt-3 sm:pt-4">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-border/60" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-border/60" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-border/60" />
      </div>
    </div>
  );
}
