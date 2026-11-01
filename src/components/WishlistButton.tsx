"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton() {
  const { count } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist${count > 0 ? ` (${count} items)` : ""}`}
      className="relative rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-red-500"
    >
      <Heart className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
