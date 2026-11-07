import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { env } from "@/config/env";

export type Crumb = {
  label: string;
  /** Omit for the current page or a step that has no page. */
  href?: string;
};

/**
 * Accessible breadcrumb trail + schema.org BreadcrumbList for search engines.
 * The last crumb is the current page.
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href && { item: new URL(c.href, env.siteUrl).toString() }),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium text-dark">
                  {c.label}
                </span>
              ) : c.href ? (
                <Link href={c.href} className="transition-colors hover:text-primary">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
