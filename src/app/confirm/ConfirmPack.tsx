'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { COMMUNITY, GUIDE, OFFER_ENDS_LABEL, OVERS, OVERS_OFF_PERCENT, OVERS_REPLACES, offerOpen, oversHref } from '@/lib/creator-pack'

/* Confirms on load, by POST, so a mail scanner that only fetches the link
   confirms nobody. Then shows the pack here as well, because the email can
   take a minute and they're already looking at this page. */

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
}
const itemTitle: React.CSSProperties = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#1B1916', margin: '0 0 6px' }
const itemBody: React.CSSProperties = { fontSize: 14, lineHeight: 1.65, color: '#4A463E', margin: '0 0 12px' }
const itemLink: React.CSSProperties = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }

export default function ConfirmPack() {
  const token = useSearchParams().get('token')
  const [state, setState] = useState<'working' | 'done' | 'error'>(token ? 'working' : 'error')
  const [message, setMessage] = useState(token ? '' : 'This link is missing its code. Open it from the email again.')
  const [name, setName] = useState<string | null>(null)
  const once = useRef(false)

  useEffect(() => {
    if (!token || once.current) return
    once.current = true
    fetch('/api/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      .then(async res => {
        const data = await res.json().catch(() => ({}))
        if (res.ok) { setName(data.name ?? null); setState('done') }
        else { setMessage(data.error || 'Something went wrong. Try the link again.'); setState('error') }
      })
      .catch(() => { setMessage('Network error. Try the link again.'); setState('error') })
  }, [token])

  if (state === 'working') {
    return <p className="sok-head" aria-live="polite">Confirming your email…</p>
  }
  if (state === 'error') {
    return (
      <div className="sok" style={{ maxWidth: 600 }}>
        <p className="sok-head">That didn&apos;t work.</p>
        <p className="sok-sub">{message}</p>
        <Link href="/starter-pack" style={itemLink}>Sign up again →</Link>
      </div>
    )
  }

  const first = name?.split(' ')[0]
  const open = offerOpen()
  return (
    <>
      <div className="sok" style={{ maxWidth: 600, marginBottom: 48 }} aria-live="polite">
        <p className="sok-head">{first ? `You're confirmed, ${first}.` : "You're confirmed."}</p>
        <p className="sok-sub">Your creator pack is on its way to your inbox. It&apos;s all here too.</p>
        <div className="sok-step">
          <p className="sok-step-label">One favour</p>
          <p className="sok-step-do"><strong>Reply to the pack email</strong>, even just &ldquo;got it&rdquo;.</p>
          <p className="sok-step-why">It tells your inbox you want these, so contest alerts land in Primary instead of Promotions.</p>
        </div>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2 style={sectionLabel}>Your creator pack</h2>
        <div className="pack-grid" style={{ marginBottom: 0 }}>
          {open && (
            <div className="pack-item pack-item-lead">
              <p style={itemTitle}>Overs Pro, {OVERS_OFF_PERCENT}% off</p>
              <p style={itemBody}>
                {OVERS_REPLACES}{' '}
                ${OVERS.monthlyUsd} a month for your first {OVERS.months} months, then ${OVERS.fullUsd}. Ends {OFFER_ENDS_LABEL}, or
                sooner if the {OVERS.places} founding places fill.
              </p>
              <a href={oversHref('confirm')} target="_blank" rel="noopener" style={itemLink}>Claim Overs for ${OVERS.monthlyUsd} →</a>
            </div>
          )}
          <div className="pack-item">
            <p style={itemTitle}>{GUIDE.title}</p>
            <p style={itemBody}>Every step from the rules to the export.</p>
            <Link href={GUIDE.path} style={itemLink}>Read the guide →</Link>
          </div>
          <div className="pack-item">
            <p style={itemTitle}>{COMMUNITY.name}</p>
            <p style={itemBody}>Abhi&apos;s free community on Skool for AI creative workflows.</p>
            <a href={COMMUNITY.url} target="_blank" rel="noopener" style={itemLink}>Join free →</a>
          </div>
        </div>
      </section>

      <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← See every open AI film contest</Link>
    </>
  )
}
