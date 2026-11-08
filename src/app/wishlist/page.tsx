"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CloudOff, Heart, RotateCw, UserRound } from "lucide-react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCT_GRID, ProductCardSkeleton } from "@/components/productGridLayout";

export default function WishlistPage() {
  const { items, count, status, synced, reload } = useWishlist();
  const { status: authStatus } = useAuth();
  const loading = status === "loading" || authStatus === "loading";

  // Fresh prices and availability each time the page is opened.
  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">My Wishlist</h1>
            <p className="mt-3 text-muted" aria-live="polite">
              {loading ? "Loading your saved items…" : `${count} ${count === 1 ? "item" : "items"} saved`}
            </p>
          </div>
        </header>

        {/* Guest with saved items: they live in this browser only. */}
        {!loading && !synced && count > 0 && (
          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-medium text-dark">Your wishlist is saved on this device only</p>
                <p className="mt-1 text-sm text-muted">Sign in to keep it safe and see it on your phone and computer.</p>
              </div>
            </div>
            <Link
              href="/account"
              className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Couldn't load the account's list. */}
        {status === "error" && (
          <div
            role="alert"
            className="mt-8 flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-medium text-dark">We couldn&apos;t load your wishlist</p>
                <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={reload}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-dark px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {loading && count === 0 ? (
          <div className={`mt-10 ${PRODUCT_GRID}`} aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : count === 0 ? (
          status !== "error" && (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-background">
                <Heart className="h-10 w-10 text-primary/40" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="font-serif text-lg font-semibold text-dark">Your wishlist is empty</p>
              <p className="max-w-sm text-sm text-muted">Tap the heart on any saree to save it here for later.</p>
              <Link
                href="/sarees"
                className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
              >
                Explore Sarees
              </Link>
            </div>
          )
        ) : (
          <div
            className={`mt-10 ${PRODUCT_GRID} transition-opacity ${loading ? "opacity-60" : ""}`}
            aria-busy={loading}
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
