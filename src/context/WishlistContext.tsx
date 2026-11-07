"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { wishlistService } from "@/services/wishlistService";
import type { ProductCardItem } from "@/types/product";

/**
 * Guests: kept in this browser. Signed in: kept in the database.
 * On sign-in, whatever the guest saved is merged into the account and the local copy is cleared.
 */
const WISHLIST_KEY = "shreeni_wishlist";
/** Same limit as the backend. */
const MAX_ITEMS = 100;

export type WishlistStatus = "loading" | "ready" | "error";

type WishlistContextValue = {
  /** Saved products, most recently saved first. */
  items: ProductCardItem[];
  count: number;
  /** "loading" until the guest list is read or the account's list has arrived. */
  status: WishlistStatus;
  /** true when the list lives in the account (synced across devices). */
  synced: boolean;
  isWishlisted: (id: string) => boolean;
  /** Save or remove. Updates instantly; rolls back with a message if the server says no. */
  toggle: (product: ProductCardItem) => void;
  /** Load the account's list again (e.g. after an error, or to refresh prices). */
  reload: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadLocal(): ProductCardItem[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? (parsed as ProductCardItem[]).filter(
          (p) => p && typeof p.id === "string" && typeof p.name === "string" && typeof p.price === "number"
        )
      : [];
  } catch {
    return [];
  }
}

function saveLocal(items: ProductCardItem[]) {
  try {
    if (items.length) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(WISHLIST_KEY);
  } catch {
    /* storage blocked — the wishlist still works for this visit */
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status: authStatus } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [status, setStatus] = useState<WishlistStatus>("loading");
  /** Bumped on every load so a slow, outdated response is ignored. */
  const generation = useRef(0);
  /** Generation of the account load in flight, so overlapping callers share one request. */
  const loadingGen = useRef(-1);
  /** Product ids with a save/remove request in flight (ignore double taps). */
  const pending = useRef(new Set<string>());
  const nudgedGuest = useRef(false);
  const signedIn = authStatus === "signed-in";

  const loadAccount = useCallback(() => {
    if (loadingGen.current === generation.current) return;
    const gen = ++generation.current;
    loadingGen.current = gen;
    setStatus("loading");
    const guestItems = loadLocal();
    const request = guestItems.length
      ? wishlistService.merge(guestItems.map((p) => p.id))
      : wishlistService.list();
    request.then(
      (list) => {
        if (gen !== generation.current) return;
        loadingGen.current = -1;
        saveLocal([]);
        setItems(list);
        setStatus("ready");
        if (guestItems.length) {
          const n = guestItems.length;
          toast.success(`${n} saved item${n === 1 ? "" : "s"} added to your account wishlist`);
        }
      },
      () => {
        if (gen !== generation.current) return;
        loadingGen.current = -1;
        // Keep showing what this browser has so nothing looks lost.
        setItems(guestItems);
        setStatus("error");
      }
    );
  }, [toast]);

  // Follow the auth state: guest → this browser's list; signed in → the account's list.
  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "signed-in") {
      void Promise.resolve().then(loadAccount);
      return;
    }
    const gen = ++generation.current;
    void Promise.resolve().then(() => {
      if (gen !== generation.current) return;
      setItems(loadLocal());
      setStatus("ready");
    });
    // Keep guest tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY) setItems(loadLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authStatus, loadAccount]);

  const ids = useMemo(() => new Set(items.map((p) => p.id)), [items]);
  const isWishlisted = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    (product: ProductCardItem) => {
      if (pending.current.has(product.id)) return;
      const saved = ids.has(product.id);
      if (!saved && items.length >= MAX_ITEMS) {
        toast.warning(`Your wishlist can hold up to ${MAX_ITEMS} items. Remove one to save another.`);
        return;
      }

      const before = items;
      const next = saved ? items.filter((p) => p.id !== product.id) : [product, ...items];
      setItems(next);

      if (!signedIn) {
        saveLocal(next);
        if (saved) toast.info(`${product.name} removed from wishlist`);
        else if (!nudgedGuest.current) {
          nudgedGuest.current = true;
          toast.success(`${product.name} saved. Sign in to keep your wishlist on every device.`);
        } else toast.success(`${product.name} saved to wishlist`);
        return;
      }

      if (saved) toast.info(`${product.name} removed from wishlist`);
      else toast.success(`${product.name} saved to wishlist`);

      pending.current.add(product.id);
      const gen = generation.current;
      (saved ? wishlistService.remove(product.id) : wishlistService.add(product.id))
        .catch((err: unknown) => {
          // Put it back the way it was (unless the list was reloaded meanwhile).
          if (gen === generation.current) {
            setItems((current) => {
              const has = current.some((p) => p.id === product.id);
              if (saved && !has) {
                const at = before.findIndex((p) => p.id === product.id);
                const copy = [...current];
                copy.splice(Math.min(Math.max(at, 0), copy.length), 0, product);
                return copy;
              }
              return !saved && has ? current.filter((p) => p.id !== product.id) : current;
            });
          }
          toast.error(
            getApiErrorMessage(err, saved ? "Couldn't remove it from your wishlist. Please try again." : "Couldn't save it to your wishlist. Please try again.")
          );
        })
        .finally(() => pending.current.delete(product.id));
    },
    [ids, items, signedIn, toast]
  );

  const reload = useCallback(() => {
    if (signedIn) loadAccount();
  }, [signedIn, loadAccount]);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, status, synced: signedIn, isWishlisted, toggle, reload }),
    [items, status, signedIn, isWishlisted, toggle, reload]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
