'use client'

import { useEffect, useState } from 'react'
import { Contest } from '@/data/contests'

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

function useCountdown(deadline: string, status: string) {
  const calc = () => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0 || status !== 'open') return null
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 60_000)
    return () => clearInterval(id)
  }, [deadline, status])
  return t
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ContestCard({ contest }: { contest: Contest }) {
  const cd = useCountdown(contest.deadline, contest.status)
  const isOpen = contest.status === 'open'
  const isClosed = contest.status === 'closed'
  const isUrgent = isOpen && cd && cd.days <= 7

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card group ${isUrgent ? 'urgent-card' : ''}`}
    >
      <div className={`flex flex-col flex-1 p-5 gap-3 ${isClosed ? 'opacity-40' : ''}`}>

        {/* Row 1: status + deadline */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
            <span className="text-xs font-medium" style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: isOpen ? '#22c55e' : isClosed ? '#52525b' : '#f59e0b',
            }}>
              {isOpen ? 'Open' : isClosed ? 'Closed' : 'Coming Soon'}
            </span>
            {contest.entryFee === 'Free' && !isClosed && (
              <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Free
              </span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            {isClosed ? (
              <span className="text-xs text-zinc-700">{fmt(contest.deadline)}</span>
            ) : isUrgent && cd ? (
              <span className="urgent text-xs font-semibold text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {cd.days === 0 ? `${cd.hours}h left` : `${cd.days}d ${cd.hours}h left`}
              </span>
            ) : (
              <span className="text-xs text-zinc-500">{fmt(contest.deadline)}</span>
            )}
          </div>
        </div>

        {/* Row 2: name + organizer */}
        <div>
          <h3 className="text-[15px] font-semibold text-white leading-snug mb-0.5 group-hover:text-indigo-200 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {contest.name}
          </h3>
          <p className="text-xs text-zinc-600 font-medium tracking-wide uppercase">{contest.organizer}</p>
        </div>

        {/* Row 3: description */}
        <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2 flex-1">
          {contest.description}
        </p>

        {/* Row 4: categories */}
        <div className="flex flex-wrap gap-1">
          {contest.categories.slice(0, 4).map(cat => (
            <span key={cat} className="text-[11px] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">
              {categoryLabels[cat]}
            </span>
          ))}
        </div>

        {/* Row 5: prize + apply */}
        <hr className="rule" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">Prize</div>
            <div className="text-sm font-semibold text-white leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {contest.prize}
            </div>
          </div>
          {!isClosed && (
            <span className="text-[13px] font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1 flex-shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Apply
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          )}
        </div>

      </div>
    </a>
  )
}
