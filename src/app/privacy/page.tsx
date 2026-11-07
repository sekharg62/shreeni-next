import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your personal information.`,
  path: "/privacy",
});

const lastUpdated = "1 November 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-primary">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
        <p className="mt-4 text-muted">
          This is placeholder content. Replace it with your own legal copy
          before going live. At {siteConfig.legalName}, we value your privacy
          and are committed to protecting your personal data.
        </p>
      </header>

      <div className="space-y-10 text-dark">
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            1. Information We Collect
          </h2>
          <p className="text-muted">
            We collect information you provide directly to us, such as your name,
            email address, shipping address, phone number, and payment details
            when you place an order or create an account. We also automatically
            collect certain information about your device and browsing activity.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted">
            <li>To process and fulfil your orders.</li>
            <li>To send order confirmations, updates, and support messages.</li>
            <li>To improve our products, website, and customer experience.</li>
            <li>To send marketing communications where you have opted in.</li>
            <li>To detect and prevent fraud and comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            3. Cookies &amp; Tracking
          </h2>
          <p className="text-muted">
            We use cookies and similar technologies to keep your cart, remember
            preferences, and analyse site traffic. You can control cookies
            through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            4. Sharing Your Information
          </h2>
          <p className="text-muted">
            We do not sell your personal information. We share it only with
            trusted service providers (such as payment gateways and shipping
            partners) who help us operate our business, and only as necessary.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            5. Your Rights
          </h2>
          <p className="text-muted">
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us. You may also unsubscribe
            from marketing emails using the link in any such message.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-primary">
            6. Contact Us
          </h2>
          <p className="text-muted">
            If you have questions about this Privacy Policy, contact us at{" "}
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
