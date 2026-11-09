import Link from "next/link";
import { Ruler, Scissors, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import type { ProductDetail } from "@/types/product";

/** 550 → "5.5 m" (sarees are measured in metres). */
export function metres(cm: number): string {
  return `${Number((cm / 100).toFixed(2))} m`;
}

/**
 * The facts shoppers look for first, before scrolling: fabric, length, blouse piece and colours.
 * Renders nothing when there's nothing to say.
 */
export function ProductHighlights({ product }: { product: ProductDetail }) {
  const { facts, colors } = product;
  const items = [
    facts.fabric && { icon: Sprout, label: facts.fabric },
    facts.lengthCm !== null && { icon: Ruler, label: `${metres(facts.lengthCm)} long` },
    { icon: Scissors, label: facts.blousePiece ? "Blouse piece included" : "No blouse piece" },
  ].filter(Boolean) as { icon: typeof Ruler; label: string }[];

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-semibold text-dark">Colour</span>
          {colors.map((c) => (
            <span key={`${c.type}-${c.name}`} className="inline-flex items-center gap-2 text-dark/85">
              <span
                aria-hidden="true"
                className="h-5 w-5 rounded-full border border-border shadow-[inset_0_0_0_2px_var(--color-surface)]"
                style={{ backgroundColor: c.hexCode ?? "transparent" }}
              />
              {c.name}
            </span>
          ))}
        </p>
      )}
      <ul className="flex flex-wrap gap-2" aria-label="Highlights">
        {items.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-dark/85"
          >
            <Icon className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Promises we can stand behind today. Shipping and returns are linked, not summarised,
 * because their policy pages are still placeholders.
 */
export function TrustLine() {
  return (
    <div className="space-y-3 border-t border-border pt-5 text-xs text-dark/80">
      <p className="flex flex-wrap gap-x-5 gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
          Handwoven in Bengal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
          Secure checkout
        </span>
      </p>
      <p className="flex gap-4 text-muted">
        <Link href="/shipping" className="underline-offset-2 hover:text-primary hover:underline">
          Shipping
        </Link>
        <Link href="/returns" className="underline-offset-2 hover:text-primary hover:underline">
          Returns
        </Link>
        <Link href="/contact" className="underline-offset-2 hover:text-primary hover:underline">
          Ask us about this saree
        </Link>
      </p>
    </div>
  );
}
