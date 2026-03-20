import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import ContestBrowser from '@/components/ContestBrowser'
import EmailSubscribe from '@/components/EmailSubscribe'
import BackgroundFX from '@/components/BackgroundFX'
import MouseOrbs from '@/components/MouseOrbs'
import FeaturedSpotlight from '@/components/FeaturedSpotlight'

export const dynamic  = 'force-dynamic'
export const revalidate = 0

function daysLeft(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function Home() {
  const allContests: Contest[] = await getAllContests()
  const open     = allContests.filter(c => c.status === 'open')
  const upcoming = allContests.filter(c => c.status === 'upcoming')

  const totalPrize = [...open, ...upcoming].reduce((sum, c) => {
    const m = c.prize.match(/\$([0-9,]+)/)
    return m ? sum + parseInt(m[1].replace(/,/g, '')) : sum
  }, 0)

  // Pick featured: highest-prize open contest, fallback to first upcoming
  const featured: Contest | null = open.concat().sort((a, b) => {
    const pa = parseInt(a.prize.match(/\$([0-9,]+)/)?.[1].replace(/,/g,'') || '0')
    const pb = parseInt(b.prize.match(/\$([0-9,]+)/)?.[1].replace(/,/g,'') || '0')
    return pb - pa
  })[0] ?? upcoming[0] ?? null

  const ticker = [...open].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  const tickerItems = [...ticker, ...ticker]

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>

      {/* ── Animated WebGL shader + film grain ── */}
      <BackgroundFX />

      {/* ── Parallax background orbs (client — react to mouse) ── */}
      <MouseOrbs />

      {/* ── Content (above shader + orbs + grain) ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── Nav ── */}
        <header style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(5,5,8,0.6)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                color: '#fff', letterSpacing: '-0.02em',
                boxShadow: '0 0 16px rgba(99,102,241,0.4)',
              }}>
                AI
              </div>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 15, color: '#e4e4e7', letterSpacing: '-0.01em',
              }}>
                AI Film Contests
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-6">
              {([['Browse', '#contests'], ['Subscribe', '#subscribe'], ['Submit a Contest', 'mailto:hello@aifilmcontests.com']] as [string, string][]).map(([label, href]) => (
                <a key={label} href={href} className="link-muted" style={{ fontSize: 13, fontWeight: 500 }}>{label}</a>
              ))}
            </nav>

            <a href="#subscribe" className="btn" style={{ padding: '7px 16px', fontSize: 13 }}>
              Get Alerts
            </a>
          </div>
        </header>

        {/* ── Ticker ── */}
        {ticker.length > 0 && (
          <div className="ticker-wrap" style={{
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(255,255,255,0.01)',
            padding: '9px 0',
          }}>
            <div className="ticker-track">
              {tickerItems.map((c, i) => {
                const d = daysLeft(c.deadline)
                const urgent = d <= 5
                return (
                  <a
                    key={`${c.id}-${i}`}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 hover:opacity-60 transition-opacity"
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="dot" style={{ background: urgent ? '#ef4444' : '#22c55e', boxShadow: urgent ? '0 0 6px rgba(239,68,68,0.6)' : '0 0 6px rgba(34,197,94,0.5)' }} />
                    <span style={{ fontSize: 12, color: '#71717a', fontFamily: 'Space Grotesk, sans-serif' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: urgent ? '#f87171' : '#3f3f46', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                      {d <= 0 ? 'today' : `${d}d`}
                    </span>
                    <span style={{ color: '#1a1a24', fontSize: 11 }}>·</span>
                    <span style={{ fontSize: 11, color: '#27272a' }}>{fmtShort(c.deadline)}</span>
                    <span style={{ color: '#14141c', fontSize: 14, marginLeft: 12 }}>⎮</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Hero ── */}
        <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(48px, 6vw, 80px)', position: 'relative' }}>

          {/* Subtle dot grid */}
          <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

          <div className="max-w-6xl mx-auto px-5" style={{ position: 'relative' }}>

            {/* Two-column grid: text left, featured contest right */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'center',
            }}
              className="hero-grid"
            >

              {/* ── LEFT COLUMN ── */}
              <div>
                {/* Live badge + Presented by — same row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: 100, padding: '5px 14px',
                    background: 'rgba(34,197,94,0.05)',
                  }}>
                    <span className="dot dot-open live" style={{ width: 5, height: 5 }} />
                    <span style={{ fontSize: 12, color: '#4ade80', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '0.02em' }}>
                      {open.length} contests open · updated daily
                    </span>
                  </div>

                  {/* Presented by Ruminatex */}
                  <a
                    href="https://ruminatex.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="presented-by-badge"
                  >
                    <span style={{ fontSize: 11, color: '#52525b', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
                      Presented by
                    </span>
                    <span style={{ fontSize: 12, color: '#a5b4fc', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.01em' }}>
                      Ruminatex
                    </span>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(165,180,252,0.5)" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Headline */}
                <h1 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.04em',
                  color: '#f4f4f5',
                  marginBottom: 22,
                  maxWidth: 680,
                }}>
                  Every AI film<br />contest.{' '}
                  <span className="g">One place.</span>
                </h1>

                <p style={{
                  fontSize: 'clamp(14px, 1.8vw, 17px)',
                  color: '#71717a',
                  lineHeight: 1.8,
                  marginBottom: 40,
                  maxWidth: 500,
                }}>
                  The only tracker for creative AI film competitions, festivals, grants, and challenges.
                  Deadline-verified daily by an agent that actually reads each page.
                </p>

                {/* Stats strip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  flexWrap: 'wrap',
                  marginBottom: 44,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(8px)',
                  width: 'fit-content',
                  maxWidth: '100%',
                }}>
                  {[
                    { n: open.length,     label: 'Open now',    color: '#4ade80' },
                    { n: upcoming.length, label: 'Coming soon', color: '#fbbf24' },
                    { n: `$${(totalPrize / 1000).toFixed(0)}K+`, label: 'In prizes', color: '#a5b4fc' },
                    { n: allContests.filter(c => c.status !== 'closed').length, label: 'Active', color: '#71717a' },
                  ].map((s, i) => (
                    <div key={s.label} style={{
                      padding: '14px 22px',
                      borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      display: 'flex', flexDirection: 'column', gap: 3,
                    }}>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700, fontSize: 'clamp(20px, 2.5vw, 26px)',
                        color: s.color, lineHeight: 1,
                      }}>
                        {s.n}
                      </span>
                      <span style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subscribe card */}
                <div id="subscribe" style={{ maxWidth: 420 }}>
                  <div style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: '24px 24px',
                    background: 'rgba(10,9,22,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 24px 48px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ fontSize: 10, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Free alerts
                    </div>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#f4f4f5', marginBottom: 5, letterSpacing: '-0.02em' }}>
                      Never miss a deadline
                    </h2>
                    <p style={{ fontSize: 12, color: '#52525b', marginBottom: 18, lineHeight: 1.65 }}>
                      Get notified when new contests open and 7 days before any deadline closes.
                    </p>
                    <EmailSubscribe />
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: featured spotlight ── */}
              {featured && (
                <div className="hero-spotlight">
                  <FeaturedSpotlight contest={featured} />
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '0 auto', maxWidth: 1152 }} />

        {/* ── Browse ── */}
        <section id="contests" className="max-w-6xl mx-auto px-5 py-14">
          <div className="flex items-start justify-between mb-9 gap-4 flex-wrap">
            <div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 700,
                color: '#f4f4f5',
                marginBottom: 6,
                letterSpacing: '-0.03em',
              }}>
                Browse Competitions
              </h2>
              <p style={{ fontSize: 13, color: '#52525b' }}>
                {open.length + upcoming.length} active · verified against live sources daily
              </p>
            </div>
            <div className="agent-badge" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12,
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 100, padding: '7px 16px',
              background: 'rgba(34,197,94,0.04)',
              backdropFilter: 'blur(8px)',
            }}>
              <span className="dot dot-open live" style={{ width: 6, height: 6 }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#4ade80', letterSpacing: '0.01em' }}>
                Research agent running daily
              </span>
              <span style={{ fontSize: 10, color: '#166534', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
                · fresh contests added 24/7
              </span>
            </div>
          </div>

          <ContestBrowser contests={allContests} />
        </section>

        {/* ── Ruminatex / Cinematic AI advertising callout ── */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <div style={{
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 16,
            padding: '24px 28px',
            background: 'rgba(255,255,255,0.015)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Film frame icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(165,180,252,0.7)" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="2.5" />
                  <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>
                  Looking to create{' '}
                  <span style={{ color: '#a1a1aa' }}>cinematic AI content</span> for your brand?{' '}
                  <a
                    href="/cinematic-ads"
                    style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={undefined}
                  >
                    Explore how AI is reshaping brand filmmaking →
                  </a>
                </p>
              </div>
            </div>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: '#3f3f46',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                letterSpacing: '0.02em',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 8,
                padding: '6px 14px',
                transition: 'color 0.15s, border-color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              ruminatex.com
            </a>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-6xl mx-auto px-5 pb-24">
          <div style={{
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 20,
            padding: 'clamp(32px, 5vw, 56px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 36,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.07) 0%, rgba(109,40,217,0.05) 50%, rgba(10,9,22,0.6) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 64px -16px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative gradient */}
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ maxWidth: 460, position: 'relative' }}>
              <div style={{ fontSize: 11, color: '#6366f1', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                Always current
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(22px, 3.5vw, 34px)',
                fontWeight: 700,
                color: '#f4f4f5',
                marginBottom: 12,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
                Know before the deadline.
              </h2>
              <p style={{ fontSize: 14, color: '#52525b', lineHeight: 1.75 }}>
                An AI agent searches the web daily, visits each contest URL, and verifies every deadline against the live page — so you never act on stale information.
              </p>
            </div>
            <div style={{ minWidth: 280, flex: '1 1 280px', maxWidth: 360, position: 'relative' }}>
              <EmailSubscribe compact />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '28px 0',
          background: 'rgba(5,5,8,0.8)',
          backdropFilter: 'blur(8px)',
        }}>
          <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 5,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 800, color: '#fff',
              }}>AI</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#3f3f46' }}>
                AI Film Contests
              </span>
            </div>

            <span style={{ fontSize: 12, color: '#27272a' }}>
              Tracking every AI film competition · Updated daily
            </span>

            <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
              <a href="mailto:hello@aifilmcontests.com" className="link-muted">Submit a Contest</a>
              <span style={{ color: '#1c1c28' }}>·</span>
              <a href="/cinematic-ads" className="link-muted">Cinematic AI Ads</a>
              <span style={{ color: '#1c1c28' }}>·</span>
              <a
                href="https://ruminatex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-muted"
                style={{ fontSize: 11 }}
              >
                Crafted by Ruminatex
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
