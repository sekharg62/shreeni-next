import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Returns & Exchange",
  description: `Return and exchange policy for ${siteConfig.name} — eligibility, timelines, and how to raise a request.`,
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-primary">
          Returns &amp; Exchange
        </h1>
        <p className="mt-4 text-muted">
          This is placeholder content. Replace it with your own returns policy
          before going live. We want you to love your {siteConfig.name} saree —
          here&apos;s how returns and exchanges work.
        </p>
      </header>

      <div className="space-y-10 text-dark">
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            1. Return Window
          </h2>
          <p className="text-muted">
            We offer a hassle-free 7-day return and exchange from the date of
            delivery on all eligible items.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            2. Eligibility
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted">
            <li>Items must be unused and in original condition.</li>
            <li>Original tags and packaging must be intact.</li>
            <li>
              Certain items (e.g. blouse-stitched or customised sarees) are not
              eligible for return.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            3. How to Raise a Request
          </h2>
          <p className="text-muted">
            Email us at{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-primary underline underline-offset-4 hover:text-secondary"
            >
              {siteConfig.contact.email}
            </a>{" "}
            with your order number and reason for return. Our team will guide you
            through the pickup process.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            4. Refunds
          </h2>
          <p className="text-muted">
            Once your return is received and inspected, refunds are processed to
            your original payment method within 5–7 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
