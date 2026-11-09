"use client";

import type { ProductVariant } from "@/types/product";

type Props = {
  variants: ProductVariant[];
  value: string | null;
  onChange: (variantId: string) => void;
  /** Shown under the options, e.g. "Please choose a size". */
  error?: string | null;
};

/** Size options as a radio group. Sold-out sizes stay visible (struck through) but can't be picked. */
export default function SizeSelector({ variants, value, onChange, error }: Props) {
  const selected = variants.find((v) => v.id === value);
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-dark">
        Size{selected && <span className="font-normal text-muted">: {selected.size}</span>}
      </legend>
      <div role="radiogroup" aria-label="Size" className="mt-3 flex flex-wrap gap-2">
        {variants.map((v) => {
          const soldOut = v.available === 0;
          const active = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={soldOut ? `${v.size}, sold out` : v.size}
              disabled={soldOut}
              onClick={() => onChange(v.id)}
              className={`h-11 min-w-16 rounded-md border px-4 text-sm font-medium transition-[border-color,background-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                active
                  ? "border-primary bg-primary/5 text-primary shadow-[inset_0_0_0_1px_var(--color-primary)]"
                  : soldOut
                    ? "cursor-not-allowed border-border bg-background text-muted line-through opacity-60"
                    : error
                      ? "border-red-300 text-dark hover:border-primary"
                      : "border-border text-dark hover:border-dark"
              }`}
            >
              {v.size}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
