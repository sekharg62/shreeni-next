"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Lock, Mail, MapPin, Phone, ShoppingBag, Sparkles, User } from "lucide-react";
import AddressBook from "@/components/address/AddressBook";
import AddressFields, { focusFirstAddressError } from "@/components/address/AddressFields";
import Input from "@/components/ui/Input";
import OrderSummary, { needsSize } from "./OrderSummary";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { addressLines, emptyAddress, formatPhone, validateAddress, type AddressErrors } from "@/lib/address";
import type { Address, AddressInput } from "@/types/address";

/** Guest details survive a reload (this tab only). */
const GUEST_KEY = "shreeni_checkout_guest";
/** What the payment step will pick up later. */
const DRAFT_KEY = "shreeni_checkout";

type GuestDraft = { email: string; phone: string; address: AddressInput };
type ContactErrors = { email?: string; phone?: string };
type Delivery = { name: string; phone: string; lines: string[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readGuest(): GuestDraft {
  try {
    const raw = window.sessionStorage.getItem(GUEST_KEY);
    if (raw) return JSON.parse(raw) as GuestDraft;
  } catch {
    /* ignore */
  }
  return { email: "", phone: "", address: { ...emptyAddress(), label: "OTHER" } };
}

function Section({ step, title, done, children }: { step: number; title: string; done?: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`step-${step}`} className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 id={`step-${step}`} className="mb-5 flex items-center gap-3 font-serif text-xl font-semibold text-dark">
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
            done ? "bg-green-600 text-white" : "bg-primary text-surface"
          }`}
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CheckoutView() {
  const { user, status, signOut } = useAuth();
  const { items, ready, subtotal, itemCount } = useCart();
  const toast = useToast();

  const [guest, setGuest] = useState<GuestDraft | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<Address | null>(null);
  const [review, setReview] = useState<Delivery | null>(null);
  const [selectError, setSelectError] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Load the guest draft once (browser only).
  useEffect(() => {
    void Promise.resolve().then(() => setGuest(readGuest()));
  }, []);

  // Save the guest draft as they type.
  useEffect(() => {
    if (!guest) return;
    try {
      window.sessionStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    } catch {
      /* ignore */
    }
  }, [guest]);

  useEffect(() => {
    if (review) reviewRef.current?.focus();
  }, [review]);

  const blocked = items.filter(needsSize);

  /* ───── loading / empty ───── */
  if (!ready || status === "loading" || !guest) {
    return (
      <div aria-busy="true" aria-label="Loading checkout" className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
        <div className="hidden h-80 animate-pulse rounded-lg bg-surface lg:block" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-secondary" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-2xl font-semibold text-dark">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Add a saree you love, then come back to check out.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface hover:bg-dark">
          Continue shopping
        </Link>
      </div>
    );
  }

  const signedIn = status === "signed-in" && !!user;
  const setG = (patch: Partial<GuestDraft>) => {
    const next = { ...guest, ...patch };
    setGuest(next);
    if (submitted) {
      setContactErrors(validateContact(next));
      setAddressErrors(validateAddress(next.address));
    }
  };

  function validateContact(g: GuestDraft): ContactErrors {
    const e: ContactErrors = {};
    if (!EMAIL.test(g.email.trim())) e.email = "Enter a valid email for your order updates";
    if (!/^[6-9]\d{9}$/.test(g.phone)) e.phone = "Enter a valid 10-digit mobile number";
    return e;
  }

  const continueToReview = () => {
    if (blocked.length) {
      toast.error("Choose a size for every item before continuing.");
      return;
    }
    let delivery: Delivery;
    if (signedIn) {
      if (!selected) {
        setSelectError(true);
        return;
      }
      delivery = { name: selected.receiverName, phone: selected.receiverPhone, lines: addressLines(selected) };
      saveDraft({ type: "customer", addressId: selected.id });
    } else {
      setSubmitted(true);
      const ce = validateContact(guest);
      const ae = validateAddress(guest.address);
      setContactErrors(ce);
      setAddressErrors(ae);
      if (ce.email) return guestRef.current?.querySelector<HTMLElement>("#co-email")?.focus();
      if (ce.phone) return guestRef.current?.querySelector<HTMLElement>("#co-phone")?.focus();
      if (Object.keys(ae).length) return focusFirstAddressError(document.getElementById("guest-address"), ae, "guest");
      delivery = { name: guest.address.receiverName, phone: guest.address.receiverPhone, lines: addressLines(guest.address as Address) };
      saveDraft({ type: "guest", email: guest.email.trim(), phone: guest.phone, address: guest.address });
    }
    setReview(delivery);
  };

  function saveDraft(data: object) {
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
    } catch {
      /* ignore */
    }
  }

  /* ───── review ───── */
  if (review) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <div className="space-y-5">
          <OrderSummary variant="bar" items={items} subtotal={subtotal} count={itemCount} />
          <div ref={reviewRef} tabIndex={-1} className="rounded-lg border border-border bg-surface p-5 outline-none sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-dark">Review your details</h2>
            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="mb-1 font-semibold text-dark">Contact</dt>
                <dd className="text-dark/80">
                  {signedIn ? user.email : guest.email}
                  <br />
                  {formatPhone(signedIn ? user.phone : `+91${guest.phone}`)}
                </dd>
              </div>
              <div>
                <dt className="mb-1 flex items-center justify-between font-semibold text-dark">Deliver to</dt>
                <dd className="text-dark/80">
                  <span className="font-medium text-dark">{review.name}</span>
                  {review.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                  <span className="block text-muted">Mobile: {formatPhone(review.phone.startsWith("+") ? review.phone : `+91${review.phone}`)}</span>
                </dd>
              </div>
            </dl>
            <button type="button" onClick={() => setReview(null)} className="mt-5 text-sm font-semibold text-primary hover:text-secondary">
              Change details
            </button>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 sm:p-6" role="status">
            <p className="flex items-center gap-2 font-semibold text-amber-800">
              <Clock className="h-5 w-5" aria-hidden="true" /> Payment &amp; order placement are coming soon
            </p>
            <p className="mt-1 text-sm text-amber-900/80">
              Your cart and delivery details are saved in this browser, so you can pick up right here when payments go live.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-primary/50 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-surface sm:w-auto"
            >
              <Lock className="h-4 w-4" aria-hidden="true" /> Continue to payment
            </button>
          </div>
          {!signedIn && (
            <p className="text-center text-sm text-muted">
              <Link href="/account?mode=signup&next=/checkout" className="font-semibold text-primary hover:text-secondary">
                Create an account
              </Link>{" "}
              to save this address — next time checkout is just one tap.
            </p>
          )}
        </div>
        <OrderSummary variant="sidebar" items={items} subtotal={subtotal} count={itemCount} />
      </div>
    );
  }

  /* ───── form ───── */
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <div className="space-y-5">
        <OrderSummary variant="bar" items={items} subtotal={subtotal} count={itemCount} />

        {blocked.length > 0 && (
          <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {blocked.length === 1 ? "1 item needs" : `${blocked.length} items need`} a size before you can continue — see the order summary.
          </p>
        )}

        {/* 1 · Contact */}
        <Section step={1} title="Contact" done={signedIn}>
          {signedIn ? (
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-dark">
                <User className="h-4 w-4 text-muted" aria-hidden="true" />
                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
              </p>
              {user.email && (
                <p className="flex items-center gap-2 text-dark">
                  <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
                  {user.email}
                </p>
              )}
              <p className="flex items-center gap-2 text-dark">
                <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                {formatPhone(user.phone)}
              </p>
              <p className="pt-1 text-muted">
                Not you?{" "}
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    toast.info("Signed out — you can continue as a guest");
                  }}
                  className="font-semibold text-primary hover:text-secondary"
                >
                  Sign out
                </button>
              </p>
            </div>
          ) : (
            <div ref={guestRef} className="space-y-5">
              <div className="flex flex-col gap-3 rounded-lg bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm text-dark">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Have an account?</span> Sign in for faster checkout — your saved addresses are ready, no
                    need to type them again.
                  </span>
                </p>
                <div className="flex shrink-0 gap-2">
                  <Link href="/account?next=/checkout" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface hover:bg-dark">
                    Sign in
                  </Link>
                  <Link
                    href="/account?mode=signup&next=/checkout"
                    className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-surface"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <p className="text-sm text-muted">Or continue as a guest:</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="co-email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={guest.email}
                  onChange={(e) => setG({ email: e.target.value })}
                  error={contactErrors.email}
                  hint="Order updates are sent here."
                />
                <Input
                  id="co-phone"
                  label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  prefix="+91"
                  placeholder="10-digit number"
                  value={guest.phone}
                  onChange={(e) => {
                    const phone = e.target.value.replace(/\D/g, "").slice(-10);
                    // Pre-fill the receiver's number while it's still empty or matching.
                    const a = guest.address;
                    setG({ phone, address: !a.receiverPhone || a.receiverPhone === guest.phone ? { ...a, receiverPhone: phone } : a });
                  }}
                  error={contactErrors.phone}
                />
              </div>
            </div>
          )}
        </Section>

        {/* 2 · Delivery address */}
        <Section step={2} title="Delivery address">
          {signedIn ? (
            <div>
              <p className="mb-4 text-sm text-muted">Choose where to deliver, or add a new address.</p>
              <AddressBook
                mode="select"
                selectedId={selected?.id ?? null}
                onSelect={(a) => {
                  setSelected(a);
                  if (a) setSelectError(false);
                }}
                prefill={{
                  receiverName: [user.firstName, user.lastName].filter(Boolean).join(" "),
                  receiverPhone: user.phone.replace(/\D/g, "").slice(-10),
                }}
              />
              {selectError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  Choose or add a delivery address.
                </p>
              )}
            </div>
          ) : (
            <GuestAddress value={guest.address} errors={addressErrors} onChange={(address) => setG({ address })} />
          )}
        </Section>

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="text-sm font-semibold text-primary hover:text-secondary">
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={continueToReview}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark sm:w-auto"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" /> Deliver here &amp; continue
          </button>
        </div>
      </div>

      <OrderSummary variant="sidebar" items={items} subtotal={subtotal} count={itemCount} />
    </div>
  );
}

/** Guest address fields (ids "guest-*", so the parent can focus the first error). */
function GuestAddress({ value, errors, onChange }: { value: AddressInput; errors: AddressErrors; onChange: (a: AddressInput) => void }) {
  return (
    <div id="guest-address">
      <AddressFields value={value} onChange={onChange} errors={errors} idPrefix="guest" hideLabel />
    </div>
  );
}
