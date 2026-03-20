import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'

export const dynamic = 'force-dynamic'

const TOOLS: Record<string, {
  name: string
  tagline: string
  description: string
  keywords: string
  matchTerms: string[] // terms to match in ai_tools_allowed
}> = {
  'runway': {
    name: 'Runway',
    tagline: 'Film contests that use or require Runway ML',
    description: 'Runway is the most active AI film platform in competition. They run the AI Film Festival ($135K prize pool at Lincoln Center), the Gen:48 48-hour challenge, and the Hundred Film Fund ($5K–$1M per project). They also sponsor and screen at other major festivals.',
    keywords: 'Runway AI film contest, Runway ML competition, Runway Gen-4 film festival, Runway film fund 2026',
    matchTerms: ['runway'],
  },
  'kling': {
    name: 'Kling AI',
    tagline: 'Film contests accepting or requiring Kling AI',
    description: 'Kling AI (by Kuaishou) runs the NextGen Creative Contest — 4,600+ entries from 122 countries, $42K+ prizes, jury of Oscar winners, screenings at Tokyo International Film Festival. Their 2026 edition is expected mid-year.',
    keywords: 'Kling AI film contest, Kling AI competition 2026, Kuaishou AI film festival, Kling NextGen contest',
    matchTerms: ['kling'],
  },
  'luma': {
    name: 'Luma AI',
    tagline: 'Film contests that use or require Luma AI',
    description: 'Luma AI partnered with creative studio DE-YAN for the Dream Brief — a $1,000,000 contest for commercials that win a Cannes Lions Gold Lion. The biggest AI film prize ever announced. Judged by Nike, HBO Max, and Wieden+Kennedy.',
    keywords: 'Luma AI contest, Luma Dream Brief competition, Luma Dream Machine film festival 2026',
    matchTerms: ['luma'],
  },
  'hailuo': {
    name: 'Hailuo AI',
    tagline: 'Film contests that use or require Hailuo AI (MiniMax)',
    description: 'Hailuo AI (by MiniMax) powers the WSXA × Hailuo AI Film Competition — themed around Anti-War and Climate Resilience. Finalists are screened at WSXA Amsterdam and ARFF Berlin. Requires 50%+ Hailuo AI usage.',
    keywords: 'Hailuo AI film contest, MiniMax AI competition, Hailuo film festival 2026, WSXA Hailuo',
    matchTerms: ['hailuo', 'minimax'],
  },
  'pika': {
    name: 'Pika',
    tagline: 'Film contests that use or require Pika',
    description: 'Pika is one of the leading generative video tools accepted across most open AI film competitions. Many contests allow any AI tools — including Pika — for character animation, motion generation, and video-to-video work.',
    keywords: 'Pika AI film contest, Pika video competition 2026, Pika film festival',
    matchTerms: ['pika'],
  },
  'sora': {
    name: 'Sora',
    tagline: 'Film contests that use or require OpenAI Sora',
    description: 'OpenAI Sora is accepted across most open AI film competitions. As access expands, expect more Sora-specific categories. Currently most contests with "any AI tools" policies accept Sora-generated footage.',
    keywords: 'Sora AI film contest, OpenAI Sora competition 2026, Sora film festival',
    matchTerms: ['sora', 'openai'],
  },
}

export async function generateStaticParams() {
  return Object.keys(TOOLS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = TOOLS[slug]
  if (!tool) return { title: 'Not Found' }

  const title = `${tool.name} Film Contests & Competitions 2026 | AI Film Contests`
  const description = `${tool.tagline}. ${tool.description.slice(0, 140)}`

  return {
    title,
    description,
    keywords: tool.keywords,
    openGraph: { title, description, url: `https://aifilmcontests.com/tools/${slug}`, siteName: 'AI Film Contests' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://aifilmcontests.com/tools/${slug}` },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = TOOLS[slug]
  if (!tool) notFound()

  const all = await getAllContests()

  // Match contests that mention this tool in ai_tools_allowed
  const matching = all.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return tool.matchTerms.some(t => toolsStr.includes(t)) ||
      toolsStr.includes('any ai tools') ||
      toolsStr.includes('any generative')
  })

  // Separate "specifically mentions tool" vs "any AI tools accepted"
  const specific = matching.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return tool.matchTerms.some(t => toolsStr.includes(t))
  })
  const anyTools = matching.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return !tool.matchTerms.some(t => toolsStr.includes(t))
  })

  const open = matching.filter(c => c.status === 'open')
  const upcoming = matching.filter(c => c.status === 'upcoming')

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  function daysLeft(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tool.name} Film Contests 2026`,
    description: tool.description,
    numberOfItems: open.length,
    itemListElement: open.slice(0, 10).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
    })),
  }

  function ContestRow({ c }: { c: Awaited<ReturnType<typeof getAllContests>>[0] }) {
    const dl = daysLeft(c.deadline)
    const isUrgent = c.status === 'open' && dl <= 7
    return (
      <Link href={`/contests/${c.id}`} style={{ textDecoration: 'none' }}>
        <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`dot ${c.status === 'open' ? 'dot-open' : 'dot-upcoming'} ${c.status === 'open' && !isUrgent ? 'live' : ''}`} />
              {isUrgent && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{dl}d left</span>}
              {c.status === 'upcoming' && <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>Coming Soon</span>}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5', marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: '#52525b' }}>{c.organizer}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: 14 }}>{c.prize}</div>
            <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>
              {c.status === 'open' ? `Due ${fmt(c.deadline)}` : `Est. ${fmt(c.deadline)}`}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: '#080810', minHeight: '100vh' }}>
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

          <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/" className="link-muted">Tools</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#52525b' }}>{tool.name}</span>
          </p>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#f4f4f5', marginBottom: 12 }}>
              {tool.name} Film Contests 2026
            </h1>
            <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.65, maxWidth: 620, marginBottom: 20 }}>
              {tool.description}
            </p>
            <div className="flex items-center gap-4" style={{ fontSize: 13, color: '#52525b' }}>
              <span><strong style={{ color: '#22c55e' }}>{open.length}</strong> open now</span>
              <span>·</span>
              <span><strong style={{ color: '#f59e0b' }}>{upcoming.length}</strong> coming soon</span>
            </div>
          </div>

          {/* Specifically requires this tool */}
          {specific.filter(c => c.status !== 'closed').length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                {tool.name} Required or Featured
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {specific.filter(c => c.status !== 'closed').map(c => <ContestRow key={c.id} c={c} />)}
              </div>
            </section>
          )}

          {/* Any AI tools accepted (includes this tool) */}
          {anyTools.filter(c => c.status !== 'closed').length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Also Accepts {tool.name}
              </h2>
              <p style={{ fontSize: 13, color: '#3f3f46', marginBottom: 14 }}>These contests accept any AI tools — {tool.name} included.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {anyTools.filter(c => c.status !== 'closed').slice(0, 8).map(c => <ContestRow key={c.id} c={c} />)}
              </div>
            </section>
          )}

          {/* Other tools */}
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginTop: 8 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Browse by AI Tool
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(TOOLS).filter(([s]) => s !== slug).map(([s, t]) => (
                <Link key={s} href={`/tools/${s}`} style={{ fontSize: 13, color: '#71717a', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '5px 12px', textDecoration: 'none' }}>
                  {t.name}
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
