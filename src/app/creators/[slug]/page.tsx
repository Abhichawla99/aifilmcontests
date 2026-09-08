import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { creators, getCreator } from '@/data/creators'
import { getContestById } from '@/lib/contests-db'

const BASE = 'https://aifilmcontests.com'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return creators.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getCreator(slug)
  if (!c) return { title: 'Not Found' }

  const title = `${c.name} — ${c.type === 'studio' ? 'AI film studio' : 'AI filmmaker'} in ${c.location} | AI Film Contests`
  const description = `${c.oneLiner} Work, links and where to find ${c.name}.`

  return {
    title,
    description,
    openGraph: { title, description, url: `${BASE}/creators/${c.slug}`, siteName: 'AI Film Contests' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${BASE}/creators/${c.slug}` },
  }
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: '#52525b',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 16,
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default async function CreatorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCreator(slug)
  if (!c) notFound()

  // Only contests that actually exist in the directory get linked.
  const entered = (
    await Promise.all((c.contests ?? []).map(id => getContestById(id)))
  ).filter((x): x is NonNullable<typeof x> => Boolean(x))

  const mailto =
    'mailto:hello@aifilmcontests.com?subject=' +
    encodeURIComponent('Feature me on AI Film Contests')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': c.type === 'studio' ? 'Organization' : 'Person',
    name: c.name,
    url: c.website,
    description: c.bio,
    ...(c.type === 'studio'
      ? { address: { '@type': 'PostalAddress', addressLocality: c.location } }
      : { homeLocation: { '@type': 'Place', name: c.location } }),
    sameAs: [`${BASE}/creators/${c.slug}`],
    subjectOf: c.workLinks.map(w => ({ '@type': 'VideoObject', name: w.title, url: w.url })),
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/creators" className="link-muted">Featured Creators</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{c.name}</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#a5b4fc',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.22)',
            borderRadius: 999,
            padding: '4px 10px',
            fontFamily: 'Space Grotesk, sans-serif',
            marginBottom: 16,
          }}>
            Featured creator
          </span>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f4f4f5',
            marginBottom: 12,
          }}>
            {c.name}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: 13, color: '#52525b', marginBottom: 18 }}>
            <span>{c.type === 'studio' ? 'Studio' : 'Filmmaker'}</span>
            <span>·</span>
            <span>{c.location}</span>
            <span>·</span>
            <span>Featured since {fmt(c.featuredSince)}</span>
          </div>

          <p style={{ fontSize: 16, color: '#a1a1aa', lineHeight: 1.75, maxWidth: 680, marginBottom: 20 }}>
            {c.bio}
          </p>

          <a
            href={c.website}
            target="_blank"
            rel="noopener"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 0 24px -4px rgba(99,102,241,0.45)',
            }}
          >
            Visit {c.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} →
          </a>
        </div>

        {/* Tags */}
        {c.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            {c.tags.map(t => (
              <span key={t} style={{
                fontSize: 12,
                color: '#71717a',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
              }}>
                {t.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Work */}
        {c.workLinks.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={sectionLabel}>Selected work</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.workLinks.map(w => (
                <a key={w.url} href={w.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="card-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5' }}>
                        {w.title}
                      </div>
                      {w.client && <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>{w.client}</div>}
                    </div>
                    <span className="card-cta" style={{ fontSize: 13, fontWeight: 600, color: '#818cf8', whiteSpace: 'nowrap' }}>
                      Watch <span className="card-arrow" style={{ display: 'inline-block' }}>→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contests entered */}
        {entered.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={sectionLabel}>Contests in this directory</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entered.map(ct => (
                <Link key={ct.id} href={`/contests/${ct.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="card-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5' }}>{ct.name}</div>
                      <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>{ct.organizer}</div>
                    </div>
                    <span className="card-cta" style={{ fontSize: 13, fontWeight: 600, color: '#818cf8', whiteSpace: 'nowrap' }}>
                      View contest <span className="card-arrow" style={{ display: 'inline-block' }}>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Get featured */}
        <section className="card" style={{ padding: '24px 26px', marginBottom: 40 }}>
          <h2 style={{ ...sectionLabel, marginBottom: 10 }}>Get featured</h2>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 620 }}>
            Want a profile like this one? Send your site and two or three links to finished
            pieces. Profiles are free and written from your own site.
          </p>
          <a href={mailto} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#d4d4d8',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            Email us to get featured →
          </a>
        </section>

        {/* Subscribe */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginBottom: 32 }}>
          <h2 style={sectionLabel}>Never miss a deadline</h2>
          <EmailSubscribe compact />
        </section>

        <Link href="/creators" className="link-muted" style={{ fontSize: 13 }}>← All featured creators</Link>

      </div>
    </InnerLayout>
  )
}
