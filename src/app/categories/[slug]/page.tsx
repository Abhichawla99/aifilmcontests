import { notFound } from 'next/navigation'
import ContestCard from '@/components/ContestCard'
import { ArticleHeader } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import SiteFooter from '@/components/SiteFooter'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import { CATEGORIES, contestHasCategorySlug } from '@/lib/content/categories'

export const revalidate = 900

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) return { title: 'Not Found' }

  const title = `${cat.label} Contests & Festivals 2026 | AI Film Contests`
  const description = `${cat.description} Find every open ${cat.label.toLowerCase()} competition, verified deadlines, prize info, and eligibility requirements.`

  return {
    title,
    description,
    keywords: cat.keywords,
    openGraph: {
      title,
      description,
      url: `https://aifilmcontests.com/categories/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://aifilmcontests.com/categories/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) notFound()

  const all = await getAllContests()
  const contests = all.filter(c => contestHasCategorySlug(c.categories, slug))
  const open = contests.filter(c => c.status === 'open')
  const upcoming = contests.filter(c => c.status === 'upcoming')
  const closed = contests.filter(c => c.status === 'closed')

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  function daysLeft(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
  }

  // JSON-LD ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label} Contests 2026`,
    description: cat.description,
    numberOfItems: open.length,
    itemListElement: open.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      description: c.description,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: '#FBFAF8', minHeight: '100vh' }}>

        {/* Nav */}
        <header style={{ borderBottom: '1px solid rgba(27,25,22,0.06)' }}>
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>AI</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#26231E' }}>AI Film Contests</span>
            </Link>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← All contests</Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 py-12">

          {/* Breadcrumb */}
          <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/categories" className="link-muted">Categories</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#8B867C' }}>{cat.label}</span>
          </p>

          <ArticleHeader
            slug={slug}
            kind="Category"
            title={`${cat.label} Contests & Festivals`}
            standfirst={cat.description}
            meta={[`${open.length} open now`, `${upcoming.length} coming soon`, `${closed.length} closed`]}
          />


          {/* Open contests */}
          {open.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Open Now
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {open.map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
            </section>
          )}

          {/* Upcoming contests */}
          {upcoming.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Coming Soon
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {upcoming.map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
            </section>
          )}

          {/* No contests */}
          {open.length === 0 && upcoming.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8B867C' }}>
              <p style={{ fontSize: 15, marginBottom: 16 }}>No {cat.label.toLowerCase()} contests open right now.</p>
              <Link href="/" className="link-muted" style={{ fontSize: 13 }}>Browse all contests →</Link>
            </div>
          )}

          {/* Deadline alerts */}
          <section style={{ marginBottom: 48 }}>
            <EmailSubscribe compact openCount={all.filter(c => c.status === 'open').length} />
          </section>

          {/* Other categories */}
          <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginTop: 8 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Browse by Category
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(CATEGORIES).filter(([s]) => s !== slug).map(([s, c]) => (
                <Link key={s} href={`/categories/${s}`} style={{
                  fontSize: 13,
                  color: '#7A7469',
                  background: 'rgba(27,25,22,0.03)',
                  border: '1px solid rgba(27,25,22,0.07)',
                  borderRadius: 6,
                  padding: '5px 12px',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}>
                  {c.label}
                </Link>
              ))}
            </div>
          </section>

          <div style={{ marginTop: 40 }}>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>
          </div>

        </main>

        <SiteFooter container="max-w-4xl" />

      </div>
    </>
  )
}
