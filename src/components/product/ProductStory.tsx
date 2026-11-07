/** Split admin text into paragraphs on blank lines (single newlines become line breaks). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "The Story" — the maker's narrative. Renders nothing when there is none. */
export default function ProductStory({ story }: { story: string | null }) {
  if (!story?.trim()) return null;
  return (
    <section aria-labelledby="story-heading" className="rounded-lg bg-background px-6 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Behind the weave</p>
        <h2 id="story-heading" className="mt-3 font-serif text-2xl font-semibold text-dark sm:text-3xl">
          The Story
        </h2>
        <div className="mx-auto mt-4 h-0.5 w-16 bg-secondary" />
        <div className="mt-6 space-y-4 font-serif text-lg italic leading-relaxed text-dark/85">
          {paragraphs(story).map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
