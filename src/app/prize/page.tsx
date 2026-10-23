import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { PRIZE_PAGES } from '@/lib/content/prize-pages'

const BASE = 'https://aifilmcontests.com'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'AI Film Contests by Prize Type | AI Film Contests',
  description:
    'Browse AI film contests by what they pay out — free entry, high prize ($10K+), cash prizes, or grants and funding — with how many are open right now.',
  openGraph: {
    title: 'AI Film Contests by Prize Type',
    description: 'Free entry, high prize, cash prizes, and grants — how many AI film contests are open in each right now.',
    url: `${BASE}/prize`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Film Contests by Prize Type',
    description: 'Free entry, high prize, cash prizes, and grants — how many AI film contests are open in each right now.',
  },
  alternates: { canonical: `${BASE}/prize` },
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

export default async function PrizeIndexPage() {
  const all = await getAllContests()
  const openCount = all.filter(c => c.status === 'open').length

  const rows = Object.entries(PRIZE_PAGES).map(([slug, page]) => {
    const matching = all.filter(page.filterFn)
    return { slug, page, openCount: matching.filter(c => c.status === 'open').length }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI film contests by prize type',
    url: `${BASE}/prize`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.page.label,
      url: `${BASE}/prize/${r.slug}`,
      description: r.page.description,
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
          <span style={{ color: '#8B867C' }}>By Prize</span>
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
            AI film contests by prize type
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            What a contest pays out — free entry, a high prize pool, cash, or a grant — and how many are
            open right now, pulled from each contest&apos;s own listed prize.
          </p>
        </div>

        {/* Roster */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>{rows.length} Prize Types</h2>
          <div className="cr-list">
            {rows.map(({ slug, page, openCount: typeOpenCount }) => (
              <Link key={slug} href={`/prize/${slug}`} className="cr-row">
                <div>
                  <div className="cr-name">{page.label}</div>
                  <p className="cr-one">{page.description}</p>
                </div>
                <div className="cr-since">
                  <span className="cr-since-label">Open now</span>
                  <span className="cr-since-date">{typeOpenCount}</span>
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
