import type { ReactNode } from "react";
import type { ProductColor, ProductDetail, ProductSpec } from "@/types/product";
import { paragraphs } from "./ProductStory";

/** 550 → "5.5 m"; 115 → "1.15 m" (sarees are measured in metres). */
function metres(cm: number): string {
  return `${Number((cm / 100).toFixed(2))} m`;
}

const COLOR_LABEL: Record<ProductColor["type"], string> = {
  PRIMARY: "Main colour",
  SECONDARY: "Accent colour",
};

type Row = { label: string; value: ReactNode };

function DefinitionTable({ rows }: { rows: Row[] }) {
  return (
    <dl className="divide-y divide-border rounded-lg border border-border bg-surface">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 text-sm">
          <dt className="text-muted">{r.label}</dt>
          <dd className="font-medium text-dark">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark">{title}</h3>
      {children}
    </div>
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
      <h2 id="details-heading" className="font-serif text-2xl font-semibold text-dark sm:text-3xl">
        Details
      </h2>
      <div className="mt-2 h-0.5 w-16 bg-secondary" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4 leading-relaxed text-dark/85">
          {paragraphs(product.description).map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        <div className="space-y-8">
          {factRows.length > 0 && (
            <Block title="Product details">
              <DefinitionTable rows={factRows} />
            </Block>
          )}
          {specifications.details.length > 0 && (
            <Block title="Specifications">
              <DefinitionTable rows={specRows(specifications.details)} />
            </Block>
          )}
          {makerRows.length > 0 && (
            <Block title="Manufacturing & legal">
              <DefinitionTable rows={makerRows} />
            </Block>
          )}
        </div>
      </div>
    </section>
  );
}
