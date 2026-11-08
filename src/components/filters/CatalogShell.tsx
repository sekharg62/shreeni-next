"use client";

import { useCallback, useRef, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import Accordion from "@/components/product/Accordion";
import SelectMenu from "@/components/ui/SelectMenu";
import {
  EMPTY_FILTERS,
  SORTS,
  filterCount,
  hasFilters,
  priceLabel,
  toSearch,
  withFilters,
  type CatalogFilters,
  type Sort,
} from "@/lib/filters";
import type { ProductFacets } from "@/types/product";
import { FILTER_GROUPS } from "./FilterOptions";
import { FilterSheet, SortSheet } from "./MobileSheets";

type Props = {
  category: string;
  filters: CatalogFilters;
  /** null when the filter options couldn't be loaded: the list still works, without filters. */
  facets: ProductFacets | null;
  total: number;
  /** The product grid (rendered on the server). */
  children: ReactNode;
};

/**
 * Category listing chrome. Desktop: filter panel on the left, count + sort + applied chips on top.
 * Phones: a sticky "Sort | Filter" bar opening full-screen/bottom sheets. Every change updates the URL
 * (shareable, works with Back); the old grid stays visible, dimmed, while the new one loads.
 */
export default function CatalogShell({ category, filters, facets, total, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const apply = useCallback(
    (next: CatalogFilters) => {
      startTransition(() => router.push(`${pathname}${toSearch(next)}`, { scroll: false }));
      // If the shopper had scrolled down the grid, bring the top of the results back into view.
      const el = top.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [pathname, router],
  );
  const change = (c: Partial<CatalogFilters>) => apply(withFilters(filters, c));
  const closeSheet = useCallback(() => setSheet(null), []);

  const chips = facets ? appliedChips(filters, facets) : [];
  const count = filterCount(filters);

  return (
    <div ref={top} className="scroll-mt-24 pb-24 lg:pb-0">
      <div className={facets ? "lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10" : ""}>
        {/* Desktop filter panel */}
        {facets && (
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-1">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-dark">Filters</h2>
                {hasFilters(filters) && (
                  <button
                    type="button"
                    onClick={() => apply({ ...filters, ...EMPTY_FILTERS, page: 1 })}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {FILTER_GROUPS.map(({ key, title, Options }) => (
                <Accordion key={key} title={title} defaultOpen>
                  <Options key={`${key}-${filters.minPrice}-${filters.maxPrice}`} facets={facets} filters={filters} onChange={change} />
                </Accordion>
              ))}
            </div>
          </aside>
        )}

        <div className="min-w-0">
          {/* Toolbar: count + sort (desktop) */}
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <p className="text-sm text-muted" aria-live="polite">
              {pending ? "Updating…" : `${total} ${total === 1 ? "product" : "products"}`}
            </p>
            <SelectMenu
              className="hidden lg:block"
              label="Sort by"
              options={SORTS}
              value={filters.sort}
              onChange={(sort: Sort) => change({ sort })}
            />
          </div>

          {/* Applied filters */}
          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Applied filters">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={() => change(chip.remove)}
                    aria-label={`Remove filter: ${chip.label}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-3 pr-2 text-xs font-medium text-dark transition-colors hover:border-primary hover:text-primary"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => apply({ ...filters, ...EMPTY_FILTERS, page: 1 })}
                  className="px-2 text-xs font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <div className={`transition-opacity duration-200 ${pending ? "pointer-events-none opacity-50" : ""}`} aria-busy={pending}>
            {children}
          </div>
        </div>
      </div>

      {/* Phones: sticky Sort | Filter bar */}
      {facets && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setSheet("sort")}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold uppercase tracking-wider text-dark"
            >
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" /> Sort
            </button>
            <button
              type="button"
              onClick={() => setSheet("filter")}
              className="flex items-center justify-center gap-2 border-l border-border py-3.5 text-sm font-semibold uppercase tracking-wider text-dark"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filter
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-surface">
                  {count}
                </span>
              )}
            </button>
          </div>
          <FilterSheet
            open={sheet === "filter"}
            onClose={closeSheet}
            category={category}
            facets={facets}
            filters={filters}
            onApply={apply}
          />
          <SortSheet open={sheet === "sort"} onClose={closeSheet} value={filters.sort} onChange={(sort) => change({ sort })} />
        </>
      )}
    </div>
  );
}

/** One chip per applied value, each knowing how to remove itself. */
function appliedChips(f: CatalogFilters, facets: ProductFacets) {
  const chips: { key: string; label: string; remove: Partial<CatalogFilters> }[] = [];
  if (f.minPrice !== undefined || f.maxPrice !== undefined) {
    chips.push({ key: "price", label: priceLabel(f.minPrice, f.maxPrice), remove: { minPrice: undefined, maxPrice: undefined } });
  }
  for (const slug of f.colors) {
    const name = facets.colors.find((c) => c.slug === slug)?.name ?? slug;
    chips.push({ key: `color-${slug}`, label: name, remove: { colors: f.colors.filter((c) => c !== slug) } });
  }
  if (f.offer) chips.push({ key: "offer", label: `${f.offer}% off or more`, remove: { offer: undefined } });
  for (const slug of f.tags) {
    const name = facets.tags.find((t) => t.slug === slug)?.name ?? slug;
    chips.push({ key: `tag-${slug}`, label: name, remove: { tags: f.tags.filter((t) => t !== slug) } });
  }
  if (f.inStock) chips.push({ key: "stock", label: "In stock", remove: { inStock: false } });
  return chips;
}
