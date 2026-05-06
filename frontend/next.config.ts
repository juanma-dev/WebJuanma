import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Resolved at runtime by the Node server (not baked into the client bundle).
// In Docker compose this is set to http://backend:8080 (internal DNS).
// In local dev it falls back to http://localhost:8080 (your `cargo run` instance).
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
