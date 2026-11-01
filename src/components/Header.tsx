import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/siteConfig";
import { navLinks } from "@/config/nav";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-[90%] items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" aria-label={`${siteConfig.name} — Home`} className="flex shrink-0 items-center">
          <Image
            src="/logo-footer.png"
            alt={`${siteConfig.name} Sarees`}
            width={1024}
            height={335}
            priority
            unoptimized
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        {/* Nav */}
        <nav className="hidden h-full items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <div key={link.href} className="group relative flex h-full items-center">
              <Link
                href={link.href}
                className="flex h-full items-center text-base font-medium text-dark transition-colors group-hover:text-primary"
              >
                <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
                  {link.label}
                </span>
              </Link>

              {link.items && (
                <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="overflow-hidden rounded-md border border-border bg-surface py-2 shadow-xl shadow-dark/10">
                    {link.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-dark transition-colors hover:bg-background hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions (desktop) */}
        <div className="hidden items-center gap-1 md:flex sm:gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <Link
            href="/account"
            aria-label="Account"
            className="rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
            </svg>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-dark transition-colors hover:bg-background hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2.5 3h2l2.2 12.3a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
            </svg>
          </Link>
        </div>

        {/* Mobile menu (hamburger + full-screen overlay) */}
        <MobileMenu />
      </div>
    </header>
  );
}
