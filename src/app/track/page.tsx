import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import TrackOrder from "@/components/orders/TrackOrder";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Track Order",
  description: `Track your ${siteConfig.name} order with your order ID and the mobile number or email you used at checkout.`,
  path: "/track",
});

export default function TrackOrderPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-8 border-b border-border pb-6">
            <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">Track your order</h1>
            <p className="mt-2 text-muted">Enter your order ID and the mobile number or email you used at checkout.</p>
          </header>
          {/* Reads ?order= from the link in the confirmation page. */}
          <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-surface" />}>
            <TrackOrder />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
