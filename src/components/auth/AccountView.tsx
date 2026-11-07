"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, LogOut, Mail, Package, Phone, User } from "lucide-react";
import AuthForm, { type AuthMode } from "./AuthForm";
import AddressBook from "@/components/address/AddressBook";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

/** Only same-site paths: "/products/x" yes; "//evil.com", "https://…" no. */
export function safeNext(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

/** "+919876543210" → "+91 98765 43210" */
function formatPhone(phone: string): string {
  const m = /^\+91(\d{5})(\d{5})$/.exec(phone);
  return m ? `+91 ${m[1]} ${m[2]}` : phone;
}

/** /account: sign-in / sign-up for guests, the account overview when signed in. */
export default function AccountView() {
  const { user, status, displayName, signOut } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const initialMode: AuthMode = params.get("mode") === "signup" ? "signup" : "signin";

  // Already signed in and sent here to sign in → go straight back.
  useEffect(() => {
    if (status === "signed-in" && next) router.replace(next);
  }, [status, next, router]);

  if (status === "loading" || (status === "signed-in" && next)) {
    return (
      <div aria-busy="true" aria-label="Loading your account" className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto h-10 w-56 animate-pulse rounded-full bg-background" />
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-background" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "guest" || !user) {
    return (
      <>
        {next && (
          <p className="mx-auto mb-4 max-w-md rounded-md bg-background px-4 py-3 text-center text-sm text-dark">
            Please sign in to continue.
          </p>
        )}
        <AuthForm
          initialMode={initialMode}
          onSuccess={(customer, mode) => {
            const name = customer.firstName || "there";
            toast.success(mode === "signup" ? `Welcome to Shreeni, ${name}!` : `Welcome back, ${name}!`);
            if (next) router.replace(next);
          }}
        />
      </>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-2xl font-semibold text-surface"
        >
          {(displayName ?? "?").charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark sm:text-3xl">Hello, {displayName}</h1>
          <p className="text-sm text-muted">Manage your Shreeni account.</p>
        </div>
      </div>

      <section aria-labelledby="profile-heading" className="mt-8 rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h2 id="profile-heading" className="text-sm font-semibold uppercase tracking-wider text-dark">
          Profile
        </h2>
        <dl className="mt-4 divide-y divide-border text-sm">
          {[
            { icon: User, label: "Name", value: fullName || "—" },
            { icon: Mail, label: "Email", value: user.email ?? "—" },
            { icon: Phone, label: "Mobile", value: formatPhone(user.phone) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-3">
              <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <dt className="w-20 shrink-0 text-muted">{label}</dt>
              <dd className="min-w-0 break-words font-medium text-dark">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="addresses-heading" className="mt-8">
        <h2 id="addresses-heading" className="mb-1 text-sm font-semibold uppercase tracking-wider text-dark">
          Saved addresses
        </h2>
        <p className="mb-4 text-sm text-muted">Pick one at checkout — no need to type it again.</p>
        <AddressBook
          mode="manage"
          prefill={{ receiverName: fullName, receiverPhone: user.phone.replace(/\D/g, "").slice(-10) }}
        />
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/wishlist"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm font-medium text-dark transition-colors hover:border-primary"
        >
          <Heart className="h-5 w-5 text-primary" aria-hidden="true" /> My wishlist
        </Link>
        <Link
          href="/track"
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm font-medium text-dark transition-colors hover:border-primary"
        >
          <Package className="h-5 w-5 text-primary" aria-hidden="true" /> Track an order
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          signOut();
          toast.info("You've been signed out");
        }}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:border-primary hover:text-primary"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
      </button>
    </div>
  );
}
