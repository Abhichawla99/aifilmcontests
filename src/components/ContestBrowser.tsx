'use client'

import { useState, useMemo, useEffect } from 'react'
import { Contest } from '@/data/contests'
import ContestCard from './ContestCard'
import { normalizeCategory, categoryStyles } from '@/lib/theme'

type StatusFilter = 'all' | 'open' | 'upcoming'
type SortKey = 'deadline' | 'prize' | 'newest'
type View = 'cards' | 'list'

const PAGE = 12

const CATEGORIES = [
  { value: 'all', label: 'All', emoji: '' },
  ...Object.entries(categoryStyles).map(([value, s]) => ({ value, label: s.label, emoji: s.emoji })),
]

const SORTS: { v: SortKey; label: string }[] = [
  { v: 'deadline', label: 'Closing soonest' },
  { v: 'prize',    label: 'Biggest prize' },
  { v: 'newest',   label: 'Recently added' },
]

/** Largest money figure in a prize string, so "Biggest prize" can sort.
    Handles $1,000,000 / €30K / £2.5M / "10,000 USD". Currency-agnostic on purpose:
    we are ranking, not converting. */
function prizeValue(prize: string): number {
  let best = 0
  const re = /([$€£¥]|\b)\s?([\d,]+(?:\.\d+)?)\s*([KkMm])?/g
  let m
  while ((m = re.exec(prize))) {
    const n = parseFloat(m[2].replace(/,/g, ''))
    if (!isFinite(n)) continue
    const mult = m[3] ? (m[3].toLowerCase() === 'm' ? 1e6 : 1e3) : 1
    const v = n * mult
    // ignore bare years and small counts that are not money
    if (!m[1] && !m[3] && v < 1000) continue
    if (v > best) best = v
  }
  return best
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

/** Deadline buckets. A directory's real question is "what can I still enter, and
    by when" — grouping answers it and breaks one long scroll into named chunks. */
function bucket(c: Contest): string {
  if (c.status === 'upcoming') return 'Not open yet'
  const d = daysUntil(c.deadline)
  if (d <= 7) return 'Closing this week'
  if (d <= 30) return 'Closing this month'
  if (d <= 90) return 'In the next three months'
  return 'Later in the year'
}
const BUCKET_ORDER = ['Closing this week', 'Closing this month', 'In the next three months', 'Later in the year', 'Not open yet']

function fmtShort(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ── One compact row. 70 contests are far easier to scan as rows than as cards,
     so the view toggle is a real feature, not decoration. ─────────────────── */
function Row({ c }: { c: Contest }) {
  const d = daysUntil(c.deadline)
  const urgent = c.status === 'open' && d <= 7
  const tint = normalizeCategory(c.categories?.[0] ?? '')
  return (
    <a
      href={`/contests/${c.id}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0,1fr) auto auto',
        alignItems: 'center',
        gap: 14,
        padding: '11px 14px',
        borderTop: '1px solid #ECE9E2',
        textDecoration: 'none',
        color: 'inherit',
      }}
      className="browse-row"
    >
      <span aria-hidden style={{ fontSize: 17, lineHeight: 1 }}>{tint.emoji}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{
          display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
          fontSize: 14, color: '#1B1916', lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{c.name}</span>
        <span style={{
          display: 'block', fontSize: 11.5, color: '#8B867C', marginTop: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {c.organizer}{c.entryFee === 'Free' ? ' · Free entry' : ''}
        </span>
      </span>
      <span className="browse-row-prize" style={{
        fontSize: 12.5, color: tint.text, fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right',
        maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{c.prize}</span>
      <span style={{
        fontSize: 12.5, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
        fontVariantNumeric: 'tabular-nums', textAlign: 'right', whiteSpace: 'nowrap',
        color: c.status !== 'open' ? '#8B867C' : urgent ? '#C2410C' : '#3E3A33',
        minWidth: 76,
      }}>
        {c.status === 'open' ? (d <= 0 ? 'today' : `${d}d left`) : fmtShort(c.deadline)}
      </span>
    </a>
  )
}

export default function ContestBrowser({ contests }: { contests: Contest[] }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('deadline')
  const [view, setView] = useState<View>('cards')
  const [limit, setLimit] = useState(PAGE)
  const [showClosed, setShowClosed] = useState(false)

  // Read filters from the URL once, so a filtered view can be linked and shared.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('q')) setQ(p.get('q')!)
    if (p.get('status')) setStatus(p.get('status') as StatusFilter)
    if (p.get('cat')) setCategory(p.get('cat')!)
    if (p.get('free') === '1') setFreeOnly(true)
    if (p.get('sort')) setSort(p.get('sort') as SortKey)
    if (p.get('view') === 'list') setView('list')
  }, [])

  // Write them back without a navigation, so Back still leaves the page.
  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (status !== 'all') p.set('status', status)
    if (category !== 'all') p.set('cat', category)
    if (freeOnly) p.set('free', '1')
    if (sort !== 'deadline') p.set('sort', sort)
    if (view !== 'cards') p.set('view', view)
    const qs = p.toString()
    window.history.replaceState(null, '', qs ? `?${qs}${window.location.hash}` : window.location.pathname + window.location.hash)
  }, [q, status, category, freeOnly, sort, view])

  useEffect(() => { setLimit(PAGE) }, [q, status, category, freeOnly, sort])

  const openCount = useMemo(() => contests.filter(c => c.status === 'open').length, [contests])
  const upcomingCount = useMemo(() => contests.filter(c => c.status === 'upcoming').length, [contests])
  const closed = useMemo(() => contests.filter(c => c.status === 'closed'), [contests])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = contests.filter(c => {
      if (c.status === 'closed') return false
      if (status !== 'all' && c.status !== status) return false
      if (freeOnly && c.entryFee !== 'Free') return false
      // Categories in the database are freeform (the research robot has written 140+
      // distinct strings), so match on the normalized label, not the raw value.
      if (category !== 'all' && !(c.categories ?? []).some(x => normalizeCategory(x).label === categoryStyles[category].label)) return false
      if (needle) {
        const hay = [c.name, c.organizer, c.location, c.prize, ...(c.tags ?? []), ...(c.aiToolsAllowed ?? [])]
          .filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
    out.sort((a, b) => {
      if (sort === 'prize') return prizeValue(b.prize) - prizeValue(a.prize)
      if (sort === 'newest') return b.id.localeCompare(a.id)
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
    return out
  }, [contests, q, status, freeOnly, category, sort])

  const shown = filtered.slice(0, limit)
  const groups = useMemo(() => {
    if (sort !== 'deadline') return null
    const map = new Map<string, Contest[]>()
    shown.forEach(c => {
      const k = bucket(c)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(c)
    })
    return BUCKET_ORDER.filter(k => map.has(k)).map(k => [k, map.get(k)!] as const)
  }, [shown, sort])

  const hasFilters = Boolean(q) || status !== 'all' || freeOnly || category !== 'all'
  const clear = () => { setQ(''); setStatus('all'); setFreeOnly(false); setCategory('all') }

  const grid = (list: Contest[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {list.map(c => <ContestCard key={c.id} contest={c} />)}
    </div>
  )
  const rows = (list: Contest[]) => (
    <div style={{ border: '1px solid #E7E4DC', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
      {list.map(c => <Row key={c.id} c={c} />)}
    </div>
  )
  const render = (list: Contest[]) => (view === 'list' ? rows(list) : grid(list))

  return (
    <div>
      {/* ── Controls ── */}
      <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Search + sort + view */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
            <span aria-hidden style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, opacity: 0.5, pointerEvents: 'none',
            }}>⌕</span>
            <input
              className="input"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search festivals, organizers, tools, cities…"
              aria-label="Search contests"
              style={{ paddingLeft: 30 }}
            />
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              fontSize: 10, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.09em',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
            }}>Sort</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="input"
              style={{ width: 'auto', padding: '8px 10px', fontSize: 13, appearance: 'none', cursor: 'pointer' }}
            >
              {SORTS.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </label>

          <div style={{ display: 'inline-flex', border: '1px solid #E0DCD2', borderRadius: 8, overflow: 'hidden' }}>
            {(['cards', 'list'] as View[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                style={{
                  padding: '8px 12px', fontSize: 12.5, cursor: 'pointer', border: 'none',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                  background: view === v ? '#EEF0FB' : '#fff',
                  color: view === v ? '#4338CA' : '#7A7469',
                }}
              >
                {v === 'cards' ? 'Cards' : 'List'}
              </button>
            ))}
          </div>
        </div>

        {/* Status + free */}
        <div className="flex items-center gap-1 flex-wrap">
          {([
            { v: 'all',      label: `All active (${openCount + upcomingCount})` },
            { v: 'open',     label: `Open (${openCount})` },
            { v: 'upcoming', label: `Coming soon (${upcomingCount})` },
          ] as { v: StatusFilter; label: string }[]).map(({ v, label }) => (
            <button key={v} onClick={() => setStatus(v)} className={`tab ${status === v ? 'on' : ''}`}>
              {label}
            </button>
          ))}
          <span style={{ width: 1, height: 16, background: '#E7E4DC', margin: '0 6px' }} />
          <button onClick={() => setFreeOnly(v => !v)} className={`tab ${freeOnly ? 'on' : ''}`}>
            Free entry
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`tab ${category === value ? 'on' : ''}`}
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              {emoji ? `${emoji} ` : ''}{label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 13, color: '#7A7469' }}>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {filtered.length === 0
              ? 'No matches'
              : `${filtered.length} contest${filtered.length === 1 ? '' : 's'}${hasFilters ? ' match' : ''}`}
            {filtered.length > shown.length && ` · showing ${shown.length}`}
          </span>
          {hasFilters && (
            <button onClick={clear} className="link-muted" style={{ fontSize: 13, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div style={{ padding: '56px 20px', textAlign: 'center', border: '1px solid #E7E4DC', borderRadius: 12, background: '#fff' }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, color: '#1B1916', marginBottom: 6 }}>
            Nothing matches that yet
          </p>
          <p style={{ fontSize: 14, color: '#7A7469', marginBottom: 16 }}>
            {q ? <>No open contest mentions &ldquo;{q}&rdquo;.</> : 'Try widening the filters.'} New ones are added most mornings.
          </p>
          <button onClick={clear} className="btn">Clear filters</button>
        </div>
      ) : groups ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {groups.map(([label, list]) => (
            <section key={label}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: label === 'Closing this week' ? '#C2410C' : '#8B867C',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 9,
              }}>
                {label}
                <span style={{ flex: 1, height: 1, background: '#ECE9E2' }} />
                <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.75 }}>{list.length}</span>
              </h3>
              {render(list)}
            </section>
          ))}
        </div>
      ) : render(shown)}

      {/* ── Show more: the user decides how much page they get ── */}
      {filtered.length > shown.length && (
        <div style={{ marginTop: 26, textAlign: 'center' }}>
          <button onClick={() => setLimit(l => l + PAGE)} className="btn" style={{ padding: '11px 24px' }}>
            Show {Math.min(PAGE, filtered.length - shown.length)} more
          </button>
          <p style={{ fontSize: 12, color: '#8B867C', marginTop: 9, fontVariantNumeric: 'tabular-nums' }}>
            {shown.length} of {filtered.length}
          </p>
        </div>
      )}

      {/* ── Past contests ── */}
      {closed.length > 0 && (
        <div style={{ marginTop: 44, borderTop: '1px solid #ECE9E2', paddingTop: 18 }}>
          <button
            onClick={() => setShowClosed(v => !v)}
            className="link-muted"
            style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ fontSize: 9 }}>{showClosed ? '▼' : '▶'}</span>
            {showClosed ? 'Hide' : 'Show'} past contests ({closed.length})
          </button>
          {showClosed && <div style={{ marginTop: 18 }}>{rows(closed)}</div>}
        </div>
      )}
    </div>
  )
}
