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
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  leaving?: boolean;
};

type ToastContextValue = {
  toast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANTS: Record<
  ToastType,
  { icon: LucideIcon; iconColor: string; bar: string }
> = {
  success: { icon: CheckCircle2, iconColor: "text-green-600", bar: "bg-green-600" },
  error: { icon: XCircle, iconColor: "text-red-600", bar: "bg-red-600" },
  warning: { icon: AlertTriangle, iconColor: "text-amber-500", bar: "bg-amber-500" },
  info: { icon: Info, iconColor: "text-primary", bar: "bg-primary" },
};

const DURATION = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => setMounted(true), []);

  const remove = useCallback((id: number) => {
    // Trigger leave animation, then drop from state.
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), DURATION);
    },
    [remove]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (m) => toast("success", m),
      error: (m) => toast("error", m),
      warning: (m) => toast("warning", m),
      info: (m) => toast("info", m),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
            {toasts.map((t) => {
              const { icon: Icon, iconColor, bar } = VARIANTS[t.type];
              return (
                <div
                  key={t.id}
                  role="status"
                  aria-live="polite"
                  className={`pointer-events-auto flex items-start gap-3 overflow-hidden rounded-lg border border-border bg-surface pr-3 shadow-lg ${
                    t.leaving ? "toast-leave" : "toast-enter"
                  }`}
                >
                  <span className={`w-1 self-stretch ${bar}`} aria-hidden="true" />
                  <Icon
                    className={`mt-3 h-5 w-5 shrink-0 ${iconColor}`}
                    aria-hidden="true"
                  />
                  <p className="flex-1 py-3 text-sm text-dark">{t.message}</p>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    aria-label="Dismiss"
                    className="mt-3 shrink-0 text-muted transition-colors hover:text-dark"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
