'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

// One listener for the whole site, so every page gets the same three events
// without each link having to know about analytics:
//   outbound_click  a link that leaves the site (a contest's official page, mostly)
//   contact_click   a mailto: link
//   data-track="x"  any anchor can name its own event, e.g. data-track="feature_pay"
// Pageviews come from <Analytics /> in the layout; signups and contest
// submissions are recorded server-side in their API routes, where ad blockers
// can't drop them.

const short = (s: string) => s.slice(0, 120)

export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
        if (!a) return
        const page = short(window.location.pathname)
        const named = a.dataset.track
        if (named) {
          track(named, { page, href: short(a.href) })
          return
        }
        const raw = a.getAttribute('href') ?? ''
        if (raw.startsWith('mailto:')) {
          track('contact_click', { page })
          return
        }
        const url = new URL(a.href, window.location.href)
        if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) return
        track('outbound_click', { host: short(url.host), href: short(url.origin + url.pathname), page })
      } catch {
        // analytics must never break a click
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
