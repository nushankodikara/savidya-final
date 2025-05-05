import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    unoptimized: true,
    domains: [
      'assets.lenscrafters.com',
      'i5.walmartimages.com',
      'img.drz.lazcdn.com',
      'cdn11.bigcommerce.com',
      'res.ygstatic.com',
      'm.media-amazon.com',
      'www.bonlook.ca',
      'encrypted-tbn0.gstatic.com'
    ]
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
