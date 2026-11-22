import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, LINE_PRICE_LINE, answerPath } from '@/lib/dialsheet'

/* The parallel dialer. Every product fact is DialSheet's own: the pricing
   page's "What is instant connect?" answer, and the changelog entries of
   September 26, 28 and 29 and October 6, 2026. The spam-label and CloudTalk
   lines are from dialsheet.io/llms.txt. */

const SLUG = 'parallel-dialer'
const TITLE = `DialSheet's Parallel Dialer: ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} Lines at Once, Included at $${DIALSHEET.proUsd} a Seat`
const STANDFIRST = `A parallel dialer rings several leads at once and puts the rep on with the first person who answers. DialSheet's rings ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines and is part of the $${DIALSHEET.proUsd} Pro seat, with no add-on to buy. This page covers how it handles a pickup, what five lines does to a list, and when to stay on one line.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sections: DsSection[] = [
  {
    h: 'How it works',
    body: (
      <>
        <DsP>
          The rep starts a session on a list. DialSheet calls {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} leads
          at the same moment and connects the rep to the first person who answers. When that call ends, the next batch
          goes out.
        </DsP>
        <DsList items={[
          <>Lines: {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} on your own Twilio account. On a DialSheet line, 2 from the first day and 3 once the carrier has verified your business.</>,
          <>Pickups: instant connect is the default. The rep is on the call the moment someone answers, with no silent pause while software checks for a machine.</>,
          <>Voicemail: machines are flagged as they come in, and one key leaves the rep&apos;s recorded message. A second mode, Screen voicemails first, holds each answer for about 3 to 4 seconds and drops machines before the rep hears them. DialSheet recommends instant connect.</>,
          <>Numbers: Rotate numbers sends each call from the next number on the account, and the rep can switch the calling number in the middle of a session.</>,
          <>Failed lines: the session log shows the carrier&apos;s error code and message for every line that fails.</>,
        ]} />
      </>
    ),
  },
  {
    h: 'What five lines does to your list',
    body: (
      <>
        <DsP>
          More lines means the rep waits less and the list runs out sooner. At five lines, five leads are called for
          every conversation slot, so a long list that rarely answers suits a parallel dialer and a short, expensive
          list is wasted on one.
        </DsP>
        <DsP>
          Two people will sometimes answer at once. The rep gets one and the other hears a hang-up. DialSheet counts
          those during the session and lists them at the end, so the rep can call them back. The more lines you run,
          the more often it happens.
        </DsP>
        <DsP>
          Parallel dialing also shows how clean a list is. DialSheet says about one parallel line in six fails, almost
          always on a dead number in a scraped list. Because the log names the reason, those numbers can come off the
          list after one session.
        </DsP>
      </>
    ),
  },
  {
    h: 'What it costs',
    body: (
      <>
        <DsP>
          The parallel dialer is part of Pro at ${DIALSHEET.proUsd} a seat a month. Until September 29, 2026 it was a
          $19 add-on, and DialSheet folded it into every Pro seat on that day.
        </DsP>
        <DsP>
          The phone time is separate. On your own Twilio account, DialSheet lists calls at about $
          {DIALSHEET.twilioPerMinuteUsd} a minute for the US. A DialSheet line, with a number and{' '}
          {DIALSHEET.lineMinutes.toLocaleString('en-US')} minutes a month, is {LINE_PRICE_LINE}.{' '}
          <InlineLink href={answerPath('dialer-cost-by-team-size')}>The cost page</InlineLink> works both out for a
          team.
        </DsP>
      </>
    ),
  },
  {
    h: 'When to stay on one line',
    body: (
      <>
        <DsList items={[
          <>Your list is short and every name on it was researched. Each dropped answer is a prospect you wanted, so use Power Dial and read the notes during the ring.</>,
          <>You call consumers. The US Telemarketing Sales Rule and Canada&apos;s Unsolicited Telecommunications Rules limit abandoned calls in consumer telemarketing. Read the rule for your campaign before you run more than one line.</>,
          <>You have one phone number. DialSheet&apos;s guidance on spam labels is to keep each number under roughly 60 to 100 dials a day. Five lines pass that quickly, so add numbers before you add lines.</>,
          <>You are one rep who parallel-dials more than about 81 numbers a day and will sign for a year. DialSheet&apos;s own comparison says CloudTalk&apos;s $64 annual seat with its parallel add-on costs less at that volume.</>,
        ]} />
        <DsP>
          If you are still choosing between dialer types,{' '}
          <InlineLink href={answerPath('power-vs-parallel-vs-predictive-dialer')}>power, parallel or predictive</InlineLink>{' '}
          walks through the decision. To try the parallel dialer, start a Pro seat at{' '}
          <DialsheetLink placement="parallel-body" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'How many lines can DialSheet dial at once?',
    a: `${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines on your own Twilio account. A DialSheet line runs 2 lines from the first day and 3 once the carrier has verified your business.`,
  },
  {
    q: 'Is the parallel dialer included in the price?',
    a: `Yes. It is part of every Pro seat at $${DIALSHEET.proUsd} a month. It was a separate $19 add-on until September 29, 2026.`,
  },
  {
    q: 'Does the parallel dialer detect voicemail?',
    a: 'Yes. With instant connect, voicemails are flagged as they come in and one key leaves your recorded message. With Screen voicemails first, each answer is held for about 3 to 4 seconds and machines are dropped before the rep hears them.',
  },
  {
    q: 'What happens when two people answer at the same time?',
    a: 'The rep is connected to one and the other call is ended. DialSheet counts those calls during the session and lists them at the end so they can be called back.',
  },
  {
    q: 'Can I use the parallel dialer without a Twilio account?',
    a: 'Yes, in the US and Canada. A DialSheet line includes a local number and minutes and runs the parallel dialer at 2 lines from the first day.',
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
      placement="parallel"
      related={['power-vs-parallel-vs-predictive-dialer', 'dialer-cost-by-team-size', 'sdr-quota-math']}
    />
  )
}
