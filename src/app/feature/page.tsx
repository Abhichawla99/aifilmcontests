import type { Metadata } from 'next'
import Link from 'next/link'
import { getContestsByStatus } from '@/lib/contests-db'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PRICE_LABEL = process.env.FEATURED_PRICE_LABEL || '$49 for 30 days'
const PAY_LINK = process.env.STRIPE_PAYMENT_LINK || ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

export const metadata: Metadata = {
  title: 'Feature your AI film contest — AI Film Contests',
  description: 'Put your AI film competition in front of the filmmakers who enter them. Pinned placement, a Featured badge, and a slot in the next subscriber email.',
  alternates: { canonical: `${SITE_URL}/feature` },
}

function payUrl(contestId: string) {
  if (!PAY_LINK) return null
  const sep = PAY_LINK.includes('?') ? '&' : '?'
  return `${PAY_LINK}${sep}client_reference_id=${encodeURIComponent(contestId)}`
}

/* The picker speaks the same deadline language as every card on the site:
   the figure is what remains, the date beneath it is the proof. */
function timeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { label: 'closing', days: 0 }
  const days = Math.floor(diff / 86_400_000)
  if (days >= 1) return { label: `${days} ${days === 1 ? 'day' : 'days'} left`, days }
  const hours = Math.floor(diff / 3_600_000)
  return { label: `${hours} ${hours === 1 ? 'hour' : 'hours'} left`, days: 0 }
}

const shortDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/* Contests arrive sorted by deadline. Month rules are the only wayfinding in a
   list this long, and they are what make the sort order visible at all. */
function byMonth<T extends { deadline: string }>(list: T[]) {
  const out: [string, T[]][] = []
  for (const c of list) {
    const label = new Date(c.deadline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const last = out[out.length - 1]
    if (last && last[0] === label) last[1].push(c)
    else out.push([label, [c]])
  }
  return out
}

export default async function FeaturePage({ searchParams }: { searchParams: Promise<{ contest?: string }> }) {
  const { contest: contestId } = await searchParams
  const open = await getContestsByStatus('open')
  const picked = contestId ? open.find(c => c.id === contestId) ?? null : null
  const { count } = await supabaseAdmin.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true)
  const subscribers = count ?? 0
  const roundedSubs = subscribers >= 1000 ? `${Math.floor(subscribers / 100) * 100}+` : subscribers >= 100 ? `${Math.floor(subscribers / 10) * 10}+` : String(subscribers)

  const box: React.CSSProperties = {
    border: '1px solid rgba(27,25,22,0.07)', borderRadius: 14, padding: '22px 24px', background: 'rgba(27,25,22,0.02)',
  }
  const btn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', borderRadius: 10,
    background: '#4F46E5', color: '#fff', fontWeight: 600, fontSize: 14,
    textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', boxShadow: 'none',
  }
  const mailto = (name?: string) =>
    `mailto:abhixchawla@gmail.com?subject=${encodeURIComponent(`Feature ${name ?? 'my contest'} on AI Film Contests`)}`

  return (
    <main style={{ minHeight: '100vh', background: '#FBFAF8', color: '#26231E', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link href="/" style={{ fontSize: 12, color: '#4f46e5', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          AI Film Contests
        </Link>

        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '20px 0 12px', color: '#1B1916' }}>
          Get more entries for {picked ? picked.name : 'your AI film contest'}.
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: '#6F6A61', margin: '0 0 32px' }}>
          {roundedSubs} AI filmmakers get our alerts, and thousands more find contests through this site every month.
          Featuring puts your contest where they all look first.
        </p>

        <div style={{ ...box, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A7469', marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
            What featuring includes
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10, fontSize: 15, lineHeight: 1.5 }}>
            <li>❋&nbsp;&nbsp;Pinned in the homepage spotlight for 30 days</li>
            <li>❋&nbsp;&nbsp;A <strong style={{ color: '#4338CA' }}>Featured</strong> badge on your listing and in search</li>
            <li>❋&nbsp;&nbsp;A dedicated slot in the next email to all {roundedSubs} subscribers</li>
            <li>❋&nbsp;&nbsp;Deadline verified daily and a last-call reminder sent 3 days before close</li>
          </ul>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A7469', marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
            How it works
          </div>
          <ol style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
            {[
              ['Pick your contest and pay', `${PRICE_LABEL}, one payment, no subscription.`],
              ['We pin it', 'Automatically, usually within minutes of payment — allow up to a day if anything needs a manual check.'],
              ['It runs for 30 days', 'Spotlighted on the homepage, a Featured badge on the listing, and a slot in the next subscriber email.'],
            ].map(([title, body], i) => (
              <li key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)', color: '#4338CA', fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1B1916' }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: '#7A7469', lineHeight: 1.55 }}>{body}</div>
                </div>
              </li>
            ))}
          </ol>
          <img
            src="/feature-spotlight-example.png"
            alt="The homepage spotlight card as it appears live on aifilmcontests.com"
            width={420}
            height={506}
            style={{ width: '100%', maxWidth: 320, height: 'auto', borderRadius: 16, border: '1px solid rgba(27,25,22,0.07)', boxShadow: '0 1px 2px rgba(27,25,22,0.04), 0 18px 40px -22px rgba(27,25,22,0.16)', display: 'block' }}
          />
          <div style={{ fontSize: 12, color: '#8B867C', marginTop: 8 }}>
            The homepage spotlight, live right now — this is exactly what a featured contest gets.
          </div>
        </div>

        <div style={{ ...box, marginBottom: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#1B1916', letterSpacing: '-0.02em' }}>{PRICE_LABEL}</div>
            <div style={{ fontSize: 13, color: '#7A7469' }}>One payment. No subscription. Listing stays free forever.</div>
          </div>
          {picked ? (
            payUrl(picked.id)
              ? <a href={payUrl(picked.id)!} style={btn}>Feature {picked.name.length > 28 ? 'this contest' : picked.name} →</a>
              : <a href={mailto(picked.name)} style={btn}>Email us to feature it →</a>
          ) : (
            <a href="/submit" style={{ ...btn, background: 'rgba(27,25,22,0.06)', boxShadow: 'none', color: '#3E3A33' }}>Not listed yet? Submit it (free) →</a>
          )}
        </div>

        {!picked && (
          <>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 19, fontWeight: 700, color: '#1B1916', margin: '4px 0 6px', letterSpacing: '-0.015em' }}>
              Pick your contest
            </h2>
            {open.length > 0 && (
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#7A7469', margin: '0 0 22px' }}>
                All {open.length} contest{open.length === 1 ? '' : 's'} open right now, closing soonest first.
              </p>
            )}

            {open.length === 0 ? (
              <div className="feat-empty">
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, color: '#1B1916', marginBottom: 6 }}>
                  No contest is open right now
                </p>
                <p style={{ fontSize: 14, color: '#7A7469', marginBottom: 16, lineHeight: 1.6 }}>
                  New ones go up most mornings. Send yours over and it gets listed free, then you can feature it from here.
                </p>
                <Link href="/submit" className="btn">Submit a contest</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {byMonth(open).map(([label, list]) => {
                  const id = 'feat-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  return (
                    <section key={label} aria-labelledby={id}>
                      <h3 id={id} className="cbg">
                        <span className="cbg-label">{label}</span>
                        <span className="cbg-count" aria-hidden="true">{list.length}</span>
                        <span className="sr-only">, {list.length} contest{list.length === 1 ? '' : 's'}</span>
                        <span className="cbg-rule" aria-hidden="true" />
                      </h3>
                      <div className="feat-list">
                        {list.map(c => {
                          const t = timeLeft(c.deadline)
                          return (
                            <Link
                              key={c.id}
                              href={`/feature?contest=${encodeURIComponent(c.id)}`}
                              className={`feat-row${t.days <= 7 ? ' feat-urgent' : ''}`}
                            >
                              <span className="feat-name">{c.name}</span>
                              <span className="feat-org">{c.organizer}</span>
                              <span className="feat-when">
                                <span className="feat-left">{t.label}</span>
                                <span className="feat-date">{shortDate(c.deadline)}</span>
                              </span>
                              <span className="feat-go" aria-hidden="true">→</span>
                              <span className="sr-only">Feature this contest</span>
                            </Link>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </>
        )}

        <p style={{ fontSize: 13, color: '#8B867C', lineHeight: 1.7, marginTop: 36 }}>
          Every contest on this site is listed for free and verified daily. Featuring is optional and never affects whether a contest is listed.
          Questions or corrections: <a href="mailto:abhixchawla@gmail.com" style={{ color: '#7A7469' }}>abhixchawla@gmail.com</a>.
        </p>
      </div>
    </main>
  )
}
