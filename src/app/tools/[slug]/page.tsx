import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import ContestCard from '@/components/ContestCard'
import { ArticleHeader } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import SiteFooter from '@/components/SiteFooter'
import { TOOLS } from '@/lib/content/tools'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return Object.keys(TOOLS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = TOOLS[slug]
  if (!tool) return { title: 'Not Found' }

  const title = `${tool.name} Film Contests & Competitions 2026 | AI Film Contests`
  const description = `${tool.tagline}. ${tool.description.slice(0, 140)}`

  return {
    title,
    description,
    keywords: tool.keywords,
    openGraph: { title, description, url: `https://aifilmcontests.com/tools/${slug}`, siteName: 'AI Film Contests' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://aifilmcontests.com/tools/${slug}` },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = TOOLS[slug]
  if (!tool) notFound()

  const all = await getAllContests()

  // Match contests that mention this tool in ai_tools_allowed
  const matching = all.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return tool.matchTerms.some(t => toolsStr.includes(t)) ||
      toolsStr.includes('any ai tools') ||
      toolsStr.includes('any generative')
  })

  // Separate "specifically mentions tool" vs "any AI tools accepted"
  const specific = matching.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return tool.matchTerms.some(t => toolsStr.includes(t))
  })
  const anyTools = matching.filter(c => {
    const toolsStr = (c.aiToolsAllowed ?? []).join(' ').toLowerCase()
    return !tool.matchTerms.some(t => toolsStr.includes(t))
  })

  const open = matching.filter(c => c.status === 'open')
  const upcoming = matching.filter(c => c.status === 'upcoming')

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  function daysLeft(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tool.name} Film Contests 2026`,
    description: tool.description,
    numberOfItems: open.length,
    itemListElement: open.slice(0, 10).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
    })),
  }


  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ background: '#FBFAF8', minHeight: '100vh' }}>
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

          <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/" className="link-muted">Tools</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#8B867C' }}>{tool.name}</span>
          </p>

          <ArticleHeader
            slug={slug}
            kind="Tool"
            title={`${tool.name} Film Contests 2026`}
            standfirst={tool.description}
            meta={[`${open.length} open now`, `${upcoming.length} coming soon`]}
          />

          {/* Specifically requires this tool */}
          {specific.filter(c => c.status !== 'closed').length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                {tool.name} Required or Featured
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {specific.filter(c => c.status !== 'closed').map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
            </section>
          )}

          {/* Any AI tools accepted (includes this tool) */}
          {anyTools.filter(c => c.status !== 'closed').length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Also Accepts {tool.name}
              </h2>
              <p style={{ fontSize: 13, color: '#A8A296', marginBottom: 14 }}>These contests accept any AI tools — {tool.name} included.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {anyTools.filter(c => c.status !== 'closed').slice(0, 9).map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
            </section>
          )}

          {/* Deadline alerts */}
          <section style={{ marginBottom: 48 }}>
            <EmailSubscribe compact openCount={all.filter(c => c.status === 'open').length} />
          </section>

          {/* Other tools */}
          <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginTop: 8 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Browse by AI Tool
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(TOOLS).filter(([s]) => s !== slug).map(([s, t]) => (
                <Link key={s} href={`/tools/${s}`} style={{ fontSize: 13, color: '#7A7469', background: 'rgba(27,25,22,0.03)', border: '1px solid rgba(27,25,22,0.07)', borderRadius: 6, padding: '5px 12px', textDecoration: 'none' }}>
                  {t.name}
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
