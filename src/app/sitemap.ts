import { MetadataRoute } from 'next'
import { getAllContests } from '@/lib/contests-db'

const BASE_URL = 'https://aifilmcontests.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contests = await getAllContests()

  const contestUrls: MetadataRoute.Sitemap = contests.map(c => ({
    url: `${BASE_URL}/contests/${c.id}`,
    lastModified: new Date(),
    changeFrequency: c.status === 'open' ? 'daily' : 'weekly',
    priority: c.status === 'open' ? 0.9 : c.status === 'upcoming' ? 0.7 : 0.4,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...contestUrls,
  ]
}
