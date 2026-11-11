import type { ReactNode } from "react";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";

export type LegalSection = {
  /** Anchor id, e.g. "cancellations" → /terms#cancellations */
  id: string;
  title: string;
  body: ReactNode;
};

type Props = {
  title: string;
  /** One line under the title. */
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
  /** Other policies to link at the end. */
  related?: { href: string; label: string }[];
};

/**
 * Shared layout for the legal pages: title, "draft" notice, a contents list (sticky beside the
 * text on desktop) and numbered sections with linkable anchors.
 */
export default function LegalPage({ title, summary, lastUpdated, sections, related = [] }: Props) {
  return (
    <div className="pb-24 pt-4 sm:pt-6">
      <Container>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />

        <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Legal</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-primary sm:text-4xl">{title}</h1>
          <span aria-hidden="true" className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-secondary">
            <span className="h-px w-8 bg-current" />
            <span className="h-1.5 w-1.5 rotate-45 border border-current" />
            <span className="h-px w-8 bg-current" />
          </span>
          <p className="mt-5 leading-relaxed text-muted sm:text-lg">{summary}</p>
          <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
        </header>

        {/* Remove this notice once a lawyer has reviewed the text. */}
        <aside
          role="note"
          className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Draft.</span> This document is a working draft and will be reviewed by our
            legal advisers before launch. Some details may change.
          </p>
        </aside>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary">Contents</p>
            <ol className="mt-3 space-y-1.5 border-l border-border text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-0.5 pl-3 text-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28">
                <h2 id={`${s.id}-title`} className="font-serif text-xl font-semibold text-dark sm:text-2xl">
                  <span className="mr-2 text-secondary">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-dark/80">{s.body}</div>
              </section>
            ))}

            {related.length > 0 && (
              <p className="border-t border-border pt-6 text-sm text-muted">
                See also:{" "}
                {related.map((r, i) => (
                  <span key={r.href}>
                    {i > 0 && " · "}
                    <Link href={r.href} className="font-medium text-primary underline-offset-4 hover:underline">
                      {r.label}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </article>
        </div>
      </Container>
    </div>
  );
}

/** Bulleted list styled for legal text. */
export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-secondary">{children}</ul>;
}

/** Inline link styled for legal text. */
export function LegalLink({ href, children }: { href: string; children: ReactNode }) {
  const cls = "font-medium text-primary underline underline-offset-4 hover:text-secondary";
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
