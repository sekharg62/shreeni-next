import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

const suggestions = [
  { label: "Silk Sarees", href: "/sarees/silk" },
  { label: "New Arrivals", href: "/collections/new" },
  { label: "Wedding Edit", href: "/collections/wedding" },
  { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        {/* Big 404 */}
        <p className="font-serif text-8xl font-semibold leading-none text-primary sm:text-9xl">
          404
        </p>

        <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />

        <h1 className="mt-6 font-serif text-3xl font-semibold text-dark sm:text-4xl">
          This page has lost its thread
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to something beautiful.
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-primary px-7 py-3 text-base font-medium text-surface transition-opacity hover:opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/sarees"
            className="rounded-full border border-primary px-7 py-3 text-base font-medium text-primary transition-colors hover:bg-primary hover:text-surface"
          >
            Shop Sarees
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Popular destinations
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-dark transition-colors hover:border-primary hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-sm text-muted">
          Need help? Email us at{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-primary underline underline-offset-4 hover:text-secondary"
          >
            {siteConfig.contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}
