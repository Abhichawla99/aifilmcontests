'use client'

import { useState, useMemo } from 'react'
import { Contest, ContestCategory } from '@/data/contests'
import ContestCard from './ContestCard'

type StatusFilter = 'all' | 'open' | 'upcoming'

const CATEGORIES: { value: ContestCategory | 'all'; label: string }[] = [
  { value: 'all',         label: 'All' },
  { value: 'short-film',  label: 'Short Film' },
  { value: 'animation',   label: 'Animation' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'experimental',label: 'Experimental' },
  { value: 'feature',     label: 'Feature' },
  { value: 'music-video', label: 'Music Video' },
  { value: 'commercial',  label: 'Commercial' },
  { value: 'advertising', label: 'Advertising' },
]

export default function ContestBrowser({ contests }: { contests: Contest[] }) {
  const [status, setStatus]     = useState<StatusFilter>('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [category, setCategory] = useState<ContestCategory | 'all'>('all')
  const [showClosed, setShowClosed] = useState(false)

  const openCount     = useMemo(() => contests.filter(c => c.status === 'open').length,     [contests])
  const upcomingCount = useMemo(() => contests.filter(c => c.status === 'upcoming').length, [contests])
  const closedCount   = useMemo(() => contests.filter(c => c.status === 'closed').length,   [contests])

  const active = useMemo(() => contests.filter(c => {
    if (c.status === 'closed') return false
    if (status !== 'all' && c.status !== status) return false
    if (freeOnly && c.entryFee !== 'Free') return false
    if (category !== 'all' && !c.categories.includes(category as ContestCategory)) return false
    return true
  }), [contests, status, freeOnly, category])

  const closed = useMemo(() => contests.filter(c => c.status === 'closed'), [contests])

  return (
    <div>
      {/* ── Filters ── */}
      <div className="mb-8 space-y-3">

        {/* Status tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {([
            { v: 'all',      label: `All Active (${openCount + upcomingCount})` },
            { v: 'open',     label: `Open (${openCount})` },
            { v: 'upcoming', label: `Coming Soon (${upcomingCount})` },
          ] as { v: StatusFilter; label: string }[]).map(({ v, label }) => (
            <button key={v} onClick={() => setStatus(v)} className={`tab ${status === v ? 'on' : ''}`}>
              {label}
            </button>
          ))}

          <div className="w-px h-4 bg-zinc-800 mx-1" />

          <button
            onClick={() => setFreeOnly(v => !v)}
            className={`tab ${freeOnly ? 'on' : ''}`}
          >
            Free Entry
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value as ContestCategory | 'all')}
              className={`tab ${category === value ? 'on' : ''}`}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {active.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-600 mb-4 text-sm">No contests match those filters.</p>
          <button
            onClick={() => { setStatus('all'); setFreeOnly(false); setCategory('all') }}
            className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {active.map(c => <ContestCard key={c.id} contest={c} />)}
        </div>
      )}

      {/* ── Closed toggle ── */}
      {closedCount > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setShowClosed(v => !v)}
            className="text-sm text-zinc-700 hover:text-zinc-500 transition-colors flex items-center gap-2"
          >
            <span style={{ fontSize: '10px' }}>{showClosed ? '▼' : '▶'}</span>
            {showClosed ? 'Hide' : 'Show'} past contests ({closedCount})
          </button>

          {showClosed && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {closed.map(c => <ContestCard key={c.id} contest={c} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
