"use client";

import { useRef, useState, type SubmitEvent } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import IndiaPhonePrefix from "@/components/ui/IndiaPhonePrefix";
import AutoHeight from "@/components/ui/AutoHeight";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api";
import type { Customer } from "@/types/auth";

export type AuthMode = "signin" | "signup";

type Fields = {
  identifier: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { identifier: "", firstName: "", lastName: "", email: "", phone: "", password: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE = /^[6-9]\d{9}$/;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
];

function validate(mode: AuthMode, f: Fields): FieldErrors {
  const e: FieldErrors = {};
  if (mode === "signin") {
    const id = f.identifier.trim();
    if (!id) e.identifier = "Enter your email or mobile number";
    else if (id.includes("@") ? !EMAIL.test(id) : !MOBILE.test(id.replace(/\D/g, "").slice(-10)))
      e.identifier = "Enter a valid email or 10-digit mobile number";
    if (!f.password) e.password = "Enter your password";
    return e;
  }
  if (!f.firstName.trim()) e.firstName = "Enter your first name";
  if (!f.email.trim()) e.email = "Enter your email address";
  else if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email address";
  if (!f.phone) e.phone = "Enter your mobile number";
  else if (!MOBILE.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (!PASSWORD_RULES.every((r) => r.test(f.password))) e.password = "Password doesn't meet the requirements below";
  return e;
}

/** Turn an API failure into a field error or a message for the whole form. */
function serverError(mode: AuthMode, err: unknown): { field?: keyof Fields; message: string } {
  const status = getApiErrorStatus(err);
  const message = getApiErrorMessage(err);
  if (status === 429) return { message: "Too many attempts. Please wait a few minutes and try again." };
  if (status === 401) return { message: "Incorrect email/mobile number or password." };
  if (mode === "signup" && status === 409) {
    if (/mobile/i.test(message)) return { field: "phone", message };
    if (/email/i.test(message)) return { field: "email", message };
  }
  return { message };
}

type Props = {
  initialMode?: AuthMode;
  /** Called after a successful sign-in or sign-up (e.g. to redirect). */
  onSuccess?: (customer: Customer, mode: AuthMode) => void;
};

export default function AuthForm({ initialMode = "signin", onSuccess }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isSignup = mode === "signup";

  const set = (key: keyof Fields, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    setFormError(null);
    // Errors appear after the first submit, then update as the shopper types.
    if (submitted) setErrors(validate(mode, next));
  };

  const switchMode = (m: AuthMode) => {
    if (m === mode) return;
    // Carry the email / mobile across so nobody types it twice.
    setFields((f) => {
      if (m === "signup") {
        const id = f.identifier.trim();
        return id.includes("@") ? { ...f, email: f.email || id } : { ...f, phone: f.phone || id.replace(/\D/g, "").slice(-10) };
      }
      return { ...f, identifier: f.identifier || f.email || f.phone };
    });
    setMode(m);
    setErrors({});
    setFormError(null);
    setSubmitted(false);
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.querySelector<HTMLInputElement>(`#auth-${first}`)?.focus();
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setSubmitted(true);
    const errs = validate(mode, fields);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);

    setBusy(true);
    setFormError(null);
    try {
      const customer = isSignup
        ? await signUp({
            firstName: fields.firstName.trim(),
            lastName: fields.lastName.trim() || undefined,
            email: fields.email.trim(),
            phone: fields.phone,
            password: fields.password,
          })
        : await signIn({ identifier: fields.identifier.trim(), password: fields.password });
      onSuccess?.(customer, mode);
    } catch (err) {
      const { field, message } = serverError(mode, err);
      if (field) {
        const next = { [field]: message };
        setErrors(next);
        focusFirstError(next);
      } else {
        setFormError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      {/* Mode tabs */}
      <div role="tablist" aria-label="Account" className="mb-8 grid grid-cols-2 rounded-full bg-background p-1">
        {(["signin", "signup"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`rounded-full py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
              mode === m ? "bg-primary text-surface" : "text-muted hover:text-dark"
            }`}
          >
            {m === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-semibold text-primary">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted">
          {isSignup ? "Join Shreeni to review sarees, shop faster and track orders." : "Sign in to continue to your account."}
        </p>
      </div>

      <AutoHeight>
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError && (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </p>
          )}

          {isSignup ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="auth-firstName"
                  label="First name"
                  autoComplete="given-name"
                  value={fields.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  error={errors.firstName}
                  maxLength={60}
                />
                <Input
                  id="auth-lastName"
                  label="Last name (optional)"
                  autoComplete="family-name"
                  value={fields.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  maxLength={60}
                />
              </div>
              <Input
                id="auth-email"
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
                maxLength={254}
              />
              <Input
                id="auth-phone"
                label="Mobile number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                prefix={<IndiaPhonePrefix />}
                placeholder="10-digit number"
                value={fields.phone}
                // Digits only; pasting "+91 98765 43210" keeps the last 10.
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(-10))}
                error={errors.phone}
                hint="For order updates. Never shown publicly."
              />
            </>
          ) : (
            <Input
              id="auth-identifier"
              label="Email or mobile number"
              autoComplete="username"
              placeholder="you@example.com or 98765 43210"
              value={fields.identifier}
              onChange={(e) => set("identifier", e.target.value)}
              error={errors.identifier}
              maxLength={254}
            />
          )}

          <div>
            <Input
              id="auth-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={fields.password}
              onChange={(e) => set("password", e.target.value)}
              error={isSignup ? undefined : errors.password}
              maxLength={72}
            />
            {isSignup && (
              <ul aria-label="Password requirements" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(fields.password);
                  const bad = !ok && !!errors.password;
                  return (
                    <li
                      key={r.label}
                      className={`flex items-center gap-1.5 ${ok ? "text-green-700" : bad ? "text-red-600" : "text-muted"}`}
                    >
                      <Check className={`h-3.5 w-3.5 ${ok ? "opacity-100" : "opacity-30"}`} aria-hidden="true" />
                      {r.label}
                      <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" disabled={busy} aria-busy={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {busy ? (isSignup ? "Creating account…" : "Signing in…") : isSignup ? "Create Account" : "Sign In"}
          </Button>

          {isSignup && (
            <p className="text-center text-xs text-muted">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </form>
      </AutoHeight>

      <p className="mt-6 text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "New to Shreeni? "}
        <button
          type="button"
          onClick={() => switchMode(isSignup ? "signin" : "signup")}
          className="font-semibold text-primary hover:text-secondary"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}
