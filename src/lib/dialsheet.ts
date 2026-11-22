/* DialSheet, the site's calling partner.

   Every page and email that mentions DialSheet reads its numbers and links
   here, so a price is written once. The figures are DialSheet's own, read
   from dialsheet.io/pricing and dialsheet.io/llms.txt on November 22, 2026.

   Two things to recheck on a date:
   - Dec 7, 2026: a DialSheet line goes from $49 to $59 for new buyers
     (LINE_RISE below). The copy states both prices, so it stays true either
     side of the day, but reread dialsheet.io/pricing then.
   - Whenever DialSheet changes its Pro price: PRO_USD and the worked sums. */

export const DIALSHEET_PATH = '/dialsheet'
export const DIALSHEET_FACTS_READ = 'November 22, 2026'
export const DIALSHEET_FACTS_READ_ISO = '2026-11-22'

export const DIALSHEET = {
  name: 'DialSheet',
  url: 'https://www.dialsheet.io',
  /** Free plan: one person. */
  freeLeads: 500,
  freeCallsPerMonth: 500,
  /** Pro: the same price for the first seat and for every teammate. */
  proUsd: 29,
  proAnnualUsd: 290,
  /** Parallel dialer lines on Pro with your own Twilio account. */
  parallelMin: 2,
  parallelMax: 5,
  /** A DialSheet line: number, minutes and Pro on one bill. US and Canada. */
  lineUsd: 49,
  lineUsdAfterRise: 59,
  lineAnnualUsd: 490,
  lineMinutes: 1500,
  /** Twilio's own rates on a bring-your-own account, as DialSheet publishes them. */
  twilioPerMinuteUsd: 0.014,
  twilioNumberUsd: 1.15,
}

/** The day new DialSheet lines cost more. A line started before it keeps its price. */
export const LINE_RISE_LABEL = 'December 7, 2026'

/** "$49 a month if you start before December 7, 2026, and $59 after". True on any date. */
export const LINE_PRICE_LINE =
  `$${DIALSHEET.lineUsd} a month if you start before ${LINE_RISE_LABEL}, and $${DIALSHEET.lineUsdAfterRise} after`

/** What a team pays for software each month: every seat is the same price. */
export function proTeamUsd(seats: number): number {
  return seats * DIALSHEET.proUsd
}

/** A DialSheet link that says where on this site it was clicked. */
export function dialsheetHref(placement: string, path = '/'): string {
  return `${DIALSHEET.url}${path}?utm_source=aifilmcontests&utm_medium=site&utm_campaign=${encodeURIComponent(placement)}`
}

/** The same, for links inside emails. */
export function dialsheetEmailHref(placement: string): string {
  return `${DIALSHEET.url}/?utm_source=aifilmcontests&utm_medium=email&utm_campaign=${encodeURIComponent(placement)}`
}

/** Who writes the client-getting guides. The words are his own. */
export const ABHI = {
  name: 'Abhi Chawla',
  url: 'https://www.linkedin.com/in/abhixchawla',
  note: 'Made over 100K cold calls in a year as a sales rep, then ran an agency that called for other companies to book them meetings.',
}

/* A perk for readers of this site, if DialSheet sets one up. Leave it null
   until the code exists in DialSheet's Stripe and its checkout accepts it:
   a printed code that fails at checkout is worse than no code. When it is
   real, fill this in and the hub page and the pack email both print it. */
export interface DialsheetPerk {
  code: string
  /** Shown as written, e.g. "20% off your first year on annual billing". */
  offer: string
  /** ISO day the code stops working, if it does. */
  ends?: string
}
export const DIALSHEET_PERK: DialsheetPerk | null = null

/** The pages in the DialSheet section, in the order the hub lists them. */
export const DIALSHEET_PAGES = [
  {
    path: `${DIALSHEET_PATH}/best-affordable-power-dialer`,
    title: 'The best affordable power dialer',
    blurb: 'What a small sales team pays for a dialer in 2026, and why our pick is DialSheet.',
  },
  {
    path: `${DIALSHEET_PATH}/features`,
    title: 'Everything DialSheet does',
    blurb: 'The dialer, the lead list, the AI call notes and the team tools, with the plan each one is on.',
  },
  {
    path: `${DIALSHEET_PATH}/for-sales-teams`,
    title: 'For team owners and managers',
    blurb: 'What changes for the person who pays for the seats and has to coach the calls.',
  },
] as const

export const CLIENT_GUIDES = [
  {
    path: '/guide/how-ai-filmmakers-get-commercial-clients',
    title: 'How AI filmmakers get commercial clients',
    blurb: 'A weekly system: one kind of brand, one spec piece and a list of 50 to call.',
  },
  {
    path: '/guide/cold-call-script-for-ai-video-work',
    title: 'A cold call script for AI video work',
    blurb: 'The opener, the pitch, the ask and what to say to the four answers you will hear.',
  },
  {
    path: '/guide/follow-up-cadence-after-pitching-a-brand',
    title: 'The follow-up cadence after you pitch a brand',
    blurb: 'Seven touches over fourteen days, with the words for each one.',
  },
] as const
