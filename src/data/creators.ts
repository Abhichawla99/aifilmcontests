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
    website: 'https://www.ruminatex.com',
    oneLiner: 'Cinematic story studio making brand films and story-driven AI commercials.',
    bio:
      'Ruminate X is an AI film studio that makes brand films and AI commercials for brands across the United States, its main market, and Canada: consumer brands, pharma and pharmacy companies, labs, medical companies and other businesses. It is based in Calgary, Alberta. ' +
      'Every frame is made with generative AI; people write, board, edit, mix and grade every film. Brand films and commercials start at US$5,000 and are quoted from the brief. ' +
      'Abhi Chawla founded the studio in 2024. AI Film Contests is run by the same creative group, so read this profile as a disclosure, not a review.',
    tags: ['brand-films', 'ai-commercials', 'fashion', 'social-content', 'calgary'],
    workLinks: [
      { title: 'Calgary Stampede 2026', url: 'https://www.youtube.com/watch?v=d-s9SxA4Klk', client: 'Calgary Stampede' },
      { title: 'The Love of Trail Running', url: 'https://www.youtube.com/watch?v=LYA3Do3KEN0', client: 'Ruminate X' },
      { title: 'Keen Footwear — Spec Ad', url: 'https://www.youtube.com/watch?v=Zytga7zsShI', client: 'Keen Footwear' },
      { title: 'Keen Hiking Shoes', url: 'https://www.youtube.com/watch?v=zJgXuxFGU0U', client: 'Keen Footwear' },
    ],
    featuredSince: '2026-09-08',
  },
  {
    slug: 'ariel-kotzer',
    name: 'Ariel Kotzer',
    type: 'filmmaker',
    location: 'Jerusalem, Israel',
    website: 'https://arielko.myportfolio.com',
    oneLiner: 'AI artist and filmmaker working "non-prompting" — minimal prompts, more room for the machine.',
    bio:
      'Ariel Kotzer (K&CO) is a Jerusalem-based designer, AI artist and filmmaker known for a self-described "non-prompting" approach: keeping prompts to a bare minimum so AI tools like Midjourney, Runway and Seedance have more creative freedom. ' +
      'His film Field Notes, built from a conversation with ChatGPT about its own existence, won Best Experimental at the Rome AI Festival (RAIF) 2026. ' +
      'His other AI film work includes a music video for Peter Gabriel\'s 5050 initiative and an ongoing "fragile" series.',
    tags: ['ai-film', 'non-prompting', 'experimental', 'jerusalem', 'music-videos'],
    workLinks: [
      { title: 'Field Notes', url: 'https://arielko.myportfolio.com/field-notes' },
      { title: 'The Human Race', url: 'https://arielko.myportfolio.com/the-human-race' },
      { title: 'Peter Gabriel: And Still', url: 'https://arielko.myportfolio.com/pg-as', client: "Peter Gabriel's 5050 initiative" },
    ],
    contests: ['rome-ai-festival-2026'],
    featuredSince: '2026-09-11',
  },
  {
    slug: 'mathery',
    name: 'Mathery',
    type: 'studio',
    location: 'Milan, Italy & Brooklyn, New York, USA',
    website: 'https://mathery.it',
    oneLiner: 'Italian directing duo whose AI short "Where Knights Fall" took Silver at the Runway AI Film Festival.',
    bio:
      'Mathery is Erika Zorzi and Matteo Sangalli, an Italian directing duo based between Milan and Brooklyn, working across film, photography, and object and space design. ' +
      'Young Gun winners with a commercial client roster that includes Samsung, Amex, Delta, Klarna and IKEA, they also make independent work like Where Knights Fall, a Rapunzel story that won Silver at the Runway AI Film Festival 2026 and was an Official Selection at GIFF.',
    tags: ['ai-film', 'directing-duo', 'milan', 'brooklyn', 'commercial'],
    workLinks: [
      { title: 'Where Knights Fall', url: 'https://mathery.it/project/where-knights-fall-ai/' },
    ],
    contests: ['runway-aif-2026'],
    featuredSince: '2026-10-02',
  },
  {
    slug: 'robert-gaudette',
    name: 'Robert Gaudette',
    type: 'filmmaker',
    location: 'Welland, Ontario, Canada',
    website: 'https://robertgaudette.com',
    oneLiner: 'Canadian AI filmmaker whose short "A Face Only A Mother Could Love" won the Grand Prix at the Runway AI Film Festival.',
    bio:
      'Robert Gaudette is a Canadian filmmaker, AI creative technologist, author and former photographer based in Welland, Ontario, and the founder of Nolia Studios. ' +
      'His short film A Face Only A Mother Could Love won the Grand Prix at the 2026 Runway AI Film Festival and Best Picture at Australia\'s Omni Film Festival, with further recognition including a Best Director award in Portugal and a selection for the Reply AI Film Festival. ' +
      'He worked earlier as a photographer and in nonprofit work, experiences that shaped his focus on character, empathy and human vulnerability.',
    tags: ['ai-film', 'grand-prix', 'welland-ontario', 'nolia-studios', 'canada'],
    workLinks: [
      { title: 'A Face Only A Mother Could Love', url: 'https://www.youtube.com/watch?v=UeX7yTc5zgY' },
    ],
    contests: ['runway-aif-2026'],
    featuredSince: '2026-10-03',
  },
  {
    slug: 'asi-oren',
    name: 'Asi Oren',
    type: 'filmmaker',
    location: 'London, England, United Kingdom',
    website: 'https://asioren.com',
    oneLiner: 'Cinematographer and creative developer whose AI-assisted short "In Another Breath" took First Prize at Curious Refuge\'s Feel-Good AI Film Competition.',
    bio:
      'Asi Oren is a cinematographer and creative developer working across film, interactive journalism and contemporary art, based in London. He is Lead Interactive Developer at Haaretz, where his data-driven, spatial-narrative work has been recognized by the European Press Prize. ' +
      'His wordless AI-assisted short In Another Breath — built from image generation, animation, editing and sound design, and following two strangers from an awkward moment on a tram into an imagined felt-world lifetime together — won First Prize at Curious Refuge\'s Feel-Good AI Film Competition (2026). ' +
      'His non-AI film and cinematography work includes Lady Dior — As Seen By, a sculptural exhibition film for Christian Dior shown at the Tel Aviv Museum of Art and the Jewish Museum Berlin, among other international stops.',
    tags: ['ai-film', 'cinematography', 'london', 'journalism', 'haaretz'],
    workLinks: [
      { title: 'In Another Breath', url: 'https://asioren.com/projects/in-another-breath/' },
      { title: 'Lady Dior — As Seen By', url: 'https://asioren.com/projects/dior/', client: 'Christian Dior' },
      { title: 'Haaretz — A Story of Three Maps', url: 'https://asioren.com/projects/haaretz/', client: 'Haaretz' },
    ],
    contests: ['curious-refuge-feelgood-2026'],
    featuredSince: '2026-11-28',
  },
]

export function getCreator(slug: string): Creator | undefined {
  return creators.find(c => c.slug === slug)
}

export const creatorSlugs = creators.map(c => c.slug)
