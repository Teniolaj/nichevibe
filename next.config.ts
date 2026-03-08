import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co", pathname: "/**" },
      { protocol: "https", hostname: "s3.anilist.co", pathname: "/**" },
      { protocol: "https", hostname: "cdn.myanimelist.net", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
