import type { NextConfig } from 'next';

const nestApiUrl = process.env.NEST_API_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    if (!nestApiUrl) return [];
    // Uploaded shop logos and product photos live on Nest (`/uploads/...`); serve them same-origin.
    return [{ source: '/uploads/:path*', destination: `${nestApiUrl}/uploads/:path*` }];
  },
};

export default nextConfig;
