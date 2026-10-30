import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'
import { isMissingRelation, withDbRetry, type DbRetryOptions } from './db-health'
import { COMMUNITY, GUIDE, OVERS_OFF_PERCENT } from './creator-pack'

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

const emailBase = `background-color:#09090f;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;margin:0;padding:0;`
const wrap = `max-width:580px;margin:0 auto;padding:40px 24px;`
const wordmark = `<span style="font-size:15px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4f46e5;font-family:sans-serif;">AI Film Contests</span>`

function hr() {
  return `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">`
}

function footer(unsubscribeLink: string) {
  return `
    <div style="color:#3f3f46;font-size:12px;text-align:center;line-height:1.8;">
      <a href="${SITE_URL}" style="color:#3f3f46;text-decoration:none;">${SITE_URL}</a>
      &nbsp;·&nbsp;
      <a href="${unsubscribeLink}" style="color:#3f3f46;text-decoration:underline;">Unsubscribe</a>
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
    ? `<span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px;">New</span>`
    : c.daysLeft != null
    ? `<span style="color:#ef4444;font-size:12px;font-weight:700;margin-left:8px;">🔴 ${c.daysLeft}d left</span>`
    : ''

  return `
    <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:12px;">
      <div style="margin-bottom:4px;">
        <span style="color:#71717a;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(c.organizer)}</span>
        ${badge}
      </div>
      <div style="font-size:17px;font-weight:700;margin-bottom:6px;color:#fff;">${escapeHtml(c.name)}</div>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.55;margin-bottom:14px;">${escapeHtml(c.description)}</div>
      <div>
        <span style="color:#4f46e5;font-weight:700;font-size:15px;">${escapeHtml(c.prize)}</span>
        <span style="color:#52525b;font-size:13px;margin-left:12px;">Due ${fmtDate(c.deadline)}</span>
        &nbsp;&nbsp;
        <a href="${c.url}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">Apply →</a>
      </div>
    </div>`
}

function sectionTitle(title: string, sub?: string) {
  return `
    <h2 style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;margin:28px 0 12px 0;">${title}</h2>
    ${sub ? `<p style="color:#52525b;font-size:13px;margin:-6px 0 14px 0;">${sub}</p>` : ''}`
}

function shell(body: string, unsub: string, topRight = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${emailBase}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
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

/** The short block under the contests in bundles, pulses and digests. */
function oversBlock(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `
  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px 20px;margin-top:28px;">
    <div style="color:#d4d4d8;font-size:14px;line-height:1.6;"><strong style="color:#fff;">Making your entry?</strong> ${OVERS_LINE}</div>
    <div style="margin-top:8px;"><a href="${oversLink(kind)}" style="color:#818cf8;font-size:13px;font-weight:600;text-decoration:none;">Try Overs for $3 →</a>
    <span style="color:#52525b;font-size:12px;margin-left:8px;">Made by Abhi, who runs AI Film Contests.</span></div>
  </div>`
}

function oversText(kind: EmailKind) {
  if (!oversEnabled()) return ''
  return `MAKING YOUR ENTRY?\n${OVERS_LINE}\nTry Overs for $3: ${oversLink(kind)}\n(Made by Abhi, who runs AI Film Contests.)\n\n`
}

/** The larger version for the welcome and spotlight emails. */
function oversFeature(kind: EmailKind, heading: string) {
  if (!oversEnabled()) return ''
  return `
  <div style="border:1px solid rgba(79,70,229,0.3);border-radius:10px;padding:22px 22px 20px;margin:28px 0;background:rgba(79,70,229,0.07);">
    <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;">${heading}</div>
    <p style="color:#d4d4d8;font-size:15px;line-height:1.6;margin:0 0 10px 0;">
      I built Overs so you can make the stills and clips for an entry without another big subscription.
      Type a shot and it makes the stills. Pick one and it becomes a clip that opens exactly on that frame.
    </p>
    <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
      For people on this list, Overs Pro is <strong style="color:#e4e4e7;">$3 a month for your first 3 months</strong>, then $39. Cancel any time.
      It runs on your own OpenRouter key, so each clip costs what the video model charges, with no markup.
    </p>
    <a href="${oversLink(kind)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;">Get Overs for $3 →</a>
  </div>`
}

/** The other two pieces of the creator pack, under the Overs offer in the welcome. */
function packExtras() {
  const row = (title: string, text: string, href: string, cta: string) => `
    <div style="border-top:1px solid rgba(255,255,255,0.07);padding:14px 0;">
      <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:4px;">${title}</div>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.6;margin-bottom:6px;">${text}</div>
      <a href="${href}" style="color:#818cf8;font-size:13px;font-weight:600;text-decoration:none;">${cta} →</a>
    </div>`
  return `
  <div style="margin:0 0 28px 0;">
    ${row(escapeHtml(GUIDE.title), 'Every step from reading the rules to exporting the file: shot list, look, stills, clips, sound, and the checks that get entries thrown out.', `${SITE_URL}${GUIDE.path}`, 'Read the guide')}
    ${row(COMMUNITY.name, 'My free community on Skool for people learning AI creative workflows. Ask questions and see how others build their shots.', COMMUNITY.url, 'Join free')}
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
export function buildWelcomeEmail(name: string | null | undefined, picks: ContestEmailItem[] = []): {
  subject: string
  html: (unsub: string) => string
  text: (unsub: string) => string
  contestIds: string[]
} {
  const firstName = name?.split(' ')[0] ?? null
  const greeting = firstName ? `Hey ${escapeHtml(firstName)},` : 'Hey,'
  const subject = picks.length
    ? `You're in. ${picks.length === 1 ? 'One contest' : `${picks.length} contests`} to enter first`
    : "You're on the list: AI Film Contests"
  return {
    subject,
    // So the first bundle does not repeat the picks as new.
    contestIds: picks.map(c => c.id).filter((x): x is string => !!x).map(id => `new:${id}`),
    html: unsub => shell(`
  <h1 style="font-size:26px;font-weight:700;margin:0 0 6px 0;line-height:1.25;">${greeting}</h1>
  <h2 style="font-size:26px;font-weight:400;margin:0 0 20px 0;line-height:1.25;color:#a1a1aa;">You're on the list.</h2>

  <p style="color:#a1a1aa;font-size:15px;line-height:1.65;margin-bottom:8px;">
    We track every AI film competition and check them daily against live sources.
    ${picks.length ? 'Here are the ones to start with: free to enter, any AI tool allowed, and at least two weeks to make something.' : ''}
  </p>

  ${picks.length ? sectionTitle(picks.length === 1 ? 'Start with this one' : `Start with these ${picks.length}`) + picks.map(contestCard).join('') : ''}

  ${sectionTitle('Your free creator pack')}
  ${oversFeature('welcome', `Overs Pro, ${OVERS_OFF_PERCENT}% off: $3 a month`)}
  ${packExtras()}

  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;">What you'll get from us</div>
    <div style="color:#d4d4d8;font-size:14px;line-height:2.2;">
      New contests, a day or two after they open<br>
      A last call before a deadline closes<br>
      What's closing this week, once a week<br>
      A few emails a month, never daily spam
    </div>
  </div>

  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:28px;">
    <p style="color:#d4d4d8;font-size:15px;font-weight:600;margin:0 0 8px 0;line-height:1.4;">
      One favour: reply to this email, even just "got it".
    </p>
    <p style="color:#a1a1aa;font-size:14px;line-height:1.65;margin:0;">
      It tells Gmail and Outlook you want these, so the alerts land in your <strong style="color:#e4e4e7;">Primary</strong> inbox instead of Promotions.
    </p>
  </div>

  <div style="text-align:center;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.02em;">See every open contest →</a>
  </div>`, unsub),
    text: unsub =>
      `${firstName ? `Hey ${firstName},` : 'Hey,'}\n\nYou're on the list. We track every AI film competition and check them daily.\n\n` +
      (picks.length ? `START WITH THESE (free, any AI tool, at least two weeks left)\n\n${textList(picks)}\n\n` : '') +
      `YOUR FREE CREATOR PACK\n\n` +
      oversFeatureText('welcome', `Overs Pro, ${OVERS_OFF_PERCENT}% off: $3 a month`) +
      packExtrasText() +
      `What you'll get from us:\n- New contests, a day or two after they open\n- A last call before a deadline closes\n- What's closing this week, once a week\n- A few emails a month, never daily spam\n\n` +
      `One favour: reply "got it" so the alerts land in your Primary inbox.\n\nEvery open contest: ${SITE_URL}\n\nUnsubscribe: ${unsub}`,
  }
}

export async function sendWelcomeEmail(
  email: string,
  name?: string | null,
  token?: string | null,
  /** Contests to start with (starterPicks); none and the section is left out. */
  picks: ContestEmailItem[] = [],
) {
  const w = buildWelcomeEmail(name, picks)
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
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${
    news.length ? (news.length === 1 ? 'A new contest just opened' : `${news.length} new contests just opened`) : 'Last call'
  }</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 8px 0;">Verified against live sources today.</p>
  ${news.length ? sectionTitle('New') + news.map(contestCard).join('') : ''}
  ${soon.length ? sectionTitle('Closing in 3 days', 'Submit now or miss the deadline entirely.') + soon.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all open contests →</a>
  </div>
  ${oversBlock('pulse')}`

  const badge = `<span style="background:${news.length ? '#4f46e5' : '#dc2626'};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${news.length ? `${news.length} New` : 'Closing Soon'}</span>`

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
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${h1}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 8px 0;">Everything since your last email, verified against live sources.</p>
  ${news.length ? sectionTitle('New') + news.map(contestCard).join('') : ''}
  ${soon.length ? sectionTitle('Closing in 3 days', 'Submit now or miss the deadline entirely.') + soon.map(contestCard).join('') : ''}
  ${week.length ? sectionTitle('Closing this week') + week.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all open contests →</a>
  </div>
  ${oversBlock('new_contest')}`
  const badge = news.length
    ? `<span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${news.length} New</span>`
    : soon.length ? `<span style="background:#dc2626;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">Closing Soon</span>` : ''

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
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">Your week in AI film contests</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 8px 0;">${sorted.length} open · all verified against live sources.</p>
  ${closing.length ? sectionTitle('Closing this week', "Don't miss your window to submit.") + closing.map(contestCard).join('') : ''}
  ${fresh.length ? sectionTitle('New this week') + fresh.map(contestCard).join('') : ''}
  ${rest.length ? sectionTitle('Also open', 'Sorted by deadline.') + rest.map(contestCard).join('') : ''}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all ${sorted.length} contests →</a>
  </div>
  ${oversBlock('weekly_digest')}`

  return sendToRecipients({
    kind: 'weekly_digest',
    subject,
    recipients: subscribers,
    contestIds: [...closing, ...fresh].map(c => c.id).filter((x): x is string => !!x),
    html: (_r, unsub) => shell(body, unsub, `<span style="color:#52525b;font-size:12px;">Weekly digest</span>`),
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
  <div style="color:#71717a;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">${escapeHtml(c.organizer)}</div>
  <h1 style="font-size:26px;font-weight:700;margin:0 0 8px 0;line-height:1.25;">${escapeHtml(c.name)} is open</h1>
  <div style="color:#818cf8;font-size:20px;font-weight:700;margin-bottom:16px;">${escapeHtml(c.prize)}</div>
  <p style="color:#a1a1aa;font-size:15px;line-height:1.65;margin:0 0 18px 0;">${escapeHtml(c.description)}</p>

  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px 22px;margin-bottom:12px;">
    <div style="color:#fff;font-size:14px;font-weight:600;line-height:1.9;">${facts.map(escapeHtml).join('<br>')}</div>
    ${details.length ? `<div style="color:#a1a1aa;font-size:13px;line-height:1.7;margin-top:10px;">${details.map(escapeHtml).join('<br>')}</div>` : ''}
  </div>
  <div style="margin:18px 0 0 0;">
    <a href="${c.url}" style="display:inline-block;background:#fff;color:#09090f;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700;">Read the rules and enter →</a>
  </div>

  ${oversFeature('custom', 'Make your entry for $3 a month')}

  <p style="color:#71717a;font-size:13px;line-height:1.6;margin:0;">
    More open contests, with the tools each one allows: <a href="${SITE_URL}" style="color:#818cf8;text-decoration:none;">aifilmcontests.com</a>
  </p>`

  return {
    subject,
    html: unsub => shell(body, unsub, `<span style="color:#52525b;font-size:12px;">Spotlight</span>`),
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
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${sorted.length === 1 ? 'This contest closes soon' : `${sorted.length} contests closing this week`}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Don't miss your window to submit.</p>
  ${sorted.map(contestCard).join('')}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">See all deadlines →</a>
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
