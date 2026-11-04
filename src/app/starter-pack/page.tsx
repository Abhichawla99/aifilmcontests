import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import EmailSubscribe from '@/components/EmailSubscribe'
import { COMMUNITY, GUIDE, OFFER_ENDS_LABEL, OVERS, OVERS_COSTS, OVERS_OFF_PERCENT, OVERS_REPLACES, PACK_ART, offerOpen } from '@/lib/creator-pack'

// Rebuilt hourly so the deadline line comes down once the offer closes.
export const revalidate = 3600

/* The free creator pack. Claiming it is subscribing and clicking the confirm
   link: the pack email delivers all three pieces, and /confirm shows them too.
   The three pieces are Abhi's (Overs, the guide, Creatives Club) and the page
   says so, in the small print and in the email. */

export const metadata: Metadata = {
  title: 'Free Creator Pack for AI Filmmakers | AI Film Contests',
  description: `Free for AI filmmakers: Overs Pro, one tool for every AI image and video model, at $${OVERS.monthlyUsd} a month (${OVERS_OFF_PERCENT}% off) for ${OVERS.months} months, plus a step-by-step guide to making an AI film for a contest, and the Creatives Club community.`,
  alternates: { canonical: 'https://aifilmcontests.com/starter-pack' },
  openGraph: {
    title: 'Free Creator Pack for AI Filmmakers',
    description: `Overs, one tool in place of your AI subscriptions, for $${OVERS.monthlyUsd} a month (${OVERS_OFF_PERCENT}% off). Plus a contest film guide and a free community. Claim it with your email.`,
    url: 'https://aifilmcontests.com/starter-pack',
    siteName: 'AI Film Contests',
  },
}

const label: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F46E5', marginBottom: 10,
}
const title: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700,
  letterSpacing: '-0.02em', color: '#1B1916', margin: '0 0 8px',
}
const body: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: '#4A463E', margin: '0 0 14px' }
const more: React.CSSProperties = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }

export default function StarterPackPage() {
  const open = offerOpen(new Date())
  return (
    <InnerLayout>
      <div className="max-w-5xl mx-auto px-5" style={{ padding: 'clamp(40px, 6vw, 72px) 20px clamp(48px, 7vw, 88px)' }}>

        <div style={{ maxWidth: 680, marginBottom: 'clamp(32px, 5vw, 52px)' }}>
          <div style={label}>Free for AI filmmakers</div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 5.5vw, 60px)', fontWeight: 700,
            lineHeight: 1.02, letterSpacing: '-0.04em', color: '#1B1916', margin: '0 0 18px',
          }}>
            The creator pack.<br /><span className="g">Claim it free.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', lineHeight: 1.7, color: '#6F6A61', margin: 0 }}>
            Everything you need to go from a contest you like to a finished entry: one tool in place of
            your AI subscriptions, a guide that walks through every step, and a community to ask when you get stuck.
          </p>
          {open && (
            <div className="pack-deadline">
              <span className="pack-deadline-pill">${OVERS.monthlyUsd} ({OVERS_OFF_PERCENT}% off) until {OFFER_ENDS_LABEL}</span>
              <span>or until the {OVERS.places} founding places fill</span>
            </div>
          )}
        </div>

        <div className="pack-grid">
          <section className="pack-item pack-item-lead pack-tint-purple">
            <div className="pack-art">
              <Image src={PACK_ART.overs.src} width={PACK_ART.overs.width} height={PACK_ART.overs.height} alt={PACK_ART.overs.alt} />
            </div>
            <div style={label}>One tool, every model</div>
            <h2 style={title}>Overs Pro for ${OVERS.monthlyUsd} a month ({OVERS_OFF_PERCENT}% off)</h2>
            <p style={body}>
              ${OVERS.monthlyUsd} a month for your first {OVERS.months} months instead of ${OVERS.fullUsd}. {OVERS_REPLACES} Type a shot
              and it makes the stills. Pick one and it becomes a clip that opens exactly on that frame. Put several
              pictures on the bar and the clip works from all of them.
            </p>
            <p style={{ ...body, fontSize: 13.5, color: '#6F6A61' }}>
              {OVERS_COSTS}{' '}
              Cancel any time from your account page. The ${OVERS.monthlyUsd} price ends {OFFER_ENDS_LABEL}.
            </p>
            <a href="#claim" style={more}>Claim it with your email →</a>
          </section>

          <section className="pack-item pack-tint-yellow">
            <div className="pack-art">
              <Image src={PACK_ART.guide.src} width={PACK_ART.guide.width} height={PACK_ART.guide.height} alt={PACK_ART.guide.alt} />
            </div>
            <div style={label}>Guide</div>
            <h2 style={title}>{GUIDE.title}</h2>
            <p style={body}>
              From reading the rules to exporting the file: a shot list, a look that holds across shots, stills first,
              clips from stills, sound, and the checks that get entries thrown out.
            </p>
            <Link href={GUIDE.path} style={more}>Read the guide →</Link>
          </section>

          <section className="pack-item pack-tint-pink">
            <div className="pack-art">
              <Image src={PACK_ART.club.src} width={PACK_ART.club.width} height={PACK_ART.club.height} alt={PACK_ART.club.alt} />
            </div>
            <div style={label}>Community</div>
            <h2 style={title}>{COMMUNITY.name}</h2>
            <p style={body}>
              Abhi&apos;s free community on Skool for people learning AI creative workflows. Ask questions, see how
              others build their shots, and share what you make.
            </p>
            <a href={COMMUNITY.url} target="_blank" rel="noopener" style={more}>Join free →</a>
          </section>
        </div>

        <div id="claim" className="pack-claim">
          <div style={{ maxWidth: 440 }}>
            <h2 style={{ ...title, fontSize: 26 }}>Claim the pack</h2>
            <p style={{ ...body, marginBottom: 6 }}>
              Enter your email, click the link we send, and all three land in your inbox.
            </p>
            <p style={{ ...body, fontSize: 13.5, color: '#6F6A61' }}>
              You also get contest alerts: new contests a day or two after they open, a last call before
              deadlines, and what&apos;s closing each week. A few emails a month, never daily.
            </p>
          </div>
          <div style={{ maxWidth: 420, width: '100%' }}>
            <EmailSubscribe />
          </div>
        </div>

        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#8B867C', maxWidth: 640, marginTop: 28 }}>
          Overs and Creatives Club are run by Abhi, who also runs AI Film Contests. The Overs price is for the first
          {OVERS.places} people who claim it by {OFFER_ENDS_LABEL}, then ${OVERS.fullUsd} a month after the first {OVERS.months} months unless you cancel.
          Check each contest&apos;s rules before you start: most accept any AI tool, and a few require their own.
        </p>
      </div>
    </InnerLayout>
  )
}
