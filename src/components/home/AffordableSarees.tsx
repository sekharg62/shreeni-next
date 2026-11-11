import ViewAllButton from "@/components/ViewAllButton";
import Container from "@/components/Container";

/**
 * Woven border band ("paar") of a Bengal Tant saree: fine gold stripes, a row of temple
 * (mandir) triangles and a diamond chain. `flip` mirrors it for the bottom edge so the
 * temples always point into the body of the saree.
 */
function SareeBorder({ flip = false }: { flip?: boolean }) {
  const id = flip ? "tant-border-b" : "tant-border-t";
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-11 w-full text-secondary sm:h-12 ${flip ? "bottom-0 -scale-y-100" : "top-0"}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="16" height="48" patternUnits="userSpaceOnUse">
          {/* outer stripes */}
          <rect y="3" width="16" height="2" fill="currentColor" opacity="0.9" />
          <rect y="7" width="16" height="0.75" fill="currentColor" opacity="0.6" />
          {/* temple triangles */}
          <path d="M0 22 L8 11 L16 22 Z" fill="currentColor" opacity="0.85" />
          <path d="M4 22 L8 16.5 L12 22 Z" fill="#32151b" opacity="0.55" />
          {/* diamond chain */}
          <path d="M8 25.5 L11 29 L8 32.5 L5 29 Z" fill="currentColor" opacity="0.7" />
          <rect x="0" y="28.6" width="16" height="0.8" fill="currentColor" opacity="0.45" />
          {/* inner stripes */}
          <rect y="36" width="16" height="0.75" fill="currentColor" opacity="0.6" />
          <rect y="39" width="16" height="1.5" fill="currentColor" opacity="0.85" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** The saree's body ("jomin"): a fine cotton weave with small gold flower butis in a half-drop repeat. */
function SareeBody() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-secondary">
      <defs>
        {/* Warp and weft threads, barely visible: gives the cloth its texture. */}
        <pattern id="tant-weave" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 H6" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
          <path d="M3 0 V6" stroke="#000" strokeWidth="0.4" opacity="0.12" />
        </pattern>
        {/* Four-petal buti, repeated on a staggered grid like a hand-placed motif. */}
        <pattern id="tant-buti" width="80" height="80" patternUnits="userSpaceOnUse">
          <g id="tant-flower" fill="currentColor" opacity="0.5" transform="translate(20 20) scale(1.4)">
            <ellipse rx="2" ry="5" />
            <ellipse rx="2" ry="5" transform="rotate(90)" />
            <ellipse rx="1.4" ry="3.6" transform="rotate(45)" opacity="0.7" />
            <ellipse rx="1.4" ry="3.6" transform="rotate(-45)" opacity="0.7" />
            <circle r="1.6" fill="#32151b" opacity="0.6" />
          </g>
          <use href="#tant-flower" transform="translate(40 40)" />
          {/* tiny dots between the flowers */}
          <circle cx="60" cy="20" r="1.2" fill="currentColor" opacity="0.35" />
          <circle cx="20" cy="60" r="1.2" fill="currentColor" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tant-weave)" />
      <rect width="100%" height="100%" fill="url(#tant-buti)" />
    </svg>
  );
}

export default function AffordableSarees() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-dark px-6 py-20 text-center text-surface sm:px-12 sm:py-24">
          {/* Woven like a Tant saree: patterned body between two gold borders. */}
          <SareeBody />
          <SareeBorder />
          <SareeBorder flip />
          {/* Soft dark glow behind the words so they read over the pattern. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(50,21,27,0.92),rgba(50,21,27,0.55)_60%,transparent_100%)]"
          />

          <div className="relative">
            {/* Decorative gold accent */}
            <div className="mx-auto mb-6 h-0.5 w-16 bg-secondary" />

            <h2 className="font-serif text-2xl font-semibold sm:text-4xl">Everyday Cotton Sarees</h2>
            <p className="mx-auto mt-4 max-w-xl text-surface/80 sm:text-lg">
              Light, breathable Tant cottons from Bengal — handpicked drapes that bring everyday elegance without
              stretching your budget.
            </p>

            <div className="mt-2">
              <ViewAllButton href="/sarees/tant" label="Shop Tant Sarees" variant="light" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
