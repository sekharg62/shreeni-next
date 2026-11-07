import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import AccountView from "@/components/auth/AccountView";

export const metadata: Metadata = {
  title: "My Account",
  description: "Sign in or create your Shreeni account to review sarees, shop faster and track orders.",
  // Personal page: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* AccountView reads ?next= / ?mode=, so it renders in the browser. */}
        <Suspense fallback={<div className="mx-auto h-96 w-full max-w-md animate-pulse rounded-lg bg-background" />}>
          <AccountView />
        </Suspense>
      </Container>
    </section>
  );
}
