import { getAllContests } from '@/lib/contests-db'
import { Contest } from '@/data/contests'
import ContestBrowser from '@/components/ContestBrowser'
import EmailSubscribe from '@/components/EmailSubscribe'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysLeft(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default async function Home() {
  // Fetch live from Supabase on every request
  const allContests: Contest[] = await getAllContests()

  const openContests = allContests.filter(c => c.status === 'open')
  const upcomingContests = allContests.filter(c => c.status === 'upcoming')

  const totalPrizeDollars = [...openContests, ...upcomingContests].reduce((sum, c) => {
    const m = c.prize.match(/\$([0-9,]+)/)
    if (m) return sum + parseInt(m[1].replace(/,/g, ''))
    const mEur = c.prize.match(/€([0-9,]+)/)
    if (mEur) return sum + parseInt(mEur[1].replace(/,/g, ''))
    return sum
  }, 0)

  // Ticker: open contests sorted by soonest deadline
  const tickerContests = [...openContests].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )
  const tickerItems = [...tickerContests, ...tickerContests] // doubled for seamless loop

  return (
    <div className="min-h-screen" style={{ background: '#06060d' }}>
      {/* ─── Ambient background ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      <div className="relative z-10">
        {/* ─── Nav ─── */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              AI
            </div>
            <span className="font-bold text-white text-[15px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              AI Film Contests
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#contests" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Browse</a>
            <a href="mailto:hello@aifilmcontests.com" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Submit a Contest</a>
          </div>

          <a
            href="#subscribe"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontFamily: 'Space Grotesk, sans-serif', boxShadow: '0 0 0 1px rgba(99,102,241,0.3)' }}
          >
            Get Alerts
          </a>
        </nav>

        {/* ─── Deadline Ticker ─── */}
        {tickerContests.length > 0 && (
          <div className="border-b border-white/[0.04] overflow-hidden bg-white/[0.015]">
            <div className="ticker-track py-2.5" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {tickerItems.map((c, i) => {
                const days = getDaysLeft(c.deadline)
                const isUrgent = days <= 7
                return (
                  <a
                    key={`${c.id}-${i}`}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 hover:opacity-80 transition-opacity"
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: isUrgent ? '#ef4444' : '#10b981' }} />
                    <span className="text-xs text-zinc-400 font-medium whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {c.name}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap"
                      style={{ color: isUrgent ? '#f97316' : '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {days <= 0 ? 'Closes today' : `${days}d left`}
                    </span>
                    <span className="text-zinc-700 text-xs">·</span>
                    <span className="text-xs text-zinc-600 whitespace-nowrap">{formatDate(c.deadline)}</span>
                    <span className="ml-4 text-zinc-800">|</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── Hero ─── */}
        <section className="px-6 pt-16 pb-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 text-xs font-medium mb-7" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {openContests.length} contests open right now · Updated daily
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Every AI Film<br />
                Competition.{' '}
                <span className="gradient-text">One Place.</span>
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed mb-10 max-w-lg">
                The definitive hub for creative AI film competitions, festivals, grants, and challenges — tracked and verified daily by an AI agent.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[
                  { value: openContests.length.toString(), label: 'Open Now', color: '#10b981' },
                  { value: upcomingContests.length.toString(), label: 'Coming Soon', color: '#f59e0b' },
                  { value: `$${Math.round(totalPrizeDollars / 1000)}K+`, label: 'Prize Pool', color: '#818cf8' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 border border-white/[0.06] bg-white/[0.025]">
                    <div className="text-2xl font-bold mb-0.5"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', color: s.color }}>
                      {s.value}
                    </div>
                    <div className="text-xs text-zinc-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="subscribe" className="fade-up">
              <div className="rounded-2xl p-8 border"
                style={{ background: 'rgba(99, 102, 241, 0.04)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Never miss a deadline
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Get instant email alerts when new AI film contests open. Deadline reminders sent 7 days before close.
                  </p>
                </div>

                <EmailSubscribe />

                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-xs text-zinc-700 mb-3 uppercase tracking-widest font-medium">What you get</p>
                  <ul className="space-y-2">
                    {[
                      'Instant alerts for new contests',
                      'Deadline reminders 7 days before close',
                      'Grant & funding opportunities',
                      'Festival submission windows',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                        <svg className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ─── Contest Browser ─── */}
        <section id="contests" className="px-6 pt-12 pb-24 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Browse Competitions
              </h2>
              <p className="text-sm text-zinc-600">
                {openContests.length + upcomingContests.length} active · verified against live sources daily · powered by Supabase
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 flex-shrink-0 mt-1">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Agent running daily
            </div>
          </div>

          <ContestBrowser contests={allContests} />
        </section>

        {/* ─── Bottom CTA ─── */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden px-8 py-12 sm:px-16 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1)' }} />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Know before the deadline.
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              An AI agent scours the web daily for new contests and verifies every deadline, so the information is always accurate.
            </p>
            <div className="max-w-sm mx-auto">
              <EmailSubscribe compact />
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/[0.04] px-6 py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                AI
              </div>
              <span className="font-semibold text-zinc-300 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                AI Film Contests
              </span>
            </div>
            <p className="text-xs text-zinc-700 text-center">
              Tracking every AI film competition · Updated daily by an AI research agent
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-700">
              <a href="mailto:hello@aifilmcontests.com" className="hover:text-zinc-400 transition-colors">Submit a Contest</a>
              <span>·</span>
              <a href="https://github.com/Abhichawla99/aifilmcontests" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
