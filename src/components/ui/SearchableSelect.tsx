"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SelectOption = { label: string; value: string };

type Props = {
  /** Id of the trigger button (lets forms focus the field on an error). */
  id: string;
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  /** Text shown when the search matches nothing. */
  emptyText?: string;
};

/** Bold the part of `text` that matches `query`. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-primary">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/**
 * Dropdown with a search box (same pattern as the admin portal's SearchableSelect).
 * Keyboard: Enter/Space/↓ opens · type to filter · ↑↓ Home End move · Enter picks · Esc/Tab closes.
 */
export default function SearchableSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  error,
  emptyText = "No matches",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    // Names that start with the query come first ("we" → West Bengal before Daman…).
    const starts = options.filter((o) => o.label.toLowerCase().startsWith(q));
    const contains = options.filter((o) => !o.label.toLowerCase().startsWith(q) && o.label.toLowerCase().includes(q));
    return [...starts, ...contains];
  }, [options, query]);

  const close = (focusButton = true) => {
    setOpen(false);
    setQuery("");
    if (focusButton) buttonRef.current?.focus();
  };

  const openList = () => {
    // Open upwards when there isn't room below (e.g. near the bottom of a phone screen).
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setOpenUp(window.innerHeight - rect.bottom < 300 && rect.top > 300);
    const i = selected ? options.indexOf(selected) : 0;
    setActive(Math.max(0, i));
    setOpen(true);
  };

  const pick = (opt: SelectOption) => {
    onChange(opt.value);
    close();
  };

  // Focus the search box when opened; close when clicking outside.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: "nearest" });
    // optionId is stable for a given uid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const last = filtered.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[active]) pick(filtered[active]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation(); // don't close a surrounding drawer/modal
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="w-full" ref={rootRef}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-dark">
        {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-describedby={describedBy}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onButtonKey}
          className={`flex w-full items-center justify-between gap-2 rounded-md border bg-surface px-4 py-3 text-left transition-colors focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-600"
              : open
                ? "border-primary"
                : "border-border hover:border-primary/50 focus:border-primary"
          }`}
        >
          <span className={`truncate ${selected ? "text-dark" : "text-muted/60"}`}>{selected?.label ?? placeholder}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            // Above the floating WhatsApp / back-to-top buttons (z-40), below the sticky header (z-50).
          className={`absolute z-[45] w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg ${
              openUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={searchRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={filtered[active] ? optionId(active) : undefined}
                aria-label={`Search ${label.toLowerCase()}`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onSearchKey}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="w-full bg-transparent text-sm text-dark outline-none placeholder:text-muted/60"
              />
            </div>
            <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="max-h-60 overflow-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-muted">{emptyText}</li>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt.value === value;
                  const isActive = i === active;
                  return (
                    <li
                      key={opt.value}
                      id={optionId(i)}
                      role="option"
                      aria-selected={isSelected}
                      // mousedown keeps focus in the search box until the click lands
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(opt)}
                      onMouseMove={() => setActive(i)}
                      className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                        isActive ? "bg-background" : ""
                      } ${isSelected ? "font-medium text-primary" : "text-dark"}`}
                    >
                      <span>
                        <Highlight text={opt.label} query={query} />
                      </span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <p id={describedBy} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
