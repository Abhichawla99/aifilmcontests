import { contests, getContestsByStatus, getFeaturedContests } from '@/data/contests'
import ContestCard from '@/components/ContestCard'
import EmailSubscribe from '@/components/EmailSubscribe'

export const dynamic = 'force-dynamic'

export default function Home() {
  const openContests = getContestsByStatus('open')
  const upcomingContests = getContestsByStatus('upcoming')
  const featuredContests = getFeaturedContests()
  const totalPrize = contests
    .filter(c => c.status !== 'closed')
    .reduce((sum, c) => {
      const match = c.prize.match(/\$([0-9,]+)/)
      if (match) return sum + parseInt(match[1].replace(',', ''))
      return sum
    }, 0)

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-sm">
              🎬
            </div>
            <span className="font-bold text-white text-lg">AI Film Contests</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#contests" className="text-sm text-zinc-400 hover:text-white transition-colors">Contests</a>
            <a href="#subscribe" className="text-sm text-zinc-400 hover:text-white transition-colors">Subscribe</a>
            <a
              href="#subscribe"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            >
              Get Alerts
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {openContests.length} contests open right now
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Every AI Film{' '}
            <span className="gradient-text">Contest.</span>
            <br />
            One Place.
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-4">
            The definitive hub for creative AI film competitions, festivals, grants, and challenges.
            Never miss a deadline again.
          </p>

          <p className="text-sm text-zinc-600 mb-12">
            ${totalPrize.toLocaleString()}+ in prizes across {contests.filter(c => c.status !== 'closed').length} active competitions
          </p>

          {/* CTA */}
          <div id="subscribe" className="max-w-xl mx-auto mb-16">
            <EmailSubscribe />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: 'Open Contests', value: openContests.length.toString() },
              { label: 'Coming Soon', value: upcomingContests.length.toString() },
              { label: 'Total Prizes', value: `$${Math.round(totalPrize / 1000)}K+` },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="px-6 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-pink-500" />
            <h2 className="text-2xl font-bold text-white">Featured Competitions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredContests.map(contest => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </section>

        {/* All Open Contests */}
        <section id="contests" className="px-6 pb-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
              <h2 className="text-2xl font-bold text-white">Open Now</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                {openContests.length}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openContests.map(contest => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </section>

        {/* Upcoming Contests */}
        {upcomingContests.length > 0 && (
          <section className="px-6 pb-16 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
                <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
                  {upcomingContests.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingContests.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="px-6 pb-24 max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden p-12" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(236, 72, 153, 0.15))' }}>
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Never miss a{' '}
                <span className="gradient-text">deadline</span> again
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                We track every AI film contest, festival, and grant. Subscribe and get instant email alerts when new opportunities open.
              </p>
              <EmailSubscribe />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-6 py-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎬</span>
              <span className="font-semibold text-white">AI Film Contests</span>
            </div>
            <p className="text-sm text-zinc-600">
              Tracking every AI film competition so you don&apos;t have to.
            </p>
            <p className="text-sm text-zinc-700">
              Want to add a contest?{' '}
              <a href="mailto:hello@aifilmcontests.com" className="text-violet-500 hover:text-violet-400 transition-colors">
                Email us
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
