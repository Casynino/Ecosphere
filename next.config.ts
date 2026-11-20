import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Photo backgrounds sit under a colour wash, so they can be compressed harder.
    qualities: [45, 60, 75],
  },
  // Old addresses that moved, so links already shared keep working.
  async redirects() {
    return [
      { source: '/services/environmental-conservation', destination: '/services/climate-change-decarbonisation', permanent: true },
      { source: '/sw/services/environmental-conservation', destination: '/sw/services/climate-change-decarbonisation', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(withMDX(nextConfig));
