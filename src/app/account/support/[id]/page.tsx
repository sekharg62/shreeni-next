import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import TicketThread from "@/components/support/TicketThread";

export const metadata: Metadata = {
  title: "Support request",
  robots: { index: false, follow: false },
};

const loading = <div className="h-96 animate-pulse rounded-lg bg-background" aria-busy="true" />;

/** Reads the ticket id. Tickets are private (no static params), so this part is streamed in. */
async function Ticket({ params }: { params: PageProps<"/account/support/[id]">["params"] }) {
  const { id } = await params;
  return (
    <RequireSignIn fallback={loading}>
      <TicketThread id={id} />
    </RequireSignIn>
  );
}

// The page shell is prerendered; the part that depends on `params` sits inside <Suspense>
// as Cache Components requires.
export default function SupportTicketPage({ params }: PageProps<"/account/support/[id]">) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          <Suspense fallback={loading}>
            <Ticket params={params} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
