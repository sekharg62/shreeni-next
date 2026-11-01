"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.inStock === false;

  const cartPayload = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  };

  const buyNow = () => {
    addItem(cartPayload);
    openCart();
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            outOfStock ? "opacity-60 grayscale" : ""
          }`}
        />

        {/* Out of stock badge */}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-dark/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-surface">
            Out of Stock
          </span>
        )}

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-dark shadow-sm backdrop-blur transition-colors hover:text-red-500"
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
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-secondary">
          ₹{product.price.toLocaleString("en-IN")}
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
                onClick={() => addItem(cartPayload)}
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
