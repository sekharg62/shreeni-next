import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Delivery",
  description: `Shipping timelines, charges, and delivery information for ${siteConfig.name} orders.`,
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-primary">
          Shipping &amp; Delivery
        </h1>
        <p className="mt-4 text-muted">
          This is placeholder content. Replace it with your own shipping policy
          before going live. Here&apos;s everything you need to know about how
          your {siteConfig.name} order reaches you.
        </p>
      </header>

      <div className="space-y-10 text-dark">
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            1. Processing Time
          </h2>
          <p className="text-muted">
            Orders are processed and dispatched within 1–2 business days.
            You&apos;ll receive a confirmation email with tracking details once
            your order ships.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            2. Delivery Timelines
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted">
            <li>Metro cities: 3–5 business days.</li>
            <li>Rest of India: 5–7 business days.</li>
            <li>Remote locations may take a little longer.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            3. Shipping Charges
          </h2>
          <p className="text-muted">
            We offer free shipping on all orders above ₹1999. A nominal flat fee
            applies to orders below this amount, shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            4. International Shipping
          </h2>
          <p className="text-muted">
            We currently ship across India. International shipping is coming
            soon — reach out to us for bulk or overseas enquiries.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            5. Need Help?
          </h2>
          <p className="text-muted">
            For any shipping questions, email us at{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-primary underline underline-offset-4 hover:text-secondary"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
