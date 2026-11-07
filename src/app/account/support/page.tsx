import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import SupportTicketList, { TicketListSkeleton } from "@/components/support/SupportTicketList";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Your Shreeni support requests.",
  robots: { index: false, follow: false },
};

export default function SupportPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> My account
          </Link>
          <header className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">Help &amp; Support</h1>
              <p className="mt-2 text-sm text-muted">Your requests and our replies, all in one place.</p>
            </div>
            <Link
              href="/account/support/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> New request
            </Link>
          </header>
          <div className="mt-8">
            <RequireSignIn fallback={<TicketListSkeleton />}>
              <SupportTicketList />
            </RequireSignIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
