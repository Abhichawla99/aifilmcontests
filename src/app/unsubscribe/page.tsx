'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function UnsubscribeContent() {
  const params = useSearchParams()
  const token = params.get('token')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    token ? 'loading' : 'idle'
  )
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  // If token present, auto-unsubscribe on load
  useEffect(() => {
    if (!token) return
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.message || 'Invalid or expired link.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [token])

  const handleEmailUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>

        {/* Wordmark */}
        <Link href="/" style={{ display: 'inline-block', marginBottom: '40px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4f46e5' }}>
            AI Film Contests
          </span>
        </Link>

        {/* Loading */}
        {status === 'loading' && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Unsubscribing…</h1>
            <p style={{ color: '#71717a', fontSize: '14px' }}>Just a moment.</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '18px' }}>
              ✓
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>You&apos;re unsubscribed.</h1>
            <p style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
              {message || "You won't receive any more emails from us."} If you change your mind, you can always re-subscribe on the homepage.
            </p>
            <Link
              href="/"
              style={{ color: '#4f46e5', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
            >
              ← Back to contests
            </Link>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Something went wrong.</h1>
            <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '24px' }}>{message}</p>
            <button
              onClick={() => { setStatus('idle') }}
              style={{ color: '#4f46e5', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Try with your email address instead →
            </button>
          </div>
        )}

        {/* Email form (no token, or after error) */}
        {status === 'idle' && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Unsubscribe</h1>
            <p style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Enter your email address and we&apos;ll remove you immediately.
            </p>
            <form onSubmit={handleEmailUnsubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input"
              />
              <button type="submit" className="btn" style={{ padding: '11px 18px', justifyContent: 'center' }}>
                Unsubscribe
              </button>
            </form>
            <div style={{ marginTop: '20px' }}>
              <Link href="/" style={{ color: '#3f3f46', fontSize: '13px', textDecoration: 'none' }}>
                ← Back to contests
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#52525b', fontSize: '14px' }}>Loading…</span>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
