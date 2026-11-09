import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { ProductCardItem } from "@/types/product";

/** Phones: ~70% of the screen (swipe row). From 768px: a quarter of the content width. */
const SIZES = "(max-width: 768px) 72vw, (max-width: 1440px) 25vw, 340px";

/**
 * "Handpicked for You" card, for the dark showcase band: the photo inside a temple arch
 * (a nod to Bishnupur's terracotta temple doorways), a double gold outline, a large gold
 * number in the arch's empty corner, and a quiet serif caption instead of buttons.
 */
export default function HandpickedCard({ product, position }: { product: ProductCardItem; position: number }) {
  const href = product.slug ? `/products/${product.slug}` : "/sarees";
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const number = String(position).padStart(2, "0");

  return (
    <Link
      href={href}
      // relative: keeps the hidden screen-reader label inside the card (see ProductCard).
      className="group relative block rounded-t-full text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-dark"
    >
      <div className="relative">
        {/* Outer gold line of the arch, a little apart from the photo. */}
        <div className="rounded-t-full border border-secondary/45 p-1.5 transition-colors duration-500 group-hover:border-secondary sm:p-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-primary/40 ring-1 ring-secondary/30">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes={SIZES}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-full items-center justify-center bg-gradient-to-b from-primary to-dark font-serif text-6xl text-secondary/50"
              >
                {product.name.charAt(0)}
              </div>
            )}
            {/* Soft shade at the foot of the arch so the badge reads on any photo. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark/70 to-transparent" />

            {product.badge && (
              <span className="absolute inset-x-0 bottom-3 flex justify-center sm:bottom-4">
                <span className="inline-flex items-center gap-1.5 border border-secondary/70 bg-dark/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-secondary backdrop-blur-sm sm:text-[10px]">
                  <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-secondary" />
                  {product.badge}
                  <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-secondary" />
                </span>
              </span>
            )}
          </div>
        </div>

        {/* "No. 01": sits in the empty corner beside the arch's curve. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 font-serif text-4xl italic leading-none text-secondary/60 transition-colors duration-500 group-hover:text-secondary sm:text-5xl"
        >
          {number}
        </span>
      </div>

      <div className="px-1 pt-5">
        <h3 className="line-clamp-2 min-h-[2lh] font-serif text-base font-semibold leading-snug text-surface sm:text-lg">
          {product.name}
        </h3>

        <span aria-hidden="true" className="mx-auto mt-3 flex w-fit items-center gap-1.5 text-secondary/80">
          <span className="h-px w-6 bg-current" />
          <span className="h-1.5 w-1.5 rotate-45 border border-current" />
          <span className="h-px w-6 bg-current" />
        </span>

        <p className="mt-3 flex items-baseline justify-center gap-2 text-sm">
          <span className="font-semibold tracking-wide text-secondary">{formatINR(product.price)}</span>
          {onSale && (
            <span className="text-xs text-surface/50 line-through">
              <span className="sr-only">Original price </span>
              {formatINR(product.compareAtPrice!)}
            </span>
          )}
        </p>

        <span
          aria-hidden="true"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-surface/70 transition-colors duration-300 group-hover:text-secondary"
        >
          Discover
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
