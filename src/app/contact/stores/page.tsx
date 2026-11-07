import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";
import { fullAddress, telHref, whatsappHref } from "@/lib/contact";

const { location, contact } = siteConfig;

export const metadata: Metadata = {
  title: "Store Locator",
  description: `Visit the ${siteConfig.name} store in ${location.city}, ${location.state} — address, opening hours, phone and directions.`,
};

// Keyless Google Maps embed of the store address.
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress())}&z=16&output=embed`;

/** Structured data so search engines can show the shop's address and phone. */
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: siteConfig.legalName,
  url: siteConfig.url,
  telephone: contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${location.addressLine1}, ${location.addressLine2}`,
    addressLocality: location.city,
    addressRegion: location.state,
    postalCode: location.postalCode,
    addressCountry: location.countryCode,
  },
  geo: { "@type": "GeoCoordinates", latitude: location.geo.latitude, longitude: location.geo.longitude },
};

export default function StoreLocatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Store Locator</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl">Visit us in person</h1>
            <div className="mx-auto mt-6 h-0.5 w-16 bg-secondary" />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              See the weaves up close, feel the fabric and get help choosing the right saree.
            </p>
          </div>
        </Container>
      </section>

      {/* Store + map */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <article className="flex flex-col rounded-lg border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-dark">
                {siteConfig.name}, {location.city}
              </h2>

              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex gap-3">
                  <dt>
                    <MapPin className="mt-0.5 h-5 w-5 text-secondary" aria-hidden="true" />
                    <span className="sr-only">Address</span>
                  </dt>
                  <dd className="leading-relaxed text-dark">
                    <address className="not-italic">
                      {location.addressLine1}
                      <br />
                      {location.addressLine2}
                      <br />
                      {location.city}, {location.state} {location.postalCode}
                      <br />
                      {location.country}
                    </address>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt>
                    <Clock className="mt-0.5 h-5 w-5 text-secondary" aria-hidden="true" />
                    <span className="sr-only">Opening hours</span>
                  </dt>
                  <dd className="text-dark">{contact.supportHours}</dd>
                </div>
                <div className="flex gap-3">
                  <dt>
                    <Phone className="mt-0.5 h-5 w-5 text-secondary" aria-hidden="true" />
                    <span className="sr-only">Phone</span>
                  </dt>
                  <dd>
                    <a href={telHref()} className="font-medium text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:flex-col lg:pt-8 2xl:flex-row">
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-dark"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                </a>
                <a
                  href={whatsappHref("Hi Shreeni! I'd like to visit the store.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-primary px-5 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-surface"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
                </a>
              </div>
            </article>

            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <iframe
                src={MAP_EMBED}
                title={`Map showing the ${siteConfig.name} store in ${location.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] h-full min-h-80 w-full lg:aspect-auto"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
