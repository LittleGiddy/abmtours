import type { NextConfig } from "next";

const nextConfig: NextConfig = {

serverExternalPackages: ["pdf-parse"],

  images: {
    domains: [
      "images.unsplash.com",
      "upload.wikimedia.org",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      // Add this pattern for Vercel Blob images
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;