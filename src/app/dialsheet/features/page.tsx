import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, FeatureList, InlineLink, dialsheetMetadata,
  type DsFaq, type DsSection, type Feature,
} from '@/components/DialsheetPartner'
import {
  DIALSHEET, DIALSHEET_FACTS_READ, DIALSHEET_PATH, LINE_PRICE_LINE,
} from '@/lib/dialsheet'

/* Everything DialSheet does, from dialsheet.io/llms.txt as read on the day in
   src/lib/dialsheet.ts. A feature carries a plan only where DialSheet ties it
   to one. Do not add a feature that is not in that file, and do not guess a
   plan. */

const SLUG = 'features'
const TITLE = 'Everything DialSheet Does, and Which Plan It Is On'
const STANDFIRST = `DialSheet is a power dialer and CRM that runs in a browser tab. This is what it does as of ${DIALSHEET_FACTS_READ}, grouped by the job each feature does, with the plan it is on.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const PRO = 'Pro'
const BOTH = 'Free and Pro'

const DIALING: Feature[] = [
  { name: 'Calling from the browser', plan: BOTH, text: 'Click a lead and the call goes out from your browser. No desk phone, and nothing to install.' },
  { name: 'Power Dial', plan: BOTH, text: 'It calls down your list and moves to the next lead when you finish a call.' },
  { name: 'Parallel dialer', plan: PRO, text: `It rings ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines at once, screens out voicemail and puts you on with the person who answers. On a DialSheet line it runs 2 lines from the first day and 3 once the carrier has verified your business.` },
  { name: 'Local presence', plan: PRO, text: "Power Dial rings each lead from the number you own in that lead's area code. US and Canada area codes." },
  { name: 'Number rotation', plan: PRO, text: "Each call goes out from the next number on your account, so a day's dials are spread across your numbers." },
  { name: 'Your script on screen', text: 'Your saved call script sits beside the dialer, and a Script button opens it large in the middle of the screen.' },
  { name: 'Your voice on missed callbacks', text: 'A lead who calls you back and reaches voicemail hears a greeting you recorded.' },
  { name: 'Dialpad', text: 'A keypad for phone menus and extensions during a call.' },
]

const CRM: Feature[] = [
  { name: 'CSV import', text: 'The columns map themselves. Each lead can hold three phone numbers, tags and a note, and duplicates are caught on the way in.' },
  { name: 'Filters and sorting', text: 'Filter your leads by tag, call outcome or time zone, and sort them by company.' },
  { name: 'Pipeline, tasks and callbacks', text: 'A deal pipeline, tasks and callback reminders on each lead.' },
  { name: 'Shared lead pools', text: 'A team works one pool of leads, with leads assigned to each rep.' },
  { name: 'Unlimited leads', plan: PRO, text: `The free plan holds a list of up to ${DIALSHEET.freeLeads} leads. Pro has no cap.` },
]

const AI: Feature[] = [
  { name: 'Transcripts', plan: PRO, text: 'Recorded calls are transcribed automatically.' },
  { name: 'Summaries and next steps', plan: PRO, text: 'Each recorded call gets a summary and the next step.' },
  { name: 'Script scoring', plan: PRO, text: 'You write a call script with checkpoints and banned phrases. Every recorded call is scored against it, with coaching notes for the rep and one score for the team. The score is advisory and never overrides the rep.' },
]

const TEAM: Feature[] = [
  { name: 'Live board', text: 'The Team page shows who is on a call right now, with the lead and a running clock.' },
  { name: 'Listen in and whisper', text: 'The team owner can listen to a live call and speak to the rep without the prospect hearing.' },
  { name: 'Leaderboard', text: 'It ranks the team over 7 or 30 days and exports as a CSV or a PNG.' },
  { name: 'A number for each rep', plan: PRO, text: "Pin one of the account's numbers to each rep." },
  { name: 'One dialer per seat', text: 'A seat is one person, and calling runs in one browser at a time.' },
]

const RULES: Feature[] = [
  { name: 'Do Not Call list', text: 'Upload the numbers you must not call. Every dial, text and CSV import is checked against the list first.' },
  { name: 'Recording switch', text: 'Call recording and AI summaries can be turned off for the account in Settings.' },
  { name: 'The law is still yours', text: 'DialSheet is software. You are responsible for the calling and call-recording rules where you dial.' },
]

const CONNECT: Feature[] = [
  { name: 'HubSpot', plan: PRO, text: "Calls and notes sync to the matching contact, and today's open HubSpot tasks can be pulled in as leads." },
  { name: 'Webhooks', text: 'A signed call.completed event posts each finished call, with its transcript and summary, to GoHighLevel, Zapier or Make.' },
  { name: 'REST API and MCP server', plan: PRO, text: 'Read and write leads, calls, tasks and the pipeline from your own code or from an AI agent.' },
  { name: 'Texts', plan: PRO, text: 'Send SMS from the lead page and the dialer on your own Twilio account. US numbers need A2P 10DLC registration.' },
  { name: 'Sequences', plan: PRO, text: 'Email, call and task steps with a daily limit. A reply stops the sequence.' },
]

const sections: DsSection[] = [
  {
    h: 'Dialing',
    body: (
      <>
        <DsP>
          The dialer is the product. Everything else on this page exists so that the next call starts the moment the
          last one ends.
        </DsP>
        <FeatureList items={DIALING} />
      </>
    ),
  },
  { h: 'Your list and CRM', body: <FeatureList items={CRM} /> },
  { h: 'AI call notes', body: <FeatureList items={AI} /> },
  { h: 'For teams', body: <FeatureList items={TEAM} /> },
  { h: 'Staying inside the calling rules', body: <FeatureList items={RULES} /> },
  { h: 'Connecting it to other tools', body: <FeatureList items={CONNECT} /> },
  {
    h: 'What it costs',
    body: (
      <>
        <DsList items={[
          <>Free: $0 for one person, with up to {DIALSHEET.freeLeads} leads and {DIALSHEET.freeCallsPerMonth} calls a month.</>,
          <>Pro: ${DIALSHEET.proUsd} a month for the first seat and for each teammate, or ${DIALSHEET.proAnnualUsd} a year for the first seat.</>,
          <>A DialSheet line, with a local number, {DIALSHEET.lineMinutes.toLocaleString('en-US')} minutes a month and Pro for the line&apos;s owner: {LINE_PRICE_LINE}, or ${DIALSHEET.lineAnnualUsd} a year. US and Canada.</>,
          <>Your own Twilio account: about ${DIALSHEET.twilioPerMinuteUsd} a minute for US calls and about ${DIALSHEET.twilioNumberUsd} a month per number, billed by Twilio.</>,
        ]} />
        <DsP>
          <InlineLink href={`${DIALSHEET_PATH}/best-affordable-power-dialer`}>Our pick for an affordable dialer</InlineLink>{' '}
          sets these prices beside ten other dialers, and <DialsheetLink placement="features-pricing" path="/pricing" />{' '}
          has today&apos;s.
        </DsP>
      </>
    ),
  },
  {
    h: 'What it does not do',
    body: (
      <DsList items={[
        <>Predictive dialing for large floors. It has a power dialer and a parallel dialer of up to {DIALSHEET.parallelMax} lines.</>,
        <>Branded caller ID, number-health scoring or a rented number pool. It rotates calls across numbers you own.</>,
        <>A managed phone line outside the US and Canada. Elsewhere you connect your own Twilio account.</>,
      ]} />
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'What is DialSheet?',
    a: 'DialSheet is a browser-based power dialer and CRM for outbound sales. You upload a list, and it calls down the list for you while keeping notes, tasks and callbacks on each lead.',
  },
  {
    q: 'Which DialSheet features are on the free plan?',
    a: `Calling from the browser and Power Dial, for one person with a list of up to ${DIALSHEET.freeLeads} leads and ${DIALSHEET.freeCallsPerMonth} calls a month. The parallel dialer, local presence, number rotation and AI call notes are on Pro.`,
  },
  {
    q: 'Does DialSheet have a parallel dialer?',
    a: `Yes, on Pro. It rings ${DIALSHEET.parallelMin} to ${DIALSHEET.parallelMax} lines at once and screens out voicemail.`,
  },
  {
    q: 'Does DialSheet record and transcribe calls?',
    a: 'On Pro, recorded calls are transcribed and each one gets an AI summary and a next step. Recording and AI summaries can be switched off for the account.',
  },
  {
    q: 'Does DialSheet work with HubSpot?',
    a: 'Yes, on Pro. Calls and notes sync to the matching HubSpot contact, and open HubSpot tasks can be pulled in as leads.',
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
      placement="features"
    />
  )
}
