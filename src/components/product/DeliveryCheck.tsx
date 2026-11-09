"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { pincodeService, type PincodeInfo } from "@/services/pincodeService";

/** Remembered for the shopper's next product page (a convenience; works without it). */
const STORAGE_KEY = "shreeni:pincode";
const PIN = /^[1-9]\d{5}$/;

type State =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "found"; info: PincodeInfo }
  | { kind: "invalid"; message: string }
  | { kind: "error" };

/**
 * "Check delivery": confirms a PIN code and shows where it is. It makes no promise about
 * timing or charges (those are confirmed at checkout), so it never says anything untrue.
 */
export default function DeliveryCheck() {
  const id = useId();
  const [pin, setPin] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const check = async (value: string) => {
    if (!PIN.test(value)) {
      setState({ kind: "invalid", message: "Enter a 6-digit PIN code" });
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState({ kind: "checking" });
    try {
      const info = await pincodeService.lookup(value, ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (!info) {
        setState({ kind: "invalid", message: "We couldn't find this PIN code. Please check it." });
        return;
      }
      setState({ kind: "found", info });
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* storage blocked: fine */
      }
    } catch {
      if (!ctrl.signal.aborted) setState({ kind: "error" });
    }
  };

  // Pre-fill (and quietly re-check) the PIN the shopper used last time.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
    if (!saved || !PIN.test(saved)) return;
    const known = pincodeService.peek(saved);
    const raf = window.requestAnimationFrame(() => {
      setPin(saved!);
      if (known) setState({ kind: "found", info: known });
      else void check(saved!);
    });
    return () => {
      window.cancelAnimationFrame(raf);
      abortRef.current?.abort();
    };
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void check(pin);
  };

  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-dark">
        <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
        Check delivery
      </label>
      <form onSubmit={onSubmit} className="mt-2.5 flex h-11 overflow-hidden rounded-md border border-border bg-surface focus-within:border-dark">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter PIN code"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
            if (state.kind !== "idle" && state.kind !== "checking") setState({ kind: "idle" });
          }}
          aria-describedby={`${id}-result`}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm tracking-wider text-dark outline-none placeholder:tracking-normal placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state.kind === "checking"}
          className="inline-flex w-20 items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-background disabled:opacity-60"
        >
          {state.kind === "checking" ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Checking" /> : "Check"}
        </button>
      </form>

      <div id={`${id}-result`} aria-live="polite" className="mt-2 min-h-5 text-xs">
        {state.kind === "found" && (
          <p className="flex items-start gap-1.5 text-dark">
            <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-green-700" aria-hidden="true" />
            <span>
              Delivering to{" "}
              <span className="font-semibold">
                {[state.info.district, state.info.state].filter(Boolean).join(", ")}
              </span>
              . Delivery charges and timing are confirmed at checkout.{" "}
              <Link href="/shipping" className="text-muted underline underline-offset-2 hover:text-primary">
                Shipping policy
              </Link>
            </span>
          </p>
        )}
        {state.kind === "invalid" && <p className="text-red-600">{state.message}</p>}
        {state.kind === "error" && <p className="text-red-600">Couldn&apos;t check right now. Please try again.</p>}
      </div>
    </div>
  );
}
