"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AutoHeight from "@/components/ui/AutoHeight";

type Mode = "signin" | "signup";
type Method = "email" | "mobile";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [method, setMethod] = useState<Method>("email");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dummy submit — wire up to your auth backend later.
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      {/* Mode tabs */}
      <div className="mb-8 grid grid-cols-2 rounded-full bg-background p-1">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
              mode === m ? "bg-primary text-surface" : "text-muted hover:text-dark"
            }`}
          >
            {m === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-semibold text-primary">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isSignup
            ? "Join Shreeni to shop faster and track orders."
            : "Sign in to continue to your account."}
        </p>
      </div>

      <AutoHeight>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Your name"
            required
          />
        )}

        {/* Email / Mobile method toggle */}
        <div>
          <div className="mb-3 flex gap-2">
            {(["email", "mobile"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  method === m
                    ? "border-primary bg-primary text-surface"
                    : "border-border text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {m === "email" ? "Email" : "Mobile"}
              </button>
            ))}
          </div>

          {method === "email" ? (
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          ) : (
            <Input
              id="mobile"
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              prefix="🇮🇳 +91"
              placeholder="10-digit number"
              autoComplete="tel"
              required
            />
          )}
        </div>

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
        />

        {!isSignup && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm font-medium text-primary hover:text-secondary"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button type="submit" fullWidth size="lg">
          {isSignup ? "Create Account" : "Sign In"}
        </Button>

        {submitted && (
          <p className="text-center text-sm text-green-700">
            {isSignup
              ? "Account created (demo) — connect a backend to go live."
              : "Signed in (demo) — connect a backend to go live."}
          </p>
        )}
      </form>
      </AutoHeight>

      <p className="mt-6 text-center text-sm text-muted">
        {isSignup ? "Already have an account?" : "New to Shreeni?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isSignup ? "signin" : "signup")}
          className="font-semibold text-primary hover:text-secondary"
        >
          {isSignup ? "Sign In" : "Create one"}
        </button>
      </p>
    </div>
  );
}
