"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, ShoppingBag } from "lucide-react";
import QuantityStepper from "@/components/ui/QuantityStepper";
import SizeSelector from "./SizeSelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { trackEcommerce } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import type { ProductVariant } from "@/types/product";

/** Same rule as the product cards: a "−N%" tag from 5% off. */
const MIN_TAG_PERCENT = 5;
/** How long "Added" shows on the button. */
const ADDED_MS = 1800;

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  variants: ProductVariant[];
  /** Weave / category name, for analytics. */
  category?: string;
  /** Shown between the price and the size picker (fabric, length, colours…). */
  highlights?: ReactNode;
};

/**
 * Price, highlights, size, quantity and the bag / wishlist buttons.
 * Phones: once the main button scrolls out of view, a slim bar with the price and
 * "Add to bag" stays at the bottom of the screen.
 */
export default function ProductBuyBox({
  productId,
  slug,
  name,
  image,
  price,
  compareAtPrice,
  variants,
  category,
  highlights,
}: Props) {
  const router = useRouter();
  const { addItem, closeCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  // "Product viewed" — powers GA4's most-viewed products report. Once per product page visit.
  useEffect(() => {
    trackEcommerce("view_item", [{ productId, name, price, category }]);
  }, [productId, name, price, category]);

  const orderable = variants.filter((v) => v.available > 0);
  // One size (e.g. "Free Size") is picked for the shopper; with several they choose.
  const [variantId, setVariantId] = useState<string | null>(
    orderable.length === 1 && variants.length === 1 ? orderable[0].id : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [heartTapped, setHeartTapped] = useState(false);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const variant = variants.find((v) => v.id === variantId) ?? null;
  const shownPrice = variant?.price ?? price;
  const shownCompare = variant ? variant.compareAtPrice : compareAtPrice;
  const onSale = shownCompare != null && shownCompare > shownPrice;
  const percentOff = onSale ? Math.round((1 - shownPrice / shownCompare!) * 100) : 0;
  const max = variant?.available ?? 1;
  const soldOut = orderable.length === 0;
  const wishlisted = isWishlisted(productId);

  // Sticky bar (phones): only after the shopper has scrolled past the main buttons.
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || soldOut) return;
    const io = new IntersectionObserver(([entry]) => {
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [soldOut]);

  // "Added ✓" fades back to "Add to bag".
  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), ADDED_MS);
    return () => window.clearTimeout(id);
  }, [added]);

  const pickSize = (id: string) => {
    setVariantId(id);
    setSizeError(null);
    const v = variants.find((x) => x.id === id);
    if (v) setQuantity((q) => Math.min(Math.max(q, 1), v.available));
  };

  /** Adds the chosen size. Without one: point the shopper at the size picker instead. */
  const addToBag = (): boolean => {
    if (!variant) {
      setSizeError("Please choose a size");
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
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
        category,
      },
      quantity,
    );
    setAdded(true);
    return true; // addItem opens the cart drawer, so the shopper sees it landed
  };

  /** Straight to checkout with this saree in the bag. */
  const buyNow = () => {
    if (!addToBag()) return;
    closeCart();
    router.push("/checkout");
  };

  const toggleWishlist = () => {
    setHeartTapped(true);
    toggle({ id: productId, slug, name, image, price, compareAtPrice });
  };

  const primaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold uppercase tracking-[0.18em] text-surface shadow-sm transition-[background-color,transform] duration-200 hover:bg-dark active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <div className="flex flex-col">
      {/* Price */}
      <div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-3xl font-semibold tracking-tight text-primary">{formatINR(shownPrice)}</span>
          {onSale && (
            <>
              <span className="text-lg text-muted line-through">
                <span className="sr-only">Original price </span>
                {formatINR(shownCompare!)}
              </span>
              {percentOff >= MIN_TAG_PERCENT && (
                <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold tracking-wide text-surface">
                  −{percentOff}%<span className="sr-only"> off</span>
                </span>
              )}
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
      </div>

      {highlights && <div className="mt-6 border-t border-border pt-6">{highlights}</div>}

      {variants.length > 0 && (
        <div ref={sizeRef} className="mt-6 scroll-mt-28">
          <SizeSelector variants={variants} value={variantId} onChange={pickSize} error={sizeError} />
        </div>
      )}

      {/* Quantity */}
      {!soldOut && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-dark" id="qty-label">
            Quantity
          </span>
          <div aria-labelledby="qty-label">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={max} size="sm" />
          </div>
          {variant && variant.available <= 3 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary/80">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              Only {variant.available} left
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div ref={actionsRef} className="mt-7 flex flex-col gap-3">
        <div className="flex gap-3">
          {soldOut ? (
            <button
              type="button"
              disabled
              className="h-13 flex-1 cursor-not-allowed rounded-md border border-border text-sm font-semibold uppercase tracking-[0.18em] text-muted"
            >
              Sold out
            </button>
          ) : (
            <button type="button" onClick={addToBag} className={`${primaryBtn} h-13 flex-1`} aria-live="polite">
              {added ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to bag
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className={`inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              wishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-border text-dark hover:border-dark"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${wishlisted ? `fill-red-500 text-red-500 ${heartTapped ? "heart-pop" : ""}` : ""}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </div>
        {!soldOut && (
          <button
            type="button"
            onClick={buyNow}
            className="h-12 rounded-md border border-dark text-sm font-semibold uppercase tracking-[0.18em] text-dark transition-colors hover:bg-dark hover:text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Buy now
          </button>
        )}
      </div>

      {/* Phones: sticky price + Add to bag once the main buttons are scrolled past. */}
      {!soldOut && (
        <div
          aria-hidden={!showBar}
          inert={!showBar}
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgba(50,21,27,0.35)] backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
            showBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">{variant ? `Size: ${variant.size}` : name}</p>
              <p className="text-lg font-semibold text-primary">{formatINR(shownPrice)}</p>
            </div>
            <button type="button" onClick={addToBag} className={`${primaryBtn} h-12 shrink-0`}>
              {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
              {added ? "Added" : variant ? "Add to bag" : "Choose size"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
