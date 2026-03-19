'use client'

import { useState, useMemo } from 'react'
import { Contest, ContestCategory } from '@/data/contests'
import ContestCard from './ContestCard'

interface Props {
  contests: Contest[]
}

type StatusFilter = 'all' | 'open' | 'upcoming'
type FeeFilter = 'all' | 'free'

const CATEGORY_OPTIONS: { value: ContestCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'short-film', label: 'Short Film' },
  { value: 'animation', label: 'Animation' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'experimental', label: 'Experimental' },
  { value: 'feature', label: 'Feature' },
  { value: 'music-video', label: 'Music Video' },
  { value: 'commercial', label: 'Commercial / Advertising' },
]

export default function ContestBrowser({ contests }: Props) {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [fee, setFee] = useState<FeeFilter>('all')
  const [category, setCategory] = useState<ContestCategory | 'all'>('all')
  const [showClosed, setShowClosed] = useState(false)

  const activeContests = useMemo(() => {
    return contests.filter(c => {
      if (c.status === 'closed') return false
      if (status !== 'all' && c.status !== status) return false
      if (fee === 'free' && c.entryFee !== 'Free') return false
      if (category !== 'all' && !c.categories.includes(category as ContestCategory)) return false
      return true
    })
  }, [contests, status, fee, category])

  const closedContests = useMemo(() => {
    return contests.filter(c => c.status === 'closed')
  }, [contests])

  const openCount = contests.filter(c => c.status === 'open').length
  const upcomingCount = contests.filter(c => c.status === 'upcoming').length

  const hasFilters = status !== 'all' || fee !== 'free' || category !== 'all'

  return (
    <div>
      {/* ─── Filter Bar ─── */}
      <div className="flex flex-col gap-4 mb-10">
        {/* Status + Fee filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            {([
              { v: 'all', label: 'All Active' },
              { v: 'open', label: `Open Now (${openCount})` },
              { v: 'upcoming', label: `Coming Soon (${upcomingCount})` },
            ] as { v: StatusFilter; label: string }[]).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setStatus(v)}
                className={`filter-pill px-3.5 py-1.5 rounded-lg text-sm border transition-all ${
                  status === v
                    ? 'active bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Free only toggle */}
          <button
            onClick={() => setFee(f => f === 'free' ? 'all' : 'free')}
            className={`filter-pill px-3.5 py-1.5 rounded-xl text-sm border transition-all ${
              fee === 'free'
                ? 'active bg-emerald-500/12 border-emerald-500/40 text-emerald-400'
                : 'border-white/[0.07] bg-white/[0.04] text-zinc-400 hover:text-white hover:border-white/15'
            }`}
          >
            {fee === 'free' ? '✓ ' : ''}Free Entry Only
          </button>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value as ContestCategory | 'all')}
              className={`filter-pill px-3 py-1 rounded-lg text-xs border transition-all ${
                category === value
                  ? 'active bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                  : 'border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/12'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Contest Grid ─── */}
      {activeContests.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            No contests match your filters
          </h3>
          <p className="text-zinc-500 mb-6">Try removing some filters to see more results.</p>
          <button
            onClick={() => { setStatus('all'); setFee('all'); setCategory('all') }}
            className="px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeContests.map(contest => (
            <ContestCard key={contest.id} contest={contest} featured={contest.featured} />
          ))}
        </div>
      )}

      {/* ─── Closed Contests ─── */}
      {closedContests.length > 0 && (
        <div className="mt-16">
          <button
            onClick={() => setShowClosed(v => !v)}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors text-sm font-medium mb-6 group"
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: showClosed ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              ▶
            </span>
            {showClosed ? 'Hide' : 'Show'} Closed Contests ({closedContests.length})
          </button>

          {showClosed && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {closedContests.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
