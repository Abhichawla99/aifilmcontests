import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import InnerLayout from '@/components/InnerLayout'
import { ArticleHeader, ArticleGrid, H2, P, MEASURE, readingMinutes, splitStandfirst } from '@/components/ArticleLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { CRAFT_GUIDES, CRAFT_GUIDE_ORDER } from '@/data/craft-guides'

/* Craft guides: long-form how-to pages for filmmakers doing brand and
   commercial work. Same editorial shell as /guide/[slug], plus inline links,
   because these pages point readers at specific contests, rules and tools.
   Each guide lives at its own static route, src/app/guide/<slug>/page.tsx,
   so the existing /guide/[slug] registry is left untouched.

   Body text is markdown-lite:
   - a blank line starts a new paragraph
   - lines that all start with "- " make a list
   - a block fenced with ``` is a copyable template
   - [anchor](/path) is an internal link, [anchor](https://...) opens in a
     new tab with rel="noopener" */

const BASE = 'https://aifilmcontests.com'
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g

const linkStyle: React.CSSProperties = {
  color: '#4338CA',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(67,56,202,0.35)',
  textUnderlineOffset: 3,
}

function stripLinks(text: string) {
  return text.replace(LINK_RE, '$1')
}

function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(LINK_RE.source, 'g')
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [, anchor, href] = m
    out.push(
      href.startsWith('/')
        ? <Link key={m.index} href={href} style={linkStyle}>{anchor}</Link>
        : <a key={m.index} href={href} target="_blank" rel="noopener" style={linkStyle}>{anchor}</a>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

function Blocks({ body }: { body: string }) {
  const blocks = body.split('\n\n').map(b => b.trim()).filter(Boolean)
  return (
    <>
      {blocks.map((b, i) => {
        if (b.startsWith('```')) {
          const code = b.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
          return (
            <pre key={i} style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13.5, lineHeight: 1.65, color: '#26231E',
              background: '#F4F2EE', borderLeft: '2px solid #4F46E5',
              padding: '16px 18px', marginBottom: 22, maxWidth: MEASURE,
              whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
            }}>
              {code}
            </pre>
          )
        }
        const lines = b.split('\n')
        if (lines.every(l => l.startsWith('- '))) {
          return (
            <ul key={i} style={{ maxWidth: MEASURE, marginBottom: 18, paddingLeft: 20, listStyle: 'disc' }}>
              {lines.map((l, j) => (
                <li key={j} style={{ fontSize: 17, lineHeight: 1.7, color: '#3E3A33', marginBottom: 8 }}>
                  <Inline text={l.slice(2)} />
                </li>
              ))}
            </ul>
          )
        }
        return <P key={i}><Inline text={b} /></P>
      })}
    </>
  )
}

export function craftGuideMetadata(slug: string): Metadata {
  const g = CRAFT_GUIDES[slug]
  if (!g) return { title: 'Not Found' }
  const url = `${BASE}/guide/${slug}`
  return {
    title: `${g.title} | AI Film Contests`,
    description: g.description,
    keywords: g.keywords,
    openGraph: { title: g.title, description: g.description, url, siteName: 'AI Film Contests', type: 'article' },
    twitter: { card: 'summary_large_image', title: g.title, description: g.description },
    alternates: { canonical: url },
  }
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

export function CraftGuidePage({ slug }: { slug: string }) {
  const g = CRAFT_GUIDES[slug]
  const url = `${BASE}/guide/${slug}`
  // The first intro paragraph carries no links (the header prints it as plain
  // text); any later paragraphs render with links like the body.
  const introParas = g.intro.split('\n\n').map(p => p.trim()).filter(Boolean)
  const lead = splitStandfirst(stripLinks(introParas[0] ?? ''))
  const introRest = [lead.rest, ...introParas.slice(1)].filter(Boolean).join('\n\n')
  const words = stripLinks([g.intro, ...g.sections.map(s => s.body)].join(' '))

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'AI Film Contests Editorial', url: BASE },
    publisher: { '@type': 'Organization', name: 'AI Film Contests', url: BASE },
    datePublished: g.datePublished,
    dateModified: g.dateModified ?? g.datePublished,
    keywords: g.keywords,
  }
  const faqLd = g.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: stripLinks(f.a) },
    })),
  } : null

  const series = CRAFT_GUIDE_ORDER.filter(s => s !== slug && CRAFT_GUIDES[s])

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <div className="max-w-5xl mx-auto px-5 py-12">
        <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span className="link-muted" style={{ cursor: 'default' }}>Guides</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>{g.title}</span>
        </p>

        <ArticleHeader
          slug={slug}
          kind="Guide"
          title={g.title}
          standfirst={lead.lead}
          updated={new Date(`${g.dateModified ?? g.datePublished}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
          minutes={readingMinutes(words)}
        />

        <ArticleGrid headings={g.sections.map(s => s.h)}>
          {introRest && <Blocks body={introRest} />}
          {g.sections.map((s, i) => (
            <section key={i}>
              <H2>{s.h}</H2>
              <Blocks body={s.body} />
            </section>
          ))}
        </ArticleGrid>

        {g.faqs.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginTop: 24, marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
              color: '#1B1916', marginBottom: 24, letterSpacing: '-0.01em',
            }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {g.faqs.map((f, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, color: '#26231E', marginBottom: 8 }}>
                    {f.q}
                  </h3>
                  <p style={{ fontSize: 14, color: '#6F6A61', lineHeight: 1.7, maxWidth: 720 }}>
                    <Inline text={f.a} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {g.related.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={sectionLabel}>{g.relatedTitle ?? 'Where to enter the work'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.related.map(r => (
                <Link key={r.href} href={r.href} className="link-muted" style={{ fontSize: 14 }}>
                  → {r.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 48 }}>
          <EmailSubscribe compact />
        </section>

        <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginBottom: 40 }}>
          <h2 style={sectionLabel}>More guides for commercial AI work</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {series.map(s => (
              <Link key={s} href={`/guide/${s}`} className="link-muted" style={{ fontSize: 14 }}>
                → {CRAFT_GUIDES[s].title}
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
