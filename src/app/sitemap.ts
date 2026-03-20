import { MetadataRoute } from 'next'
import { getAllContests } from '@/lib/contests-db'

const BASE_URL = 'https://aifilmcontests.com'

const CATEGORY_SLUGS = [
  'short-film', 'animation', 'feature', 'documentary',
  'experimental', 'music-video', 'commercial', 'advertising',
]

const TOOL_SLUGS = ['runway', 'kling', 'luma', 'hailuo', 'pika', 'sora']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contests = await getAllContests()

  const contestUrls: MetadataRoute.Sitemap = contests.map(c => ({
    url: `${BASE_URL}/contests/${c.id}`,
    lastModified: new Date(),
    changeFrequency: c.status === 'open' ? 'daily' : 'weekly',
    priority: c.status === 'open' ? 0.9 : c.status === 'upcoming' ? 0.7 : 0.4,
  }))

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const toolUrls: MetadataRoute.Sitemap = TOOL_SLUGS.map(slug => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryUrls,
    ...toolUrls,
    ...contestUrls,
  ]
}
