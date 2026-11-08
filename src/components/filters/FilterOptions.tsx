"use client";

import { useId, useState, type FormEvent } from "react";
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

export function PriceOptions({ facets, filters, onChange }: GroupProps) {
  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");
  const anySelected = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  // Unique ids: the desktop panel and the phone sheet can both be in the page.
  const id = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const lo = min === "" ? undefined : Math.max(0, Math.floor(Number(min)));
    const hi = max === "" ? undefined : Math.max(0, Math.floor(Number(max)));
    // Swap if entered the wrong way round.
    const [a, b] = lo !== undefined && hi !== undefined && lo > hi ? [hi, lo] : [lo, hi];
    onChange({ minPrice: a, maxPrice: b });
  };

  return (
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
      <form onSubmit={submit} className="flex items-center gap-2 pt-2" aria-label="Custom price range">
        <label className="sr-only" htmlFor={`${id}-min`}>
          Minimum price in rupees
        </label>
        <input
          id={`${id}-min`}
          inputMode="numeric"
          placeholder={facets.minPrice !== null ? `₹${Math.floor(facets.minPrice / 100)}` : "Min"}
          value={min}
          onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
          className="w-full min-w-0 rounded-md border border-border bg-surface px-2.5 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <span className="text-muted" aria-hidden="true">
          –
        </span>
        <label className="sr-only" htmlFor={`${id}-max`}>
          Maximum price in rupees
        </label>
        <input
          id={`${id}-max`}
          inputMode="numeric"
          placeholder={facets.maxPrice !== null ? `₹${Math.ceil(facets.maxPrice / 100)}` : "Max"}
          value={max}
          onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
          className="w-full min-w-0 rounded-md border border-border bg-surface px-2.5 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md border border-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-surface"
        >
          Go
        </button>
      </form>
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
