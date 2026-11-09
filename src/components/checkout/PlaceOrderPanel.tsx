"use client";

import { useState, type FormEvent } from "react";
import {
  BadgePercent,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/format";
import { siteConfig } from "@/config/siteConfig";
import { useTesterMode } from "@/lib/testerMode";
import type { CheckoutQuote, PaymentOption } from "@/types/order";

type Props = {
  quote: CheckoutQuote | null;
  quoteLoading: boolean;
  coupon: string | null;
  couponError: string | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  payment: PaymentOption;
  onPaymentChange: (p: PaymentOption) => void;
  placing: boolean;
  disabled: boolean;
  onPlace: () => void;
};

/** Review step: coupon, payment method and the "Place order" button. */
export default function PlaceOrderPanel(p: Props) {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const tester = useTesterMode();
  // Pre-launch: real visitors can browse and reach checkout, but can't place orders.
  const locked = siteConfig.launch.preview && !tester;

  const apply = async (e: FormEvent) => {
    e.preventDefault();
    const value = code.trim();
    if (!value || checking) return;
    setChecking(true);
    const ok = await p.onApplyCoupon(value);
    setChecking(false);
    if (ok) setCode("");
  };

  const total = p.quote?.grandTotal;
  const options = p.quote?.paymentOptions ?? [];

  return (
    <div className="space-y-5">
      {/* Coupon */}
      <section
        aria-labelledby="coupon-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-6"
      >
        <h2
          id="coupon-heading"
          className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-dark"
        >
          <BadgePercent className="h-5 w-5 text-primary" aria-hidden="true" />{" "}
          Offers &amp; coupons
        </h2>
        {p.coupon && p.quote?.coupon ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-green-800">
                <span className="font-mono">{p.quote.coupon.code}</span> applied
                — you save {formatINR(p.quote.coupon.discount)}
              </p>
              {p.quote.coupon.description && (
                <p className="text-green-900/80">
                  {p.quote.coupon.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={p.onRemoveCoupon}
              aria-label={`Remove coupon ${p.quote.coupon.code}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-green-900 hover:bg-green-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove
            </button>
          </div>
        ) : (
          <form onSubmit={apply} className="flex gap-2" noValidate>
            <label htmlFor="coupon-code" className="sr-only">
              Coupon code
            </label>
            <input
              id="coupon-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={30}
              aria-invalid={!!p.couponError}
              aria-describedby={p.couponError ? "coupon-error" : undefined}
              className="min-w-0 flex-1 rounded-md border border-border bg-surface px-4 py-2.5 font-mono text-sm uppercase tracking-wider text-dark outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:border-primary"
            />
            <button
              type="submit"
              disabled={!code.trim() || checking}
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
            >
              {checking && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}{" "}
              Apply
            </button>
          </form>
        )}
        {p.couponError && (
          <p
            id="coupon-error"
            role="alert"
            className="mt-2 text-sm text-red-600"
          >
            {p.couponError}
          </p>
        )}
      </section>

      {/* Payment */}
      <section
        aria-labelledby="payment-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-6"
      >
        <h2
          id="payment-heading"
          className="mb-4 font-serif text-xl font-semibold text-dark"
        >
          Payment
        </h2>
        <fieldset>
          <legend className="sr-only">Payment method</legend>
          <div className="space-y-2">
            {options.length === 0 && (
              <div className="h-14 animate-pulse rounded-md bg-background" />
            )}
            {options.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3.5 text-sm transition-colors ${
                  p.payment === o.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={o.value}
                  checked={p.payment === o.value}
                  onChange={() => p.onPaymentChange(o.value)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium text-dark">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-xs text-muted">
          UPI, cards and cash on delivery are coming soon.
        </p>

        {locked ? (
          <>
            <button
              type="button"
              disabled
              className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-primary/50 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-surface"
            >
              <Clock className="h-4 w-4" aria-hidden="true" /> Orders open soon
            </button>
            <p className="mt-3 text-center text-sm text-muted">
              We&apos;re launching soon! Shreeni is in preview, so orders
              can&apos;t be placed yet. Your bag will be waiting for you.
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={p.onPlace}
              disabled={
                p.disabled ||
                p.placing ||
                p.quoteLoading ||
                !p.quote?.canPlaceOrder
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              {p.placing ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />{" "}
                  Placing your order…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" /> Place order
                  {total !== undefined && ` · ${formatINR(total)}`}
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck
                className="h-4 w-4 text-green-700"
                aria-hidden="true"
              />{" "}
              By placing this order you agree to our terms and returns policy.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
