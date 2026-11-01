"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WishlistContextValue = {
  ids: string[];
  count: number;
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, isWishlisted, toggle }),
    [ids, isWishlisted, toggle]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
