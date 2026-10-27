import { notFound } from 'next/navigation'
import ContestCard from '@/components/ContestCard'
import { ArticleHeader } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import { PRIZE_PAGES } from '@/lib/content/prize-pages'
import InnerLayout from '@/components/InnerLayout'

export const revalidate = 900

export async function generateStaticParams() {
  return Object.keys(PRIZE_PAGES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = PRIZE_PAGES[slug]
  if (!page) return { title: 'Not Found' }

  return {
    title: `${page.label} 2026 | AI Film Contests`,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.label,
      description: page.description,
      url: `https://aifilmcontests.com/prize/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: page.label, description: page.description },
    alternates: { canonical: `https://aifilmcontests.com/prize/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function PrizePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PRIZE_PAGES[slug]
  if (!page) notFound()

  const all = await getAllContests()
  const matched = all.filter(page.filterFn)
  const open = matched.filter(c => c.status === 'open')
  const upcoming = matched.filter(c => c.status === 'upcoming')
  // If filter returns too few results, show all open contests
  const displayOpen = open.length >= 2 ? open : all.filter(c => c.status === 'open')
  const displayUpcoming = upcoming.length >= 2 ? upcoming : all.filter(c => c.status === 'upcoming').slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.label,
    description: page.description,
    url: `https://aifilmcontests.com/prize/${slug}`,
    numberOfItems: displayOpen.length,
    itemListElement: displayOpen.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      description: c.prize,
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
          <Link href="/prize" className="link-muted">By Prize</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>{page.label}</span>
        </p>

        <ArticleHeader
          slug={slug}
          kind="Prize"
          title={page.label}
          standfirst={page.body}
          meta={[`${displayOpen.length} open now`, `${displayUpcoming.length} coming soon`]}
        />


        {/* Open contests */}
        {displayOpen.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#8B867C',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Open Now
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {displayOpen.map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
          </section>
        )}

        {/* Upcoming */}
        {displayUpcoming.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#8B867C',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Coming Soon
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {displayUpcoming.map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
          </section>
        )}

        {/* Deadline alerts */}
        <section style={{ marginBottom: 48 }}>
          <EmailSubscribe compact openCount={all.filter(c => c.status === 'open').length} />
        </section>

        {/* Other prize pages */}
        <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#8B867C',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}>
            Browse by Prize Type
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(PRIZE_PAGES).filter(([s]) => s !== slug).map(([s, p]) => (
              <Link key={s} href={`/prize/${s}`} style={{
                fontSize: 13,
                color: '#7A7469',
                background: 'rgba(27,25,22,0.03)',
                border: '1px solid rgba(27,25,22,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {p.label}
              </Link>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>
        </div>

      </div>
    </InnerLayout>
  )
}
