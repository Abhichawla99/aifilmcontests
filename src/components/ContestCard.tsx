'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Contest } from '@/data/contests'

const categoryLabels: Record<string, string> = {
  'short-film':  'Short Film',
  feature:       'Feature',
  animation:     'Animation',
  experimental:  'Experimental',
  documentary:   'Documentary',
  'music-video': 'Music Video',
  advertising:   'Advertising',
  commercial:    'Commercial',
}

const statusAccent: Record<string, string> = {
  open:     'rgba(34,197,94,0.55)',
  upcoming: 'rgba(245,158,11,0.45)',
  closed:   'rgba(39,39,42,0.4)',
}

function useCountdown(deadline: string, status: string) {
  const calc = () => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0 || status !== 'open') return null
    return {
      days:  Math.floor(diff / 86_400_000),
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
  const cd       = useCountdown(contest.deadline, contest.status)
  const isOpen   = contest.status === 'open'
  const isClosed = contest.status === 'closed'
  const isUrgent = isOpen && cd && cd.days <= 7

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px   = (e.clientX - rect.left) / rect.width
    const py   = (e.clientY - rect.top)  / rect.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    const tx = (py - 0.5) * -7
    const ty = (px - 0.5) *  7
    el.style.setProperty('--tx',   `${tx}deg`)
    el.style.setProperty('--ty',   `${ty}deg`)
    el.style.setProperty('--lift', '-5px')
    el.style.transition = 'border-color 0.2s, background 0.2s, box-shadow 0.2s'
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--tx',   '0deg')
    el.style.setProperty('--ty',   '0deg')
    el.style.setProperty('--lift', '0px')
    el.style.transition = 'border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.35s cubic-bezier(0.23,1,0.32,1)'
  }

  return (
    <Link
      href={`/contests/${contest.id}`}
      className={`card group ${isUrgent ? 'urgent-card' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left status accent strip */}
      <div aria-hidden style={{
        position: 'absolute',
        left: 0, top: '18%', bottom: '18%',
        width: 2,
        borderRadius: '0 2px 2px 0',
        background: statusAccent[contest.status] ?? 'transparent',
        opacity: isClosed ? 0.4 : 0.7,
      }} />

      <div aria-hidden className="card-shimmer" />

      <div className={`flex flex-col flex-1 p-5 gap-3 ${isClosed ? 'opacity-50' : ''}`}>

        {/* Row 1: status + deadline */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
            <span style={{
              fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              color: isOpen ? '#4ade80' : isClosed ? '#52525b' : '#fbbf24',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {isOpen ? 'Open' : isClosed ? 'Closed' : 'Coming Soon'}
            </span>
            {contest.entryFee === 'Free' && !isClosed && (
              <span style={{
                fontSize: 9, color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 4, padding: '1px 6px',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'rgba(34,197,94,0.07)',
              }}>Free</span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            {isClosed ? (
              <span style={{ fontSize: 11, color: '#52525b', fontFamily: 'Space Grotesk, sans-serif' }}>{fmt(contest.deadline)}</span>
            ) : isUrgent && cd ? (
              <span className="urgent" style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#f87171' }}>
                {cd.days === 0 ? `${cd.hours}h left` : `${cd.days}d ${cd.hours}h`}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: '#71717a', fontFamily: 'Space Grotesk, sans-serif' }}>{fmt(contest.deadline)}</span>
            )}
          </div>
        </div>

        {/* Row 2: name + organizer */}
        <div>
          <h3 className="card-title" style={{
            fontSize: 15, fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#e4e4e7',
            lineHeight: 1.3, marginBottom: 4,
            letterSpacing: '-0.01em',
            transition: 'color 0.15s',
          }}>
            {contest.name}
          </h3>
          <p style={{
            fontSize: 11, color: '#71717a',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500, letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {contest.organizer}
          </p>
        </div>

        {/* Row 3: description */}
        <p style={{
          fontSize: 13, color: '#a1a1aa',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {contest.description}
        </p>

        {/* Row 4: category tags */}
        <div className="flex flex-wrap gap-1.5">
          {contest.categories.slice(0, 4).map(cat => (
            <span key={cat} style={{
              fontSize: 10,
              color: '#71717a',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 4, padding: '2px 7px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500, letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.03)',
            }}>
              {categoryLabels[cat] ?? cat}
            </span>
          ))}
        </div>

        {/* Row 5: prize + CTA */}
        <hr className="rule" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div style={{
              fontSize: 10, color: '#52525b',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              marginBottom: 4,
            }}>Prize</div>
            <div style={{
              fontSize: 14, fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#c4b5fd', lineHeight: 1.2,
            }}>
              {contest.prize}
            </div>
          </div>
          {!isClosed && (
            <span className="card-cta" style={{
              fontSize: 12, fontWeight: 500,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#818cf8',
              display: 'flex', alignItems: 'center', gap: 5,
              flexShrink: 0,
              transition: 'color 0.15s',
            }}>
              View details
              <svg className="card-arrow" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transition: 'transform 0.2s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          )}
        </div>

      </div>
    </Link>
  )
}
