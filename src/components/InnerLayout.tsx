import Link from 'next/link'
import React from 'react'
import InnerNav from './InnerNav'
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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(27,25,22,0.05)', padding: '28px 0', marginTop: 'auto' }}>
        <div className="max-w-5xl mx-auto px-5" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Left: logo + name */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: '#8B867C' }}>AI Film Contests</span>
          </Link>

          {/* Center */}
          <span style={{ fontSize: 12, color: '#A8A296', textAlign: 'center' }}>Tracking every AI film competition · Updated daily</span>

          {/* Right: links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px 16px', flexWrap: 'wrap' }}>
            <Link href="/" className="link-muted" style={{ fontSize: 12 }}>Browse All</Link>
            <Link href="/contests/closing-soon" className="link-muted" style={{ fontSize: 12 }}>Closing Soon</Link>
            <a href="/submit" className="link-muted" style={{ fontSize: 12 }}>Submit a Contest</a>
            <Link href="/creators" className="link-muted" style={{ fontSize: 12 }}>Featured Creators</Link>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-muted"
              style={{ fontSize: 12 }}
            >
              Crafted by Ruminatex
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
