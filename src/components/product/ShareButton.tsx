"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { useToast } from "@/context/ToastContext";

type Props = {
  /** Path to share, e.g. "/products/red-silk-saree". Shared without query string or hash. */
  path: string;
  title: string;
  className?: string;
};

/** Copy text without the Clipboard API (http pages, older browsers). */
function legacyCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    el.remove();
  }
}

/**
 * Opens the device's share sheet (WhatsApp, Messages, Instagram…) where supported.
 * Elsewhere (most desktop browsers) it copies the link and says so.
 */
export default function ShareButton({ path, title, className = "" }: Props) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const share = async () => {
    if (busy.current) return; // the share sheet throws if opened twice
    busy.current = true;
    const url = new URL(path, window.location.origin).toString();
    const data: ShareData = { title, text: `${title} — ${siteConfig.name}`, url };

    try {
      if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
        try {
          await navigator.share(data);
          return;
        } catch (err) {
          // Closing the sheet is not an error. Anything else → fall back to copying.
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }

      let ok = false;
      try {
        await navigator.clipboard.writeText(url);
        ok = true;
      } catch {
        ok = legacyCopy(url);
      }
      if (ok) {
        toast.success("Link copied. Paste it anywhere to share.");
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error("Couldn't share or copy the link. Copy it from the address bar instead.");
      }
    } finally {
      busy.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      aria-label={copied ? "Link copied" : `Share ${title}`}
      title="Share"
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-dark transition duration-200 hover:border-primary hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-700" aria-hidden="true" />
      ) : (
        <Share2 className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
