"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AUTH_EXPIRED_EVENT, AUTH_TOKEN_KEY, getApiErrorStatus, tokenStorage } from "@/lib/api";
import { authService } from "@/services/authService";
import type { Customer, LoginPayload, RegisterPayload } from "@/types/auth";

/** "loading" until the saved token (if any) has been checked. */
export type AuthStatus = "loading" | "guest" | "signed-in";

type AuthContextValue = {
  user: Customer | null;
  status: AuthStatus;
  /** "Priya" — first name, or the email's local part as a fallback. */
  displayName: string | null;
  signIn: (payload: LoginPayload) => Promise<Customer>;
  signUp: (payload: RegisterPayload) => Promise<Customer>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const becomeGuest = useCallback(() => {
    setUser(null);
    setStatus("guest");
  }, []);

  /** Check the saved token with the backend. State is only set in promise callbacks. */
  const restore = useCallback((): Promise<void> => {
    if (!tokenStorage.get()) return Promise.resolve().then(becomeGuest);
    return authService.me().then(
      (customer) => {
        setUser(customer);
        setStatus("signed-in");
      },
      (err: unknown) => {
        // 401 → token is bad; network errors keep it for next time.
        if (getApiErrorStatus(err) === 401) tokenStorage.clear();
        becomeGuest();
      },
    );
  }, [becomeGuest]);

  useEffect(() => {
    void restore();

    // Token rejected by any request → signed out everywhere in this tab.
    const onExpired = () => becomeGuest();
    // Signed in / out in another tab → follow it.
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) void restore();
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      window.removeEventListener("storage", onStorage);
    };
  }, [restore, becomeGuest]);

  const start = useCallback((token: string, customer: Customer) => {
    tokenStorage.set(token);
    setUser(customer);
    setStatus("signed-in");
    return customer;
  }, []);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const { auth_token, user: customer } = await authService.login(payload);
      return start(auth_token, customer);
    },
    [start],
  );

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      const { auth_token, user: customer } = await authService.register(payload);
      return start(auth_token, customer);
    },
    [start],
  );

  const signOut = useCallback(() => {
    tokenStorage.clear();
    becomeGuest();
  }, [becomeGuest]);

  const displayName = user ? user.firstName || user.email?.split("@")[0] || "there" : null;

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, displayName, signIn, signUp, signOut }),
    [user, status, displayName, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
