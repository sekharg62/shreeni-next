import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

/** Web app manifest: name, colours and icon when the site is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.seo.defaultTitle,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f3ea",
    theme_color: "#650f25",
    // Lotus "S" emblem on its burgundy background. The emblem sits inside the central safe zone,
    // so phones may crop the square into a circle/rounded shape ("maskable") without cutting it.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
