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
import { paiseToRupees } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cartService } from "@/services/cartService";
import type { CartDto, CartIssue, CartItemInput } from "@/types/cart";

/**
 * Guests: the cart lives in this browser and is refreshed with live prices on load.
 * Signed in: the cart lives in the account. On sign-in, the browser cart is merged in and cleared.
 */
const CART_KEY = "shreeni_cart";
/** Quantity changes are sent this long after the last tap, so fast +/− clicks make one request. */
const SYNC_DELAY_MS = 400;
/** Same limit as the backend. */
const MAX_LINES = 50;

export type CartItem = {
  /** Line key: the size (variant) id. */
  id: string;
  productId?: string;
  /** For links back to the product. */
  slug?: string;
  variantId?: string;
  /** Shown in the cart, e.g. "Free Size". */
  size?: string;
  /** Most that can be ordered (stock, capped at 10). */
  maxQuantity?: number;
  name: string;
  /** Rupees, per piece. */
  price: number;
  /** Rupees — struck-through price when on discount. */
  compareAtPrice?: number | null;
  /** null when the product has no photo yet */
  image: string | null;
  quantity: number;
  /** Set by the server check: why this line can't be bought as-is. */
  issue?: CartIssue | null;
};

/** Lines that block checkout (sold out / off sale). */
export const isBlocked = (i: CartItem) => i.issue === "OUT_OF_STOCK" || i.issue === "UNAVAILABLE";

type CartContextValue = {
  items: CartItem[];
  /** false until the cart has been read (avoid flashing "empty"). */
  ready: boolean;
  isOpen: boolean;
  /** Pieces in the cart (all lines). */
  itemCount: number;
  /** Rupees, for lines that can be bought now. */
  subtotal: number;
  /** true when the last check found price or stock changes since items were added. */
  changed: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** Re-check prices and stock (e.g. when checkout opens). */
  refresh: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/* ───────────── Browser storage (guests) ───────────── */

function loadLocal(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? (parsed as CartItem[]).filter(
          // Only sized lines can be checked against the server (older size-less lines are dropped).
          (i) => i && typeof i.variantId === "string" && typeof i.price === "number" && i.quantity > 0
        )
      : [];
  } catch {
    return [];
  }
}

function saveLocal(items: CartItem[]) {
  try {
    if (items.length) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(CART_KEY);
  } catch {
    /* storage full or blocked — the cart still works for this visit */
  }
}

const toInputs = (items: CartItem[]): CartItemInput[] =>
  items.filter((i) => i.variantId).map((i) => ({ variantId: i.variantId!, quantity: Math.min(i.quantity, 10) }));

/** Server cart → UI lines (rupees). */
function fromServer(cart: CartDto): CartItem[] {
  return cart.items.map((l) => ({
    id: l.variantId,
    productId: l.productId,
    slug: l.slug,
    variantId: l.variantId,
    size: l.size,
    maxQuantity: l.available,
    name: l.name,
    price: paiseToRupees(l.price),
    compareAtPrice: l.compareAtPrice === null ? null : paiseToRupees(l.compareAtPrice),
    image: l.image,
    quantity: l.quantity,
    issue: l.issue,
  }));
}

/** Did the server's view differ from what the shopper last saw (price, stock, or removed lines)? */
function differs(before: CartItem[], after: CartItem[]): boolean {
  if (before.length !== after.length) return true;
  const byId = new Map(after.map((i) => [i.id, i]));
  return before.some((b) => {
    const a = byId.get(b.id);
    return !a || a.price !== b.price || a.quantity !== b.quantity || !!a.issue;
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { status: authStatus } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [changed, setChanged] = useState(false);
  const signedIn = authStatus === "signed-in";

  /** Latest items for async callbacks (kept in step by setAll). */
  const itemsRef = useRef<CartItem[]>([]);
  const setAll = useCallback((next: CartItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);
  /** Bumped on every (re)load and auth change, so outdated responses are ignored. */
  const generation = useRef(0);
  /** Per-variant debounce timers and in-flight counts for signed-in changes. */
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const inFlight = useRef(new Map<string, number>());

  const busy = (variantId: string) => timers.current.has(variantId) || (inFlight.current.get(variantId) ?? 0) > 0;

  /** Apply a server cart, keeping the shopper's own not-yet-saved changes on top. */
  const applyServer = useCallback((cart: CartDto) => {
    const server = fromServer(cart);
    const local = new Map(itemsRef.current.map((i) => [i.id, i]));
    const merged = server
      .filter((s) => !busy(s.id) || local.has(s.id))
      .map((s) => (busy(s.id) ? { ...s, quantity: local.get(s.id)!.quantity } : s));
    for (const l of itemsRef.current) {
      if (busy(l.id) && !server.some((s) => s.id === l.id)) merged.push(l); // just added, not saved yet
    }
    setAll(merged);
  }, [setAll]);

  /* ───────────── Loading ───────────── */

  const loadAccount = useCallback(() => {
    const gen = ++generation.current;
    const guest = loadLocal();
    const request = guest.length ? cartService.merge(toInputs(guest)) : cartService.get();
    request.then(
      (cart) => {
        if (gen !== generation.current) return;
        saveLocal([]);
        const before = itemsRef.current;
        applyServer(cart);
        setChanged(before.length > 0 && differs(before, fromServer(cart)));
        setReady(true);
        if (guest.length) {
          const n = guest.length;
          toast.success(`${n} item${n === 1 ? "" : "s"} from before you signed in ${n === 1 ? "was" : "were"} added to your cart`);
        }
      },
      () => {
        if (gen !== generation.current) return;
        // Show what this browser had so nothing looks lost; the next change will retry.
        setAll(guest);
        setReady(true);
      }
    );
  }, [applyServer, setAll, toast]);

  const loadGuest = useCallback(() => {
    const gen = ++generation.current;
    const local = loadLocal();
    setAll(local);
    setReady(true);
    if (!local.length) return;
    // Refresh prices and stock; sizes that no longer exist come back missing and are dropped.
    cartService.preview(toInputs(local)).then(
      (cart) => {
        if (gen !== generation.current) return;
        const fresh = fromServer(cart);
        setChanged(differs(local, fresh));
        setAll(fresh);
        saveLocal(fresh.map((i) => ({ ...i, issue: null })));
      },
      () => {
        /* offline: keep the saved cart as it is */
      }
    );
  }, [setAll]);

  // Follow the auth state: guest → this browser's cart; signed in → the account's cart.
  useEffect(() => {
    if (authStatus === "loading") return;
    for (const t of timers.current.values()) clearTimeout(t);
    timers.current.clear();
    if (authStatus === "signed-in") {
      void Promise.resolve().then(loadAccount);
      return;
    }
    void Promise.resolve().then(loadGuest);
    // Keep guest tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setAll(loadLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authStatus, loadAccount, loadGuest, setAll]);

  const refresh = useCallback(() => {
    if (authStatus === "loading") return;
    if (signedIn) loadAccount();
    else loadGuest();
  }, [authStatus, signedIn, loadAccount, loadGuest]);

  /* ───────────── Changes ───────────── */

  /** Signed in: send the line's final quantity shortly after the last change. */
  const sync = useCallback(
    (variantId: string, quantity: number, immediate = false) => {
      const existing = timers.current.get(variantId);
      if (existing) clearTimeout(existing);
      timers.current.delete(variantId);

      const send = () => {
        timers.current.delete(variantId);
        inFlight.current.set(variantId, (inFlight.current.get(variantId) ?? 0) + 1);
        const gen = generation.current;
        (quantity > 0 ? cartService.setQuantity(variantId, quantity) : cartService.remove(variantId))
          .then(
            (cart) => {
              inFlight.current.set(variantId, inFlight.current.get(variantId)! - 1);
              if (gen === generation.current) applyServer(cart);
            },
            (err: unknown) => {
              inFlight.current.set(variantId, inFlight.current.get(variantId)! - 1);
              toast.error(getApiErrorMessage(err, "Couldn't update your cart. Please try again."));
              // Put the cart back the way the server has it.
              if (gen === generation.current) loadAccount();
            }
          );
      };
      if (immediate) send();
      else timers.current.set(variantId, setTimeout(send, SYNC_DELAY_MS));
    },
    [applyServer, loadAccount, toast]
  );

  /** Update lines locally (and in storage for guests). */
  const commit = useCallback(
    (next: CartItem[]) => {
      setAll(next);
      if (!signedIn) saveLocal(next.map((i) => ({ ...i, issue: i.issue === "QUANTITY_REDUCED" ? null : i.issue })));
    },
    [setAll, signedIn]
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      if (!item.variantId) {
        toast.error("Please choose a size first.");
        return;
      }
      const prev = itemsRef.current;
      const existing = prev.find((i) => i.id === item.id);
      if (!existing && prev.length >= MAX_LINES) {
        toast.warning(`Your cart can hold up to ${MAX_LINES} different items.`);
        return;
      }
      const cap = (q: number) => (item.maxQuantity !== undefined ? Math.min(q, item.maxQuantity) : q);
      const nextQty = cap((existing?.quantity ?? 0) + quantity);
      const next = existing
        ? prev.map((i) => (i.id === item.id ? { ...i, ...item, quantity: nextQty, issue: null } : i))
        : [...prev, { ...item, quantity: nextQty, issue: null }];
      commit(next);
      setIsOpen(true);
      if (signedIn) sync(item.variantId, nextQty, true);
    },
    [commit, signedIn, sync, toast]
  );

  const removeItem = useCallback(
    (id: string) => {
      const line = itemsRef.current.find((i) => i.id === id);
      commit(itemsRef.current.filter((i) => i.id !== id));
      if (signedIn && line?.variantId) sync(line.variantId, 0, true);
    },
    [commit, signedIn, sync]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) return removeItem(id);
      const line = itemsRef.current.find((i) => i.id === id);
      if (!line) return;
      const q = line.maxQuantity !== undefined ? Math.min(quantity, line.maxQuantity) : quantity;
      commit(itemsRef.current.map((i) => (i.id === id ? { ...i, quantity: q, issue: null } : i)));
      if (signedIn && line.variantId) sync(line.variantId, q);
    },
    [commit, removeItem, signedIn, sync]
  );

  /** Empties the cart (e.g. after an order is placed). */
  const clearCart = useCallback(() => {
    for (const t of timers.current.values()) clearTimeout(t);
    timers.current.clear();
    commit([]);
    setChanged(false);
    if (signedIn) {
      cartService.clear().catch((err: unknown) => toast.error(getApiErrorMessage(err, "Couldn't empty your cart.")));
    }
  }, [commit, signedIn, toast]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => (isBlocked(i) ? sum : sum + i.price * i.quantity), 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      isOpen,
      itemCount,
      subtotal,
      changed,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refresh,
    }),
    [items, ready, isOpen, itemCount, subtotal, changed, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
