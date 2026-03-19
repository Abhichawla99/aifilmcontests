/**
 * notify-subscribers.mjs
 *
 * Called by the daily agent after Step 5.
 * Usage:
 *   node scripts/notify-subscribers.mjs --new-ids id1,id2,id3
 *   node scripts/notify-subscribers.mjs --weekly
 *   node scripts/notify-subscribers.mjs --reminders
 *
 * Flags:
 *   --new-ids <id,id,...>   Send "new contest" alert for these contest IDs
 *   --weekly                Send Monday digest of all open contests
 *   --reminders             Send 7-day deadline reminders (always safe to run daily)
 *   --dry-run               Print what would be sent, don't actually send
 */

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env.local')

// ── Load env ──────────────────────────────────────────────────────────────────
const env = {}
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i === -1) continue
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']
const RESEND_KEY = env['RESEND_API_KEY']
const FROM_EMAIL = env['FROM_EMAIL'] || 'contests@aifilmcontests.com'
const SITE_URL = env['NEXT_PUBLIC_SITE_URL'] || 'https://aifilmcontests.com'

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── Parse args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const sendWeekly = args.includes('--weekly')
const sendReminders = args.includes('--reminders')
const newIdsArg = args.indexOf('--new-ids')
const newIds = newIdsArg !== -1 ? args[newIdsArg + 1]?.split(',').filter(Boolean) : []

if (!newIds.length && !sendWeekly && !sendReminders) {
  console.log('No action specified. Use --new-ids, --weekly, or --reminders.')
  process.exit(0)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const baseStyle = `background-color:#09090f;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;margin:0;padding:0;`
const wrap = `max-width:580px;margin:0 auto;padding:40px 24px;`
const hr = `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">`
const footer = `<div style="color:#3f3f46;font-size:12px;text-align:center;line-height:1.7;"><a href="${SITE_URL}" style="color:#3f3f46;text-decoration:none;">${SITE_URL}</a> &nbsp;·&nbsp; Reply "unsubscribe" to opt out</div>`
const wordmark = `<span style="font-size:15px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4f46e5;">AI Film Contests</span>`

function contestCard(c, opts = {}) {
  const badge = opts.isNew
    ? `<span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px;">New</span>`
    : opts.daysLeft != null
    ? `<span style="color:#ef4444;font-size:12px;font-weight:700;margin-left:8px;">🔴 ${opts.daysLeft}d left</span>`
    : ''
  return `
    <div style="border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px;margin-bottom:12px;">
      <div style="margin-bottom:4px;">
        <span style="color:#71717a;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${c.organizer}</span>
        ${badge}
      </div>
      <div style="font-size:17px;font-weight:700;margin-bottom:6px;color:#fff;">${c.name}</div>
      <div style="color:#a1a1aa;font-size:14px;line-height:1.55;margin-bottom:14px;">${c.description}</div>
      <div>
        <span style="color:#4f46e5;font-weight:700;font-size:15px;">${c.prize}</span>
        <span style="color:#52525b;font-size:13px;margin-left:12px;">Due ${fmtDate(c.deadline)}</span>
        &nbsp;&nbsp;
        <a href="${c.url}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">Apply →</a>
      </div>
    </div>`
}

async function getSubscriberEmails() {
  const { data, error } = await sb
    .from('subscribers')
    .select('email')
    .eq('confirmed', true)
  if (error) throw new Error('Failed to fetch subscribers: ' + error.message)
  return data.map(r => r.email)
}

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) {
    console.log(`[Dev] Would send "${subject}" to ${Array.isArray(to) ? to.length + ' subscribers' : to}`)
    return
  }
  const resend = new Resend(RESEND_KEY)
  if (Array.isArray(to) && to.length === 0) {
    console.log(`[Skip] No subscribers for: ${subject}`)
    return
  }
  const payload = Array.isArray(to)
    ? { from: `AI Film Contests <${FROM_EMAIL}>`, to: FROM_EMAIL, bcc: to, subject, html }
    : { from: `AI Film Contests <${FROM_EMAIL}>`, to, subject, html }

  await resend.emails.send(payload)
  console.log(`✉️  Sent "${subject}" → ${Array.isArray(to) ? to.length + ' subscribers' : to}`)
}

// ── Action: new contest alerts ────────────────────────────────────────────────

if (newIds.length > 0) {
  console.log(`\n📢 New contest alert for IDs: ${newIds.join(', ')}`)

  const { data: contests, error } = await sb
    .from('contests')
    .select('id, name, organizer, prize, deadline, url, description')
    .in('id', newIds)

  if (error) {
    console.error('Failed to fetch new contests:', error.message)
    process.exit(1)
  }

  if (!contests.length) {
    console.log('No contests found for those IDs.')
    process.exit(0)
  }

  const subscribers = await getSubscriberEmails()
  console.log(`Found ${contests.length} contest(s), ${subscribers.length} subscriber(s)`)

  if (dryRun) {
    console.log('[DRY RUN] Would send new contest alert:')
    contests.forEach(c => console.log(`  - ${c.name} (${c.prize}) due ${c.deadline}`))
    process.exit(0)
  }

  const plural = contests.length > 1
  const subject = plural
    ? `${contests.length} new AI film contests just opened`
    : `New contest: ${contests[0].name}`

  const cards = contests.map(c => contestCard(c, { isNew: true })).join('')

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    <span style="background:#4f46e5;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:4px;">${plural ? contests.length + ' New' : '1 New'}</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${plural ? contests.length + ' new contests just opened' : 'A new contest just opened'}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Verified against live sources today.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">View all open contests →</a>
  </div>
  ${hr}${footer}
</div></body></html>`

  // Batch in 50s
  const batchSize = 50
  for (let i = 0; i < subscribers.length; i += batchSize) {
    await sendEmail(subscribers.slice(i, i + batchSize), subject, html)
  }
  console.log(`✅ New contest alerts sent.`)
}

// ── Action: 7-day deadline reminders ─────────────────────────────────────────

if (sendReminders) {
  console.log(`\n⏰ Checking for contests closing in ≤7 days...`)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7 = new Date(today)
  in7.setDate(today.getDate() + 7)
  const in8 = new Date(today)
  in8.setDate(today.getDate() + 8)

  const { data: urgent, error } = await sb
    .from('contests')
    .select('id, name, organizer, prize, deadline, url, description')
    .eq('status', 'open')
    .gte('deadline', today.toISOString().slice(0, 10))
    .lte('deadline', in7.toISOString().slice(0, 10))
    .order('deadline')

  if (error) {
    console.error('Failed to fetch urgent contests:', error.message)
    process.exit(1)
  }

  if (!urgent.length) {
    console.log('No contests closing in ≤7 days. Skipping reminders.')
  } else {
    const subscribers = await getSubscriberEmails()
    console.log(`Found ${urgent.length} urgent contest(s), ${subscribers.length} subscriber(s)`)

    if (dryRun) {
      console.log('[DRY RUN] Would send deadline reminders:')
      urgent.forEach(c => console.log(`  - ${c.name}: ${daysUntil(c.deadline)}d left`))
    } else {
      const withDays = urgent.map(c => ({ ...c, daysLeft: daysUntil(c.deadline) }))
      const sorted = withDays.sort((a, b) => a.daysLeft - b.daysLeft)

      const subject = sorted.length === 1
        ? `⏰ ${sorted[0].daysLeft} days left: ${sorted[0].name}`
        : `⏰ ${sorted.length} contests closing this week`

      const cards = sorted.map(c => contestCard(c, { daysLeft: c.daysLeft })).join('')

      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
<div style="${wrap}">
  <div style="margin-bottom:28px;">${wordmark}</div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${sorted.length === 1 ? 'This contest closes soon' : sorted.length + ' contests closing this week'}</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Don't miss your window to submit.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="color:#4f46e5;font-size:13px;font-weight:600;text-decoration:none;">See all deadlines →</a>
  </div>
  ${hr}${footer}
</div></body></html>`

      const batchSize = 50
      for (let i = 0; i < subscribers.length; i += batchSize) {
        await sendEmail(subscribers.slice(i, i + batchSize), subject, html)
      }
      console.log(`✅ Deadline reminders sent.`)
    }
  }
}

// ── Action: weekly digest ─────────────────────────────────────────────────────

if (sendWeekly) {
  console.log(`\n📰 Sending weekly digest...`)

  const { data: open, error } = await sb
    .from('contests')
    .select('id, name, organizer, prize, deadline, url, description')
    .eq('status', 'open')
    .order('deadline')

  if (error) {
    console.error('Failed to fetch open contests:', error.message)
    process.exit(1)
  }

  const subscribers = await getSubscriberEmails()
  console.log(`${open.length} open contest(s), ${subscribers.length} subscriber(s)`)

  if (dryRun) {
    console.log('[DRY RUN] Would send weekly digest with:')
    open.forEach(c => console.log(`  - ${c.name} (${c.prize}) due ${c.deadline}`))
    process.exit(0)
  }

  const subject = `${open.length} AI film contest${open.length !== 1 ? 's' : ''} open right now`
  const cards = open.map(c => contestCard(c)).join('')

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
<div style="${wrap}">
  <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
    ${wordmark}
    <span style="color:#52525b;font-size:12px;">Weekly digest</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin:0 0 6px 0;">${open.length} contest${open.length !== 1 ? 's' : ''} open right now</h1>
  <p style="color:#71717a;font-size:14px;margin:0 0 24px 0;">Sorted by deadline. All verified against live sources.</p>
  ${cards}
  <div style="text-align:center;margin-top:24px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-size:14px;font-weight:600;">View all contests →</a>
  </div>
  ${hr}${footer}
</div></body></html>`

  const batchSize = 50
  for (let i = 0; i < subscribers.length; i += batchSize) {
    await sendEmail(subscribers.slice(i, i + batchSize), subject, html)
  }
  console.log(`✅ Weekly digest sent.`)
}
