'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavRow from './NavRow'

// Each link names the path prefix it owns, so /tools/pika still marks "Tools"
// even though the link itself points at /tools.
const LINKS: [label: string, href: string, owns: string | null][] = [
  ['Browse Contests', '/', null],
  ['Closing Soon', '/contests/closing-soon', '/contests/closing-soon'],
  ['Tools', '/tools', '/tools'],
  ['Categories', '/categories', '/categories'],
  ['Cinematic Ads', '/cinematic-ads', '/cinematic-ads'],
  ['Creators', '/creators', '/creators'],
  ['Free Pack', '/starter-pack', '/starter-pack'],
]

export default function InnerNav() {
  const pathname = usePathname() || ''

  return (
    <NavRow aria-label="Site" currentKey={pathname}>
      {LINKS.map(([label, href, owns]) => {
        const current = owns !== null && (pathname === owns || pathname.startsWith(owns + '/'))
        return (
          <Link key={href} href={href} className={href === '/starter-pack' ? 'inav-link inav-link-pack' : 'inav-link'} aria-current={current ? 'page' : undefined}>
            {label}
          </Link>
        )
      })}
    </NavRow>
  )
}
