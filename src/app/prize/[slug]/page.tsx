import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import InnerLayout from '@/components/InnerLayout'

export const dynamic = 'force-dynamic'

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

const PRIZE_PAGES: Record<string, PrizePageData> = {
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

export async function generateStaticParams() {
  return Object.keys(PRIZE_PAGES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = PRIZE_PAGES[slug]
  if (!page) return { title: 'Not Found' }

  return {
    title: `${page.label} 2026 | AI Film Contests`,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.label,
      description: page.description,
      url: `https://aifilmcontests.com/prize/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: page.label, description: page.description },
    alternates: { canonical: `https://aifilmcontests.com/prize/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function PrizePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PRIZE_PAGES[slug]
  if (!page) notFound()

  const all = await getAllContests()
  const matched = all.filter(page.filterFn)
  const open = matched.filter(c => c.status === 'open')
  const upcoming = matched.filter(c => c.status === 'upcoming')
  // If filter returns too few results, show all open contests
  const displayOpen = open.length >= 2 ? open : all.filter(c => c.status === 'open')
  const displayUpcoming = upcoming.length >= 2 ? upcoming : all.filter(c => c.status === 'upcoming').slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.label,
    description: page.description,
    url: `https://aifilmcontests.com/prize/${slug}`,
    numberOfItems: displayOpen.length,
    itemListElement: displayOpen.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      description: c.prize,
    })),
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span className="link-muted" style={{ cursor: 'default' }}>By Prize</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{page.label}</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f4f4f5',
            marginBottom: 16,
          }}>
            {page.label}
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, maxWidth: 680, marginBottom: 16 }}>
            {page.body}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: '#52525b' }}>
            <span><strong style={{ color: '#22c55e' }}>{displayOpen.length}</strong> open now</span>
            <span>·</span>
            <span><strong style={{ color: '#f59e0b' }}>{displayUpcoming.length}</strong> coming soon</span>
          </div>
        </div>

        {/* Open contests */}
        {displayOpen.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Open Now
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayOpen.map(c => {
                const dl = daysLeft(c.deadline)
                const isUrgent = dl <= 7
                return (
                  <Link key={c.id} href={`/contests/${c.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="dot dot-open live" />
                          {isUrgent && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{dl}d left</span>}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5', marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#52525b' }}>{c.organizer}</div>
                        {c.entryFee && (
                          <div style={{ fontSize: 11, color: '#3f3f46', marginTop: 3 }}>Entry: {c.entryFee}</div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: 14 }}>{c.prize}</div>
                        <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>Due {fmt(c.deadline)}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {displayUpcoming.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Coming Soon
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayUpcoming.map(c => (
                <Link key={c.id} href={`/contests/${c.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="dot dot-upcoming" />
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>Coming Soon</span>
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5', marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#52525b' }}>{c.organizer}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: 14 }}>{c.prize}</div>
                      <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>Est. {fmt(c.deadline)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other prize pages */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#52525b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}>
            Browse by Prize Type
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(PRIZE_PAGES).filter(([s]) => s !== slug).map(([s, p]) => (
              <Link key={s} href={`/prize/${s}`} style={{
                fontSize: 13,
                color: '#71717a',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {p.label}
              </Link>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>
        </div>

      </div>
    </InnerLayout>
  )
}
