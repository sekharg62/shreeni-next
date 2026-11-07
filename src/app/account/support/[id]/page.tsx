import type { Metadata } from "next";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import TicketThread from "@/components/support/TicketThread";

export const metadata: Metadata = {
  title: "Support request",
  robots: { index: false, follow: false },
};

export default async function SupportTicketPage({ params }: PageProps<"/account/support/[id]">) {
  const { id } = await params;
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          <RequireSignIn fallback={<div className="h-96 animate-pulse rounded-lg bg-background" aria-busy="true" />}>
            <TicketThread id={id} />
          </RequireSignIn>
        </div>
      </Container>
    </section>
  );
}
