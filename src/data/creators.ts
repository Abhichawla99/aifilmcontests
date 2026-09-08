export type CreatorType = 'studio' | 'filmmaker'

export interface CreatorWorkLink {
  /** Title of the piece, as the creator titles it on their own site. */
  title: string
  /** Public URL where the work can be watched. */
  url: string
  /** Client or context, when the creator states one. Omit rather than guess. */
  client?: string
}

export interface Creator {
  slug: string
  name: string
  type: CreatorType
  /** City, region or "Remote" — as stated on their own site. */
  location: string
  /** Their own website. Rendered as a normal dofollow link on the profile. */
  website: string
  /** One line, under ~120 characters, used on the /creators grid. */
  oneLiner: string
  /** Two or three sentences. Every claim must be verifiable on their own site. */
  bio: string
  tags: string[]
  workLinks: CreatorWorkLink[]
  /** Contest ids from the directory this creator has entered or won, if verified. */
  contests?: string[]
  /** ISO date this profile went live. */
  featuredSince: string
}

/**
 * Every profile here is written from the creator's own public website.
 * No hype, no numbers we cannot point at. If a fact is not on their site, it does not go in.
 */
export const creators: Creator[] = [
  {
    slug: 'ruminate-x',
    name: 'Ruminate X',
    type: 'studio',
    location: 'Calgary, Alberta, Canada',
    website: 'https://ruminatex.com',
    oneLiner: 'Cinematic story studio making brand films and story-driven AI commercials.',
    bio:
      'Ruminate X is an AI video production studio based in Calgary, Alberta, working with brands in North America, the UK, Australia and beyond. ' +
      'It makes cinema-grade brand films, AI commercials, fashion and lifestyle content, product launch videos and social content, treating each brief as a film production rather than a video shoot. ' +
      'The studio was founded in 2024 and also builds and runs AI Film Contests.',
    tags: ['brand-films', 'ai-commercials', 'fashion', 'social-content', 'calgary'],
    workLinks: [
      { title: 'Calgary Stampede 2026', url: 'https://www.youtube.com/watch?v=d-s9SxA4Klk', client: 'Calgary Stampede' },
      { title: 'The Love of Trail Running', url: 'https://www.youtube.com/watch?v=LYA3Do3KEN0', client: 'Ruminate X' },
      { title: 'Keen Footwear — Spec Ad', url: 'https://www.youtube.com/watch?v=Zytga7zsShI', client: 'Keen Footwear' },
      { title: 'Keen Hiking Shoes', url: 'https://www.youtube.com/watch?v=zJgXuxFGU0U', client: 'Keen Footwear' },
    ],
    featuredSince: '2026-09-08',
  },
]

export function getCreator(slug: string): Creator | undefined {
  return creators.find(c => c.slug === slug)
}

export const creatorSlugs = creators.map(c => c.slug)
