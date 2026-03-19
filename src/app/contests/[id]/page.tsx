import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getContestById, getAllContests } from '@/lib/contests-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function daysLeft(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
}

const categoryLabels: Record<string, string> = {
  'short-film': 'Short Film',
  feature: 'Feature',
  animation: 'Animation',
  experimental: 'Experimental',
  documentary: 'Documentary',
  'music-video': 'Music Video',
  advertising: 'Advertising',
  commercial: 'Commercial',
}

// ── generateStaticParams ────────────────────────────────────────────────────
export async function generateStaticParams() {
  const contests = await getAllContests()
  return contests.map(c => ({ id: c.id }))
}

// ── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const contest = await getContestById(id)
  if (!contest) return { title: 'Contest Not Found' }

  const dl = daysLeft(contest.deadline)
  const deadlineStr = fmt(contest.deadline)
  const desc = contest.status === 'open'
    ? `${contest.name} — Deadline ${deadlineStr}${dl > 0 ? ` (${dl} days left)` : ' (today)'}. Prize: ${contest.prize}. ${contest.description.slice(0, 120)}`
    : `${contest.name} by ${contest.organizer}. ${contest.description.slice(0, 140)}`

  return {
    title: `${contest.name} | AI Film Contests`,
    description: desc,
    openGraph: {
      title: `${contest.name} | AI Film Contests`,
      description: desc,
      url: `https://aifilmcontests.com/contests/${id}`,
      siteName: 'AI Film Contests',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${contest.name} | AI Film Contests`,
      description: desc,
    },
    alternates: {
      canonical: `https://aifilmcontests.com/contests/${id}`,
    },
  }
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function ContestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contest = await getContestById(id)
  if (!contest) notFound()

  const isOpen     = contest.status === 'open'
  const isClosed   = contest.status === 'closed'
  const isUpcoming = contest.status === 'upcoming'
  const dl         = daysLeft(contest.deadline)
  const isUrgent   = isOpen && dl <= 7

  // JSON-LD Event schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: contest.name,
    description: contest.description,
    organizer: { '@type': 'Organization', name: contest.organizer, url: contest.url },
    url: contest.url,
    eventStatus: isClosed
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    ...(contest.eventDate ? {
      startDate: contest.eventDate,
      endDate: contest.eventDate,
    } : {}),
    ...(contest.location ? {
      location: {
        '@type': 'Place',
        name: contest.location,
      },
    } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: '#080810', minHeight: '100vh' }}>

        {/* ── Nav ── */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
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
            </Link>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>
              ← All contests
            </Link>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-4xl mx-auto px-5 py-12">

          {/* Breadcrumb */}
          <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#52525b' }}>{contest.name}</span>
          </p>

          {/* ── Header ── */}
          <div style={{ marginBottom: 40 }}>

            {/* Status badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: isOpen ? '#22c55e' : isClosed ? '#52525b' : '#f59e0b',
              }}>
                {isOpen ? 'Open Now' : isClosed ? 'Closed' : 'Coming Soon'}
              </span>
              {contest.entryFee === 'Free' && !isClosed && (
                <span style={{
                  fontSize: 11,
                  color: '#52525b',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  padding: '1px 6px',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  Free entry
                </span>
              )}
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#f4f4f5',
              marginBottom: 10,
            }}>
              {contest.name}
            </h1>

            <p style={{ fontSize: 13, color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              {contest.organizer}
            </p>

            <p style={{ fontSize: 16, color: '#a1a1aa', lineHeight: 1.7, maxWidth: 640 }}>
              {contest.description}
            </p>
          </div>

          {/* ── Deadline & Apply ── */}
          {!isClosed && (
            <div style={{
              border: isUrgent ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '20px 24px',
              background: isUrgent ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
              marginBottom: 32,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  {isOpen ? 'Submission deadline' : 'Expected deadline'}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: isUrgent ? '#f97316' : '#f4f4f5' }}>
                  {fmt(contest.deadline)}
                </div>
                {isOpen && dl > 0 && (
                  <div style={{ fontSize: 13, color: isUrgent ? '#f97316' : '#71717a', marginTop: 3 }}>
                    {dl} day{dl !== 1 ? 's' : ''} remaining
                  </div>
                )}
                {isOpen && dl <= 0 && (
                  <div style={{ fontSize: 13, color: '#ef4444', marginTop: 3 }}>Closes today</div>
                )}
              </div>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                Apply Now →
              </a>
            </div>
          )}

          {/* ── Two-col info grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}>

            {/* Prize */}
            <InfoBlock label="Prize">
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#a5b4fc', marginBottom: 10 }}>
                {contest.prize}
              </div>
              {contest.prizeDetails && contest.prizeDetails.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {contest.prizeDetails.map((detail, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                      <span style={{ color: '#4f46e5', marginTop: 2, flexShrink: 0 }}>›</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </InfoBlock>

            {/* AI Tools */}
            <InfoBlock label="AI Tools Allowed">
              {contest.aiToolsAllowed && contest.aiToolsAllowed.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {contest.aiToolsAllowed.map((tool, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                      <span style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }}>✓</span>
                      {tool}
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: 13, color: '#52525b' }}>Any AI tools</span>
              )}
            </InfoBlock>

            {/* Eligibility */}
            <InfoBlock label="Eligibility">
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>
                {contest.eligibility || 'Open worldwide'}
              </p>
            </InfoBlock>

            {/* Entry Fee */}
            <InfoBlock label="Entry Fee">
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, color: contest.entryFee === 'Free' ? '#22c55e' : '#e4e4e7' }}>
                {contest.entryFee || 'See website'}
              </div>
            </InfoBlock>

            {/* Categories */}
            {contest.categories && contest.categories.length > 0 && (
              <InfoBlock label="Categories">
                <div className="flex flex-wrap gap-1.5">
                  {contest.categories.map(cat => (
                    <span key={cat} style={{
                      fontSize: 12,
                      color: '#a1a1aa',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 5,
                      padding: '3px 8px',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                      {categoryLabels[cat] ?? cat}
                    </span>
                  ))}
                </div>
              </InfoBlock>
            )}

            {/* Dates */}
            <InfoBlock label="Key Dates">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contest.submissionOpen && (
                  <DateRow label="Submissions open" value={fmt(contest.submissionOpen)} />
                )}
                <DateRow label="Deadline" value={fmt(contest.deadline)} />
                {contest.eventDate && (
                  <DateRow label="Festival / Event" value={fmt(contest.eventDate)} />
                )}
                {contest.location && (
                  <DateRow label="Location" value={contest.location} />
                )}
              </div>
            </InfoBlock>

          </div>

          {/* ── Apply CTA (bottom) ── */}
          {!isClosed && (
            <div style={{ paddingTop: 8, paddingBottom: 40 }}>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ padding: '12px 28px', fontSize: 15 }}
              >
                Apply on official site →
              </a>
              <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 10 }}>
                Opens {contest.url.replace(/^https?:\/\//, '')}
              </p>
            </div>
          )}

          {/* Tags */}
          {contest.tags && contest.tags.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, marginBottom: 40 }}>
              <div className="flex flex-wrap gap-1.5">
                {contest.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, color: '#3f3f46', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: '2px 7px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <Link href="/" className="link-muted" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            ← Back to all AI film contests
          </Link>

        </main>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
          <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#52525b' }}>
              AI Film Contests
            </span>
            <span style={{ fontSize: 12, color: '#3f3f46' }}>
              Tracking every AI film competition · Updated daily
            </span>
            <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
              <a href="mailto:hello@aifilmcontests.com" className="link-muted">Submit a Contest</a>
              <span style={{ color: '#27272a' }}>·</span>
              <Link href="/" className="link-muted">Browse All</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────
function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '18px 20px',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{ fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#a1a1aa' }}>{value}</span>
    </div>
  )
}
