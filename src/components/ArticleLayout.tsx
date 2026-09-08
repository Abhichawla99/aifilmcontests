import React from 'react'
import { tintForSlug } from '@/lib/theme'

/* The editorial shell shared by /guide and /topics.
   Two jobs: keep prose at a readable measure, and give a long article a spine
   you can navigate. Server components — no JS ships. */

export const MEASURE = 700

export function headingId(h: string) {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

/** A standfirst is a sentence or two, not the whole abstract. Take whole
    sentences up to ~280 characters for the header; the remainder becomes the
    article's first paragraph, so nothing is lost. */
export function splitStandfirst(text: string, max = 280): { lead: string; rest?: string } {
  const t = (text ?? '').trim()
  if (t.length <= max) return { lead: t }
  const parts = t.match(/[^.!?]+[.!?]+(\s|$)/g)
  if (!parts) return { lead: t.slice(0, max).trim() + '…', rest: t }
  let lead = ''
  let i = 0
  while (i < parts.length && (lead + parts[i]).trim().length <= max) { lead += parts[i]; i++ }
  if (!lead) { lead = parts[0]; i = 1 }
  const rest = parts.slice(i).join('').trim()
  return { lead: lead.trim(), rest: rest || undefined }
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220))
}

export function ArticleHeader({
  slug, kind, emoji, title, standfirst, updated, minutes, meta, children,
}: {
  slug: string
  kind: string
  /** Defaults per kind; pass one for a new page type. Never a 🚀 or a ✨. */
  emoji?: string
  title: string
  standfirst?: string
  updated?: string
  /** Reading time is only meaningful for prose. Omit on index pages. */
  minutes?: number
  /** Extra facts for the meta row, e.g. "26 open now". */
  meta?: string[]
  children?: React.ReactNode
}) {
  const kindEmoji = emoji ?? ({
    Guide: '📓', Topic: '🧭', Tool: '🎛️', Compare: '⚖️', Prize: '🏆',
    Location: '🗺️', Category: '🗂️', Creator: '🎥',
  } as Record<string, string>)[kind] ?? '🎬'
  const tint = tintForSlug(slug)
  return (
    <header style={{
      background: tint.bg,
      border: `1px solid ${tint.border}`,
      borderRadius: 16,
      padding: 'clamp(24px, 3.5vw, 40px)',
      marginBottom: 40,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(255,255,255,0.72)', border: `1px solid ${tint.border}`,
        borderRadius: 100, padding: '4px 12px', marginBottom: 18,
      }}>
        <span aria-hidden style={{ fontSize: 13, lineHeight: 1 }}>{kindEmoji}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: tint.text, fontFamily: 'Space Grotesk, sans-serif',
        }}>{kind}</span>
      </div>

      <h1 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(26px, 4.2vw, 44px)',
        fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em',
        color: '#1B1916', marginBottom: standfirst ? 18 : 14, maxWidth: 900,
      }}>
        {title}
      </h1>

      {standfirst && (
        <p style={{
          fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.6, color: tint.text,
          maxWidth: 760, marginBottom: 18,
        }}>
          {standfirst}
        </p>
      )}

      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14,
        fontSize: 12, color: tint.text, opacity: 0.85,
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
      }}>
        {[
          ...(updated ? [`Updated ${updated}`] : []),
          ...(minutes ? [`${minutes} min read`] : []),
          ...(meta ?? []),
          'Contest facts checked against live sources daily',
        ].map((bit, i) => (
          <React.Fragment key={bit}>
            {i > 0 && <span aria-hidden style={{ opacity: 0.5 }}>·</span>}
            <span>{bit}</span>
          </React.Fragment>
        ))}
      </div>
      {children}
    </header>
  )
}

/** Prose left at a fixed measure, a sticky contents rail right. */
export function ArticleGrid({ children, headings }: { children: React.ReactNode; headings: string[] }) {
  return (
    <div className="article-grid" style={{
      display: 'grid', gridTemplateColumns: `minmax(0, ${MEASURE}px) 220px`,
      gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start', justifyContent: 'space-between',
    }}>
      <div style={{ minWidth: 0 }}>{children}</div>
      {headings.length > 2 && (
        <nav className="article-toc" aria-label="On this page">
          <div style={{
            fontSize: 10, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.11em',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: 12,
          }}>
            On this page
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
            {headings.map(h => (
              <li key={h} style={{ borderTop: '1px solid #ECE9E2' }}>
                <a href={`#${headingId(h)}`} style={{
                  display: 'block', padding: '8px 0', fontSize: 12.5, lineHeight: 1.45,
                  color: '#7A7469', textDecoration: 'none',
                }}>
                  {h}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

/** One section heading. Anchored, so the contents rail can reach it. */
export function H2({ children }: { children: string }) {
  return (
    <h2
      id={headingId(children)}
      style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(20px, 2.2vw, 25px)', fontWeight: 700,
        letterSpacing: '-0.02em', color: '#1B1916',
        marginTop: 46, marginBottom: 14, scrollMarginTop: 90, maxWidth: MEASURE,
      }}
    >
      {children}
    </h2>
  )
}

/** Body copy. Darker and more generous than UI text: this is for reading. */
export function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 17, lineHeight: 1.75, color: '#3E3A33', marginBottom: 18, maxWidth: MEASURE }}>
      {children}
    </p>
  )
}
