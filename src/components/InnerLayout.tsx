import Link from 'next/link'
import React from 'react'

// SVG logo mark: film strip play button icon with indigo gradient, corner perf marks, white play triangle
function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 7 }}>
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="30" height="30" rx="7" fill="url(#ig)" />
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
      {/* Sticky Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(251,250,248,0.7)',
        borderBottom: '1px solid rgba(27,25,22,0.06)',
      }}>
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4" style={{ flexWrap: 'wrap' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#26231E' }}>AI Film Contests</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>Browse Contests</Link>
            <Link href="/contests/closing-soon" className="link-muted" style={{ fontSize: 13 }}>Closing Soon</Link>
            <Link href="/tools/runway" className="link-muted" style={{ fontSize: 13 }}>Tools</Link>
            <Link href="/categories/short-film" className="link-muted" style={{ fontSize: 13 }}>Categories</Link>
            <Link href="/cinematic-ads" className="link-muted" style={{ fontSize: 13 }}>Cinematic Ads</Link>
            <Link href="/creators" className="link-muted" style={{ fontSize: 13 }}>Creators</Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(27,25,22,0.05)', padding: '28px 0', marginTop: 'auto' }}>
        <div className="max-w-4xl mx-auto px-5" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Left: logo + name */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: '#8B867C' }}>AI Film Contests</span>
          </Link>

          {/* Center */}
          <span style={{ fontSize: 12, color: '#A8A296', textAlign: 'center' }}>Tracking every AI film competition · Updated daily</span>

          {/* Right: links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
