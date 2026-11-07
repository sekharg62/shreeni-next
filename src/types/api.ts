/** Pagination info sent with every paged list. */
export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** `{ data, meta }` — the backend's paged list body. */
export type Paginated<T> = {
  data: T[];
  meta: PageMeta;
};
