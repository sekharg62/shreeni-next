"use client";

import type { ProductVariant } from "@/types/product";

type Props = {
  variants: ProductVariant[];
  value: string | null;
  onChange: (variantId: string) => void;
  /** Shown under the options, e.g. "Please choose a size". */
  error?: string | null;
};

/** Size pills as a radio group. Sold-out sizes stay visible but can't be picked. */
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
              className={`min-w-14 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-surface"
                  : soldOut
                    ? "cursor-not-allowed border-border text-muted line-through opacity-60"
                    : "border-border text-dark hover:border-primary"
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
