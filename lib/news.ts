import fs from 'node:fs';
import path from 'node:path';
import type { ComponentType } from 'react';
import type { Locale } from '@/content/types';

// News articles are MDX files in /content/news/<language>/<slug>.mdx.
// Each file starts with:  export const frontmatter = { title, date, excerpt }
// The English file decides which articles exist; a missing Swahili file
// falls back to the English text.

export type NewsFrontmatter = {
  title: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  excerpt: string;
  /** Placeholder drafts are labelled on the site and hidden from search engines and the RSS feed. */
  placeholder?: boolean;
};

export type NewsEntry = NewsFrontmatter & { slug: string };

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

export function getNewsSlugs(): string[] {
  return fs
    .readdirSync(path.join(NEWS_DIR, 'en'))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export async function getArticle(locale: Locale, slug: string) {
  if (!getNewsSlugs().includes(slug)) return null;

  const language = fs.existsSync(path.join(NEWS_DIR, locale, `${slug}.mdx`)) ? locale : 'en';
  const article = (await import(`@/content/news/${language}/${slug}.mdx`)) as {
    default: ComponentType;
    frontmatter: NewsFrontmatter;
  };

  return { slug, Content: article.default, ...article.frontmatter };
}

/** All articles, newest first. */
export async function getAllNews(locale: Locale): Promise<NewsEntry[]> {
  const articles = await Promise.all(getNewsSlugs().map((slug) => getArticle(locale, slug)));

  return articles
    .filter((article) => article !== null)
    .map(({ slug, title, date, excerpt, placeholder }) => ({ slug, title, date, excerpt, placeholder }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
