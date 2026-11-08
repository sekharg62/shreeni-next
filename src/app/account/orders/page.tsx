import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import MyOrderList, { OrderListSkeleton } from "@/components/orders/MyOrderList";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Your Shreeni orders and their delivery status.",
  robots: { index: false, follow: false },
};

export default function MyOrdersPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          <Link href="/account" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> My account
          </Link>
          <header className="mt-4 border-b border-border pb-6">
            <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">My Orders</h1>
            <p className="mt-2 text-sm text-muted">Track, view or cancel your orders.</p>
          </header>
          <div className="mt-8">
            <RequireSignIn fallback={<OrderListSkeleton />}>
              <MyOrderList />
            </RequireSignIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
