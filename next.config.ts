import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images live on an external host (NEXT_PUBLIC_IMAGE_BASE_URL),
    // e.g. the legacy Express backend or a CDN
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/category/:slug',
        destination: '/categories/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
