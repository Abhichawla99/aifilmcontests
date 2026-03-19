'use client'

import { useState } from 'react'

export default function EmailSubscribe({ compact = false }: { compact?: boolean }) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || "You're subscribed.")
        setName('')
        setEmail('')
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
      <div className="py-4 text-center">
        <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>You&apos;re in.</p>
        <p className="text-sm text-zinc-500">{message}</p>
        <button onClick={() => setStatus('idle')} className="mt-3 text-xs text-zinc-700 hover:text-zinc-500 underline underline-offset-2 transition-colors">
          Subscribe another email
        </button>
      </div>
    )
  }

  if (compact) {
    // Compact: just email + button in one row
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex gap-2">
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
        </form>
        {status === 'error' && <p className="mt-2 text-xs text-red-400">{message}</p>}
      </div>
    )
  }

  // Full form: name + email stacked, then button
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
        <button type="submit" disabled={status === 'loading'} className="btn w-full justify-center" style={{ padding: '11px 18px' }}>
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
      <p className="mt-2.5 text-xs text-zinc-700 text-center">Instant alerts when new contests open. No spam.</p>
    </div>
  )
}
