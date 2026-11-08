"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, LayoutGrid, Loader2, Search, X } from "lucide-react";
import { navLinks } from "@/config/nav";
import { formatINR } from "@/lib/format";
import { productService } from "@/services/productService";
import type { SearchSuggestions } from "@/types/product";

const RECENT_KEY = "shreeni_recent_searches";
const MAX_RECENT = 6;
const MIN_CHARS = 2;
const DEBOUNCE_MS = 200;

function readRecent(): string[] {
  try {
    const v: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}
function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    /* storage blocked */
  }
}

/** Weave categories from the menu, shown before the shopper types. */
const POPULAR = navLinks.find((l) => l.label === "Sarees")?.items ?? [];

type Item = { key: string; href: string; label: string };

/**
 * Site search: search-as-you-type suggestions (categories + products), recent searches and popular
 * weaves when empty, keyboard navigation (↑↓ Enter Esc), and Enter for the full results page.
 */
export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ q: string; data: SearchSuggestions } | null>(null);
  const [loadingFor, setLoadingFor] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const q = query.trim();

  // Open: focus the box, load recent searches, lock page scroll.
  useEffect(() => {
    if (!open) return;
    void Promise.resolve().then(() => setRecent(readRecent()));
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Suggestions, a moment after typing stops; older requests are cancelled.
  useEffect(() => {
    if (!open || q.length < MIN_CHARS) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoadingFor(q);
      productService
        .suggest(q, controller.signal)
        .then((data) => setResult({ q, data }))
        .catch(() => {})
        .finally(() => !controller.signal.aborted && setLoadingFor(null));
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, q]);

  const showSuggestions = q.length >= MIN_CHARS;
  const data = showSuggestions && result?.q === q ? result.data : null;
  const loading = showSuggestions && loadingFor === q;

  // Everything the arrow keys can move through, in screen order.
  const items: Item[] = showSuggestions
    ? [
        ...(data?.categories ?? []).map((c) => ({ key: `c-${c.slug}`, href: `/sarees/${c.slug}`, label: c.name })),
        ...(data?.products ?? []).map((p) => ({ key: `p-${p.id}`, href: `/products/${p.slug}`, label: p.name })),
        { key: "all", href: `/search?q=${encodeURIComponent(q)}`, label: `See all results for "${q}"` },
      ]
    : [
        ...recent.map((r) => ({ key: `r-${r}`, href: `/search?q=${encodeURIComponent(r)}`, label: r })),
        ...POPULAR.map((p) => ({ key: `w-${p.href}`, href: p.href, label: p.label })),
      ];
  const optionId = (key: string) => `${id}-${key}`;

  const close = useCallback(() => {
    setQuery("");
    setActive(-1);
    onClose();
  }, [onClose]);

  const remember = (term: string) => {
    const next = [term, ...readRecent().filter((r) => r.toLowerCase() !== term.toLowerCase())];
    writeRecent(next);
  };

  const go = (href: string, term?: string) => {
    if (term) remember(term);
    close();
    router.push(href);
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const item = items[active];
    if (item) {
      // Remember what was typed (or the recent search re-used); popular-weave shortcuts aren't searches.
      const term = item.key.startsWith("r-") ? item.label : item.key.startsWith("w-") ? undefined : q;
      return go(item.href, term);
    }
    if (q) go(`/search?q=${encodeURIComponent(q)}`, q);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (items.length ? (i + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    writeRecent(next);
    setRecent(next);
  };

  if (!open || typeof document === "undefined") return null;
  const listId = `${id}-list`;
  const activeKey = items[active]?.key;
  const optionClass = (key: string) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
      activeKey === key ? "bg-background text-primary" : "text-dark hover:bg-background"
    }`;

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button type="button" aria-label="Close search" onClick={close} className="sheet-fade absolute inset-0 bg-dark/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="dropdown-in absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col bg-surface shadow-2xl sm:max-h-[85dvh]"
      >
        <form role="search" onSubmit={submit} className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:py-4">
            <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={items.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeKey ? optionId(activeKey) : undefined}
              aria-label="Search sarees"
              placeholder="Search sarees, weaves, colours…"
              autoComplete="off"
              enterKeyHint="search"
              maxLength={100}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
              }}
              onKeyDown={onKeyDown}
              className="min-w-0 flex-1 bg-transparent py-1 text-base text-dark placeholder:text-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted" aria-hidden="true" />}
            {query && (
              <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="shrink-0 text-xs font-semibold text-muted hover:text-dark">
                Clear
              </button>
            )}
            <button type="button" onClick={close} aria-label="Close search" className="shrink-0 rounded-full p-1.5 text-dark hover:bg-background">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div id={listId} role="listbox" aria-label="Search suggestions" className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-2 pb-4 pt-2 sm:px-4">
          {!showSuggestions && (
            <>
              {recent.length > 0 && (
                <section className="mb-3">
                  <h2 className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">Recent searches</h2>
                  {recent.map((r) => (
                    <div key={r} className="flex items-center">
                      <button
                        type="button"
                        role="option"
                        id={optionId(`r-${r}`)}
                        aria-selected={activeKey === `r-${r}`}
                        onClick={() => go(`/search?q=${encodeURIComponent(r)}`, r)}
                        className={optionClass(`r-${r}`)}
                      >
                        <Clock className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                        {r}
                      </button>
                      <button type="button" onClick={() => removeRecent(r)} aria-label={`Remove "${r}" from recent searches`} className="rounded-full p-2 text-muted hover:text-dark">
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </section>
              )}
              <section>
                <h2 className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">Popular weaves</h2>
                <div className="flex flex-wrap gap-2 px-3 pt-1">
                  {POPULAR.map((p) => (
                    <button
                      key={p.href}
                      type="button"
                      role="option"
                      id={optionId(`w-${p.href}`)}
                      aria-selected={activeKey === `w-${p.href}`}
                      onClick={() => go(p.href)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        activeKey === `w-${p.href}` ? "border-primary text-primary" : "border-border text-dark hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {showSuggestions && data && (
            <>
              {data.categories.length > 0 && (
                <section className="mb-2">
                  <h2 className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">Categories</h2>
                  {data.categories.map((c) => (
                    <button key={c.slug} type="button" role="option" id={optionId(`c-${c.slug}`)} aria-selected={activeKey === `c-${c.slug}`} onClick={() => go(`/sarees/${c.slug}`, q)} className={optionClass(`c-${c.slug}`)}>
                      <LayoutGrid className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                      <span>
                        {c.name} <span className="text-muted">sarees</span>
                      </span>
                    </button>
                  ))}
                </section>
              )}
              {data.products.length > 0 && (
                <section>
                  <h2 className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">Products</h2>
                  {data.products.map((p) => (
                    <button key={p.id} type="button" role="option" id={optionId(`p-${p.id}`)} aria-selected={activeKey === `p-${p.id}`} onClick={() => go(`/products/${p.slug}`, q)} className={optionClass(`p-${p.id}`)}>
                      <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-background">
                        {p.image && <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{p.name}</span>
                        <span className="mt-0.5 flex items-baseline gap-2 text-xs">
                          <span className="font-semibold text-secondary">{formatINR(p.price)}</span>
                          {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                            <span className="text-muted line-through">{formatINR(p.compareAtPrice)}</span>
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}
              {data.total === 0 && data.categories.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No matches for &ldquo;{q}&rdquo;. Try another weave, colour or fabric.
                </p>
              ) : (
                <button type="button" role="option" id={optionId("all")} aria-selected={activeKey === "all"} onClick={() => go(`/search?q=${encodeURIComponent(q)}`, q)} className={`${optionClass("all")} mt-2 justify-between font-semibold text-primary`}>
                  See all {data.total} {data.total === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </>
          )}
          {showSuggestions && !data && loading && <p className="px-3 py-8 text-center text-sm text-muted">Searching…</p>}
          <p className="sr-only" aria-live="polite">
            {data ? `${data.total} products found` : ""}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Header search icon + the dialog. `shortcuts`: also open with "/" or Ctrl/⌘+K (render once per page). */
export function SearchButton({ className = "", shortcuts = false }: { className?: string; shortcuts?: boolean }) {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!shortcuts) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        aria-haspopup="dialog"
        className={`rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary ${className}`}
      >
        <Search className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <SearchDialog open={open} onClose={onClose} />
    </>
  );
}
