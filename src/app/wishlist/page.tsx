"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { ids, count } = useWishlist();
  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <header className="border-b border-border pb-8">
          <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-3 text-muted">
            {count} {count === 1 ? "item" : "items"} saved
          </p>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Heart className="h-14 w-14 text-border" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-serif text-lg font-semibold text-dark">
              Your wishlist is empty
            </p>
            <p className="max-w-sm text-sm text-muted">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              href="/sarees/silk"
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              Explore Sarees
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
