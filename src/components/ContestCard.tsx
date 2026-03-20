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

  // ── 3-D tilt + mouse spotlight ────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px   = (e.clientX - rect.left) / rect.width
    const py   = (e.clientY - rect.top)  / rect.height

    // Spotlight (CSS custom props drive the ::before radial-gradient)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)

    // Tilt ±6°
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
    // Re-enable transform transition so the reset is smooth
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

      {/* Shimmer layer — sweeps across on hover via CSS */}
      <div aria-hidden className="card-shimmer" />

      <div className={`flex flex-col flex-1 p-5 gap-3 ${isClosed ? 'opacity-40' : ''}`}>

        {/* Row 1: status + deadline */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
            <span style={{
              fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
              color: isOpen ? '#22c55e' : isClosed ? '#3f3f46' : '#f59e0b',
              letterSpacing: '0.01em',
            }}>
              {isOpen ? 'Open' : isClosed ? 'Closed' : 'Coming Soon'}
            </span>
            {contest.entryFee === 'Free' && !isClosed && (
              <span style={{
                fontSize: 9, color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.18)',
                borderRadius: 4, padding: '1px 5px',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: 'rgba(34,197,94,0.05)',
              }}>Free</span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            {isClosed ? (
              <span style={{ fontSize: 11, color: '#3f3f46' }}>{fmt(contest.deadline)}</span>
            ) : isUrgent && cd ? (
              <span className="urgent" style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#f87171' }}>
                {cd.days === 0 ? `${cd.hours}h left` : `${cd.days}d ${cd.hours}h`}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: '#52525b' }}>{fmt(contest.deadline)}</span>
            )}
          </div>
        </div>

        {/* Row 2: name + organizer */}
        <div>
          <h3 className="card-title" style={{
            fontSize: 15, fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#e4e4e7',
            lineHeight: 1.3, marginBottom: 3,
            letterSpacing: '-0.01em',
            transition: 'color 0.15s',
          }}>
            {contest.name}
          </h3>
          <p style={{
            fontSize: 10, color: '#3f3f46',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            {contest.organizer}
          </p>
        </div>

        {/* Row 3: description */}
        <p style={{
          fontSize: 13, color: '#71717a',
          lineHeight: 1.65,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {contest.description}
        </p>

        {/* Row 4: category tags */}
        <div className="flex flex-wrap gap-1">
          {contest.categories.slice(0, 4).map(cat => (
            <span key={cat} style={{
              fontSize: 9,
              color: '#3f3f46',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 4, padding: '2px 6px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.02)',
              transition: 'color 0.15s',
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
              fontSize: 9, color: '#3f3f46',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: 'Space Grotesk, sans-serif', marginBottom: 3,
            }}>Prize</div>
            <div style={{
              fontSize: 13, fontWeight: 700,
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
              display: 'flex', alignItems: 'center', gap: 4,
              flexShrink: 0,
              transition: 'color 0.15s, gap 0.15s',
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
