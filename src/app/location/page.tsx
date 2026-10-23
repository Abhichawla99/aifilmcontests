import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { LOCATIONS } from '@/lib/content/locations'

const BASE = 'https://aifilmcontests.com'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'AI Film Contests by Location | AI Film Contests',
  description:
    'AI film contests for filmmakers in the USA, Europe, the UK, online/remote, and worldwide — with how many are open right now.',
  openGraph: {
    title: 'AI Film Contests by Location',
    description: 'AI film contests for filmmakers in the USA, Europe, the UK, online/remote, and worldwide.',
    url: `${BASE}/location`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Film Contests by Location',
    description: 'AI film contests for filmmakers in the USA, Europe, the UK, online/remote, and worldwide.',
  },
  alternates: { canonical: `${BASE}/location` },
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

export default async function LocationIndexPage() {
  const all = await getAllContests()
  // Each location page shows the same "all open" set today (see the comment
  // in location/[slug]/page.tsx -- most AI film contests are globally open,
  // so there's no real per-location filter to count against).
  const openCount = all.filter(c => c.status === 'open').length

  const rows = Object.entries(LOCATIONS)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI film contests by location',
    url: `${BASE}/location`,
    numberOfItems: rows.length,
    itemListElement: rows.map(([slug, loc], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: loc.label,
      url: `${BASE}/location/${slug}`,
      description: loc.description,
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
          <span style={{ color: '#8B867C' }}>By Location</span>
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
            AI film contests by location
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            Most AI film contests are online-first and open to entrants worldwide — these pages group
            them by the region filmmakers most often search for.
          </p>
        </div>

        {/* Roster */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>{rows.length} Locations</h2>
          <div className="cr-list">
            {rows.map(([slug, loc]) => (
              <Link key={slug} href={`/location/${slug}`} className="cr-row">
                <div>
                  <div className="cr-name">{loc.label}</div>
                  <p className="cr-one">{loc.filterNote}</p>
                </div>
                <div className="cr-since">
                  <span className="cr-since-label">Open now</span>
                  <span className="cr-since-date">{openCount}</span>
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
