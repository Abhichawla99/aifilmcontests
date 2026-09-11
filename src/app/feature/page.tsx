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
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: '#6F6A61', margin: '8px 0 12px', letterSpacing: '0.02em' }}>
              Pick your contest
            </h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {open.slice(0, 80).map(c => (
                <Link key={c.id} href={`/feature?contest=${encodeURIComponent(c.id)}`} style={{ ...box, padding: '14px 18px', textDecoration: 'none', color: '#26231E', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14 }}>{c.name} <span style={{ color: '#8B867C', fontSize: 12 }}>· {c.organizer}</span></span>
                  <span style={{ color: '#4f46e5', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Feature →</span>
                </Link>
              ))}
            </div>
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
