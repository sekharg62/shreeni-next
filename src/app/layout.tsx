import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { siteConfig } from "@/config/siteConfig";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

// Elegant serif for headings / display
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Clean sans for body text
const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.seo.keywords],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "shopping",
  // Each page sets its own canonical URL + Open Graph via lib/seo `pageMetadata` (metadata merges shallowly).
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(siteConfig.seo.googleSiteVerification && {
    verification: { google: siteConfig.seo.googleSiteVerification },
  }),
  // Phone numbers on the page are links already; stop iOS auto-linking other digits.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#650f25",
};

/** Tag Manager runs on production builds only, so local development doesn't pollute analytics. */
const GTM_ID = process.env.NODE_ENV === "production" ? siteConfig.analytics.gtmId : "";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body className="flex min-h-full flex-col bg-background text-dark">
        {GTM_ID && (
          // Google's fallback for visitors with JavaScript turned off.
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <ToastProvider>
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
        </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
