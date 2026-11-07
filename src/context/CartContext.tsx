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

/** Where the cart is kept between visits (this browser only). */
const CART_KEY = "shreeni_cart";

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? (parsed as CartItem[]).filter(
          (i) => i && typeof i.id === "string" && typeof i.price === "number" && i.quantity > 0
        )
      : [];
  } catch {
    return [];
  }
}

export type CartItem = {
  /** Line key: the size (variant) id when a size was chosen, else the product id. */
  id: string;
  productId?: string;
  /** For links back to the product (e.g. "Choose a size"). */
  slug?: string;
  variantId?: string;
  /** Shown in the cart, e.g. "Free Size". */
  size?: string;
  /** Most that can be ordered (stock, capped). */
  maxQuantity?: number;
  name: string;
  price: number;
  /** null when the product has no photo yet */
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  /** false until the saved cart has been read (avoid flashing "empty"). */
  ready: boolean;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const loaded = useRef(false);

  // Read the saved cart after the first render (server HTML has an empty cart).
  useEffect(() => {
    void Promise.resolve().then(() => {
      setItems(loadCart());
      setReady(true);
      loaded.current = true;
    });
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Save on every change (after the initial load).
  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked — cart still works for this visit */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const cap = (q: number) =>
          item.maxQuantity !== undefined ? Math.min(q, item.maxQuantity) : q;
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, ...item, quantity: cap(i.quantity + quantity) }
              : i
          );
        }
        return [...prev, { ...item, quantity: cap(quantity) }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity:
                    i.maxQuantity !== undefined
                      ? Math.min(quantity, i.maxQuantity)
                      : quantity,
                }
              : i
          )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      ready,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
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
