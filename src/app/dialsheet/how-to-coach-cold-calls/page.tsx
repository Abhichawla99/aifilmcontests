import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { answerPath } from '@/lib/dialsheet'

/* A coaching routine for a manager. The routine is advice and makes no claim
   about results. Where it names what DialSheet does (summaries, transcripts,
   script scoring, the team score, the live board), the facts are the ones on
   the transcription and live-listening pages. */

const SLUG = 'how-to-coach-cold-calls'
const TITLE = "How to Coach a Sales Team's Cold Calls: A Weekly Routine"
const STANDFIRST = 'Coaching slips when it depends on a manager finding hours to play recordings. This routine uses call summaries to choose what to hear, picks three calls for each rep, limits each rep to one change a week, and saves live listening for the calls where it helps.'

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sections: DsSection[] = [
  {
    h: 'Monday: scan, do not listen',
    body: (
      <>
        <DsP>
          Start with last week&apos;s calls for one rep, sorted by outcome. Read the summaries. You are choosing three
          calls:
        </DsP>
        <DsList items={[
          <>One that booked a meeting.</>,
          <>One that reached the pitch and did not book.</>,
          <>One that ended inside the first 30 seconds.</>,
        ]} />
        <DsP>
          The first shows what the rep does when it works. The second is where the booking rate is lost. The third is
          the opener.
        </DsP>
      </>
    ),
  },
  {
    h: 'Read the transcript before you play the recording',
    body: (
      <DsP>
        A transcript lets you find the moment in seconds: where the prospect raised the objection, and what the rep
        said next. Then play that minute of the recording, because tone and pace are not in the text. If the call was
        scored against your script, the score already lists the checkpoints the rep skipped.
      </DsP>
    ),
  },
  {
    h: 'One change for each rep each week',
    body: (
      <>
        <DsP>
          Pick one behaviour from the three calls: the first sentence, the question after the pitch, or the way the
          rep asks for the meeting. Write it down in one line the rep can read before a session.
        </DsP>
        <DsP>
          Next Monday, check only that line. A rep given five notes has five things to remember on a live call, and
          you cannot tell which note moved the number.
        </DsP>
      </>
    ),
  },
  {
    h: 'Keep the review to fifteen minutes',
    body: (
      <DsList items={[
        <>Play the booked call first and ask the rep what they did.</>,
        <>Play the minute that mattered from the lost call and ask what they would say now.</>,
        <>Agree the one line for the week. Let the rep word it.</>,
        <>Look at their three numbers from <InlineLink href={answerPath('sdr-quota-math')}>the quota math</InlineLink> and say which one this change is meant to move.</>,
      ]} />
    ),
  },
  {
    h: 'Use the team score to fix the script',
    body: (
      <DsP>
        If one rep misses a checkpoint, coach the rep. If every rep misses the same checkpoint, the script is asking
        for something that does not fit a real call, so rewrite the checkpoint. A team-wide script score shows you
        which case you are in.
      </DsP>
    ),
  },
  {
    h: 'Listen live for new reps and new scripts',
    body: (
      <DsP>
        Recordings tell you about last week. In a new rep&apos;s first week, and on the day a script changes, sit in on
        live calls so the correction comes the same day. Listen without speaking, and whisper only a fact the rep is
        missing.
      </DsP>
    ),
  },
  {
    h: 'What you need from the dialer',
    body: (
      <>
        <DsList items={[
          <>Every call recorded, with its outcome.</>,
          <>A summary on each call, so choosing three takes minutes.</>,
          <>A transcript, to find the moment.</>,
          <>A score against your script, for the checkpoints.</>,
          <>A way to hear a live call.</>,
        ]} />
        <DsP>
          DialSheet has all five on Pro:{' '}
          <InlineLink href={answerPath('call-transcription-and-ai-summaries')}>transcripts, summaries and script scoring</InlineLink>,
          and <InlineLink href={answerPath('live-call-listening-and-whisper')}>live listening with whisper</InlineLink> for
          the team owner. The routine works with any dialer that gives you the same five, and it starts at{' '}
          <DialsheetLink placement="coaching-body" /> on one seat.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'How often should a manager coach cold calls?',
    a: 'Weekly, for each rep, in a short review. A week is long enough for a rep to try one change and short enough that the calls are still fresh.',
  },
  {
    q: 'How many calls should I review for each rep?',
    a: 'Three is enough to coach from: one that booked, one that reached the pitch and did not book, and one that ended in the first 30 seconds.',
  },
  {
    q: 'Should a manager listen to calls live or use recordings?',
    a: 'Both, for different jobs. Recordings and transcripts are for the weekly review. Live listening is for a new rep and for the day a script changes, when the correction should come the same day.',
  },
  {
    q: 'What does AI call scoring add to coaching?',
    a: 'It checks every recorded call against the checkpoints in your script, so you know which calls to open and which checkpoint a rep or the whole team keeps missing. A manager still decides what to coach.',
  },
  {
    q: 'How many things should I ask a rep to change at once?',
    a: 'One. Give the rep a single line to work on for the week and check only that line the next week.',
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
      placement="coaching"
      related={['sdr-quota-math', 'call-transcription-and-ai-summaries', 'live-call-listening-and-whisper']}
    />
  )
}
