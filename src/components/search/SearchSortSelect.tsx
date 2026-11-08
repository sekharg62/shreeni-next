"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import SelectMenu from "@/components/ui/SelectMenu";
import type { SearchSort } from "@/types/product";

const SORTS = [
  { value: "relevance", label: "Best match" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
] as const;

/** Sort for the search results page; keeps the query, goes back to page 1. */
export default function SearchSortSelect({ q, sort }: { q: string; sort: SearchSort }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  return (
    <SelectMenu
      label="Sort by"
      options={SORTS}
      value={sort}
      onChange={(next) => {
        const params = new URLSearchParams({ q });
        if (next !== "relevance") params.set("sort", next);
        startTransition(() => router.push(`/search?${params}`, { scroll: false }));
      }}
    />
  );
}
