import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getAllContests } from '@/lib/contests-db'
import { GUIDES } from '@/lib/content/guides'
import { CRAFT_GUIDES, CRAFT_GUIDE_ORDER } from '@/data/craft-guides'

const BASE = 'https://aifilmcontests.com'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guides | AI Film Contests',
  description:
    'Every AI film contest guide in one place: monthly deadline round-ups, how to submit to and win specific festivals, and craft guides for AI brand and commercial work.',
  openGraph: {
    title: 'Guides',
    description: 'Monthly deadline round-ups, festival-specific how-tos, and craft guides for AI brand and commercial work.',
    url: `${BASE}/guide`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides',
    description: 'Monthly deadline round-ups, festival-specific how-tos, and craft guides for AI brand and commercial work.',
  },
  alternates: { canonical: `${BASE}/guide` },
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

function fmt(d: string) {
  const date = new Date(d)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type Row = { slug: string; title: string; description: string; date: string | null }

function GuideSection({ heading, rows }: { heading: string; rows: Row[] }) {
  if (rows.length === 0) return null
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={sectionLabel}>{heading}</h2>
      <div className="cr-list">
        {rows.map(row => (
          <Link key={row.slug} href={`/guide/${row.slug}`} className="cr-row">
            <div>
              <div className="cr-name">{row.title}</div>
              <p className="cr-one">{row.description}</p>
            </div>
            <div className="cr-since">
              {row.date && (
                <>
                  <span className="cr-since-label">Updated</span>
                  <span className="cr-since-date">{row.date}</span>
                </>
              )}
            </div>
            <span className="cr-go" aria-hidden="true">&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default async function GuideIndexPage() {
  const all = await getAllContests()
  const openCount = all.filter(c => c.status === 'open').length

  // GUIDES (src/lib/content/guides.ts) covers two shapes: monthly/weekly
  // deadline round-ups (slug contains "deadlines-" or "closing") and
  // everything else -- general how-to-enter/win pieces and per-festival
  // submission guides. Split on that instead of hardcoding two lists so a
  // new guide of either shape shows up here without touching this file.
  const deadlineGuides: Row[] = []
  const howToGuides: Row[] = []
  for (const [slug, guide] of Object.entries(GUIDES)) {
    const row: Row = { slug, title: guide.title, description: guide.description, date: guide.datePublished ? fmt(guide.datePublished) : null }
    if (/deadlines-|closing/.test(slug)) deadlineGuides.push(row)
    else howToGuides.push(row)
  }
  deadlineGuides.sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))
  howToGuides.sort((a, b) => a.title.localeCompare(b.title))

  // Craft guides (src/data/craft-guides.ts) are a curated ten-part series
  // for brand/commercial work -- keep their own authored order, not alpha.
  const craftGuides: Row[] = CRAFT_GUIDE_ORDER
    .filter(slug => CRAFT_GUIDES[slug])
    .map(slug => {
      const g = CRAFT_GUIDES[slug]
      return { slug, title: g.title, description: g.description, date: fmt(g.dateModified ?? g.datePublished) }
    })

  const allRows = [...deadlineGuides, ...howToGuides, ...craftGuides]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI film contest guides',
    url: `${BASE}/guide`,
    numberOfItems: allRows.length,
    itemListElement: allRows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.title,
      url: `${BASE}/guide/${r.slug}`,
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
          <span style={{ color: '#8B867C' }}>Guides</span>
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
            Guides
          </h1>
          <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.7, maxWidth: 680 }}>
            {allRows.length} guides: monthly deadline round-ups, how to submit to and win specific
            festivals, and a craft series for AI brand and commercial work.
          </p>
        </div>

        <GuideSection heading={`${deadlineGuides.length} Deadline round-ups`} rows={deadlineGuides} />
        <GuideSection heading={`${howToGuides.length} How to enter & win`} rows={howToGuides} />
        <GuideSection heading={`${craftGuides.length} Craft guides for brand work`} rows={craftGuides} />

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
