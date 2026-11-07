import type { PageMeta } from "./api";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

/** One approved review as shown publicly. */
export type Review = {
  rating: number;
  title: string;
  body: string;
  /** "Priya S." */
  reviewerName: string;
  /** ISO date */
  createdAt: string;
};

export type ReviewSummary = {
  /** 1 decimal; 0 when there are no reviews */
  average: number;
  count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
};

/** Query for `GET /products/:slug/reviews`. */
export type ReviewListParams = { page?: number; limit?: number };

/** `GET /products/:slug/reviews` response body. */
export type ReviewListResponse = {
  summary: ReviewSummary;
  data: Review[];
  meta: PageMeta;
};

/** `POST /products/:slug/reviews` body (name/email come from the account). */
export type CreateReviewPayload = {
  rating: number;
  title: string;
  body: string;
};

/** The signed-in customer's own review — `GET …/reviews/mine` (null if none) and the POST response. */
export type MyReview = {
  status: ReviewStatus;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};
