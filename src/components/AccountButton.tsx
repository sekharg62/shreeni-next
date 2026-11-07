"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Header account icon: a person when signed out, the shopper's initial when signed in. */
export default function AccountButton() {
  const { status, displayName } = useAuth();
  const signedIn = status === "signed-in" && displayName;

  return (
    <Link
      href="/account"
      aria-label={signedIn ? `Your account (${displayName})` : "Sign in or create an account"}
      title={signedIn ? `Signed in as ${displayName}` : "Sign in"}
      className="rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
    >
      {signedIn ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-surface">
          {displayName.charAt(0).toUpperCase()}
        </span>
      ) : (
        <User className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      )}
    </Link>
  );
}
