'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isBlockedEmailDomain } from '@/lib/blocked-email-domains'

const EMAIL_SYNTAX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SubscribeError({ message }: { message: string }) {
  return (
    <div role="alert" style={{ marginTop: 12, borderLeft: '2px solid #C2410C', padding: '1px 0 1px 12px' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', marginBottom: 3 }}>
        Not subscribed yet
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: '#3E3A33', margin: 0 }}>{message}</p>
    </div>
  )
}

export default function EmailSubscribe({ compact = false, openCount }: { compact?: boolean; openCount?: number }) {
  const router = useRouter()
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [consent, setConsent] = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim()
    if (!cleanEmail) return
    if (!EMAIL_SYNTAX.test(cleanEmail)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    if (isBlockedEmailDomain(cleanEmail)) {
      setStatus('error')
      setMessage("That looks like a phone carrier's text-message gateway, which can't receive a real email. Please use a regular email address.")
      return
    }
    if (!consent) {
      setStatus('error')
      setMessage('Please agree to receive email alerts to continue.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          consent,
          source: typeof window !== 'undefined' ? window.location.pathname : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Send them somewhere with contests on it, not a thank-you line —
        // see /subscribed, which shows the next open contests instead.
        router.push('/subscribed')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (compact) {
    return (
      <div className="w-full">
        {typeof openCount === 'number' && (
          <p style={{ fontSize: 12, color: '#6F6A61', marginBottom: 10, lineHeight: 1.55 }}>
            New contests within a day of opening, plus a last call before deadlines close —{' '}
            <strong style={{ color: '#1B1916' }}>{openCount} open right now</strong>.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* The button keeps its 100px and the field takes whatever is left, which
              on a phone is not enough: measured on the live site at 390px the field
              is 200px wide, 174px of that text area, and a 21-character address sets
              at 176px — you cannot read back what you typed before you send it.
              What decides this is the row's width, not the viewport's, because the
              same form sits in a 451px rail on desktop. So it wraps on a flex basis
              rather than a media query: the field asks for 18rem, and any row that
              cannot seat 18rem + gap + button drops the button onto its own line and
              lets the field take the whole width. That is every phone placement
              (308px on a contest page, 335px on a hub, 350px in a guide) and no
              desktop one (451px and up still seat the pair, unchanged). */}
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              required
              className="input"
              style={{ padding: '9px 12px', fontSize: '13px', flex: '1 1 18rem', minWidth: 0 }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn"
              style={{ flex: '0 0 auto' }}
            >
              {status === 'loading' ? '...' : 'Get Alerts'}
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={e => { setConsent(e.target.checked); if (status === 'error') { setStatus('idle'); setMessage('') } }}
              style={{ marginTop: '2px', accentColor: '#4f46e5', flexShrink: 0 }}
            />
            <span style={{ fontSize: '11px', color: '#6F6A61', lineHeight: 1.5 }}>
              I agree to receive email alerts about AI film contests. Unsubscribe anytime.
            </span>
          </label>
        </form>
        {status === 'error' && <SubscribeError message={message} />}
      </div>
    )
  }

  // Full form
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className="input"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          required
          className="input"
        />

        {/* Consent checkbox — unchecked by default, required for GDPR */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer', padding: '2px 0' }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={e => { setConsent(e.target.checked); if (status === 'error') { setStatus('idle'); setMessage('') } }}
            style={{ marginTop: '2px', accentColor: '#4f46e5', flexShrink: 0, width: '14px', height: '14px' }}
          />
          <span style={{ fontSize: '12px', color: '#6F6A61', lineHeight: 1.55 }}>
            I agree to receive email alerts about AI film contests.{' '}
            <a href="/unsubscribe" style={{ color: '#6F6A61', textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Unsubscribe anytime.
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn w-full justify-center"
          style={{ padding: '11px 18px' }}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Subscribing...
            </span>
          ) : 'Get Contest Alerts'}
        </button>
      </form>
      {status === 'error' && <SubscribeError message={message} />}
    </div>
  )
}
