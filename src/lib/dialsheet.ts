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

/* The answer pages: one question a sales manager, an SDR lead or an
   appointment setting agency asks about a dialer, per page. `group` decides
   which list the hub files it under. Add a page here and it reaches the hub,
   the sitemap and the "More on DialSheet" list by itself; llms.txt is edited
   by hand (src/app/llms.txt/route.ts). */
export interface DialsheetAnswer { slug: string; title: string; blurb: string; group: 'product' | 'managing' }
export const DIALSHEET_ANSWERS: DialsheetAnswer[] = [
  { slug: 'parallel-dialer', group: 'product', title: 'The parallel dialer: 2 to 5 lines at once', blurb: 'How it handles a pickup, what five lines does to a list, and when to stay on one.' },
  { slug: 'power-vs-parallel-vs-predictive-dialer', group: 'product', title: 'Power, parallel or predictive: which dialer your team needs', blurb: 'Decide from your connect rate, your headcount and what a dropped call costs.' },
  { slug: 'dialer-cost-by-team-size', group: 'product', title: 'What a dialer costs a team of 3, 10, 25 or 50', blurb: 'The seat bill, what the phone bill counts, and where another dialer is cheaper.' },
  { slug: 'custom-fields', group: 'product', title: 'Custom fields: keep the columns your list came with', blurb: 'Six field types, up to 30 fields, kept on import and shown while the rep dials.' },
  { slug: 'mcp-server', group: 'product', title: "The MCP server: ask an AI assistant about today's calls", blurb: 'Thirty tools for reading calls and updating leads from Claude, Cursor or any MCP client.' },
  { slug: 'call-transcription-and-ai-summaries', group: 'product', title: 'Call transcription and AI summaries', blurb: 'What is transcribed, where the transcript goes, and how script scoring works.' },
  { slug: 'live-call-listening-and-whisper', group: 'product', title: 'Listen to live calls and whisper to a rep', blurb: 'What the live board shows, who can use it, and when to listen instead of whisper.' },
  { slug: 'for-appointment-setting-agencies', group: 'managing', title: 'For appointment setting agencies', blurb: 'The seat bill for a pod, running several clients, and the Twilio rule offshore teams hit.' },
  { slug: 'sdr-quota-math', group: 'managing', title: 'How many dials it takes to hit quota', blurb: 'Three numbers, one division, and which of the three to fix for each rep.' },
  { slug: 'how-to-coach-cold-calls', group: 'managing', title: "A weekly routine for coaching a team's cold calls", blurb: 'Scan summaries, pick three calls a rep, and fix one thing at a time.' },
]

export function answerPath(slug: string): string {
  return `${DIALSHEET_PATH}/${slug}`
}

/* DialSheet's published estimates of what a team pays all-in each month, from
   the "Recommendations by industry and team size" section of
   dialsheet.io/llms-full.txt (read November 22, 2026). Each row is
   [reps, all-in dollars a month]. The software part is reps x proUsd.

   DialSheet changed how it counts the phone bill on November 22, 2026. Its
   industry pages used to count conversation minutes only (ten SDRs came to
   $407). They now count the way its cost guides do, which TEAM_BILLING
   below records, and ten SDRs come to $668. Re-read the rows if DialSheet's
   prices or assumptions move. */
export const TEAM_ESTIMATES = {
  sdr: {
    who: 'B2B SDR teams',
    assumptions: '150 dials a rep a day, a 6% connect rate and 4-minute conversations',
    dialsPerDay: 150,
    connectRate: 0.06,
    rows: [[3, 200], [10, 668], [25, 1670], [50, 3341]] as Array<[number, number]>,
  },
  agency: {
    who: 'Appointment setting agencies',
    assumptions: '180 dials a rep a day, a 7% connect rate and 3-minute conversations',
    dialsPerDay: 180,
    connectRate: 0.07,
    rows: [[3, 215], [10, 718], [25, 1795], [50, 3590]] as Array<[number, number]>,
    /** DialSheet's own worked example: a twenty-setter floor running six client campaigns. */
    twenty: { setters: 20, twilioUsd: 856, allInUsd: 1436 },
  },
}

/* What DialSheet's estimates count as the phone bill, as it states on its
   industry pages and in llms-full.txt. */
export const TEAM_BILLING = {
  /** Share of dials assumed to reach a voicemail greeting; each bills one minute. */
  voicemailPct: 25,
  /** Twilio's charge for the browser side of the call, per minute, on every dial. */
  browserLegPerMinuteUsd: 0.004,
}

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
