'use client'

import { useState } from 'react'

export default function EmailSubscribe({ compact = false }: { compact?: boolean }) {
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
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'You\'re subscribed!')
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
      <div className="flex flex-col items-center justify-center gap-3 py-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        >
          ✓
        </div>
        <div className="text-center">
          <p className="font-semibold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            You&apos;re on the list
          </p>
          <p className="text-sm text-zinc-500">{message}</p>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-indigo-500 hover:text-indigo-400 underline underline-offset-2 transition-colors"
        >
          Add another email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className={`flex gap-2 ${compact ? 'flex-row' : 'flex-col sm:flex-row'}`}>
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={`w-full pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all text-sm ${compact ? 'py-2.5' : 'py-3.5'}`}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex-shrink-0 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed ${compact ? 'px-5 py-2.5' : 'px-6 py-3.5'}`}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {status === 'loading' ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              Get Alerts
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400">{message}</p>
      )}
      {!compact && (
        <p className="mt-2.5 text-xs text-zinc-600 text-center">
          Instant alerts when new contests open. No spam, ever.
        </p>
      )}
    </div>
  )
}
