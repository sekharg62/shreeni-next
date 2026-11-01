import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions governing your use of ${siteConfig.name}.`,
};

const lastUpdated = "1 November 2026";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-primary">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
        <p className="mt-4 text-muted">
          This is placeholder content. Replace it with your own legal copy
          before going live. By accessing or purchasing from {siteConfig.name},
          you agree to the following terms.
        </p>
      </header>

      <div className="space-y-10 text-dark">
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted">
            By using this website and placing an order, you confirm that you are
            at least 18 years of age and agree to be bound by these Terms of
            Service and all applicable laws.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            2. Products &amp; Pricing
          </h2>
          <p className="text-muted">
            We strive to display our products and prices accurately. Colours may
            vary slightly due to screen settings. We reserve the right to correct
            errors and to change prices, products, and availability without
            notice.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            3. Orders &amp; Payment
          </h2>
          <p className="text-muted">
            All orders are subject to acceptance and availability. Payment must
            be received in full before an order is dispatched. We accept the
            payment methods displayed at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            4. Shipping &amp; Delivery
          </h2>
          <p className="text-muted">
            Delivery timelines are estimates and may vary. {siteConfig.name} is
            not liable for delays caused by courier partners or circumstances
            beyond our control.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            5. Returns &amp; Refunds
          </h2>
          <p className="text-muted">
            Eligible items may be returned within the period stated in our
            Returns policy, provided they are unused and in original condition.
            Refunds are processed to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            6. Intellectual Property
          </h2>
          <p className="text-muted">
            All content on this site, including logos, images, and text, is the
            property of {siteConfig.legalName} and may not be used without our
            written permission.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            7. Contact Us
          </h2>
          <p className="text-muted">
            For questions about these terms, contact us at{" "}
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
