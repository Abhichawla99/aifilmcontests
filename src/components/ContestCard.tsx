import { Contest } from '@/data/contests'

interface ContestCardProps {
  contest: Contest
}

function getDaysUntilDeadline(deadline: string) {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diff = deadlineDate.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const statusConfig = {
  open: { label: 'Open Now', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', dot: 'bg-emerald-400' },
  upcoming: { label: 'Coming Soon', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', dot: 'bg-amber-400' },
  closed: { label: 'Closed', color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/30', dot: 'bg-zinc-500' },
}

const categoryLabels: Record<string, string> = {
  'short-film': 'Short Film',
  'feature': 'Feature',
  'animation': 'Animation',
  'experimental': 'Experimental',
  'documentary': 'Documentary',
  'music-video': 'Music Video',
  'advertising': 'Advertising',
  'commercial': 'Commercial',
}

export default function ContestCard({ contest }: ContestCardProps) {
  const daysLeft = getDaysUntilDeadline(contest.deadline)
  const status = statusConfig[contest.status]
  const isUrgent = contest.status === 'open' && daysLeft <= 14 && daysLeft > 0

  return (
    <a
      href={contest.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Featured badge */}
      {contest.featured && (
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-violet-500/50 via-pink-500/30 to-transparent" />
      )}

      {/* Urgent glow */}
      {isUrgent && (
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.3)' }} />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.bg} ${status.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${contest.status === 'open' ? 'animate-pulse' : ''}`} />
                {status.label}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
                  🔥 {daysLeft}d left
                </span>
              )}
              {contest.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium">
                  ✦ Featured
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-tight">
              {contest.name}
            </h3>
            <p className="text-sm text-violet-400/80 mt-0.5">{contest.organizer}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-white">{contest.prize}</div>
            {contest.entryFee && (
              <div className="text-xs text-zinc-500 mt-0.5">
                {contest.entryFee === 'Free' ? (
                  <span className="text-emerald-500">Free entry</span>
                ) : (
                  contest.entryFee
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
          {contest.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {contest.categories.map(cat => (
            <span key={cat} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-xs text-zinc-400">
              {categoryLabels[cat]}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-zinc-400">
              Deadline: <span className="text-white font-medium">{formatDeadline(contest.deadline)}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-violet-400 text-sm font-medium group-hover:gap-2.5 transition-all">
            Learn more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  )
}
