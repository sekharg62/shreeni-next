"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { ProductCardItem } from "@/types/product";
import { formatINR } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }: { product: ProductCardItem }) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const toast = useToast();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.inStock === false;
  const href = product.slug ? `/products/${product.slug}` : null;

  const cartPayload = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  };

  const addToCart = () => {
    addItem(cartPayload);
    toast.success(`${product.name} added to cart`);
  };

  const buyNow = () => {
    addItem(cartPayload);
    openCart();
  };

  const toggleWishlist = () => {
    toggle(product.id);
    if (wishlisted) {
      toast.info(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} saved to wishlist`);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface">
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
              outOfStock ? "opacity-60 grayscale" : ""
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

        {/* Out of stock badge */}
        {outOfStock && (
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-dark/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-surface">
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
              wishlisted ? "fill-red-500 text-red-500" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold text-dark">
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
        <div className="mt-4 flex flex-col gap-2">
          {outOfStock ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Unavailable
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={addToCart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-surface"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={buyNow}
                className="rounded-full bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
