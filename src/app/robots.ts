import { MetadataRoute } from 'next'

const BASE = 'https://aifilmcontests.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All good bots: full access
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // no reason to crawl API routes
          '/admin',     // keep admin dashboard out of index
          '/_next/',    // Next.js internals
        ],
      },
      {
        // GPTBot / AI training crawlers — disallow by default
        // Remove this block if you want AI training on your content
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host:    BASE,
  }
}
