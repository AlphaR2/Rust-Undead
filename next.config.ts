import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["gateway.pinata.cloud"], // Add the allowed image hostnames here
  },
};

export default nextConfig;
