import type { Metadata } from 'next'

// page.tsx is 'use client' and cannot export metadata itself; this sibling
// layout carries it instead. A transactional action page, not content for
// Google — same reasoning as /subscribed (added 2026-10-13).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
