import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { TOOLS } from '@/lib/content/tools'

const BASE = 'https://aifilmcontests.com'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'AI Tools for Film Contests | AI Film Contests',
  description:
    'Every AI tool with film contests that require or accept it — Runway, Kling, Luma, Sora and more — with how many contests are open right now.',
  openGraph: {
    title: 'AI Tools for Film Contests',
    description: 'Every AI tool with film contests that require or accept it, and how many are open now.',
    url: `${BASE}/tools`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools for Film Contests',
    description: 'Every AI tool with film contests that require or accept it, and how many are open now.',
  },
  alternates: { canonical: `${BASE}/tools` },
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: '#8B867C',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 16,
}

export default async function ToolsPage() {
  const all = await getAllContests()
  const openCount = all.filter(c => c.status === 'open').length

  // Same matching logic as tools/[slug]/page.tsx and sitemap.ts's tool hub
  // entries -- a contest counts for a tool if it names the tool directly or
  // says it accepts any AI tools.
  const rows = Object.entries(TOOLS).map(([slug, tool]) => {
    const matching = all.filter(c => {
      const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
      return tool.matchTerms.some(t => toolsStr.includes(t)) ||
        toolsStr.includes('any ai tools') ||
        toolsStr.includes('any generative')
    })
    return { slug, tool, openCount: matching.filter(c => c.status === 'open').length }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI tools for film contests',
    url: `${BASE}/tools`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.tool.name,
      url: `${BASE}/tools/${r.slug}`,
      description: r.tool.tagline,
    })),
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>Tools</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#1B1916',
            marginBottom: 16,
          }}>
            AI tools for film contests
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            Which contests require or accept a given AI tool, and how many are open right now —
            pulled from each contest&apos;s own rules, not a guess at what&apos;s popular.
          </p>
        </div>

        {/* Roster */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>{rows.length} Tools</h2>
          <div className="cr-list">
            {rows.map(({ slug, tool, openCount: toolOpenCount }) => (
              <Link key={slug} href={`/tools/${slug}`} className="cr-row">
                <div>
                  <div className="cr-name">{tool.name}</div>
                  <p className="cr-one">{tool.tagline}</p>
                </div>
                <div className="cr-since">
                  <span className="cr-since-label">Open now</span>
                  <span className="cr-since-date">{toolOpenCount}</span>
                </div>
                <span className="cr-go" aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginBottom: 32 }}>
          <h2 style={sectionLabel}>Never miss a deadline</h2>
          <EmailSubscribe compact openCount={openCount} />
        </section>

        <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>

      </div>
    </InnerLayout>
  )
}
