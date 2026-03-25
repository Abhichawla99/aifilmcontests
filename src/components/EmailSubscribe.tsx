'use client'

import { useState } from 'react'

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
        body: JSON.stringify({ name: name.trim(), email: email.trim(), consent }),
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
      <div className="py-2">
        <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15 }}>
          You&apos;re in. Check your inbox now.
        </p>
        <p className="text-sm mb-3" style={{ color: '#71717a', lineHeight: 1.6 }}>
          We just sent you a welcome email.
        </p>

        {/* Reply nudge */}
        <div style={{
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 10,
          padding: '14px 16px',
          background: 'rgba(79,70,229,0.05)',
          marginBottom: 12,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#818cf8', marginBottom: 5, fontFamily: 'Space Grotesk, sans-serif' }}>
            One quick step to guarantee delivery →
          </p>
          <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: '#e4e4e7' }}>Reply to that email</strong> — even just &ldquo;got it&rdquo; works.
            This tells your inbox we&apos;re legit and ensures every future contest alert lands in
            your <strong style={{ color: '#e4e4e7' }}>Primary</strong> inbox, not Promotions.
            The more you reply to our emails, the better your delivery gets.
          </p>
        </div>

        <button
          onClick={() => { setStatus('idle'); setMessage('') }}
          className="text-xs underline underline-offset-2 transition-colors"
          style={{ color: '#52525b' }}
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
            <span style={{ fontSize: '11px', color: '#52525b', lineHeight: 1.5 }}>
              I agree to receive email alerts about AI film contests. Unsubscribe anytime.
            </span>
          </label>
        </form>
        {status === 'error' && <p className="mt-2 text-xs text-red-400">{message}</p>}
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
          className="input"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
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
          <span style={{ fontSize: '12px', color: '#52525b', lineHeight: 1.55 }}>
            I agree to receive email alerts about AI film contests.{' '}
            <a href="/unsubscribe" style={{ color: '#3f3f46', textDecoration: 'underline' }}>
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
      {status === 'error' && <p className="mt-2 text-xs text-red-400">{message}</p>}
    </div>
  )
}
