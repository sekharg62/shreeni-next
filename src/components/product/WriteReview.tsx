"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, PenLine, XCircle } from "lucide-react";
import { StarInput, Stars } from "@/components/ui/StarRating";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api";
import { reviewService } from "@/services/reviewService";
import type { MyReview } from "@/types/review";

const TITLE_MAX = 120;
const BODY_MIN = 10;
const BODY_MAX = 2000;

type Errors = Partial<Record<"rating" | "title" | "body", string>>;

function validate(rating: number, title: string, body: string): Errors {
  const e: Errors = {};
  if (!rating) e.rating = "Choose a star rating";
  if (!title.trim()) e.title = "Add a title";
  if (body.trim().length < BODY_MIN) e.body = `Write at least ${BODY_MIN} characters`;
  return e;
}

const box = "rounded-lg border border-border bg-surface p-6";

/** What a shopper sees about their own review once they have written one. */
function MyReviewStatus({ review }: { review: MyReview }) {
  const state = {
    PENDING: { icon: Clock, tone: "text-amber-700", title: "Thanks! Your review is awaiting approval", text: "We check every review before it appears. This usually takes a day or two." },
    APPROVED: { icon: CheckCircle2, tone: "text-green-700", title: "You reviewed this saree", text: "Your review is published below. Thank you for sharing!" },
    REJECTED: { icon: XCircle, tone: "text-red-600", title: "Your review wasn't published", text: "It didn't meet our review guidelines. Contact us if you think this is a mistake." },
  }[review.status];
  const Icon = state.icon;
  return (
    <div className={box} role="status">
      <p className={`flex items-center gap-2 font-semibold ${state.tone}`}>
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {state.title}
      </p>
      <p className="mt-1 text-sm text-muted">{state.text}</p>
      <div className="mt-4 rounded-md bg-background p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Stars value={review.rating} />
          <span className="font-semibold text-dark">{review.title}</span>
        </div>
        <p className="mt-2 whitespace-pre-line text-sm text-dark/85">{review.body}</p>
      </div>
    </div>
  );
}

type Props = {
  slug: string;
  productName: string;
  /** No approved reviews yet → invite the first one. */
  isFirst: boolean;
};

/** Sign-in prompt, the review form, or the shopper's own review status. */
export default function WriteReview({ slug, productName, isFirst }: Props) {
  const { status, displayName } = useAuth();
  const toast = useToast();
  const [mine, setMine] = useState<MyReview | null | undefined>(undefined); // undefined = not loaded
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Signed in → has this shopper already reviewed it?
  useEffect(() => {
    if (status !== "signed-in") return;
    let alive = true;
    reviewService.mine(slug).then(
      (r) => alive && setMine(r),
      () => alive && setMine(null),
    );
    return () => {
      alive = false;
    };
  }, [status, slug]);

  const next = encodeURIComponent(`/products/${slug}#reviews`);
  const invite = isFirst ? `Be the first to review ${productName}` : "Share your thoughts with other shoppers";

  if (status === "loading" || (status === "signed-in" && mine === undefined)) {
    return <div aria-hidden="true" className={`${box} h-28 animate-pulse`} />;
  }

  if (status === "guest") {
    return (
      <div className={`${box} text-center`}>
        <PenLine className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
        <p className="mt-3 font-serif text-lg font-semibold text-dark">{isFirst ? "Write the first review" : "Write a review"}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">Please sign in or create an account to write a review.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/account?next=${next}`}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-dark"
          >
            Sign in
          </Link>
          <Link
            href={`/account?mode=signup&next=${next}`}
            className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  if (mine) return <MyReviewStatus review={mine} />;

  if (!open) {
    return (
      <div className={`${box} flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left`}>
        <div>
          <p className="font-serif text-lg font-semibold text-dark">{isFirst ? "Write the first review" : "Write a review"}</p>
          <p className="text-sm text-muted">{invite}.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-dark"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" /> Write a review
        </button>
      </div>
    );
  }

  const update = (r: number, t: string, b: string) => {
    setFormError(null);
    if (submitted) setErrors(validate(r, t, b));
  };

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setSubmitted(true);
    const errs = validate(rating, title, body);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(first === "rating" ? "#review-rating [tabindex='0']" : `#review-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const created = await reviewService.create(slug, { rating, title: title.trim(), body: body.trim() });
      setMine(created);
      toast.success("Thanks! Your review was submitted for approval.");
    } catch (err) {
      const code = getApiErrorStatus(err);
      if (code === 409) {
        setMine(await reviewService.mine(slug).catch(() => null));
        toast.info("You've already reviewed this saree.");
      } else if (code === 401) {
        setFormError("Your session has expired. Please sign in again to post your review.");
      } else if (code === 429) {
        setFormError("You've submitted several reviews recently. Please try again later.");
      } else {
        setFormError(getApiErrorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-md border bg-surface px-4 py-3 text-dark outline-none transition-colors placeholder:text-muted/60";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={`${box} space-y-5`} aria-labelledby="write-review-heading">
      <div>
        <h3 id="write-review-heading" className="font-serif text-lg font-semibold text-dark">
          Write a review
        </h3>
        <p className="text-sm text-muted">
          Posting as <span className="font-medium text-dark">{displayName}</span>. Reviews appear after approval.
        </p>
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-dark">Your rating</p>
        <StarInput
          id="review-rating"
          value={rating}
          onChange={(n) => {
            setRating(n);
            update(n, title, body);
          }}
          invalid={!!errors.rating}
          describedBy={errors.rating ? "review-rating-error" : undefined}
        />
        {errors.rating && (
          <p id="review-rating-error" className="mt-1.5 text-sm text-red-600">
            {errors.rating}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-title" className="mb-2 block text-sm font-medium text-dark">
          Title
        </label>
        <input
          id="review-title"
          value={title}
          maxLength={TITLE_MAX}
          placeholder="Sum it up in a few words"
          onChange={(e) => {
            setTitle(e.target.value);
            update(rating, e.target.value, body);
          }}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "review-title-error" : undefined}
          className={`${field} ${errors.title ? "border-red-500" : "border-border focus:border-primary"}`}
        />
        {errors.title && (
          <p id="review-title-error" className="mt-1.5 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="review-body" className="mb-2 block text-sm font-medium text-dark">
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          rows={5}
          maxLength={BODY_MAX}
          placeholder="How was the fabric, colour, drape and finish?"
          onChange={(e) => {
            setBody(e.target.value);
            update(rating, title, e.target.value);
          }}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby="review-body-count"
          className={`${field} resize-y ${errors.body ? "border-red-500" : "border-border focus:border-primary"}`}
        />
        <div className="mt-1.5 flex justify-between gap-4 text-sm">
          <span className="text-red-600">{errors.body}</span>
          <span id="review-body-count" className="shrink-0 text-xs text-muted">
            {body.length}/{BODY_MAX}
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={busy}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-background"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-dark disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {busy ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
