"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CircleCheck, CloudOff, Headset, Lock, Plus, RotateCw, SendHorizontal } from "lucide-react";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import { useToast } from "@/context/ToastContext";
import { supportService } from "@/services/supportService";
import { SUPPORT_LIMITS, ticketLabel, type SupportTicket } from "@/types/support";
import { REASON_META, SupportStatusBadge } from "./supportMeta";

/** Check for new replies this often while the tab is visible. */
const POLL_MS = 30_000;

function Bubble({ from, body, at }: { from: "CUSTOMER" | "SUPPORT"; body: string; at: string }) {
  const mine = from === "CUSTOMER";
  return (
    <li className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}>
      {!mine && (
        <span
          className="mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-surface"
          aria-hidden="true"
        >
          <Headset className="h-4 w-4" />
        </span>
      )}
      {/* Chat-style width: most of a phone screen, capped on wide screens. */}
      <div className={`flex min-w-0 max-w-[80%] flex-col sm:max-w-[65%] lg:max-w-md ${mine ? "items-end" : "items-start"}`}>
        <p className="mb-1 px-1 text-xs text-muted">
          <span className="font-semibold text-dark">{mine ? "You" : "Shreeni Support"}</span> ·{" "}
          <time dateTime={at}>{formatDateTime(at)}</time>
        </p>
        <div
          className={`whitespace-pre-wrap rounded-2xl [overflow-wrap:anywhere] px-4 py-3 text-sm leading-relaxed ${
            mine ? "rounded-tr-sm bg-primary text-surface" : "rounded-tl-sm border border-border bg-surface text-dark"
          }`}
        >
          {body}
        </div>
      </div>
    </li>
  );
}

function ThreadSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading request" className="space-y-6">
      <div className="h-24 animate-pulse rounded-lg bg-background" />
      <div className="ml-auto h-20 w-2/3 animate-pulse rounded-2xl bg-background" />
      <div className="h-16 w-1/2 animate-pulse rounded-2xl bg-background" />
    </div>
  );
}

/** One ticket: details, the conversation, and the reply box. */
export default function TicketThread({ id }: { id: string }) {
  const toast = useToast();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loadError, setLoadError] = useState<{ message: string; notFound: boolean } | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [closing, setClosing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const messageCount = ticket ? ticket.messages.length : 0;

  const load = useCallback(
    (quiet = false) =>
      supportService.get(id).then(
        (t) => {
          setTicket(t);
          setLoadError(null);
        },
        (err: unknown) => {
          if (quiet) return; // background refresh: keep what's on screen
          setLoadError({
            message: getApiErrorMessage(err, "We couldn't load this request."),
            notFound: getApiErrorStatus(err) === 404 || getApiErrorStatus(err) === 400,
          });
        }
      ),
    [id]
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Pick up support's replies without a manual refresh.
  const status = ticket?.status;
  useEffect(() => {
    if (!status || status === "CLOSED") return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [status, load]);

  // Keep the newest message in view.
  useEffect(() => {
    if (messageCount > 0) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messageCount]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const body = reply.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      setTicket(await supportService.reply(id, body));
      setReply("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Your message wasn't sent. Please try again."));
      void load(true); // e.g. it was closed meanwhile
    } finally {
      setSending(false);
    }
  };

  // Ctrl/⌘ + Enter sends; Enter alone adds a new line.
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send();
  };

  const close = async () => {
    setClosing(true);
    try {
      setTicket(await supportService.close(id));
      toast.info("Request closed. Thanks for reaching out!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't close the request. Please try again."));
    } finally {
      setClosing(false);
      setConfirmClose(false);
    }
  };

  const back = (
    <Link
      href="/account/support"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All requests
    </Link>
  );

  if (loadError) {
    return (
      <div className="space-y-6">
        {back}
        <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <CloudOff className="h-8 w-8 text-muted" aria-hidden="true" />
          <p className="font-medium text-dark">
            {loadError.notFound ? "We couldn't find this request." : loadError.message}
          </p>
          {!loadError.notFound && (
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-full border border-dark px-5 py-2 text-xs font-semibold uppercase tracking-wider text-dark transition-colors hover:bg-dark hover:text-surface"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        {back}
        <ThreadSkeleton />
      </div>
    );
  }

  const { icon: Icon, label } = REASON_META[ticket.reason];
  const closed = ticket.status === "CLOSED";
  const length = reply.trim().length;

  return (
    <div className="space-y-6">
      {back}

      <header className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-serif text-xl font-semibold text-dark sm:text-2xl">{label}</h1>
              <p className="text-xs text-muted">
                {ticketLabel(ticket.ticketNumber)} · Opened {formatDate(ticket.createdAt)}
              </p>
            </div>
          </div>
          <SupportStatusBadge status={ticket.status} />
        </div>
      </header>

      <ol className="space-y-5" aria-label="Conversation">
        <Bubble from="CUSTOMER" body={ticket.description} at={ticket.createdAt} />
        {ticket.messages.length === 0 && !closed && (
          <li className="flex justify-center">
            <p className="rounded-full bg-background px-4 py-2 text-xs text-muted">
              Thanks! Our team usually replies within a day. We&apos;ll answer right here.
            </p>
          </li>
        )}
        {ticket.messages.map((m) => (
          <Bubble key={m.id} from={m.from} body={m.body} at={m.createdAt} />
        ))}
      </ol>
      <div ref={endRef} />

      {ticket.status === "RESOLVED" && (
        <p className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          We&apos;ve marked this as resolved. Still need help? Just reply and we&apos;ll pick it up again.
        </p>
      )}

      {closed ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background px-6 py-6 text-center">
          <Lock className="h-5 w-5 text-muted" aria-hidden="true" />
          <p className="text-sm text-dark">
            This request was closed{ticket.closedAt ? ` on ${formatDate(ticket.closedAt)}` : ""}. Need more help?
          </p>
          <Link
            href="/account/support/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New request
          </Link>
        </div>
      ) : (
        <form onSubmit={send} className="rounded-lg border border-border bg-surface p-3 focus-within:ring-2 focus-within:ring-primary">
          <label htmlFor="reply" className="sr-only">
            Your reply
          </label>
          <textarea
            id="reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={onKeyDown}
            maxLength={SUPPORT_LIMITS.textMax}
            rows={3}
            placeholder="Write a reply…"
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-dark placeholder:text-muted/70 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <p className="hidden text-xs text-muted sm:block">Ctrl + Enter to send</p>
            <div className="ml-auto flex items-center gap-2">
              {confirmClose ? (
                <span className="flex items-center gap-2 text-xs">
                  <span className="text-muted">Close this request?</span>
                  <button
                    type="button"
                    onClick={() => void close()}
                    disabled={closing}
                    className="rounded-full bg-dark px-3 py-1.5 font-semibold text-surface disabled:opacity-60"
                  >
                    {closing ? "Closing…" : "Yes, close"}
                  </button>
                  <button type="button" onClick={() => setConfirmClose(false)} className="px-2 py-1.5 font-semibold text-muted hover:text-dark">
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClose(true)}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-dark"
                >
                  Close request
                </button>
              )}
              <button
                type="submit"
                disabled={sending || length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark disabled:opacity-50"
              >
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
