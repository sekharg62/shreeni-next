import type { ReactNode } from "react";
import type { ProductColor, ProductDetail, ProductSpec } from "@/types/product";
import Accordion from "./Accordion";
import { metres } from "./ProductHighlights";
import { paragraphs } from "./ProductStory";
import SectionTitle from "./SectionTitle";

const COLOR_LABEL: Record<ProductColor["type"], string> = {
  PRIMARY: "Main colour",
  SECONDARY: "Accent colour",
};

type Row = { label: string; value: ReactNode };

function DefinitionTable({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y divide-border/70">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3 text-sm">
          <dt className="text-muted">{r.label}</dt>
          <dd className="font-medium text-dark">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const specRows = (specs: ProductSpec[]): Row[] => specs.map((s) => ({ label: s.label, value: s.value }));

/** Description, product facts, colours, specifications and maker information. */
export default function ProductDetails({ product }: { product: ProductDetail }) {
  const { facts, maker, colors, specifications } = product;

  const factRows: Row[] = [
    facts.fabric && { label: "Fabric", value: facts.fabric },
    facts.lengthCm !== null && { label: "Saree length", value: metres(facts.lengthCm) },
    facts.widthCm !== null && { label: "Saree width", value: metres(facts.widthCm) },
    {
      label: "Blouse piece",
      value: facts.blousePiece ? (facts.blousePieceInfo ? `Included — ${facts.blousePieceInfo}` : "Included") : "Not included",
    },
    facts.washCare && { label: "Wash care", value: facts.washCare },
    ...colors.map((c) => ({
      label: COLOR_LABEL[c.type],
      value: (
        <span className="inline-flex items-center gap-2">
          {c.hexCode && (
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border border-border"
              style={{ backgroundColor: c.hexCode }}
            />
          )}
          {c.name}
        </span>
      ),
    })),
  ].filter(Boolean) as Row[];

  const makerRows: Row[] = [
    maker.countryOfOrigin && { label: "Country of origin", value: maker.countryOfOrigin },
    maker.manufacturedBy && { label: "Manufactured by", value: maker.manufacturedBy },
    maker.manufacturerAddress && {
      label: "Manufacturer address",
      value: <span className="whitespace-pre-line">{maker.manufacturerAddress}</span>,
    },
    ...specRows(specifications.manufacturing),
  ].filter(Boolean) as Row[];

  return (
    <section aria-labelledby="details-heading">
      <SectionTitle id="details-heading" eyebrow="About this saree" title="Details & care" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <div className="max-w-prose space-y-4 text-[15px] leading-relaxed text-dark/85 first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.9] first-letter:text-primary">
          {paragraphs(product.description).map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {/* Product details open by default; tap a heading to see more. */}
        <div className="self-start border-t border-border">
          {factRows.length > 0 && (
            <Accordion title="Product details" defaultOpen>
              <DefinitionTable rows={factRows} />
            </Accordion>
          )}
          {specifications.details.length > 0 && (
            <Accordion title="Specifications" count={specifications.details.length}>
              <DefinitionTable rows={specRows(specifications.details)} />
            </Accordion>
          )}
          {makerRows.length > 0 && (
            <Accordion title="Manufacturing & legal">
              <DefinitionTable rows={makerRows} />
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}
