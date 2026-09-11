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
        // LLM/AI crawlers — explicitly welcome. /llms.txt and every contest,
        // guide and comparison page is written to be cited, not guessed.
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'meta-externalagent'],
        allow: '/',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host:    BASE,
  }
}
