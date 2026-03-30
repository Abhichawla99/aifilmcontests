import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDeadlineReminders } from '@/lib/email'

// Vercel Cron — runs at 9:00 AM UTC daily
// Sends deadline reminder emails for contests closing within 7 days.
// Only sends if there are urgent contests — otherwise exits silently.

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[Cron] RESEND_API_KEY not set — skipping reminders')
    return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7 = new Date(today)
  in7.setDate(today.getDate() + 7)

  const [{ data: urgent }, { data: subs }] = await Promise.all([
    supabaseAdmin
      .from('contests')
      .select('name,organizer,prize,deadline,url,description')
      .eq('status', 'open')
      .gte('deadline', today.toISOString().slice(0, 10))
      .lte('deadline', in7.toISOString().slice(0, 10))
      .order('deadline'),
    supabaseAdmin.from('subscribers').select('email').eq('confirmed', true),
  ])

  if (!urgent?.length) {
    console.log('[Cron] No contests closing in ≤7 days — skipping reminders')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No urgent contests' })
  }

  if (!subs?.length) {
    console.log('[Cron] No confirmed subscribers — skipping reminders')
    return NextResponse.json({ ok: true, skipped: true, reason: 'No subscribers' })
  }

  const withDays = urgent.map(c => ({
    ...c,
    daysLeft: Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 86_400_000),
  }))

  const result = await sendDeadlineReminders(subs.map(s => s.email), withDays)
  if (!result.success) {
    console.error('[Cron] sendDeadlineReminders failed:', result.error)
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }

  console.log(`[Cron] Sent reminders — ${subs.length} subscribers, ${urgent.length} contests`)
  return NextResponse.json({ ok: true, sent: subs.length, contests: urgent.length })
}
