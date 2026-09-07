import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'
import { isMissingRelation } from './db-health'

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
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

async function logSends(rows: Array<{
  email_type: string; recipient: string; subject: string; resend_email_id: string | null; contest_ids: string[] | null
}>) {
  if (!rows.length) return
  try {
    const { error } = await supabaseAdmin.from('email_sends').insert(rows)
    if (error && !isMissingRelation(error)) console.error('[email_sends] insert failed:', error.message)
  } catch (e) {
    console.error('[email_sends] insert threw:', e)
  }
}

export async function sendToRecipients(opts: {
  kind: EmailKind
  subject: string
  recipients: Array<string | Recipient>
  html: (r: Recipient, unsubUrl: string) => string
  text?: (r: Recipient, unsubUrl: string) => string
  contestIds?: string[]
  replyTo?: string
}): Promise<SendResult> {
  const recipients = normalizeRecipients(opts.recipients)
  if (!recipients.length) return { success: true, sent: 0, failed: 0 }

  if (!process.env.RESEND_API_KEY) {
    console.log(`[Dev] ${opts.kind} → ${recipients.length} recipients: "${opts.subject}"`)
    return { success: true, sent: recipients.length, failed: 0 }
  }

  const resend = getResend()
  let sent = 0
  let failed = 0

  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH)
    const payload = chunk.map(r => {
      const unsub = unsubscribeUrl(r.token)
      return {
        from: `AI Film Contests <${FROM_EMAIL}>`,
        to: [r.email],
        reply_to: opts.replyTo ?? REPLY_TO,
        subject: opts.subject,
        headers: listUnsubscribeHeaders(unsub),
        tags: [{ name: 'kind', value: opts.kind }],
        html: opts.html(r, unsub),
        ...(opts.text ? { text: opts.text(r, unsub) } : {}),
      }
    })

    try {
      const res = await resend.batch.send(payload)
      if (res.error) {
        console.error(`[Email] ${opts.kind} batch error:`, res.error)
        failed += chunk.length
        if (isQuotaError(res.error)) {
          return { success: false, sent, failed: failed + (recipients.length - i - chunk.length), quotaExceeded: true, error: res.error }
        }
        continue
      }
      const ids = res.data?.data ?? []
      sent += chunk.length
      await logSends(chunk.map((r, idx) => ({
        email_type: opts.kind,
        recipient: r.email,
        subject: opts.subject,
        resend_email_id: ids[idx]?.id ?? null,
        contest_ids: opts.contestIds ?? null,
      })))
    } catch (err) {
      console.error(`[Email] ${opts.kind} batch threw:`, err)
      failed += chunk.length
      if (isQuotaError(err)) {
        return { success: false, sent, failed, quotaExceeded: true, error: err }
      }
    }

    if (i + BATCH < recipients.length) await sleep(700) // stay under Resend's 2 req/s
  }

  return { success: failed === 0, sent, failed }
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

export async function sendWelcomeEmail(
  email: string,
  name?: string | null,
  token?: string | null,
) {
  const firstName = name?.split(' ')[0] ?? null
  const greeting = firstName ? `Hey ${escapeHtml(firstName)},` : 'Hey,'

  const result = await sendToRecipients({
    kind: 'welcome',
    subject: "You're on the list — AI Film Contests",
    recipients: [{ email, token, name }],
    html: (_r, unsub) => shell(`
  <h1 style="font-size:26px;font-weight:700;margin:0 0 6px 0;line-height:1.25;">${greeting}</h1>
  <h2 style="font-size:26px;font-weight:400;margin:0 0 20px 0;line-height:1.25;color:#a1a1aa;">You're officially on the list.</h2>

  <p style="color:#a1a1aa;font-size:15px;line-height:1.65;margin-bottom:28px;">
    We track every AI film competition and verify them daily against live sources.
    You'll hear from us only when something matters.
  </p>

  <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;">What you'll receive</div>
    <div style="color:#d4d4d8;font-size:14px;line-height:2.2;">
      ✦&nbsp;&nbsp;New contest alerts, the day they open<br>
      ✦&nbsp;&nbsp;A Monday digest: what's open and what closes this week<br>
      ✦&nbsp;&nbsp;One last-call ping 3 days before a deadline<br>
      ✦&nbsp;&nbsp;Never more than one email a day
    </div>
  </div>

  <div style="border:1px solid rgba(79,70,229,0.3);border-radius:10px;padding:20px 22px;margin-bottom:28px;background:rgba(79,70,229,0.07);">
    <div style="font-size:13px;font-weight:700;color:#818cf8;letter-spacing:0.02em;margin-bottom:8px;">⚡ One quick step — takes 5 seconds</div>
    <p style="color:#d4d4d8;font-size:15px;font-weight:600;margin:0 0 8px 0;line-height:1.4;">
      Reply to this email to make sure every alert lands in your inbox.
    </p>
    <p style="color:#a1a1aa;font-size:14px;line-height:1.65;margin:0;">
      Even a simple "got it" is enough. Replying tells Gmail and Outlook that you want our emails,
      so future alerts skip Promotions and go straight to your <strong style="color:#e4e4e7;">Primary</strong> inbox.
    </p>
  </div>

  <div style="text-align:center;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.02em;">Browse Open Contests →</a>
  </div>`, unsub),
    text: (_r, unsub) =>
      `${firstName ? `Hey ${firstName},` : 'Hey,'}\n\nYou're on the list. We track every AI film competition and verify them daily.\n\n` +
      `What you'll receive:\n- New contest alerts, the day they open\n- A Monday digest: what's open and what closes this week\n- One last-call ping 3 days before a deadline\n- Never more than one email a day\n\n` +
      `Quick favour: reply "got it" to this email so future alerts land in your Primary inbox.\n\nBrowse open contests: ${SITE_URL}\n\nUnsubscribe: ${unsub}`,
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
  </div>`

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
      `All open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
  })
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
  </div>`

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
      `All open contests: ${SITE_URL}\nUnsubscribe: ${unsub}`,
  })
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
