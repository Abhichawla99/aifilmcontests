import Link from 'next/link'
import React from 'react'
import InnerNav from './InnerNav'
import SiteFooter from './SiteFooter'
import LogoMark from './LogoMark'

interface InnerLayoutProps {
  children: React.ReactNode
}

export default function InnerLayout({ children }: InnerLayoutProps) {
  return (
    <div style={{ background: '#FBFAF8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav: sticky on desktop; on a phone it scrolls away with the page */}
      <header className="inav-header">
        <div className="max-w-5xl mx-auto px-5 inav-row">
          <Link href="/" className="inav-brand">
            <LogoMark />
            <span>AI Film Contests</span>
          </Link>
          <InnerNav />
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      <SiteFooter />
    </div>
  )
}
