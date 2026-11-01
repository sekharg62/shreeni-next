export type NavLink = {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Sarees",
    href: "/sarees",
    items: [
      { label: "Silk Sarees", href: "/sarees/silk" },
      { label: "Cotton Sarees", href: "/sarees/cotton" },
      { label: "Designer Sarees", href: "/sarees/designer" },
      { label: "Banarasi Sarees", href: "/sarees/banarasi" },
      { label: "Kanjivaram Sarees", href: "/sarees/kanjivaram" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    items: [
      { label: "New Arrivals", href: "/collections/new" },
      { label: "Bestsellers", href: "/collections/bestsellers" },
      { label: "Wedding Edit", href: "/collections/wedding" },
      { label: "Festive Edit", href: "/collections/festive" },
    ],
  },
  {
    label: "About",
    href: "/about",
    items: [
      { label: "Our Story", href: "/about/story" },
      { label: "Craftsmanship", href: "/about/craftsmanship" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    items: [
      { label: "Help Center", href: "/contact/help" },
      { label: "Store Locator", href: "/contact/stores" },
      { label: "WhatsApp Us", href: "/contact/whatsapp" },
    ],
  },
];
