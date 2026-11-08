import { PRODUCT_GRID, ProductCardSkeleton } from "@/components/productGridLayout";

const Bar = ({ className }: { className: string }) => <div className={`animate-pulse rounded bg-border/60 ${className}`} />;

/** Price slider + a few option rows, like one open filter group. */
function GroupSkeleton({ rows, slider = false }: { rows: number; slider?: boolean }) {
  return (
    <div className="border-b border-border py-4">
      <div className="flex items-center justify-between">
        <Bar className="h-3.5 w-20" />
        <Bar className="h-3.5 w-3.5" />
      </div>
      <div className="mt-4 space-y-3">
        {slider && (
          <div className="space-y-3 pb-1">
            <Bar className="h-3.5 w-28" />
            <div className="relative h-5">
              <Bar className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2" />
              <Bar className="absolute left-0 top-0 h-5 w-5 rounded-full" />
              <Bar className="absolute right-0 top-0 h-5 w-5 rounded-full" />
            </div>
          </div>
        )}
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Bar className="h-4 w-4 shrink-0" />
            <Bar className={`h-3 ${i % 2 ? "w-24" : "w-32"}`} />
            <Bar className="ml-auto h-3 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading state for a category listing, shaped like the real thing so nothing jumps:
 * desktop filter panel + toolbar + grid; phones get the grid and the Sort | Filter bar.
 */
export default function CatalogSkeleton({ className = "" }: { className?: string }) {
  return (
    <div aria-busy="true" aria-label="Loading products" className={`pb-24 lg:pb-0 ${className}`}>
      <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
        <div aria-hidden="true" className="hidden lg:block">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <Bar className="h-4 w-16" />
          </div>
          <GroupSkeleton rows={3} slider />
          <GroupSkeleton rows={6} />
          <GroupSkeleton rows={3} />
          <GroupSkeleton rows={4} />
          <GroupSkeleton rows={1} />
        </div>

        <div className="min-w-0" aria-hidden="true">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <Bar className="h-4 w-24" />
            <Bar className="hidden h-8 w-48 lg:block" />
          </div>
          <div className={`mt-5 sm:mt-6 ${PRODUCT_GRID}`}>
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Phones: the Sort | Filter bar's place, so it doesn't pop in. */}
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-border bg-surface/95 lg:hidden">
        <div className="flex justify-center py-4">
          <Bar className="h-4 w-16" />
        </div>
        <div className="flex justify-center border-l border-border py-4">
          <Bar className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
