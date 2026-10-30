import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import ContestCard from '@/components/ContestCard'
import { getAllContests } from '@/lib/contests-db'
import { COMMUNITY, GUIDE, OVERS, OVERS_OFF_PERCENT, oversHref } from '@/lib/creator-pack'

export const revalidate = 900

// A destination people land on right after signing up, not a page for
// Google — kept out of sitemap.ts and the footer on purpose.
export const metadata: Metadata = {
  title: "You're subscribed | AI Film Contests",
  robots: { index: false, follow: false },
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: '#8B867C',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 16,
}

export default async function SubscribedPage() {
  const all = await getAllContests()
  const open = all
    .filter(c => c.status === 'open')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  const next5 = open.slice(0, 5)

  return (
    <InnerLayout>
      <div className="max-w-5xl mx-auto px-5 py-12">

        <div className="sok" style={{ maxWidth: 600, marginBottom: 48 }}>
          <p className="sok-head">You&apos;re in. Check your inbox now.</p>
          <p className="sok-sub">We just sent you a welcome email.</p>

          <div className="sok-step">
            <p className="sok-step-label">One quick step to guarantee delivery</p>
            <p className="sok-step-do">
              <strong>Reply to that email</strong> — even just &ldquo;got it&rdquo; works.
            </p>
            <p className="sok-step-why">
              This tells your inbox we&apos;re legit and ensures every future contest alert lands in
              your <strong>Primary</strong> inbox, not Promotions.
              The more you reply to our emails, the better your delivery gets.
            </p>
          </div>

          {/* Same four lines the welcome email itself promises — one promise,
              one wording, wherever it's made. */}
          <div className="sok-step" style={{ marginTop: 14 }}>
            <p className="sok-step-label">What you&apos;ll receive</p>
            <p className="sok-step-why" style={{ margin: 0 }}>
              New contests, within a day or two of opening. A last call before a deadline closes.
              What&apos;s closing this week, once a week. Everything bundled: a few emails a month,
              never daily spam.
            </p>
          </div>
        </div>

        {/* The creator pack, delivered here as well as in the welcome email:
            signing up is how it's claimed, so it shouldn't wait on the inbox. */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionLabel}>Your free creator pack</h2>
          <div className="pack-grid" style={{ marginBottom: 0 }}>
            <div className="pack-item pack-item-lead">
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#1B1916', margin: '0 0 6px' }}>
                Overs Pro, {OVERS_OFF_PERCENT}% off
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A463E', margin: '0 0 12px' }}>
                ${OVERS.monthlyUsd} a month for your first {OVERS.months} months instead of ${OVERS.fullUsd}. Stills from a few words, clips from any still.
              </p>
              <a href={oversHref('subscribed')} target="_blank" rel="noopener" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }}>Claim it on Overs →</a>
            </div>
            <div className="pack-item">
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#1B1916', margin: '0 0 6px' }}>{GUIDE.title}</p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A463E', margin: '0 0 12px' }}>Every step from the rules to the export.</p>
              <Link href={GUIDE.path} style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }}>Read the guide →</Link>
            </div>
            <div className="pack-item">
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#1B1916', margin: '0 0 6px' }}>{COMMUNITY.name}</p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A463E', margin: '0 0 12px' }}>Abhi&apos;s free community on Skool for AI creative workflows.</p>
              <a href={COMMUNITY.url} target="_blank" rel="noopener" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }}>Join free →</a>
            </div>
          </div>
        </section>

        {next5.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={sectionLabel}>While you wait — {open.length} open right now</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {next5.map(c => (
                <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <ContestCard contest={c} />
                  <p style={{ fontSize: 11, color: '#8B867C', textAlign: 'center' }}>
                    Entry fee: {c.entryFee || 'Free'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>

      </div>
    </InnerLayout>
  )
}
