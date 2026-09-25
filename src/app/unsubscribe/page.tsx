'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import InnerLayout from '@/components/InnerLayout'

// What actually stops, in the words the homepage form already uses.
const WHAT_STOPS =
  'the alerts when new contests open and the reminder that goes out seven days before a deadline closes'

function UnsubscribeContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const done = params.get('done')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    done ? 'success' : token ? 'loading' : 'idle'
  )
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  // The address we removed, kept only so the success state can name it.
  const [removed, setRemoved] = useState('')

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
        setRemoved(email.trim())
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
    <div className="max-w-5xl mx-auto px-5">
      <div className="unsub">

        {status === 'loading' && (
          <>
            <p className="unsub-label">Deadline alerts</p>
            <h1 className="unsub-title">Unsubscribing…</h1>
            <p className="unsub-body">Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <p className="unsub-label unsub-label-ok">Removed</p>
            <h1 className="unsub-title">You&apos;re unsubscribed.</h1>
            <p className="unsub-body">
              {message || "You won't receive any more emails from us."} That stops {WHAT_STOPS}.
            </p>
            {removed && (
              <div className="unsub-note unsub-note-ok">
                <p className="unsub-note-label">Address removed</p>
                <span className="unsub-addr">{removed}</span>
              </div>
            )}
            <div className="unsub-note">
              <p className="unsub-note-label">If that was a mistake</p>
              <p>You can subscribe again from the homepage at any time.</p>
            </div>
            <Link href="/" className="unsub-back">← Back to contests</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="unsub-label unsub-label-bad">Not removed</p>
            <h1 className="unsub-title">We couldn&apos;t remove you.</h1>
            <p className="unsub-body" role="alert">{message}</p>
            <button type="button" className="unsub-retry" onClick={() => setStatus('idle')}>
              Try with your email address instead →
            </button>
          </>
        )}

        {status === 'idle' && (
          <>
            <p className="unsub-label">Deadline alerts</p>
            <h1 className="unsub-title">Unsubscribe</h1>
            <p className="unsub-body">
              Enter the address you subscribed with and we&apos;ll remove you immediately.
              You&apos;ll stop getting {WHAT_STOPS}.
            </p>
            <form onSubmit={handleEmailUnsubscribe} className="unsub-form">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="The email address to unsubscribe"
                required
                className="input"
              />
              <button type="submit" className="unsub-go">Unsubscribe</button>
            </form>
            <div className="unsub-note">
              <p className="unsub-note-label">Not sure which address</p>
              <p>
                The Unsubscribe link at the foot of any alert we sent you removes that
                address on its own, with nothing to type.
              </p>
            </div>
            <Link href="/" className="unsub-back">← Back to contests</Link>
          </>
        )}

      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <InnerLayout>
      <Suspense fallback={
        <div className="max-w-5xl mx-auto px-5">
          <div className="unsub">
            <p className="unsub-label">Deadline alerts</p>
            <h1 className="unsub-title">Unsubscribe</h1>
            <p className="unsub-body">Loading…</p>
          </div>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </InnerLayout>
  )
}
