import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  CircleHelp,
  Clock,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";
import { telHref, whatsappHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Help Center",
  description: `Get help with your ${siteConfig.name} order — call, WhatsApp or email us, track an order, or read about shipping and returns.`,
};

const { contact } = siteConfig;

type Channel = { icon: LucideIcon; title: string; value: string; note: string; href: string; external?: boolean };

const CHANNELS: Channel[] = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: contact.whatsapp,
    note: "Fastest — usually a reply within minutes during working hours",
    href: whatsappHref("Hi Shreeni! I need help with…"),
    external: true,
  },
  { icon: Phone, title: "Call us", value: contact.phone, note: contact.supportHours, href: telHref() },
  { icon: Mail, title: "Email", value: contact.email, note: "We reply within one working day", href: `mailto:${contact.email}` },
];

const TOPICS: { icon: LucideIcon; title: string; body: string; href: string }[] = [
  { icon: Package, title: "Track an order", body: "See where your saree is right now.", href: "/track" },
  { icon: Truck, title: "Shipping & delivery", body: "Timelines, charges and where we deliver.", href: "/shipping" },
  { icon: RotateCcw, title: "Returns & exchange", body: "How to return or exchange a saree.", href: "/returns" },
  { icon: CircleHelp, title: "FAQs", body: "Quick answers to common questions.", href: "/faqs" },
  { icon: MapPin, title: "Visit our store", body: "Find us, see opening hours and get directions.", href: "/contact/stores" },
  { icon: LifeBuoy, title: "My support requests", body: "Follow up on a request you've already raised.", href: "/account/support" },
];

export default function HelpCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Help Center</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl">How can we help?</h1>
            <div className="mx-auto mt-6 h-0.5 w-16 bg-secondary" />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Questions about a saree, an order, or a delivery? Real people at {siteConfig.name} are here to help.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm text-dark">
              <Clock className="h-4 w-4 text-secondary" aria-hidden="true" /> {contact.supportHours}
            </p>
          </div>
        </Container>
      </section>

      {/* Contact channels */}
      <section className="py-16 sm:py-20" aria-labelledby="reach-heading">
        <Container>
          <h2 id="reach-heading" className="text-center font-serif text-3xl font-semibold text-primary">
            Talk to us
          </h2>
          <ul className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {CHANNELS.map(({ icon: Icon, title, value, note, href, external }) => (
              <li key={title}>
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex h-full flex-col items-center rounded-lg border border-border bg-surface p-6 text-center transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-4 font-serif text-xl font-semibold text-dark">{title}</span>
                  <span className="mt-1 break-all font-medium text-primary">{value}</span>
                  <span className="mt-2 text-sm text-muted">{note}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Self-service topics */}
      <section className="bg-surface py-16 sm:py-20" aria-labelledby="topics-heading">
        <Container>
          <h2 id="topics-heading" className="text-center font-serif text-3xl font-semibold text-primary">
            Find answers quickly
          </h2>
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map(({ icon: Icon, title, body, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-4 rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-dark">{title}</span>
                    <span className="mt-1 block text-sm text-muted">{body}</span>
                  </span>
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Raise a request */}
      <section className="bg-primary py-14 text-surface">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Need help with an order?</h2>
              <p className="mt-2 text-surface/80">Raise a request from your account and we&apos;ll reply right there.</p>
            </div>
            <Link
              href="/account/support/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-background"
            >
              <LifeBuoy className="h-4 w-4" aria-hidden="true" /> Raise a request
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
