import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Serves English at "/" and Swahili at "/sw".
export default createMiddleware(routing);

export const config = {
  // Run on pages (and the news feeds), not on API routes, Next internals or files.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/news/feed.xml', '/sw/news/feed.xml'],
};
