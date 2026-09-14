import Link from 'next/link'
import React from 'react'
import InnerNav from './InnerNav'

// Logo mark: flat indigo film frame, corner perforations, white play triangle.
// Flat since 2026-09-14; the indigo-to-violet gradient was a dark-theme leftover.
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="30" height="30" rx="7" fill="#4F46E5" />
      {/* Perforation marks */}
      <rect x="3" y="4" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="3" y="11" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="3" y="18" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="4" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="11" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      <rect x="24" y="18" width="3" height="4" rx="0.8" fill="rgba(27,25,22,0.22)" />
      {/* Play triangle */}
      <polygon points="12,9 22,15 12,21" fill="white" />
    </svg>
  )
}

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
