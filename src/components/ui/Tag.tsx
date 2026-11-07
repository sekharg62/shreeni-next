type TagProps = {
  label: string;
  /** Any CSS colour from the admin (e.g. "#21c700"); falls back to the brand colour. */
  color?: string | null;
  size?: "sm" | "md";
};

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * A small label chip. The admin colour is used for the dot, border and a light
 * tint, while the text stays dark — readable whatever colour was picked.
 */
export default function Tag({ label, color, size = "md" }: TagProps) {
  const c = color && HEX.test(color) ? color : "var(--color-primary)";
  const pad = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium text-dark ${pad}`}
      style={{
        borderColor: `color-mix(in srgb, ${c} 45%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${c} 10%, transparent)`,
      }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: c }} />
      {label}
    </span>
  );
}

/** A row of tags; renders nothing when empty. */
export function TagList({ tags, label = "Tags" }: { tags: { name: string; slug: string; color: string | null }[]; label?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t.slug}>
          <Tag label={t.name} color={t.color} />
        </li>
      ))}
    </ul>
  );
}
