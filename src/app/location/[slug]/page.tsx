import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'

export const dynamic = 'force-dynamic'

interface LocationData {
  label: string
  description: string
  filterNote: string
  ruminatex: boolean
  ruminatexNote?: string
}

const LOCATIONS: Record<string, LocationData> = {
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

export async function generateStaticParams() {
  return Object.keys(LOCATIONS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const loc = LOCATIONS[slug]
  if (!loc) return { title: 'Not Found' }

  const title = `AI Film Contests in ${loc.label} 2026 | AI Film Contests`
  const description = `${loc.description} Find every open AI film competition with eligibility for ${loc.label} filmmakers.`

  return {
    title,
    description,
    keywords: `AI film contest ${loc.label}, AI film competition ${loc.label} 2026, AI film festival ${loc.label}`,
    openGraph: {
      title,
      description,
      url: `https://aifilmcontests.com/location/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://aifilmcontests.com/location/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loc = LOCATIONS[slug]
  if (!loc) notFound()

  const all = await getAllContests()
  // Most AI film contests are globally open — show all open + upcoming
  const open = all.filter(c => c.status === 'open')
  const upcoming = all.filter(c => c.status === 'upcoming')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `AI Film Contests in ${loc.label} 2026`,
    description: loc.description,
    url: `https://aifilmcontests.com/location/${slug}`,
    numberOfItems: open.length,
    itemListElement: open.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      description: c.description,
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
          <span className="link-muted" style={{ cursor: 'default' }}>By Location</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{loc.label}</span>
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
            AI Film Contests in {loc.label}
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, maxWidth: 680, marginBottom: 16 }}>
            {loc.description}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#52525b',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '6px 12px',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#52525b" strokeWidth="1.2"/>
              <path d="M6 3v3l2 1.5" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Note: Always check individual contest eligibility requirements — {loc.filterNote}
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: '#52525b' }}>
            <span><strong style={{ color: '#22c55e' }}>{open.length}</strong> open now</span>
            <span>·</span>
            <span><strong style={{ color: '#f59e0b' }}>{upcoming.length}</strong> coming soon</span>
          </div>
        </div>

        {/* Open contests */}
        {open.length > 0 && (
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
              {open.map(c => {
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
                        {c.eligibility && (
                          <div style={{ fontSize: 11, color: '#3f3f46', marginTop: 3 }}>{c.eligibility}</div>
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
        {upcoming.length > 0 && (
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
              {upcoming.map(c => (
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

        {/* Other locations */}
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
            Browse by Location
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(LOCATIONS).filter(([s]) => s !== slug).map(([s, l]) => (
              <Link key={s} href={`/location/${s}`} style={{
                fontSize: 13,
                color: '#71717a',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {l.label}
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
