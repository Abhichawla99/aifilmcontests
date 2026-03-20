'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Contest = {
  id: string
  name: string
  organizer: string
  status: string
  deadline: string
  submission_open: string | null
  prize: string
  description: string | null
  eligibility: string | null
  entry_fee: string | null
  featured: boolean
  url: string
  created_at: string | null
}

type Stats = {
  open: number
  upcoming: number
  closed: number
  total: number
  totalSubs: number
  confirmedSubs: number
}

type Log = { type: 'success' | 'error' | 'info'; msg: string }

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

const STATUS_COLORS: Record<string, string> = {
  open: '#22c55e',
  upcoming: '#f59e0b',
  closed: '#3f3f46',
}

// ── Inline style constants ─────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '7px',
  color: '#e4e4e7',
  fontSize: '13px',
  padding: '8px 10px',
  boxSizing: 'border-box',
  outline: 'none',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#52525b',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '4px',
  display: 'block',
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditModal({
  contest,
  onClose,
  onSave,
}: {
  contest: Contest
  onClose: () => void
  onSave: (id: string, fields: Record<string, unknown>) => Promise<void>
}) {
  const [form, setForm] = useState({
    name: contest.name,
    organizer: contest.organizer,
    status: contest.status,
    deadline: contest.deadline?.slice(0, 10) ?? '',
    submission_open: contest.submission_open?.slice(0, 10) ?? '',
    prize: contest.prize ?? '',
    description: contest.description ?? '',
    url: contest.url ?? '',
    eligibility: contest.eligibility ?? '',
    entry_fee: contest.entry_fee ?? '',
    featured: contest.featured ?? false,
  })
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    await onSave(contest.id, { ...form })
    setSaving(false)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#0f0f18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#e4e4e7' }}>Edit Contest</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Name — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Contest Name</label>
            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          {/* Organizer */}
          <div>
            <label style={labelStyle}>Organizer</label>
            <input style={inputStyle} value={form.organizer} onChange={e => set('organizer', e.target.value)} />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.status}
              onChange={e => set('status', e.target.value)}
            >
              <option value="open">Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Prize */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Prize</label>
            <input style={inputStyle} value={form.prize} onChange={e => set('prize', e.target.value)} placeholder="e.g. $10,000 Grand Prize" />
          </div>

          {/* Deadline */}
          <div>
            <label style={labelStyle}>Deadline</label>
            <input type="date" style={inputStyle} value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </div>

          {/* Submissions Open */}
          <div>
            <label style={labelStyle}>Submissions Open (optional)</label>
            <input type="date" style={inputStyle} value={form.submission_open} onChange={e => set('submission_open', e.target.value)} />
          </div>

          {/* URL */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Official URL</label>
            <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
          </div>

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="2–3 sentences describing the contest, required AI tools, theme, and where winners are screened."
            />
          </div>

          {/* Eligibility */}
          <div>
            <label style={labelStyle}>Eligibility</label>
            <input style={inputStyle} value={form.eligibility} onChange={e => set('eligibility', e.target.value)} placeholder="Open worldwide, 18+" />
          </div>

          {/* Entry Fee */}
          <div>
            <label style={labelStyle}>Entry Fee</label>
            <input style={inputStyle} value={form.entry_fee} onChange={e => set('entry_fee', e.target.value)} placeholder="Free" />
          </div>

          {/* Featured */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={e => set('featured', e.target.checked)}
              style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
            <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer', textTransform: 'none', fontSize: '13px', color: '#a1a1aa', letterSpacing: 'normal' }}>
              Featured (shown prominently — use for prizes &gt; $10k or major sponsors)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 18px', fontSize: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: '#71717a', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, background: '#4f46e5', border: 'none', borderRadius: '7px', color: '#fff', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard({ contests: initial, stats }: { contests: Contest[]; stats: Stats }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [contests, setContests] = useState(initial)
  const [logs, setLogs] = useState<Log[]>([])
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [editingContest, setEditingContest] = useState<Contest | null>(null)

  // Email composer
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [activeTab, setActiveTab] = useState<'contests' | 'email' | 'research'>('contests')

  const log = (type: Log['type'], msg: string) => {
    setLogs(prev => [{ type, msg }, ...prev].slice(0, 20))
  }

  async function runAction(action: string, payload?: Record<string, unknown>, label?: string) {
    setLoadingAction(action)
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        log('error', `${label ?? action}: ${data.error || 'Failed'}`)
      } else {
        log('success', formatSuccessMsg(action, data))
        if (['update-status', 'update-contest', 'delete-contest', 'maintenance', 'research'].includes(action)) {
          startTransition(() => router.refresh())
        }
      }
      return data
    } catch {
      log('error', `${label ?? action}: Network error`)
    } finally {
      setLoadingAction(null)
    }
  }

  function formatSuccessMsg(action: string, data: Record<string, unknown>) {
    if (action === 'maintenance') {
      const closed = (data.closed as unknown[])?.length ?? 0
      const opened = (data.opened as unknown[])?.length ?? 0
      return `Maintenance done — ${closed} closed, ${opened} opened`
    }
    if (action === 'research') {
      const candidates = data.phase1Candidates ?? '?'
      const pages = data.pagesRead ?? '?'
      const found = data.newContestsFound ?? 0
      const added = (data.addedToDb as string[])?.length ?? 0
      const upsertErr = data.upsertError ? ` ⚠ DB: ${data.upsertError}` : ''
      return `Research done — ${candidates} URLs found, ${pages} pages read, ${found} validated, ${added} added${upsertErr}`
    }
    if (action === 'send-digest') return `Weekly digest sent to ${data.sent} subscribers`
    if (action === 'send-reminders') return `Reminders sent to ${data.sent} subscribers`
    if (action === 'send-custom') return `Custom email sent to ${data.sent} subscribers`
    if (action === 'update-status') return `Status updated`
    if (action === 'update-contest') return `Contest saved`
    if (action === 'delete-contest') return `Contest deleted`
    return 'Done'
  }

  async function updateStatus(id: string, status: string) {
    setContests(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    await runAction('update-status', { id, status })
  }

  async function saveContest(id: string, fields: Record<string, unknown>) {
    setContests(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c))
    await runAction('update-contest', { id, ...fields }, 'Save contest')
  }

  async function deleteContest(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setContests(prev => prev.filter(c => c.id !== id))
    await runAction('delete-contest', { id })
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const isLoading = (a: string) => loadingAction === a

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#e4e4e7' }}>

      {/* Edit modal */}
      {editingContest && (
        <EditModal
          contest={editingContest}
          onClose={() => setEditingContest(null)}
          onSave={saveContest}
        />
      )}

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', fontWeight: 700, color: '#4f46e5', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI Film Contests
            </Link>
            <span style={{ color: '#27272a', fontSize: '12px' }}>›</span>
            <span style={{ fontSize: '13px', color: '#52525b' }}>Admin</span>
          </div>
          <button onClick={logout} style={{ fontSize: '12px', color: '#52525b', background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Open', value: stats.open, color: '#22c55e' },
            { label: 'Upcoming', value: stats.upcoming, color: '#f59e0b' },
            { label: 'Closed', value: stats.closed, color: '#3f3f46' },
            { label: 'Total', value: stats.total, color: '#a1a1aa' },
            { label: 'Subscribers', value: stats.confirmedSubs, color: '#818cf8' },
          ].map(s => (
            <div key={s.label} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 18px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          <ActionBtn label={isLoading('maintenance') ? 'Running…' : 'Run Maintenance'} onClick={() => runAction('maintenance', undefined, 'Maintenance')} disabled={!!loadingAction} color="default" />
          <ActionBtn label={isLoading('research') ? '🔍 Researching…' : '🔍 Run Research'} onClick={() => runAction('research', undefined, 'Research')} disabled={!!loadingAction} color="indigo" />
          <ActionBtn label={isLoading('send-digest') ? 'Sending…' : '📰 Send Digest'} onClick={() => runAction('send-digest')} disabled={!!loadingAction} color="default" />
          <ActionBtn label={isLoading('send-reminders') ? 'Sending…' : '⏰ Send Reminders'} onClick={() => runAction('send-reminders')} disabled={!!loadingAction} color="default" />
        </div>

        {/* Activity log */}
        {logs.length > 0 && (
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif' }}>Activity</div>
            {logs.map((l, i) => (
              <div key={i} style={{ fontSize: '13px', color: l.type === 'error' ? '#f87171' : l.type === 'success' ? '#86efac' : '#a1a1aa', padding: '3px 0', borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                {l.type === 'error' ? '✕' : l.type === 'success' ? '✓' : '·'} {l.msg}
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['contests', 'email', 'research'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '13px', fontWeight: 500, padding: '8px 16px', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
                color: activeTab === tab ? '#e4e4e7' : '#52525b', cursor: 'pointer', textTransform: 'capitalize', marginBottom: '-1px',
              }}
            >
              {tab === 'contests' ? `Contests (${contests.length})` : tab === 'email' ? 'Email' : 'Research'}
            </button>
          ))}
        </div>

        {/* ── Contests table ───────────────────────────────────────────────────── */}
        {activeTab === 'contests' && (
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Status', 'Name', 'Organizer', 'Prize', 'Deadline', 'Added', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#52525b', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contests.map((c, i) => {
                  const dl = daysLeft(c.deadline)
                  const isUrgent = c.status === 'open' && dl <= 7
                  return (
                    <tr key={c.id} style={{ borderBottom: i < contests.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>

                      {/* Status dropdown */}
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={c.status}
                          onChange={e => updateStatus(c.id, e.target.value)}
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', color: STATUS_COLORS[c.status], fontSize: '12px', fontWeight: 600, padding: '3px 6px', cursor: 'pointer' }}
                        >
                          <option value="open">Open</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Name */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 500, color: '#e4e4e7', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.featured && <span style={{ fontSize: '10px', color: '#818cf8', marginRight: '5px' }}>★</span>}
                          {c.name}
                        </div>
                      </td>

                      {/* Organizer */}
                      <td style={{ padding: '10px 14px', color: '#71717a', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.organizer}</td>

                      {/* Prize */}
                      <td style={{ padding: '10px 14px', color: '#a5b4fc', whiteSpace: 'nowrap', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.prize}</td>

                      {/* Deadline */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: isUrgent ? '#f87171' : '#71717a' }}>{fmt(c.deadline)}</span>
                        {c.status === 'open' && <span style={{ fontSize: '11px', color: isUrgent ? '#f87171' : '#3f3f46', marginLeft: '6px' }}>{dl}d</span>}
                      </td>

                      {/* Date Added */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: '#3f3f46', fontSize: '12px' }}>
                        {c.created_at ? fmtShort(c.created_at) : '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => setEditingContest(c)}
                            style={{ fontSize: '12px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}
                          >
                            Edit
                          </button>
                          <span style={{ color: '#27272a' }}>·</span>
                          <a href={`/contests/${c.id}`} target="_blank" style={{ fontSize: '12px', color: '#52525b', textDecoration: 'none' }}>View</a>
                          <span style={{ color: '#27272a' }}>·</span>
                          <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#52525b', textDecoration: 'none' }}>Site</a>
                          <span style={{ color: '#27272a' }}>·</span>
                          <button onClick={() => deleteContest(c.id, c.name)} style={{ fontSize: '12px', color: '#7f1d1d', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Email composer ───────────────────────────────────────────────────── */}
        {activeTab === 'email' && (
          <div style={{ maxWidth: '640px' }}>
            <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '20px', lineHeight: 1.6 }}>
              Write a custom email to all <strong style={{ color: '#e4e4e7' }}>{stats.confirmedSubs}</strong> confirmed subscribers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Subject line" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="input" style={{ fontSize: '14px' }} />
              <textarea placeholder="Email body — write naturally. Each line becomes a paragraph." value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={10} className="input" style={{ fontSize: '14px', resize: 'vertical', lineHeight: 1.65 }} />
              <button
                disabled={!!loadingAction || !emailSubject.trim() || !emailBody.trim()}
                onClick={() => runAction('send-custom', { subject: emailSubject, body: emailBody })}
                className="btn"
                style={{ padding: '11px 20px', fontSize: '14px', alignSelf: 'flex-start', opacity: (!emailSubject.trim() || !emailBody.trim()) ? 0.4 : 1 }}
              >
                {isLoading('send-custom') ? 'Sending…' : `Send to ${stats.confirmedSubs} subscribers`}
              </button>
            </div>
          </div>
        )}

        {/* ── Research tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'research' && (
          <div style={{ maxWidth: '660px' }}>
            <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '24px', lineHeight: 1.65 }}>
              Three-phase research agent. Discovers contests, fetches actual pages, extracts real data — never guesses.
            </p>
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '20px 22px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '12px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>How it works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { phase: 'Phase 1', color: '#818cf8', detail: 'Perplexity Sonar Pro searches 6 queries and returns up to 15 candidate contest URLs' },
                  { phase: 'Phase 2', color: '#34d399', detail: 'Each URL is fetched directly via HTTP — we read the actual page HTML, not search snippets' },
                  { phase: 'Phase 3', color: '#f59e0b', detail: 'GPT-4o-mini extracts deadline, prize, eligibility from the real page text — can only write what it reads' },
                ].map(p => (
                  <div key={p.phase} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: p.color, fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', marginTop: '1px', minWidth: '52px' }}>{p.phase}</span>
                    <span style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.55 }}>{p.detail}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '2px', fontSize: '12px', color: '#3f3f46', lineHeight: 1.7 }}>
                  ✦ Deduplicates by ID, name, and URL against all existing contests<br />
                  ✦ Validates deadline is in the future, prize is explicit on the page<br />
                  ✦ Sanitizes fields before writing — no schema mismatches<br />
                  ✦ Emails subscribers automatically when new contests are added<br />
                  ✦ Cost: ~$0.08–0.12 per run
                </div>
              </div>
            </div>
            <button
              disabled={!!loadingAction}
              onClick={() => runAction('research', undefined, 'Research')}
              className="btn"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              {isLoading('research') ? '🔍 Researching… (30–90s)' : '🔍 Run Research Now'}
            </button>
            <p style={{ fontSize: '12px', color: '#3f3f46', marginTop: '10px' }}>Also runs automatically at 8:15 AM UTC every day via Vercel Cron.</p>
          </div>
        )}

      </div>
    </div>
  )
}

function ActionBtn({ label, onClick, disabled, color }: {
  label: string; onClick: () => void; disabled: boolean; color: 'indigo' | 'default'
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px', fontSize: '13px', fontWeight: 500, fontFamily: 'Space Grotesk, sans-serif',
        borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)',
        background: color === 'indigo' ? '#4f46e5' : 'rgba(255,255,255,0.04)',
        color: color === 'indigo' ? '#fff' : '#a1a1aa',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {label}
    </button>
  )
}
