import { notFound } from 'next/navigation'
import { ArticleHeader } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'
import { VS_PAGES } from '@/lib/content/vs-pages'

export const revalidate = 900

export async function generateStaticParams() {
  return Object.keys(VS_PAGES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = VS_PAGES[slug]
  if (!page) return { title: 'Not Found' }

  return {
    title: `${page.title} | AI Film Contests`,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://aifilmcontests.com/vs/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    alternates: { canonical: `https://aifilmcontests.com/vs/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function VSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = VS_PAGES[slug]
  if (!page) notFound()

  const all = await getAllContests()
  const openContests = all.filter(c => c.status === 'open').slice(0, 4)

  const jsonLd = page.type === 'pairwise'
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: page.title,
        description: page.description,
        url: `https://aifilmcontests.com/vs/${slug}`,
        mainEntity: page.criteria.map(criterion => ({
          '@type': 'Question',
          name: `${criterion.label}: ${page.toolA.name} vs ${page.toolB.name}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${page.toolA.name}: ${criterion.a} — ${page.toolB.name}: ${criterion.b}`,
          },
        })),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: page.title,
        description: page.description,
        url: `https://aifilmcontests.com/vs/${slug}`,
        numberOfItems: page.tools.length,
        itemListElement: page.tools.map(t => ({
          '@type': 'ListItem',
          position: t.rank,
          name: t.name,
          url: `https://aifilmcontests.com/tools/${t.slug}`,
          description: t.why,
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
          <Link href="/vs" className="link-muted">Compare</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>{page.title}</span>
        </p>

        <ArticleHeader
          slug={slug}
          kind="Compare"
          title={page.title}
          standfirst={page.description}
        />

        {/* Pairwise comparison */}
        {page.type === 'pairwise' && (
          <>
            {/* Tool headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 0,
              marginBottom: 0,
              borderRadius: '14px 14px 0 0',
              overflow: 'hidden',
              border: '1px solid rgba(27,25,22,0.06)',
            }}>
              <div style={{ background: 'rgba(27,25,22,0.02)', padding: '16px 20px', borderRight: '1px solid rgba(27,25,22,0.06)' }}>
                <span style={{ fontSize: 12, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Criteria</span>
              </div>
              <div style={{
                background: `rgba(${parseInt(page.toolA.color.slice(1, 3), 16)},${parseInt(page.toolA.color.slice(3, 5), 16)},${parseInt(page.toolA.color.slice(5, 7), 16)},0.12)`,
                padding: '16px 20px',
                borderRight: '1px solid rgba(27,25,22,0.06)',
                textAlign: 'center',
              }}>
                <Link href={`/tools/${page.toolA.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#1B1916', textDecoration: 'none' }}>
                  {page.toolA.name}
                </Link>
              </div>
              <div style={{
                background: `rgba(${parseInt(page.toolB.color.slice(1, 3), 16)},${parseInt(page.toolB.color.slice(3, 5), 16)},${parseInt(page.toolB.color.slice(5, 7), 16)},0.12)`,
                padding: '16px 20px',
                textAlign: 'center',
              }}>
                <Link href={`/tools/${page.toolB.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#1B1916', textDecoration: 'none' }}>
                  {page.toolB.name}
                </Link>
              </div>
            </div>

            {/* Comparison rows */}
            <div style={{
              border: '1px solid rgba(27,25,22,0.06)',
              borderTop: 'none',
              borderRadius: '0 0 14px 14px',
              overflow: 'hidden',
              marginBottom: 40,
            }}>
              {page.criteria.map((row, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  borderTop: i > 0 ? '1px solid rgba(27,25,22,0.04)' : undefined,
                }}>
                  <div style={{ padding: '16px 20px', background: 'rgba(27,25,22,0.01)', borderRight: '1px solid rgba(27,25,22,0.04)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#7A7469', fontFamily: 'Space Grotesk, sans-serif' }}>{row.label}</span>
                  </div>
                  <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(27,25,22,0.04)' }}>
                    <p style={{ fontSize: 13, color: '#7A7469', lineHeight: 1.6 }}>{row.a}</p>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p style={{ fontSize: 13, color: '#7A7469', lineHeight: 1.6 }}>{row.b}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div style={{
              border: '1px solid rgba(27,25,22,0.08)',
              borderRadius: 14,
              background: 'rgba(27,25,22,0.02)',
              padding: '24px 28px',
              marginBottom: 48,
            }}>
              <p style={{ fontSize: 12, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Verdict</p>
              <p style={{ fontSize: 15, color: '#6F6A61', lineHeight: 1.7 }}>{page.verdict}</p>
            </div>

            {/* Tool links */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
              <Link href={`/tools/${page.toolA.slug}`} style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#4338CA',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                textDecoration: 'none',
              }}>
                {page.toolA.name} Contests →
              </Link>
              <Link href={`/tools/${page.toolB.slug}`} style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#4338CA',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                textDecoration: 'none',
              }}>
                {page.toolB.name} Contests →
              </Link>
            </div>
          </>
        )}

        {/* Ranked list */}
        {page.type === 'ranked' && (
          <>
            <p style={{ fontSize: 16, color: '#7A7469', lineHeight: 1.75, maxWidth: 720, marginBottom: 40 }}>
              {page.body}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
              {page.tools.map(tool => (
                <div key={tool.rank} style={{
                  border: '1px solid rgba(27,25,22,0.06)',
                  borderRadius: 14,
                  background: '#FFFFFF',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: tool.rank === 1 ? 'rgba(79,70,229,0.15)' : 'rgba(27,25,22,0.04)',
                    border: tool.rank === 1 ? '1px solid rgba(79,70,229,0.25)' : '1px solid rgba(27,25,22,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: tool.rank === 1 ? '#4338CA' : '#8B867C',
                    }}>
                      {tool.rank}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <Link href={`/tools/${tool.slug}`} style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#1B1916',
                        textDecoration: 'none',
                      }}>
                        {tool.name}
                      </Link>
                    </div>
                    <p style={{ fontSize: 14, color: '#7A7469', lineHeight: 1.6 }}>{tool.why}</p>
                  </div>
                  <Link href={`/tools/${tool.slug}`} style={{
                    fontSize: 12,
                    color: '#8B867C',
                    textDecoration: 'none',
                    flexShrink: 0,
                    marginTop: 4,
                  }}>
                    View contests →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ruminatex callout */}
        {page.ruminatex && page.ruminatexNote && (
          <div style={{
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            padding: '24px 28px',
            marginBottom: 48,
          }}>
            <p style={{ fontSize: 13, color: '#7A7469', lineHeight: 1.65, marginBottom: 12 }}>
              {page.ruminatexNote}
            </p>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }}
            >
              Visit Ruminatex →
            </a>
          </div>
        )}

        {/* Related open contests */}
        {openContests.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#8B867C',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Open Contests Right Now
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openContests.map(c => {
                const dl = daysLeft(c.deadline)
                const isUrgent = dl <= 7
                return (
                  <Link key={c.id} href={`/contests/${c.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="dot dot-open live" />
                          {isUrgent && <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>{dl}d left</span>}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#1B1916', marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#8B867C' }}>{c.organizer}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, color: '#4338CA', fontSize: 14 }}>{c.prize}</div>
                        <div style={{ fontSize: 12, color: '#8B867C', marginTop: 2 }}>Due {fmt(c.deadline)}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href="/" className="link-muted" style={{ fontSize: 13 }}>View all open contests →</Link>
            </div>
          </section>
        )}

        {/* Deadline alerts */}
        <section style={{ marginBottom: 48 }}>
          <EmailSubscribe compact openCount={all.filter(c => c.status === 'open').length} />
        </section>

        {/* Other comparisons */}
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
            More Comparisons
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(VS_PAGES).filter(([s]) => s !== slug).map(([s, p]) => (
              <Link key={s} href={`/vs/${s}`} style={{
                fontSize: 13,
                color: '#7A7469',
                background: 'rgba(27,25,22,0.03)',
                border: '1px solid rgba(27,25,22,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {p.title.split(':')[0]}
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
