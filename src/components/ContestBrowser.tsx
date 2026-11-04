'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Contest } from '@/data/contests'
import ContestCard from './ContestCard'
import { normalizeCategory, categoryStyles } from '@/lib/theme'
import { daysUntilDeadline, formatDeadlineShort } from '@/lib/deadline'
import { isFree } from '@/lib/contest-filters'
import { MONEY, PRIZE_IS_A_FIGURE, PrizeFigures } from '@/components/PrizeValue'

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

/* A deadline is a calendar day, not an instant — see src/lib/deadline.ts.
   The list view and the card view now count and print it the same way. */
const daysUntil = daysUntilDeadline
const fmtShort = formatDeadlineShort

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

/* ── The prize, at row scale ────────────────────────────────────────────────
   The third and last place this value is printed, and the only one that never
   learned the rule the other two already follow (src/components/PrizeValue.tsx:
   a figure gets the tinted display face, a sentence gets set to be read). A row
   printed every prize at Space Grotesk 600 in the category ink inside a fixed
   220px cell, cut by `text-overflow: ellipsis` — so the 50 open contests in 61
   whose prize is a sentence put a half-word in the row's most emphatic type,
   with more weight than the contest's own name beside it: "Official selection
   screening in Las …", "4 cash awards across Best Film, Be…", "WAIFF Trophy +
   5 winners advance …".

   Two things change. The cut now lands on a whole word, the same rule the
   card's blurb has used since 10-08, measured in the face the cell is actually
   painted in; the CSS ellipsis stays on underneath as the backstop. And the
   setting follows the value: a figure keeps exactly the face it had, a sentence
   is set level with the organizer line, with any money inside it still picked
   out in the tint by the shared PrizeFigures. Nothing is extracted, reordered
   or dropped — the string is printed whole wherever it fits. */

const ELLIPSIS = '…'

let measureCtx: CanvasRenderingContext2D | null = null
function measurer() {
  if (!measureCtx && typeof document !== 'undefined') {
    measureCtx = document.createElement('canvas').getContext('2d')
  }
  return measureCtx
}

/* A comma or a dash before an ellipsis reads as a typo; a full stop reads as
   four dots. Same tail rule as the card. */
function trimTail(s: string) {
  return s.replace(/[\s,;:.–—-]+$/, '')
}

/* Renders whole on the server and on first paint, then cuts to the cell's own
   width once it has one. The cell is a grid track, not content-sized, so its
   width never moves with what we put in it and the observer cannot loop. */
function useOneLine(text: string) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(text)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      const m = measurer()
      const width = el.clientWidth - 1
      if (!m || !text || !(width > 0)) return
      const cs = getComputedStyle(el)
      m.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      try { (m as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing } catch { /* older engines */ }
      if (m.measureText(text).width <= width) { setShown(text); return }
      let cut = text
      while (cut) {
        if (m.measureText(trimTail(cut) + ELLIPSIS).width <= width) break
        const back = cut.lastIndexOf(' ')
        if (back < 0) { cut = ''; break }
        cut = cut.slice(0, back)
      }
      /* Nothing fits whole — leave the CSS ellipsis to do what it did before. */
      setShown(cut ? trimTail(cut) + ELLIPSIS : text)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit).catch(() => { /* measured against the fallback */ })
    return () => ro.disconnect()
  }, [text])
  return { ref, shown }
}

function RowPrize({ text, color }: { text: string; color: string }) {
  const value = (text || '').trim()
  const { ref, shown } = useOneLine(value)
  if (!value) return <span className="browse-row-prize" aria-hidden />
  const figures = value.match(MONEY)
  const isFigure = Boolean(figures) && value.length <= PRIZE_IS_A_FIGURE

  return (
    <span
      ref={ref}
      className={`browse-row-prize${isFigure ? ' is-figure' : ''}`}
      style={{
        minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
        ...(isFigure
          ? { fontSize: 12.5, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color }
          : { fontSize: 12.5, fontWeight: 400, color: '#57524A' }),
      }}
    >
      {isFigure || !figures ? shown : <PrizeFigures text={shown} color={color} />}
    </span>
  )
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
        /* The prize was a fixed 220px cell with every spare pixel of the row
           banked into the name column beside it — ~520px of air at 1440px,
           between a title that needed none of it and a value being cut for
           want of it. Both are tracks now, so the column starts at the same x
           down the whole list and the value gets the room the gutter was
           holding. */
        gridTemplateColumns: 'auto minmax(0,1.25fr) minmax(0,1fr) auto',
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
          {c.organizer}{isFree(c.entryFee) ? ' · Free entry' : ''}
        </span>
      </span>
      <RowPrize text={c.prize} color={tint.text} />
      <span style={{
        fontSize: 12.5, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
        fontVariantNumeric: 'tabular-nums', textAlign: 'right', whiteSpace: 'nowrap',
        color: c.status !== 'open' ? '#8B867C' : urgent ? '#C2410C' : '#3E3A33',
        minWidth: 76,
      }}>
        {c.status === 'open' && d >= 0 ? (d === 0 ? 'today' : `${d}d left`) : fmtShort(c.deadline)}
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
  // Free entry stacks on top of whichever status is selected, so its count is the
  // free contests inside the current status set, not inside the whole directory.
  // Switch from All active to Coming soon and the number moves with it, which is
  // the honest answer to "what will pressing this leave me with".
  const freeCount = useMemo(
    () => contests.filter(c =>
      c.status !== 'closed' &&
      (status === 'all' || c.status === status) &&
      isFree(c.entryFee)
    ).length,
    [contests, status]
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = contests.filter(c => {
      if (c.status === 'closed') return false
      if (status !== 'all' && c.status !== status) return false
      if (freeOnly && !isFree(c.entryFee)) return false
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

  /* No rows at all means the read failed, not that the directory is empty — see
     the note in src/app/page.tsx. A search field, five filter tabs each counting
     (0) and a sort control are furniture with nothing to act on, and the standard
     empty state tells the reader to widen filters they never set. Drop the whole
     toolbar and say what happened. */
  if (contests.length === 0) {
    return (
      <div style={{ border: '1px solid #E7E4DC', borderRadius: 12, background: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700,
            color: '#1B1916', letterSpacing: '-0.02em', marginBottom: 8,
          }}>
            The contest list didn’t load
          </p>
          <p style={{ fontSize: 14, color: '#7A7469', lineHeight: 1.7, marginBottom: 18 }}>
            Nothing has been taken down — the page could not reach the contest data
            just now.
          </p>
          <button onClick={() => window.location.reload()} className="btn">Reload</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Controls ── */}
      <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Search, sort, view — one row, one height */}
        <div className="bb-controls">
          <div className="bb-search">
            <span aria-hidden className="bb-search-icon">⌕</span>
            <input
              className="input"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search festivals, organizers, tools, cities…"
              aria-label="Search contests"
            />
          </div>

          <label className="bb-sort">
            <span className="bb-row-label" style={{ paddingTop: 0 }}>Sort</span>
            <span className="bb-select-wrap">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="input bb-select"
              >
                {SORTS.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </span>
          </label>

          <div className="bb-view" role="group" aria-label="Result layout">
            {(['cards', 'list'] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)} aria-pressed={view === v}>
                {v === 'cards' ? 'Cards' : 'List'}
              </button>
            ))}
          </div>
        </div>

        {/* Show: status, plus the free-entry toggle */}
        <div className="bb-row">
          <span className="bb-row-label" id="bb-show-label">Show</span>
          <div className="bb-chips" role="group" aria-labelledby="bb-show-label">
            {([
              { v: 'all',      label: `All active (${openCount + upcomingCount})` },
              { v: 'open',     label: `Open (${openCount})` },
              { v: 'upcoming', label: `Coming soon (${upcomingCount})` },
            ] as { v: StatusFilter; label: string }[]).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setStatus(v)}
                aria-pressed={status === v}
                className={`tab ${status === v ? 'on' : ''}`}
              >
                {label}
              </button>
            ))}
            {/* The three chips above are one choice: press one and it replaces the
                last. This one adds to whatever is already selected. Identically
                set, the row never said so — and it was also the only chip of the
                four carrying no count. A hairline now separates the two kinds,
                vertical where the row fits on a line and horizontal where it
                wraps (.bb-sep), and the count completes the row's pattern. */}
            <span className="bb-sep" aria-hidden="true" />
            <button
              onClick={() => setFreeOnly(v => !v)}
              aria-pressed={freeOnly}
              className={`tab ${freeOnly ? 'on' : ''}`}
            >
              Free entry ({freeCount})
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="bb-row">
          <span className="bb-row-label" id="bb-cat-label">Category</span>
          <div className="bb-chips" role="group" aria-labelledby="bb-cat-label">
            {CATEGORIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                aria-pressed={category === value}
                className={`tab ${category === value ? 'on' : ''}`}
                style={{ fontSize: 12, padding: '4px 10px' }}
              >
                {emoji ? `${emoji} ` : ''}{label}
              </button>
            ))}
          </div>
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
          {groups.map(([label, list]) => {
            const id = 'grp-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            return (
              <section key={label} aria-labelledby={id}>
                <h3 id={id} className={'cbg' + (label === 'Closing this week' ? ' cbg-urgent' : '')}>
                  <span className="cbg-label">{label}</span>
                  <span className="cbg-count" aria-hidden="true">{list.length}</span>
                  <span className="sr-only">, {list.length} contest{list.length === 1 ? '' : 's'}</span>
                  <span className="cbg-rule" aria-hidden="true" />
                </h3>
                {render(list)}
              </section>
            )
          })}
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
