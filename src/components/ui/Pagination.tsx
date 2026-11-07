import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  /** Builds the link for a page number, e.g. (p) => `/sarees/jamdani?page=${p}`. */
  hrefFor: (page: number) => string;
};

/** Page numbers to show: first, last, and two either side of the current one, with gaps. */
function pageList(page: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

const base =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors";

/** Link-based pagination: crawlable, works without JavaScript. Renders nothing for a single page. */
export default function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? hrefFor(page - 1) : null;
  const next = page < totalPages ? hrefFor(page + 1) : null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {prev ? (
        <Link href={prev} rel="prev" aria-label="Previous page" className={`${base} border border-border hover:border-primary`}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${base} border border-border opacity-40`}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${base} bg-primary text-surface`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefFor(p)} aria-label={`Page ${p}`} className={`${base} text-dark hover:bg-background`}>
            {p}
          </Link>
        ),
      )}

      {next ? (
        <Link href={next} rel="next" aria-label="Next page" className={`${base} border border-border hover:border-primary`}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${base} border border-border opacity-40`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
