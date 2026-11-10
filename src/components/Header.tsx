import Link from "next/link";
import Image from "next/image";
import AccountButton from "./AccountButton";
import { siteConfig } from "@/config/siteConfig";
import { navLinks } from "@/config/nav";
import MobileMenu from "@/components/MobileMenu";
import CartButton from "@/components/CartButton";
import WishlistButton from "@/components/WishlistButton";
import Container from "@/components/Container";
import { SearchButton } from "@/components/search/SearchDialog";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        {/* Brand */}
        <Link href="/" aria-label={`${siteConfig.name} — Home`} className="flex shrink-0 items-center">
          <Image
            src="/logo.webp"
            alt={`${siteConfig.name} Sarees`}
            width={800}
            height={531}
            priority
            unoptimized
            className="h-14 w-auto sm:h-16"
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
          <SearchButton shortcuts />

          <AccountButton />

          <WishlistButton />

          <CartButton />
        </div>

        {/* Phones: search + menu */}
        <div className="flex items-center gap-1 md:hidden">
          <SearchButton />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
