import type { Metadata } from 'next'
import {
  COLLAB_ART, DialsheetArticle, DialsheetLink, DsList, DsP, InlineLink, dialsheetMetadata,
  type DsFaq, type DsSection,
} from '@/components/DialsheetPartner'
import {
  DIALSHEET, DIALSHEET_FACTS_READ, DIALSHEET_PATH, LINE_PRICE_LINE, proTeamUsd,
} from '@/lib/dialsheet'

/* For the person who pays for the seats and coaches the calls. Each section
   says what DialSheet does, as DialSheet describes it (dialsheet.io/llms.txt,
   read on the day in src/lib/dialsheet.ts). No results are promised: the page
   describes how the tool works and leaves the outcome to the team. */

const SLUG = 'for-sales-teams'
const TITLE = 'DialSheet for Team Owners and Sales Managers'
const STANDFIRST = `If you pay for the seats and coach the calls, you want to know what the bill is, how reps get through more of the list, and whether you can hear what they say. This is how DialSheet answers each, with its prices as of ${DIALSHEET_FACTS_READ}.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const sections: DsSection[] = [
  {
    h: `The bill is your seat count times $${DIALSHEET.proUsd}`,
    body: (
      <>
        <DsP>
          Every seat on Pro costs ${DIALSHEET.proUsd} a month, the first one and each teammate. A team of 6 pays 
          ${proTeamUsd(6)} a month and a team of 10 pays ${proTeamUsd(10)}. There is no seat minimum and no contract, so
          a rep you add for one month costs ${DIALSHEET.proUsd}.
        </DsP>
        <DsP>
          The phone line is billed separately. On your own Twilio account you pay Twilio about 
          ${DIALSHEET.twilioPerMinuteUsd} a minute for US calls and ${DIALSHEET.twilioNumberUsd} a month per number. If
          you would rather have one bill, a DialSheet line includes a local number, {DIALSHEET.lineMinutes.toLocaleString('en-US')}{' '}
          minutes a month and Pro for the line&apos;s owner: {LINE_PRICE_LINE}, with teammates at ${DIALSHEET.proUsd} each.
        </DsP>
        <DsP>
          The rate you join at stays for as long as you subscribe. DialSheet raised Pro from $19 to ${DIALSHEET.proUsd} in
          August 2026, and it says subscribers who joined at $19 still pay $19.
        </DsP>
      </>
    ),
  },
  {
    h: 'Reps get through more of the list',
    body: (
      <>
        <DsP>
          On a manual phone, a rep dials, waits through the rings and sits through a voicemail greeting before every
          conversation. DialSheet takes those steps away from the rep.
        </DsP>
        <DsList items={[
          <>Power Dial calls the next lead as soon as a call ends.</>,
          <>The parallel dialer, part of Pro, rings {DIALSHEET.parallelMin} to {DIALSHEET.parallelMax} numbers at once, screens out voicemail and puts the rep on with the person who picks up.</>,
          <>Local presence rings each lead from a number you own in the lead&apos;s area code.</>,
          <>Number rotation spreads a day&apos;s dials across your numbers.</>,
        ]} />
      </>
    ),
  },
  {
    h: 'You can hear the calls as they happen',
    body: (
      <DsP>
        The Team page shows who is on a call right now, which lead they are talking to and for how long. As the team
        owner you can listen to a live call and whisper to the rep without the prospect hearing you.
      </DsP>
    ),
  },
  {
    h: 'Every recorded call is scored against your script',
    body: (
      <DsP>
        Write the call script once, with the checkpoints a rep must hit and the phrases they must not use. DialSheet
        transcribes each recorded call, scores it against the script and writes coaching notes for the rep. You get one
        script score for the whole team. The scoring is advisory and never overrides the rep.
      </DsP>
    ),
  },
  {
    h: 'One list, shared across the team',
    body: (
      <DsP>
        Import one CSV into a shared pool and assign leads to each rep. The leaderboard ranks the team over 7 or 30
        days and exports as a CSV or a picture. The Do Not Call list is checked before every dial, every text and every
        import.
      </DsP>
    ),
  },
  {
    h: 'Your numbers and recordings stay yours',
    body: (
      <DsP>
        On your own Twilio account, the phone numbers, the call recordings and the data belong to you. Calls and notes
        sync to HubSpot on Pro, a webhook posts every finished call to GoHighLevel, Zapier or Make, and the leads
        export as a CSV.
      </DsP>
    ),
  },
  {
    h: 'Where it is the wrong tool',
    body: (
      <>
        <DsList items={[
          <>Three or more reps who each make more than about 70 dials a day. DialSheet&apos;s own cost page says a plan with bundled minutes costs less at that volume.</>,
          <>A floor of 20 or more agents on predictive campaigns.</>,
          <>A team that needs branded caller ID or number-health scoring.</>,
          <>A team outside the US and Canada that does not want its own Twilio account.</>,
        ]} />
        <DsP>
          For everyone else, <InlineLink href={`${DIALSHEET_PATH}/best-affordable-power-dialer`}>our pick for an affordable dialer</InlineLink>{' '}
          has the price comparison, and the <InlineLink href={`${DIALSHEET_PATH}/features`}>feature list</InlineLink> shows
          which plan each feature is on. Start a seat at <DialsheetLink placement="teams-body" /> and add the team once
          the first rep has dialed a list.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'How much is DialSheet for a team of 5?',
    a: `$${proTeamUsd(5)} a month for software on Pro, at $${DIALSHEET.proUsd} a seat. DialSheet's own cost page puts five reps at about $195 a month all-in, at roughly 34 dials a rep a day on their own Twilio account.`,
  },
  {
    q: 'Is there a seat minimum or a contract?',
    a: `No. You can start with one seat, add teammates at $${DIALSHEET.proUsd} each and cancel month to month.`,
  },
  {
    q: 'Can a manager listen to live calls in DialSheet?',
    a: 'Yes. The team owner can listen in on a live call and whisper to the rep without the prospect hearing.',
  },
  {
    q: 'Does DialSheet score calls against a script?',
    a: 'Yes, on Pro. Admins write a script with checkpoints and banned phrases, and every recorded call is scored against it with coaching notes for the rep and a team-wide score.',
  },
  {
    q: 'Does DialSheet replace our CRM?',
    a: 'It has its own CRM with tags, a deal pipeline, tasks and callback reminders, and on Pro it syncs calls and notes to HubSpot.',
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
      placement="teams"
      art={COLLAB_ART.team}
    />
  )
}
