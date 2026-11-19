# Ecosphere Solutions website

Marketing website for Ecosphere Solutions Limited, an environmental consultancy in Dar es Salaam, Tanzania.
English at `/`, Swahili at `/sw`.

- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl, MDX for news, Zod, Resend (email).
- **Hosting:** Vercel.

## Run it locally

Needs Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
```

Without a Resend key the contact form still works on your machine: the request is printed in the terminal
instead of being emailed.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Checks English and Swahili messages have the same keys |
| `npm run brand:assets` | Rebuilds logo, favicon and share image from the logo PDF (needs `poppler`) |
| `node scripts/prepare-media.mjs` | Rebuilds site photos and video clips from the client's folder (needs `ffmpeg`) |

## Environment variables

See `.env.example` for the full list with notes.

| Name | Needed | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Site address for canonical links, sitemap and share images |
| `RESEND_API_KEY` | Yes, for the form | Resend API key |
| `CONTACT_TO_EMAIL` | Yes, for the form | Inbox that receives requests |
| `CONTACT_FROM_EMAIL` | Optional | Sender address (must be on a domain verified in Resend) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Email shown on the site |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Optional | `vercel`, `plausible`, or empty for none |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Only for Plausible | Site domain registered in Plausible |

## Where to edit content

| What | Where |
| --- | --- |
| Page text and interface labels | `messages/en.json`, `messages/sw.json` |
| Contact details, navigation | `content/site.ts` |
| Services | `content/services.ts` |
| Sectors | `content/sectors.ts` |
| Leadership team | `content/leadership.ts` |
| Project case studies | `content/projects.ts` |
| Photos and video clips | `content/media.ts` (files in `public/images`, `public/videos`) |
| News articles | `content/news/en/*.mdx`, `content/news/sw/*.mdx` |

To add a news article, copy a file in `content/news/en/`, change the `frontmatter` at the top and write below it.
Add the Swahili version with the same file name in `content/news/sw/`. Remove `placeholder: true` to publish.

Outstanding content is listed in `CONTENT_TODO.md`. Swahili terms to review are in `TRANSLATION_NOTES.md`.
Image sources are in `IMAGE_CREDITS.md`.

## How it is put together

```
app/[locale]/        Pages (one folder per page), layout, RSS feed
app/sitemap.ts       sitemap.xml        app/robots.ts   robots.txt
components/layout    Header, footer, language and theme switches, WhatsApp button, scroll effects, moving background
components/sections  Home page sections (hero video, about, services, sectors, how we work, field photos), page banners, call to action
components/cards     Service, sector and leadership cards
components/contact   Contact form
content/             All editable content, typed, in both languages
i18n/                Language routing (next-intl)
lib/                 SEO helpers, structured data, news loader, contact form logic
messages/            Interface text: en.json, sw.json
proxy.ts             Serves English at "/" and Swahili at "/sw"
```

### Look, themes and motion
The site has a light theme (the default) and a dark theme, switched with the sun/moon button in the header
(`components/layout/ThemeToggle.tsx`). The choice is remembered in the visitor's browser. The colours of both
themes are at the top of `app/globals.css`. Anything placed on a photograph or film gets the class `on-dark`
so its text stays light in both themes.

All movement is in `app/globals.css` and two small scripts, with no animation library:
- `components/layout/LivingBackground.tsx`: the film behind every page, a real drone flight over savanna
  towards a volcano. It does not play by itself: scrolling flies the camera (down = forward, up = back),
  while the page scrolls normally and nothing is pinned. The still picture shows first; the film loads after
  the page (about 3.4 MB on computers, 1.7 MB on phones) and is skipped on data-saver or 2G connections.
  A veil over the film keeps text readable (pale in the light theme, dark in the dark theme).
- `components/layout/ScrollEffects.tsx`: sections fade up as they scroll into view, and pictures in banners
  move a little slower than the page.
- The opening of the home page ("Opening of the home page" in `globals.css`, markup in
  `components/sections/HomeHero.tsx`): the logo on a plain screen, then the camera sweeps back from the clouds
  on the volcano to the whole forest and the headline comes into focus. It plays once per visit.

On the home page, the Services panel and the Sector pictures react to the pointer with plain CSS
(see "Services panel" and "Sector pictures" in `globals.css`).

Visitors who ask their device for reduced motion get a still page. Without JavaScript the page reads normally.

### Contact form
`lib/contact/` holds the validation rules (shared by browser and server), the server action, a basic
rate limit (5 requests per visitor in 10 minutes, kept in memory) and the Resend call. A hidden honeypot
field catches simple bots. For stricter limits on a busy site, move the rate limit to a shared store
such as Upstash Redis.

### SEO
Every page sets its title, description, canonical link, hreflang (en, sw, x-default), Open Graph and Twitter
tags through `lib/seo.ts`. Structured data: Organization and LocalBusiness on every page, Service on service
pages, Article on news articles. Placeholder news is kept out of search engines automatically.

## Deploy to Vercel

1. Put the code on GitHub (or GitLab / Bitbucket):
   ```bash
   git remote add origin <your repository address>
   git push -u origin main
   ```
2. In Vercel choose **Add New > Project**, import the repository and keep the defaults (framework: Next.js).
3. Under **Environment Variables** add at least `NEXT_PUBLIC_SITE_URL` (the final address, for example
   `https://www.your-domain.com`), `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and, once the domain is verified in
   Resend, `CONTACT_FROM_EMAIL`.
4. Click **Deploy**.
5. Under **Settings > Domains** add the domain and follow the DNS instructions.
6. In Resend, verify the sending domain (**Domains > Add domain**), then set `CONTACT_FROM_EMAIL`
   to an address on it, for example `Ecosphere Solutions <website@your-domain.com>`, and redeploy.
7. Optional: enable **Web Analytics** in the Vercel project and set `NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel`.
8. After launch, submit `https://www.your-domain.com/sitemap.xml` in Google Search Console.

Each push to the main branch triggers a new Vercel build, so push finished work in one go.

## Checks before a release

```bash
npm run lint && npm run check:i18n && npm run build
```

Lighthouse (mobile, production build, 19 November 2026): Performance 92 to 100 (home page 100),
Accessibility 100, Best Practices 100, SEO 100.
