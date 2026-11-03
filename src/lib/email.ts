import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'
import { isMissingRelation, withDbRetry, type DbRetryOptions } from './db-health'
import { COMMUNITY, GUIDE, OFFER_ENDS_LABEL, OVERS, OVERS_OFF_PERCENT, offerDaysLeft, offerOpen } from './creator-pack'

const FROM_EMAIL = process.env.FROM_EMAIL || 'contests@updates.aifilmcontests.com'
const REPLY_TO   = process.env.REPLY_TO_EMAIL || 'hello@aifilmcontests.com'
const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** A subscriber we can email. `token` makes the unsubscribe link one-click. */
export interface Recipient {
  email: string
  token?: string | null
  name?: string | null
}

export type EmailKind =
  | 'welcome' | 'confirm' | 'pack' | 'new_contest' | 'closing_soon' | 'weekly_digest' | 'pulse'
  | 'reminder_7day' | 'outreach' | 'report' | 'custom'

export interface ContestEmailItem {
  id?: string
  name: string
  organizer: string
  prize: string
  deadline: string
  url: string
  description: string
  daysLeft?: number
  isNew?: boolean
}

export interface SendResult {
  success: boolean
  sent: number
  failed: number
  quotaExceeded?: boolean
  error?: unknown
  /** A batch went out but email_sends wouldn't take the record, so sending stopped there. */
  recordFailed?: boolean
  /** Rows for emails that went out but aren't in email_sends yet. Record them or these people get it twice. */
  unrecorded?: SendLogRow[]
  /** Addresses dropped before sending because Resend would refuse them; they get unconfirmed. */
  dropped?: string[]
}

export interface SendLogRow {
  email_type: string
  recipient: string
  subject: string
  resend_email_id: string | null
  contest_ids: string[] | null
}

function normalizeRecipients(subs: Array<string | Recipient>): Recipient[] {
  return subs
    .map(s => (typeof s === 'string' ? { email: s } : s))
    .filter(r => !!r.email)
}

// ─── Deliverability headers ───────────────────────────────────────────────────
//
// List-Unsubscribe      — tells Gmail/Outlook this is a legitimate list email
//                         and surfaces the native "Unsubscribe" button
// List-Unsubscribe-Post — RFC 8058: Gmail POSTs "List-Unsubscribe=One-Click"
//                         to the URL. Our /api/unsubscribe needs ?token=… for
//                         that to work, which is why every email is now built
//                         PER RECIPIENT instead of bcc-blasted.

function listUnsubscribeHeaders(unsubUrl: string) {
  return {
    'List-Unsubscribe': `<${unsubUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'X-Entity-Ref-ID': `aifilmcontests-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
}

function unsubscribeUrl(token?: string | null) {
  return token
    ? `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`
    : `${SITE_URL}/unsubscribe`
}

// ─── Shared styles: the editorial look ────────────────────────────────────────
//
// Every email reads like a page from a film magazine: warm paper, a serif
// masthead and headlines, hairline rules, and the contests as a numbered index
// with the deadline on the right. One accent colour, kept for what's urgent and
// for links. A photograph goes at the top of the welcome and spotlight once
// Abhi has art-directed one (EMAIL_ART); until then they open on type alone.

const T = {
  paper: '#F4F0E8',   // the page
  panel: '#EAE4D8',   // the Overs offer
  ink: '#16140F',
  inkSoft: '#57524A',
  faint: '#8E887B',
  rule: '#D6CEBE',
  accent: '#B3361F',  // urgent, new, links
}
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif`
const DISPLAY = `'Instrument Serif',Georgia,'Times New Roman',serif`
const SERIF = `Georgia,'Times New Roman',serif`

/** Pictures for the emails. Abhi art-directs these; an unset one is left out. */
type EmailArt = { src: string; alt: string; caption?: string }
const EMAIL_ART: Record<'welcome' | 'spotlight' | 'overs', EmailArt | null> = {
  welcome: null,
  spotlight: null,
  overs: null,
}

const emailBase = `background-color:${T.paper};color:${T.ink};font-family:${FONT};margin:0;padding:0;`
const wrap = `max-width:600px;margin:0 auto;padding:28px 20px 44px;`
/** Small spaced capitals for labels. */
const caps = (color: string, size = 10) =>
  `font-family:${FONT};font-size:${size}px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${color};`
const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${T.ink};color:${T.paper};text-decoration:none;padding:15px 28px;${caps(T.paper, 11)}">${label}</a>`
const textLink = (href: string, label: string, color = T.accent) =>
  `<a href="${href}" style="${caps(color, 11)}text-decoration:none;">${label}</a>`

function footer(unsubscribeLink: string) {
  const link = (href: string, label: string) => `<a href="${href}" style="color:${T.inkSoft};text-decoration:underline;">${label}</a>`
  return `
    <div style="margin-top:48px;border-top:1px solid ${T.ink};padding-top:20px;">
      <div style="${caps(T.ink, 11)}">AI Film Contests</div>
      <div style="font-family:${SERIF};font-style:italic;color:${T.inkSoft};font-size:15px;margin:6px 0 14px;">Every AI film contest, checked every day.</div>
      <div style="font-size:13px;line-height:1.8;color:${T.inkSoft};">
        ${link(SITE_URL, 'Open contests')} &nbsp;·&nbsp; ${link(`${SITE_URL}${GUIDE.path}`, 'The guide')} &nbsp;·&nbsp; ${link(COMMUNITY.url, COMMUNITY.name)}
      </div>
      <div style="color:${T.faint};font-size:12px;line-height:1.7;margin-top:14px;">
        You're getting this because you signed up at aifilmcontests.com.
        <a href="${unsubscribeLink}" style="color:${T.faint};text-decoration:underline;">Unsubscribe</a>
      </div>
    </div>
  `
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fmtDate(d: string) {
  // Deadlines are dates (2026-11-20), which parse as UTC midnight; read them in UTC or they show a day early.
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/** "Nov 20", the deadline in the index. */
function shortDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function trimTo(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.\s]+$/, '') + '…'
}

/** A full-width photograph with an optional caption under it. */
function picture(art: EmailArt | null, margin = '0 0 28px 0') {
  if (!art) return ''
  return `
  <div style="margin:${margin};">
    <img src="${art.src}" alt="${escapeHtml(art.alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
    ${art.caption ? `<div style="font-family:${SERIF};font-style:italic;font-size:13px;color:${T.faint};margin-top:8px;">${escapeHtml(art.caption)}</div>` : ''}
  </div>`
}

/** The top of every email: a kicker, a big serif headline and one line under it. */
function headline(kicker: string, title: string, dek?: string) {
  return `
  <div style="${caps(T.accent, 11)}margin:0 0 12px 0;">${kicker}</div>
  <h1 style="font-family:${DISPLAY};font-weight:400;font-size:46px;line-height:1.02;letter-spacing:-0.01em;color:${T.ink};margin:0 0 14px 0;">${title}</h1>
  ${dek ? `<p style="font-family:${SERIF};font-size:18px;line-height:1.55;color:${T.inkSoft};margin:0;">${dek}</p>` : ''}`
}

/** A section opens on a black rule with its name in capitals. */
function sectionHead(title: string, sub?: string) {
  return `
  <div style="border-top:1px solid ${T.ink};margin:44px 0 ${sub ? 4 : 2}px 0;padding-top:10px;">
    <div style="${caps(T.ink, 11)}">${title}</div>
    ${sub ? `<div style="font-family:${SERIF};font-style:italic;font-size:15px;color:${T.inkSoft};margin-top:4px;">${sub}</div>` : ''}
  </div>`
}

/** One contest as a line in the index: its number, the name and prize, and
    the deadline at the right. Three days or fewer and the deadline says so in red. */
function indexRow(c: ContestEmailItem, n: number, first = false, descLength = 170) {
  const urgent = c.daysLeft != null && c.daysLeft <= 3
  const when = urgent ? (c.daysLeft === 0 ? 'Last day' : `${c.daysLeft} day${c.daysLeft === 1 ? '' : 's'} left`) : 'Closes'
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${first ? '' : `border-top:1px solid ${T.rule};`}">
    <tr>
      <td width="38" style="width:38px;vertical-align:top;padding:20px 0 20px 0;font-family:${DISPLAY};font-size:24px;line-height:1;color:${T.faint};">${String(n).padStart(2, '0')}</td>
      <td style="vertical-align:top;padding:20px 12px 20px 0;">
        <a href="${c.url}" style="font-family:${DISPLAY};font-size:25px;line-height:1.1;color:${T.ink};text-decoration:none;">${escapeHtml(c.name)}</a>
        <div style="font-size:13px;line-height:1.5;color:${T.inkSoft};margin:6px 0 0 0;"><strong style="color:${T.ink};">${escapeHtml(trimTo(c.prize, 90))}</strong> · ${escapeHtml(c.organizer)}</div>
        ${descLength ? `<div style="font-size:14px;line-height:1.6;color:${T.inkSoft};margin:8px 0 10px 0;">${escapeHtml(trimTo(c.description, descLength))}</div>` : '<div style="height:10px;"></div>'}
        ${textLink(c.url, 'Enter →')}
      </td>
      <td width="76" style="width:76px;vertical-align:top;text-align:right;padding:22px 0 20px 0;">
        <div style="${caps(urgent ? T.accent : T.faint, 9)}margin-bottom:4px;">${when}</div>
        <div style="font-family:${DISPLAY};font-size:22px;line-height:1;color:${urgent ? T.accent : T.ink};">${shortDate(c.deadline)}</div>
      </td>
    </tr>
  </table>`
}

/** A run of contests, numbered from `start`. */
function index(items: ContestEmailItem[], start = 1, descLength = 170) {
  return items.map((c, i) => indexRow(c, start + i, i === 0, descLength)).join('')
}

function shell(body: string, unsub: string, section = '', preheader = '', now = new Date()) {
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"></head>
<body style="${emailBase}">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ''}
<div style="background-color:${T.paper};">
<div style="${wrap}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${T.ink};margin-bottom:28px;"><tr>
    <td style="vertical-align:bottom;padding-bottom:10px;"><a href="${SITE_URL}" style="font-family:${DISPLAY};font-size:24px;line-height:1;color:${T.ink};text-decoration:none;">AI Film Contests</a></td>
    <td style="vertical-align:bottom;text-align:right;padding-bottom:12px;${caps(T.faint, 9)}">${section ? `${escapeHtml(section)} &nbsp;·&nbsp; ` : ''}${date}</td>
  </tr></table>
  ${body}
  ${footer(unsub)}
</div>
</div>
</body>
</html>`
}

/** Plain-text twin of a contest list (deliverability + accessibility). */
function textList(items: ContestEmailItem[]) {
  return items.map(c =>
    `${c.isNew ? '[NEW] ' : c.daysLeft != null ? `[${c.daysLeft}d left] ` : ''}${c.name} — ${c.organizer}\n` +
    `  Prize: ${c.prize} · Due ${fmtDate(c.deadline)}\n  ${c.url}`
  ).join('\n\n')
}

// ─── Overs: the freebie for people making an entry ────────────────────────────
//
// Overs (overs.studio) is Abhi's other product: stills from a few words and
// clips from any still, on the person's own OpenRouter key. People on this
// list get Pro for $3 a month for their first three months, then $39 (the
// founding offer; its page for filmmakers is /filmmakers). Every contest email
// carries one short block under the contests; the welcome and spotlight
// emails carry a larger one. OVERS_PROMO=0 takes it out of all of them.

const OVERS_URL = 'https://www.overs.studio/filmmakers'

export function oversEnabled(): boolean {
  return process.env.OVERS_PROMO !== '0'
}

function oversLink(kind: EmailKind) {
  return `${OVERS_URL}?utm_source=aifilmcontests&utm_medium=email&utm_campaign=${kind}`
}

const OVERS_LINE = 'Overs turns a few words into stills and any still into a clip, on your own OpenRouter key. For people on this list it\'s $3 a month for the first 3 months.'

/** What the three months save: $108. */
const OVERS_SAVING = (OVERS.fullUsd - OVERS.monthlyUsd) * OVERS.months

/** The short note under the contests in bundles, pulses and digests: the guide
    and the tool, the two things someone needs once they've picked a contest. */
function oversBlock(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `
  <div style="border-top:1px solid ${T.rule};margin-top:36px;padding-top:18px;">
    <div style="${caps(T.faint, 10)}margin-bottom:8px;">Picked one?</div>
    <p style="font-family:${SERIF};font-size:16px;line-height:1.6;color:${T.inkSoft};margin:0 0 10px 0;">
      <a href="${SITE_URL}${GUIDE.path}" style="color:${T.ink};text-decoration:underline;">The contest film guide</a> takes you from the rules to the export.
      For the stills and clips, I built Overs: <span style="text-decoration:line-through;color:${T.faint};">$${OVERS.fullUsd}</span> <strong style="color:${T.ink};">$${OVERS.monthlyUsd} a month</strong> for your first ${OVERS.months} months.
    </p>
    ${textLink(oversLink(kind), `Get Overs for $${OVERS.monthlyUsd} →`)}
    <span style="font-family:${SERIF};font-style:italic;color:${T.faint};font-size:14px;margin-left:8px;">Abhi</span>
  </div>`
}

function oversText(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `PICKED ONE?\nThe contest film guide: ${SITE_URL}${GUIDE.path}\n${OVERS_LINE}\nGet Overs for $3: ${oversLink(kind)}\n(Made by Abhi, who runs AI Film Contests.)\n\n`
}

/** The Overs offer, set apart on a darker panel, for the welcome and spotlight. */
function oversFeature(kind: EmailKind, heading: string) {
  if (!oversEnabled()) return ''
  return `
  <div style="background:${T.panel};padding:26px 24px 28px;margin-top:18px;">
    ${picture(EMAIL_ART.overs, '0 0 22px 0')}
    <div style="${caps(T.accent, 10)}margin-bottom:10px;">${OVERS_OFF_PERCENT}% off for people on this list</div>
    <div style="font-family:${DISPLAY};font-size:34px;line-height:1.05;color:${T.ink};margin-bottom:12px;">${heading}</div>
    <p style="font-family:${SERIF};font-size:16px;line-height:1.65;color:${T.inkSoft};margin:0 0 14px 0;">
      I built Overs so you can make the stills and clips for an entry without another big subscription.
      Type a shot and it makes the stills. Pick one and it becomes a clip that opens exactly on that frame.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px 0;"><tr>
      <td style="vertical-align:baseline;font-family:${DISPLAY};font-size:52px;line-height:1;color:${T.ink};padding-right:12px;">$${OVERS.monthlyUsd}</td>
      <td style="vertical-align:baseline;font-size:13px;line-height:1.5;color:${T.inkSoft};">a month for ${OVERS.months} months<br><span style="text-decoration:line-through;color:${T.faint};">$${OVERS.fullUsd} a month</span> · $${OVERS_SAVING} saved</td>
    </tr></table>
    <p style="font-size:12px;line-height:1.6;color:${T.faint};margin:10px 0 20px 0;">
      Then $${OVERS.fullUsd} a month, cancel any time. Runs on your own OpenRouter key, so each clip costs what the video model charges, with no markup.
    </p>
    ${button(oversLink(kind), `Get Overs for $${OVERS.monthlyUsd} →`)}
  </div>`
}

function oversFeatureText(kind: EmailKind, heading: string) {
  if (!oversEnabled()) return ''
  return `${heading.toUpperCase()}\nI built Overs so you can make the stills and clips for an entry without another big subscription. Type a shot and it makes the stills. Pick one and it becomes a clip that opens exactly on that frame.\n` +
    `For people on this list, Overs Pro is $3 a month for your first 3 months, then $39. Cancel any time. It runs on your own OpenRouter key, so each clip costs what the video model charges, with no markup.\n` +
    `Get Overs for $3: ${oversLink(kind)}\n\n`
}

// ─── Starter picks: the three contests a new subscriber sees first ────────────

export interface PickableContest extends ContestEmailItem {
  status?: string
  entryFee?: string | null
  aiToolsAllowed?: string[] | null
}

/**
 * "Free" or "No entry fee", and no price anywhere in it. "See FilmFreeway" is
 * not free, and neither is "No fee published", which only means we don't know.
 */
export function isFreeEntry(fee: string | null | undefined): boolean {
  const f = fee ?? ''
  if (/[$€£₹]|\d/.test(f) || /publish|stated|listed|see /i.test(f)) return false
  return /\bfree\b|\bno (entry )?fee\b/i.test(f)
}

const PICK_MIN_DAYS = 14

/**
 * Open, free, any AI tool, and at least two weeks to make something: the
 * contests someone new can actually enter. A contest that requires its own
 * tool (AKOOL, Runway's fund) is left out, because they would have to sign up
 * for that tool to enter, and so is one whose organizer we could not name.
 */
function enterable(contests: PickableContest[], now: number) {
  return contests
    .filter(c => !c.status || c.status === 'open')
    .filter(c => c.organizer && !/^unknown$/i.test(c.organizer.trim()))
    // The same contest listed twice (same organizer, same deadline) counts once.
    .filter((c, i, all) => all.findIndex(o => o.organizer === c.organizer && o.deadline === c.deadline) === i)
    .filter(c => isFreeEntry(c.entryFee))
    .filter(c => (c.aiToolsAllowed ?? []).some(t => /\b(any|all)\b/i.test(t)) && !(c.aiToolsAllowed ?? []).some(t => /must/i.test(t)))
    .filter(c => Math.ceil((new Date(c.deadline).getTime() - now) / 86_400_000) >= PICK_MIN_DAYS)
}

/** The biggest dollar figure in a prize line. Other currencies count as 0:
    30,000,000 KRW is about $21,000, and ranking it as thirty million is wrong. */
function usdPrize(prize: string): number {
  let best = 0
  const re = /\$\s?([\d,]+(?:\.\d+)?)\s*([KkMm])?\b|([\d,]+(?:\.\d+)?)\s*([KkMm])?\s*USD\b/g
  let m
  while ((m = re.exec(prize))) {
    const n = parseFloat((m[1] ?? m[3]).replace(/,/g, ''))
    const unit = (m[2] ?? m[4] ?? '').toLowerCase()
    const v = n * (unit === 'm' ? 1e6 : unit === 'k' ? 1e3 : 1)
    if (isFinite(v) && v > best) best = v
  }
  return best
}

/**
 * This week's contest for the creator pack: the one pinned in the admin panel
 * (settings key featured_contest_id) while it is open, otherwise the enterable
 * contest with the biggest cash prize. Null when nothing qualifies, and the
 * email leaves the section out.
 */
export function featuredContest(contests: PickableContest[], pinnedId: string | null = null, now = Date.now()): ContestEmailItem | null {
  const pinned = pinnedId ? contests.find(c => c.id === pinnedId && (!c.status || c.status === 'open') && new Date(c.deadline).getTime() > now) : undefined
  const pick = pinned ?? enterable(contests, now).sort((a, b) => usdPrize(b.prize) - usdPrize(a.prize))[0]
  if (!pick) return null
  return {
    id: pick.id, name: pick.name, organizer: pick.organizer, prize: pick.prize, deadline: pick.deadline, url: pick.url,
    description: pick.description,
  }
}

export const FEATURED_SETTING = 'featured_contest_id'

// ─── Core sender: one email PER RECIPIENT via Resend batch ────────────────────
//
// Why per-recipient: it's the only way to (1) give each person their own
// one-click unsubscribe token, (2) attribute opens/clicks to a person via the
// Resend webhook, and (3) stop leaking the list through bcc. Resend's batch
// endpoint accepts up to 100 emails per call, so 1,000 subscribers = 10 calls.

const BATCH = 100
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function isQuotaError(err: unknown): boolean {
  const e = err as { name?: string; message?: string; statusCode?: number } | null
  if (!e) return false
  const s = `${e.name ?? ''} ${e.message ?? ''}`.toLowerCase()
  return s.includes('quota') || e.statusCode === 429
}

/** Writes send records, retrying Supabase timeouts. False means the rows are NOT saved. */
export async function recordSends(rows: SendLogRow[], retry?: DbRetryOptions): Promise<boolean> {
  if (!rows.length) return true
  try {
    const { error } = await withDbRetry(signal => supabaseAdmin.from('email_sends').insert(rows).abortSignal(signal), retry)
    if (!error || isMissingRelation(error)) return true
    console.error('[email_sends] insert failed:', error.message)
  } catch (e) {
    console.error('[email_sends] insert threw:', e)
  }
  return false
}

// Resend rejects an ENTIRE batch over one malformed address (422 validation_error),
// so anything that can't pass its `to` check is dropped before batching. Dot-atom
// rule: no leading/trailing/consecutive dots in the local part, sane domain labels.
// (Oct 4-8, 2026: four dotted-spam gmail addresses failed 2-3 batches of 20 every
// day, nobody in those batches got emailed, and the backlog grew to 4 days.)
const SENDABLE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/

export function isSendableEmail(email: string): boolean {
  return email.length <= 254 && SENDABLE.test(email)
}

export async function sendToRecipients(opts: {
  kind: EmailKind
  /** One subject for everyone, or a function for per-person subjects. */
  subject: string | ((r: Recipient) => string)
  recipients: Array<string | Recipient>
  html: (r: Recipient, unsubUrl: string) => string
  text?: (r: Recipient, unsubUrl: string) => string
  /** Contest ids mentioned, for per-person dedup. Prefix with new:/soon:/week: to say how. */
  contestIds?: string[] | ((r: Recipient) => string[])
  replyTo?: string
  /** Smaller batches waste fewer sends when a daily quota runs out mid-way. */
  batchSize?: number
  /** Tries at saving each batch's send record. Lower it where a slow response hurts (signup). */
  recordAttempts?: number
}): Promise<SendResult> {
  const all = normalizeRecipients(opts.recipients)
  if (!all.length) return { success: true, sent: 0, failed: 0 }

  // Drop addresses Resend would refuse, and unconfirm them so they stop sitting
  // at the front of the longest-waiting queue poisoning tomorrow's batches too.
  const invalid = all.filter(r => !isSendableEmail(r.email))
  const recipients = all.filter(r => isSendableEmail(r.email))
  if (invalid.length) {
    console.error(`[Email] ${opts.kind}: dropping ${invalid.length} undeliverable address(es): ${invalid.map(r => r.email).join(', ')}`)
    try {
      await supabaseAdmin.from('subscribers')
        .update({ confirmed: false, bounced_at: new Date().toISOString() })
        .in('email', invalid.map(r => r.email))
    } catch (e) {
      console.error('[Email] could not unconfirm undeliverable subscribers:', e)
    }
  }
  const dropped = invalid.length ? invalid.map(r => r.email) : undefined
  if (!recipients.length) return { success: true, sent: 0, failed: 0, dropped }

  const subjectFor = (r: Recipient) => (typeof opts.subject === 'function' ? opts.subject(r) : opts.subject)
  const idsFor = (r: Recipient) => (typeof opts.contestIds === 'function' ? opts.contestIds(r) : opts.contestIds ?? null)
  const size = Math.min(100, Math.max(1, opts.batchSize ?? BATCH))

  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] ${opts.kind} → ${recipients.length} recipients: "${subjectFor(recipients[0])}"`)
    return { success: true, sent: recipients.length, failed: 0, dropped }
  }

  const resend = getResend()
  let sent = 0
  let failed = 0
  let lastError: unknown

  const payloadFor = (r: Recipient) => {
    const unsub = unsubscribeUrl(r.token)
    return {
      from: `AI Film Contests <${FROM_EMAIL}>`,
      to: [r.email],
      reply_to: opts.replyTo ?? REPLY_TO,
      subject: subjectFor(r),
      headers: listUnsubscribeHeaders(unsub),
      tags: [{ name: 'kind', value: opts.kind }],
      html: opts.html(r, unsub),
      ...(opts.text ? { text: opts.text(r, unsub) } : {}),
    }
  }
  const rowFor = (r: Recipient, id: string | null): SendLogRow => ({
    email_type: opts.kind,
    recipient: r.email,
    subject: subjectFor(r),
    resend_email_id: id,
    contest_ids: idsFor(r),
  })

  for (let i = 0; i < recipients.length; i += size) {
    const chunk = recipients.slice(i, i + size)
    let rows: SendLogRow[] = []
    try {
      const res = await resend.batch.send(chunk.map(payloadFor))
      if (res.error) {
        console.error(`[Email] ${opts.kind} batch error:`, res.error)
        if (isQuotaError(res.error)) {
          return { success: false, sent, failed: failed + (recipients.length - i), quotaExceeded: true, error: res.error, dropped }
        }
        if ((res.error as { name?: string }).name === 'validation_error') {
          // One bad address fails the whole batch. Send one-by-one so the other
          // 19 still get their email, and the log names the address that broke.
          for (const r of chunk) {
            try {
              const single = await resend.emails.send(payloadFor(r))
              if (single.error) {
                console.error(`[Email] ${opts.kind} rejected for ${r.email}:`, single.error)
                if (isQuotaError(single.error)) {
                  return { success: false, sent, failed: failed + (recipients.length - i - chunk.indexOf(r)), quotaExceeded: true, error: single.error, dropped }
                }
                failed++
                lastError = single.error
              } else {
                sent++
                rows.push(rowFor(r, single.data?.id ?? null))
              }
            } catch (err) {
              console.error(`[Email] ${opts.kind} send threw for ${r.email}:`, err)
              failed++
              lastError = err
            }
            await sleep(550) // stay under Resend's 2 req/s
          }
        } else {
          failed += chunk.length
          lastError = res.error
        }
      } else {
        const ids = res.data?.data ?? []
        sent += chunk.length
        rows = chunk.map((r, idx) => rowFor(r, ids[idx]?.id ?? null))
      }
    } catch (err) {
      console.error(`[Email] ${opts.kind} batch threw:`, err)
      if (isQuotaError(err)) {
        return { success: false, sent, failed, quotaExceeded: true, error: err, dropped }
      }
      failed += chunk.length
      lastError = err
    }

    if (rows.length && !(await recordSends(rows, { attempts: opts.recordAttempts ?? 3 }))) {
      // These people got the email but nothing says so. Stop here: every
      // further batch we can't record is a duplicate in tomorrow's run.
      const notSent = recipients.length - i - chunk.length
      console.error(`[Email] ${opts.kind}: ${rows.length} sent but not recorded; stopping with ${notSent} not sent`)
      return { success: failed + notSent === 0, sent, failed: failed + notSent, recordFailed: true, unrecorded: rows, error: lastError, dropped }
    }

    if (i + size < recipients.length) await sleep(600)
  }

  return { success: failed === 0, sent, failed, error: lastError, dropped }
}

/** One-off plain email (daily report, organizer outreach, admin custom). */
export async function sendPlainEmail(opts: {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  kind?: EmailKind
}): Promise<SendResult> {
  const html = opts.html ?? `<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;background:#fff;padding:24px;"><pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${escapeHtml(opts.text)}</pre></body></html>`
  return sendToRecipients({
    kind: opts.kind ?? 'custom',
    subject: opts.subject,
    recipients: [opts.to],
    replyTo: opts.replyTo,
    html: () => html,
    text: () => opts.text,
  })
}

// ─── Signup: confirm, then the creator pack ───────────────────────────────────
//
// A signup gets one short email with one link. Clicking it confirms the address
// and sends the creator pack: the Overs offer with its real deadline, this
// week's contest to make something for, the guide and Creatives Club. Nobody
// gets contest emails before they confirm. A signup who hasn't clicked after
// a day gets one reminder (the notify cron), then nothing.

function confirmUrl(token: string) {
  return `${SITE_URL}/confirm?token=${encodeURIComponent(token)}`
}

/** "ends November 30", "ends in 4 days, on November 30", "ends today". */
function offerEnds(now: Date) {
  const days = offerDaysLeft(now)
  if (days <= 1) return 'ends today'
  if (days <= 7) return `ends in ${days} days, on ${OFFER_ENDS_LABEL}`
  return `ends ${OFFER_ENDS_LABEL}`
}

/** A paragraph in the letter-style emails. */
const para = (html: string, color = T.ink, size = 16, margin = '0 0 16px 0') =>
  `<p style="font-family:${SERIF};font-size:${size}px;line-height:1.65;color:${color};margin:${margin};">${html}</p>`
const signature = `<p style="font-family:${DISPLAY};font-style:italic;font-size:30px;line-height:1;color:${T.ink};margin:8px 0 0 0;">Abhi</p>`

/** The email a signup gets: confirm the address, get the pack. `reminder`
    is the one nudge a day later. */
export function buildConfirmEmail(name: string | null | undefined, token: string, reminder = false, now = new Date()): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
} {
  const first = name?.split(' ')[0] ?? null
  const hey = first ? `Hey ${escapeHtml(first)},` : 'Hey,'
  const url = confirmUrl(token)
  const open = oversEnabled() && offerOpen(now)
  const pack = open
    ? `Overs Pro at $${OVERS.monthlyUsd} a month, the contest film guide and ${COMMUNITY.name}`
    : `the contest film guide, ${COMMUNITY.name} and this week's contest`
  const lead = reminder
    ? `You signed up for AI Film Contests but haven't confirmed, so your creator pack hasn't gone out. One click sends it: ${pack}.`
    : `Confirm your email and I'll send your creator pack: ${pack}.`
  const deadline = open ? `The $${OVERS.monthlyUsd} Overs price ${offerEnds(now)}.` : ''
  const after = reminder ? 'This is the only reminder.' : "Didn't sign up? Ignore this and you won't hear from us."
  return {
    subject: reminder ? 'Your creator pack is still waiting' : 'Confirm your email to get your creator pack',
    html: unsub => shell(`
  ${para(hey)}
  ${para(lead)}
  <div style="margin:26px 0 26px 0;">${button(url, 'Confirm and send my pack →')}</div>
  ${deadline ? para(deadline, T.inkSoft, 15) : ''}
  ${para(after, T.faint, 14)}
  ${signature}`, unsub, reminder ? 'Reminder' : 'Confirm', open ? `One click. ${deadline}` : 'One click and your creator pack is on its way.', now),
    text: unsub =>
      `${first ? `Hey ${first},` : 'Hey,'}\n\n${lead}\n\nConfirm and send my pack: ${url}\n\n` +
      (deadline ? `${deadline}\n\n` : '') + `${after}\n\nAbhi\n\nUnsubscribe: ${unsub}`,
  }
}

/**
 * The creator pack, sent the moment someone confirms. `existing` is for people
 * who were on the list before the pack existed. While the founding price is
 * open it leads with Overs and its deadline; after, the pack is the contest,
 * the guide and the club.
 */
export function buildPackEmail(
  name: string | null | undefined,
  featured: ContestEmailItem | null,
  opts: { existing?: boolean; now?: Date } = {},
): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
  contestIds: string[]
} {
  const now = opts.now ?? new Date()
  const first = name?.split(' ')[0] ?? null
  const open = oversEnabled() && offerOpen(now)
  const ends = offerEnds(now)
  const subject = open
    ? `Your creator pack: Overs for $${OVERS.monthlyUsd} until ${OFFER_ENDS_LABEL}`
    : 'Your creator pack is here'
  const opening = opts.existing
    ? "You've been on the list a while, so you get the creator pack new subscribers now get. Here it is."
    : "You're confirmed. Here's your creator pack."
  const oversCopy = `Overs is the tool I built for making AI films. Type a shot and it makes the stills. Pick one and it becomes a clip that opens on that exact frame.`
  const priceCopy = `$${OVERS.monthlyUsd} a month for your first ${OVERS.months} months, then $${OVERS.fullUsd}. The price ${ends}, or sooner if the ${OVERS.places} founding places fill.`
  const fine = 'You bring your own OpenRouter key, so each clip costs what the video model charges. Cancel any time.'
  const featuredLine = featured
    ? `${featured.prize} · free to enter · closes ${fmtDate(featured.deadline)}`
    : ''

  const oversHtml = open ? `
  ${sectionHead(`Overs Pro for $${OVERS.monthlyUsd} a month`)}
  <div style="padding-top:14px;">
    ${para(oversCopy)}
    ${para(`<strong>${priceCopy}</strong>`)}
    ${para(fine, T.faint, 13, '0 0 22px 0')}
    ${button(oversLink('pack'), `Claim Overs for $${OVERS.monthlyUsd} →`)}
  </div>` : ''

  const featuredHtml = featured ? `
  ${sectionHead("This week's contest", open ? 'Make your first still for it in Overs tonight.' : undefined)}
  <div style="padding-top:16px;">
    <a href="${featured.url}" style="font-family:${DISPLAY};font-size:30px;line-height:1.08;color:${T.ink};text-decoration:none;">${escapeHtml(featured.name)}</a>
    <div style="font-size:13px;line-height:1.5;color:${T.inkSoft};margin:8px 0 10px 0;"><strong style="color:${T.ink};">${escapeHtml(trimTo(featured.prize, 90))}</strong> · free to enter · closes ${shortDate(featured.deadline)}</div>
    <div style="font-size:14px;line-height:1.6;color:${T.inkSoft};margin:0 0 12px 0;">${escapeHtml(trimTo(featured.description, 200))}</div>
    ${textLink(featured.url, 'Read the rules →')}
  </div>` : ''

  const resourcesHtml = `
  ${sectionHead('Also yours')}
  <div style="padding-top:12px;">
    ${para(`<a href="${SITE_URL}${GUIDE.path}" style="color:${T.ink};">${escapeHtml(GUIDE.title)}</a>. Every step from the rules to the export, and the checks that get entries thrown out.`, T.inkSoft, 15, '0 0 12px 0')}
    ${para(`<a href="${COMMUNITY.url}" style="color:${T.ink};">${COMMUNITY.name}</a>. My free community for AI creative workflows. Post what you make and get feedback.`, T.inkSoft, 15, '0')}
  </div>`

  return {
    subject,
    contestIds: featured?.id ? [`new:${featured.id}`] : [],
    html: unsub => shell(`
  ${para(first ? `Hey ${escapeHtml(first)},` : 'Hey,')}
  ${para(opening, T.ink, 16, '0 0 4px 0')}
  ${oversHtml}
  ${featuredHtml}
  ${resourcesHtml}
  <div style="border-top:1px solid ${T.ink};margin-top:40px;padding-top:18px;">
    ${para("I run AI Film Contests and the list gets checked every day, so you don't spend a weekend on a contest that has already closed. Reply and tell me which contest you're entering.", T.ink, 16, '0')}
    ${signature}
  </div>`, unsub, 'Creator pack', open ? `Overs for $${OVERS.monthlyUsd} a month ${ends}. Plus this week's contest.` : "This week's contest, the guide and the club.", now),
    text: unsub =>
      `${first ? `Hey ${first},` : 'Hey,'}\n\n${opening}\n\n` +
      (open ? `OVERS PRO FOR $${OVERS.monthlyUsd} A MONTH\n${oversCopy}\n${priceCopy}\n${fine}\nClaim it: ${oversLink('pack')}\n\n` : '') +
      (featured ? `THIS WEEK'S CONTEST\n${featured.name}\n${featuredLine}\n${featured.url}\n\n` : '') +
      `ALSO YOURS\n${GUIDE.title}: ${SITE_URL}${GUIDE.path}\n${COMMUNITY.name}, my free community: ${COMMUNITY.url}\n\n` +
      `I run AI Film Contests and the list gets checked every day, so you don't spend a weekend on a contest that has already closed. Reply and tell me which contest you're entering.\n\nAbhi\n\nUnsubscribe: ${unsub}`,
  }
}

export async function sendConfirmEmail(email: string, name: string | null, token: string, reminder = false) {
  const c = buildConfirmEmail(name, token, reminder)
  const result = await sendToRecipients({
    kind: 'confirm',
    subject: c.subject,
    recipients: [{ email, token, name }],
    // The signup form waits on this.
    recordAttempts: 1,
    html: (_r, unsub) => c.html(unsub),
    text: (_r, unsub) => c.text(unsub),
  })
  return { success: result.success, error: result.error }
}

/** The one reminder, to signups who never clicked. Returns who it went to. */
export async function sendConfirmReminders(pending: Array<{ email: string; name: string | null; token: string }>): Promise<{ sent: string[]; error?: unknown }> {
  if (!pending.length) return { sent: [] }
  const result = await sendToRecipients({
    kind: 'confirm',
    subject: buildConfirmEmail(null, '', true).subject,
    recipients: pending,
    html: (r, unsub) => buildConfirmEmail(r.name, r.token ?? '', true).html(unsub),
    text: (r, unsub) => buildConfirmEmail(r.name, r.token ?? '', true).text(unsub),
  })
  if (!result.sent) return { sent: [], error: result.error }
  const dropped = new Set(result.dropped ?? [])
  return { sent: pending.map(p => p.email).filter(e => !dropped.has(e)), error: result.error }
}

export async function sendPackEmail(
  recipients: Recipient[],
  featured: ContestEmailItem | null,
  opts: { existing?: boolean; subjectPrefix?: string } = {},
): Promise<SendResult> {
  const p = buildPackEmail(null, featured, { existing: opts.existing })
  return sendToRecipients({
    kind: 'pack',
    subject: r => `${opts.subjectPrefix ?? ''}${buildPackEmail(r.name, featured, { existing: opts.existing }).subject}`,
    recipients,
    contestIds: p.contestIds,
    recordAttempts: recipients.length === 1 ? 1 : undefined,
    html: (r, unsub) => buildPackEmail(r.name, featured, { existing: opts.existing }).html(unsub),
    text: (r, unsub) => buildPackEmail(r.name, featured, { existing: opts.existing }).text(unsub),
  })
}

// ─── Daily pulse: new contests + last-call, folded into ONE email ─────────────

export async function sendDailyPulse(
  subscribers: Array<string | Recipient>,
  sections: { newContests: ContestEmailItem[]; closingSoon: ContestEmailItem[] },
): Promise<SendResult> {
  const news = sections.newContests.map(c => ({ ...c, isNew: true }))
  const soon = [...sections.closingSoon].sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))
  if (!news.length && !soon.length) return { success: true, sent: 0, failed: 0 }

  const subject =
    news.length && soon.length
      ? `${news.length} new contest${news.length !== 1 ? 's' : ''} + ${soon.length} closing in 3 days`
      : news.length
      ? news.length === 1 ? `New: ${news[0].name} (${news[0].prize})` : `${news.length} new AI film contests just opened`
      : soon.length === 1 ? `🚨 ${soon[0].daysLeft}d left to enter: ${soon[0].name}` : `🚨 ${soon.length} contests close in 3 days`

  const body = `
  ${headline(
    news.length ? 'Just opened' : 'Last call',
    news.length ? (news.length === 1 ? 'A new contest just opened.' : `${news.length} new contests just opened.`) : soon.length === 1 ? 'One contest closes in days.' : `${soon.length} contests close in days.`,
    'Checked against live sources today.',
  )}
  ${news.length ? sectionHead('New') + index(news) : ''}
  ${soon.length ? sectionHead('Closing in 3 days', 'Submit now or miss it.') + index(soon, news.length + 1) : ''}
  <div style="margin-top:32px;">${button(SITE_URL, 'See every open contest →')}</div>
  ${oversBlock('pulse')}`

  const badge = news.length ? 'New contests' : 'Last call'

  return sendToRecipients({
    kind: 'pulse',
    subject,
    recipients: subscribers,
    contestIds: [...news, ...soon].map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub, badge),
    text: (_r, unsub) =>
      (news.length ? `NEW TODAY\n\n${textList(news)}\n\n` : '') +
      (soon.length ? `CLOSING IN 3 DAYS\n\n${textList(soon)}\n\n` : '') +
      oversText('pulse') +
      `All open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
  })
}

// ─── Per-person bundle: everything new for ONE subscriber since their last email ─

export interface Bundle {
  newContests: ContestEmailItem[]
  closingSoon: ContestEmailItem[]      // ≤ 3 days
  closingThisWeek: ContestEmailItem[]  // 4–7 days
}

export function buildBundleEmail(b: Bundle): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
  contestIds: string[]
} {
  const news = b.newContests.map(c => ({ ...c, isNew: true }))
  const soon = [...b.closingSoon].sort((a, c) => (a.daysLeft ?? 99) - (c.daysLeft ?? 99))
  const week = [...b.closingThisWeek].sort((a, c) => (a.daysLeft ?? 99) - (c.daysLeft ?? 99))
  const parts: string[] = []
  if (news.length) parts.push(news.length === 1 ? `New: ${news[0].name}` : `${news.length} new contests`)
  if (soon.length) parts.push(soon.length === 1 ? `${soon[0].daysLeft}d left: ${soon[0].name}` : `${soon.length} closing in 3 days`)
  if (!news.length && !soon.length && week.length) parts.push(`${week.length} contest${week.length !== 1 ? 's' : ''} closing this week`)
  const subject = (soon.length && !news.length ? '🚨 ' : '') + parts.join(' · ')

  const h1 = news.length
    ? (news.length === 1 ? 'A new contest just opened.' : `${news.length} new contests just opened.`)
    : soon.length ? (soon.length === 1 ? 'One contest closes in days.' : `${soon.length} contests close in days.`)
    : `${week.length} contest${week.length === 1 ? '' : 's'} closing this week.`
  const body = `
  ${headline(
    news.length ? 'Just opened' : soon.length ? 'Last call' : 'This week',
    h1,
    'Everything since your last email, checked against live sources.',
  )}
  ${news.length ? sectionHead('New') + index(news) : ''}
  ${soon.length ? sectionHead('Closing in 3 days', 'Submit now or miss it.') + index(soon, news.length + 1) : ''}
  ${week.length ? sectionHead('Closing this week') + index(week, news.length + soon.length + 1) : ''}
  <div style="margin-top:32px;">${button(SITE_URL, 'See every open contest →')}</div>
  ${oversBlock('new_contest')}`
  const badge = news.length ? 'New contests' : soon.length ? 'Last call' : 'This week'

  return {
    subject,
    html: unsub => shell(body, unsub, badge),
    text: unsub =>
      (news.length ? `NEW\n\n${textList(news)}\n\n` : '') +
      (soon.length ? `CLOSING IN 3 DAYS\n\n${textList(soon)}\n\n` : '') +
      (week.length ? `CLOSING THIS WEEK\n\n${textList(week)}\n\n` : '') +
      oversText('new_contest') +
      `All open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
    contestIds: [
      ...news.map(c => `new:${c.id}`),
      ...soon.map(c => `soon:${c.id}`),
      ...week.map(c => `week:${c.id}`),
    ].filter(x => !x.endsWith(':undefined')),
  }
}

// ─── Weekly digest (Mondays) ──────────────────────────────────────────────────

export async function sendWeeklyDigest(
  subscribers: Array<string | Recipient>,
  openContests: ContestEmailItem[],
  extras: { newThisWeek?: ContestEmailItem[]; closingThisWeek?: ContestEmailItem[] } = {},
): Promise<SendResult> {
  if (!openContests.length) return { success: true, sent: 0, failed: 0 }

  const sorted = [...openContests].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  const closing = [...(extras.closingThisWeek ?? [])].sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))
  const fresh = (extras.newThisWeek ?? []).map(c => ({ ...c, isNew: true }))
  const closingIds = new Set(closing.map(c => c.id))
  const freshIds = new Set(fresh.map(c => c.id))
  const rest = sorted.filter(c => !closingIds.has(c.id) && !freshIds.has(c.id)).slice(0, 12)

  const subject = closing.length
    ? `${closing.length} AI film contest${closing.length !== 1 ? 's' : ''} closing this week · ${sorted.length} open`
    : `${sorted.length} AI film contest${sorted.length !== 1 ? 's' : ''} open right now`

  const body = `
  ${headline('The week', 'Your week in AI film contests.', `${sorted.length} open, all checked against live sources.`)}
  ${closing.length ? sectionHead('Closing this week', 'Last chance to get in.') + index(closing) : ''}
  ${fresh.length ? sectionHead('New this week') + index(fresh, closing.length + 1) : ''}
  ${rest.length ? sectionHead('Also open', 'Sorted by deadline.') + index(rest, closing.length + fresh.length + 1, 0) : ''}
  <div style="margin-top:32px;">${button(SITE_URL, `See all ${sorted.length} contests →`)}</div>
  ${oversBlock('weekly_digest')}`

  return sendToRecipients({
    kind: 'weekly_digest',
    subject,
    recipients: subscribers,
    contestIds: [...closing, ...fresh].map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub, 'The week'),
    text: (_r, unsub) =>
      (closing.length ? `CLOSING THIS WEEK\n\n${textList(closing)}\n\n` : '') +
      (fresh.length ? `NEW THIS WEEK\n\n${textList(fresh)}\n\n` : '') +
      (rest.length ? `ALSO OPEN\n\n${textList(rest)}\n\n` : '') +
      oversText('weekly_digest') +
      `All open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
  })
}

// ─── Spotlight: one festival worth entering, plus the Overs offer ─────────────
//
// A one-off to the whole list about a single contest, sent from the admin panel
// (action send-spotlight). Everything it says comes from the contest's row, so
// the facts are the ones the directory already checked.

export interface SpotlightContest extends ContestEmailItem {
  prizeDetails?: string[] | null
  entryFee?: string | null
  aiToolsAllowed?: string[] | null
}

/** The spotlight's facts as a spec sheet: a label on the left, the value on the right. */
function specSheet(rows: Array<[string, string]>) {
  return rows.map(([k, v], i) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${i ? T.rule : T.ink};"><tr>
      <td width="110" style="width:110px;vertical-align:top;padding:11px 10px 11px 0;${caps(T.faint, 9)}line-height:1.9;">${k}</td>
      <td style="vertical-align:top;padding:10px 0;font-size:14px;line-height:1.55;color:${T.ink};">${escapeHtml(v)}</td>
    </tr></table>`).join('')
}

export function buildSpotlightEmail(c: SpotlightContest): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
  contestIds: string[]
} {
  const free = isFreeEntry(c.entryFee)
  const anyTool = (c.aiToolsAllowed ?? []).some(t => /\b(any|all)\b/i.test(t))
  const facts = [
    `Closes ${fmtDate(c.deadline)}`,
    free ? 'Free to enter' : c.entryFee ? `Entry: ${c.entryFee}` : null,
    anyTool ? 'Any AI tool allowed' : c.aiToolsAllowed?.length ? `Tools: ${c.aiToolsAllowed.join(', ')}` : null,
  ].filter((x): x is string => !!x)
  const details = (c.prizeDetails ?? []).filter(d => !/^submissions open/i.test(d))
  const subject = `${c.name} is open: ${c.prize}`

  const spec: Array<[string, string]> = [
    ['Closes', fmtDate(c.deadline)],
    ['Entry', free ? 'Free' : c.entryFee || 'See the rules'],
    ['Tools', anyTool ? 'Any AI tool' : c.aiToolsAllowed?.length ? c.aiToolsAllowed.join(', ') : 'See the rules'],
    ...details.map((d, i): [string, string] => [i ? '' : 'Prizes', d]),
  ]
  const body = `
  ${picture(EMAIL_ART.spotlight)}
  ${headline(`Now open · ${escapeHtml(c.organizer)}`, escapeHtml(c.name), escapeHtml(c.prize))}
  <p style="font-family:${SERIF};font-size:17px;line-height:1.7;color:${T.ink};margin:24px 0 28px 0;">${escapeHtml(c.description)}</p>
  ${specSheet(spec)}
  <div style="border-top:1px solid ${T.rule};padding-top:28px;">${button(c.url, 'Read the rules and enter →')}</div>

  ${sectionHead('Make your entry')}
  ${oversFeature('custom', 'Make your entry for $3 a month')}

  <p style="font-family:${SERIF};font-size:15px;line-height:1.6;color:${T.inkSoft};margin:24px 0 0 0;">
    More open contests, with the tools each one allows, at <a href="${SITE_URL}" style="color:${T.accent};">aifilmcontests.com</a>.
  </p>`

  return {
    subject,
    html: unsub => shell(body, unsub, 'Spotlight'),
    text: unsub =>
      `${c.name} is open: ${c.prize}\n${c.organizer}\n\n${c.description}\n\n${facts.join('\n')}\n` +
      (details.length ? `\n${details.join('\n')}\n` : '') +
      `\nRead the rules and enter: ${c.url}\n\n` +
      oversFeatureText('custom', 'Make your entry for $3 a month') +
      `More open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
    contestIds: c.id ? [`new:${c.id}`] : [],
  }
}

// ─── Compatibility wrappers (admin panel + older callers) ─────────────────────

export async function sendNewContestAlerts(subscribers: Array<string | Recipient>, contests: ContestEmailItem[]) {
  return sendDailyPulse(subscribers, { newContests: contests, closingSoon: [] })
}

export async function sendExpiringContestAlerts(subscribers: Array<string | Recipient>, expiring: ContestEmailItem[]) {
  return sendDailyPulse(subscribers, { newContests: [], closingSoon: expiring })
}

/** 7-day reminders now live inside the Monday digest. Kept for the admin "send reminders" button. */
export async function sendDeadlineReminders(subscribers: Array<string | Recipient>, urgent: ContestEmailItem[]) {
  if (!urgent.length) return { success: true, sent: 0, failed: 0 } as SendResult
  const sorted = [...urgent].sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))
  const subject = sorted.length === 1
    ? `⏰ ${sorted[0].daysLeft} days left: ${sorted[0].name}`
    : `⏰ ${sorted.length} contests closing this week`
  const body = `
  ${headline('Final week', sorted.length === 1 ? 'This contest closes soon.' : `${sorted.length} contests closing this week.`, 'Last chance to get in.')}
  ${sectionHead('Closing')}
  ${index(sorted)}
  <div style="margin-top:32px;">${button(SITE_URL, 'See all deadlines →')}</div>`
  return sendToRecipients({
    kind: 'reminder_7day',
    subject,
    recipients: subscribers,
    contestIds: sorted.map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub, 'Final week'),
    text: (_r, unsub) => `CLOSING THIS WEEK\n\n${textList(sorted)}\n\nAll deadlines: ${SITE_URL}\nUnsubscribe: ${unsub}`,
  })
}

// ─── Organizer outreach (sales) ───────────────────────────────────────────────

export function buildOrganizerOutreach(c: {
  id: string; name: string; organizer: string; deadline: string
}, ctx: { subscriberCount: number; priceLabel: string }) {
  const listingUrl = `${SITE_URL}/contests/${c.id}`
  const featureUrl = `${SITE_URL}/feature?contest=${encodeURIComponent(c.id)}`
  const subject = `${c.name} is now listed on AI Film Contests`
  const text =
`Hi ${c.organizer} team,

Quick heads-up: ${c.name} is now listed on aifilmcontests.com, the directory AI filmmakers use to find competitions worth entering.

Your listing: ${listingUrl}

We verify deadlines daily and email ${ctx.subscriberCount} AI filmmakers when contests open and before they close (yours is due ${fmtDate(c.deadline)}). That's free and already done.

If you'd like more entries, you can feature the contest for ${ctx.priceLabel}: pinned at the top of the site, a "Featured" badge, and a dedicated slot in the next subscriber email.
${featureUrl}

If anything in the listing is wrong, just reply and we'll fix it the same day.

Abhi
AI Film Contests · ${SITE_URL}`
  return { subject, text, listingUrl, featureUrl }
}
