'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OVERS_OFF_PERCENT, PACK_PATH } from '@/lib/creator-pack'

const DISMISS_KEY = 'pack-banner-dismissed'

/* The strip across the top of every page that points at the free creator pack.
   Off on the pack page itself, right after signing up (they already have it),
   and in the admin. Dismissing it is remembered in this browser only. It
   renders from the start so the page doesn't jump, then hides if this browser
   dismissed it before. */
export default function PackBanner() {
  const pathname = usePathname() || ''
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    try { if (localStorage.getItem(DISMISS_KEY) === '1') setHidden(true) } catch { /* storage blocked: keep showing */ }
  }, [])

  if (hidden || pathname === PACK_PATH || pathname.startsWith('/subscribed') || pathname.startsWith('/admin')) return null

  return (
    <div className="pack-banner" role="region" aria-label="Free creator pack">
      <Link href={PACK_PATH} className="pack-banner-link">
        <span className="pack-banner-tag">Free</span>
        <span className="pack-banner-text pack-banner-long">
          Creator pack: Overs at {OVERS_OFF_PERCENT}% off, a step-by-step AI film guide and the Creatives Club community
        </span>
        <span className="pack-banner-text pack-banner-short">Creator pack: Overs {OVERS_OFF_PERCENT}% off + guide + community</span>
        <span className="pack-banner-cta">Claim it →</span>
      </Link>
      <button
        type="button"
        className="pack-banner-close"
        aria-label="Hide this"
        onClick={() => {
          setHidden(true)
          try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* fine: hidden for this visit */ }
        }}
      >
        ×
      </button>
    </div>
  )
}
