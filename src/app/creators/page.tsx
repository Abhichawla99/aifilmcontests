import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { creators } from '@/data/creators'

const BASE = 'https://aifilmcontests.com'

export const metadata: Metadata = {
  title: 'Featured AI Filmmakers & Studios | AI Film Contests',
  description:
    'Profiles of the studios and filmmakers making AI film work — what they make, where they are, and where to watch their films.',
  openGraph: {
    title: 'Featured AI Filmmakers & Studios',
    description: 'Profiles of the studios and filmmakers making AI film work.',
    url: `${BASE}/creators`,
    siteName: 'AI Film Contests',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured AI Filmmakers & Studios',
    description: 'Profiles of the studios and filmmakers making AI film work.',
  },
  alternates: { canonical: `${BASE}/creators` },
}

const MAILTO =
  'mailto:hello@aifilmcontests.com?subject=' +
  encodeURIComponent('Feature me on AI Film Contests')

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: '#52525b',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 16,
}

export default function CreatorsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured AI filmmakers and studios',
    url: `${BASE}/creators`,
    numberOfItems: creators.length,
    itemListElement: creators.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE}/creators/${c.slug}`,
      description: c.oneLiner,
    })),
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>Featured Creators</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f4f4f5',
            marginBottom: 16,
          }}>
            Featured AI filmmakers &amp; studios
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, maxWidth: 680 }}>
            The contests are one half of this site. These are the people entering them —
            studios and independent filmmakers working with generative video, with a page you can
            actually send someone. Every profile is written from the creator&apos;s own site.
          </p>
        </div>

        {/* Grid */}
        <section style={{ marginBottom: 44 }}>
          <h2 style={sectionLabel}>
            {creators.length === 1 ? '1 Creator' : `${creators.length} Creators`}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {creators.map(c => (
              <Link key={c.slug} href={`/creators/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '20px 22px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{
                    alignSelf: 'flex-start',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#a5b4fc',
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.22)',
                    borderRadius: 999,
                    padding: '3px 9px',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                    {c.type === 'studio' ? 'Studio' : 'Filmmaker'}
                  </span>
                  <div className="card-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 17, color: '#f4f4f5' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#52525b' }}>{c.location}</div>
                  <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, margin: 0, flex: 1 }}>{c.oneLiner}</p>
                  <span className="card-cta" style={{ fontSize: 13, fontWeight: 600, color: '#818cf8' }}>
                    View profile <span className="card-arrow" style={{ display: 'inline-block' }}>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Get featured */}
        <section className="card" style={{ padding: '24px 26px', marginBottom: 44 }}>
          <h2 style={{ ...sectionLabel, marginBottom: 10 }}>Get featured</h2>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 620 }}>
            Making AI film work and want a profile here? Send us your site and two or three
            links to finished pieces. Profiles are free and written from your own site — we
            don&apos;t make anything up.
          </p>
          <a href={MAILTO} style={{
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
          }}>
            Get featured →
          </a>
        </section>

        {/* Subscribe */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginBottom: 32 }}>
          <h2 style={sectionLabel}>Never miss a deadline</h2>
          <EmailSubscribe compact />
        </section>

        <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>

      </div>
    </InnerLayout>
  )
}
