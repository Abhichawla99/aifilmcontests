import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { answerPath } from '@/lib/dialsheet'

/* The live board, listen in and whisper. Facts from DialSheet's changelog
   entry of October 1, 2026 and llms.txt: a card per member refreshed every
   five seconds, owner only, listen and whisper. The advice on when to use
   each is the page's own and makes no claim about results. */

const SLUG = 'live-call-listening-and-whisper'
const TITLE = 'Listen to Live Calls and Whisper to a Rep in DialSheet'
const STANDFIRST = "DialSheet's Team page shows who is on a call right now. The team owner can listen to that call as it happens and whisper to the rep without the prospect hearing. It has been live since October 1, 2026, and it is for the team owner only."

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sections: DsSection[] = [
  {
    h: 'What the live board shows',
    body: (
      <>
        <DsP>Each team member has a card, refreshed every five seconds. A card reads one of four ways:</DsP>
        <DsList items={[
          <>On a call, with the lead, the company and a running clock.</>,
          <>Parallel, when the rep is in a parallel dialer session.</>,
          <>Dialer open, when the rep is in the dialer between calls.</>,
          <>Offline.</>,
        ]} />
        <DsP>The card also shows the rep&apos;s last call and when their dialer last checked in.</DsP>
      </>
    ),
  },
  {
    h: 'Listen in and whisper',
    body: (
      <>
        <DsP>
          From a card that is on a call, the owner can listen. The rep and the prospect carry on as they were.
        </DsP>
        <DsP>
          Whisper lets the owner speak to the rep during the call. The rep hears it and the prospect does not.
        </DsP>
      </>
    ),
  },
  {
    h: 'Who can use it',
    body: (
      <DsP>
        The team owner, and nobody else. Reps do not see the live board, and neither do admins who are not the owner.
        Call stats stay visible to everyone as before. If two people manage the floor, only the one who owns the
        DialSheet team can listen.
      </DsP>
    ),
  },
  {
    h: 'When to listen and when to whisper',
    body: (
      <>
        <DsList items={[
          <>Listen during a new rep&apos;s first week. You hear the opener as prospects hear it, which no summary gives you.</>,
          <>Listen on the day you change the script. Three live calls show whether the new opener survives a real answer.</>,
          <>Whisper a fact the rep does not have: a price, a date, the name of the customer down the road. Keep it to a few words.</>,
          <>Do not whisper direction. A rep cannot listen to a prospect and a manager at once.</>,
          <>Tell the team that calls can be heard. Monitoring and recording rules differ by state and country, so check the ones that apply to your reps and the people they call.</>,
        ]} />
        <DsP>
          Live listening covers the calls you can sit in on. For the rest, use{' '}
          <InlineLink href={answerPath('call-transcription-and-ai-summaries')}>transcripts and script scores</InlineLink>{' '}
          and <InlineLink href={answerPath('how-to-coach-cold-calls')}>the weekly coaching routine</InlineLink>. The live
          board is on the Team page at <DialsheetLink placement="live-listen-body" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'Can a manager listen to live calls in DialSheet?',
    a: 'Yes. The team owner can listen to a live call from the Team page and whisper to the rep without the prospect hearing.',
  },
  {
    q: 'What is call whisper?',
    a: 'Whisper lets a manager speak to the rep during a live call. The rep hears the manager and the prospect does not.',
  },
  {
    q: 'Who can see the live board in DialSheet?',
    a: 'Only the team owner. Reps and admins who are not the owner do not see it.',
  },
  {
    q: 'What does the live board show?',
    a: 'A card for each team member, refreshed every five seconds: on a call with the lead, company and a running clock, in a parallel session, dialer open, or offline, plus the last call and when the dialer last checked in.',
  },
  {
    q: 'When did DialSheet add live call listening?',
    a: 'On October 1, 2026, together with the live board and whisper.',
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
      placement="live-listen"
      related={['how-to-coach-cold-calls', 'call-transcription-and-ai-summaries', 'sdr-quota-math']}
    />
  )
}
