"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import type { NavLink } from "@/config/nav";
import { formatINR, paiseToRupees } from "@/lib/format";

/** A weave in the Sarees mega-menu (from the categories API; poster/price may be missing). */
export type MenuWeave = {
  name: string;
  href: string;
  posterUrl: string | null;
  tagline: string | null;
  /** Lowest price in paise. */
  minPrice: number | null;
};

/** Hover intent: open/close only after the pointer has settled, so passing over doesn't flicker. */
const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

type Props = { links: NavLink[]; weaves: MenuWeave[]; whatsappHref: string };

/** Desktop navigation: "Sarees" opens a full-width mega-menu, the others a small dropdown card. */
export default function DesktopNav({ links, weaves, whatsappHref }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const schedule = useCallback((next: string | null, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  }, []);

  // Close on navigation, Escape, or a click outside.
  useEffect(() => {
    const id = window.setTimeout(() => setOpen(null), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        navRef.current?.querySelector<HTMLElement>(`[data-trigger="${open}"]`)?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  return (
    <nav ref={navRef} aria-label="Main" className="hidden h-full items-center gap-7 md:flex lg:gap-9">
      {links.map((link) => {
        const hasMenu = Boolean(link.items?.length);
        const isOpen = open === link.label;
        const mega = link.href === "/sarees";
        return (
          <div
            key={link.href}
            className={`flex h-full items-center ${mega ? "" : "relative"}`}
            onMouseEnter={() => hasMenu && schedule(link.label, OPEN_DELAY)}
            onMouseLeave={() => hasMenu && schedule(null, CLOSE_DELAY)}
          >
            <div className="flex items-center gap-0.5">
              <Link
                href={link.href}
                data-trigger={link.label}
                className={`group/nl relative py-2 text-[15px] font-medium tracking-wide transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary ${
                  isActive(link.href) || isOpen ? "text-primary" : "text-dark"
                }`}
              >
                {link.label}
                {/* gold underline: grows from the centre on hover, stays for the current section */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 mx-auto h-px bg-secondary transition-all duration-300 ease-out group-hover/nl:w-full group-focus-visible/nl:w-full ${
                    isActive(link.href) || isOpen ? "w-full" : "w-0"
                  }`}
                />
              </Link>
              {hasMenu && (
                <button
                  type="button"
                  aria-label={`${link.label} menu`}
                  aria-expanded={isOpen}
                  aria-controls={`menu-${link.label}`}
                  onClick={() => setOpen(isOpen ? null : link.label)}
                  className="rounded p-1 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>

            {hasMenu &&
              (mega ? (
                <MegaPanel id={`menu-${link.label}`} open={isOpen} weaves={weaves} fallback={link.items!} whatsappHref={whatsappHref} />
              ) : (
                <DropdownCard id={`menu-${link.label}`} open={isOpen} items={link.items!} />
              ))}
          </div>
        );
      })}
    </nav>
  );
}

/** Shared open/close animation for both menu kinds. */
function panelState(open: boolean) {
  return open
    ? "visible translate-y-0 opacity-100"
    : "invisible -translate-y-1 opacity-0 pointer-events-none";
}

function DropdownCard({ id, open, items }: { id: string; open: boolean; items: { label: string; href: string }[] }) {
  return (
    <div
      id={id}
      className={`absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 pt-2 transition-[opacity,transform,visibility] duration-200 ease-out ${panelState(open)}`}
    >
      <ul className="overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-[0_24px_48px_-24px_rgba(50,21,27,0.45)]">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group/di flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-dark transition-colors hover:bg-background hover:text-primary focus-visible:bg-background focus-visible:outline-none"
            >
              {item.label}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 -translate-x-1 text-secondary opacity-0 transition duration-200 group-hover/di:translate-x-0 group-hover/di:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaPanel({
  id,
  open,
  weaves,
  fallback,
  whatsappHref,
}: {
  id: string;
  open: boolean;
  weaves: MenuWeave[];
  fallback: { label: string; href: string }[];
  whatsappHref: string;
}) {
  // API weaves when we have them; otherwise the names from the nav config (no photos).
  const list: MenuWeave[] = weaves.length
    ? weaves
    : fallback.map((f) => ({ name: f.label, href: f.href, posterUrl: null, tagline: null, minPrice: null }));
  const [active, setActive] = useState(0);
  // Photos load only once the menu has been opened at least once.
  const [everOpened, setEverOpened] = useState(false);
  if (open && !everOpened) setEverOpened(true);
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full z-40 transition-[opacity,transform,visibility] duration-300 ease-out ${panelState(open)}`}
    >
      <div className="border-b border-border bg-surface shadow-[0_30px_60px_-30px_rgba(50,21,27,0.5)]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] gap-10 px-6 py-9 lg:px-8">
          {/* Weaves */}
          <div>
            <PanelTitle>Shop by weave</PanelTitle>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-0.5">
              {list.map((w, i) => (
                <li key={w.href}>
                  <Link
                    href={w.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`group/w block rounded-lg px-3 py-2 transition-colors focus-visible:outline-none ${
                      i === active ? "bg-background text-primary" : "text-dark hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-serif text-base leading-snug">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rotate-45 bg-secondary transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`}
                      />
                      <span className="truncate">{w.name}</span>
                    </span>
                    {w.minPrice !== null && (
                      <span className="mt-0.5 block pl-3.5 text-xs text-muted">from {formatINR(paiseToRupees(w.minPrice))}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/sarees"
              className="group/all mt-5 inline-flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              All weaves
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/all:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Featured photo of the weave being pointed at */}
          <Link
            href={current.href}
            tabIndex={-1}
            aria-hidden="true"
            className="group/f relative block aspect-[16/11] overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-dark"
          >
            {everOpened &&
              list.map((w, i) =>
                w.posterUrl ? (
                  <Image
                    key={w.href}
                    src={w.posterUrl}
                    alt=""
                    fill
                    sizes="(max-width: 1440px) 36vw, 520px"
                    className={`object-cover transition-[opacity,transform] duration-700 ease-out group-hover/f:scale-[1.03] ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ) : null,
              )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-surface">
              <p className="font-serif text-2xl font-semibold">{current.name}</p>
              {current.tagline && <p className="mt-1 font-serif italic text-surface/85">{current.tagline}</p>}
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Shop {current.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/f:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Help + story */}
          <div className="flex flex-col gap-4">
            <PanelTitle>Discover</PanelTitle>
            <PanelCard href="/about/craftsmanship" icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} title="The craft">
              How Bengal&apos;s weavers make each saree by hand.
            </PanelCard>
            <PanelCard
              href={whatsappHref}
              external
              icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
              title="Help me choose"
            >
              Chat with us on WhatsApp for advice on weave, colour and occasion.
            </PanelCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary">
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-secondary" />
      {children}
    </p>
  );
}

function PanelCard({
  href,
  icon,
  title,
  children,
  external = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls =
    "group/pc flex gap-3 rounded-xl border border-border p-4 transition-colors hover:border-secondary/60 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
  const body = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary/50 text-secondary">
        {icon}
      </span>
      <span>
        <span className="flex items-center gap-1.5 font-serif text-base font-semibold text-dark group-hover/pc:text-primary">
          {title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/pc:translate-x-1" aria-hidden="true" />
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-muted">{children}</span>
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}
