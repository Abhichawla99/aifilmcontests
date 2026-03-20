import { MetadataRoute } from 'next'
import { getAllContests } from '@/lib/contests-db'

const BASE = 'https://aifilmcontests.com'

// ── Static pages ─────────────────────────────────────────────────────────────
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

// ── Category hub pages ────────────────────────────────────────────────────────
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

// ── AI tool hub pages ─────────────────────────────────────────────────────────
const TOOLS = [
  'runway',
  'kling',
  'luma',
  'hailuo',
  'pika',
  'sora',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contests = await getAllContests()
  const now      = new Date()

  // Individual contest pages — priority + frequency based on status
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

  return [
    // Static pages first (highest crawl priority)
    ...STATIC_PAGES.map(p => ({ ...p, lastModified: now })),

    // Category & tool hubs (frequently updated, important for SEO)
    ...categoryUrls,
    ...toolUrls,

    // Individual contest pages (largest set, sorted: open → upcoming → closed)
    ...contestUrls.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
  ]
}
