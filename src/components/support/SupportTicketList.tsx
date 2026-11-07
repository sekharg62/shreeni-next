"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, CloudOff, LifeBuoy, Plus, RotateCw } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api";
import { formatRelative } from "@/lib/format";
import { supportService } from "@/services/supportService";
import { ticketLabel, type SupportTicketSummary } from "@/types/support";
import { REASON_META, SupportStatusBadge } from "./supportMeta";

const PAGE_SIZE = 10;

export function TicketListSkeleton() {
  return (
    <ul aria-hidden="true" className="space-y-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-background" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-background" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-background" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The signed-in customer's tickets, most recent activity first. */
export default function SupportTicketList() {
  const [tickets, setTickets] = useState<SupportTicketSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState<"loading" | "ready" | "error" | "more">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setState(p === 1 ? "loading" : "more");
    supportService.list(p, PAGE_SIZE).then(
      (res) => {
        setTickets((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
        setState("ready");
      },
      (err: unknown) => {
        setError(getApiErrorMessage(err, "We couldn't load your requests."));
        setState("error");
      }
    );
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load(1));
  }, [load]);

  if (state === "loading") return <TicketListSkeleton />;

  if (state === "error" && tickets.length === 0) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center">
        <CloudOff className="h-8 w-8 text-red-600" aria-hidden="true" />
        <p className="font-medium text-dark">{error}</p>
        <button
          type="button"
          onClick={() => load(1)}
          className="inline-flex items-center gap-2 rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
          <LifeBuoy className="h-8 w-8 text-primary/60" aria-hidden="true" />
        </span>
        <p className="font-serif text-lg font-semibold text-dark">No requests yet</p>
        <p className="max-w-sm text-sm text-muted">
          Questions about an order, delivery, payment or a return? Our team usually replies within a day.
        </p>
        <Link
          href="/account/support/new"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New request
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {tickets.map((t) => {
          const { icon: Icon, label } = REASON_META[t.reason];
          const supportReplied = t.lastReplyFrom === "SUPPORT" && t.status !== "CLOSED";
          return (
            <li key={t.id}>
              <Link
                href={`/account/support/${t.id}`}
                className={`group flex items-start gap-4 rounded-lg border bg-surface p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  supportReplied ? "border-primary/40" : "border-border"
                } ${t.status === "CLOSED" ? "opacity-75" : ""}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-medium text-dark">{label}</p>
                    <SupportStatusBadge status={t.status} />
                    {supportReplied && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> Support replied
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{t.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    {ticketLabel(t.ticketNumber)} · Updated {formatRelative(t.lastMessageAt)}
                  </p>
                </div>
                <ChevronRight
                  className="mt-2 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {page < totalPages && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => load(page + 1)}
            disabled={state === "more"}
            className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {state === "more" ? "Loading…" : "Show older requests"}
          </button>
        </div>
      )}
      {state === "error" && <p role="alert" className="mt-4 text-center text-sm text-red-700">{error}</p>}
    </>
  );
}
