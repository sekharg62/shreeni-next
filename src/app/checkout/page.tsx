import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="mb-8 font-serif text-3xl font-semibold text-dark sm:text-4xl">Checkout</h1>
        {/* Cart, sign-in state and saved addresses all live in the browser. */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-surface" />}>
          <CheckoutView />
        </Suspense>
      </Container>
    </section>
  );
}
