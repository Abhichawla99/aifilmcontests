import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsBlock, DsList, DsP, DsTable, InlineLink, dialsheetMetadata,
  type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, TEAM_ESTIMATES, answerPath } from '@/lib/dialsheet'

/* Quota as arithmetic. The dials-a-day and connect-rate inputs are
   DialSheet's published working estimates for B2B SDR teams
   (TEAM_ESTIMATES.sdr) and one customer's measured rate. The booking rate and
   the quota of 25 are assumptions for the worked example, and the page says
   so each time. Every figure in the example is computed below, so changing an
   input changes the page. No result is promised. */

const SLUG = 'sdr-quota-math'
const TITLE = 'How Many Dials Does It Take to Hit Quota? The Math for SDR Managers'
const STANDFIRST = 'Quota comes down to three numbers: dials, the share of dials that reach a person, and the share of those conversations that book a meeting. Divide your way back from the meetings you need and you have the dials. Run it for each rep every week and you can see which of the three numbers is off.'

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sdr = TEAM_ESTIMATES.sdr
const agency = TEAM_ESTIMATES.agency
const DAYS = 21
const BOOKING = 0.1 // assumed for the example
const QUOTA = 25 // assumed for the example
const dials = sdr.dialsPerDay * DAYS
const conversations = Math.round(dials * sdr.connectRate)
const meetings = Math.round(conversations * BOOKING)
const neededConversations = Math.round(QUOTA / BOOKING)
const neededDials = Math.round(neededConversations / sdr.connectRate)
const neededDialsPerDay = Math.round(neededDials / DAYS)
const neededConnect = Math.round((neededConversations / dials) * 100)
const neededBooking = Math.round((QUOTA / conversations) * 100)
const dialsPerMeeting = Math.round(1 / (sdr.connectRate * BOOKING))
const pct = (n: number) => `${Math.round(n * 100)}%`
const num = (n: number) => n.toLocaleString('en-US')

const sections: DsSection[] = [
  {
    h: 'The three numbers',
    body: (
      <>
        <DsList items={[
          <>Dials: calls placed in the period.</>,
          <>Connect rate: conversations divided by dials.</>,
          <>Booking rate: meetings booked divided by conversations.</>,
        ]} />
        <DsBlock>{`meetings = dials x connect rate x booking rate
dials needed = meetings needed / (connect rate x booking rate)`}</DsBlock>
        <DsP>
          Pull all three from your call log for the last 30 days, for the team and for each rep. A week is too short
          for the booking rate. One good day moves it.
        </DsP>
      </>
    ),
  },
  {
    h: 'A worked example',
    body: (
      <>
        <DsP>
          DialSheet&apos;s working estimate for a B2B SDR is {sdr.dialsPerDay} dials a day at a {pct(sdr.connectRate)}{' '}
          connect rate. The booking rate below is assumed at {pct(BOOKING)}, and so is the quota of {QUOTA} meetings a
          month. Put your own figures in.
        </DsP>
        <DsTable
          head={['Step', 'Sum', 'Result']}
          rows={[
            ['Dials in a month', `${sdr.dialsPerDay} a day x ${DAYS} working days`, num(dials)],
            ['Conversations', `${num(dials)} x ${pct(sdr.connectRate)}`, num(conversations)],
            ['Meetings', `${num(conversations)} x ${pct(BOOKING)}`, `About ${meetings}`],
          ]}
        />
        <DsP>
          That rep books about {meetings} meetings against a quota of {QUOTA}. The same sum shows three ways to close
          the gap, one for each number.
        </DsP>
        <DsTable
          head={['Change one number', 'To', 'And leave']}
          rows={[
            ['Dials', `${neededDialsPerDay} a day (${num(neededDials)} a month)`, `Connect rate ${pct(sdr.connectRate)}, booking rate ${pct(BOOKING)}`],
            ['Connect rate', `About ${neededConnect}%`, `${sdr.dialsPerDay} dials a day, booking rate ${pct(BOOKING)}`],
            ['Booking rate', `About ${neededBooking}%`, `${sdr.dialsPerDay} dials a day, connect rate ${pct(sdr.connectRate)}`],
          ]}
        />
      </>
    ),
  },
  {
    h: 'Which number to fix',
    body: (
      <>
        <DsP>Each number has its own causes, and a manager owns two of the three.</DsP>
        <DsList items={[
          <>Low dials usually start with tooling. On one line, a rep waits through every ring. A <InlineLink href={answerPath('parallel-dialer')}>parallel dialer</InlineLink> rings {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} leads at once, so the same hours hold more dials.</>,
          <>Connect rate is a list and number problem. Remove dead numbers (DialSheet says about one parallel line in six fails, almost always on a dead number in a scraped list). Call each lead in its own time zone. Call from a local number, and keep each number under roughly 60 to 100 dials a day so it does not pick up a spam label.</>,
          <>Booking rate is a talk-track problem, and it is the rep&apos;s number. It moves with the opener, the question and the ask, which is what <InlineLink href={answerPath('how-to-coach-cold-calls')}>the weekly coaching routine</InlineLink> works on.</>,
        ]} />
      </>
    ),
  },
  {
    h: 'Run it for each rep',
    body: (
      <>
        <DsP>
          Put each rep&apos;s three numbers beside the team&apos;s. The pattern tells you what kind of conversation to
          have.
        </DsP>
        <DsTable
          head={['The rep has', 'It usually means', 'What to do']}
          rows={[
            ['Low dials, normal rates', 'Time is going somewhere other than the phone', 'Look at the calendar and the tooling before the person'],
            ['Normal dials, low connect rate', 'A worse list, a flagged number or the wrong hours', 'Fix the list and the number yourself'],
            ['Normal connect rate, low booking rate', 'The talk track', 'Coach it, one change a week'],
          ]}
        />
        <DsP>
          Those are the common causes. Check which one applies before you act on it.
        </DsP>
      </>
    ),
  },
  {
    h: 'What the math leaves out',
    body: (
      <>
        <DsList items={[
          <>Meetings that happen. A booked meeting that nobody attends counts in this sum and not in revenue, so track the show rate as a fourth number.</>,
          <>Lead quality. Two lists with the same connect rate can book very differently.</>,
          <>Small samples. Fewer than a hundred conversations will not give you a booking rate you can plan on.</>,
        ]} />
        <DsP>
          DialSheet&apos;s leaderboard ranks the team over 7 days, 30 days or a custom range and exports as a CSV, and
          each call in the log carries its outcome. Both are at <DialsheetLink placement="quota-body" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'How many cold calls does it take to book a meeting?',
    a: `Divide 1 by your connect rate times your booking rate. At a ${pct(sdr.connectRate)} connect rate and a ${pct(BOOKING)} booking rate that is about ${dialsPerMeeting} dials for one meeting. Both rates vary a lot with the list and the offer, so measure your own.`,
  },
  {
    q: 'What is a good connect rate for cold calling?',
    a: `It depends on the list. DialSheet's working estimate is ${pct(sdr.connectRate)} for B2B SDR teams and ${pct(agency.connectRate)} for appointment setting agencies, and one of its customers measured 13% over roughly 6,400 calls.`,
  },
  {
    q: 'How many dials a day should an SDR make?',
    a: `DialSheet's working estimate is ${sdr.dialsPerDay} dials a rep a day for SDR teams and ${agency.dialsPerDay} for appointment setters. Work back from your quota with your own connect and booking rates to get your team's number.`,
  },
  {
    q: 'How do I know why a rep is missing quota?',
    a: 'Compare the rep to the team on three numbers. Low dials points to time or tooling, a low connect rate points to the list or the phone number, and a low booking rate points to the talk track.',
  },
  {
    q: 'Does a parallel dialer help a team hit quota?',
    a: 'It raises dials for the same hours, because the rep is not waiting on one ringing line. It does not change the connect rate of the list or what the rep says, so check those two numbers as well.',
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
      placement="quota"
      related={['how-to-coach-cold-calls', 'parallel-dialer', 'power-vs-parallel-vs-predictive-dialer']}
    />
  )
}
