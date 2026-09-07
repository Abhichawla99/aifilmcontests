import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDailyPulse, sendWeeklyDigest, type Recipient, type ContestEmailItem } from '@/lib/email'
import { alreadySent, filterUnnotified, logEmailSent } from '@/lib/email-logs'
import { logAgentRun } from '@/lib/db-health'

// Vercel Cron — the ONLY thing that emails subscribers. Runs once a day.
//
// Rule: at most one email per subscriber per day.
//   Monday      → weekly digest (what's open, what closes this week, what's new)
//   Other days  → "pulse" only if there's something to say:
//                   • contests added in the last 48h not yet announced
//                   • contests closing within 3 days not yet pinged
//   Nothing new → no email. Silence is a feature.
//
// Every contest gets at most: 1 "new" mention, 1 "closing this week" mention
// (inside a Monday digest), 1 "3 days left" ping. Dedup lives in email_logs.

export const maxDuration = 300

const SELECT = 'id,name,organizer,prize,deadline,url,description,created_at'

type Row = {
  id: string; name: string; organizer: string; prize: string; deadline: string
  url: string; description: string; created_at: string | null
}

function ymd(d: Date) { return d.toISOString().slice(0, 10) }
function addDays(d: Date, n: number) { return new Date(d.getTime() + n * 86_400_000) }
function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!process.env.RESEND_API_KEY) {
    await logAgentRun('notify', 'failed', 'RESEND_API_KEY not set — no emails can go out')
    return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const now = new Date()
  const today = ymd(now)
  const in3 = ymd(addDays(now, 3))
  const in7 = ymd(addDays(now, 7))
  const since48h = addDays(now, -2).toISOString()
  const since7d = addDays(now, -7).toISOString()
  const isMonday = now.getUTCDay() === 1
  const force = request.nextUrl.searchParams.get('force') // 'digest' | 'pulse' for manual runs

  const [subsRes, openRes] = await Promise.all([
    supabaseAdmin.from('subscribers').select('email,name,unsubscribe_token').eq('confirmed', true),
    supabaseAdmin.from('contests').select(SELECT).eq('status', 'open').gte('deadline', today).order('deadline'),
  ])

  const subs: Recipient[] = (subsRes.data ?? []).map(s => ({ email: s.email, name: s.name, token: s.unsubscribe_token }))
  if (!subs.length) {
    await logAgentRun('notify', 'skipped', 'No confirmed subscribers')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No subscribers' })
  }
  const open = (openRes.data ?? []) as Row[]
  const daysLeft = (d: string) => Math.max(0, Math.ceil((new Date(d).getTime() - now.getTime()) / 86_400_000))
  const toItem = (c: Row): ContestEmailItem => ({
    id: c.id, name: c.name, organizer: c.organizer, prize: c.prize, deadline: c.deadline, url: c.url, description: c.description,
  })

  const newContests = await filterUnnotified('new_contest', open.filter(c => c.created_at && c.created_at >= since48h))
  const closingSoon = await filterUnnotified('3day_expiring', open.filter(c => c.deadline <= in3))

  let mode: 'digest' | 'pulse' | null = null
  let result: { success: boolean; sent: number; failed: number; quotaExceeded?: boolean; error?: unknown } | null = null

  if ((isMonday || force === 'digest') && open.length) {
    const weekKey = `week-${isoWeek(now)}`
    if (force === 'digest' || !(await alreadySent('weekly_digest', weekKey))) {
      mode = 'digest'
      const closingThisWeek = open.filter(c => c.deadline <= in7).map(c => ({ ...toItem(c), daysLeft: daysLeft(c.deadline) }))
      const newThisWeek = open.filter(c => c.created_at && c.created_at >= since7d).map(toItem)
      result = await sendWeeklyDigest(subs, open.map(toItem), { newThisWeek, closingThisWeek })
      if (result.sent > 0) { // log even a partial send: no duplicates tomorrow
        await logEmailSent('weekly_digest', weekKey, result.sent)
        for (const c of newContests) await logEmailSent('new_contest', c.id, result.sent)
        for (const c of closingSoon) await logEmailSent('3day_expiring', c.id, result.sent)
      }
    }
  }

  if (!mode) {
    if (!newContests.length && !closingSoon.length) {
      await logAgentRun('notify', 'skipped', `Nothing new to send (${open.length} open, ${subs.length} subscribers)`)
      return NextResponse.json({ ok: true, skipped: true, reason: 'Nothing new', open: open.length, subscribers: subs.length })
    }
    mode = 'pulse'
    result = await sendDailyPulse(subs, {
      newContests: newContests.map(toItem),
      closingSoon: closingSoon.map(c => ({ ...toItem(c), daysLeft: daysLeft(c.deadline) })),
    })
    if (result.sent > 0) { // log even a partial send: no duplicates tomorrow
      for (const c of newContests) await logEmailSent('new_contest', c.id, result.sent)
      for (const c of closingSoon) await logEmailSent('3day_expiring', c.id, result.sent)
    }
  }

  if (!result || !result.success) {
    const partial = (result?.sent ?? 0) > 0
    const why = result?.quotaExceeded
      ? partial
        ? `Resend quota hit mid-send: ${result!.sent} of ${subs.length} people got today's email, ${result!.failed} did not (they won't be retried). Upgrade Resend.`
        : `Resend quota exceeded — nobody got emails today (Free plan: 100/day, 3,000/month; list is ${subs.length}). Upgrade Resend.`
      : `Send failed: ${JSON.stringify(result?.error ?? 'unknown').slice(0, 300)}`
    await logAgentRun('notify', 'failed', why, { mode, sent: result?.sent ?? 0, failed: result?.failed ?? 0 })
    return NextResponse.json({ ok: false, mode, error: why }, { status: 500 })
  }

  const summary = `${mode}: emailed ${result.sent} people · ${newContests.length} new · ${closingSoon.length} closing in 3 days`
  await logAgentRun('notify', 'ok', summary, { mode, sent: result.sent, newIds: newContests.map(c => c.id), closingIds: closingSoon.map(c => c.id) })
  console.log(`[Cron] notify — ${summary}`)
  return NextResponse.json({ ok: true, mode, sent: result.sent, new: newContests.length, closingSoon: closingSoon.length })
}
