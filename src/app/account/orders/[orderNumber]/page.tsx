import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import MyOrderDetail from "@/components/orders/MyOrderDetail";

export const metadata: Metadata = {
  title: "Order details",
  robots: { index: false, follow: false },
};

const loading = <div aria-busy="true" className="h-96 animate-pulse rounded-lg bg-background" />;

/** Orders are private (no static params), so the part that reads the URL is streamed in. */
async function Order({ params }: { params: PageProps<"/account/orders/[orderNumber]">["params"] }) {
  const { orderNumber } = await params;
  return (
    <RequireSignIn fallback={loading}>
      <MyOrderDetail orderNumber={decodeURIComponent(orderNumber).toUpperCase()} />
    </RequireSignIn>
  );
}

export default function MyOrderPage({ params }: PageProps<"/account/orders/[orderNumber]">) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-5xl">
          <Suspense fallback={loading}>
            <Order params={params} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
