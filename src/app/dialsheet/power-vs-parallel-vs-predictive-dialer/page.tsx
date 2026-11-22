import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, DsTable, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, TEAM_ESTIMATES, answerPath } from '@/lib/dialsheet'

/* A dialer decision page. The three definitions are general. The connect
   rates are DialSheet's: its working estimate for SDR teams and the measured
   rate of one customer, both from dialsheet.io/llms-full.txt. The 30% case is
   an illustration and the page says so. */

const SLUG = 'power-vs-parallel-vs-predictive-dialer'
const TITLE = 'Power, Parallel or Predictive Dialer: Which One Your Team Needs'
const STANDFIRST = 'A power dialer calls one lead at a time for each rep. A parallel dialer calls several at once for one rep. A predictive dialer calls ahead for a whole floor of agents. Which one fits depends on how often your list answers, how many reps you have and what a dropped call costs you.'

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const SDR_CONNECT = Math.round(TEAM_ESTIMATES.sdr.connectRate * 100)
const DIALS_PER_ANSWER = Math.round(1 / TEAM_ESTIMATES.sdr.connectRate)

const sections: DsSection[] = [
  {
    h: 'The three types side by side',
    body: (
      <DsTable
        head={['Type', 'How it dials', 'What it costs you']}
        rows={[
          ['Power', 'One lead at a time. The next call starts when the last one ends.', 'The rep waits through every ring and voicemail greeting.'],
          ['Parallel', `${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} leads at once for one rep. The first live answer gets the rep.`, 'A second person who answers is hung up on, and the list runs out faster.'],
          ['Predictive', 'Software dials ahead for a pool of agents and sends each answer to whoever is free.', 'Calls are abandoned when no agent is free, and it needs a steady headcount on one campaign.'],
        ]}
      />
    ),
  },
  {
    h: 'Start from your connect rate',
    body: (
      <>
        <DsP>
          Count how many dials it takes to reach one person. DialSheet&apos;s working estimate for B2B SDR teams is a{' '}
          {SDR_CONNECT}% connect rate, which is about one answer in {DIALS_PER_ANSWER} dials. One of its customers, a UK
          accountancy practice, measured 13% over roughly 6,400 calls.
        </DsP>
        <DsP>
          At {SDR_CONNECT}%, a rep on one line sits through about {DIALS_PER_ANSWER - 1} unanswered calls for each
          conversation. A second, third or fifth line removes that wait. Now suppose a list of warm callbacks answers
          30% of the time. Nearly every third dial is a person, and extra lines mostly produce people you hang up on.
        </DsP>
        <DsP>
          So a low connect rate favours parallel and a high one favours power.
        </DsP>
      </>
    ),
  },
  {
    h: 'Then count your reps',
    body: (
      <>
        <DsP>
          A parallel dialer works per rep. Each person runs their own session, so it suits a team of one as well as a
          team of fifteen.
        </DsP>
        <DsP>
          A predictive dialer needs a pool. It guesses how many agents will be free in the next few seconds, and the
          guess only holds with enough agents on the same campaign. DialSheet does not sell one. Its own comparison
          pages send floors of 20 or more agents on predictive campaigns to Convoso.
        </DsP>
      </>
    ),
  },
  {
    h: 'Then price a dropped call',
    body: (
      <>
        <DsP>
          Every extra line raises the chance that two people answer together. If a lead costs you cents, that trade is
          easy. If each one is a named account your team researched, stay on a power dialer.
        </DsP>
        <DsP>
          Consumer campaigns add a legal cost. The US Telemarketing Sales Rule and Canada&apos;s Unsolicited
          Telecommunications Rules limit abandoned calls in consumer telemarketing, so read the rule for your campaign
          before you run more than one line.
        </DsP>
      </>
    ),
  },
  {
    h: 'Where DialSheet sits',
    body: (
      <>
        <DsList items={[
          <>Power Dial is on the free plan and on Pro.</>,
          <>The parallel dialer, {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} lines, is part of Pro at ${DIALSHEET.proUsd} a seat a month.</>,
          <>A rep can run Power Dial on a callback list in the morning and the parallel dialer on a cold list in the afternoon.</>,
          <>There is no predictive dialer.</>,
        ]} />
        <DsP>
          <InlineLink href={answerPath('parallel-dialer')}>The parallel dialer page</InlineLink> covers pickups,
          voicemail and the hang-up count. Both dialers are at <DialsheetLink placement="dialer-types-body" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'What is the difference between a power dialer and a parallel dialer?',
    a: 'A power dialer calls one lead at a time and starts the next call when the last one ends. A parallel dialer calls several leads at once for one rep and connects the rep to the first person who answers.',
  },
  {
    q: 'Is a parallel dialer the same as a predictive dialer?',
    a: 'No. A parallel dialer runs several lines for one rep. A predictive dialer dials ahead for a pool of agents and routes each answer to whoever is free, which needs a larger floor to work.',
  },
  {
    q: 'Which dialer is best for a small SDR team?',
    a: 'For a small team on cold lists, we would start with a parallel dialer at 2 or 3 lines and go to 5 only on long lists with clean numbers. Keep a power dialer for callbacks and named accounts.',
  },
  {
    q: 'Does DialSheet have a predictive dialer?',
    a: `No. DialSheet has a power dialer and a parallel dialer of ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines.`,
  },
  {
    q: 'When is a power dialer better than a parallel dialer?',
    a: 'When the list answers often, when each lead is expensive, or when the rep needs to read notes before each conversation.',
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
      placement="dialer-types"
      related={['parallel-dialer', 'sdr-quota-math', 'dialer-cost-by-team-size']}
    />
  )
}
