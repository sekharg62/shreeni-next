import type { Metadata } from "next";
import type { ReactNode } from "react";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "My Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return children;
}
