import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, DsTable, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, DIALSHEET_PATH, TEAM_ESTIMATES, answerPath, proTeamUsd } from '@/lib/dialsheet'

/* What a team pays. The seat sums are arithmetic on DialSheet's price. The
   all-in estimates are DialSheet's (TEAM_ESTIMATES, from llms-full.txt). The
   stricter phone-bill count is this page's own arithmetic on DialSheet's
   published Twilio rate and its cost page's assumption of about one billed
   minute a dial, and the page says which is which. */

const SLUG = 'dialer-cost-by-team-size'
const TITLE = 'What a Dialer Costs a Sales Team of 3, 10, 25 or 50'
const STANDFIRST = `On DialSheet a team's software bill is the seat count times $${DIALSHEET.proUsd}: $${proTeamUsd(3)} for 3 reps, $${proTeamUsd(10)} for 10, $${proTeamUsd(25)} for 25 and $${proTeamUsd(50).toLocaleString('en-US')} for 50. The phone bill is separate and follows how much the team talks. Both are worked out below, with the volume at which another dialer costs less.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const WORK_DAYS = 21
/** One rep's month of calls if every dial bills about a minute, at DialSheet's listed Twilio rate. */
const strictPerRep = (dialsPerDay: number) => Math.round(dialsPerDay * WORK_DAYS * DIALSHEET.twilioPerMinuteUsd)
const sdr = TEAM_ESTIMATES.sdr
const agency = TEAM_ESTIMATES.agency
/** What the estimate leaves for the phone bill, per rep, on the 10-rep row. */
const lightPerRep = (rows: Array<[number, number]>) => Math.round((rows[1][1] - proTeamUsd(rows[1][0])) / rows[1][0])

const sections: DsSection[] = [
  {
    h: 'The software bill',
    body: (
      <>
        <DsTable
          figures
          head={['Team', 'Software a month', 'A year, paid monthly']}
          rows={[1, 3, 6, 10, 25, 50].map(n => [
            `${n} ${n === 1 ? 'seat' : 'seats'}`, usd(proTeamUsd(n)), usd(proTeamUsd(n) * 12),
          ])}
        />
        <DsP>
          Every seat is ${DIALSHEET.proUsd}, the first and the fiftieth. There is no seat minimum, no setup fee, no
          annual commitment and no charge for call recordings. The parallel dialer, AI call summaries and script
          scoring are in the seat price.
        </DsP>
      </>
    ),
  },
  {
    h: 'The phone bill, estimated two ways',
    body: (
      <>
        <DsP>
          Calls run on your own Twilio account at about ${DIALSHEET.twilioPerMinuteUsd} a minute for the US and $
          {DIALSHEET.twilioNumberUsd} a month per number. How much that comes to depends on what you count as a billed
          minute, and DialSheet&apos;s own pages count it two ways.
        </DsP>
        <DsP>
          Its industry pages count live conversations only. For {sdr.who} they assume {sdr.assumptions},
          which leaves about ${lightPerRep(sdr.rows)} a rep a month for the phone bill. These are its all-in figures,
          software included.
        </DsP>
        <DsTable
          figures
          head={['Team', 'SDR team, all-in', 'Appointment setting, all-in']}
          rows={sdr.rows.map(([reps, allIn], i) => [`${reps} reps`, `${usd(allIn)} a month`, `${usd(agency.rows[i][1])} a month`])}
        />
        <DsP>
          The appointment setting column assumes {agency.assumptions}.
        </DsP>
        <DsP>
          DialSheet&apos;s cost page is stricter. It counts about one billed minute for every dial, which is closer to
          what happens when voicemail picks up. At that rate, {sdr.dialsPerDay} dials a day over {WORK_DAYS} working
          days is about ${strictPerRep(sdr.dialsPerDay)} a rep a month on top of the seat. That sum is ours, made from
          DialSheet&apos;s listed rate.
        </DsP>
        <DsP>
          Your bill will land between the two. Budget with the stricter one and check your first Twilio invoice.
        </DsP>
      </>
    ),
  },
  {
    h: 'What the same team pays elsewhere',
    body: (
      <>
        <DsP>
          DialSheet puts sales engagement platforms at $100 to $250 a user a month, which is $12,000 to $30,000 a year
          for ten SDRs. Its own estimate for those ten is about {usd(sdr.rows[1][1] * 12)} a year. You get a dialer
          and a CRM for that, and you do not get a native Salesforce connector.
        </DsP>
        <DsP>
          For the entry price of ten other dialers, with their seat minimums, see{' '}
          <InlineLink href={`${DIALSHEET_PATH}/best-affordable-power-dialer`}>our pick for an affordable dialer</InlineLink>.
        </DsP>
      </>
    ),
  },
  {
    h: 'Where another dialer is cheaper',
    body: (
      <>
        <DsList items={[
          <>Three or more reps who each make more than about 70 dials a day. DialSheet&apos;s cost page says Aircall Professional&apos;s bundled minutes cost less at that volume, and the stricter phone-bill count above shows why.</>,
          <>One rep who parallel-dials more than about 81 numbers a day and will sign for a year. DialSheet says CloudTalk&apos;s $64 annual seat with its parallel add-on costs less.</>,
          <>A floor of 20 or more agents on predictive campaigns, which DialSheet does not serve.</>,
        ]} />
        <DsP>
          Below those volumes, or for a team that wants to pay month to month, the seat price is what keeps the bill
          low. Start with one seat at <DialsheetLink placement="team-cost-body" /> and add reps as you hire.
        </DsP>
        <DsP>
          Agencies have their own sums on{' '}
          <InlineLink href={answerPath('for-appointment-setting-agencies')}>the appointment setting page</InlineLink>.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'How much does DialSheet cost for 10 reps?',
    a: `$${proTeamUsd(10)} a month for software. DialSheet's own all-in estimate for a ten-person SDR team is about ${usd(sdr.rows[1][1])} a month, counting live conversations as the billed minutes. Counting about a minute for every dial, the phone bill is closer to $${strictPerRep(sdr.dialsPerDay)} a rep.`,
  },
  {
    q: 'Is there a minimum number of seats?',
    a: `No. One seat is $${DIALSHEET.proUsd} a month and each teammate is another $${DIALSHEET.proUsd}.`,
  },
  {
    q: 'Are call recordings or the parallel dialer extra?',
    a: 'No. DialSheet does not charge for call recordings, and the parallel dialer is included in every Pro seat.',
  },
  {
    q: 'Is there an annual price?',
    a: `Yes. Annual billing is $${DIALSHEET.proAnnualUsd} a year for the first seat. Monthly billing has no commitment.`,
  },
  {
    q: 'Is DialSheet the cheapest dialer for a team?',
    a: "On software, DialSheet's published ranking shows the lowest entry price for a team that needs a parallel dialer. On the full bill it depends on volume. By DialSheet's own cost page, three or more reps averaging over 70 dials a day each pay less on a plan with bundled minutes.",
  },
]

export default function Page() {
  return (
    <DialsheetArticle
      slug={SLUG}
      label="Partner"
      title={TITLE}
      standfirst={STANDFIRST}
      sections={sections}
      faqs={faqs}
      placement="team-cost"
      related={['for-appointment-setting-agencies', 'parallel-dialer', 'sdr-quota-math']}
    />
  )
}
