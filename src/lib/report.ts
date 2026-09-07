import { supabaseAdmin } from './supabase'
import { getSetting, isMissingRelation, migrationApplied } from './db-health'

// Builds the daily plain-English report. Everything is best-effort: if a table
// or column doesn't exist yet, that section says so instead of crashing.

const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'
const PRICE_CENTS  = Number(process.env.FEATURED_PRICE_CENTS || 4900)
const PRICE_LABEL  = process.env.FEATURED_PRICE_LABEL || '$49 for 30 days'

export interface DailyReport {
  date: string
  headline: string
  headlineShort: string
  text: string
  html: string
  todos: string[]
  data: Record<string, unknown>
}

type AnyRow = Record<string, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function count(table: string, apply?: (q: any) => any): Promise<number | null> {
  try {
    let q = supabaseAdmin.from(table).select('*', { count: 'exact', head: true })
    if (apply) q = apply(q)
    const { count: c, error } = await q
    if (error) return null
    return c ?? 0
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function rows<T = AnyRow>(table: string, apply: (q: any) => any): Promise<{ data: T[]; missing: boolean; error?: string }> {
  try {
    const { data, error } = await apply(supabaseAdmin.from(table))
    if (error) return { data: [], missing: isMissingRelation(error), error: error.message }
    return { data: (data ?? []) as T[], missing: false }
  } catch (e) {
    return { data: [], missing: false, error: String(e) }
  }
}

const n = (v: number | null | undefined) => (v == null ? '?' : String(v))
const plural = (v: number, one: string, many = one + 's') => `${v} ${v === 1 ? one : many}`
const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '0%')
const money = (cents: number) => `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
const dayDiff = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / 86_400_000)

export async function buildDailyReport(): Promise<DailyReport> {
  const now = new Date()
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const yStart = new Date(dayStart.getTime() - 86_400_000)
  const d2 = new Date(now.getTime() - 2 * 86_400_000)
  const d7 = new Date(now.getTime() - 7 * 86_400_000)
  const d30 = new Date(now.getTime() - 30 * 86_400_000)
  const h36 = new Date(now.getTime() - 36 * 3_600_000)
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const lastMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  const today = dayStart.toISOString().slice(0, 10)
  const in3 = new Date(dayStart.getTime() + 3 * 86_400_000).toISOString().slice(0, 10)

  const migrated = await migrationApplied()

  // ── People ──────────────────────────────────────────────────────────────────
  const [total, active, left, newYesterday, newMonth, newLastMonth, new7] = await Promise.all([
    count('subscribers'),
    count('subscribers', q => q.eq('confirmed', true)),
    count('subscribers', q => q.eq('confirmed', false)),
    count('subscribers', q => q.gte('created_at', yStart.toISOString()).lt('created_at', dayStart.toISOString())),
    count('subscribers', q => q.gte('created_at', monthStart.toISOString())),
    count('subscribers', q => q.gte('created_at', lastMonthStart.toISOString()).lt('created_at', monthStart.toISOString())),
    count('subscribers', q => q.gte('created_at', d7.toISOString())),
  ])

  const src = await rows<{ source: string | null }>('subscribers', q =>
    q.select('source').gte('created_at', d30.toISOString()).not('source', 'is', null).limit(2000))
  const sourceTally = new Map<string, number>()
  for (const r of src.data) if (r.source) sourceTally.set(r.source, (sourceTally.get(r.source) ?? 0) + 1)
  const topSources = Array.from(sourceTally.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4)

  // ── Engagement (Resend webhook → email_events) ──────────────────────────────
  const ev = await rows<{ event_type: string; recipient: string | null; created_at: string }>('email_events', q =>
    q.select('event_type,recipient,created_at').gte('created_at', d30.toISOString()).limit(20000))
  const opened = new Set<string>(), clicked = new Set<string>()
  let complaints7 = 0, bounces7 = 0, anyEventsEver = ev.data.length > 0
  for (const e of ev.data) {
    if (!e.recipient) continue
    if (e.event_type === 'opened') opened.add(e.recipient)
    if (e.event_type === 'clicked') { clicked.add(e.recipient); opened.add(e.recipient) }
    const recent = new Date(e.created_at) >= d7
    if (recent && e.event_type === 'complained') complaints7++
    if (recent && e.event_type === 'bounced') bounces7++
  }
  if (!anyEventsEver && !ev.missing) {
    const everCount = await count('email_events')
    anyEventsEver = (everCount ?? 0) > 0
  }
  const engagementMeasurable = !ev.missing && anyEventsEver

  // ── Emails ──────────────────────────────────────────────────────────────────
  const sentYesterday = await count('email_sends', q => q.gte('sent_at', yStart.toISOString()).lt('sent_at', dayStart.toISOString()))
  const sent7 = await count('email_sends', q => q.gte('sent_at', d7.toISOString()))
  const lastSend = await rows<{ sent_at: string; email_type: string }>('email_sends', q =>
    q.select('sent_at,email_type').order('sent_at', { ascending: false }).limit(1))
  let lastEmailAt: Date | null = lastSend.data[0] ? new Date(lastSend.data[0].sent_at) : null
  let sends7Approx: number | null = sent7
  if (lastSend.missing || !lastEmailAt) {
    // Fall back to the old per-contest log
    const legacy = await rows<{ sent_at: string; recipient_count: number }>('email_logs', q =>
      q.select('sent_at,recipient_count').order('sent_at', { ascending: false }).limit(200))
    if (legacy.data[0] && !lastEmailAt) lastEmailAt = new Date(legacy.data[0].sent_at)
    if (sends7Approx == null) sends7Approx = legacy.data.filter(r => new Date(r.sent_at) >= d7).reduce((a, r) => a + (r.recipient_count ?? 0), 0)
  }
  const daysSinceEmail = lastEmailAt ? dayDiff(now, lastEmailAt) : null

  const notifyFail = await rows<{ summary: string; ran_at: string }>('agent_runs', q =>
    q.select('summary,ran_at').eq('task', 'notify').eq('status', 'failed').gte('ran_at', d2.toISOString()).order('ran_at', { ascending: false }).limit(1))
  const quotaLogged = /quota|refused|stopped us/i.test(notifyFail.data[0]?.summary ?? '')
  const lastNotify = await rows<{ status: string; summary: string | null; details: Record<string, unknown> | null; ran_at: string }>('agent_runs', q =>
    q.select('status,summary,details,ran_at').eq('task', 'notify').order('ran_at', { ascending: false }).limit(1))
  const nd = (lastNotify.data[0]?.details ?? {}) as { waiting?: number; backlogDays?: number; dailyBudget?: number; sent?: number }
  const peopleWaiting = Number(nd.waiting ?? 0)
  const backlogDays = Number(nd.backlogDays ?? 0)
  const dailyBudget = Number(nd.dailyBudget ?? (process.env.EMAIL_DAILY_BUDGET ?? 80))

  // Things that SHOULD have been emailed to at least one person but weren't
  const announced = new Set<string | null>()
  const pinged = new Set<string | null>()
  const recentSends = await rows<{ contest_ids: string[] | null }>('email_sends', q =>
    q.select('contest_ids').gte('sent_at', d30.toISOString()).limit(20000))
  for (const r of recentSends.data) for (const id of r.contest_ids ?? []) {
    if (id.startsWith('soon:')) pinged.add(id.slice(5))
    else announced.add(id.includes(':') ? id.slice(id.indexOf(':') + 1) : id)
  }
  if (recentSends.missing) {
    const sentLog = await rows<{ email_type: string; contest_id: string | null }>('email_logs', q =>
      q.select('email_type,contest_id').order('sent_at', { ascending: false }).limit(1000))
    for (const r of sentLog.data) (r.email_type === '3day_expiring' ? pinged : announced).add(r.contest_id)
  }
  const recentNew = await rows<{ id: string; name: string }>('contests', q =>
    q.select('id,name').eq('status', 'open').gte('created_at', d2.toISOString()).limit(50))
  const dueSoon = await rows<{ id: string; name: string }>('contests', q =>
    q.select('id,name').eq('status', 'open').gte('deadline', today).lte('deadline', in3).limit(50))
  const pendingNew = recentNew.data.filter(c => !announced.has(c.id))
  const pendingClosing = dueSoon.data.filter(c => !pinged.has(c.id))
  const pending = pendingNew.length + pendingClosing.length

  const emailsStuck = pending > 0 && (daysSinceEmail == null || daysSinceEmail >= 2)
  const quotaBlocked = quotaLogged || emailsStuck

  // ── Contests ────────────────────────────────────────────────────────────────
  const [cTotal, cOpen, cUpcoming, cClosed] = await Promise.all([
    count('contests'),
    count('contests', q => q.eq('status', 'open')),
    count('contests', q => q.eq('status', 'upcoming')),
    count('contests', q => q.eq('status', 'closed')),
  ])
  const added = await rows<{ name: string; status: string }>('contests', q =>
    q.select('name,status').gte('created_at', yStart.toISOString()).lt('created_at', dayStart.toISOString()).limit(20))
  const closing = await rows<{ name: string; deadline: string }>('contests', q =>
    q.select('name,deadline').eq('status', 'open').gte('deadline', today).lte('deadline', in3).order('deadline').limit(10))
  const featuredNow = await count('contests', q => q.eq('status', 'open').gt('featured_until', now.toISOString()))

  // ── Money ───────────────────────────────────────────────────────────────────
  const sales30 = await rows<{ name: string; featured_paid_at: string }>('contests', q =>
    q.select('name,featured_paid_at').gte('featured_paid_at', d30.toISOString()).order('featured_paid_at', { ascending: false }).limit(50))
  const salesYesterday = sales30.data.filter(s => new Date(s.featured_paid_at) >= yStart && new Date(s.featured_paid_at) < dayStart)
  const outreach = await rows<{ mode: string; created_at: string }>('outreach_log', q =>
    q.select('mode,created_at').gte('created_at', d7.toISOString()).limit(500))
  const drafted7 = outreach.data.filter(o => o.mode === 'draft').length
  const sentOut7 = outreach.data.filter(o => o.mode === 'sent').length
  const stripeReady = !!(process.env.STRIPE_PAYMENT_LINK && process.env.STRIPE_WEBHOOK_SECRET)
  const outreachMode = process.env.OUTREACH_MODE || (await getSetting('outreach_mode')) || 'draft'
  const contactsKnown = await count('contests', q => q.eq('status', 'open').not('organizer_email', 'is', null))

  // ── Website ─────────────────────────────────────────────────────────────────
  const analyticsOn = (await getSetting('vercel_analytics')) === 'on'

  // ── Robots ──────────────────────────────────────────────────────────────────
  const runs = await rows<{ task: string; status: string; summary: string | null; ran_at: string }>('agent_runs', q =>
    q.select('task,status,summary,ran_at').gte('ran_at', h36.toISOString()).order('ran_at', { ascending: false }).limit(100))
  const latestByTask = new Map<string, { status: string; summary: string | null; ran_at: string }>()
  for (const r of runs.data) if (!latestByTask.has(r.task)) latestByTask.set(r.task, r)
  const expectedRobots = ['research', 'seo', 'optimizer', 'design', 'sales', 'notify', 'outreach', 'vercel-research', 'maintenance']
  const submissions7 = await count('agent_runs', q => q.eq('task', 'submission').gte('ran_at', d7.toISOString()))

  // ── To-do list (shrinks as things get done) ─────────────────────────────────
  const todos: string[] = []
  if (!migrated) todos.push('Paste supabase/migrations/2026-09-07-autopilot.sql into Supabase → SQL Editor → Run. Takes 30 seconds. Unlocks tracking, sales, and robot reporting.')
  const outgrown = backlogDays >= 3
  if (quotaLogged) todos.push(`Resend refused to send yesterday. On the Free plan we send ${dailyBudget} a day and stop when Resend says stop, so this usually means other emails (welcome, report) used the rest, or the 3,000/month is gone. If it repeats, upgrade Resend to Pro ($20/mo) at resend.com → Settings → Billing → Transactional.`)
  else if (emailsStuck) todos.push(`Emails look stuck: ${pending} contest update${pending === 1 ? '' : 's'} should have gone out but nothing has been sent for ${daysSinceEmail ?? '?'} days. Check the notify cron in Vercel logs.`)
  if (outgrown) todos.push(`The list has outgrown the free email plan: ${peopleWaiting} people are waiting about ${backlogDays} days for their next email. Upgrade Resend to Pro ($20/mo, no daily cap) at resend.com → Settings → Billing → Transactional, then set EMAIL_DAILY_BUDGET=0 in Vercel.`)
  if (!process.env.REPORT_TO_EMAIL) todos.push('Vercel → aifilmcontests → Settings → Environment Variables → add REPORT_TO_EMAIL = your email, then redeploy. This report then arrives by email every morning at 10am.')
  if (migrated && !engagementMeasurable) todos.push(`Resend → Domains → turn on Open + Click tracking. Then Resend → Webhooks → add ${SITE_URL}/api/webhooks/resend (all email events) and put its signing secret in Vercel as RESEND_WEBHOOK_SECRET.`)
  if (!stripeReady) todos.push(`Stripe → Payment Links → create "Featured listing, ${PRICE_LABEL}". Put the link URL in Vercel as STRIPE_PAYMENT_LINK. Stripe → Webhooks → add ${SITE_URL}/api/webhooks/stripe for checkout.session.completed and put its secret in Vercel as STRIPE_WEBHOOK_SECRET.`)
  if (!analyticsOn) todos.push('Vercel → aifilmcontests → Analytics tab → Enable. (Code is already in.) Then tell Claude "analytics is on" and this line disappears.')
  if (migrated && outreachMode !== 'live' && drafted7 > 0) todos.push(`Organizer emails are in DRAFT mode (${drafted7} drafted this week, none sent). Read one in outreach_log; when happy, set OUTREACH_MODE=live in Vercel and they start going out, max 10/day.`)

  // ── Headline ────────────────────────────────────────────────────────────────
  let headline: string
  if (quotaBlocked) {
    const todoNo = todos.findIndex(t => t.startsWith('Resend refused') || t.startsWith('Emails look stuck')) + 1
    headline = quotaLogged
      ? `🔴 Resend refused to send yesterday. ${nd.sent ?? 0} people got their email, ${peopleWaiting} are waiting. See to-do #${todoNo}.`
      : `🔴 Emails look stuck. ${pendingNew.length} new contest${pendingNew.length === 1 ? '' : 's'} and ${pendingClosing.length} last-call${pendingClosing.length === 1 ? '' : 's'} are waiting, but nothing has gone out in ${daysSinceEmail ?? '?'} days. See to-do #${todoNo}.`
  } else if (!migrated) {
    headline = `🟡 The robots are running but can't report in yet. Paste the SQL (to-do #1, 30 seconds) and tomorrow's report has real numbers.`
  } else if (daysSinceEmail != null && daysSinceEmail >= 8) {
    headline = `🟡 No email has gone out in ${daysSinceEmail} days. Either nothing new happened (fine) or the notify cron is stuck (check Vercel logs).`
  } else if (outgrown) {
    headline = `🟡 Growing pains: ${peopleWaiting} people wait about ${backlogDays} days for their next email on the free plan. Everything still works, just slower. Upgrade when it bothers you (see to-do).`
  } else if (salesYesterday.length) {
    headline = `💰 ${plural(salesYesterday.length, 'featured listing')} sold yesterday (${money(salesYesterday.length * PRICE_CENTS)}). ${salesYesterday.map(s => s.name).join(', ')}.`
  } else {
    headline = `🟢 All quiet. ${n(newYesterday)} new ${newYesterday === 1 ? 'person' : 'people'} yesterday, ${added.data.length} new ${added.data.length === 1 ? 'contest' : 'contests'} found, ${n(sentYesterday ?? 0)} emails delivered.`
  }
  const headlineShort = headline.replace(/^[^\w$]+/, '').slice(0, 72)

  // ── Text ────────────────────────────────────────────────────────────────────
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Edmonton' })
  const L: string[] = []
  L.push(`AI FILM CONTESTS · daily report · ${dateLabel}`)
  L.push('')
  L.push('THE ONE THING')
  L.push(headline)
  L.push('')
  L.push('PEOPLE ON THE LIST')
  L.push(`• ${n(total)} total. ${n(active)} active. ${n(left)} ever left.`)
  L.push(`• +${n(newYesterday)} yesterday. +${n(new7)} last 7 days. +${n(newMonth)} so far this month (last month: +${n(newLastMonth)}).`)
  if (src.missing) L.push('• Where they come from: not tracked yet (needs the SQL).')
  else if (topSources.length) L.push(`• Where they came from (30 days): ${topSources.map(([s, c]) => `${s} (${c})`).join(', ')}.`)
  else L.push('• Where they come from: tracking is on, no tagged signups yet.')
  L.push('')
  L.push('ARE THEY READING?')
  if (!engagementMeasurable) {
    L.push(ev.missing ? '• Not measurable yet (needs the SQL, then Resend tracking).' : '• Not measurable yet. Turn on Resend tracking + webhook (see to-do).')
  } else {
    const act = active ?? 0
    L.push(`• Opened an email in the last 30 days: ${pct(opened.size, act)} (${opened.size} people).`)
    L.push(`• Clicked a contest in the last 30 days: ${pct(clicked.size, act)} (${clicked.size} people).`)
    L.push(`• Last 7 days: ${complaints7} marked us as spam, ${bounces7} bounced.${complaints7 > 2 ? ' ⚠️ That is high. Sending less is the fix.' : ''}`)
  }
  L.push('')
  L.push('EMAILS')
  L.push(`• Sent yesterday: ${n(sentYesterday ?? (lastSend.missing ? null : 0))}. Last 7 days: ${n(sends7Approx)}.`)
  L.push(`• Last email went out: ${lastEmailAt ? `${lastEmailAt.toISOString().slice(0, 10)} (${daysSinceEmail} days ago)` : 'never / unknown'}.`)
  L.push(`• Waiting to go out: ${pendingNew.length} new-contest announcement${pendingNew.length === 1 ? '' : 's'}, ${pendingClosing.length} last-call ping${pendingClosing.length === 1 ? '' : 's'}.`)
  L.push(`• People waiting for their next email: ${peopleWaiting}${peopleWaiting ? ` (~${backlogDays} day${backlogDays === 1 ? '' : 's'} at ${dailyBudget} a day)` : ''}.`)
  L.push(`• Rule: each person gets one bundled email only when there's news for them, never more than every 2 days. Free plan: up to ${dailyBudget} a day, longest-waiting first.`)
  L.push('')
  L.push('CONTESTS')
  L.push(`• ${n(cTotal)} tracked · ${n(cOpen)} open · ${n(cUpcoming)} upcoming · ${n(cClosed)} closed.`)
  L.push(`• Added yesterday: ${added.data.length}${added.data.length ? ` (${added.data.map(a => a.name).slice(0, 6).join(', ')})` : ''}.`)
  L.push(`• Closing in the next 3 days: ${closing.data.length}${closing.data.length ? ` (${closing.data.map(c => c.name).join(', ')})` : ''}.`)
  L.push(`• Featured (paid) right now: ${featuredNow ?? 0}.`)
  L.push(`• Submitted by visitors (7 days): ${submissions7 ?? 0} via ${SITE_URL}/submit (the research robot verifies them).`)
  L.push('')
  L.push('MONEY')
  if (sales30.missing) L.push('• Featured listing sales: not tracked yet (needs the SQL).')
  else L.push(`• Featured listings sold (30 days): ${sales30.data.length} = ${money(sales30.data.length * PRICE_CENTS)}. Price: ${PRICE_LABEL}.`)
  L.push(`• Stripe: ${stripeReady ? 'connected ✅' : 'not connected yet (see to-do)'}. Sales page: ${SITE_URL}/feature`)
  if (outreach.missing) L.push('• Organizer outreach: not active yet (needs the SQL).')
  else L.push(`• Organizer emails (7 days): ${sentOut7} sent, ${drafted7} drafted. Mode: ${outreachMode.toUpperCase()}. Organizer contacts known: ${n(contactsKnown)}.`)
  L.push('')
  L.push('WEBSITE')
  L.push(analyticsOn ? `• Visitors: see Vercel → aifilmcontests → Analytics.` : '• Visitors: not visible until Vercel Analytics is enabled (see to-do).')
  L.push('')
  L.push('WHAT THE ROBOTS DID (last 36 hours)')
  if (runs.missing) L.push('• Robots can\'t report in until the SQL is pasted.')
  else if (!latestByTask.size) L.push('• Nothing logged yet. Either the scheduled tasks haven\'t run, or Claude Desktop was closed.')
  else {
    for (const task of expectedRobots) {
      const r = latestByTask.get(task)
      if (!r) continue
      const icon = r.status === 'ok' ? '✅' : r.status === 'skipped' ? '⏭️' : '❌'
      L.push(`${icon} ${task} — ${(r.summary ?? '').slice(0, 160)}`)
    }
    Array.from(latestByTask.entries()).forEach(([task, r]) => { if (!expectedRobots.includes(task)) L.push(`${r.status === 'ok' ? '✅' : '❌'} ${task} — ${(r.summary ?? '').slice(0, 160)}`) })
    const silent = ['research', 'seo', 'optimizer', 'design', 'sales'].filter(t => !latestByTask.has(t))
    if (silent.length) L.push(`😴 Didn't check in: ${silent.join(', ')} (Mac asleep or Claude Desktop closed?)`)
  }
  L.push('')
  L.push(todos.length ? `YOUR TO-DO (${todos.length}, shrinks as you do them)` : 'YOUR TO-DO')
  if (!todos.length) L.push('• Nothing. Everything is wired up.')
  todos.forEach((t, i) => L.push(`${i + 1}. ${t}`))
  L.push('')
  L.push(`Full data: ${SITE_URL}/api/cron/scorecard (needs the cron secret).`)

  const text = L.join('\n')
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#fff;color:#111;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;"><pre style="white-space:pre-wrap;font-family:inherit;margin:0;max-width:680px;">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre></body></html>`

  return {
    date: today,
    headline,
    headlineShort,
    text,
    html,
    todos,
    data: {
      migrated, quotaBlocked, analyticsOn, stripeReady, outreachMode,
      people: { total, active, left, newYesterday, new7, newMonth, newLastMonth, topSources },
      engagement: { measurable: engagementMeasurable, opened30: opened.size, clicked30: clicked.size, complaints7, bounces7 },
      emails: { sentYesterday, sends7: sends7Approx, lastEmailAt: lastEmailAt?.toISOString() ?? null, daysSinceEmail, pendingNew: pendingNew.map(c => c.name), pendingClosing: pendingClosing.map(c => c.name), quotaLogged, emailsStuck, peopleWaiting, backlogDays, dailyBudget },
      contests: { total: cTotal, open: cOpen, upcoming: cUpcoming, closed: cClosed, addedYesterday: added.data, closingSoon: closing.data, featuredNow },
      money: { sales30: sales30.data.length, revenue30Cents: sales30.data.length * PRICE_CENTS, drafted7, sentOut7, contactsKnown },
      robots: Object.fromEntries(Array.from(latestByTask.entries())),
    },
  }
}
