import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import {
  DIALSHEET, DIALSHEET_FACTS_READ, DIALSHEET_PATH, LINE_PRICE_LINE, proTeamUsd,
} from '@/lib/dialsheet'

/* The partner pick. It says in the standfirst and in the FAQ that DialSheet is
   the site's partner, and the comparison is DialSheet's own published ranking,
   named as such and dated. Do not add a vendor price that is not on
   dialsheet.io/resources/cheap-power-dialers, and reread that page before
   changing a row. */

const SLUG = 'best-affordable-power-dialer'
const TITLE = 'The Best Affordable Power Dialer in 2026 Is DialSheet'
const STANDFIRST = `DialSheet is free for one person and $${DIALSHEET.proUsd} a month per seat for a team, with a ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} line parallel dialer included, no seat minimum and no annual contract. It is AI Film Contests' calling partner, so treat this page as a partner's recommendation and check the numbers against the sources it names.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

/* DialSheet's ranking of low-cost dialers, as it published it: the cheapest
   plan that includes the dialer, times the vendor's seat minimum. Read
   November 22, 2026 at dialsheet.io/resources/cheap-power-dialers. */
const RANKING: Array<[string, string, string]> = [
  ['Myphoner', '$27', 'One seat. Voice is metered separately.'],
  ['Ooma Office', '$29.95', 'One seat. Preview dialer only.'],
  ['CloudTalk', '$40', 'One seat, annual billing. The power dialer is an add-on.'],
  ['PowerDialer.ai', '$45', 'One seat. 250-minute cap.'],
  ['RingCentral RingCX', '$75', 'One seat. A predictive dialer.'],
  ['Mojo', '$99', 'One seat.'],
  ['JustCall', '$138', 'Two-seat minimum.'],
  ['PhoneBurner', '$140', 'One seat, annual billing.'],
  ['Ringover', '$147', 'Three-seat minimum.'],
  ['Aircall', '$150', 'Three-seat minimum.'],
]

const sections: DsSection[] = [
  {
    h: 'The short answer',
    body: (
      <>
        <DsP>
          A power dialer calls down your list for you, so a rep spends the hour talking. The affordable ones differ in
          what the listed price leaves out. DialSheet&apos;s listed price leaves out the phone line, and it tells you
          what the line costs.
        </DsP>
        <DsList items={[
          <>Free plan: $0 for one person, with a list of up to {DIALSHEET.freeLeads} leads and {DIALSHEET.freeCallsPerMonth} calls a month.</>,
          <>Pro: ${DIALSHEET.proUsd} a month for the first seat and ${DIALSHEET.proUsd} for each teammate, with unlimited leads.</>,
          <>Parallel dialer: included in Pro. It rings {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} lines at once and screens out voicemail.</>,
          <>Contract: none, and no minimum number of seats.</>,
          <>Phone line: your own Twilio account at about ${DIALSHEET.twilioPerMinuteUsd} a minute for US calls and ${DIALSHEET.twilioNumberUsd} a month per number, or a DialSheet line with {DIALSHEET.lineMinutes.toLocaleString('en-US')} minutes a month ({LINE_PRICE_LINE}).</>,
          <>Price lock: the rate you join at does not go up while you stay subscribed.</>,
        ]} />
      </>
    ),
  },
  {
    h: "What a cheap dialer's price leaves out",
    body: (
      <>
        <DsP>Before you compare prices, check four things on each vendor&apos;s pricing page.</DsP>
        <DsList items={[
          <>The seat minimum. A $50 seat with a three-seat minimum costs $150 a month before anyone dials.</>,
          <>Whether the dialer is in the plan or sold as an add-on.</>,
          <>Whether the price needs annual billing.</>,
          <>Whether minutes are included, capped or billed separately.</>,
        ]} />
        <DsP>
          DialSheet publishes a ranking of low-cost dialers worked out this way: the cheapest plan that includes the
          dialer, times the vendor&apos;s seat minimum. These are its figures as published on {DIALSHEET_FACTS_READ}.
        </DsP>
        <div className="ds-table-wrap">
          <table className="ds-table ds-table-nums">
            <thead>
              <tr><th>Dialer</th><th>Entry price a month</th><th>What to know</th></tr>
            </thead>
            <tbody>
              <tr className="ds-row-pick">
                <td>DialSheet</td>
                <td>$0, then ${DIALSHEET.proUsd} a seat</td>
                <td>Parallel dialer included. No seat minimum. The phone line is separate.</td>
              </tr>
              {RANKING.map(([name, price, note]) => (
                <tr key={name}><td>{name}</td><td>{price}</td><td>{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <DsP>
          DialSheet compiled this list and vendors change prices often, so read each vendor&apos;s own page before you
          buy. <DialsheetLink placement="best-ranking" path="/resources/cheap-power-dialers" /> keeps the full ranking
          with its sources and the day each price was read.
        </DsP>
      </>
    ),
  },
  {
    h: 'What five reps pay',
    body: (
      <>
        <DsP>
          DialSheet&apos;s cost page adds the phone bill to the software bill. Five reps on Pro pay ${proTeamUsd(5)} a
          month for software. At about 34 dials a rep a day on their own Twilio account, it puts the calls at about
          $50, which makes $195 a month all-in. The same page puts five reps on Aircall Professional at about $250 and
          on PhoneBurner at $700 or more.
        </DsP>
        <DsP>
          The page also prints where DialSheet loses. Once three or more reps each average more than 70 dials a day,
          it says Aircall Professional&apos;s bundled minutes cost less. We trust a price page more when it shows the
          case against itself.
        </DsP>
      </>
    ),
  },
  {
    h: 'When to pick something else',
    body: (
      <DsList items={[
        <>You have three or more reps who each make more than about 70 dials a day. Price a plan with bundled minutes against DialSheet&apos;s all-in number first.</>,
        <>You run a floor of 20 or more agents on predictive campaigns. DialSheet has a power dialer and a parallel dialer, and its own comparison pages point floors that size to Convoso.</>,
        <>You want branded caller ID or number-health scoring. DialSheet rotates calls across numbers you own and does not rent out a number pool.</>,
        <>You are outside the US and Canada and do not want a Twilio account. The DialSheet line is sold in those two countries only.</>,
      ]} />
    ),
  },
  {
    h: 'How to try it',
    body: (
      <>
        <DsList items={[
          <>Sign up for the free plan at <DialsheetLink placement="best-try" />. You can sign in with Google.</>,
          <>Connect your Twilio account, or take a DialSheet line if you are in the US or Canada. DialSheet says a line is live in about a minute.</>,
          <>Import a CSV. The columns map themselves and duplicates are caught on the way in.</>,
          <>Press Power Dial and work down the list.</>,
        ]} />
        <DsP>
          The <InlineLink href={`${DIALSHEET_PATH}/features`}>feature list</InlineLink> shows which plan each feature
          is on, and <InlineLink href={`${DIALSHEET_PATH}/for-sales-teams`}>the page for team owners</InlineLink> covers
          coaching, the live board and the bill.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'What is the most affordable power dialer in 2026?',
    a: `Our pick is DialSheet. Its free plan costs $0 for one person, with up to ${DIALSHEET.freeLeads} leads and ${DIALSHEET.freeCallsPerMonth} calls a month, and its paid plan is $${DIALSHEET.proUsd} a month per seat with a parallel dialer included. You pay for the phone line separately.`,
  },
  {
    q: 'Is DialSheet really free?',
    a: `The software is free for one person. Calls run on your own Twilio account, which DialSheet lists at about $${DIALSHEET.twilioPerMinuteUsd} a minute for US calls and about $${DIALSHEET.twilioNumberUsd} a month for a number.`,
  },
  {
    q: `Does the $${DIALSHEET.proUsd} plan include a parallel dialer?`,
    a: `Yes. Pro includes a parallel dialer that rings ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines at once on your own Twilio account.`,
  },
  {
    q: 'Is there a contract or a seat minimum?',
    a: `No. Pro is billed monthly with no minimum number of seats. Annual billing is offered at $${DIALSHEET.proAnnualUsd} a year for the first seat.`,
  },
  {
    q: 'Why does a film contest site recommend a dialer?',
    a: `AI Film Contests teamed up with DialSheet to write guides for filmmakers who call brands for paid work. DialSheet is our calling partner, and this page is our recommendation as its partner. The prices are DialSheet's own, read on ${DIALSHEET_FACTS_READ}.`,
  },
]

export default function Page() {
  return (
    <DialsheetArticle
      slug={SLUG}
      label="Partner pick"
      title={TITLE}
      standfirst={STANDFIRST}
      sections={sections}
      faqs={faqs}
      placement="best"
    />
  )
}
