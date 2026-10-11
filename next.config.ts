import type { NextConfig } from "next";

const nextConfig: NextConfig = {

serverExternalPackages: ["pdf-parse"],

  images: {
    loaderFile: "./lib/cloudinary-loader.ts",

    domains: [
      "images.unsplash.com",
      "upload.wikimedia.org",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Retained so images uploaded before the Cloudinary migration still render
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;