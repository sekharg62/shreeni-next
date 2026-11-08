"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectMenuOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly SelectMenuOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Text before the selected value on the button, e.g. "Sort by". Also the accessible name. */
  label: string;
  /** Which side the menu lines up with. */
  align?: "left" | "right";
  className?: string;
};

/**
 * Custom dropdown (listbox pattern) for short option lists like "Sort by".
 * Keyboard: Enter/Space/↓/↑ open · ↑↓ Home End move · type a letter to jump · Enter picks · Esc/Tab close.
 */
export default function SelectMenu<T extends string>({ options, value, onChange, label, align = "right", className = "" }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const listId = `${id}-list`;
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Focus the list when it opens so arrow keys work straight away.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const pick = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close();
  };

  const onButtonKey = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openAt(selectedIndex);
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
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
      case " ":
        e.preventDefault();
        pick(active);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        // Type-ahead: jump to the next option starting with that letter.
        if (e.key.length === 1) {
          const ch = e.key.toLowerCase();
          const order = [...options.keys()].map((k) => (active + 1 + k) % options.length);
          const hit = order.find((i) => options[i].label.toLowerCase().startsWith(ch));
          if (hit !== undefined) setActive(hit);
        }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${selected?.label}`}
        onClick={() => (open ? close() : openAt(selectedIndex))}
        onKeyDown={onButtonKey}
        className={`inline-flex items-center gap-2 rounded-md border bg-surface py-2 pl-3 pr-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          open ? "border-primary" : "border-border hover:border-primary/60"
        }`}
      >
        <span className="text-muted">{label}:</span>
        <span className="font-semibold text-dark">{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className={`dropdown-in absolute top-full z-40 mt-2 min-w-full w-max overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-xl shadow-dark/10 focus:outline-none ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-sm ${
                  i === active ? "bg-background" : ""
                } ${isSelected ? "font-semibold text-primary" : "text-dark"}`}
              >
                {o.label}
                <Check className={`h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
