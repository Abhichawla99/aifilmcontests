import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'
import { ArticleHeader, ArticleGrid, H2, P, FaqList, readingMinutes, splitStandfirst } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { GUIDES } from '@/lib/content/guides'

export const revalidate = 900


const OTHER_GUIDES = Object.keys(GUIDES)

export async function generateStaticParams() {
  return Object.keys(GUIDES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES[slug]
  if (!guide) return { title: 'Not Found' }

  return {
    title: `${guide.title} | AI Film Contests`,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://aifilmcontests.com/guide/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description },
    alternates: { canonical: `https://aifilmcontests.com/guide/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = GUIDES[slug]
  if (!guide) notFound()

  const all = await getAllContests()
  const openContests = all.filter(c => c.status === 'open').slice(0, 4)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `https://aifilmcontests.com/guide/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'AI Film Contests Editorial',
      url: 'https://aifilmcontests.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Film Contests',
      url: 'https://aifilmcontests.com',
    },
    datePublished: guide.datePublished ?? '2026-01-01',
    dateModified: guide.datePublished ?? new Date().toISOString().slice(0, 10),
    mainEntityOfPage: `https://aifilmcontests.com/guide/${slug}`,
  }

  const faqLd = guide.faqs && guide.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  const itemListLd = openContests.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: guide.title,
    itemListElement: openContests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      name: c.name,
    })),
  } : null

  const otherGuides = OTHER_GUIDES.filter(s => s !== slug).slice(0, 5)
  const guideLead = splitStandfirst(guide.intro)

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}

      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/guide" className="link-muted">Guides</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>{guide.title}</span>
        </p>

        <ArticleHeader
          slug={slug}
          kind="Guide"
          title={guide.title}
          standfirst={guideLead.lead}
          updated={guide.datePublished ? new Date(guide.datePublished).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
          minutes={readingMinutes(guide.sections.map(x => x.body).join(' '))}
        />

        <ArticleGrid headings={guide.sections.map(x => x.h)}>
          {guideLead.rest && <P>{guideLead.rest}</P>}
          {guide.sections.map((section, i) => (
            <section key={i}>
              <H2>{section.h}</H2>
              <P>{section.body}</P>
            </section>
          ))}
        </ArticleGrid>

        {/* FAQ */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#1B1916',
              marginBottom: 24,
              letterSpacing: '-0.01em',
            }}>
              Frequently Asked Questions
            </h2>
            <FaqList items={guide.faqs.map(f => ({ q: f.q, a: f.a }))} />
          </section>
        )}

        {/* Ruminatex callout */}
        {guide.ruminatex && guide.ruminatexNote && (
          <div style={{
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            padding: '24px 28px',
            marginBottom: 56,
          }}>
            <p style={{ fontSize: 13, color: '#7A7469', lineHeight: 1.65, marginBottom: 12 }}>
              {guide.ruminatexNote}
            </p>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#4338CA',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Visit Ruminatex →
            </a>
          </div>
        )}

        {/* Related open contests */}
        {openContests.length > 0 && (
          <section style={{ marginBottom: 56 }}>
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

        {/* Related guides */}
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
            More Guides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {otherGuides.map(s => (
              <Link key={s} href={`/guide/${s}`} className="link-muted" style={{ fontSize: 14 }}>
                → {GUIDES[s].title}
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
