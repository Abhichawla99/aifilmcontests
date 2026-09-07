import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildBundleEmail, sendToRecipients, type Recipient, type ContestEmailItem } from '@/lib/email'
import { isMissingRelation, logAgentRun } from '@/lib/db-health'

// Vercel Cron — the ONLY thing that emails subscribers. Runs once a day.
//
// Per-person bundling, built to live inside Resend's Free plan (100 emails/day,
// 3,000/month) and to work unchanged on a paid plan:
//   • Each subscriber gets ONE email only when there is something new FOR THEM:
//       - contests added since their last email (or since they joined)
//       - contests closing within 3 days they haven't been warned about
//       - once a week: what closes in 4–7 days
//   • At most one email per person every ~2 days (EMAIL_MIN_GAP_HOURS).
//   • Longest-waiting people go first. We stop at the daily budget
//     (EMAIL_DAILY_BUDGET, default 80; set 0 for unlimited on a paid plan)
//     and the moment Resend refuses a batch. Whoever didn't get it today is
//     first in line tomorrow, with anything new folded in. Nobody gets a
//     duplicate: every send is logged per person in email_sends.
//   ?dry=1 shows the plan without sending.

export const maxDuration = 300

const DAILY_BUDGET = Math.max(0, Number(process.env.EMAIL_DAILY_BUDGET ?? 80))
const MIN_GAP_HOURS = Math.max(0, Number(process.env.EMAIL_MIN_GAP_HOURS ?? 40))
const NEW_WINDOW_DAYS = 10
const BATCH = DAILY_BUDGET > 0 ? 20 : 100

const SELECT = 'id,name,organizer,prize,deadline,url,description,created_at'
type Row = { id: string; name: string; organizer: string; prize: string; deadline: string; url: string; description: string; created_at: string | null }
type SubRow = { email: string; name: string | null; unsubscribe_token: string | null; created_at: string }
type SendRow = { recipient: string; sent_at: string; contest_ids: string[] | null; email_type: string }

const ymd = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const dry = request.nextUrl.searchParams.get('dry') === '1'
  if (!process.env.RESEND_API_KEY && !dry) {
    await logAgentRun('notify', 'failed', 'RESEND_API_KEY not set — no emails can go out')
    return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const now = new Date()
  const today = ymd(now)
  const in3 = ymd(addDays(now, 3))
  const in7 = ymd(addDays(now, 7))
  const newWindowStart = addDays(now, -NEW_WINDOW_DAYS)
  const dayStartUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const isMonday = now.getUTCDay() === 1

  const [subsRes, openRes, sendsRes] = await Promise.all([
    supabaseAdmin.from('subscribers').select('email,name,unsubscribe_token,created_at').eq('confirmed', true),
    supabaseAdmin.from('contests').select(SELECT).eq('status', 'open').gte('deadline', today).order('deadline'),
    supabaseAdmin.from('email_sends').select('recipient,sent_at,contest_ids,email_type')
      .gte('sent_at', addDays(now, -45).toISOString()).order('sent_at', { ascending: false }).limit(20000),
  ])

  const subs = (subsRes.data ?? []) as SubRow[]
  const open = (openRes.data ?? []) as Row[]
  if (!subs.length) {
    await logAgentRun('notify', 'skipped', 'No confirmed subscribers')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No subscribers' })
  }
  if (sendsRes.error && !isMissingRelation(sendsRes.error)) console.error('[notify] email_sends read failed:', sendsRes.error.message)
  const sends = (sendsRes.data ?? []) as SendRow[]

  // What each person has already been told, and when we last wrote to them
  const history = new Map<string, { lastAt: Date | null; told: Set<string> }>()
  let sentToday = 0
  for (const r of sends) {
    if (new Date(r.sent_at) >= dayStartUtc) sentToday++
    const h = history.get(r.recipient) ?? { lastAt: null, told: new Set<string>() }
    if (['pulse', 'weekly_digest', 'new_contest', 'closing_soon', 'reminder_7day'].includes(r.email_type)) {
      const at = new Date(r.sent_at)
      if (!h.lastAt || at > h.lastAt) h.lastAt = at
    }
    for (const id of r.contest_ids ?? []) h.told.add(id.includes(':') ? id : `new:${id}`)
    history.set(r.recipient, h)
  }

  const daysLeft = (d: string) => Math.max(0, Math.ceil((new Date(d).getTime() - now.getTime()) / 86_400_000))
  const toItem = (c: Row): ContestEmailItem => ({
    id: c.id, name: c.name, organizer: c.organizer, prize: c.prize, deadline: c.deadline, url: c.url, description: c.description,
  })

  // Build every person's pending bundle
  type Plan = { sub: SubRow; waitingSince: Date; bundle: ReturnType<typeof buildBundleEmail>; counts: [number, number, number] }
  const plans: Plan[] = []
  let waitingOnGap = 0
  for (const sub of subs) {
    const h = history.get(sub.email) ?? { lastAt: null, told: new Set<string>() }
    if (h.lastAt && now.getTime() - h.lastAt.getTime() < MIN_GAP_HOURS * 3_600_000) { waitingOnGap++; continue }
    const joined = new Date(sub.created_at)
    const since = h.lastAt ?? (joined > newWindowStart ? joined : newWindowStart)

    const fresh = open.filter(c => c.created_at && new Date(c.created_at) >= since && new Date(c.created_at) >= newWindowStart && !h.told.has(`new:${c.id}`))
    const soon = open.filter(c => c.deadline <= in3 && !h.told.has(`soon:${c.id}`))
    const weekly = (isMonday || !h.lastAt || now.getTime() - h.lastAt.getTime() > 6 * 86_400_000)
      ? open.filter(c => c.deadline > in3 && c.deadline <= in7 && !h.told.has(`week:${c.id}`) && !h.told.has(`soon:${c.id}`))
      : []
    if (!fresh.length && !soon.length && !weekly.length) continue

    const bundle = buildBundleEmail({
      newContests: fresh.map(toItem),
      closingSoon: soon.map(c => ({ ...toItem(c), daysLeft: daysLeft(c.deadline) })),
      closingThisWeek: weekly.map(c => ({ ...toItem(c), daysLeft: daysLeft(c.deadline) })),
    })
    plans.push({ sub, waitingSince: h.lastAt ?? joined, bundle, counts: [fresh.length, soon.length, weekly.length] })
  }
  plans.sort((a, b) => a.waitingSince.getTime() - b.waitingSince.getTime())

  const allowance = DAILY_BUDGET > 0 ? Math.max(0, DAILY_BUDGET - sentToday) : plans.length
  const toSend = plans.slice(0, allowance)
  const waiting = plans.length - toSend.length
  const uniq = (i: 0 | 1 | 2) => new Set(toSend.flatMap(p => p.bundle.contestIds.filter(x => x.startsWith(['new:', 'soon:', 'week:'][i])))).size

  if (dry) {
    return NextResponse.json({
      ok: true, dry: true, subscribers: subs.length, pending: plans.length, sendingToday: toSend.length, waitingForBudget: waiting,
      waitingOnGap, dailyBudget: DAILY_BUDGET, sentTodayAlready: sentToday, batchSize: BATCH,
      sample: toSend.slice(0, 3).map(p => ({ email: p.sub.email.replace(/^(.).*(@.*)$/, '$1***$2'), subject: p.bundle.subject, new: p.counts[0], closingSoon: p.counts[1], closingThisWeek: p.counts[2] })),
    })
  }

  if (!toSend.length) {
    const why = plans.length ? `Daily budget used up (${sentToday}/${DAILY_BUDGET} sent today); ${plans.length} people wait for tomorrow` : `Nothing new for anyone (${open.length} open, ${subs.length} subscribers, ${waitingOnGap} recently emailed)`
    await logAgentRun('notify', 'skipped', why, { pending: plans.length, waiting: plans.length, sentToday })
    return NextResponse.json({ ok: true, skipped: true, reason: why })
  }

  const byEmail = new Map(toSend.map(p => [p.sub.email, p.bundle]))
  const recipients: Recipient[] = toSend.map(p => ({ email: p.sub.email, name: p.sub.name, token: p.sub.unsubscribe_token }))
  const result = await sendToRecipients({
    kind: 'pulse',
    recipients,
    batchSize: BATCH,
    subject: r => byEmail.get(r.email)!.subject,
    html: (r, unsub) => byEmail.get(r.email)!.html(unsub),
    text: (r, unsub) => byEmail.get(r.email)!.text(unsub),
    contestIds: r => byEmail.get(r.email)!.contestIds,
  })

  const stillWaiting = waiting + result.failed
  const backlogDays = DAILY_BUDGET > 0 ? Math.ceil(stillWaiting / DAILY_BUDGET) : 0
  const details = { sent: result.sent, failed: result.failed, waiting: stillWaiting, backlogDays, dailyBudget: DAILY_BUDGET, sentTodayBefore: sentToday, new: uniq(0), soon: uniq(1), week: uniq(2), quota: !!result.quotaExceeded }

  if (result.quotaExceeded) {
    const why = result.sent > 0
      ? `Resend stopped us mid-way: ${result.sent} people got today's email, ${stillWaiting} are first in line tomorrow. Free plan is 100/day.`
      : `Resend refused to send (quota). ${stillWaiting} people are waiting. Free plan is 100/day, 3,000/month.`
    await logAgentRun('notify', 'failed', why, details)
    return NextResponse.json({ ok: false, ...details, error: why }, { status: 500 })
  }
  if (!result.success) {
    await logAgentRun('notify', 'failed', `Send failed for ${result.failed} people: ${JSON.stringify(result.error ?? '').slice(0, 200)}`, details)
    return NextResponse.json({ ok: false, ...details }, { status: 500 })
  }

  const summary = `emailed ${result.sent} people (${uniq(0)} new contests, ${uniq(1)} last-calls${uniq(2) ? `, ${uniq(2)} closing this week` : ''})` +
    (stillWaiting ? ` · ${stillWaiting} people wait for tomorrow's budget (~${backlogDays} day${backlogDays === 1 ? '' : 's'})` : '')
  await logAgentRun('notify', 'ok', summary, details)
  console.log(`[Cron] notify — ${summary}`)
  return NextResponse.json({ ok: true, ...details })
}
