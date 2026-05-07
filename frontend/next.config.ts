import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// IMPORTANT: rewrites() destinations are baked into routes-manifest.json at
// `next build` time, NOT re-evaluated at runtime. So this env var must be
// resolvable when the production image is being built (in CI) — it is, because
// `next build` sets NODE_ENV=production automatically and we default to the
// Docker service name. For local dev (`npm run dev`) NODE_ENV=development and
// we default to localhost where `cargo run` listens.
const backendInternalUrl =
  process.env.BACKEND_INTERNAL_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://backend:8080' : 'http://localhost:8080');

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
