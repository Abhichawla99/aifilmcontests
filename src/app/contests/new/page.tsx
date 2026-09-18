import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import ContestCard from '@/components/ContestCard'
import { ArticleHeader } from '@/components/ArticleLayout'
import { getAllContests } from '@/lib/contests-db'

const BASE = 'https://aifilmcontests.com'
const WINDOW_DAYS = 14

function isRecent(createdAt: string | undefined): boolean {
  if (!createdAt) return false
  const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000
  return new Date(createdAt).getTime() >= cutoff
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Newest AI Film Contests | AI Film Contests',
  description:
    'AI film competitions added to our directory in the last two weeks. Verified daily.',
  openGraph: {
    title: 'Newest AI Film Contests',
    description: 'AI film competitions added to our directory in the last two weeks.',
    url: `${BASE}/contests/new`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newest AI Film Contests',
    description: 'AI film competitions added to our directory in the last two weeks.',
  },
  alternates: { canonical: `${BASE}/contests/new` },
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

export default async function NewContestsPage() {
  const all = await getAllContests()

  const contests = all
    .filter(c => c.status === 'open')
    .filter(c => isRecent(c.createdAt))
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Newest AI film contests',
    url: `${BASE}/contests/new`,
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
          <span style={{ color: '#8B867C' }}>New</span>
        </p>

        <ArticleHeader
          slug="new"
          kind="Recently Added"
          emoji="🆕"
          title="Newest AI film contests"
          standfirst="Open competitions added to our directory in the last two weeks. Be among the first to submit."
          meta={[contests.length === 1 ? '1 new contest open now' : `${contests.length} new contests open now`]}
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
            <p style={{ fontSize: 15, marginBottom: 16 }}>No contests added in the last two weeks.</p>
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
