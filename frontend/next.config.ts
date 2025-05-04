import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.lenscrafters.com',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
      {
        protocol: 'https',
        hostname: 'img.drz.lazcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn11.bigcommerce.com',
      },
      {
        protocol: 'https',
        hostname: 'res.ygstatic.com',
      },
       {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
       {
        protocol: 'https',
        hostname: 'www.bonlook.ca',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      // Add other patterns if needed
    ],
  },
  /* other config options here */
};

export default nextConfig;
