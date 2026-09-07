import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildDailyReport } from '@/lib/report'
import { sendPlainEmail } from '@/lib/email'
import { getSetting, isMissingRelation, logAgentRun } from '@/lib/db-health'

// Vercel Cron — builds the daily plain-English report, stores it, emails it.
// Also called by the local "morning report" scheduled task with ?format=text.
//   ?format=text  → plain text body
//   ?email=0      → don't send the email (just build/return)

export const maxDuration = 120

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await buildDailyReport()

  // Archive (best-effort until migration exists)
  try {
    const { error } = await supabaseAdmin.from('daily_reports').upsert(
      { report_date: report.date, headline: report.headline, text_report: report.text, data: report.data },
      { onConflict: 'report_date' },
    )
    if (error && !isMissingRelation(error)) console.error('[scorecard] archive failed:', error.message)
  } catch (e) {
    console.error('[scorecard] archive threw:', e)
  }

  // Email it (best-effort; quota problems are reported inside the report itself)
  let emailed = false
  const to = process.env.REPORT_TO_EMAIL || (await getSetting('report_to_email'))
  if (to && request.nextUrl.searchParams.get('email') !== '0') {
    const r = await sendPlainEmail({
      to,
      subject: `AI Film Contests · ${report.headlineShort}`,
      text: report.text,
      html: report.html,
      kind: 'report',
    })
    emailed = r.success
  }

  await logAgentRun('scorecard', 'ok', report.headline.slice(0, 200), { emailed, todos: report.todos.length })

  if (request.nextUrl.searchParams.get('format') === 'text') {
    return new NextResponse(report.text, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
  }
  return NextResponse.json({ ok: true, emailed, ...report })
}
