"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { ProductCardItem } from "@/types/product";
import { formatINR } from "@/lib/format";
import { useWishlist } from "@/context/WishlistContext";

const SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
/** Smallest discount worth a tag on the photo (same rule as the category badges). */
const MIN_TAG_PERCENT = 5;

/**
 * Boutique-style product card: borderless, photo first, no buttons at rest.
 * Desktop hover: the second photo crossfades in and a frosted "View saree" bar slides up.
 * Phones: the whole photo and name are the tap target.
 */
export default function ProductCard({ product }: { product: ProductCardItem }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.inStock === false;
  const href = product.slug ? `/products/${product.slug}` : null;
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const percentOff = onSale ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0;
  const hoverImage = product.image && product.hoverImage && product.hoverImage !== product.image ? product.hoverImage : null;

  // Pop the heart only when the shopper saves it (not for hearts already filled on load).
  const [tapped, setTapped] = useState(false);
  const toggleWishlist = () => {
    setTapped(true);
    toggle(product);
  };

  return (
    // h-full: every card in a grid row is as tall as the tallest one.
    // relative: keeps the hidden screen-reader labels (absolutely positioned) inside the card, so in a
    // swipe row they're clipped with it instead of widening the whole page.
    <div className="group relative flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-border/40">
        {/* Whole photo opens the product (skipped by keyboard: the name link below does the same). */}
        {href && <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />}

        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={SIZES}
              className={`object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none ${
                hoverImage ? "group-hover:opacity-0" : ""
              } ${
                // Sold out: muted, not black-and-white — the saree's colours stay recognisable.
                outOfStock ? "opacity-80 saturate-[0.35]" : ""
              }`}
            />
            {hoverImage && !outOfStock && (
              // Desktop only: `hidden` on phones also means the second photo is never downloaded there.
              <Image
                src={hoverImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 33vw, 25vw"
                className="hidden scale-[1.04] object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none md:block"
              />
            )}
          </>
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-dark"
          >
            <span className="font-serif text-5xl font-semibold text-surface/80">{product.name.charAt(0)}</span>
          </div>
        )}

        {/* Discount tag (the price line below says the same for screen readers). */}
        {percentOff >= MIN_TAG_PERCENT && !outOfStock && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-2 z-[2] rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-surface sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-[11px]"
          >
            −{percentOff}%
          </span>
        )}

        {/* Wishlist: soft frosted circle that reads on light and dark photos alike. */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-2 top-2 z-[3] flex h-9 w-9 items-center justify-center rounded-full bg-dark/20 text-surface backdrop-blur-sm transition-colors hover:bg-dark/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface sm:right-3 sm:top-3"
        >
          <Heart
            className={`h-[18px] w-[18px] drop-shadow transition-colors ${
              wishlisted ? `fill-red-500 text-red-500 ${tapped ? "heart-pop" : ""}` : ""
            }`}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>

        {outOfStock ? (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-surface/85 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-dark backdrop-blur-sm sm:py-2 sm:text-[11px]">
            Sold out
          </span>
        ) : (
          href && (
            // Desktop: slides up on hover (and on keyboard focus inside the card). Phones: hidden.
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-[calc(100%+0.75rem)] items-center justify-center gap-2 rounded bg-surface/90 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-dark opacity-0 shadow-sm backdrop-blur-md transition duration-300 ease-out hover:bg-surface group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none sm:flex"
            >
              View saree <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-3 sm:pt-4">
        {/* Always one line tall, so names and prices line up across a row. */}
        <p className="h-[1lh] truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-[11px]">
          {product.categoryName ?? ""}
        </p>
        {/* Always 2 lines tall (longer names end in "…"). */}
        <h3
          className="mt-1 line-clamp-2 min-h-[2lh] font-serif text-sm font-semibold leading-snug text-dark sm:text-base"
          title={product.name}
        >
          {href ? (
            <Link href={href} className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>

        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold text-primary">{formatINR(product.price)}</span>
          {onSale && (
            <span className="text-xs text-muted line-through">
              <span className="sr-only">Original price </span>
              {formatINR(product.compareAtPrice!)}
              <span className="sr-only">, {percentOff}% off</span>
            </span>
          )}
        </p>

        {!outOfStock && product.fewLeft != null && product.fewLeft > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-primary/80 sm:text-xs">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            Only {product.fewLeft} left
          </p>
        )}
      </div>
    </div>
  );
}
