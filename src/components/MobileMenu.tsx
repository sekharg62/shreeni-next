"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { navLinks } from "@/config/nav";
import { siteConfig } from "@/config/siteConfig";

const quickLinks = [
  { label: "Search", href: "/search" },
  { label: "Account", href: "/account" },
  { label: "Cart", href: "/cart" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Toggle button — three bars morph into an ✕. Stays above the overlay. */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[60] flex h-10 w-10 items-center justify-center text-dark transition-colors hover:text-primary"
      >
        <span className="flex w-6 flex-col gap-1.5">
          <span
            className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full rounded bg-current transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Full-screen overlay — portaled to <body> so it escapes the header's
          backdrop-filter containing block and truly covers the viewport.
          z-40 keeps it below the sticky header (z-50) so the toggle stays on top. */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-40 flex flex-col bg-primary px-6 pb-8 pt-28 text-surface transition-opacity duration-300 md:hidden ${
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Nav items */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-2">
              {navLinks.map((link) => {
                // Leaf item (no sub-menu) — plain link.
                if (!link.items) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className="block border-b border-surface/15 py-4 font-serif text-3xl font-semibold text-surface transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  );
                }

                // Parent with a sub-menu — tap to expand/collapse.
                const isExpanded = expanded === link.label;
                return (
                  <div key={link.href} className="border-b border-surface/15">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpanded(isExpanded ? null : link.label)
                      }
                      className="flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-3xl font-semibold text-surface transition-colors hover:text-secondary"
                    >
                      <span>{link.label}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-6 w-6 shrink-0 text-surface/80 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Smoothly animated sub-item list */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="flex flex-col gap-1 pb-4 pl-1">
                          <li>
                            <Link
                              href={link.href}
                              onClick={close}
                              className="block py-1.5 text-lg text-surface/80 transition-colors hover:text-secondary"
                            >
                              All {link.label}
                            </Link>
                          </li>
                          {link.items.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={close}
                                className="block py-1.5 text-lg text-surface/80 transition-colors hover:text-secondary"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Quick links + contact */}
            <div className="border-t border-surface/15 pt-6">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="text-sm uppercase tracking-wider text-surface/80 transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-sm text-surface/70">
                {siteConfig.contact.phone}
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
