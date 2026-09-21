import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import ContestBrowser from '@/components/ContestBrowser'
import { ClapperDrawing, CalendarDrawing, EnvelopeDrawing, FilmmakerDoodle } from '@/components/Illustrations'
import EmailSubscribe from '@/components/EmailSubscribe'
import BackgroundFX from '@/components/BackgroundFX'
import MouseOrbs from '@/components/MouseOrbs'
import FeaturedSpotlight from '@/components/FeaturedSpotlight'
import LogoMark from '@/components/LogoMark'

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

  // Pick featured: a PAID, unexpired featured listing wins the spotlight
  // (most recent purchase first). Otherwise the highest-prize open contest;
  // fallback to first upcoming. The plain `featured` flag is editorial only.
  const nowMs = Date.now()
  const paidFeatured = open
    .filter(c => c.featuredUntil && new Date(c.featuredUntil).getTime() > nowMs)
    .sort((a, b) => new Date(b.featuredPaidAt ?? 0).getTime() - new Date(a.featuredPaidAt ?? 0).getTime())[0] ?? null
  const featured: Contest | null = paidFeatured ?? open.concat().sort((a, b) => {
    const pa = parseInt(a.prize.match(/\$([0-9,]+)/)?.[1].replace(/,/g,'') || '0')
    const pb = parseInt(b.prize.match(/\$([0-9,]+)/)?.[1].replace(/,/g,'') || '0')
    return pb - pa
  })[0] ?? upcoming[0] ?? null

  const ticker = [...open].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  const tickerItems = [...ticker, ...ticker]

  // JSON-LD: ItemList of open contests for rich results
  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Open AI Film Contests',
    description: 'Currently open AI film competitions, festivals, and grants.',
    numberOfItems: open.length,
    itemListElement: open.slice(0, 20).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: c.name,
        url: `https://aifilmcontests.com/contests/${c.id}`,
        description: c.description,
        organizer: { '@type': 'Organization', name: c.organizer },
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        ...(c.eventDate ? { startDate: c.eventDate } : {}),
        ...(c.location ? { location: { '@type': 'Place', name: c.location } } : {}),
        offers: {
          '@type': 'Offer',
          price: c.entryFee === 'Free' ? '0' : c.entryFee,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validThrough: c.deadline,
          url: c.url,
        },
      },
    })),
  }

  return (
    <div style={{ background: '#FBFAF8', minHeight: '100vh', position: 'relative' }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      {/* ── Animated WebGL shader + film grain ── */}
      <BackgroundFX />

      {/* ── Parallax background orbs (client — react to mouse) ── */}
      <MouseOrbs />

      {/* ── Content (above shader + orbs + grain) ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── Nav ──
             Same object as the inner-page header (.inav-*): flat paper, a
             hairline, the shared flat mark. Below 760px the links move to
             their own swipeable line instead of disappearing entirely, which
             is what they used to do below 640px. ── */}
        <header className="inav-header">
          <div className="max-w-6xl mx-auto px-5 inav-row hnav-row">
            <div className="inav-brand">
              <LogoMark />
              <span>AI Film Contests</span>
            </div>

            <nav className="inav" aria-label="Site">
              {([['Browse', '#contests'], ['Subscribe', '#subscribe'], ['Submit a Contest', '/submit']] as [string, string][]).map(([label, href]) => (
                <a key={label} href={href} className="inav-link">{label}</a>
              ))}
            </nav>

            <a href="#subscribe" className="btn hnav-cta">
              Get Alerts
            </a>
          </div>
        </header>

        {/* ── Ticker ── */}
        {ticker.length > 0 && (
          <div className="ticker-wrap">
            <div className="ticker-track">
              {tickerItems.map((c, i) => {
                const d = daysLeft(c.deadline)
                const urgent = d <= 7
                // The second copy only exists to make the loop seamless: keep it out of
                // the tab order and away from screen readers.
                const dup = i >= ticker.length
                return (
                  <a
                    key={`${c.id}-${i}`}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`tick-item${urgent ? ' tick-urgent' : ''}${dup ? ' tick-dup' : ''}`}
                    aria-hidden={dup || undefined}
                    tabIndex={dup ? -1 : undefined}
                  >
                    <span className="dot" />
                    <span className="tick-name">{c.name}</span>
                    <span className="tick-days">{d <= 0 ? 'today' : `${d}d`}</span>
                    <span className="tick-date">{fmtShort(c.deadline)}</span>
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
                    <span style={{ fontSize: 12, color: '#15803D', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '0.02em' }}>
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
                    <span style={{ fontSize: 11, color: '#8B867C', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
                      Presented by
                    </span>
                    <span style={{ fontSize: 12, color: '#4338CA', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.01em' }}>
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
                  color: '#1B1916',
                  marginBottom: 22,
                  maxWidth: 680,
                }}>
                  Every AI film<br />contest.{' '}
                  <span className="g">One place.</span>
                </h1>

                <p style={{
                  fontSize: 'clamp(14px, 1.8vw, 17px)',
                  color: '#7A7469',
                  lineHeight: 1.8,
                  marginBottom: 40,
                  maxWidth: 500,
                }}>
                  The only tracker for creative AI film competitions, festivals, grants, and challenges.
                  Deadline-verified daily by an agent that actually reads each page.
                </p>

                {/* Figures row: ruled, not boxed. Four across on desktop, 2×2 on a phone
                    (see .hero-stats in globals.css) so no figure is ever orphaned. */}
                <div className="hero-stats">
                  {[
                    { n: open.length,     label: 'Open now',    color: '#15803D' },
                    { n: upcoming.length, label: 'Coming soon', color: '#B45309' },
                    { n: totalPrize >= 1_000_000 ? `$${(totalPrize / 1_000_000).toFixed(1)}M+` : `$${Math.round(totalPrize / 1000)}K+`, label: 'In prizes', color: '#4338CA' },
                    { n: allContests.filter(c => c.status !== 'closed').length, label: 'Active', color: '#3E3A33' },
                  ].map(s => (
                    <div key={s.label} className="hero-stat">
                      <span className="hero-stat-n" style={{ color: s.color }}>{s.n}</span>
                      <span className="hero-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Subscribe card */}
                <div id="subscribe" style={{ maxWidth: 420 }}>
                  <div style={{
                    border: '1px solid #E3DED3',
                    borderRadius: 16,
                    padding: '24px 24px',
                    background: '#FFFFFF',
                  }}>
                    <div style={{ fontSize: 10, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Free alerts
                    </div>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: '#1B1916', marginBottom: 5, letterSpacing: '-0.02em' }}>
                      Never miss a deadline
                    </h2>
                    <p style={{ fontSize: 13, color: '#6F6A61', marginBottom: 18, lineHeight: 1.7 }}>
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
        <div style={{ borderTop: '1px solid rgba(27,25,22,0.06)', margin: '0 auto', maxWidth: 1152 }} />

        {/* ── What this is: three drawings, three true statements ── */}
        <section className="max-w-6xl mx-auto px-5 pt-14 pb-2">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              {
                art: <ClapperDrawing />, bg: '#E7F1F8', border: '#CFE2EF', ink: '#31536B',
                title: 'Every contest, one place',
                body: `${allContests.length} tracked and ${open.length} open right now — festivals, studio challenges, grants and brand briefs, not just the famous ones.`,
              },
              {
                art: <CalendarDrawing />, bg: '#FBF4DE', border: '#F0E3BC', ink: '#6B5A22',
                title: 'Deadlines you can trust',
                body: 'An agent re-reads the official page every morning. When a festival extends or quietly closes, the date here changes that day.',
              },
              {
                art: <EnvelopeDrawing />, bg: '#FDEEEC', border: '#F5D9D5', ink: '#7C3A31',
                title: 'Told before it closes',
                body: 'One email when new contests open, one last call three days before a deadline. Never more than that.',
              },
            ].map(c => (
              <div key={c.title} style={{
                background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14,
                padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.72)', border: `1px solid ${c.border}`,
                  borderRadius: 10, height: 132, padding: 8,
                }}>
                  {c.art}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700,
                    color: '#1B1916', letterSpacing: '-0.02em', marginBottom: 6,
                  }}>{c.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: c.ink, margin: 0 }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Browse ── */}
        <section id="contests" className="max-w-6xl mx-auto px-5 py-14">
          <div className="bmast">
            <h2 className="bmast-title">Browse Competitions</h2>
            <div className="bmast-meta">
              <p className="bmast-count">
                {open.length + upcoming.length} active · verified against live sources daily
              </p>
              <p className="bmast-agent">
                <span className="dot dot-open live" />
                <span className="bmast-agent-name">Research agent running daily</span>{' '}
                <span className="bmast-agent-note">{'· fresh contests added\u00A024/7'}</span>
              </p>
            </div>
          </div>

          <ContestBrowser contests={allContests} />
        </section>

        {/* ── Ruminatex / Cinematic AI advertising callout ── */}
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <aside className="rcal">
            {/* Film frame, stroked in the accent at the left rail rather than
                parked inside a tinted icon chip. */}
            <svg
              className="rcal-mark" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="#4F46E5" strokeWidth="1.5" aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.5" />
              <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5" />
            </svg>
            <p className="rcal-body">
              Looking to create{' '}
              <span className="rcal-em">cinematic AI content</span> for your brand?
            </p>
            <a className="rcal-link" href="/cinematic-ads">
              Explore how AI is reshaping brand filmmaking →
            </a>
            <a
              className="rcal-site"
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              ruminatex.com
            </a>
          </aside>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-6xl mx-auto px-5 pb-24">
          <div style={{
            border: '1px solid #E1DAF0',
            borderRadius: 16,
            padding: 'clamp(28px, 4vw, 44px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            background: '#F3F0F9',
            position: 'relative',
          }}>
            {/* the filmmaker, watching for the next one */}
            <div aria-hidden style={{ position: 'absolute', right: 26, bottom: 0, width: 116, height: 126, opacity: 0.9, pointerEvents: 'none' }} className="hidden lg:block">
              <FilmmakerDoodle />
            </div>

            <div style={{ maxWidth: 460, position: 'relative' }}>
              <div style={{ fontSize: 11, color: '#4C3F72', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                Always current
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(22px, 3.5vw, 34px)',
                fontWeight: 700,
                color: '#1B1916',
                marginBottom: 12,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
                Know before the deadline.
              </h2>
              <p style={{ fontSize: 14, color: '#6F6A61', lineHeight: 1.8 }}>
                An AI agent searches the web daily, visits each contest URL, and verifies every deadline against the live page — so you never act on stale information.
              </p>
            </div>
            <div style={{ minWidth: 280, flex: '1 1 280px', maxWidth: 360, position: 'relative' }}>
              <EmailSubscribe compact />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="sfoot">
          <div className="max-w-6xl mx-auto px-5 sfoot-grid">
            <div className="sfoot-ident">
              <a href="/" className="sfoot-mark">
                <span className="sfoot-tile" aria-hidden>AI</span>
                <span className="sfoot-name">AI Film Contests</span>
              </a>
              <p className="sfoot-tagline">
                {'Tracking every AI film competition ·\u00A0Updated daily'}
              </p>
              <p className="sfoot-credit">
                <a
                  href="https://ruminatex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted"
                >
                  Crafted by Ruminatex
                </a>
              </p>
            </div>

            <nav aria-labelledby="sfoot-browse">
              <h2 className="sfoot-head" id="sfoot-browse">Browse</h2>
              <div className="sfoot-links">
                <a href="/contests/closing-soon" className="link-muted">Closing Soon</a>
                <a href="/contests/free" className="link-muted">Free to Enter</a>
                <a href="/contests/cash-prizes" className="link-muted">Cash Prizes</a>
              </div>
            </nav>

            <nav aria-labelledby="sfoot-more">
              <h2 className="sfoot-head" id="sfoot-more">More</h2>
              <div className="sfoot-links">
                <a href="/submit" className="link-muted">Submit a Contest</a>
                <a href="/creators" className="link-muted">Featured Creators</a>
                <a href="/cinematic-ads" className="link-muted">Cinematic AI Ads</a>
              </div>
            </nav>
          </div>
        </footer>

      </div>
    </div>
  )
}
