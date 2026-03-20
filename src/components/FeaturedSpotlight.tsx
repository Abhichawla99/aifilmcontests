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
      minutes: Math.floor((diff % 3_600_000)  / 60_000),
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

export default function FeaturedSpotlight({ contest }: { contest: Contest }) {
  const cd = useCountdown(contest.deadline)
  const isUrgent = cd && cd.days <= 7

  return (
    <div style={{
      position: 'relative',
      border: '1px solid rgba(99,102,241,0.18)',
      borderRadius: 20,
      background: 'rgba(8,7,20,0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 80px -16px rgba(0,0,0,0.7), 0 0 80px -30px rgba(99,102,241,0.2)',
      overflow: 'hidden',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Top gradient highlight line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 40%, rgba(139,92,246,0.5) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 100, padding: '4px 12px', width: 'fit-content',
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M4 0L5.09 2.91L8 4L5.09 5.09L4 8L2.91 5.09L0 4L2.91 2.91L4 0Z" fill="#a5b4fc" />
        </svg>
        <span style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Featured Contest
        </span>
      </div>

      {/* Contest name */}
      <div>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 700,
          color: '#f4f4f5',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginBottom: 6,
        }}>
          {contest.name}
        </h3>
        <p style={{ fontSize: 12, color: '#3f3f46', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {contest.organizer}
        </p>
      </div>

      {/* Prize */}
      <div style={{
        padding: '20px',
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.1)',
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 10, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Prize Pool
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700, color: '#a5b4fc', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {contest.prize}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {contest.description}
      </p>

      {/* Deadline */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        background: isUrgent ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 10,
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#3f3f46', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            Deadline
          </div>
          <div style={{ fontSize: 13, color: '#71717a', fontFamily: 'Space Grotesk, sans-serif' }}>
            {fmt(contest.deadline)}
          </div>
        </div>
        {cd && (
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              color: isUrgent ? '#f87171' : '#e4e4e7',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {cd.days > 0 ? `${cd.days}d ${cd.hours}h` : `${cd.hours}h ${cd.minutes}m`}
            </div>
            <div style={{ fontSize: 10, color: '#3f3f46', fontFamily: 'Space Grotesk, sans-serif', marginTop: 3 }}>
              remaining
            </div>
          </div>
        )}
      </div>

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
            background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 0 24px -4px rgba(99,102,241,0.45)',
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
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
            color: '#71717a',
            fontSize: 12,
            fontFamily: 'Space Grotesk, sans-serif',
            textDecoration: 'none',
            transition: 'color 0.15s, border-color 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          Details
        </Link>
      </div>
    </div>
  )
}
