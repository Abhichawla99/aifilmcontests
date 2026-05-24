import { MetadataRoute } from 'next'
import { getAllContests } from '@/lib/contests-db'

const BASE = 'https://aifilmcontests.com'

// ââ Static pages âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// Add new static routes here as the site grows.
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE,
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE}/cinematic-ads`,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
]

// ââ Category hub pages ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const CATEGORIES = [
  'short-film',
  'animation',
  'feature',
  'documentary',
  'experimental',
  'music-video',
  'commercial',
  'advertising',
] as const

// ââ AI tool hub pages âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TOOLS = [
  'runway',
  'kling',
  'luma',
  'hailuo',
  'pika',
  'sora',
  'midjourney',
  'stable-diffusion',
  'heygen',
  'adobe-firefly',
  'elevenlabs',
  'capcut',
  'topaz',
  'invideo',
] as const

// ââ Guide pages âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const GUIDES = [
  'how-to-enter-ai-film-contest',
  'ai-filmmaking-tools-guide',
  'winning-strategies-ai-film-competitions',
  'ai-video-production-workflow',
  'ai-film-submission-tips',
  'ai-film-festivals-explained',
  'generative-ai-filmmaking-2026',
  'ai-brand-film-guide',
  'building-ai-film-portfolio',
  'ai-film-post-production',
  'ai-film-festivals-deadlines-june-2026',
] as const

// ââ Topic cluster pages âââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TOPICS = [
  'text-to-video-filmmaking',
  'generative-ai-narrative',
  'ai-visual-effects',
  'ai-cinematography',
  'ai-brand-storytelling',
  'synthetic-media-art',
  'ai-film-festivals-2026',
  'ai-documentary-making',
  'ai-animation-production',
  'ai-commercial-production',
  'ai-film-festivals-with-million-dollar-prizes',
  'best-ai-film-festivals-for-sora-users',
] as const

// ââ Comparison pages ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const VS_PAGES = [
  'runway-vs-kling',
  'runway-vs-sora',
  'runway-vs-luma',
  'kling-vs-sora',
  'best-ai-video-tools-2026',
] as const

// ââ Location pages ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const LOCATIONS = [
  'usa',
  'europe',
  'uk',
  'online',
  'global',
] as const

// ââ Prize tier pages ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const PRIZES = [
  'free-entry',
  'high-prize',
  'cash-prizes',
  'grants',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contests = await getAllContests()
  const now      = new Date()

  // Individual contest pages â priority + frequency based on status
  const contestUrls: MetadataRoute.Sitemap = contests.map(c => {
    const isOpen     = c.status === 'open'
    const isUpcoming = c.status === 'upcoming'

    // Use deadline as last-modified proxy; fall back to today
    const lastMod = isOpen
      ? now                          // refresh daily while open
      : c.deadline
        ? new Date(c.deadline)
        : now

    return {
      url:             `${BASE}/contests/${c.id}`,
      lastModified:    lastMod,
      changeFrequency: isOpen ? 'daily' : isUpcoming ? 'weekly' : 'monthly',
      priority:        isOpen ? 0.9 : isUpcoming ? 0.7 : 0.35,
    }
  })

  // Category hub pages
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map(slug => ({
    url:             `${BASE}/categories/${slug}`,
    lastModified:    now,
    changeFrequency: 'daily',
    priority:        0.78,
  }))

  // AI tool hub pages
  const toolUrls: MetadataRoute.Sitemap = TOOLS.map(slug => ({
    url:             `${BASE}/tools/${slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.72,
  }))

  // Guide pages
  const guideUrls: MetadataRoute.Sitemap = GUIDES.map(slug => ({
    url:             `${BASE}/guide/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.70,
  }))

  // Topic cluster pages
  const topicUrls: MetadataRoute.Sitemap = TOPICS.map(slug => ({
    url:             `${BASE}/topics/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.68,
  }))

  // Comparison pages
  const vsUrls: MetadataRoute.Sitemap = VS_PAGES.map(slug => ({
    url:             `${BASE}/vs/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.66,
  }))

  // Location pages
  const locationUrls: MetadataRoute.Sitemap = LOCATIONS.map(slug => ({
    url:             `${BASE}/location/${slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.65,
  }))

  // Prize tier pages
  const prizeUrls: MetadataRoute.Sitemap = PRIZES.map(slug => ({
    url:             `${BASE}/prize/${slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.65,
  }))

  return [
    // Static pages first (highest crawl priority)
    ...STATIC_PAGES.map(p => ({ ...p, lastModified: now })),

    // Category & tool hubs (frequently updated, important for SEO)
    ...categoryUrls,
    ...toolUrls,

    // Editorial & SEO hub pages
    ...guideUrls,
    ...topicUrls,
    ...vsUrls,
    ...locationUrls,
    ...prizeUrls,

    // Individual contest pages (largest set, sorted: open â upcoming â closed)
    ...contestUrls.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
  ]
}
