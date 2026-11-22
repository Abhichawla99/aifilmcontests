import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import {
  AnswerList, CardRow, COLLAB_ART, DialsheetButton, DialsheetLink, PartnerLockup, PartnerSmallPrint, dialsheetMetadata,
} from '@/components/DialsheetPartner'
import {
  ABHI, CLIENT_GUIDES, DIALSHEET, DIALSHEET_FACTS_READ_ISO, DIALSHEET_PAGES,
  DIALSHEET_PATH, DIALSHEET_PERK, LINE_PRICE_LINE,
} from '@/lib/dialsheet'

/* AI Film Contests × DialSheet: the team-up's front page. Two readers land
   here. A filmmaker wants the three client-getting guides; someone who runs a
   sales team wants the short version of what DialSheet is and costs. Both get
   a row of cards. Numbers come from src/lib/dialsheet.ts. */

const TITLE = 'AI Film Contests × DialSheet: You Made the Film. Now Make the Call.'
const DESCRIPTION = `AI Film Contests has teamed up with DialSheet, a power dialer that is free for one person. Three guides on calling brands for paid AI video work, plus what DialSheet does and costs for sales teams.`

export const metadata: Metadata = dialsheetMetadata('', TITLE, DESCRIPTION)

const CREDITS: Array<[string, React.ReactNode]> = [
  ['Guides written by', <><a href={ABHI.url} target="_blank" rel="noopener" style={{ color: '#4338CA', textDecoration: 'underline', textUnderlineOffset: 3 }}>{ABHI.name}</a>, who made over 100K cold calls in a year</>],
  ['Phone calls by', 'DialSheet'],
  ['Contests by', 'AI Film Contests, checked every day'],
  ['Starring', 'Your spec piece'],
  ['Running time', 'Two calling sessions a week'],
]

export default function DialsheetHubPage() {
  const url = `https://aifilmcontests.com${DIALSHEET_PATH}`
  const pageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    description: DESCRIPTION,
    url,
    dateModified: DIALSHEET_FACTS_READ_ISO,
    publisher: { '@type': 'Organization', name: 'AI Film Contests', url: 'https://aifilmcontests.com' },
    about: { '@type': 'SoftwareApplication', name: DIALSHEET.name, url: DIALSHEET.url, applicationCategory: 'BusinessApplication', operatingSystem: 'Web' },
  }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <div className="max-w-5xl mx-auto px-5" style={{ padding: 'clamp(40px, 6vw, 72px) 20px clamp(48px, 7vw, 88px)' }}>

        <div className="ds-hero">
          <div>
            <PartnerLockup />
            <h1 className="ds-hero-h1">
              You made the film.<br /><span className="g">Now make the call.</span>
            </h1>
            <p className="ds-standfirst">
              AI Film Contests has teamed up with DialSheet, a power dialer that is free for one person.
              A contest gets your film seen and a phone call gets it paid for, so we wrote three guides
              on calling brands and put DialSheet&apos;s price list where you can read it.
            </p>
            <div className="ds-actions">
              <DialsheetButton placement="hub-top">Try DialSheet free →</DialsheetButton>
              <Link href={CLIENT_GUIDES[0].path} className="ds-more">Start with the first guide →</Link>
            </div>
          </div>
          <div className="ds-art">
            <Image
              src={COLLAB_ART.fistBump.src} width={COLLAB_ART.fistBump.width} height={COLLAB_ART.fistBump.height}
              alt={COLLAB_ART.fistBump.alt} priority sizes="(max-width: 860px) 100vw, 480px"
            />
          </div>
        </div>

        <section className="ds-section">
          <h2 className="ds-section-label">The credits</h2>
          <dl className="ds-credits">
            {CREDITS.map(([role, who]) => (
              <div className="ds-credit" key={role}>
                <dt>{role}</dt>
                <dd>{who}</dd>
              </div>
            ))}
          </dl>
        </section>

        {DIALSHEET_PERK && (
          <section className="ds-section">
            <div className="ds-perk">
              <div className="ds-label">For AI Film Contests readers</div>
              <h2 className="ds-h2">{DIALSHEET_PERK.offer}</h2>
              <p className="ds-lede" style={{ marginBottom: 14 }}>
                Enter this code at DialSheet&apos;s checkout: <span className="ds-perk-code">{DIALSHEET_PERK.code}</span>
              </p>
              <DialsheetButton placement="hub-perk">Use it at DialSheet →</DialsheetButton>
            </div>
          </section>
        )}

        <section className="ds-section">
          <h2 className="ds-h2">Three guides for filmmakers who want paid work</h2>
          <p className="ds-lede">
            Read them in order. The first is the weekly system, the second is what to say on the phone,
            and the third is what to do when nobody calls back.
          </p>
          <CardRow items={CLIENT_GUIDES} tints={['pack-tint-yellow', 'pack-tint-pink', 'pack-tint-purple']} />
        </section>

        <section className="ds-section">
          <h2 className="ds-h2">What DialSheet is</h2>
          <p className="ds-lede">
            <DialsheetLink placement="hub-what" /> is a power dialer and CRM that runs in a browser tab. You upload a list,
            click once, and it calls down the list for you, keeping your notes and callbacks on each lead.
          </p>
          <dl className="ds-facts">
            <div className="ds-fact">
              <dt>Free for one person</dt>
              <dd>$0 for the software, with a list of up to {DIALSHEET.freeLeads} leads and {DIALSHEET.freeCallsPerMonth} calls a month.</dd>
            </div>
            <div className="ds-fact">
              <dt>${DIALSHEET.proUsd} a seat for a team</dt>
              <dd>
                Pro is ${DIALSHEET.proUsd} a month for the first seat and for each teammate, with unlimited leads, AI call
                summaries and a parallel dialer that rings {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} lines at once.
              </dd>
            </div>
            <div className="ds-fact">
              <dt>Your phone line, or theirs</dt>
              <dd>
                Connect your own Twilio account and pay Twilio&apos;s rates, or take a DialSheet line with a local number
                and {DIALSHEET.lineMinutes.toLocaleString('en-US')} minutes: {LINE_PRICE_LINE}. US and Canada.
              </dd>
            </div>
            <div className="ds-fact">
              <dt>The price you join at stays</dt>
              <dd>DialSheet does not raise the rate on a subscriber who stays subscribed. No contract and no seat minimum.</dd>
            </div>
          </dl>
        </section>

        <section className="ds-section">
          <div className="ds-hero" style={{ marginBottom: 28, alignItems: 'center' }}>
            <div>
              <h2 className="ds-h2">If you run a sales team</h2>
              <p className="ds-lede" style={{ marginBottom: 0 }}>
                DialSheet is built for outbound sales teams: reps, founders and team owners who spend the day on the
                phone. If that is you, skip the film talk. These three pages cover the price, the features and what
                changes for the person who manages the team.
              </p>
            </div>
            <div className="ds-art">
              <Image
                src={COLLAB_ART.team.src} width={COLLAB_ART.team.width} height={COLLAB_ART.team.height}
                alt={COLLAB_ART.team.alt} sizes="(max-width: 860px) 100vw, 480px"
              />
            </div>
          </div>
          <CardRow items={DIALSHEET_PAGES} tints={['pack-tint-blue', 'pack-tint-green', 'pack-tint-purple']} />
        </section>

        <section className="ds-section">
          <h2 className="ds-h2">Questions managers ask about a dialer</h2>
          <p className="ds-lede">
            One question to a page, answered with DialSheet&apos;s own numbers and the cases where another tool fits
            better.
          </p>
          <AnswerList group="product" />
        </section>

        <section className="ds-section">
          <h2 className="ds-h2">Running the team</h2>
          <p className="ds-lede">
            For the person who owns the quota: the sums behind it, a coaching routine, and what an appointment setting
            agency needs from a dialer.
          </p>
          <AnswerList group="managing" />
        </section>

        <section className="pack-claim" style={{ marginBottom: 28 }}>
          <div style={{ maxWidth: 520 }}>
            <h2 className="ds-cta-title">Make the first call this week</h2>
            <p className="ds-cta-text">
              Start on the free plan, import the list you built from the first guide, and dial.
            </p>
          </div>
          <DialsheetButton placement="hub-bottom">Try DialSheet free →</DialsheetButton>
        </section>

        <PartnerSmallPrint />
      </div>
    </InnerLayout>
  )
}
