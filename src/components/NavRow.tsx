'use client'

import React, { useCallback, useEffect, useRef } from 'react'

interface NavRowProps {
  children: React.ReactNode
  /** Re-runs "bring the current link into view" whenever it changes. */
  currentKey?: string
  'aria-label'?: string
}

/** `.inav`'s own side padding on a phone, and the width of the edge fade. */
const GUTTER = 20

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
 *
 * It also parks the current page's link on the row's own gutter, clear of the
 * fade, so the one word on the row that says where you are is legible.
 */
export default function NavRow({ children, currentKey, ...rest }: NavRowProps) {
  const ref = useRef<HTMLElement>(null)

  const measure = useCallback(() => {
    const nav = ref.current
    if (!nav) return
    const links = nav.querySelectorAll<HTMLElement>('.inav-link')
    const first = links[0]
    const last = links[links.length - 1]
    if (!first || !last) { nav.dataset.overflow = 'none'; return }
    // A fade promises a link you have not read yet, so ask the links where the
    // row ends, not the scrollbar. The row finishes on a 12px spacer, and
    // measuring the scroller counted that spacer as somewhere to go: scroll to
    // within a few pixels of the end by hand and a fade came up over the last
    // link with nothing behind it.
    // 1px of tolerance: sub-pixel layout means the edges rarely meet exactly.
    const row = nav.getBoundingClientRect()
    const more = {
      start: first.getBoundingClientRect().left < row.left - 1,
      end: last.getBoundingClientRect().right > row.right + 1,
    }
    nav.dataset.overflow =
      more.start && more.end ? 'both'
        : more.start ? 'start'
          : more.end ? 'end' : 'none'
  }, [])

  // On a phone the links scroll sideways; bring the current one into view.
  const align = useCallback(() => {
    const nav = ref.current
    if (!nav) return
    const cur = nav.querySelector<HTMLElement>('[aria-current="page"]')
    if (cur && nav.scrollWidth > nav.clientWidth) {
      // Land the current link one gutter in from the left edge: the gutter the
      // page's own text keeps, and exactly the width of the start fade, so the
      // word naming the page you are on is never the word the fade dims. When
      // the row cannot scroll that far the browser clamps, which is the right
      // answer — the last links come to rest short of the gutter, in the clear.
      nav.scrollLeft = cur.offsetLeft - nav.offsetLeft - GUTTER
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
