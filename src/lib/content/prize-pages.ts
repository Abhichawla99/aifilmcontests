import { Contest } from '@/data/contests'

interface PrizePageData {
  label: string
  description: string
  keywords: string
  body: string
  filterFn: (c: Contest) => boolean
}

const FREE_ENTRY_TERMS = ['free', 'no fee', 'no entry fee', '$0', 'none']
const HIGH_PRIZE_TERMS = ['$10,000', '$20,000', '$25,000', '$50,000', '$100,000', '$135,000', '$1,000,000', '10k', '20k', '25k', '50k', '100k', '135k', '$42']
const CASH_TERMS = ['$', 'usd', 'cash', 'prize money', 'grand prix']
const GRANT_TERMS = ['grant', 'fund', 'funding', 'commission', 'residency', 'award fund']

function hasTerm(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some(t => lower.includes(t.toLowerCase()))
}

export const PRIZE_PAGES: Record<string, PrizePageData> = {
  'free-entry': {
    label: 'Free Entry AI Film Contests',
    description: 'AI film competitions with no entry fee — completely free to enter. No submission fee required.',
    keywords: 'free AI film contest, free entry AI competition 2026',
    body: 'Not every AI film contest requires an entry fee. Several major competitions — including contests run by Runway, Kling, and Hailuo — are free to enter. Free entry contests are ideal for emerging filmmakers building their competition portfolio without significant upfront cost. Check individual contest pages for eligibility requirements, even when entry is free.',
    filterFn: (c: Contest) => {
      if (!c.entryFee) return true
      return hasTerm(c.entryFee, FREE_ENTRY_TERMS)
    },
  },
  'high-prize': {
    label: 'High Prize AI Film Contests ($10K+)',
    description: 'AI film competitions with prize pools of $10,000 or more. The top tier of AI film competition.',
    keywords: 'high prize AI film contest, big prize AI competition 2026, $10K AI film prize',
    body: 'The largest AI film prize pools have reached $1M (Luma Dream Brief) and $135K+ (Runway AI Film Festival). High-prize competitions are the most competitive and most prestigious in the field. They attract professional filmmakers, require high production values, and are judged by industry professionals from Nike, Wieden+Kennedy, Oscar-winning directors, and Lincoln Center programmers.',
    filterFn: (c: Contest) => {
      const prizeStr = (c.prize ?? '') + ' ' + (c.prizeDetails ?? []).join(' ')
      return hasTerm(prizeStr, HIGH_PRIZE_TERMS)
    },
  },
  'cash-prizes': {
    label: 'AI Film Contests with Cash Prizes',
    description: 'AI film competitions that award cash prizes to winners. Real money for your AI film.',
    keywords: 'cash prize AI film contest, paid AI film competition 2026',
    body: 'Cash prizes are the most straightforward form of competition reward — and the most motivating. AI film cash prizes now range from a few hundred dollars at smaller competitions to $1M at the Luma Dream Brief. Even mid-tier AI film prizes ($5K-$50K range) represent significant recognition for independent AI filmmakers. Prize money is usually paid within 60-90 days of the competition announcement.',
    filterFn: (c: Contest) => {
      const prizeStr = (c.prize ?? '') + ' ' + (c.prizeDetails ?? []).join(' ')
      return hasTerm(prizeStr, CASH_TERMS) || hasTerm(prizeStr, HIGH_PRIZE_TERMS)
    },
  },
  'grants': {
    label: 'AI Film Grants and Funding',
    description: 'Grant programs and funding opportunities for AI filmmakers. Support for production, development, and distribution.',
    keywords: 'AI film grant, AI filmmaker funding, generative AI film fund 2026',
    body: 'Beyond prize competitions, dedicated funding programs for AI filmmakers are emerging. Runway\'s Hundred Film Fund ($5K-$1M per project) supports selected AI filmmakers with direct production grants. As the field matures, expect more studio development funds, residency programs, and distribution support to emerge. Grants differ from prizes: they are awarded before production, not after.',
    filterFn: (c: Contest) => {
      const allText = [c.name, c.description, c.prize, ...(c.prizeDetails ?? [])].join(' ')
      return hasTerm(allText, GRANT_TERMS)
    },
  },
}
