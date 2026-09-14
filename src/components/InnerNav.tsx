'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Each link names the path prefix it owns, so /tools/pika still marks "Tools"
// even though the link itself points at /tools/runway.
const LINKS: [label: string, href: string, owns: string | null][] = [
  ['Browse Contests', '/', null],
  ['Closing Soon', '/contests/closing-soon', '/contests/closing-soon'],
  ['Tools', '/tools/runway', '/tools'],
  ['Categories', '/categories/short-film', '/categories'],
  ['Cinematic Ads', '/cinematic-ads', '/cinematic-ads'],
  ['Creators', '/creators', '/creators'],
]

export default function InnerNav() {
  const pathname = usePathname() || ''
  const ref = useRef<HTMLElement>(null)

  // On a phone the links scroll sideways; bring the current one into view.
  useEffect(() => {
    const nav = ref.current
    const cur = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (nav && cur && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = cur.offsetLeft - nav.offsetLeft - 20
    }
  }, [pathname])

  return (
    <nav ref={ref} className="inav" aria-label="Site">
      {LINKS.map(([label, href, owns]) => {
        const current = owns !== null && (pathname === owns || pathname.startsWith(owns + '/'))
        return (
          <Link key={href} href={href} className="inav-link" aria-current={current ? 'page' : undefined}>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
