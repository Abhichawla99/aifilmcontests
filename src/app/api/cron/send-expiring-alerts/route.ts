import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendExpiringContestAlerts } from '@/lib/email'
import { filterUnnotified, logEmailSent } from '@/lib/email-logs'

// Vercel Cron — runs at 9:30 AM UTC daily
// Sends urgent "3 days left" alerts for contests expiring in ≤3 days.
// Uses email_logs to ensure each contest only triggers one alert.

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[Cron] RESEND_API_KEY not set — skipping expiring alerts')
    return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in3 = new Date(today)
  in3.setDate(today.getDate() + 3)

  const [{ data: expiring }, { data: subs }] = await Promise.all([
    supabaseAdmin
      .from('contests')
      .select('id,name,organizer,prize,deadline,url,description')
      .eq('status', 'open')
      .gte('deadline', today.toISOString().slice(0, 10))
      .lte('deadline', in3.toISOString().slice(0, 10))
      .order('deadline'),
    supabaseAdmin.from('subscribers').select('email').eq('confirmed', true),
  ])

  if (!expiring?.length) {
    console.log('[Cron] No contests expiring in ≤3 days — skipping')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No expiring contests' })
  }

  if (!subs?.length) {
    console.log('[Cron] No confirmed subscribers — skipping expiring alerts')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No subscribers' })
  }

  // Filter out contests we've already sent a 3-day alert for
  const unnotified = await filterUnnotified('3day_expiring', expiring)

  if (!unnotified.length) {
    console.log('[Cron] All expiring contests already notified — skipping')
    return NextResponse.json({ ok: true, skipped: true, reason: 'Already notified' })
  }

  const withDays = unnotified.map(c => ({
    ...c,
    daysLeft: Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 86_400_000),
  }))

  const emails = subs.map(s => s.email)
  const result = await sendExpiringContestAlerts(emails, withDays)

  if (!result.success) {
    console.error('[Cron] sendExpiringContestAlerts failed:', result.error)
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }

  // Log each contest so we don't alert again
  for (const c of unnotified) {
    await logEmailSent('3day_expiring', c.id, emails.length)
  }

  console.log(`[Cron] Sent expiring alerts — ${emails.length} subscribers, ${unnotified.length} contests`)
  return NextResponse.json({ ok: true, sent: emails.length, contests: unnotified.length })
}
