import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import OrderConfirmation from "@/components/orders/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

const loading = <div aria-busy="true" className="h-96 animate-pulse rounded-lg bg-background" />;

/** Reads the order number from the URL (inside Suspense, as Cache Components requires). */
async function Confirmation({ params }: { params: PageProps<"/checkout/success/[orderNumber]">["params"] }) {
  const { orderNumber } = await params;
  return <OrderConfirmation orderNumber={decodeURIComponent(orderNumber).toUpperCase()} />;
}

export default function OrderSuccessPage({ params }: PageProps<"/checkout/success/[orderNumber]">) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto w-full max-w-5xl">
          <Suspense fallback={loading}>
            <Confirmation params={params} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
