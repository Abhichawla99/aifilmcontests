/** Rows store freeform category text (title case, synonyms, genre tags, award
    names). The eight keys above are the only slugs the category pages and the
    browse filters group by. Map the clear, unambiguous synonyms here so a row
    isn't invisible on its own category page just because it says "Advertisement"
    instead of "advertising" — but leave anything genuinely ambiguous (a genre
    like "drama", a format like "AR/VR/XR") unmapped rather than guessing. */
const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  animated: 'animation',
  'animation film': 'animation',
  'ai animation film': 'animation',
  advertisement: 'advertising',
  advertisements: 'advertising',
  ads: 'advertising',
  'live action short': 'short-film',
  short: 'short-film',
  shorts: 'short-film',
  'ai shorts': 'short-film',
  'feature film': 'feature',
  'feature-film': 'feature',
  'long film': 'feature',
  'ai long film': 'feature',
  commercials: 'commercial',
  'brand film': 'commercial',
  music: 'music-video',
  'ai music': 'music-video',
  song: 'music-video',
  'experimental film': 'experimental',
}

/** Normalize one row's category string to a canonical slug, or null if it
    doesn't clearly match any of the eight. Case/whitespace-insensitive, and
    strips a leading "AI " since that's a prefix on the format, not a different
    category ("AI Short Film" / "ai music video" both still match). */
export function normalizeCategorySlug(raw: string): string | null {
  const key = raw.toLowerCase().trim().replace(/^ai[\s-]+/, '')
  if (!key) return null
  const hyphenated = key.replace(/\s+/g, '-')
  if (CATEGORIES[hyphenated]) return hyphenated
  if (CATEGORY_SLUG_ALIASES[key]) return CATEGORY_SLUG_ALIASES[key]
  if (CATEGORY_SLUG_ALIASES[hyphenated]) return CATEGORY_SLUG_ALIASES[hyphenated]
  return null
}

/** Does this contest belong on the given category slug's page? */
export function contestHasCategorySlug(categories: string[] | undefined, slug: string): boolean {
  return (categories ?? []).some(c => normalizeCategorySlug(c) === slug)
}

export const CATEGORIES: Record<string, { label: string; description: string; keywords: string }> = {
  'short-film': {
    label: 'AI Short Film',
    description: 'Competitions for AI-generated short films under 40 minutes. The most active category in AI filmmaking — from 48-hour sprints to prestigious festival submissions.',
    keywords: 'AI short film contest, AI film competition, generative AI short film festival 2026',
  },
  'animation': {
    label: 'AI Animation',
    description: 'Competitions specifically for AI-generated animation — from 2D character animation to fully synthetic worlds. Tools like Runway, Kling, and Pika are reshaping the format.',
    keywords: 'AI animation contest, AI animated film competition, generative animation festival 2026',
  },
  'feature': {
    label: 'AI Feature Film',
    description: 'Competitions for longer-format AI films (typically 40+ minutes). Fewer than short film categories but growing fast as generation quality improves.',
    keywords: 'AI feature film competition, AI generated feature film contest 2026',
  },
  'documentary': {
    label: 'AI Documentary',
    description: 'Competitions for AI-assisted documentaries — films that use generative AI for visuals, narration, or reconstruction while exploring real-world subjects.',
    keywords: 'AI documentary competition, generative AI documentary film festival 2026',
  },
  'experimental': {
    label: 'Experimental AI Film',
    description: 'The frontier of AI filmmaking. Competitions that celebrate boundary-pushing work — non-narrative, abstract, hybrid, and formally inventive AI films.',
    keywords: 'experimental AI film competition, avant-garde AI film festival, generative art film contest 2026',
  },
  'music-video': {
    label: 'AI Music Video',
    description: 'Competitions for AI-generated music videos. A fast-growing category as artists and labels explore generative visuals synced to music.',
    keywords: 'AI music video contest, generative AI music video competition 2026',
  },
  'commercial': {
    label: 'AI Commercial',
    description: 'Competitions for AI-generated advertising and branded content. The Luma Dream Brief ($1M) put this category on the map in 2026.',
    keywords: 'AI commercial contest, AI advertising competition, generative AI brand film 2026',
  },
  'advertising': {
    label: 'AI Advertising',
    description: 'Open calls for AI-generated advertising creative — spots, campaigns, and branded films where AI plays a central production role.',
    keywords: 'AI advertising contest, AI ad film competition, generative AI creative award 2026',
  },
}
