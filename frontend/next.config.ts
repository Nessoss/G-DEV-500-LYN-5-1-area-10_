import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'http://server:3000/:path*'  // En production Docker (communication entre containers)
          : 'http://localhost:8080/:path*',  // En développement local
      },
    ];
  },
};

export default nextConfig;
