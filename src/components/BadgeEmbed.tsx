'use client'

import { useState } from 'react'

const BASE = 'https://aifilmcontests.com'

/**
 * The copy-paste badge box on a creator profile. The point of it is the link
 * back: a creator drops this on their own site and it points at their profile
 * here. Keep the snippet on one line — people paste it into a footer.
 */
export default function BadgeEmbed({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false)

  const snippet =
    `<a href="${BASE}/creators/${slug}">` +
    `<img src="${BASE}/badge/featured-creator.svg" alt="Featured on AI Film Contests" width="200">` +
    `</a>`

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet)
    } catch {
      // Older browsers, and any page served without a secure context.
      const el = document.createElement('textarea')
      el.value = snippet
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="card" style={{ padding: '24px 26px', marginBottom: 40 }}>
      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        color: '#8B867C',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 10,
      }}>
        Badge for your site
      </h2>
      <p style={{ fontSize: 14, color: '#6F6A61', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 620 }}>
        {name} is welcome to put this on a site, a portfolio footer or a press page. It links
        back to this profile.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/badge/featured-creator.svg"
          alt="Featured on AI Film Contests"
          width={200}
          height={54}
        />
      </div>

      <div style={{
        background: 'rgba(27,25,22,0.04)',
        border: '1px solid rgba(27,25,22,0.08)',
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 14,
        overflowX: 'auto',
      }}>
        <code style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#3E3A33',
          whiteSpace: 'pre',
        }}>
          {snippet}
        </code>
      </div>

      <button
        type="button"
        onClick={copy}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 40,
          padding: '10px 20px',
          borderRadius: 10,
          background: 'rgba(27,25,22,0.06)',
          border: '1px solid rgba(27,25,22,0.09)',
          color: '#3E3A33',
          fontWeight: 600,
          fontSize: 14,
          fontFamily: 'Space Grotesk, sans-serif',
          cursor: 'pointer',
        }}
      >
        {copied ? 'Copied' : 'Copy embed code'}
      </button>
    </section>
  )
}
