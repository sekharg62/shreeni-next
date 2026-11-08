"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isBlocked, type CartItem } from "@/context/CartContext";
import { getApiErrorMessage } from "@/lib/api";
import { orderService } from "@/services/orderService";
import type { CartItemInput } from "@/types/cart";
import type { CheckoutQuote } from "@/types/order";

/**
 * Server-calculated totals for checkout (prices, coupon, shipping), refreshed whenever the cart or the
 * applied coupon changes. A coupon that stops qualifying (e.g. the cart drops below its minimum) is removed
 * with the reason shown.
 */
export function useCheckoutQuote(items: CartItem[], enabled: boolean) {
  const lines = useMemo<CartItemInput[]>(
    () => items.filter((i) => i.variantId && !isBlocked(i)).map((i) => ({ variantId: i.variantId!, quantity: i.quantity })),
    [items],
  );
  const key = JSON.stringify(lines);

  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  /** What the current quote was fetched for, so applying a coupon doesn't fetch twice. */
  const fetchedFor = useRef("");

  useEffect(() => {
    const target = `${key}|${coupon ?? ""}`;
    if (!enabled || lines.length === 0 || fetchedFor.current === target) return;
    let live = true;
    void Promise.resolve().then(() => live && setLoading(true));
    orderService.quote(lines, coupon ?? undefined).then(
      (q) => {
        if (!live) return;
        fetchedFor.current = target;
        if (coupon && !q.coupon) {
          setCoupon(null);
          setCouponError(q.couponError ? `Coupon ${coupon} was removed: ${q.couponError}` : null);
        }
        setQuote(q);
        setLoading(false);
      },
      () => live && setLoading(false),
    );
    return () => {
      live = false;
    };
    // `key` stands for `lines`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, coupon]);

  /** Check a code; on success it's applied. Returns whether it worked. */
  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      setCouponError(null);
      try {
        const q = await orderService.quote(lines, code);
        if (!q.coupon) {
          setCouponError(q.couponError ?? "This coupon code isn't valid");
          return false;
        }
        fetchedFor.current = `${key}|${q.coupon.code}`;
        setQuote(q);
        setCoupon(q.coupon.code);
        return true;
      } catch (err) {
        setCouponError(getApiErrorMessage(err, "Couldn't check this coupon. Please try again."));
        return false;
      }
    },
    [lines, key],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  return { quote, loading, coupon, couponError, applyCoupon, removeCoupon };
}
