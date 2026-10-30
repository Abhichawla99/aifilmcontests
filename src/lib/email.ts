import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'
import { isMissingRelation, withDbRetry, type DbRetryOptions } from './db-health'
import { COMMUNITY, GUIDE, OVERS, OVERS_OFF_PERCENT } from './creator-pack'

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
  | 'welcome' | 'new_contest' | 'closing_soon' | 'weekly_digest' | 'pulse'
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

// ─── Shared styles ────────────────────────────────────────────────────────────

// The site's own colours (globals.css, the paper theme), so an email looks like
// it came from the page they signed up on.
const C = {
  paper: '#FBFAF8',
  card: '#FFFFFF',
  ink: '#1B1916',
  body: '#4A463E',
  muted: '#6F6A61',
  faint: '#8B867C',
  line: '#E8E4DC',
  indigo: '#4F46E5',
  indigoDeep: '#4338CA',
  indigoWash: '#EEF0FE',
  red: '#DC2626',
}
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif`
const DISPLAY = `'Space Grotesk',${FONT}`

const emailBase = `background-color:${C.paper};color:${C.ink};font-family:${FONT};margin:0;padding:0;`
const wrap = `max-width:580px;margin:0 auto;padding:32px 20px 40px;`
const wordmark = `<span style="font-family:${DISPLAY};font-size:15px;font-weight:700;letter-spacing:-0.01em;color:${C.ink};">AI Film <span style="color:${C.indigo};">Contests</span></span>`
const card = `background:${C.card};border:1px solid ${C.line};border-radius:12px;`
const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${C.indigo};color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:600;">${label}</a>`

function hr() {
  return `<hr style="border:none;border-top:1px solid ${C.line};margin:32px 0;">`
}

function footer(unsubscribeLink: string) {
  return `
    <div style="color:${C.faint};font-size:12px;text-align:center;line-height:1.8;">
      <a href="${SITE_URL}" style="color:${C.faint};text-decoration:none;">aifilmcontests.com</a>
      &nbsp;·&nbsp;
      <a href="${unsubscribeLink}" style="color:${C.faint};text-decoration:underline;">Unsubscribe</a>
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

function contestCard(c: ContestEmailItem) {
  const badge = c.isNew
    ? `<span style="background:${C.indigo};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px;">New</span>`
    : c.daysLeft != null
    ? `<span style="color:${C.red};font-size:12px;font-weight:700;margin-left:8px;">${c.daysLeft}d left</span>`
    : ''

  return `
    <div style="${card}padding:20px 22px;margin-bottom:12px;">
      <div style="margin-bottom:4px;">
        <span style="color:${C.faint};font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(c.organizer)}</span>
        ${badge}
      </div>
      <div style="font-family:${DISPLAY};font-size:18px;font-weight:700;letter-spacing:-0.01em;margin-bottom:6px;color:${C.ink};">${escapeHtml(c.name)}</div>
      <div style="color:${C.body};font-size:14px;line-height:1.6;margin-bottom:14px;">${escapeHtml(c.description)}</div>
      <div>
        <span style="color:${C.indigo};font-weight:700;font-size:15px;">${escapeHtml(c.prize)}</span>
        <span style="color:${C.muted};font-size:13px;margin-left:12px;">Due ${fmtDate(c.deadline)}</span>
        &nbsp;&nbsp;
        <a href="${c.url}" style="color:${C.indigoDeep};font-size:13px;font-weight:600;text-decoration:none;">Apply →</a>
      </div>
    </div>`
}

function sectionTitle(title: string, sub?: string) {
  return `
    <h2 style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.indigo};margin:32px 0 12px 0;">${title}</h2>
    ${sub ? `<p style="color:${C.muted};font-size:13px;margin:-6px 0 14px 0;">${sub}</p>` : ''}`
}

/** A big headline for the top of an email, in the site's display face. */
function headline(text: string, sub?: string) {
  return `
  <h1 style="font-family:${DISPLAY};font-size:26px;font-weight:700;letter-spacing:-0.025em;line-height:1.15;color:${C.ink};margin:0 0 8px 0;">${text}</h1>
  ${sub ? `<p style="color:${C.muted};font-size:14px;line-height:1.6;margin:0 0 8px 0;">${sub}</p>` : ''}`
}

function shell(body: string, unsub: string, topRight = '', preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"></head>
<body style="${emailBase}">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ''}
<div style="${wrap}">
  <div style="margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    ${topRight}
  </div>
  ${body}
  ${hr()}
  ${footer(unsub)}
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

/** "$39 $3 a month": the regular price struck through next to the list price. */
const priceDrop = `<span style="color:${C.faint};text-decoration:line-through;">$${OVERS.fullUsd}</span> <strong style="color:${C.ink};">$${OVERS.monthlyUsd} a month</strong>`
/** What the three months save: $108. */
const OVERS_SAVING = (OVERS.fullUsd - OVERS.monthlyUsd) * OVERS.months

/** The short block under the contests in bundles, pulses and digests: the tool
    and the guide, the two things someone needs once they've picked a contest. */
function oversBlock(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `
  <div style="${card}padding:18px 20px;margin-top:28px;">
    <div style="font-family:${DISPLAY};font-size:16px;font-weight:700;color:${C.ink};margin-bottom:6px;">Picked one? Here's how to make it.</div>
    <div style="color:${C.body};font-size:14px;line-height:1.6;">
      <a href="${SITE_URL}${GUIDE.path}" style="color:${C.indigoDeep};font-weight:600;text-decoration:none;">The contest film guide</a> takes you from the rules to the export.
      Overs makes the stills and clips: ${priceDrop} for your first ${OVERS.months} months, on your own OpenRouter key.
    </div>
    <div style="margin-top:10px;"><a href="${oversLink(kind)}" style="color:${C.indigoDeep};font-size:13px;font-weight:600;text-decoration:none;">Get Overs for $${OVERS.monthlyUsd} →</a>
    <span style="color:${C.faint};font-size:12px;margin-left:8px;">Made by Abhi, who runs AI Film Contests.</span></div>
  </div>`
}

function oversText(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `PICKED ONE? HERE'S HOW TO MAKE IT.\nThe contest film guide: ${SITE_URL}${GUIDE.path}\n${OVERS_LINE}\nGet Overs for $3: ${oversLink(kind)}\n(Made by Abhi, who runs AI Film Contests.)\n\n`
}

/** The larger version for the welcome and spotlight emails. */
function oversFeature(kind: EmailKind, heading: string) {
  if (!oversEnabled()) return ''
  return `
  <div style="background:${C.indigoWash};border:1px solid #D9DCFB;border-radius:12px;padding:22px;margin:0 0 12px 0;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.indigo};margin-bottom:8px;">${OVERS_OFF_PERCENT}% off · $${OVERS_SAVING} off your first ${OVERS.months} months</div>
    <div style="font-family:${DISPLAY};font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};margin-bottom:8px;">${heading}</div>
    <p style="color:${C.body};font-size:15px;line-height:1.6;margin:0 0 10px 0;">
      I built Overs so you can make the stills and clips for an entry without another big subscription.
      Type a shot and it makes the stills. Pick one and it becomes a clip that opens exactly on that frame.
    </p>
    <p style="color:${C.body};font-size:15px;line-height:1.6;margin:0 0 6px 0;">${priceDrop} for your first ${OVERS.months} months, then $${OVERS.fullUsd}. Cancel any time.</p>
    <p style="color:${C.muted};font-size:13px;line-height:1.6;margin:0 0 16px 0;">
      It runs on your own OpenRouter key, so each clip costs what the video model charges, with no markup.
    </p>
    ${button(oversLink(kind), `Get Overs for $${OVERS.monthlyUsd} →`)}
  </div>`
}

/** The other two pieces of the creator pack, under the Overs offer in the welcome. */
function packExtras() {
  const row = (label: string, title: string, text: string, href: string, cta: string) => `
    <div style="${card}padding:18px 20px;margin-bottom:12px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.indigo};margin-bottom:6px;">${label}</div>
      <div style="font-family:${DISPLAY};font-size:17px;font-weight:700;color:${C.ink};margin-bottom:4px;">${title}</div>
      <div style="color:${C.body};font-size:14px;line-height:1.6;margin-bottom:8px;">${text}</div>
      <a href="${href}" style="color:${C.indigoDeep};font-size:13px;font-weight:600;text-decoration:none;">${cta} →</a>
    </div>`
  return `
  <div style="margin:0 0 8px 0;">
    ${row('Guide', escapeHtml(GUIDE.title), 'Every step from reading the rules to exporting the file: shot list, look, stills, clips, sound, and the checks that get entries thrown out.', `${SITE_URL}${GUIDE.path}`, 'Read the guide')}
    ${row('Community', COMMUNITY.name, 'My free community on Skool for people learning AI creative workflows. Ask questions and see how others build their shots.', COMMUNITY.url, 'Join free')}
  </div>`
}

function packExtrasText() {
  return `${GUIDE.title}: ${SITE_URL}${GUIDE.path}
${COMMUNITY.name}, my free community: ${COMMUNITY.url}

`
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
 * contests a new subscriber can actually enter. Soonest deadline first, three
 * at most. A contest that requires its own tool (AKOOL, Runway's fund) is left
 * out, because a newcomer would have to sign up for that tool to enter, and so
 * is one whose organizer we could not name.
 */
export function starterPicks(contests: PickableContest[], now = Date.now(), count = 3): ContestEmailItem[] {
  return contests
    .filter(c => !c.status || c.status === 'open')
    .filter(c => c.organizer && !/^unknown$/i.test(c.organizer.trim()))
    // The same contest listed twice (same organizer, same deadline) counts once.
    .filter((c, i, all) => all.findIndex(o => o.organizer === c.organizer && o.deadline === c.deadline) === i)
    .filter(c => isFreeEntry(c.entryFee))
    .filter(c => (c.aiToolsAllowed ?? []).some(t => /\b(any|all)\b/i.test(t)) && !(c.aiToolsAllowed ?? []).some(t => /must/i.test(t)))
    .map(c => ({ c, days: Math.ceil((new Date(c.deadline).getTime() - now) / 86_400_000) }))
    .filter(({ days }) => days >= PICK_MIN_DAYS)
    .sort((a, b) => a.days - b.days)
    .slice(0, count)
    .map(({ c }) => ({
      id: c.id, name: c.name, organizer: c.organizer, prize: c.prize, deadline: c.deadline, url: c.url,
      description: c.description.length > 180 ? c.description.slice(0, 177).replace(/\s+\S*$/, '') + '…' : c.description,
    }))
}

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

// ─── Welcome email ────────────────────────────────────────────────────────────

/** The welcome, built without sending: the signup route sends it, the preview renders it. */
// The welcome is the signup's receipt, so it is built the way the best order
// confirmations are: it looks like the site, shows where they are (signed up,
// then pick, make, submit), puts what they got and what it's worth up top, says
// what the next two weeks look like, and ends on a note from Abhi.

/** Where a new subscriber is: signed up, with three steps to a submitted entry. */
const WELCOME_STEPS = ['Signed up', 'Pick a contest', 'Make it', 'Submit']

/** Two weeks from a contest to an entry, matching the picks (at least 14 days
    left) and the guide's order. */
const WELCOME_PLAN: Array<[string, string, string]> = [
  ['Days 1–2', 'Pick one and read the rules', 'Note the length, the format, any tool they require and what they say about AI. Missing one of these can get an entry thrown out.'],
  ['Days 3–6', 'Shot list and stills', 'Write every shot as one line, settle the look, then make a still for each shot. In Overs you type the shot and pick the still you like.'],
  ['Days 7–11', 'Clips and sound', 'Turn each still into a clip that opens on that frame, then lay in sound. Sound is what makes a string of clips feel like a film.'],
  ['Days 12–14', 'Edit, check, submit', 'Cut it together, run the export checklist in the guide and submit with a day to spare.'],
]

function welcomeTracker() {
  const cells = WELCOME_STEPS.map((s, i) => {
    const done = i === 0
    const dot = done
      ? `<div style="width:22px;height:22px;border-radius:11px;background:#ffffff;color:${C.indigo};font-size:13px;font-weight:700;line-height:22px;text-align:center;margin:0 auto 6px;">✓</div>`
      : `<div style="width:18px;height:18px;border-radius:11px;border:2px solid rgba(255,255,255,0.55);margin:0 auto 6px;"></div>`
    return `<td style="width:25%;text-align:center;vertical-align:top;color:${done ? '#ffffff' : 'rgba(255,255,255,0.75)'};font-size:11px;font-weight:${done ? 700 : 500};line-height:1.3;">${dot}${s}</td>`
  }).join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;"><tr>${cells}</tr></table>`
}

function welcomePlan() {
  return WELCOME_PLAN.map(([when, title, text], i) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:${i === WELCOME_PLAN.length - 1 ? 0 : 16}px;"><tr>
      <td style="width:34px;vertical-align:top;">
        <div style="width:26px;height:26px;border-radius:13px;background:${C.indigo};color:#ffffff;font-size:12px;font-weight:700;line-height:26px;text-align:center;">${i + 1}</div>
      </td>
      <td style="vertical-align:top;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.indigo};margin:3px 0 2px;">${when}</div>
        <div style="font-family:${DISPLAY};font-size:16px;font-weight:700;color:${C.ink};margin-bottom:3px;">${title}</div>
        <div style="color:${C.body};font-size:14px;line-height:1.6;">${text}</div>
      </td>
    </tr></table>`).join('')
}

export function buildWelcomeEmail(
  name: string | null | undefined,
  picks: ContestEmailItem[] = [],
  /** How many contests are open right now, for the line under the hero. 0 leaves it out. */
  openCount = 0,
): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
  contestIds: string[]
} {
  const firstName = name?.split(' ')[0] ?? null
  const hello = firstName ? `You're in, ${escapeHtml(firstName)}.` : "You're in."
  const subject = picks.length
    ? `You're in. ${picks.length === 1 ? 'One contest' : `${picks.length} contests`} to enter first`
    : "You're on the list: AI Film Contests"
  const packHeading = `Overs Pro for $${OVERS.monthlyUsd} a month`
  const preheader = `Your free creator pack: Overs at ${OVERS_OFF_PERCENT}% off, the contest film guide and Creatives Club.`
  return {
    subject,
    // So the first bundle does not repeat the picks as new.
    contestIds: picks.map(c => c.id).filter((x): x is string => !!x).map(id => `new:${id}`),
    html: unsub => shell(`
  <div style="background:${C.indigo};background-image:linear-gradient(135deg,${C.indigo} 0%,${C.indigoDeep} 100%);border-radius:16px;padding:30px 24px 24px;color:#ffffff;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:10px;">Welcome to AI Film Contests</div>
    <h1 style="font-family:${DISPLAY};font-size:32px;font-weight:700;letter-spacing:-0.03em;line-height:1.05;color:#ffffff;margin:0 0 10px 0;">${hello}</h1>
    <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.88);margin:0;">
      ${picks.length ? 'Below: the contests to start with, your free creator pack, and a two-week plan to get an entry in.' : 'Below: your free creator pack and a two-week plan to get an entry in.'}
    </p>
    ${welcomeTracker()}
  </div>
  ${openCount ? `<p style="text-align:center;color:${C.muted};font-size:12px;margin:12px 0 0 0;">${openCount} contests open right now · checked every day against the organizers' own pages</p>` : ''}

  ${picks.length ? sectionTitle(picks.length === 1 ? 'Start with this one' : `Start with these ${picks.length}`, 'Free to enter, any AI tool allowed, and at least two weeks to make something.') + picks.map(contestCard).join('') : ''}

  ${sectionTitle('Your free creator pack', 'Yours because you signed up. Nothing else to do.')}
  ${oversFeature('welcome', packHeading)}
  ${packExtras()}

  ${sectionTitle('Your first entry in two weeks')}
  <div style="${card}padding:22px 20px;">
    ${welcomePlan()}
    <div style="border-top:1px solid ${C.line};margin-top:20px;padding-top:16px;">
      <a href="${SITE_URL}${GUIDE.path}" style="color:${C.indigoDeep};font-size:14px;font-weight:600;text-decoration:none;">Every step in detail, in the guide →</a>
    </div>
  </div>

  ${sectionTitle('A note from Abhi')}
  <div style="${card}padding:22px 22px 20px;">
    <p style="color:${C.body};font-size:15px;line-height:1.7;margin:0 0 12px 0;">Hey${firstName ? ` ${escapeHtml(firstName)}` : ''},</p>
    <p style="color:${C.body};font-size:15px;line-height:1.7;margin:0 0 12px 0;">
      I'm Abhi. I run AI Film Contests, and the list gets checked every day so you don't spend a weekend on a contest that has already closed.
    </p>
    <p style="color:${C.body};font-size:15px;line-height:1.7;margin:0 0 12px 0;">
      I also built Overs and run Creatives Club, which is why they're in your pack. When you make something for one of these contests,
      post it in <a href="${COMMUNITY.url}" style="color:${C.indigoDeep};font-weight:600;text-decoration:none;">the club</a> or reply here with the link. I want to see it.
    </p>
    <p style="color:${C.ink};font-size:15px;line-height:1.7;margin:0;">Abhi</p>
  </div>

  <div style="${card}padding:18px 20px;margin-top:12px;">
    <p style="color:${C.ink};font-size:14px;font-weight:600;margin:0 0 4px 0;line-height:1.5;">One favour: reply to this email, even just "got it".</p>
    <p style="color:${C.muted};font-size:13px;line-height:1.6;margin:0;">
      It tells Gmail and Outlook you want these, so contest alerts land in Primary instead of Promotions.
      You'll hear from us when a contest opens, before a deadline closes, and once a week with what's closing. Never daily.
    </p>
  </div>

  <div style="text-align:center;margin-top:28px;">
    ${button(SITE_URL, 'See every open contest →')}
  </div>`, unsub, '', preheader),
    text: unsub =>
      `${firstName ? `You're in, ${firstName}.` : "You're in."}\n\n` +
      (openCount ? `${openCount} contests are open right now, checked every day against the organizers' own pages.\n\n` : '') +
      (picks.length ? `START WITH THESE (free, any AI tool, at least two weeks left)\n\n${textList(picks)}\n\n` : '') +
      `YOUR FREE CREATOR PACK\n\n` +
      oversFeatureText('welcome', packHeading) +
      packExtrasText() +
      `YOUR FIRST ENTRY IN TWO WEEKS\n\n` +
      WELCOME_PLAN.map(([when, title, text]) => `${when}: ${title}\n${text}`).join('\n\n') +
      `\n\nEvery step in detail: ${SITE_URL}${GUIDE.path}\n\n` +
      `A NOTE FROM ABHI\n\nI'm Abhi. I run AI Film Contests, and the list gets checked every day so you don't spend a weekend on a contest that has already closed.\n\n` +
      `I also built Overs and run Creatives Club, which is why they're in your pack. When you make something for one of these contests, post it in the club (${COMMUNITY.url}) or reply here with the link. I want to see it.\n\nAbhi\n\n` +
      `One favour: reply "got it" so contest alerts land in Primary. You'll hear from us when a contest opens, before a deadline closes, and once a week with what's closing. Never daily.\n\n` +
      `Every open contest: ${SITE_URL}\n\nUnsubscribe: ${unsub}`,
  }
}

export async function sendWelcomeEmail(
  email: string,
  name?: string | null,
  token?: string | null,
  /** Contests to start with (starterPicks); none and the section is left out. */
  picks: ContestEmailItem[] = [],
  openCount = 0,
) {
  const w = buildWelcomeEmail(name, picks, openCount)
  const result = await sendToRecipients({
    kind: 'welcome',
    subject: w.subject,
    recipients: [{ email, token, name }],
    contestIds: w.contestIds,
    // The signup form waits on this; a welcome record isn't used for dedup.
    recordAttempts: 1,
    html: (_r, unsub) => w.html(unsub),
    text: (_r, unsub) => w.text(unsub),
  })
  return { success: result.success, error: result.error }
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
  <h1 style="font-family:${DISPLAY};font-size:26px;font-weight:700;letter-spacing:-0.025em;line-height:1.15;color:${C.ink};margin:0 0 8px 0;">${
    news.length ? (news.length === 1 ? 'A new contest just opened' : `${news.length} new contests just opened`) : 'Last call'
  }</h1>
  <p style="color:${C.muted};font-size:14px;margin:0 0 8px 0;">Verified against live sources today.</p>
  ${news.length ? sectionTitle('New') + news.map(contestCard).join('') : ''}
  ${soon.length ? sectionTitle('Closing in 3 days', 'Submit now or miss the deadline entirely.') + soon.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:${C.indigo};color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all open contests →</a>
  </div>
  ${oversBlock('pulse')}`

  const badge = `<span style="background:${news.length ? C.indigo : C.red};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${news.length ? `${news.length} New` : 'Closing Soon'}</span>`

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
    ? (news.length === 1 ? 'A new contest just opened' : `${news.length} new contests just opened`)
    : soon.length ? 'Last call' : 'Closing this week'
  const body = `
  <h1 style="font-family:${DISPLAY};font-size:26px;font-weight:700;letter-spacing:-0.025em;line-height:1.15;color:${C.ink};margin:0 0 8px 0;">${h1}</h1>
  <p style="color:${C.muted};font-size:14px;margin:0 0 8px 0;">Everything since your last email, verified against live sources.</p>
  ${news.length ? sectionTitle('New') + news.map(contestCard).join('') : ''}
  ${soon.length ? sectionTitle('Closing in 3 days', 'Submit now or miss the deadline entirely.') + soon.map(contestCard).join('') : ''}
  ${week.length ? sectionTitle('Closing this week') + week.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:${C.indigo};color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all open contests →</a>
  </div>
  ${oversBlock('new_contest')}`
  const badge = news.length
    ? `<span style="background:${C.indigo};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${news.length} New</span>`
    : soon.length ? `<span style="background:${C.red};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">Closing Soon</span>` : ''

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
  <h1 style="font-family:${DISPLAY};font-size:26px;font-weight:700;letter-spacing:-0.025em;line-height:1.15;color:${C.ink};margin:0 0 8px 0;">Your week in AI film contests</h1>
  <p style="color:${C.muted};font-size:14px;margin:0 0 8px 0;">${sorted.length} open · all verified against live sources.</p>
  ${closing.length ? sectionTitle('Closing this week', "Don't miss your window to submit.") + closing.map(contestCard).join('') : ''}
  ${fresh.length ? sectionTitle('New this week') + fresh.map(contestCard).join('') : ''}
  ${rest.length ? sectionTitle('Also open', 'Sorted by deadline.') + rest.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:${C.indigo};color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all ${sorted.length} contests →</a>
  </div>
  ${oversBlock('weekly_digest')}`

  return sendToRecipients({
    kind: 'weekly_digest',
    subject,
    recipients: subscribers,
    contestIds: [...closing, ...fresh].map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub, `<span style="color:${C.faint};font-size:12px;">Weekly digest</span>`),
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

  const body = `
  <div style="color:${C.faint};font-size:12px;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">${escapeHtml(c.organizer)}</div>
  <h1 style="font-family:${DISPLAY};font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1.1;color:${C.ink};margin:0 0 8px 0;">${escapeHtml(c.name)} is open</h1>
  <div style="color:${C.indigo};font-size:20px;font-weight:700;margin-bottom:16px;">${escapeHtml(c.prize)}</div>
  <p style="color:${C.body};font-size:15px;line-height:1.65;margin:0 0 18px 0;">${escapeHtml(c.description)}</p>

  <div style="${card}padding:18px 22px;margin-bottom:12px;">
    <div style="color:${C.ink};font-size:14px;font-weight:600;line-height:1.9;">${facts.map(escapeHtml).join('<br>')}</div>
    ${details.length ? `<div style="color:${C.body};font-size:13px;line-height:1.7;margin-top:10px;">${details.map(escapeHtml).join('<br>')}</div>` : ''}
  </div>
  <div style="margin:18px 0 28px 0;">
    ${button(c.url, 'Read the rules and enter →')}
  </div>

  ${oversFeature('custom', 'Make your entry for $3 a month')}

  <p style="color:${C.muted};font-size:13px;line-height:1.6;margin:0;">
    More open contests, with the tools each one allows: <a href="${SITE_URL}" style="color:${C.indigoDeep};text-decoration:none;">aifilmcontests.com</a>
  </p>`

  return {
    subject,
    html: unsub => shell(body, unsub, `<span style="color:${C.faint};font-size:12px;">Spotlight</span>`),
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
  <h1 style="font-family:${DISPLAY};font-size:26px;font-weight:700;letter-spacing:-0.025em;line-height:1.15;color:${C.ink};margin:0 0 8px 0;">${sorted.length === 1 ? 'This contest closes soon' : `${sorted.length} contests closing this week`}</h1>
  <p style="color:${C.muted};font-size:14px;margin:0 0 24px 0;">Don't miss your window to submit.</p>
  ${sorted.map(contestCard).join('')}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:${C.indigoDeep};font-size:13px;font-weight:600;text-decoration:none;">See all deadlines →</a>
  </div>`
  return sendToRecipients({
    kind: 'reminder_7day',
    subject,
    recipients: subscribers,
    contestIds: sorted.map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub),
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
