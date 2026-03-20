import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendNewContestAlerts } from '@/lib/email'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contestIds } = await request.json()
  if (!Array.isArray(contestIds) || !contestIds.length) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const [{ data: contests }, { data: subscribers }] = await Promise.all([
    supabaseAdmin
      .from('contests')
      .select('name, organizer, prize, deadline, url, description')
      .in('id', contestIds),
    supabaseAdmin
      .from('subscribers')
      .select('email')
      .eq('confirmed', true),
  ])

  if (!contests?.length || !subscribers?.length) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const emails = subscribers.map(s => s.email)
  await sendNewContestAlerts(emails, contests)

  return NextResponse.json({ ok: true, notified: emails.length, contests: contests.length })
}
