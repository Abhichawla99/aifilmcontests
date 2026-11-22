import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, answerPath } from '@/lib/dialsheet'

/* Transcription, summaries and script scoring. Facts from
   dialsheet.io/llms.txt and llms-full.txt: Pro, Whisper transcription of
   recorded calls, summaries with next steps, script scoring that is advisory,
   no charge for recordings, a per-account switch, and what HubSpot and the
   webhook do and do not receive. */

const SLUG = 'call-transcription-and-ai-summaries'
const TITLE = 'Call Transcription and AI Summaries in DialSheet'
const STANDFIRST = `On Pro, DialSheet transcribes every recorded call, writes a summary with the next step, and scores the call against your script. There is no extra charge for recordings. Here is what a manager gets from it, where the transcript can go, and what stays your job.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sections: DsSection[] = [
  {
    h: 'What happens after a call',
    body: (
      <>
        <DsList items={[
          <>The recording is transcribed automatically.</>,
          <>The call gets a written summary and a next step.</>,
          <>If you have set up a script, the call is scored against it and the rep gets coaching notes.</>,
        ]} />
        <DsP>
          All three are on Pro at ${DIALSHEET.proUsd} a seat a month. A call nobody answered has no transcript and no
          summary, only a status.
        </DsP>
      </>
    ),
  },
  {
    h: 'How script scoring works',
    body: (
      <>
        <DsP>
          An admin writes the call script once, with the checkpoints a rep should hit and the phrases a rep must not
          use. Every recorded call is then scored two ways: keywords are matched exactly, and the rest is judged on
          meaning.
        </DsP>
        <DsP>
          Each call carries its own coaching notes, and the team gets one script score across all reps. The score is
          advisory. It never changes the outcome the rep logged.
        </DsP>
      </>
    ),
  },
  {
    h: 'Where the transcript can go',
    body: (
      <DsList items={[
        <>The call record in DialSheet, beside the notes and the outcome.</>,
        <>The REST API, where calls can be filtered by day and a daily recap endpoint groups the day by prospect.</>,
        <><InlineLink href={answerPath('mcp-server')}>The MCP server</InlineLink>, so an AI assistant can read a day of calls and write the recap.</>,
        <>A webhook. One signed event, call.completed, posts each finished call with its transcript, summary, outcome and notes to GoHighLevel, Zapier or Make.</>,
        <>HubSpot, in part. The matching contact gets the outcome, the duration, the AI summary and the next step. Recordings and full transcripts are not sent.</>,
      ]} />
    ),
  },
  {
    h: 'What a manager does with it',
    body: (
      <>
        <DsP>
          Summaries let you scan a day of calls without playing each recording. Open the transcript only for the calls
          worth your time, find the minute that matters, and listen to that minute.
        </DsP>
        <DsP>
          The team score tells you about the script as much as the reps. If every rep misses the same checkpoint,
          rewrite the checkpoint. <InlineLink href={answerPath('how-to-coach-cold-calls')}>The weekly coaching routine</InlineLink>{' '}
          is built on this.
        </DsP>
      </>
    ),
  },
  {
    h: 'Consent, and how to switch it off',
    body: (
      <>
        <DsP>
          Recording a call is regulated, and the rules differ by state and by country. Some places require every
          person on the call to agree. DialSheet is software, and following those rules is your responsibility.
        </DsP>
        <DsP>
          Recording and AI summaries can be switched off for the whole account under Settings, Privacy. With recording
          off there is nothing to transcribe or score. The setting is in every account at{' '}
          <DialsheetLink placement="transcription-body" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'Does DialSheet transcribe calls?',
    a: `Yes, on Pro at $${DIALSHEET.proUsd} a seat a month. Recorded calls are transcribed automatically, and each one gets an AI summary and a next step.`,
  },
  {
    q: 'Does DialSheet charge extra for call recording?',
    a: 'No. DialSheet does not charge for call recordings.',
  },
  {
    q: 'Does DialSheet score calls against a script?',
    a: 'Yes, on Pro. An admin defines a script with checkpoints and banned phrases, and every recorded call is scored against it with coaching notes for the rep and one score for the team. The score is advisory.',
  },
  {
    q: 'Can I send call transcripts to another system?',
    a: 'Yes. Transcripts are available through the REST API and the MCP server, and a call.completed webhook posts each finished call with its transcript and summary to tools such as GoHighLevel, Zapier or Make.',
  },
  {
    q: 'Can call recording be turned off?',
    a: 'Yes. Call recording and AI summaries can be switched off for the account in Settings, under Privacy.',
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
      placement="transcription"
      related={['how-to-coach-cold-calls', 'live-call-listening-and-whisper', 'mcp-server']}
    />
  )
}
