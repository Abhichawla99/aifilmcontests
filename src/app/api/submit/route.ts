import { NextRequest, NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSetting, logAgentRun, withDbRetry } from '@/lib/db-health'
import { sendPlainEmail } from '@/lib/email'

// Visitor submits a contest. We never publish it directly: the research robot
// verifies it against the official page first (it reads agent_runs task=submission).
// Abhi gets one email per submission (reply-to = the submitter).
//
// Both legs are awaited on purpose. Vercel freezes the function the moment the
// response goes out, so a fire-and-forget send never reached Resend: five real
// submissions in Sep 2026 landed in the database with no email behind them.

export const runtime = 'nodejs'
export const maxDuration = 30

const CONTACT_EMAIL = 'abhixchawla@gmail.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function POST(request: NextRequest) {
  try {
    const b = await request.json()
    if (b.website) return NextResponse.json({ ok: true }) // honeypot field: bots fill it, people don't

    const name = clean(b.name, 200)
    const url = clean(b.url, 500)
    const email = clean(b.email, 200).toLowerCase()
    const organizer = clean(b.organizer, 200)
    const deadline = clean(b.deadline, 20)
    const prize = clean(b.prize, 200)
    const fee = clean(b.fee, 100)
    const notes = clean(b.notes, 2000)
    const role = clean(b.role, 40)

    if (!name || !/^https?:\/\/\S+\.\S+/.test(url)) {
      return NextResponse.json({ error: 'Please give the contest name and its official web address.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email so we can tell you when it is live.' }, { status: 400 })
    }

    const details = { name, url, organizer, deadline, prize, fee, notes, role, email, submittedAt: new Date().toISOString() }
    const summary = `Contest submitted by a visitor: ${name} — ${url}${organizer ? ` (${organizer})` : ''}${deadline ? `, deadline ${deadline}` : ''}${role ? ` [${role}]` : ''}`

    // 1. Save it. The research robot reads this row on its next run.
    let saved = false
    try {
      const { error } = await withDbRetry(signal => supabaseAdmin.from('agent_runs').insert({
        task: 'submission',
        status: 'ok',
        summary: summary.slice(0, 2000),
        details,
      }).abortSignal(signal))
      if (error) console.error('[submit] save failed:', error.message)
      saved = !error
    } catch (e) {
      console.error('[submit] save threw:', e)
    }

    // 2. Tell Abhi. Awaited, so the function stays alive until Resend answers.
    const to = process.env.REPORT_TO_EMAIL || (await getSetting('report_to_email')) || CONTACT_EMAIL
    const result = await sendPlainEmail({
      to,
      replyTo: email,
      kind: 'custom',
      subject: `New contest submission: ${name}`,
      text: [
        `Someone submitted a contest on ${SITE_URL}/submit.`, ``,
        `Contest:   ${name}`,
        `URL:       ${url}`,
        `Organizer: ${organizer || '-'}`,
        `Deadline:  ${deadline || '-'}`,
        `Prize:     ${prize || '-'}`,
        `Fee:       ${fee || '-'}`,
        `From:      ${email} (${role || 'not stated'})`, ``,
        `Notes:`, notes || '-', ``,
        saved
          ? `Saved to the database. The research robot verifies it on its next run and lists it if it checks out.`
          : `WARNING: the database save failed, so this email is the only copy. Add it by hand.`,
        `Reply to this email to answer the submitter. To sell a featured spot, point them at ${SITE_URL}/feature.`,
      ].join('\n'),
    }).catch(err => {
      console.error('[submit] notify email threw:', err)
      return null
    })
    const emailed = !!result?.success && result.sent > 0
    if (!emailed) {
      console.error('[submit] notify email failed:', result?.error ?? 'no result')
      await logAgentRun('notify', 'failed', `Submission email to ${to} did not go out: ${name}`, {
        name, url, email, saved, error: String(result?.error ?? 'unknown'),
      })
    }

    if (!saved && !emailed) {
      return NextResponse.json(
        { error: `We could not record that just now. Please try again in a minute, or email the details to ${CONTACT_EMAIL}.` },
        { status: 500 },
      )
    }
    await track('submit_contest', { role: role || 'not stated', saved, emailed }).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[submit] error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
