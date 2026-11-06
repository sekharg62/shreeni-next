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
      { label: "Baluchori", href: "/sarees/baluchori" },
      { label: "Swarnachori", href: "/sarees/swarnachori" },
      { label: "Murshidabad Silk", href: "/sarees/murshidabad-silk" },
      { label: "Kantha Stitch", href: "/sarees/kantha-stitch" },
      { label: "Bishnupuri Silk", href: "/sarees/bishnupuri-silk" },
      { label: "Handloom", href: "/sarees/handloom" },
      { label: "Jamdani", href: "/sarees/jamdani" },
      { label: "Tant", href: "/sarees/tant" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    items: [{ label: "Diwali Gift", href: "/collections/diwali-gift" }],
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
