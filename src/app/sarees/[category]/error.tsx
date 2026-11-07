"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";

/** Shown when the catalogue can't be loaded (backend down, timeout). 404s use not-found.tsx instead. */
export default function CategoryError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24">
      <Container className="text-center">
        <h1 className="font-serif text-2xl font-semibold text-dark sm:text-3xl">We couldn&apos;t load this category</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">This is usually brief. Please try again in a moment.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-primary px-7 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-surface"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </section>
  );
}
