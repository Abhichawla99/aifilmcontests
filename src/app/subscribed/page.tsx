import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import ContestCard from '@/components/ContestCard'
import { getAllContests } from '@/lib/contests-db'
import { COMMUNITY, OVERS } from '@/lib/creator-pack'

export const revalidate = 900

// A destination people land on right after signing up, not a page for
// Google — kept out of sitemap.ts and the footer on purpose.
export const metadata: Metadata = {
  title: "Check your inbox | AI Film Contests",
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
          <p className="sok-head">Check your inbox.</p>
          <p className="sok-sub">
            Click the link we just sent and your creator pack comes straight back: Overs Pro
            at ${OVERS.monthlyUsd} a month, the contest film guide and {COMMUNITY.name}.
          </p>

          <div className="sok-step">
            <p className="sok-step-label">Can&apos;t find it?</p>
            <p className="sok-step-why" style={{ margin: 0 }}>
              Look in Promotions and spam for &ldquo;Confirm your email to get your creator pack&rdquo; from
              AI Film Contests. No email after a few minutes? Sign up again and we&apos;ll send a new link.
            </p>
          </div>

          {/* Same lines the emails promise — one promise, one wording, wherever it's made. */}
          <div className="sok-step" style={{ marginTop: 14 }}>
            <p className="sok-step-label">After you confirm</p>
            <p className="sok-step-why" style={{ margin: 0 }}>
              New contests, within a day or two of opening. A last call before a deadline closes.
              What&apos;s closing this week, once a week. A few emails a month, never daily.
            </p>
          </div>
        </div>

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
