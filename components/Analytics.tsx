import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import Script from 'next/script';

/**
 * Cookie-free analytics, chosen with NEXT_PUBLIC_ANALYTICS_PROVIDER:
 *   "vercel"    - Vercel Web Analytics (enable it in the Vercel dashboard too)
 *   "plausible" - Plausible (also set NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
 *   unset       - no analytics
 * Neither option sets cookies, so no consent banner is needed.
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === 'vercel') return <VercelAnalytics />;

  if (provider === 'plausible' && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return (
      <Script
        src="https://plausible.io/js/script.js"
        data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
