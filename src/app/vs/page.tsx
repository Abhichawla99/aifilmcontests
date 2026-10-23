import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { VS_PAGES } from '@/lib/content/vs-pages'

const BASE = 'https://aifilmcontests.com'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'AI Video Tool Comparisons | AI Film Contests',
  description:
    'Runway vs Kling, Runway vs Sora, Runway vs Luma, Kling vs Sora, and a full ranked comparison of every major AI video tool for competition filmmaking.',
  openGraph: {
    title: 'AI Video Tool Comparisons',
    description: 'Head-to-head comparisons of the AI video tools filmmakers use to enter competitions.',
    url: `${BASE}/vs`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Video Tool Comparisons',
    description: 'Head-to-head comparisons of the AI video tools filmmakers use to enter competitions.',
  },
  alternates: { canonical: `${BASE}/vs` },
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

export default async function VSIndexPage() {
  const all = await getAllContests()
  const openCount = all.filter(c => c.status === 'open').length

  const rows = Object.entries(VS_PAGES).map(([slug, page]) => ({
    slug,
    title: page.title.split(':')[0],
    description: page.description,
    toolCount: page.type === 'pairwise' ? 2 : page.tools.length,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI video tool comparisons',
    url: `${BASE}/vs`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.title,
      url: `${BASE}/vs/${r.slug}`,
      description: r.description,
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
          <span style={{ color: '#8B867C' }}>Compare</span>
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
            AI video tool comparisons
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            Head-to-head comparisons of the tools filmmakers actually use to enter AI film competitions —
            quality, clip length, competition support, and which tool to pick for which kind of entry.
          </p>
        </div>

        {/* Roster */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>{rows.length} Comparisons</h2>
          <div className="cr-list">
            {rows.map(({ slug, title, description, toolCount }) => (
              <Link key={slug} href={`/vs/${slug}`} className="cr-row">
                <div>
                  <div className="cr-name">{title}</div>
                  <p className="cr-one">{description}</p>
                </div>
                <div className="cr-since">
                  <span className="cr-since-label">Compares</span>
                  <span className="cr-since-date">{toolCount}</span>
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
