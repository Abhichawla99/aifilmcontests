'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Contest } from '@/data/contests'

function useCountdown(deadline: string) {
  const calc = () => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 30_000)
    return () => clearInterval(id)
  }, [deadline])
  return t
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* Same words as ContestCard, so the featured contest and the grid under it agree. */
function timeLeft(cd: { days: number; hours: number }) {
  if (cd.days >= 1) return `${cd.days} ${cd.days === 1 ? 'day' : 'days'} left`
  return `${cd.hours} ${cd.hours === 1 ? 'hour' : 'hours'} left`
}

export default function FeaturedSpotlight({ contest }: { contest: Contest }) {
  const cd = useCountdown(contest.deadline)
  const isUrgent = cd && cd.days <= 7

  return (
    <div style={{
      position: 'relative',
      border: '1px solid rgba(99,102,241,0.18)',
      borderRadius: 20,
      background: '#FFFFFF',
      boxShadow: '0 1px 2px rgba(27,25,22,0.04), 0 18px 40px -22px rgba(27,25,22,0.16)',
      overflow: 'hidden',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 100, padding: '4px 12px', width: 'fit-content',
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M4 0L5.09 2.91L8 4L5.09 5.09L4 8L2.91 5.09L0 4L2.91 2.91L4 0Z" fill="#4338CA" />
        </svg>
        <span style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#4338CA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Featured Contest
        </span>
      </div>

      {/* Contest name */}
      <div>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 700,
          color: '#1B1916',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginBottom: 6,
        }}>
          {contest.name}
        </h3>
        <p style={{ fontSize: 12, color: '#8B867C', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {contest.organizer}
        </p>
      </div>

      {/* The two facts you decide with, set as ruled rows before the prose, the way a
          programme puts the showtime under the title. The deadline speaks the same
          language as every ContestCard: time left as the figure, the date as its caption. */}
      <div style={{ borderTop: '1px solid #D9D4C9', borderBottom: '1px solid #E7E4DC' }}>
        <div style={{ padding: '14px 0 16px' }}>
          <div className="spot-label">Prize pool</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700, color: '#4338CA', lineHeight: 1.2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {contest.prize}
          </div>
        </div>
        <div style={{ padding: '14px 0 16px', borderTop: '1px solid #E7E4DC' }}>
          <div className="spot-label">Deadline</div>
          <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700,
              color: isUrgent ? '#C2410C' : '#1B1916',
              letterSpacing: '-0.02em', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums',
            }}>
              {cd ? timeLeft(cd) : fmt(contest.deadline)}
            </span>
            {cd && (
              <span style={{
                fontSize: 11, color: '#7A7469', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                letterSpacing: '0.07em', textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums',
              }}>
                {fmt(contest.deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13.5, color: '#6F6A61', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {contest.description}
      </p>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 10 }}>
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px 18px',
            borderRadius: 10,
            background: '#4F46E5',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: 'none',
            transition: 'opacity 0.15s, transform 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Enter Now
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <Link
          href={`/contests/${contest.id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '11px 14px',
            borderRadius: 10,
            border: '1px solid rgba(27,25,22,0.07)',
            background: 'rgba(27,25,22,0.03)',
            color: '#7A7469',
            fontSize: 12,
            fontFamily: 'Space Grotesk, sans-serif',
            textDecoration: 'none',
            transition: 'color 0.15s, border-color 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#6F6A61'; e.currentTarget.style.borderColor = 'rgba(27,25,22,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#7A7469'; e.currentTarget.style.borderColor = 'rgba(27,25,22,0.07)' }}
        >
          Details
        </Link>
      </div>
    </div>
  )
}
