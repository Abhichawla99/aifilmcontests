'use client'

import { useState } from 'react'

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

export default function EmailSubscribe({ compact = false }: { compact?: boolean }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [consent, setConsent] = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
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
        setStatus('success')
        setMessage(data.message || "You're subscribed.")
        setName('')
        setEmail('')
        setConsent(false)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="sok" role="status">
        <p className="sok-head">You&apos;re in. Check your inbox now.</p>
        <p className="sok-sub">We just sent you a welcome email.</p>

        {/* The instruction, set as a ruled note in the same grammar as
            SubscribeError — the two outcomes of one form should be one object
            in two colours, not a ruled note and a tinted panel. */}
        <div className="sok-step">
          <p className="sok-step-label">One quick step to guarantee delivery</p>
          <p className="sok-step-do">
            <strong>Reply to that email</strong> — even just &ldquo;got it&rdquo; works.
          </p>
          <p className="sok-step-why">
            This tells your inbox we&apos;re legit and ensures every future contest alert lands in
            your <strong>Primary</strong> inbox, not Promotions.
            The more you reply to our emails, the better your delivery gets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setStatus('idle'); setMessage('') }}
          className="sok-again"
        >
          Subscribe another email
        </button>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              required
              className="input flex-1"
              style={{ padding: '9px 12px', fontSize: '13px' }}
            />
            <button type="submit" disabled={status === 'loading'} className="btn">
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
