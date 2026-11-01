"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type CartButtonProps = {
  className?: string;
};

export default function CartButton({ className }: CartButtonProps) {
  const { openCart, itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
      className={
        className ??
        "relative rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
      }
    >
      <ShoppingCart className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-surface">
          {itemCount}
        </span>
      )}
    </button>
  );
}
