import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InnerLayout from '@/components/InnerLayout'
import LogoMark from '@/components/LogoMark'
import { ArticleGrid, FaqList, H2, MEASURE } from '@/components/ArticleLayout'
import {
  DIALSHEET, DIALSHEET_ANSWERS, DIALSHEET_FACTS_READ, DIALSHEET_FACTS_READ_ISO, DIALSHEET_PAGES, DIALSHEET_PATH,
  CLIENT_GUIDES, answerPath, dialsheetHref, type DialsheetAnswer,
} from '@/lib/dialsheet'

/** A plain table in the section's ruled style. The second column is set as a figure. */
export function DsTable({ head, rows, pick, figures }: { head: string[]; rows: React.ReactNode[][]; pick?: number; figures?: boolean }) {
  return (
    <div className="ds-table-wrap">
      <table className={figures ? 'ds-table ds-table-nums' : 'ds-table'}>
        <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i === pick ? 'ds-row-pick' : undefined}>
              {r.map((c, j) => <td key={j}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** A copyable block: a prompt, a formula, a line to say. */
export function DsBlock({ children }: { children: string }) {
  return (
    <pre style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13.5, lineHeight: 1.65, color: '#26231E',
      background: '#F4F2EE', borderLeft: '2px solid #4F46E5',
      padding: '16px 18px', marginBottom: 22, maxWidth: 700,
      whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
    }}>
      {children}
    </pre>
  )
}

/* The DialSheet section: the pages under /dialsheet. DialSheet is the site's
   calling partner, and every page here says so in its label and its small
   print. Prices and links come from src/lib/dialsheet.ts.

   The pages are partner pages, not contest pages, so they do not use
   ArticleHeader: its footer line promises contest facts checked daily, which
   is not what these are. The header band below carries the day DialSheet's
   prices were read instead. */

const BASE = 'https://aifilmcontests.com'

/** The three drawings made for the team-up, in the pack cards' ink style. */
export const COLLAB_ART = {
  fistBump: { src: '/dialsheet/collab-fist-bump.png', width: 1264, height: 848, alt: "Ink drawing: a filmmaker with a clapperboard and a sales rep in a headset bump fists, and the film strip from the filmmaker's bag turns into the rep's telephone cord" },
  call: { src: '/dialsheet/collab-call.png', width: 1024, height: 1024, alt: "Ink drawing: a filmmaker laughing into a telephone from a director's chair, a film reel on their lap, the phone cord turning into a strip of film" },
  team: { src: '/dialsheet/collab-team.png', width: 1264, height: 848, alt: 'Ink drawing: three sales reps in headsets at one desk, two of them mid high five while the third gives a thumbs up without hanging up' },
}

const linkStyle: React.CSSProperties = {
  color: '#4338CA',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(67,56,202,0.35)',
  textUnderlineOffset: 3,
}

/** "AI Film Contests × DialSheet", the two names side by side. */
export function PartnerLockup() {
  return (
    <div className="ds-lockup">
      <LogoMark size={22} />
      <span>AI Film Contests</span>
      <span className="ds-lockup-x" aria-hidden>×</span>
      <span className="ds-wordmark">DialSheet</span>
    </div>
  )
}

/** The one filled button on a DialSheet page. */
export function DialsheetButton({ placement, children }: { placement: string; children: React.ReactNode }) {
  return (
    <a className="btn ds-btn" href={dialsheetHref(placement)} target="_blank" rel="noopener">
      {children}
    </a>
  )
}

/** A DialSheet link inside a sentence. The anchor is the brand name. */
export function DialsheetLink({ placement, path, children = DIALSHEET.name }: { placement: string; path?: string; children?: React.ReactNode }) {
  return <a href={dialsheetHref(placement, path)} target="_blank" rel="noopener" style={linkStyle}>{children}</a>
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} style={linkStyle}>{children}</Link>
}

/** What the relationship is and where the prices came from. On every page. */
export function PartnerSmallPrint() {
  return (
    <p className="ds-small">
      DialSheet is AI Film Contests&apos; calling partner. The prices on this page are DialSheet&apos;s own, read on{' '}
      {DIALSHEET_FACTS_READ}. Check dialsheet.io for today&apos;s.
    </p>
  )
}

export function DsP({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 17, lineHeight: 1.75, color: '#3E3A33', marginBottom: 18, maxWidth: MEASURE }}>{children}</p>
}

export function DsList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ maxWidth: MEASURE, marginBottom: 18, paddingLeft: 20, listStyle: 'disc' }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 17, lineHeight: 1.7, color: '#3E3A33', marginBottom: 8 }}>{it}</li>
      ))}
    </ul>
  )
}

/** A feature with the plan it is on. `plan` is left out when DialSheet does not tie it to one. */
export interface Feature { name: string; plan?: string; text: string }
export function FeatureList({ items }: { items: Feature[] }) {
  return (
    <dl className="ds-features">
      {items.map(f => (
        <div className="ds-feature" key={f.name}>
          <dt>
            {f.name}
            {f.plan && <span className="ds-plan">{f.plan}</span>}
          </dt>
          <dd>{f.text}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Card links to the three client-getting guides or the three DialSheet pages. */
export function CardRow({ items, tints }: { items: ReadonlyArray<{ path: string; title: string; blurb: string }>; tints: string[] }) {
  return (
    <div className="pack-grid">
      {items.map((it, i) => (
        <Link key={it.path} href={it.path} className={`pack-item ds-card ${tints[i % tints.length]}`}>
          <span className="ds-card-title">{it.title}</span>
          <span className="ds-card-blurb">{it.blurb}</span>
          <span className="ds-card-more">Read it →</span>
        </Link>
      ))}
    </div>
  )
}

/** The answer pages of one group, as a ruled list of links, two to a row. */
export function AnswerList({ group }: { group: DialsheetAnswer['group'] }) {
  return (
    <dl className="ds-facts">
      {DIALSHEET_ANSWERS.filter(a => a.group === group).map(a => (
        <div className="ds-fact" key={a.slug}>
          <dt><Link href={answerPath(a.slug)} className="ds-answer-link">{a.title}</Link></dt>
          <dd>{a.blurb}</dd>
        </div>
      ))}
    </dl>
  )
}

export interface DsSection { h: string; body: React.ReactNode }
export interface DsFaq { q: string; a: string }

/** One long page in the DialSheet section: header band, prose with a contents
    rail, the FAQ, the way on to DialSheet and the rest of the section. */
export function DialsheetArticle({
  slug, label, title, standfirst, sections, faqs, placement, art, related,
}: {
  slug: string
  label: string
  title: string
  standfirst: string
  sections: DsSection[]
  faqs: DsFaq[]
  placement: string
  art?: { src: string; width: number; height: number; alt: string }
  /** Slugs of answer pages to list first under "More on DialSheet". */
  related?: string[]
}) {
  const url = `${BASE}${DIALSHEET_PATH}/${slug}`
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: standfirst,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'AI Film Contests', url: BASE },
    publisher: { '@type': 'Organization', name: 'AI Film Contests', url: BASE },
    datePublished: DIALSHEET_FACTS_READ_ISO,
    dateModified: DIALSHEET_FACTS_READ_ISO,
    about: {
      '@type': 'SoftwareApplication',
      name: DIALSHEET.name,
      url: DIALSHEET.url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro, per seat per month', price: String(DIALSHEET.proUsd), priceCurrency: 'USD' },
      ],
    },
  }
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  // The pages this one names as next, then the section's three main pages.
  const relatedAnswers = (related ?? [])
    .map(s => DIALSHEET_ANSWERS.find(a => a.slug === s))
    .filter((a): a is DialsheetAnswer => Boolean(a))
    .map(a => ({ path: answerPath(a.slug), title: a.title }))
  const others = [
    ...relatedAnswers,
    ...DIALSHEET_PAGES.filter(p => p.path !== `${DIALSHEET_PATH}/${slug}`).map(p => ({ path: p.path, title: p.title })),
  ]

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-5 py-12">
        <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={DIALSHEET_PATH} className="link-muted">DialSheet</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#8B867C' }}>{title}</span>
        </p>

        <header className="ds-band">
          <PartnerLockup />
          <p className="ds-label">{label}</p>
          <h1 className="ds-h1">{title}</h1>
          <p className="ds-standfirst">{standfirst}</p>
          <div className="ds-actions">
            <DialsheetButton placement={`${placement}-top`}>Try DialSheet free →</DialsheetButton>
            <span className="ds-read">DialSheet&apos;s prices, read {DIALSHEET_FACTS_READ}</span>
          </div>
        </header>

        <ArticleGrid headings={sections.map(s => s.h)}>
          {sections.map((s, i) => (
            <section key={i}>
              <H2>{s.h}</H2>
              {s.body}
              {art && i === 0 && (
                <div className="ds-art ds-art-inline">
                  <Image src={art.src} width={art.width} height={art.height} alt={art.alt} sizes="(max-width: 760px) 100vw, 700px" />
                </div>
              )}
            </section>
          ))}
        </ArticleGrid>

        <section style={{ borderTop: '1px solid rgba(27,25,22,0.05)', paddingTop: 32, marginTop: 24, marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
            color: '#1B1916', marginBottom: 24, letterSpacing: '-0.01em',
          }}>
            Frequently Asked Questions
          </h2>
          <FaqList items={faqs.map(f => ({ q: f.q, a: f.a }))} />
        </section>

        <section className="pack-claim" style={{ marginBottom: 40 }}>
          <div style={{ maxWidth: 520 }}>
            <h2 className="ds-cta-title">Start on the free plan</h2>
            <p className="ds-cta-text">
              One person, a list of up to {DIALSHEET.freeLeads} leads and {DIALSHEET.freeCallsPerMonth} calls a month.
              Add teammates at ${DIALSHEET.proUsd} a seat when you need them.
            </p>
          </div>
          <DialsheetButton placement={`${placement}-bottom`}>Try DialSheet free →</DialsheetButton>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 className="ds-section-label">More on DialSheet</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {others.map(p => (
              <Link key={p.path} href={p.path} className="link-muted" style={{ fontSize: 14 }}>→ {p.title}</Link>
            ))}
            <Link href={DIALSHEET_PATH} className="link-muted" style={{ fontSize: 14 }}>→ AI Film Contests and DialSheet: what the team-up is</Link>
            <Link href={CLIENT_GUIDES[0].path} className="link-muted" style={{ fontSize: 14 }}>→ {CLIENT_GUIDES[0].title}</Link>
          </div>
        </section>

        <PartnerSmallPrint />
      </div>
    </InnerLayout>
  )
}

export function dialsheetMetadata(slug: string, title: string, description: string) {
  const url = `${BASE}${DIALSHEET_PATH}${slug ? `/${slug}` : ''}`
  return {
    title: `${title} | AI Film Contests`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'AI Film Contests', type: 'article' as const },
    twitter: { card: 'summary_large_image' as const, title, description },
  }
}
