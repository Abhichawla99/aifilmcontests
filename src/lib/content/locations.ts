export interface LocationData {
  label: string
  description: string
  filterNote: string
  ruminatex: boolean
  ruminatexNote?: string
}

export const LOCATIONS: Record<string, LocationData> = {
  'usa': {
    label: 'USA',
    description: 'AI film contests open to US-based filmmakers. The United States has a thriving AI filmmaking community, with major contests hosted by Runway (based in NYC), Luma AI, and others. Most international contests are also open to US filmmakers.',
    filterNote: 'US-based and internationally open',
    ruminatex: false,
  },
  'europe': {
    label: 'Europe',
    description: 'AI film competitions in Europe and open to European filmmakers. The European AI film scene is anchored by WSXA Amsterdam, ARFF Berlin, and a growing number of traditional festivals adding AI categories. Many US-based competitions are open internationally.',
    filterNote: 'Europe-based and internationally open',
    ruminatex: false,
  },
  'uk': {
    label: 'United Kingdom',
    description: 'AI film contests and festivals in the UK, plus international competitions open to UK-based filmmakers. The UK has a strong tradition of experimental film and is increasingly embracing AI filmmaking at the festival level.',
    filterNote: 'UK-based and internationally open',
    ruminatex: false,
  },
  'online': {
    label: 'Online / Remote',
    description: 'AI film competitions that accept entries from anywhere in the world with online submission. The vast majority of AI film contests are online-first — submission through FilmFreeway, proprietary portals, or direct upload. No travel required to enter.',
    filterNote: 'International / remote submission',
    ruminatex: false,
  },
  'global': {
    label: 'International / Global',
    description: 'Major international AI film competitions open to filmmakers worldwide. These contests attract entries from dozens of countries and are the most competitive — and most prestigious — in the field. The Kling NextGen Contest received entries from 122 countries.',
    filterNote: 'Open to all countries',
    ruminatex: false,
  },
}
