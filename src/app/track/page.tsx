import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Track Order",
  description: `Track your ${siteConfig.name} order and check delivery status.`,
  path: "/track",
});

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-primary">Track Order</h1>
        <p className="mt-4 text-muted">
          This is placeholder content. Enter your order details below to check
          its status. Hook this form up to your order system before going live.
        </p>
      </header>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="orderId"
            className="mb-2 block text-sm font-medium text-dark"
          >
            Order ID
          </label>
          <input
            id="orderId"
            name="orderId"
            type="text"
            placeholder="e.g. SHR-10234"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-dark outline-none transition-colors focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-dark"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-dark outline-none transition-colors focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
        >
          Track Order
        </button>
      </form>

      <p className="mt-10 text-sm text-muted">
        Having trouble? Email us at{" "}
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-primary underline underline-offset-4 hover:text-secondary"
        >
          {siteConfig.contact.email}
        </a>
        .
      </p>
    </div>
  );
}
