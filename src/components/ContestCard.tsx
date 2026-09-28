'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Contest } from '@/data/contests'
import { categoryStyle, closedStyle, normalizeCategory } from '@/lib/theme'

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

/* Every card answers "how long do I have?" the same way: a figure, then a caption.
   Time remaining for an open contest — that is the decision — the date for the rest. */
function timeLeft(cd: { days: number; hours: number }) {
  if (cd.days >= 1) return `${cd.days} ${cd.days === 1 ? 'day' : 'days'} left`
  return `${cd.hours} ${cd.hours === 1 ? 'hour' : 'hours'} left`
}

export default function ContestCard({ contest }: { contest: Contest }) {
  const cd       = useCountdown(contest.deadline, contest.status)
  const isOpen   = contest.status === 'open'
  const isClosed = contest.status === 'closed'
  const isUrgent = isOpen && cd && cd.days <= 7
  const isFeatured = !!contest.featuredUntil && new Date(contest.featuredUntil).getTime() > Date.now()

  /* The first category gives the card its identity: emoji + pastel tint. */
  const tint = isClosed ? closedStyle : contest.categories?.[0] ? normalizeCategory(contest.categories[0]) : categoryStyle()

  return (
    <Link
      href={`/contests/${contest.id}`}
      className={`card card-v group ${isUrgent ? 'urgent-card' : ''}`}
      style={{ background: tint.bg, borderColor: tint.border }}
    >
      <div className={`flex flex-col flex-1 p-5 gap-3 ${isClosed ? 'opacity-70' : ''}`}>

        {/* Row 1: emoji identity + status | deadline figure */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span aria-hidden style={{ fontSize: 26, lineHeight: 1 }}>{tint.emoji}</span>
            <div className="flex items-center gap-2">
              <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
              <span style={{
                fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                color: isOpen ? '#15803D' : isClosed ? '#8B867C' : '#B45309',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {isOpen ? 'Open' : isClosed ? 'Closed' : 'Coming Soon'}
              </span>
              {contest.entryFee === 'Free' && !isClosed && (
                <span style={{
                  fontSize: 9, color: '#15803D',
                  border: '1px solid rgba(22,163,74,0.35)',
                  borderRadius: 4, padding: '1px 6px',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.6)',
                }}>Free</span>
              )}
              {isFeatured && (
                <span style={{
                  fontSize: 9, color: '#4F46E5',
                  border: '1px solid rgba(79,70,229,0.35)',
                  borderRadius: 4, padding: '1px 6px',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.6)',
                }}>Featured</span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div style={{
              fontSize: 13, fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: isClosed ? '#8B867C' : isUrgent ? '#C2410C' : '#1B1916',
            }}>
              {isOpen && cd ? timeLeft(cd) : fmt(contest.deadline)}
            </div>
            <div style={{
              fontSize: 9.5, color: '#8B867C',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginTop: 3,
            }}>
              {isOpen && cd ? fmt(contest.deadline) : 'Deadline'}
            </div>
          </div>
        </div>

        {/* Row 2: name + organizer */}
        <div>
          <h3 className="card-title" style={{
            fontSize: 15, fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#1B1916',
            lineHeight: 1.3, marginBottom: 4,
            letterSpacing: '-0.01em',
            transition: 'color 0.15s',
          }}>
            {contest.name}
          </h3>
          <p style={{
            fontSize: 11, color: '#7A7469',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 500, letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {contest.organizer}
          </p>
        </div>

        {/* Row 3: description. The grow lives on the wrapper — putting flex:1 on the
             clamped paragraph itself lets it stretch past its line limit, which clipped
             text mid-word instead of ellipsing. */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 13, color: '#57524A',
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {contest.description}
          </p>
        </div>

        {/* Row 4: category chips (white on the tint, labelled by their own emoji) */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from(new Map((contest.categories ?? []).map(cat => { const c = normalizeCategory(cat); return [c.label, c] as const })).values()).slice(0, 4).map(c => (
              <span key={c.label} style={{
                fontSize: 10,
                color: c.text,
                border: `1px solid ${c.border}`,
                borderRadius: 5, padding: '2px 7px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500, letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.72)',
              }}>
                {c.emoji}&nbsp;{c.label}
              </span>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: `1px solid ${tint.border}` }} />
        {/* Row 5: the prize, at the card's full measure.
             Most prizes are sentences, not figures — 56 of 89 open ones run past 45
             characters — so they were wrapping four and five times inside the ~170px
             left of the row. The caption line carries the two 10px meta items instead,
             and the value gets the whole width underneath. Same two lines as before. */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <span style={{
              fontSize: 10, color: '#8B867C',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
            }}>Prize</span>
            {contest.updatedAt && (
              <span style={{
                fontSize: 10, color: '#8B867C',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.01em',
                flexShrink: 0,
              }}>
                Verified {fmt(contest.updatedAt)}
              </span>
            )}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            fontFamily: 'Space Grotesk, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            color: tint.text, lineHeight: 1.35,
            marginTop: 4,
          }}>
            {contest.prize}
          </div>
        </div>

      </div>
    </Link>
  )
}
