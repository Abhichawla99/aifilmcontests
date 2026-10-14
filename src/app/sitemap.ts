import { MetadataRoute } from 'next'
import { getAllContests } from '@/lib/contests-db'
import { creators } from '@/data/creators'
import { Contest } from '@/data/contests'
import { TOOLS as TOOL_CONTENT } from '@/lib/content/tools'
import { GUIDES as GUIDE_CONTENT } from '@/lib/content/guides'
import { TOPICS as TOPIC_CONTENT } from '@/lib/content/topics'
import { PRIZE_PAGES as PRIZE_CONTENT } from '@/lib/content/prize-pages'
import {
  CLOSING_SOON_WINDOW_DAYS,
  isFree,
  hasCashPrize,
  isRecent,
  isForStudents,
} from '@/lib/contest-filters'

// getAllContests() now reads through a no-store fetch (see src/lib/supabase.ts)
// so new/closed contests show up immediately instead of a cached snapshot.
// Next's static-export path rejects a no-store fetch inside a route that
// isn't marked dynamic, so this route needs it too.
export const dynamic = 'force-dynamic'

const BASE = 'https://aifilmcontests.com'

// Newest updatedAt among a set of contests, or null if none have one. Used so
// a hub page's lastModified reflects when the data it actually shows last
// changed, instead of claiming every page changed at the moment of the
// request (what this file did before 2026-10-14 -- see OPTIMIZER_BACKLOG.md).
function newestUpdatedAt(items: Pick<Contest, 'updatedAt'>[]): Date | null {
  let max: number | null = null
  for (const item of items) {
    if (!item.updatedAt) continue
    const t = new Date(item.updatedAt).getTime()
    if (isNaN(t)) continue
    if (max === null || t > max) max = t
  }
  return max === null ? null : new Date(max)
}

// Latest of several candidate dates (nulls ignored), or `fallback` if none are valid.
function latestOf(dates: (Date | null | undefined)[], fallback: Date): Date {
  const valid = dates.filter((d): d is Date => !!d && !isNaN(d.getTime()))
  if (valid.length === 0) return fallback
  return new Date(Math.max(...valid.map(d => d.getTime())))
}

// Recorded content dates for pages whose own prose/layout -- not live contest
// data -- is what changes. This route is force-dynamic (runs per request on
// Vercel), and the deployed serverless bundle has no .git directory, so a
// live `git log` lookup isn't possible at runtime. These were captured by
// hand with `git log -1 --format=%cI -- <file>` against the full
// (unshallowed) history; whoever next edits one of these pages' content
// should refresh its date here in the same commit.
const RECORDED_DATES = {
  home:          new Date('2026-10-11T12:25:34-06:00'), // src/app/page.tsx
  cinematicAds:  new Date('2026-09-30T12:24:59-06:00'), // src/app/cinematic-ads/page.tsx
  creatorsIndex: new Date('2026-10-04T07:12:15-06:00'), // src/app/creators/page.tsx
  vsPages:       new Date('2026-10-04T07:12:15-06:00'), // src/app/vs/[slug]/page.tsx
}

// Static pages -- homepage, the cinematic-ads landing page, and the creators
// grid. Content here is authored prose/layout, not a live contest listing,
// so lastModified is the page's own recorded content date (see RECORDED_DATES).
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE,
    lastModified: RECORDED_DATES.home,
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE}/cinematic-ads`,
    lastModified: RECORDED_DATES.cinematicAds,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE}/creators`,
    lastModified: RECORDED_DATES.creatorsIndex,
    changeFrequency: 'weekly',
    priority: 0.75,
  },
]

// Category hub pages
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

// AI tool hub pages
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

// Guide pages
const GUIDES = [
  'ai-film-festivals-deadlines-october-2026',
  'ai-film-festivals-deadlines-september-2026',
  'ai-film-festivals-deadlines-august-2026',
  'ai-film-contests-closing-this-week',
  'how-to-submit-to-hong-kong-ai-film-festival-2026',
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
  'ai-film-festivals-deadlines-july-2026',
  'how-to-submit-to-reply-ai-film-festival-2026',
  'how-to-submit-to-berlin-ai-film-festival-2026',
  'how-to-submit-to-astana-ai-film-festival-2026',
  'how-to-submit-to-future-vision-xprize-2026',
  'how-to-win-runway-ai-film-festival',
  'how-to-apply-to-runway-hundred-film-fund-2026',
  'how-to-win-higgsfield-global-film-festival-2026',
  'how-to-win-akool-creator-clash-2026',
  'how-to-submit-to-we-are-human-festival-2026',
  'ai-film-contests-closing-september-30-2026',
  // Craft guides for brand and commercial work (static routes under src/app/guide/)
  'look-bible-for-ai-films',
  'mood-board-for-ai-film-without-copying',
  'ai-commercial-storyboard-and-shot-list',
  'consistent-characters-in-ai-film',
  'product-accuracy-in-ai-commercials',
  'first-frame-for-image-to-video',
  'ai-commercial-packshot-and-end-card',
  'ai-food-and-drink-commercials',
  'real-brands-in-ai-spec-ads',
  'how-to-price-ai-commercial-work',
] as const

// Topic cluster pages
const TOPICS = [
  'ai-film-festival-deadlines-november-december-2026',
  'ai-music-video-contests-2026',
  'ai-commercial-and-advertising-contests-2026',
  'best-ai-film-festivals-for-seedance-users',
  'ai-film-contests-with-cash-prizes',
  'best-ai-film-festivals-for-higgsfield-users',
  'best-ai-film-festivals-for-pika-users',
  'best-ai-film-festivals-for-midjourney-users',
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
  'best-ai-film-festivals-2026-ranked',
  'best-ai-film-festivals-for-runway-users',
  'best-ai-film-festivals-for-veo-users',
  'berlin-ai-film-festival-2026',
  'ai-film-festivals-in-asia-2026',
  'free-ai-film-contests-2026',
  'ai-film-awards-cannes-2026',
  'best-ai-film-festivals-for-kling-users',
  'best-ai-film-festivals-for-luma-users',
  'ai-film-festivals-in-usa-2026',
  'ai-film-festivals-in-europe-2026',
  'ai-film-festivals-in-canada-2026',
  'ai-animation-film-contests-2026',
  'ai-documentary-film-contests-2026',
  'ai-film-jury-and-judges-2026',
  'ai-film-contests-for-students-2026',
  'astana-ai-film-festival-2026',
  'ai-film-festivals-with-distribution-deals',
  'curious-refuge-ai-film-competitions-2026',
  'ai-short-drama-and-series-contests-2026',
  'waiff-world-ai-film-festival-2027',
  'ai-horror-film-contests-2026',
  'pixlight-2026-pixverse-ai-film-contest',
  'ai-film-contests-closing-october-2026',
  'ai-film-festivals-2027',
  'ai-film-festivals-in-latin-america-2026',
  'ai-film-festivals-in-africa-and-middle-east-2026',
  'ai-film-festivals-in-uk-and-london-2026',
  'ai-film-festivals-in-india-2026',
  'ai-film-festivals-in-australia-and-new-zealand-2026',
  'ai-film-festival-circuit-strategy',
  'chroma-awards-season-2-2026',
  'ai-film-festival-entry-fees-2026',
  'artefact-ai-film-festival-2026',
  'ai-film-festivals-in-italy-2026',
] as const

// Comparison pages. VS_PAGES content lives inline in vs/[slug]/page.tsx as
// static prose (no per-slug contest citation -- each vs page just shows a
// generic slice of open contests, not ones tied to the comparison), so these
// use the recorded file date (RECORDED_DATES.vsPages) rather than a contest
// lookup.
const VS_PAGES = [
  'runway-vs-kling',
  'runway-vs-sora',
  'runway-vs-luma',
  'kling-vs-sora',
  'best-ai-video-tools-2026',
] as const

// Location pages
const LOCATIONS = [
  'usa',
  'europe',
  'uk',
  'online',
  'global',
] as const

// Prize tier pages
const PRIZES = [
  'free-entry',
  'high-prize',
  'cash-prizes',
  'grants',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contests = await getAllContests()
  const now      = new Date()

  const openContests = contests.filter(c => c.status === 'open')

  // Individual contest pages -- priority + frequency based on status
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

  // The five open-contest list routes under /contests/ -- each one's real
  // content is exactly the set of contests it lists, so lastModified is the
  // newest updatedAt among those (falls back to now only if that list is
  // currently empty, e.g. during a DB outage), reusing each page's own
  // matching logic (imported) rather than a re-guessed copy.
  const closingSoonCutoff = now.getTime() + CLOSING_SOON_WINDOW_DAYS * 86_400_000
  const closingSoonMatches = openContests.filter(c => {
    const d = new Date(c.deadline).getTime()
    return d >= now.getTime() && d <= closingSoonCutoff
  })
  const freeMatches    = openContests.filter(c => isFree(c.entryFee))
  const cashMatches    = openContests.filter(c => hasCashPrize(c.prize))
  const newMatches     = openContests.filter(c => isRecent(c.createdAt))
  const studentMatches = openContests.filter(c => isForStudents(c.eligibility))

  const contestListUrls: MetadataRoute.Sitemap = [
    {
      url:             `${BASE}/contests/closing-soon`,
      lastModified:    latestOf([newestUpdatedAt(closingSoonMatches)], now),
      changeFrequency: 'daily',
      priority:        0.85,
    },
    {
      url:             `${BASE}/contests/free`,
      lastModified:    latestOf([newestUpdatedAt(freeMatches)], now),
      changeFrequency: 'daily',
      priority:        0.8,
    },
    {
      url:             `${BASE}/contests/cash-prizes`,
      lastModified:    latestOf([newestUpdatedAt(cashMatches)], now),
      changeFrequency: 'daily',
      priority:        0.8,
    },
    {
      url:             `${BASE}/contests/new`,
      lastModified:    latestOf([newestUpdatedAt(newMatches)], now),
      changeFrequency: 'daily',
      priority:        0.8,
    },
    {
      url:             `${BASE}/contests/student`,
      lastModified:    latestOf([newestUpdatedAt(studentMatches)], now),
      changeFrequency: 'daily',
      priority:        0.8,
    },
  ]

  // Category hub pages -- newest updatedAt among contests actually tagged
  // with this category.
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map(slug => {
    const matching = contests.filter(c => c.categories?.includes(slug))
    return {
      url:             `${BASE}/categories/${slug}`,
      lastModified:    latestOf([newestUpdatedAt(matching)], now),
      changeFrequency: 'daily',
      priority:        0.78,
    }
  })

  // AI tool hub pages -- same matching logic as tools/[slug]/page.tsx itself
  // (imported TOOL_CONTENT's matchTerms, not a re-guessed copy).
  const toolUrls: MetadataRoute.Sitemap = TOOLS.map(slug => {
    const tool = TOOL_CONTENT[slug]
    const matching = tool
      ? contests.filter(c => {
          const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
          return tool.matchTerms.some(t => toolsStr.includes(t)) ||
            toolsStr.includes('any ai tools') ||
            toolsStr.includes('any generative')
        })
      : []
    return {
      url:             `${BASE}/tools/${slug}`,
      lastModified:    latestOf([newestUpdatedAt(matching)], now),
      changeFrequency: 'weekly',
      priority:        0.72,
    }
  })

  // Guide pages -- each guide cites specific contests via featuredContestIds
  // and (usually) carries its own datePublished; lastModified is whichever is
  // newer, since either a contest update or a prose edit counts as a change.
  const guideUrls: MetadataRoute.Sitemap = GUIDES.map(slug => {
    const g = GUIDE_CONTENT[slug]
    const cited = g?.featuredContestIds?.length
      ? contests.filter(c => g.featuredContestIds!.includes(c.id))
      : []
    const published = g?.datePublished ? new Date(g.datePublished) : null
    return {
      url:             `${BASE}/guide/${slug}`,
      lastModified:    latestOf([published, newestUpdatedAt(cited)], now),
      changeFrequency: 'monthly',
      priority:        0.70,
    }
  })

  // Topic cluster pages -- same idea as guides, but TopicData has no
  // datePublished field, so this is just the cited contests' freshness.
  const topicUrls: MetadataRoute.Sitemap = TOPICS.map(slug => {
    const t = TOPIC_CONTENT[slug]
    const cited = t?.featuredContestIds?.length
      ? contests.filter(c => t.featuredContestIds!.includes(c.id))
      : []
    return {
      url:             `${BASE}/topics/${slug}`,
      lastModified:    latestOf([newestUpdatedAt(cited)], now),
      changeFrequency: 'monthly',
      priority:        0.68,
    }
  })

  // Comparison pages -- recorded file date (see RECORDED_DATES.vsPages).
  const vsUrls: MetadataRoute.Sitemap = VS_PAGES.map(slug => ({
    url:             `${BASE}/vs/${slug}`,
    lastModified:    RECORDED_DATES.vsPages,
    changeFrequency: 'monthly',
    priority:        0.66,
  }))

  // Location pages -- every location page shows the same "all open +
  // upcoming" set today (location/[slug]/page.tsx doesn't actually filter by
  // geography; see its own comment there), so each gets the same real
  // newest-update date instead of "now", which is at least honest about when
  // that set last changed.
  const locationMatches = contests.filter(c => c.status === 'open' || c.status === 'upcoming')
  const locationUrls: MetadataRoute.Sitemap = LOCATIONS.map(slug => ({
    url:             `${BASE}/location/${slug}`,
    lastModified:    latestOf([newestUpdatedAt(locationMatches)], now),
    changeFrequency: 'weekly',
    priority:        0.65,
  }))

  // Featured creator profiles -- newest updatedAt among the contests this
  // creator is linked to, or their featuredSince date if none / not found.
  const creatorUrls: MetadataRoute.Sitemap = creators.map(c => {
    const cited = c.contests?.length
      ? contests.filter(row => c.contests!.includes(row.id))
      : []
    const since = c.featuredSince ? new Date(c.featuredSince) : null
    return {
      url:             `${BASE}/creators/${c.slug}`,
      lastModified:    latestOf([since, newestUpdatedAt(cited)], now),
      changeFrequency: 'monthly',
      priority:        0.6,
    }
  })

  // Prize tier pages -- reuse each page's own filterFn directly (imported
  // from prize/[slug]/page.tsx) so this never drifts out of sync with it.
  const prizeUrls: MetadataRoute.Sitemap = PRIZES.map(slug => {
    const p = PRIZE_CONTENT[slug]
    const matched = p ? contests.filter(p.filterFn) : []
    return {
      url:             `${BASE}/prize/${slug}`,
      lastModified:    latestOf([newestUpdatedAt(matched)], now),
      changeFrequency: 'weekly',
      priority:        0.65,
    }
  })

  return [
    // Static pages first (highest crawl priority)
    ...STATIC_PAGES,
    ...contestListUrls,

    // Category & tool hubs (frequently updated, important for SEO)
    ...categoryUrls,
    ...toolUrls,

    // Editorial & SEO hub pages
    ...guideUrls,
    ...topicUrls,
    ...vsUrls,
    ...locationUrls,
    ...prizeUrls,
    ...creatorUrls,

    // Individual contest pages (largest set, sorted: open > upcoming > closed)
    ...contestUrls.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
  ]
}
