import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import ContestBrowser from '@/components/ContestBrowser'
import EmailSubscribe from '@/components/EmailSubscribe'

export const dynamic = 'force-dynamic'
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

  // Ticker: open contests by nearest deadline
  const ticker = [...open]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  const tickerItems = [...ticker, ...ticker]

  return (
    <div style={{ background: '#080810', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: '#4f46e5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#fff',
            }}>
              AI
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#e4e4e7' }}>
              AI Film Contests
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-5">
            <a href="#contests" className="link-muted" style={{ fontSize: 13 }}>Browse</a>
            <a href="#subscribe" className="link-muted" style={{ fontSize: 13 }}>Subscribe</a>
            <a href="mailto:hello@aifilmcontests.com" className="link-muted" style={{ fontSize: 13 }}>Submit a Contest</a>
          </nav>

          <a href="#subscribe" className="btn" style={{ padding: '7px 14px', fontSize: 13 }}>
            Get Alerts
          </a>
        </div>
      </header>

      {/* ── Ticker ── */}
      {ticker.length > 0 && (
        <div className="ticker-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', padding: '8px 0' }}>
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
                  className="inline-flex items-center gap-2 px-6 hover:opacity-70 transition-opacity"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="dot" style={{ background: urgent ? '#ef4444' : '#22c55e' }} />
                  <span style={{ fontSize: 12, color: '#a1a1aa', fontFamily: 'Space Grotesk, sans-serif' }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: urgent ? '#f97316' : '#52525b', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    {d <= 0 ? 'today' : `${d}d`}
                  </span>
                  <span style={{ color: '#27272a', fontSize: 11 }}>·</span>
                  <span style={{ fontSize: 11, color: '#3f3f46' }}>{fmtShort(c.deadline)}</span>
                  <span style={{ color: '#1c1c1f', fontSize: 13, marginLeft: 12 }}>|</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-12">
        <div className="max-w-2xl">

          <div className="flex items-center gap-2 mb-6">
            <span className="dot dot-open live" />
            <span style={{ fontSize: 12, color: '#52525b', fontFamily: 'Space Grotesk, sans-serif' }}>
              {open.length} contests open · verified daily by AI agent
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#f4f4f5',
            marginBottom: 20,
          }}>
            Every AI film contest.<br />
            <span className="g">One place.</span>
          </h1>

          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            The only tracker for creative AI film competitions, festivals, grants, and challenges. Deadline-verified daily.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 flex-wrap mb-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 0' }}>
            {[
              { n: open.length,     label: 'Open now',    color: '#22c55e' },
              { n: upcoming.length, label: 'Coming soon', color: '#f59e0b' },
              { n: `$${(totalPrize / 1000).toFixed(0)}K+`, label: 'In prizes', color: '#a5b4fc' },
              { n: allContests.filter(c => c.status !== 'closed').length, label: 'Active total', color: '#71717a' },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: s.color }}>
                  {s.n}
                </span>
                <span style={{ fontSize: 12, color: '#52525b' }}>{s.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Subscribe card */}
        <div id="subscribe" className="mt-2" style={{ maxWidth: 420 }}>
          <div style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 24,
            background: 'rgba(255,255,255,0.02)',
          }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 600, color: '#e4e4e7', marginBottom: 6 }}>
              Never miss a deadline
            </h2>
            <p style={{ fontSize: 13, color: '#71717a', marginBottom: 18, lineHeight: 1.6 }}>
              Get emailed when new contests open and 7 days before any deadline closes.
            </p>
            <EmailSubscribe />
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <hr className="rule max-w-6xl mx-auto" style={{ marginLeft: 'auto', marginRight: 'auto' }} />

      {/* ── Browse ── */}
      <section id="contests" className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-7 gap-4">
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600, color: '#e4e4e7', marginBottom: 3 }}>
              Browse Competitions
            </h2>
            <p style={{ fontSize: 12, color: '#52525b' }}>
              {open.length + upcoming.length} active · deadline-verified against live sources daily
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0" style={{ fontSize: 11, color: '#3f3f46' }}>
            <span className="dot dot-open live" style={{ width: 5, height: 5 }} />
            Agent running daily
          </div>
        </div>

        <ContestBrowser contests={allContests} />
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div style={{
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '40px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 28,
          background: 'rgba(79,70,229,0.04)',
        }}>
          <div style={{ maxWidth: 440 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#f4f4f5', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Know before the deadline.
            </h2>
            <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.7 }}>
              An AI agent searches the web daily for new contests, visits each URL, and verifies every deadline — so you never act on wrong information.
            </p>
          </div>
          <div style={{ minWidth: 280, flex: '1 1 280px', maxWidth: 360 }}>
            <EmailSubscribe compact />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b' }}>
            AI Film Contests
          </span>
          <span style={{ fontSize: 12, color: '#3f3f46' }}>
            Tracking every AI film competition · Updated daily
          </span>
          <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
            <a href="mailto:hello@aifilmcontests.com" className="link-muted">Submit a Contest</a>
            <span style={{ color: '#27272a' }}>·</span>
            <a href="https://github.com/Abhichawla99/aifilmcontests" target="_blank" rel="noopener noreferrer" className="link-muted">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
