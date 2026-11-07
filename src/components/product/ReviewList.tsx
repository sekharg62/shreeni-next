"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Stars } from "@/components/ui/StarRating";
import { REVIEWS_PER_PAGE } from "@/config/constants";
import { getApiErrorMessage } from "@/lib/api";
import { reviewService } from "@/services/reviewService";
import type { Review } from "@/types/review";

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="py-6 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Stars value={review.rating} />
        <h4 className="font-semibold text-dark">{review.title}</h4>
      </div>
      <p className="mt-2 whitespace-pre-line leading-relaxed text-dark/85">{review.body}</p>
      <p className="mt-3 text-xs text-muted">
        <span className="font-medium text-dark">{review.reviewerName}</span>
        <span aria-hidden="true"> · </span>
        <time dateTime={review.createdAt}>{dateFmt.format(new Date(review.createdAt))}</time>
      </p>
    </li>
  );
}

type Props = { slug: string; initial: Review[]; total: number };

/** Approved reviews; "Show more" loads the next page in the browser. */
export default function ReviewList({ slug, initial, total }: Props) {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const remaining = total - items.length;

  const loadMore = async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await reviewService.list(slug, { page: page + 1, limit: REVIEWS_PER_PAGE });
      setItems((prev) => [...prev, ...next.data]);
      setPage((p) => p + 1);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ul className="divide-y divide-border">
        {items.map((r, i) => (
          <ReviewItem key={`${r.createdAt}-${i}`} review={r} />
        ))}
      </ul>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
      {remaining > 0 && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {loading ? "Loading…" : `Show more reviews (${remaining})`}
        </button>
      )}
    </div>
  );
}
