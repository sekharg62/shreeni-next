import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, MessageCircle, Package, ShoppingBag, Sparkles, Users } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";
import { whatsappHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

const { contact } = siteConfig;

export const metadata: Metadata = pageMetadata({
  title: "WhatsApp Us",
  description: `Chat with ${siteConfig.name} on WhatsApp for help choosing a saree, order updates, and more.`,
  path: "/contact/whatsapp",
});

/** Tap one and WhatsApp opens with the message already typed. */
const STARTERS = [
  { icon: Sparkles, label: "Help me choose a saree", message: "Hi Shreeni! Can you help me choose a saree?" },
  { icon: Package, label: "Where is my order?", message: "Hi Shreeni! I'd like an update on my order. My order number is: " },
  { icon: ShoppingBag, label: "Ask about a product", message: "Hi Shreeni! I have a question about this saree: " },
  { icon: Users, label: "Bulk or wedding orders", message: "Hi Shreeni! I'm interested in a bulk / wedding order." },
];

const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .103 5.359.1 11.945c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.943-5.359 11.946-11.945a11.88 11.88 0 00-3.467-8.4" />
  </svg>
);

export default function WhatsAppPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
              <WhatsAppLogo className="h-9 w-9" />
            </span>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-dark sm:text-5xl">Chat with us on WhatsApp</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              The quickest way to reach us. Send a photo of a saree you love, ask about colours, or get an update on your
              order.
            </p>
            <a
              href={whatsappHref("Hi Shreeni!")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
              <WhatsAppLogo className="h-5 w-5" /> Start a chat
            </a>
            <p className="mt-4 text-sm text-muted">
              {contact.whatsapp} ·{" "}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {contact.supportHours}
              </span>
            </p>
          </div>
        </Container>
      </section>

      {/* Conversation starters */}
      <section className="py-16 sm:py-20" aria-labelledby="starters-heading">
        <Container>
          <h2 id="starters-heading" className="text-center font-serif text-3xl font-semibold text-primary">
            What would you like to ask?
          </h2>
          <p className="mt-3 text-center text-muted">Tap one — WhatsApp opens with the message ready to send.</p>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {STARTERS.map(({ icon: Icon, label, message }) => (
              <li key={label}>
                <a
                  href={whatsappHref(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#128C7E] transition-colors group-hover:bg-[#25D366] group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-medium text-dark">{label}</span>
                  <MessageCircle className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-[#128C7E]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Good to know */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold text-primary">Good to know</h2>
            <ul className="mt-6 space-y-4 text-muted">
              {[
                "We reply during working hours; messages sent after hours are answered the next working day.",
                "For order questions, include your order number so we can help faster.",
                "We will never ask for your password, OTP or card details on WhatsApp.",
              ].map((t) => (
                <li key={t} className="flex gap-3 leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">
              Prefer something else?{" "}
              <Link href="/contact/help" className="font-medium text-primary underline underline-offset-4 hover:text-secondary">
                See all the ways to reach us
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
