import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import ContestCard from '@/components/ContestCard'
import { ArticleHeader } from '@/components/ArticleLayout'
import { getAllContests } from '@/lib/contests-db'

const BASE = 'https://aifilmcontests.com'
const WINDOW_DAYS = 14

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Film Contests Closing Soon (Next 14 Days) | AI Film Contests',
  description:
    'Open AI film competitions with a deadline in the next two weeks, soonest first. Verified daily.',
  openGraph: {
    title: 'AI Film Contests Closing Soon',
    description: 'Open AI film competitions with a deadline in the next two weeks, soonest first.',
    url: `${BASE}/contests/closing-soon`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Film Contests Closing Soon',
    description: 'Open AI film competitions with a deadline in the next two weeks, soonest first.',
  },
  alternates: { canonical: `${BASE}/contests/closing-soon` },
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

export default async function ClosingSoonPage() {
  const all = await getAllContests()
  const now = Date.now()
  const cutoff = now + WINDOW_DAYS * 86_400_000

  const contests = all
    .filter(c => c.status === 'open')
    .filter(c => {
      const d = new Date(c.deadline).getTime()
      return d >= now && d <= cutoff
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI film contests closing soon',
    url: `${BASE}/contests/closing-soon`,
    numberOfItems: contests.length,
    itemListElement: contests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE}/contests/${c.id}`,
      description: c.description,
    })),
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>Closing Soon</span>
        </p>

        <ArticleHeader
          slug="closing-soon"
          kind="Deadline"
          emoji="⏳"
          title="AI film contests closing soon"
          standfirst="Open competitions with a deadline in the next 14 days, soonest first. Get in before the window shuts."
          meta={[contests.length === 1 ? '1 contest closing within 14 days' : `${contests.length} contests closing within 14 days`]}
        />

        {contests.length > 0 ? (
          <section style={{ marginBottom: 40 }}>
            <h2 style={sectionLabel}>
              {contests.length === 1 ? '1 Contest' : `${contests.length} Contests`}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {contests.map(c => <ContestCard key={c.id} contest={c} />)}
            </div>
          </section>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8B867C' }}>
            <p style={{ fontSize: 15, marginBottom: 16 }}>Nothing closing in the next 14 days right now.</p>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>Browse all contests →</Link>
          </div>
        )}

        {/* Subscribe */}
        <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginBottom: 32 }}>
          <h2 style={sectionLabel}>Never miss a deadline</h2>
          <EmailSubscribe compact />
        </section>

        <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>

      </div>
    </InnerLayout>
  )
}
