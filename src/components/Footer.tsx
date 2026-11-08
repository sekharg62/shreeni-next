import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { siteConfig } from "@/config/siteConfig";

const shopLinks = [
  { label: "Baluchori Sarees", href: "/sarees/baluchori" },
  { label: "Jamdani Sarees", href: "/sarees/jamdani" },
  { label: "Murshidabad Silk", href: "/sarees/murshidabad-silk" },
  { label: "Tant Sarees", href: "/sarees/tant" },
];

const helpLinks = [
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchange", href: "/returns" },
  { label: "Track Order", href: "/track" },
  { label: "FAQs", href: "/faqs" },
];

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "YouTube", href: siteConfig.social.youtube },
  { label: "Pinterest", href: siteConfig.social.pinterest },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { contact, location } = siteConfig;

  return (
    <footer className="mt-auto bg-dark text-background">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + contact */}
          <div className="space-y-4">
          <Image
            src="/logo.webp"
            alt={`${siteConfig.name} Sarees`}
            width={800}
            height={347}
            unoptimized
            // The logo's dark blue lettering needs a soft light edge to read on the dark footer.
            className="h-20 w-auto [filter:drop-shadow(0_0_0.75px_rgba(255,253,249,0.95))_drop-shadow(0_0_1px_rgba(255,253,249,0.6))_drop-shadow(0_0_8px_rgba(255,253,249,0.18))]"
          />
          <p className="max-w-xs text-sm text-background/70">
            {siteConfig.tagline}
          </p>
          <address className="space-y-1 text-sm not-italic text-background/70">
            <p>
              {location.addressLine1}, {location.addressLine2}
            </p>
            <p>
              {location.city}, {location.state} {location.postalCode}
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="hover:text-secondary">
                {contact.email}
              </a>
            </p>
            <p>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-secondary">
                {contact.phone}
              </a>
            </p>
          </address>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
            Shop
          </h3>
          <ul className="space-y-2 text-sm text-background/70">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
            Help
          </h3>
          <ul className="space-y-2 text-sm text-background/70">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
            Follow Us
          </h3>
          <ul className="space-y-2 text-sm text-background/70">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-background/60 sm:flex-row">
          <p>
            © {currentYear} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-secondary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary">
              Terms of Service
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
