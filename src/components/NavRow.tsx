'use client'

import React, { useCallback, useEffect, useRef } from 'react'

interface NavRowProps {
  children: React.ReactNode
  /** Re-runs "bring the current link into view" whenever it changes. */
  currentKey?: string
  'aria-label'?: string
}

/**
 * The site nav row. Below 760px it becomes one swipeable line, and this
 * component owns the one thing that line needs the stylesheet to know: which
 * end of it, if either, still has something past it. It writes that as
 * data-overflow="none|start|end|both", and globals.css fades only an end you
 * can actually scroll toward.
 *
 * The server-rendered value is "none" — no fade until a real measurement has
 * happened, which is the safe way round. A missing fade costs nothing; a fade
 * over the last link is the site telling a visitor something untrue.
 */
export default function NavRow({ children, currentKey, ...rest }: NavRowProps) {
  const ref = useRef<HTMLElement>(null)

  const measure = useCallback(() => {
    const nav = ref.current
    if (!nav) return
    const slack = nav.scrollWidth - nav.clientWidth
    // 1px of tolerance: sub-pixel layout means scrollLeft rarely hits 0 or max exactly.
    const more = { start: nav.scrollLeft > 1, end: nav.scrollLeft < slack - 1 }
    nav.dataset.overflow =
      slack <= 1 ? 'none'
        : more.start && more.end ? 'both'
          : more.start ? 'start'
            : more.end ? 'end' : 'none'
  }, [])

  // On a phone the links scroll sideways; bring the current one into view.
  const align = useCallback(() => {
    const nav = ref.current
    if (!nav) return
    const cur = nav.querySelector<HTMLElement>('[aria-current="page"]')
    const max = nav.scrollWidth - nav.clientWidth
    if (cur && max > 0) {
      // Land the link one gutter in from the left edge — unless that stops just
      // shy of the end, where the only thing left to scroll past is the row's
      // trailing spacer. Go the whole way instead, so the last link reads as
      // the last link rather than as one more pixel of somewhere else.
      const target = cur.offsetLeft - nav.offsetLeft - 20
      nav.scrollLeft = max - target < 20 ? max : target
    }
    measure()
  }, [measure])

  useEffect(() => { align() }, [currentKey, align])

  useEffect(() => {
    const nav = ref.current
    if (!nav) return
    nav.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(nav)
    // The row's own width is watched above, but its links get wider when the
    // two webfonts land, which resizes nothing the observer is looking at —
    // and the first alignment ran against the fallback metrics. Redo both.
    document.fonts?.ready.then(align).catch(() => {})
    return () => {
      nav.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [align, measure])

  return (
    <nav ref={ref} className="inav" data-overflow="none" {...rest}>
      {children}
    </nav>
  )
}
