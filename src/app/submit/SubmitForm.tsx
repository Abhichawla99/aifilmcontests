'use client'

import { useState } from 'react'

const label: React.CSSProperties = {
  display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 11, fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7469',
  marginBottom: 7, fontFamily: 'Space Grotesk, sans-serif',
}
const optionalMark: React.CSSProperties = {
  fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'none', color: '#A8A296',
}
const hint: React.CSSProperties = { fontSize: 12.5, lineHeight: 1.55, color: '#8B867C', margin: '7px 0 0' }
const legend: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: '#1B1916',
  letterSpacing: '-0.01em', margin: 0,
}
const rule: React.CSSProperties = { border: 'none', borderTop: '1px solid #ECE9E2', margin: '30px 0 20px' }
const pair: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16,
}

function Optional() {
  return <span style={optionalMark}>optional</span>
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
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#1B1916', margin: '0 0 8px' }}>Got it. Thank you.</p>
        <p style={{ fontSize: 14, color: '#6F6A61', lineHeight: 1.65, margin: 0 }}>
          We check every contest against its official page before it goes live, usually within a day.
          If anything is unclear we will reply to the email you gave.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999, opacity: 0, height: 0 }} aria-hidden="true" />

      <h2 style={legend}>The two things we verify</h2>
      <div style={{ display: 'grid', gap: 18, marginTop: 16 }}>
        <div>
          <label style={label} htmlFor="name">Contest name</label>
          <input id="name" required className="input" value={f.name} onChange={set('name')} placeholder="e.g. Busan International AI Film Festival" />
        </div>
        <div>
          <label style={label} htmlFor="url">Official page</label>
          <input id="url" required type="url" className="input" value={f.url} onChange={set('url')} placeholder="https://" />
          <p style={hint}>We read this page before the listing goes live, and again every morning after that. A festival&rsquo;s own site or its FilmFreeway page both work.</p>
        </div>
      </div>

      <hr style={rule} />

      <h2 style={legend}>Details, if you have them</h2>
      <p style={{ ...hint, marginTop: 6, marginBottom: 16 }}>Leave anything blank and we will read it off the official page ourselves.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={pair}>
          <div>
            <label style={label} htmlFor="organizer">Organizer <Optional /></label>
            <input id="organizer" className="input" value={f.organizer} onChange={set('organizer')} placeholder="Who runs it" />
          </div>
          <div>
            <label style={label} htmlFor="deadline">Submission deadline <Optional /></label>
            <input id="deadline" type="date" className="input" style={{ color: f.deadline ? '#1B1916' : '#A8A296' }} value={f.deadline} onChange={set('deadline')} />
          </div>
        </div>
        <div style={pair}>
          <div>
            <label style={label} htmlFor="prize">Prize <Optional /></label>
            <input id="prize" className="input" value={f.prize} onChange={set('prize')} placeholder="e.g. $10,000 + screening" />
          </div>
          <div>
            <label style={label} htmlFor="fee">Entry fee <Optional /></label>
            <input id="fee" className="input" value={f.fee} onChange={set('fee')} placeholder="Free, $25, …" />
          </div>
        </div>
      </div>

      <hr style={rule} />

      <h2 style={legend}>So we can reply</h2>
      <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <div style={pair}>
          <div>
            <label style={label} htmlFor="email">Your email</label>
            <input id="email" required type="email" className="input" value={f.email} onChange={set('email')} placeholder="you@example.com" />
          </div>
          <div>
            <label style={label} htmlFor="role">You are</label>
            <div style={{ position: 'relative' }}>
              <select id="role" className="input" style={{ appearance: 'none', paddingRight: 34 }} value={f.role} onChange={set('role')}>
                <option value="organizer">The organizer</option>
                <option value="filmmaker">A filmmaker who found it</option>
                <option value="other">Someone else</option>
              </select>
              <span aria-hidden="true" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#8B867C', fontSize: 11, pointerEvents: 'none' }}>▾</span>
            </div>
          </div>
        </div>
        <div>
          <label style={label} htmlFor="notes">Anything else <Optional /></label>
          <textarea id="notes" rows={3} className="input" style={{ resize: 'vertical' }} value={f.notes} onChange={set('notes')} placeholder="Eligibility, categories, tools allowed, a correction to an existing listing…" />
        </div>
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn w-full justify-center" style={{ padding: '13px 18px', marginTop: 26 }}>
        {status === 'loading' ? 'Sending…' : 'Submit contest'}
      </button>

      {status === 'error' && (
        <div role="alert" style={{ marginTop: 14, borderLeft: '2px solid #C2410C', padding: '2px 0 2px 14px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C2410C', marginBottom: 4 }}>
            Not sent
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3E3A33', margin: 0 }}>{message}</p>
        </div>
      )}

      <p style={{ fontSize: 12.5, color: '#8B867C', lineHeight: 1.6, margin: '16px 0 0' }}>
        Listing is free and stays free. We only list contests we can verify on an official page.
      </p>
    </form>
  )
}
