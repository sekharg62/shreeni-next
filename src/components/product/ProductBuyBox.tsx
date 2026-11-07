"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SizeSelector from "./SizeSelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/format";
import type { ProductVariant } from "@/types/product";

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  variants: ProductVariant[];
};

/** Price, size, quantity stepper and the cart / wishlist buttons. */
export default function ProductBuyBox({ productId, slug, name, image, price, compareAtPrice, variants }: Props) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const toast = useToast();

  const orderable = variants.filter((v) => v.available > 0);
  // One size (e.g. "Free Size") is picked for the shopper; with several they choose.
  const [variantId, setVariantId] = useState<string | null>(orderable.length === 1 && variants.length === 1 ? orderable[0].id : null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const variant = variants.find((v) => v.id === variantId) ?? null;
  const shownPrice = variant?.price ?? price;
  const shownCompare = variant ? variant.compareAtPrice : compareAtPrice;
  const max = variant?.available ?? 1;
  const soldOut = orderable.length === 0;
  const wishlisted = isWishlisted(productId);

  const pickSize = (id: string) => {
    setVariantId(id);
    setSizeError(null);
    const v = variants.find((x) => x.id === id);
    if (v) setQuantity((q) => Math.min(Math.max(q, 1), v.available));
  };

  const add = (thenOpen: boolean) => {
    if (!variant) {
      setSizeError("Please choose a size");
      return;
    }
    addItem(
      {
        id: variant.id,
        productId,
        slug,
        variantId: variant.id,
        size: variant.size,
        name,
        price: variant.price,
        image,
        maxQuantity: variant.available,
      },
      quantity,
    );
    if (thenOpen) openCart();
    else toast.success(`${name} added to cart`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Price */}
      <div>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold text-dark">{formatINR(shownPrice)}</span>
          {shownCompare != null && shownCompare > shownPrice && (
            <>
              <span className="text-lg text-muted line-through">
                <span className="sr-only">Original price </span>
                {formatINR(shownCompare)}
              </span>
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-semibold text-green-700">
                {Math.round((1 - shownPrice / shownCompare) * 100)}% off
              </span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
      </div>

      {variants.length > 0 && (
        <SizeSelector variants={variants} value={variantId} onChange={pickSize} error={sizeError} />
      )}

      {/* Quantity */}
      {!soldOut && (
        <div>
          <p className="text-sm font-semibold text-dark" id="qty-label">
            Quantity
          </p>
          <div className="mt-3 flex items-center gap-4" aria-labelledby="qty-label">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={max} />
            {variant && variant.available <= 3 && (
              <span className="text-sm font-medium text-amber-700">Only {variant.available} left</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {soldOut ? (
          <button
            type="button"
            disabled
            className="flex-1 cursor-not-allowed rounded-full border border-border px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-muted"
          >
            Sold out
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => add(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-surface"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => add(true)}
              className="flex-1 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              Buy Now
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            toggle(productId);
            if (wishlisted) toast.info(`${name} removed from wishlist`);
            else toast.success(`${name} saved to wishlist`);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border border-border text-dark transition-colors hover:border-red-400 hover:text-red-500"
        >
          <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
