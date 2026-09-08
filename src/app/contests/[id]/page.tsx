import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getContestById, getAllContests } from '@/lib/contests-db'
import { normalizeCategory, closedStyle } from '@/lib/theme'
import ContestCard from '@/components/ContestCard'
import EmailSubscribe from '@/components/EmailSubscribe'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function daysLeft(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
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

  // Category identity: the same tint and emoji the card used, so the page and the
  // card that led here are visibly the same object. Freeform strings are normalized
  // and deduplicated (the research robot has written 140+ distinct values).
  const allCats = Array.from(
    new Map((contest.categories ?? []).map(c => { const n = normalizeCategory(c); return [n.label, n] as const })).values()
  )
  // "any genre", "open", "hybrid" and friends fall back to a generic style. Show it
  // only when nothing real matched, so a chip never reads just "Contest" beside a
  // real one.
  const realCats = allCats.filter(c => c.label !== 'Contest')
  const cats = realCats.length ? realCats : allCats
  const tint = isClosed ? closedStyle : (cats[0] ?? normalizeCategory('film'))

  // Related: still open, shares this contest's first category, closing soonest first.
  const all = await getAllContests()
  const related = all
    .filter(c =>
      c.id !== contest.id &&
      c.status === 'open' &&
      (cats.length === 0 || (c.categories ?? []).some(x => normalizeCategory(x).label === cats[0].label)))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  // JSON-LD Event schema
  const jsonLdEvent = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: contest.name,
    description: contest.description,
    organizer: { '@type': 'Organization', name: contest.organizer, url: contest.url },
    url: contest.url,
    eventStatus: isClosed
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: contest.location
      ? 'https://schema.org/MixedEventAttendanceMode'
      : 'https://schema.org/OnlineEventAttendanceMode',
    ...(contest.eventDate ? {
      startDate: contest.eventDate,
      endDate: contest.eventDate,
    } : {}),
    ...(contest.location ? {
      location: {
        '@type': 'Place',
        name: contest.location,
      },
    } : {
      location: {
        '@type': 'VirtualLocation',
        url: contest.url,
      },
    }),
    offers: {
      '@type': 'Offer',
      price: contest.entryFee === 'Free' ? '0' : contest.entryFee,
      priceCurrency: 'USD',
      availability: isClosed ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      validThrough: contest.deadline,
      url: contest.url,
    },
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AI Film Contests', item: 'https://aifilmcontests.com' },
      { '@type': 'ListItem', position: 2, name: contest.name, item: `https://aifilmcontests.com/contests/${contest.id}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdEvent, jsonLdBreadcrumb]) }}
      />

      <div style={{ background: '#FBFAF8', minHeight: '100vh' }}>

        {/* ── Nav ── */}
        <header style={{ borderBottom: '1px solid rgba(27,25,22,0.06)' }}>
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 7,
                background: '#4f46e5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#fff',
              }}>
                AI
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#26231E' }}>
                AI Film Contests
              </span>
            </Link>
            <Link href="/" className="link-muted" style={{ fontSize: 13 }}>
              ← All contests
            </Link>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-5xl mx-auto px-5 py-12">

          {/* Breadcrumb */}
          <p style={{ fontSize: 12, color: '#A8A296', marginBottom: 24 }}>
            <Link href="/" className="link-muted">AI Film Contests</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#8B867C' }}>{contest.name}</span>
          </p>

          {/* ── Header band: the category's colour and emoji, so this page is
               visibly the same thing as the card that was clicked ── */}
          <div style={{
            background: tint.bg,
            border: `1px solid ${tint.border}`,
            borderRadius: 16,
            padding: 'clamp(22px, 3vw, 32px)',
            marginBottom: 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
              <span aria-hidden style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{tint.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`dot ${isOpen ? 'dot-open' : isClosed ? 'dot-closed' : 'dot-upcoming'} ${isOpen && !isUrgent ? 'live' : ''}`} />
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
                    color: isOpen ? '#15803D' : isClosed ? '#8B867C' : '#B45309',
                  }}>
                    {isOpen ? 'Open now' : isClosed ? 'Closed' : 'Coming soon'}
                  </span>
                  {contest.entryFee === 'Free' && !isClosed && (
                    <span style={{
                      fontSize: 11, color: '#15803D', border: '1px solid rgba(22,163,74,0.35)',
                      borderRadius: 4, padding: '1px 6px', background: 'rgba(255,255,255,0.6)',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>Free entry</span>
                  )}
                </div>
                <h1 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700,
                  lineHeight: 1.1, letterSpacing: '-0.025em', color: '#1B1916', marginBottom: 8,
                }}>
                  {contest.name}
                </h1>
                <p style={{
                  fontSize: 12, color: tint.text, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  {contest.organizer}
                </p>
              </div>
            </div>
          </div>

          {/* ── Body: prose left, spec rail right ── */}
          <div className="contest-grid" style={{
            display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px',
            gap: 'clamp(28px, 4vw, 48px)', alignItems: 'start', marginBottom: 56,
          }}>

            {/* ── Left: what this contest actually is ── */}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 17, color: '#3E3A33', lineHeight: 1.72, marginBottom: 34 }}>
                {contest.description}
              </p>

              <Section label="Prize">
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(20px, 2.4vw, 26px)',
                  fontWeight: 700, color: tint.text, lineHeight: 1.25,
                  letterSpacing: '-0.02em', marginBottom: contest.prizeDetails?.length ? 16 : 0,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {contest.prize}
                </div>
                {contest.prizeDetails && contest.prizeDetails.length > 0 && (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                    {contest.prizeDetails.map((detail, i) => (
                      <li key={i} style={{
                        fontSize: 14, color: '#3E3A33', lineHeight: 1.5,
                        padding: '9px 0',
                        borderTop: i === 0 ? 'none' : '1px solid #ECE9E2',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section label="Who can enter">
                <p style={{ fontSize: 15, color: '#3E3A33', lineHeight: 1.7 }}>
                  {contest.eligibility || 'Open worldwide.'}
                </p>
              </Section>

              <Section label="AI tools allowed">
                {contest.aiToolsAllowed && contest.aiToolsAllowed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {contest.aiToolsAllowed.map((tool, i) => (
                      <span key={i} style={{
                        fontSize: 13, color: '#3E3A33', background: '#fff',
                        border: '1px solid #E0DCD2', borderRadius: 6, padding: '4px 10px',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 15, color: '#3E3A33' }}>Any AI tools.</p>
                )}
              </Section>

              {contest.tags && contest.tags.length > 0 && (
                <div style={{ borderTop: '1px solid #ECE9E2', paddingTop: 18, marginTop: 30 }}>
                  <div className="flex flex-wrap gap-1.5">
                    {contest.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, color: '#8B867C', background: '#F4F2EE', border: '1px solid #E7E4DC', borderRadius: 4, padding: '2px 7px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: the spec card. Everything you decide with, in one place,
                 and it follows you down the page. ── */}
            <aside className="contest-rail">
              <div style={{
                background: '#fff', border: `1px solid ${isUrgent ? '#F2CFCB' : '#E7E4DC'}`,
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{ padding: '20px 20px 18px' }}>
                  <div style={{
                    fontSize: 10, color: '#8B867C', textTransform: 'uppercase',
                    letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600, marginBottom: 8,
                  }}>
                    {isClosed ? 'Closed on' : isOpen ? 'Submission deadline' : 'Expected deadline'}
                  </div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 26, fontWeight: 700, lineHeight: 1.1,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                    color: isClosed ? '#8B867C' : isUrgent ? '#C2410C' : '#1B1916',
                  }}>
                    {isOpen && dl > 0 ? `${dl} day${dl !== 1 ? 's' : ''} left` : isOpen && dl <= 0 ? 'Closes today' : fmt(contest.deadline)}
                  </div>
                  {isOpen && (
                    <div style={{ fontSize: 13, color: '#7A7469', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(contest.deadline)}
                    </div>
                  )}
                  {!isClosed && (
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-full justify-center"
                      style={{ marginTop: 16, padding: '11px 18px', fontSize: 14 }}
                    >
                      Apply on official site →
                    </a>
                  )}
                </div>

                <SpecRow label="Entry fee" value={contest.entryFee || 'See official site'} highlight={contest.entryFee === 'Free'} />
                {contest.submissionOpen && <SpecRow label="Submissions open" value={fmt(contest.submissionOpen)} />}
                {contest.eventDate && <SpecRow label="Festival date" value={fmt(contest.eventDate)} />}
                {contest.location && <SpecRow label="Location" value={contest.location} />}

                {cats.length > 0 && (
                  <div style={{ borderTop: '1px solid #ECE9E2', padding: '14px 20px' }}>
                    <div style={{
                      fontSize: 10, color: '#8B867C', textTransform: 'uppercase',
                      letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600, marginBottom: 9,
                    }}>Categories</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cats.map(c => (
                        <span key={c.label} style={{
                          fontSize: 11, color: c.text, background: c.bg,
                          border: `1px solid ${c.border}`, borderRadius: 5, padding: '2px 7px',
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                          {c.emoji}&nbsp;{c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ borderTop: '1px solid #ECE9E2', padding: '12px 20px', background: '#FBFAF8' }}>
                  <p style={{ fontSize: 11.5, color: '#8B867C', lineHeight: 1.55, margin: 0 }}>
                    Checked against the organizer&apos;s official page every morning.
                    {' '}<a href={contest.url} target="_blank" rel="noopener noreferrer" className="link-muted" style={{ textDecoration: 'underline' }}>
                      {contest.url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 28)}
                    </a>
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* ── Don't lose the deadline ── */}
          {!isClosed && (
            <div style={{
              background: '#F3F0F9', border: '1px solid #E1DAF0', borderRadius: 14,
              padding: 'clamp(20px, 3vw, 28px)', marginBottom: 48,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24, alignItems: 'center',
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700,
                  color: '#1B1916', letterSpacing: '-0.02em', marginBottom: 6,
                }}>
                  Don&apos;t miss this deadline
                </h2>
                <p style={{ fontSize: 14, color: '#4C3F72', lineHeight: 1.6, margin: 0 }}>
                  We&apos;ll email you three days before {contest.name} closes, and when contests like it open.
                </p>
              </div>
              <EmailSubscribe compact />
            </div>
          )}

          {/* ── Related ── */}
          {related.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700,
                color: '#1B1916', letterSpacing: '-0.02em', marginBottom: 4,
              }}>
                Also open in {cats[0]?.label.toLowerCase() ?? 'AI film'}
              </h2>
              <p style={{ fontSize: 13, color: '#7A7469', marginBottom: 18 }}>
                Same category, sorted by which closes first.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {related.map(c => <ContestCard key={c.id} contest={c} />)}
              </div>
            </div>
          )}

          {/* Back link */}
          <Link href="/" className="link-muted" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            ← Back to all AI film contests
          </Link>

        </main>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid rgba(27,25,22,0.05)', padding: '24px 0' }}>
          <div className="max-w-4xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#8B867C' }}>
              AI Film Contests
            </span>
            <span style={{ fontSize: 12, color: '#A8A296' }}>
              Tracking every AI film competition · Updated daily
            </span>
            <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
              <a href="/submit" className="link-muted">Submit a Contest</a>
              <span style={{ color: '#E7E4DC' }}>·</span>
              <Link href={`/feature?contest=${contest.id}`} className="link-muted">Organizer? Feature this contest</Link>
              <span style={{ color: '#E7E4DC' }}>·</span>
              <Link href="/" className="link-muted">Browse All</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: '1px solid #ECE9E2', paddingTop: 18, marginTop: 30 }}>
      <h2 style={{
        fontSize: 10, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.11em',
        marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
      }}>
        {label}
      </h2>
      {children}
    </section>
  )
}

function SpecRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      borderTop: '1px solid #ECE9E2', padding: '11px 20px',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14,
    }}>
      <span style={{
        fontSize: 10, color: '#8B867C', textTransform: 'uppercase', letterSpacing: '0.1em',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13.5, color: highlight ? '#15803D' : '#26231E', textAlign: 'right',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: highlight ? 700 : 500,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.4,
      }}>
        {value}
      </span>
    </div>
  )
}
