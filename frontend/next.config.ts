import type { NextConfig } from 'next';

const nestApiUrl = process.env.NEST_API_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    if (!nestApiUrl) return [];
    // Shop logos live on Nest (`/uploads/shops/...`); serve them same-origin.
    return [{ source: '/uploads/:path*', destination: `${nestApiUrl}/uploads/:path*` }];
  },
};

export default nextConfig;
