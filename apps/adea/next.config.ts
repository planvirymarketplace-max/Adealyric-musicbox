import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const musicboxUrl = process.env.NEXT_PUBLIC_MUSICBOX_URL || 'http://localhost:3001';
    return [
      {
        source: '/artists/:path*',
        destination: `${musicboxUrl}/artists/:path*`,
      },
      {
        source: '/labels/:path*',
        destination: `${musicboxUrl}/labels/:path*`,
      },
      {
        source: '/sync-agents/:path*',
        destination: `${musicboxUrl}/sync-agents/:path*`,
      },
    ];
  },
};

export default nextConfig;
