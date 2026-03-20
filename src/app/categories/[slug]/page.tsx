import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'

export const dynamic = 'force-dynamic'

const CATEGORIES: Record<string, { label: string; description: string; keywords: string }> = {
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

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) return { title: 'Not Found' }

  const title = `${cat.label} Contests & Festivals 2026 | AI Film Contests`
  const description = `${cat.description} Find every open ${cat.label.toLowerCase()} competition, verified deadlines, prize info, and eligibility requirements.`

  return {
    title,
    description,
    keywords: cat.keywords,
    openGraph: {
      title,
      description,
      url: `https://aifilmcontests.com/categories/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://aifilmcontests.com/categories/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) notFound()

  const all = await getAllContests()
  const contests = all.filter(c => c.categories?.includes(slug as Contest['categories'][0]))
  const open = contests.filter(c => c.status === 'open')
  const upcoming = contests.filter(c => c.status === 'upcoming')
  const closed = contests.filter(c => c.status === 'closed')

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  function daysLeft(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
  }

  // JSON-LD ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label} Contests 2026`,
    description: cat.description,
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: '#080810', minHeight: '100vh' }}>

        {/* Nav */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>AI</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#e4e4e7' }}>AI Film Contests</span>
            </Link>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← All contests</Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 py-12">

          {/* Breadcrumb */}
          <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/" className="link-muted">Categories</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#52525b' }}>{cat.label}</span>
          </p>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#f4f4f5', marginBottom: 12 }}>
              {cat.label} Contests &amp; Festivals
            </h1>
            <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.65, maxWidth: 620, marginBottom: 20 }}>
              {cat.description}
            </p>
            <div className="flex items-center gap-4" style={{ fontSize: 13, color: '#52525b' }}>
              <span><strong style={{ color: '#22c55e' }}>{open.length}</strong> open now</span>
              <span>·</span>
              <span><strong style={{ color: '#f59e0b' }}>{upcoming.length}</strong> coming soon</span>
              <span>·</span>
              <span><strong style={{ color: '#3f3f46' }}>{closed.length}</strong> closed</span>
            </div>
          </div>

          {/* Open contests */}
          {open.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
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

          {/* Upcoming contests */}
          {upcoming.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
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

          {/* No contests */}
          {open.length === 0 && upcoming.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#52525b' }}>
              <p style={{ fontSize: 15, marginBottom: 16 }}>No {cat.label.toLowerCase()} contests open right now.</p>
              <Link href="/" className="link-muted" style={{ fontSize: 13 }}>Browse all contests →</Link>
            </div>
          )}

          {/* Other categories */}
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginTop: 8 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Browse by Category
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(CATEGORIES).filter(([s]) => s !== slug).map(([s, c]) => (
                <Link key={s} href={`/categories/${s}`} style={{
                  fontSize: 13,
                  color: '#71717a',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6,
                  padding: '5px 12px',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}>
                  {c.label}
                </Link>
              ))}
            </div>
          </section>

          <div style={{ marginTop: 40 }}>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>
          </div>

        </main>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
          <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b' }}>AI Film Contests</span>
            <span style={{ fontSize: 12, color: '#3f3f46' }}>Tracking every AI film competition · Updated daily</span>
            <Link href="/" className="link-muted" style={{ fontSize: 12 }}>Browse All</Link>
          </div>
        </footer>

      </div>
    </>
  )
}
