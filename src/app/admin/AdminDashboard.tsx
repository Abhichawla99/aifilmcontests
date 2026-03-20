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
  prize: string
  featured: boolean
  url: string
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

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

const STATUS_COLORS: Record<string, string> = {
  open: '#22c55e',
  upcoming: '#f59e0b',
  closed: '#3f3f46',
}

export default function AdminDashboard({ contests: initial, stats }: { contests: Contest[]; stats: Stats }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [contests, setContests] = useState(initial)
  const [logs, setLogs] = useState<Log[]>([])
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

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
        // Refresh contests list after status changes
        if (['update-status', 'delete-contest', 'maintenance', 'research'].includes(action)) {
          startTransition(() => router.refresh())
        }
      }
      return data
    } catch (e) {
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
      return `Research done — ${data.newContestsFound ?? 0} new contests found, ${(data.addedToDb as string[])?.length ?? 0} added`
    }
    if (action === 'send-digest') return `Weekly digest sent to ${data.sent} subscribers`
    if (action === 'send-reminders') return `Reminders sent to ${data.sent} subscribers`
    if (action === 'send-custom') return `Custom email sent to ${data.sent} subscribers`
    if (action === 'update-status') return `Status updated`
    if (action === 'delete-contest') return `Contest deleted`
    return 'Done'
  }

  async function updateStatus(id: string, status: string) {
    setContests(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    await runAction('update-status', { id, status })
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

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#e4e4e7' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          <ActionBtn
            label={isLoading('maintenance') ? 'Running…' : 'Run Maintenance'}
            onClick={() => runAction('maintenance', undefined, 'Maintenance')}
            disabled={!!loadingAction}
            color="default"
          />
          <ActionBtn
            label={isLoading('research') ? 'Researching…' : '🔍 Run Research'}
            onClick={() => runAction('research', undefined, 'Research')}
            disabled={!!loadingAction}
            color="indigo"
          />
          <ActionBtn
            label={isLoading('send-digest') ? 'Sending…' : '📰 Send Digest'}
            onClick={() => runAction('send-digest')}
            disabled={!!loadingAction}
            color="default"
          />
          <ActionBtn
            label={isLoading('send-reminders') ? 'Sending…' : '⏰ Send Reminders'}
            onClick={() => runAction('send-reminders')}
            disabled={!!loadingAction}
            color="default"
          />
        </div>

        {/* Activity log */}
        {logs.length > 0 && (
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px', marginBottom: '28px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif' }}>Activity</div>
            {logs.map((l, i) => (
              <div key={i} style={{ fontSize: '13px', color: l.type === 'error' ? '#f87171' : l.type === 'success' ? '#86efac' : '#a1a1aa', padding: '3px 0', borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                {l.type === 'error' ? '✕' : l.type === 'success' ? '✓' : '·'} {l.msg}
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
          {(['contests', 'email', 'research'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
                color: activeTab === tab ? '#e4e4e7' : '#52525b',
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: '-1px',
              }}
            >
              {tab === 'contests' ? `Contests (${contests.length})` : tab === 'email' ? 'Email' : 'Research'}
            </button>
          ))}
        </div>

        {/* Contests table */}
        {activeTab === 'contests' && (
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Status', 'Name', 'Organizer', 'Prize', 'Deadline', 'Actions'].map(h => (
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
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={c.status}
                          onChange={e => updateStatus(c.id, e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '5px',
                            color: STATUS_COLORS[c.status],
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '3px 6px',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="open">Open</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 500, color: '#e4e4e7', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.featured && <span style={{ fontSize: '10px', color: '#818cf8', marginRight: '5px' }}>★</span>}
                          {c.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#71717a', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.organizer}</td>
                      <td style={{ padding: '10px 14px', color: '#a5b4fc', whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.prize}</td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: isUrgent ? '#f87171' : '#71717a' }}>{fmt(c.deadline)}</span>
                        {c.status === 'open' && <span style={{ fontSize: '11px', color: isUrgent ? '#f87171' : '#3f3f46', marginLeft: '6px' }}>{dl}d</span>}
                      </td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
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

        {/* Email composer */}
        {activeTab === 'email' && (
          <div style={{ maxWidth: '640px' }}>
            <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '20px', lineHeight: 1.6 }}>
              Write a custom email to all <strong style={{ color: '#e4e4e7' }}>{stats.confirmedSubs}</strong> confirmed subscribers.
              Use plain paragraphs — each line becomes a paragraph.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Subject line"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="input"
                style={{ fontSize: '14px' }}
              />
              <textarea
                placeholder="Email body — write naturally. Each line becomes a paragraph."
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                rows={10}
                className="input"
                style={{ fontSize: '14px', resize: 'vertical', lineHeight: 1.65 }}
              />
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

        {/* Research tab */}
        {activeTab === 'research' && (
          <div style={{ maxWidth: '640px' }}>
            <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '24px', lineHeight: 1.65 }}>
              Manually trigger the research agent. It searches the web for new AI film contests, verifies them against live URLs, adds them to Supabase, and emails subscribers about anything new found.
            </p>
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '20px 22px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '12px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', fontFamily: 'Space Grotesk, sans-serif' }}>What it does</div>
              <div style={{ fontSize: '13px', color: '#71717a', lineHeight: 2.1 }}>
                ✦&nbsp;&nbsp;Searches 5 targeted queries via Perplexity Sonar Pro<br />
                ✦&nbsp;&nbsp;Fetches and reads each promising result page<br />
                ✦&nbsp;&nbsp;Validates deadline, prize, eligibility from live page<br />
                ✦&nbsp;&nbsp;Deduplicates against existing database<br />
                ✦&nbsp;&nbsp;Writes new contests to Supabase (live immediately)<br />
                ✦&nbsp;&nbsp;Emails subscribers if new contests found<br />
                ✦&nbsp;&nbsp;Cost: ~$0.04 per run via OpenRouter
              </div>
            </div>
            <button
              disabled={!!loadingAction}
              onClick={() => runAction('research', undefined, 'Research')}
              className="btn"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              {isLoading('research') ? '🔍 Researching… (may take 30–60s)' : '🔍 Run Research Now'}
            </button>
            <p style={{ fontSize: '12px', color: '#3f3f46', marginTop: '10px' }}>Also runs automatically at 8:15 AM UTC every day via Vercel Cron.</p>
          </div>
        )}

      </div>
    </div>
  )
}

function ActionBtn({ label, onClick, disabled, color }: {
  label: string
  onClick: () => void
  disabled: boolean
  color: 'indigo' | 'default'
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'Space Grotesk, sans-serif',
        borderRadius: '7px',
        border: '1px solid rgba(255,255,255,0.1)',
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
