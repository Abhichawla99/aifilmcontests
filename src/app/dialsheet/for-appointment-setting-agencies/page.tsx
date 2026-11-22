import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsList, DsP, DsTable, InlineLink, dialsheetMetadata, type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import { DIALSHEET, TEAM_ESTIMATES, answerPath, proTeamUsd } from '@/lib/dialsheet'

/* For appointment setting and lead generation agencies. Sources:
   dialsheet.io/llms-full.txt ("B2B appointment setting agencies"), its
   agencies page, and the Twilio rule as DialSheet states it in llms.txt
   (Twilio error docs 21216 and 13225). The page does not say how an agency
   should split clients across phone accounts beyond that rule, because
   DialSheet does not publish it. */

const SLUG = 'for-appointment-setting-agencies'
const TITLE = 'DialSheet for Appointment Setting Agencies'
const STANDFIRST = `An appointment setting agency grows by adding setters, so per-seat software grows with every client it wins. DialSheet charges $${DIALSHEET.proUsd} a setter with no seat minimum, includes a parallel dialer, and posts every finished call to the systems your clients use. This page covers the bill for a pod, running several clients, and a Twilio rule that offshore teams run into.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const agency = TEAM_ESTIMATES.agency

const sections: DsSection[] = [
  {
    h: 'The bill for a pod',
    body: (
      <>
        <DsP>
          Ten setters are ${proTeamUsd(10)} a month and twenty are ${proTeamUsd(20)}. DialSheet estimates about{' '}
          {usd(agency.twenty.twilioUsd)} of Twilio usage on top for a twenty-setter floor running six client
          campaigns, which is about {usd(agency.twenty.allInUsd)} all-in. It puts the same headcount on a $100 to $150
          a seat platform at $2,000 to $3,000 a month.
        </DsP>
        <DsTable
          figures
          head={['Pod', 'Software a month', 'All-in, DialSheet estimate']}
          rows={agency.rows.map(([reps, allIn]) => [`${reps} setters`, usd(proTeamUsd(reps)), `${usd(allIn)} a month`])}
        />
        <DsP>
          The all-in column assumes {agency.assumptions}. It counts the conversations, a minute for each voicemail
          pickup, and the browser leg on every dial.{' '}
          <InlineLink href={answerPath('dialer-cost-by-team-size')}>The cost page</InlineLink> shows how the phone bill
          is counted and the volume at which a plan with bundled minutes is cheaper.
        </DsP>
        <DsP>
          A setter you add for one client&apos;s three-month campaign costs ${DIALSHEET.proUsd} a month for those three
          months. There is no contract and no seat minimum.
        </DsP>
      </>
    ),
  },
  {
    h: 'Running several clients at once',
    body: (
      <DsList items={[
        <>Lists: import each client&apos;s list, tag it, and assign leads to the setters on that campaign from a shared pool.</>,
        <>Client columns: <InlineLink href={answerPath('custom-fields')}>custom fields</InlineLink> keep the columns a client&apos;s list came with, such as policy type or territory, and show them while the setter dials.</>,
        <>Script: the saved call script sits beside the dialer on every call.</>,
        <>Dialing: the <InlineLink href={answerPath('parallel-dialer')}>parallel dialer</InlineLink> is in the seat price, at {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} lines.</>,
        <>Do Not Call: the list blocks a number across the whole account. A number one client asks you to suppress is blocked on every campaign, so keep that in mind when two clients share a market.</>,
      ]} />
    ),
  },
  {
    h: 'Getting the appointment to the client',
    body: (
      <DsList items={[
        <>Webhook: one signed event, call.completed, posts each finished call with its outcome, notes, transcript and AI summary. Point it at GoHighLevel, Zapier or Make and the client&apos;s system gets the result as the call ends.</>,
        <>HubSpot: on Pro, calls and notes go to the matching contact with the outcome, the duration and the AI summary. Each rep connects their own HubSpot account. It does not create contacts or sync deals.</>,
        <>Reports: the leaderboard covers 7 days, 30 days or a custom range and exports as a CSV or an image.</>,
        <>Salesforce: there is no pre-built connector. Use the webhook or the REST API.</>,
      ]} />
    ),
  },
  {
    h: 'Quality checks without sitting on every call',
    body: (
      <DsP>
        Recordings carry no extra charge. On Pro each recorded call is{' '}
        <InlineLink href={answerPath('call-transcription-and-ai-summaries')}>transcribed, summarized and scored against a script</InlineLink>,
        and the team owner can <InlineLink href={answerPath('live-call-listening-and-whisper')}>listen to a live call and whisper to the setter</InlineLink>.
        When a client asks what was said on a booked call, the transcript is on the call record.
      </DsP>
    ),
  },
  {
    h: 'Offshore setters and US numbers',
    body: (
      <>
        <DsP>
          Since October 8, 2025, a Twilio account created outside the US or Canada cannot call +1 numbers until a
          Business Primary Customer Profile is approved, and Twilio support cannot waive it. An account created in the
          US has no such gate.
        </DsP>
        <DsP>
          DialSheet&apos;s advice for an offshore agency or VA team is to dial from the US client&apos;s own Twilio
          account, with seats in the dialer, and not from an account of the agency&apos;s own. Sort this out before
          the campaign start date, because the approval is Twilio&apos;s and it takes as long as it takes.
        </DsP>
      </>
    ),
  },
  {
    h: 'The rules do not move to the client',
    body: (
      <DsP>
        Dialing on a client&apos;s behalf does not put all the liability on the client. Business-to-business calls
        sit outside the residential focus of the US Do Not Call Registry, and consumer campaigns do not. UK campaigns
        need TPS and CTPS screening. Calling into several industries means several sets of rules at once, so get
        advice for each campaign. This page is orientation and not legal advice.
      </DsP>
    ),
  },
  {
    h: 'Where it is the wrong tool',
    body: (
      <>
        <DsList items={[
          <>A floor of 20 or more agents on predictive campaigns.</>,
          <>A client contract that requires a native Salesforce integration.</>,
          <>An operation that needs contact-centre features such as skills-based routing, workforce management or 24/7 phone support.</>,
        ]} />
        <DsP>
          For a pod of setters on outbound lists, trial one seat free at <DialsheetLink placement="agencies-body" />{' '}
          before you move a client over.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'What is the best dialer for an appointment setting agency?',
    a: `Our pick is DialSheet for pods that want low seat costs and a parallel dialer. Each setter is $${DIALSHEET.proUsd} a month with no seat minimum, and every finished call can post to a client's GoHighLevel, Zapier or Make. For floors of 20 or more on predictive campaigns, DialSheet's own pages point to Convoso.`,
  },
  {
    q: 'How much does DialSheet cost for 20 setters?',
    a: `$${proTeamUsd(20)} a month for software. DialSheet estimates about ${usd(agency.twenty.twilioUsd)} a month of Twilio usage on top for a twenty-setter floor running six campaigns, which is about ${usd(agency.twenty.allInUsd)} all-in.`,
  },
  {
    q: 'Can DialSheet send booked appointments to GoHighLevel?',
    a: 'Yes. A signed call.completed webhook posts each finished call with its outcome, notes, transcript and AI summary to GoHighLevel, Zapier or Make.',
  },
  {
    q: 'Can an offshore team call US numbers through DialSheet?',
    a: "Yes, but mind Twilio's rule. A Twilio account created outside the US or Canada cannot call +1 numbers until its Business Primary Customer Profile is approved. DialSheet advises offshore teams to dial from the US client's own Twilio account with seats in the dialer.",
  },
  {
    q: 'Does the Do Not Call list work per client?',
    a: 'No. The Do Not Call list blocks a number across the whole account, on every campaign.',
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
      placement="agencies"
      related={['dialer-cost-by-team-size', 'parallel-dialer', 'custom-fields', 'sdr-quota-math']}
    />
  )
}
