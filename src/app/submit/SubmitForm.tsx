'use client'

import { useState } from 'react'

const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 8, fontSize: 14, color: '#f4f4f5',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', outline: 'none',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
  color: '#71717a', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif',
}

export default function SubmitForm() {
  const [f, setF] = useState({ name: '', url: '', organizer: '', deadline: '', prize: '', fee: '', email: '', role: 'organizer', notes: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading'); setMessage('')
    try {
      const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const data = await res.json()
      if (res.ok) setStatus('done')
      else { setStatus('error'); setMessage(data.error || 'Something went wrong.') }
    } catch { setStatus('error'); setMessage('Network error. Please try again.') }
  }

  if (status === 'done') {
    return (
      <div style={{ border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '22px 24px', background: 'rgba(79,70,229,0.06)' }}>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#f4f4f5', margin: '0 0 8px' }}>Got it. Thank you.</p>
        <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.65, margin: 0 }}>
          We check every contest against its official page before it goes live, usually within a day.
          If anything is unclear we will reply to the email you gave.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999, opacity: 0, height: 0 }} aria-hidden="true" />

      <div><label style={label} htmlFor="name">Contest name *</label><input id="name" required style={input} value={f.name} onChange={set('name')} placeholder="e.g. Busan International AI Film Festival" /></div>
      <div><label style={label} htmlFor="url">Official page *</label><input id="url" required type="url" style={input} value={f.url} onChange={set('url')} placeholder="https://" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div><label style={label} htmlFor="organizer">Organizer</label><input id="organizer" style={input} value={f.organizer} onChange={set('organizer')} /></div>
        <div><label style={label} htmlFor="deadline">Submission deadline</label><input id="deadline" type="date" style={{ ...input, colorScheme: 'dark' }} value={f.deadline} onChange={set('deadline')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div><label style={label} htmlFor="prize">Prize</label><input id="prize" style={input} value={f.prize} onChange={set('prize')} placeholder="e.g. $10,000 + screening" /></div>
        <div><label style={label} htmlFor="fee">Entry fee</label><input id="fee" style={input} value={f.fee} onChange={set('fee')} placeholder="Free, $25, …" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div><label style={label} htmlFor="email">Your email *</label><input id="email" required type="email" style={input} value={f.email} onChange={set('email')} /></div>
        <div>
          <label style={label} htmlFor="role">You are</label>
          <select id="role" style={{ ...input, appearance: 'none' }} value={f.role} onChange={set('role')}>
            <option value="organizer">The organizer</option>
            <option value="filmmaker">A filmmaker who found it</option>
            <option value="other">Someone else</option>
          </select>
        </div>
      </div>
      <div><label style={label} htmlFor="notes">Anything else</label><textarea id="notes" rows={3} style={{ ...input, resize: 'vertical' }} value={f.notes} onChange={set('notes')} placeholder="Eligibility, categories, tools allowed, a correction to an existing listing…" /></div>

      <button type="submit" disabled={status === 'loading'} className="btn w-full justify-center" style={{ padding: '12px 18px' }}>
        {status === 'loading' ? 'Sending…' : 'Submit contest'}
      </button>
      {status === 'error' && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>{message}</p>}
      <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.6, margin: 0 }}>
        Listing is free and stays free. We only list contests we can verify on an official page.
      </p>
    </form>
  )
}
