import { apiClient, authApiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { CreateReviewPayload, MyReview, ReviewListParams, ReviewListResponse } from "@/types/review";

export const reviewService = {
  /** Approved reviews + rating summary. Public. */
  async list(slug: string, params: ReviewListParams = {}): Promise<ReviewListResponse> {
    const { data } = await apiClient.get<ReviewListResponse>(ENDPOINTS.reviews.list(slug), { params });
    return { ...data, data: Array.isArray(data.data) ? data.data : [] };
  },

  /** The signed-in customer's own review of this product, or null. Needs a token. */
  async mine(slug: string): Promise<MyReview | null> {
    const { data } = await authApiClient.get<MyReview | null>(ENDPOINTS.reviews.mine(slug));
    // A null result arrives as an empty body ("").
    return data && typeof data === "object" ? data : null;
  },

  /** Submit a review (saved as pending until approved). Needs a token. */
  async create(slug: string, payload: CreateReviewPayload): Promise<MyReview> {
    const { data } = await authApiClient.post<MyReview>(ENDPOINTS.reviews.list(slug), payload);
    return data;
  },
};
