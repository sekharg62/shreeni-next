"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AlertCircle, Info, ShoppingCart, Trash2, X } from "lucide-react";
import { isBlocked, useCart, type CartItem } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import QuantityStepper from "@/components/ui/QuantityStepper";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    subtotal,
    removeItem,
    updateQuantity,
    changed,
  } = useCart();
  const blockedCount = items.filter(isBlocked).length;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-dark/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel — slides in from the right */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-xl font-semibold text-dark">
            Your Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart
              className="h-14 w-14 text-border"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-serif text-lg font-semibold text-dark">
              No item added
            </p>
            <p className="text-sm text-muted">
              Your cart is empty. Start adding your favourite drapes.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {changed && (
              <p className="flex items-start gap-2 border-b border-border bg-amber-50 px-5 py-3 text-xs text-amber-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Some prices or stock changed since you added these items. Your cart shows the latest.
              </p>
            )}
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className={`flex gap-4 py-4 ${isBlocked(item) ? "opacity-70" : ""}`}>
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-background">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-serif font-semibold text-dark">
                      {item.name}
                    </p>
                    {item.size ? (
                      <p className="text-xs text-muted">Size: {item.size}</p>
                    ) : item.slug ? (
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-amber-700 underline underline-offset-2"
                      >
                        Choose a size
                      </Link>
                    ) : null}
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="font-medium text-secondary">{formatINR(item.price * item.quantity)}</span>
                      {item.compareAtPrice != null && item.compareAtPrice > item.price && (
                        <span className="text-xs text-muted line-through">
                          <span className="sr-only">Original price </span>
                          {formatINR(item.compareAtPrice * item.quantity)}
                        </span>
                      )}
                    </p>
                    <LineNote item={item} />

                    {/* Quantity stepper */}
                    {!isBlocked(item) && (
                      <div className="mt-auto pt-2">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(next) => updateQuantity(item.id, next)}
                          min={1}
                          max={item.maxQuantity}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="self-start text-muted transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer / checkout */}
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-serif text-lg font-semibold text-dark">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {blockedCount > 0
                  ? `${blockedCount} unavailable item${blockedCount === 1 ? " is" : "s are"} not included. Remove ${blockedCount === 1 ? "it" : "them"} to check out.`
                  : "Shipping calculated at checkout."}
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}

/** Why a line changed or can't be bought. */
function LineNote({ item }: { item: CartItem }) {
  if (!item.issue) {
    return item.maxQuantity !== undefined && item.maxQuantity <= 3 && item.quantity >= item.maxQuantity ? (
      <p className="mt-1 text-xs text-amber-700">Only {item.maxQuantity} left</p>
    ) : null;
  }
  const text =
    item.issue === "QUANTITY_REDUCED"
      ? `Only ${item.maxQuantity} left — quantity updated`
      : item.issue === "OUT_OF_STOCK"
        ? "Out of stock — remove to continue"
        : "No longer available — remove to continue";
  const tone = item.issue === "QUANTITY_REDUCED" ? "text-amber-700" : "text-red-700";
  return (
    <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${tone}`}>
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}
