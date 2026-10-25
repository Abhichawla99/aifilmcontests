import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { TOPICS } from '@/lib/content/topics'

const BASE = 'https://aifilmcontests.com'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'AI Film Contest Guides & Topics | AI Film Contests',
  description:
    'Every AI film contest topic page in one place — deadline round-ups, tool-specific picks, regional guides and single-festival deep dives.',
  openGraph: {
    title: 'AI Film Contest Guides & Topics',
    description: 'Deadline round-ups, tool-specific picks, regional guides and single-festival deep dives, all in one list.',
    url: `${BASE}/topics`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Film Contest Guides & Topics',
    description: 'Deadline round-ups, tool-specific picks, regional guides and single-festival deep dives, all in one list.',
  },
  alternates: { canonical: `${BASE}/topics` },
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

export default async function TopicsIndexPage() {
  const all = await getAllContests()
  const openCount = all.filter(c => c.status === 'open').length

  const rows = Object.entries(TOPICS)
    .map(([slug, topic]) => ({ slug, topic, cited: topic.featuredContestIds?.length ?? 0 }))
    .sort((a, b) => a.topic.title.localeCompare(b.topic.title))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI film contest topics',
    url: `${BASE}/topics`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.topic.title,
      url: `${BASE}/topics/${r.slug}`,
      description: r.topic.description,
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
          <span style={{ color: '#8B867C' }}>Topics</span>
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
            AI film contest topics
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            Deadline round-ups, tool-specific picks (Runway, Kling, Sora and more), regional guides and
            single-festival deep dives — every topic page on the site, in one list.
          </p>
        </div>

        {/* Roster */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>{rows.length} Topics</h2>
          <div className="cr-list">
            {rows.map(({ slug, topic, cited }) => (
              <Link key={slug} href={`/topics/${slug}`} className="cr-row">
                <div>
                  <div className="cr-name">{topic.title}</div>
                  <p className="cr-one">{topic.description}</p>
                </div>
                <div className="cr-since">
                  <span className="cr-since-label">Cites</span>
                  <span className="cr-since-date">{cited} contest{cited === 1 ? '' : 's'}</span>
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
