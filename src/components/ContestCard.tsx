'use client'

import { useEffect, useState } from 'react'
import { Contest } from '@/data/contests'

interface ContestCardProps {
  contest: Contest
  featured?: boolean
}

function useCountdown(deadline: string) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(deadline))

  function calcTimeLeft(d: string) {
    const diff = new Date(d).getTime() - Date.now()
    if (diff <= 0) return null
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return { days, hours, mins, total: diff }
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(deadline)), 60_000)
    return () => clearInterval(id)
  }, [deadline])

  return timeLeft
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const categoryLabels: Record<string, string> = {
  'short-film': 'Short Film',
  feature: 'Feature',
  animation: 'Animation',
  experimental: 'Experimental',
  documentary: 'Documentary',
  'music-video': 'Music Video',
  advertising: 'Advertising',
  commercial: 'Commercial',
}

export default function ContestCard({ contest, featured = false }: ContestCardProps) {
  const countdown = useCountdown(contest.deadline)
  const isUrgent = contest.status === 'open' && countdown && countdown.days <= 10
  const isClosed = contest.status === 'closed'

  // Urgency tier
  const urgencyLevel = !countdown ? 'none'
    : countdown.days <= 3 ? 'critical'
    : countdown.days <= 10 ? 'high'
    : countdown.days <= 21 ? 'medium'
    : 'low'

  const borderClass = isClosed
    ? 'border-white/5'
    : urgencyLevel === 'critical'
    ? 'border-red-500/30 hover:border-red-500/50'
    : urgencyLevel === 'high'
    ? 'border-orange-500/25 hover:border-orange-500/40'
    : featured
    ? 'border-indigo-500/20 hover:border-indigo-500/40'
    : 'border-white/[0.07] hover:border-indigo-500/30'

  const bgClass = isClosed
    ? 'bg-white/[0.015]'
    : urgencyLevel === 'critical'
    ? 'bg-red-500/[0.04]'
    : featured
    ? 'bg-indigo-500/[0.04]'
    : 'bg-white/[0.025]'

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group contest-card relative flex flex-col rounded-2xl border overflow-hidden ${bgClass} ${borderClass}`}
      style={{ textDecoration: 'none' }}
    >
      {/* Top accent line — color by status */}
      {!isClosed && (
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{
            background: urgencyLevel === 'critical'
              ? 'linear-gradient(90deg, #ef4444, #f97316)'
              : urgencyLevel === 'high'
              ? 'linear-gradient(90deg, #f97316, #fbbf24)'
              : featured
              ? 'linear-gradient(90deg, #6366f1, #a855f7)'
              : contest.status === 'upcoming'
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #10b981, #34d399)',
          }}
        />
      )}

      <div className={`flex flex-col flex-1 p-5 ${isClosed ? 'opacity-50' : ''}`}>

        {/* ── Row 1: Status + badges ── */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {contest.status === 'open' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              Open Now
            </span>
          )}
          {contest.status === 'upcoming' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              Coming Soon
            </span>
          )}
          {contest.status === 'closed' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Closed
            </span>
          )}
          {urgencyLevel === 'critical' && (
            <span className="urgent-pulse inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ⚡ {countdown!.days === 0 ? `${countdown!.hours}h left` : `${countdown!.days}d left`}
            </span>
          )}
          {urgencyLevel === 'high' && !isClosed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              🔥 {countdown!.days}d left
            </span>
          )}
          {featured && !isClosed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ✦ Featured
            </span>
          )}
          {contest.entryFee === 'Free' && !isClosed && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-900/30 border border-emerald-700/20 text-emerald-500 text-xs font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Free Entry
            </span>
          )}
        </div>

        {/* ── Row 2: Name + Organizer ── */}
        <div className="mb-3">
          <h3
            className="text-[17px] font-bold text-white leading-tight mb-1 group-hover:text-indigo-200 transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {contest.name}
          </h3>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            {contest.organizer}
          </p>
        </div>

        {/* ── Row 3: Description ── */}
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {contest.description}
        </p>

        {/* ── Row 4: Categories ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {contest.categories.map(cat => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-md text-[11px] text-zinc-500 border border-white/5 bg-white/[0.03]"
            >
              {categoryLabels[cat]}
            </span>
          ))}
        </div>

        {/* ── Row 5: Prize + Deadline ── */}
        <div className="border-t border-white/[0.06] pt-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-1">Prize</div>
              <div className="text-base font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {contest.prize}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-1">Deadline</div>
              {contest.status === 'closed' ? (
                <div className="text-sm text-zinc-600 font-medium">{formatDate(contest.deadline)}</div>
              ) : countdown && urgencyLevel !== 'low' && urgencyLevel !== 'none' ? (
                <div className={`text-sm font-bold ${urgencyLevel === 'critical' ? 'text-red-400' : 'text-orange-400'}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {countdown.days === 0
                    ? `${countdown.hours}h ${countdown.mins}m`
                    : `${countdown.days}d ${countdown.hours}h`}
                </div>
              ) : (
                <div className="text-sm text-white font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {formatDate(contest.deadline)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 6: CTA ── */}
        {!isClosed && (
          <div
            className="enter-btn w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2"
          >
            Enter Contest
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </a>
  )
}
