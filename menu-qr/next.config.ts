import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async headers() {
    return [
      {
        source: '/:path*', // applies to everything
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
};

export default nextConfig;
