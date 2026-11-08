"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ProductCardItem } from "@/types/product";
import { formatINR } from "@/lib/format";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: ProductCardItem }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.inStock === false;
  const href = product.slug ? `/products/${product.slug}` : null;

  // Pop the heart only when the shopper saves it (not for hearts already filled on load).
  const [tapped, setTapped] = useState(false);
  const toggleWishlist = () => {
    setTapped(true);
    toggle(product);
  };

  return (
    // h-full: every card in a grid row is as tall as the tallest one.
    <div className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface">
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Whole photo opens the product (skipped by keyboard: the name link below does the same). */}
        {href && (
          <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              // Sold out: muted, not black-and-white — the saree's colours stay recognisable.
              outOfStock ? "opacity-80 saturate-[0.35]" : ""
            }`}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-dark"
          >
            <span className="font-serif text-5xl font-semibold text-surface/80">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Out of stock: diagonal ribbon across the top-left corner (the photo box clips its ends). */}
        {outOfStock && (
          <span className="pointer-events-none absolute -left-9 top-5 z-[2] w-36 -rotate-45 bg-primary py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-surface shadow-md">
            Out of Stock
          </span>
        )}

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-dark shadow-sm backdrop-blur transition-colors hover:text-red-500"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              wishlisted ? `fill-red-500 text-red-500 ${tapped ? "heart-pop" : ""}` : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Always 2 lines tall (longer names end in "…"), so prices and buttons line up across a row. */}
        <h3 className="line-clamp-2 min-h-[2lh] font-serif text-lg font-semibold text-dark" title={product.name}>
          {href ? (
            <Link href={href} className="transition-colors hover:text-primary">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-medium text-secondary">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice != null && product.compareAtPrice > product.price && (
            <>
              <span className="text-muted line-through">
                <span className="sr-only">Original price </span>
                {formatINR(product.compareAtPrice)}
              </span>
              <span className="text-xs font-semibold text-green-700">
                {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
              </span>
            </>
          )}
        </p>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          {href && outOfStock ? (
            // Sold out: still worth a look (wishlist, share), but don't suggest it can be bought.
            <Link
              href={href}
              className="rounded-full border border-border px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
            >
              View details
            </Link>
          ) : href ? (
            // Sarees come in sizes: pick one on the product page before adding to cart.
            <Link
              href={href}
              className="rounded-full bg-primary px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              Choose size
            </Link>
          ) : (
            // No product page (old demo data): there's no size to add, so it can't go in the cart.
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
