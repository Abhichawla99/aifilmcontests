'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push(from)
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4f46e5' }}>
            AI Film Contests
          </span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: '#f4f4f5', marginTop: '12px', marginBottom: '4px' }}>Admin</h1>
          <p style={{ fontSize: '13px', color: '#52525b' }}>Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="input"
            style={{ fontSize: '15px' }}
          />
          <button type="submit" disabled={loading} className="btn" style={{ padding: '11px', justifyContent: 'center', fontSize: '14px' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p style={{ marginTop: '10px', fontSize: '13px', color: '#ef4444' }}>{error}</p>}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
