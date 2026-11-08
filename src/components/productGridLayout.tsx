/**
 * Shared layout for every product grid (categories, wishlist, collections), so they always match.
 * Phones: 2 tight columns (8px apart, 20px between rows) to show more products per screen.
 * Tablet/desktop: roomier 3–4 columns.
 */
export const PRODUCT_GRID = "grid grid-cols-2 gap-x-2 gap-y-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4";

/** Loading placeholder shaped like a ProductCard (borderless on phones, framed from 640px). */
export function ProductCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`overflow-hidden sm:rounded-md sm:border sm:border-border ${className}`}>
      <div className="aspect-[3/4] animate-pulse bg-surface sm:bg-background" />
      <div className="space-y-2 px-1 pt-2 sm:p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface sm:bg-background" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface sm:bg-background" />
      </div>
    </div>
  );
}
