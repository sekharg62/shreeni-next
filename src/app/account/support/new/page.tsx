import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import RequireSignIn from "@/components/support/RequireSignIn";
import NewTicketForm from "@/components/support/NewTicketForm";

export const metadata: Metadata = {
  title: "New support request",
  robots: { index: false, follow: false },
};

export default function NewSupportTicketPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/account/support"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All requests
          </Link>
          <header className="mt-4 border-b border-border pb-6">
            <h1 className="font-serif text-3xl font-semibold text-primary sm:text-4xl">How can we help?</h1>
            <p className="mt-2 text-sm text-muted">Tell us what&apos;s going on and our team will reply here, usually within a day.</p>
          </header>
          <div className="mt-8">
            <RequireSignIn fallback={<div className="h-96 animate-pulse rounded-lg bg-background" aria-busy="true" />}>
              <NewTicketForm />
            </RequireSignIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
