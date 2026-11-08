"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import {
  EMPTY_FILTERS,
  SORTS,
  filterCount,
  toApiParams,
  withFilters,
  type CatalogFilters,
  type Sort,
} from "@/lib/filters";
import { productService } from "@/services/productService";
import type { ProductFacets } from "@/types/product";
import { FILTER_GROUPS } from "./FilterOptions";

/** Lock page scroll and close on Escape while a sheet is open. */
function useSheet(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}

function Portal({ children }: { children: ReactNode }) {
  return typeof document === "undefined"
    ? null
    : createPortal(children, document.body);
}

/**
 * Bottom sheet: slides up over a dimmed page, as tall as its content (up to 85% of the screen,
 * then the middle scrolls). Tap outside or press Esc to close.
 */
function BottomSheet({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[80] lg:hidden">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="sheet-fade absolute inset-0 bg-dark/40"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="sheet-up absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-surface shadow-2xl"
        >
          <div className="flex justify-center pb-1 pt-2.5" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}

/** Phone: full-screen filters — groups on the left, options on the right, "Show N products" to apply. */
export function FilterSheet({
  open,
  onClose,
  category,
  facets,
  filters,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  category: string;
  facets: ProductFacets;
  filters: CatalogFilters;
  onApply: (next: CatalogFilters) => void;
}) {
  useSheet(open, onClose);
  const [draft, setDraft] = useState(filters);
  const [group, setGroup] =
    useState<(typeof FILTER_GROUPS)[number]["key"]>("price");
  const [draftFacets, setDraftFacets] = useState(facets);
  const [counting, setCounting] = useState(false);
  const opened = useRef(false);

  // Start from the applied filters each time the sheet opens.
  useEffect(() => {
    if (open && !opened.current) {
      opened.current = true;
      void Promise.resolve().then(() => {
        setDraft(filters);
        setDraftFacets(facets);
      });
    }
    if (!open) opened.current = false;
  }, [open, filters, facets]);

  // Live counts for the draft, so "Show N products" is exact before applying.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setCounting(true);
      productService
        .facets({ category, ...toApiParams(draft) }, controller.signal)
        .then(setDraftFacets, () => {})
        .finally(() => !controller.signal.aborted && setCounting(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, draft, category]);

  if (!open) return null;
  const change = (c: Partial<CatalogFilters>) =>
    setDraft((d) => withFilters(d, c));
  const groupCount = (key: string) =>
    key === "price"
      ? Number(draft.minPrice !== undefined || draft.maxPrice !== undefined)
      : key === "colors"
        ? draft.colors.length
        : key === "tags"
          ? draft.tags.length
          : key === "offer"
            ? Number(!!draft.offer)
            : Number(draft.inStock);

  return (
    <BottomSheet label="Filters" onClose={onClose}>
      <div className="flex items-center justify-between border-b border-border px-4 pb-3">
        <h2 className="font-serif text-lg font-semibold text-dark">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="rounded-full p-2 text-dark hover:bg-background"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Height follows the content (the taller of the two columns), scrolling past 85% of the screen. */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ul
          className="w-[38%] shrink-0 overflow-y-auto bg-background"
          role="tablist"
          aria-orientation="vertical"
        >
          {FILTER_GROUPS.map((g) => {
            const n = groupCount(g.key);
            const active = g.key === group;
            return (
              <li key={g.key}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setGroup(g.key)}
                  className={`flex w-full items-center justify-between gap-2 border-l-[3px] px-3 py-4 text-left text-sm transition-colors ${
                    active
                      ? "border-primary bg-surface font-semibold text-dark"
                      : "border-transparent text-muted"
                  }`}
                >
                  {g.title}
                  {n > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-surface">
                      {n}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {/* Every group sits in the same grid cell; only the active one is visible. So the sheet is
            as tall as the LONGEST group and doesn't jump when switching between Price and Colour. */}
        <div className="grid min-w-0 flex-1 overflow-y-auto p-4">
          {FILTER_GROUPS.map(({ key, title, Options }) => {
            const active = key === group;
            return (
              <div
                key={key}
                role="tabpanel"
                aria-label={title}
                aria-hidden={!active}
                inert={!active}
                className={`[grid-area:1/1] ${active ? "" : "invisible"}`}
              >
                <Options key={`${key}-${draft.minPrice}-${draft.maxPrice}`} facets={draftFacets} filters={draft} onChange={change} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setDraft((d) => ({ ...d, ...EMPTY_FILTERS, page: 1 }))}
          disabled={filterCount(draft) === 0}
          className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-semibold text-dark disabled:opacity-40"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          className="flex-[2] rounded-full bg-primary px-4 py-3 text-sm font-semibold text-surface transition-colors hover:bg-dark"
        >
          {counting
            ? "Updating…"
            : `Show ${draftFacets.total} ${draftFacets.total === 1 ? "product" : "products"}`}
        </button>
      </div>
    </BottomSheet>
  );
}

/** Phone: sort options in a bottom sheet; picking one applies it straight away. */
export function SortSheet({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: Sort;
  onChange: (sort: Sort) => void;
}) {
  useSheet(open, onClose);
  if (!open) return null;
  return (
    <BottomSheet label="Sort by" onClose={onClose}>
      <p className="px-6 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">
        Sort by
      </p>
      <ul className="overflow-y-auto px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {SORTS.map((s) => (
          <li key={s.value}>
            <button
              type="button"
              onClick={() => {
                onChange(s.value);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left text-sm ${
                s.value === value
                  ? "bg-background font-semibold text-primary"
                  : "text-dark"
              }`}
            >
              {s.label}
              {s.value === value && (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
