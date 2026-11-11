import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/Container";
import { BackToTopLink, FooterPattern } from "@/components/footer/FooterInteractive";
import { siteConfig } from "@/config/siteConfig";

const shopLinks = [
  { label: "Baluchori Sarees", href: "/sarees/baluchori" },
  { label: "Jamdani Sarees", href: "/sarees/jamdani" },
  { label: "Murshidabad Silk", href: "/sarees/murshidabad-silk" },
  { label: "Tant Sarees", href: "/sarees/tant" },
  { label: "All Sarees", href: "/sarees" },
];

const helpLinks = [
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchange", href: "/returns" },
  { label: "Track Order", href: "/track" },
  { label: "FAQs", href: "/faqs" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

/* Simple social glyphs (the icon set has no brand logos). 24×24, drawn with currentColor. */
const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </>
  ),
  Facebook: (
    <path
      d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z"
      fill="currentColor"
    />
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </>
  ),
  Pinterest: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11.2 7.5c2.6-.4 4.4 1.1 4.4 3.2 0 2.3-1.4 3.9-3.3 3.9-.7 0-1.3-.4-1.5-.8l-.9 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M11.3 11l-.8 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "Pinterest", href: siteConfig.social.pinterest },
];

const currentYear = new Date().getFullYear();

/** Column heading: gold caps with a small diamond. */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 border border-secondary" />
      {children}
    </h3>
  );
}

/** Footer link: a gold underline grows in from the left and a small arrow slides in, on hover or focus. */
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-center gap-1.5 py-0.5 text-sm text-background/70 transition-colors duration-300 hover:text-surface focus-visible:text-surface focus-visible:outline-none"
    >
      <span className="bg-[linear-gradient(var(--color-secondary),var(--color-secondary))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-out group-hover/link:bg-[length:100%_1px] group-focus-visible/link:bg-[length:100%_1px] motion-reduce:transition-none">
        {children}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 -translate-x-1 text-secondary opacity-0 transition duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100 motion-reduce:transition-none"
      />
    </Link>
  );
}

/** Contact line with its icon in a gold ring. */
function ContactItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-secondary/40 text-secondary">
        {icon}
      </span>
      <span className="pt-1.5 text-sm leading-relaxed text-background/75">{children}</span>
    </li>
  );
}

/** Gold border with a lotus medallion in the middle, like the edge of a pallu. */
function LotusBorder() {
  return (
    <div aria-hidden="true" className="flex items-center text-secondary">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/50 to-secondary/70" />
      <span className="mx-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rotate-45 bg-secondary/70" />
        <svg viewBox="0 0 48 32" className="h-8 w-12" fill="currentColor">
          <path d="M24 2 C29 9 29 17 24 25 C19 17 19 9 24 2 Z" />
          <path d="M24 25 C18 22 12 16 11 8 C17 10 22 15 24 25 Z" opacity="0.8" />
          <path d="M24 25 C30 22 36 16 37 8 C31 10 26 15 24 25 Z" opacity="0.8" />
          <path d="M24 25 C16 25 8 21 4 15 C11 14 19 18 24 25 Z" opacity="0.55" />
          <path d="M24 25 C32 25 40 21 44 15 C37 14 29 18 24 25 Z" opacity="0.55" />
          <rect x="12" y="27" width="24" height="1.5" rx="0.75" opacity="0.7" />
        </svg>
        <span className="h-1.5 w-1.5 rotate-45 bg-secondary/70" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-secondary/50 to-secondary/70" />
    </div>
  );
}

export default function Footer() {
  const { contact, location } = siteConfig;

  return (
    <footer className="relative mt-auto overflow-hidden bg-dark text-background">
      {/* Gold jaal pattern + pointer spotlight (desktop). */}
      <FooterPattern />

      <div className="relative">
        <Container className="pt-10">
          <LotusBorder />
        </Container>

        <Container className="py-14">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
            {/* Brand + contact */}
            <div className="space-y-6">
              <Image
                src="/logo.webp"
                alt={`${siteConfig.name} Sarees`}
                width={800}
                height={531}
                unoptimized
                // Soft light halo so the crimson lettering stays legible on the dark burgundy footer.
                className="h-24 w-auto [filter:drop-shadow(0_0_6px_rgba(255,253,249,0.22))]"
              />
              <p className="max-w-xs font-serif text-lg italic leading-snug text-background/85">{siteConfig.tagline}</p>
              <ul className="space-y-3">
                <ContactItem icon={<MapPin className="h-4 w-4" aria-hidden="true" />}>
                  <address className="not-italic">
                    {location.addressLine1}, {location.addressLine2}
                    <br />
                    {location.city}, {location.state} {location.postalCode}
                  </address>
                </ContactItem>
                <ContactItem icon={<Mail className="h-4 w-4" aria-hidden="true" />}>
                  <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-secondary">
                    {contact.email}
                  </a>
                </ContactItem>
                <ContactItem icon={<Phone className="h-4 w-4" aria-hidden="true" />}>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-secondary">
                    {contact.phone}
                  </a>
                </ContactItem>
                <ContactItem icon={<Clock className="h-4 w-4" aria-hidden="true" />}>{contact.supportHours}</ContactItem>
              </ul>
            </div>

            {/* Shop */}
            <nav aria-label="Shop">
              <ColumnTitle>Shop</ColumnTitle>
              <ul className="space-y-2.5">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Help */}
            <nav aria-label="Help">
              <ColumnTitle>Help</ColumnTitle>
              <ul className="space-y-2.5">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social */}
            <div>
              <ColumnTitle>Follow Us</ColumnTitle>
              <p className="mb-5 max-w-[16rem] text-sm leading-relaxed text-background/70">
                New weaves, behind-the-loom stories and festive edits.
              </p>
              <ul className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${link.label}`}
                      title={link.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/50 text-secondary transition duration-300 hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-dark hover:shadow-[0_8px_20px_-6px_rgba(184,134,70,0.6)] focus-visible:-translate-y-1 focus-visible:bg-secondary focus-visible:text-dark focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                        {SOCIAL_ICONS[link.label]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>

        {/* Bottom bar */}
        <div className="border-t border-secondary/15 bg-dark/40">
          <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-background/60 md:flex-row">
            <p className="text-center md:text-left">
              © {currentYear} {siteConfig.legalName}. All rights reserved.
              <span className="mx-2 text-secondary/60" aria-hidden="true">
                ◆
              </span>
              <span className="italic">Handwoven in Bengal</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <Link href="/privacy" className="transition-colors hover:text-secondary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-secondary">
                Terms &amp; Conditions
              </Link>
              <BackToTopLink />
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}
