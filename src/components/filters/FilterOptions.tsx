"use client";

import { useId } from "react";
import RangeSlider from "@/components/ui/RangeSlider";
import { Check } from "lucide-react";
import { priceLabel, type CatalogFilters } from "@/lib/filters";
import type { ProductFacets } from "@/types/product";

/*
 * The option lists for each filter group. Shared by the desktop side panel and the phone sheet;
 * each takes the current (or draft) filters and reports changes through `onChange`.
 */

type GroupProps = {
  facets: ProductFacets;
  filters: CatalogFilters;
  onChange: (change: Partial<CatalogFilters>) => void;
};

const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
const Count = ({ n }: { n: number }) => <span className="ml-auto pl-2 text-xs tabular-nums text-muted">{n}</span>;

/** A row with a real (visually restyled) checkbox or radio, so keyboards and screen readers work. */
function OptionRow({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 text-sm text-dark transition-colors hover:text-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
          type === "radio" ? "rounded-full" : "rounded"
        } ${checked ? "border-primary bg-primary text-surface" : "border-border bg-surface"}`}
      >
        {checked && (type === "radio" ? <span className="h-1.5 w-1.5 rounded-full bg-surface" /> : <Check className="h-3 w-3" strokeWidth={3} />)}
      </span>
      {children}
    </label>
  );
}

const STEP = 100; // ₹100 slider steps
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Price slider for the category: ends from the cheapest/dearest product (rounded to ₹100), ₹100 steps. */
function PriceSlider({ facets, filters, onChange }: GroupProps) {
  const lo = Math.floor((facets.minPrice ?? 0) / 100 / STEP) * STEP;
  const hi = Math.max(lo + STEP, Math.ceil((facets.maxPrice ?? 0) / 100 / STEP) * STEP);
  return (
    <RangeSlider
      className="px-1 pb-2 pt-1"
      min={lo}
      max={hi}
      step={STEP}
      value={[filters.minPrice ?? lo, filters.maxPrice ?? hi]}
      format={rupees}
      labels={["Minimum price", "Maximum price"]}
      openEnded
      // A handle at an end means "no limit" on that side.
      onCommit={([a, b]) => onChange({ minPrice: a > lo ? a : undefined, maxPrice: b < hi ? b : undefined })}
    />
  );
}

export function PriceOptions({ facets, filters, onChange }: GroupProps) {
  const anySelected = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  // Unique radio group name: the desktop panel and the phone sheet can both be in the page.
  const id = useId();
  const canSlide = facets.minPrice !== null && facets.maxPrice !== null && facets.maxPrice > facets.minPrice;

  return (
    <div className="space-y-3">
      {canSlide && <PriceSlider facets={facets} filters={filters} onChange={onChange} />}
      <div className="space-y-1">
        <OptionRow type="radio" name={`${id}-price`} checked={!anySelected} onChange={() => onChange({ minPrice: undefined, maxPrice: undefined })}>
          Any price
        </OptionRow>
        {facets.priceBuckets.map((b) => {
          const lo = b.min === null ? undefined : b.min / 100;
          const hi = b.max === null ? undefined : b.max / 100;
          return (
            <OptionRow
              key={`${b.min}-${b.max}`}
              type="radio"
              name={`${id}-price`}
              checked={filters.minPrice === lo && filters.maxPrice === hi}
              onChange={() => onChange({ minPrice: lo, maxPrice: hi })}
            >
              {priceLabel(lo, hi)}
              <Count n={b.count} />
            </OptionRow>
          );
        })}
      </div>
    </div>
  );
}

/** Light swatches (ivory, white, mint…) need a dark check mark. */
function isLight(hex: string | null): boolean {
  const m = hex && /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

export function ColorOptions({ facets, filters, onChange }: GroupProps) {
  if (facets.colors.length === 0) return <p className="text-sm text-muted">No colours to choose from.</p>;
  return (
    <ul className="space-y-0.5">
      {facets.colors.map((c) => {
        const checked = filters.colors.includes(c.slug);
        return (
          <li key={c.slug}>
            <label className="relative flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-dark transition-colors hover:text-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange({ colors: toggle(filters.colors, c.slug) })}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  checked ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "border-border"
                }`}
                style={{
                  background:
                    c.hexCode ?? "conic-gradient(#c8102e, #f2c230, #2e7d32, #1e49a8, #6a2c91, #c8102e)",
                }}
              >
                {checked && <Check className={`h-3.5 w-3.5 ${isLight(c.hexCode) ? "text-dark" : "text-white"}`} strokeWidth={3} />}
              </span>
              <span>{c.name}</span>
              <Count n={c.count} />
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export function OfferOptions({ facets, filters, onChange }: GroupProps) {
  if (facets.offers.length === 0) return <p className="text-sm text-muted">No offers right now.</p>;
  return (
    <div className="space-y-1">
      <OptionRow type="radio" name="offer" checked={!filters.offer} onChange={() => onChange({ offer: undefined })}>
        All products
      </OptionRow>
      {facets.offers.map((o) => (
        <OptionRow
          key={o.minDiscount}
          type="radio"
          name="offer"
          checked={filters.offer === o.minDiscount}
          onChange={() => onChange({ offer: o.minDiscount })}
        >
          {o.minDiscount}% off or more
          <Count n={o.count} />
        </OptionRow>
      ))}
    </div>
  );
}

/** Tags that every product in the list has (e.g. "Handloom" inside Handloom) don't narrow anything, so they're hidden. */
export function usefulTags(facets: ProductFacets, filters: CatalogFilters) {
  return facets.tags.filter((t) => filters.tags.includes(t.slug) || (t.count > 0 && t.count < facets.total));
}

export function TagOptions({ facets, filters, onChange }: GroupProps) {
  const tags = usefulTags(facets, filters);
  if (tags.length === 0) return <p className="text-sm text-muted">No tags to narrow by here.</p>;
  return (
    <div className="space-y-1">
      {tags.map((t) => (
        <OptionRow
          key={t.slug}
          type="checkbox"
          name="tag"
          checked={filters.tags.includes(t.slug)}
          onChange={() => onChange({ tags: toggle(filters.tags, t.slug) })}
        >
          {t.name}
          <Count n={t.count} />
        </OptionRow>
      ))}
    </div>
  );
}

export function StockOption({ facets, filters, onChange }: GroupProps) {
  return (
    <OptionRow type="checkbox" name="stock" checked={filters.inStock} onChange={() => onChange({ inStock: !filters.inStock })}>
      In stock only
      <Count n={facets.inStockCount} />
    </OptionRow>
  );
}

/** The groups, in display order. */
export const FILTER_GROUPS = [
  { key: "price", title: "Price", Options: PriceOptions },
  { key: "colors", title: "Colour", Options: ColorOptions },
  { key: "offer", title: "Offers", Options: OfferOptions },
  { key: "tags", title: "Occasion & style", Options: TagOptions },
  { key: "stock", title: "Availability", Options: StockOption },
] as const;
