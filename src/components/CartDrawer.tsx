"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
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
  } = useCart();
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
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-serif font-semibold text-dark">
                      {item.name}
                    </p>
                    <p className="text-sm font-medium text-secondary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    {/* Quantity stepper */}
                    <div className="mt-auto">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(next) => updateQuantity(item.id, next)}
                        min={1}
                        size="sm"
                      />
                    </div>
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
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}
