import Link from "next/link";
import Image from "next/image";
import AccountButton from "./AccountButton";
import { siteConfig } from "@/config/siteConfig";
import { navLinks } from "@/config/nav";
import { CATEGORY_SLUGS } from "@/config/constants";
import MobileMenu from "@/components/MobileMenu";
import CartButton from "@/components/CartButton";
import WishlistButton from "@/components/WishlistButton";
import { SearchButton } from "@/components/search/SearchDialog";
import { getTopCategories } from "@/components/home/TopCategories";
import HeaderShell from "@/components/header/HeaderShell";
import DesktopNav, { type MenuWeave } from "@/components/header/DesktopNav";

/** Weaves for the Sarees mega-menu (cached; [] if the backend is down — the menu then uses the nav list). */
async function menuWeaves(): Promise<MenuWeave[]> {
  const { data } = await getTopCategories(CATEGORY_SLUGS.homeTopCategoriesParent, 1, 12);
  return data.map((c) => ({
    name: c.name,
    href: `/sarees/${c.slug}`,
    posterUrl: c.posterUrl,
    tagline: c.tagline,
    minPrice: c.minPrice,
  }));
}

/**
 * Site header: centred logo between the menu (left) and the actions (right).
 * Tall at the top of the page; once scrolled it shrinks and gains a soft shadow (HeaderShell).
 * Phones: menu + search · logo · cart.
 */
export default async function Header() {
  const weaves = await menuWeaves();
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <HeaderShell>
      <div className="relative mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 transition-[height] duration-300 sm:px-6 md:h-[84px] md:group-data-[scrolled=true]/hdr:h-16 lg:px-8">
        {/* Left: menu (desktop) · menu toggle + search (phones) */}
        <div className="flex h-full items-center">
          <DesktopNav links={navLinks} weaves={weaves} whatsappHref={whatsappHref} />
          <div className="-ml-2 flex items-center md:hidden">
            <MobileMenu />
            <SearchButton />
          </div>
        </div>

        {/* Centre: logo */}
        <Link
          href="/"
          aria-label={`${siteConfig.name} — Home`}
          className="flex shrink-0 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Image
            src="/logo.webp"
            alt={`${siteConfig.name} Sarees`}
            width={800}
            height={531}
            priority
            unoptimized
            className="h-12 w-auto transition-[height] duration-300 md:h-[68px] md:group-data-[scrolled=true]/hdr:h-12"
          />
        </Link>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <div className="hidden items-center gap-0.5 md:flex lg:gap-1">
            <SearchButton shortcuts />
            <AccountButton />
            <WishlistButton />
          </div>
          <CartButton />
        </div>
      </div>
    </HeaderShell>
  );
}
