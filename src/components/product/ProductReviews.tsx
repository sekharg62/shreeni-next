import { MessageSquareText } from "lucide-react";
import { Stars } from "@/components/ui/StarRating";
import { getProductReviews } from "@/lib/data/catalog";
import ReviewList from "./ReviewList";
import SectionTitle from "./SectionTitle";
import WriteReview from "./WriteReview";

type Props = { slug: string; productName: string };

/** "Customer Reviews": rating summary, approved reviews, and the write-a-review panel. */
export default async function ProductReviews({ slug, productName }: Props) {
  const page = await getProductReviews(slug);
  const summary = page?.summary;
  const count = summary?.count ?? 0;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <SectionTitle id="reviews-heading" eyebrow="From our customers" title="Reviews" />

      {count > 0 && summary && page ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          {/* Summary */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-5xl font-semibold text-dark">{summary.average.toFixed(1)}</span>
              <div>
                <Stars value={summary.average} size="md" label={`Rated ${summary.average} out of 5`} />
                <p className="mt-1 text-sm text-muted">
                  Based on {count} review{count === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <ul aria-label="Rating breakdown" className="space-y-2">
              {(["5", "4", "3", "2", "1"] as const).map((k) => {
                const n = summary.distribution[k];
                const pct = count ? Math.round((n / count) * 100) : 0;
                return (
                  <li key={k} className="flex items-center gap-3 text-sm">
                    <span className="w-10 shrink-0 text-muted">{k} star</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60" aria-hidden="true">
                      <span className="block h-full rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-8 shrink-0 text-right text-muted">{n}</span>
                    <span className="sr-only">
                      {n} review{n === 1 ? "" : "s"} with {k} stars
                    </span>
                  </li>
                );
              })}
            </ul>
            <WriteReview slug={slug} productName={productName} isFirst={false} />
          </div>

          <ReviewList slug={slug} initial={page.data} total={page.meta.total} />
        </div>
      ) : (
        <div className="mt-8 w-full">
          <div className="mb-6 text-center">
            <MessageSquareText className="mx-auto h-8 w-8 text-secondary" aria-hidden="true" />
            <p className="mt-3 font-serif text-xl font-semibold text-dark">No reviews yet</p>
            <p className="mt-1 text-sm text-muted">
              {page ? "Write the first review of this saree and help other shoppers." : "Reviews couldn't be loaded right now."}
            </p>
          </div>
          <WriteReview slug={slug} productName={productName} isFirst={!!page} />
        </div>
      )}
    </section>
  );
}

export function ProductReviewsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-8 w-56 animate-pulse rounded bg-background" />
      <div className="mt-8 h-40 animate-pulse rounded-lg bg-background" />
    </div>
  );
}
