import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Shreeni S3 bucket: banners, categories and product photos.
      { protocol: "https", hostname: "shreeni-collection.s3.ap-south-1.amazonaws.com", pathname: "/**" },
      // Demo products (npm run db:seed-demo in shreeni-backend) use Unsplash photos.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // Singular "/saree/…" links (e.g. saved on banners) → the real category route.
      { source: "/saree/:slug", destination: "/sarees/:slug", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
