import { NextRequest, NextResponse } from 'next/server'
import { getSetting, logAgentRun } from '@/lib/db-health'
import { sendPlainEmail } from '@/lib/email'

// Visitor submits a contest. We never publish it directly: the research robot
// verifies it against the official page first (it reads agent_runs task=submission).
// Abhi gets one email per submission (reply-to = the submitter).

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
    await logAgentRun('submission', 'ok',
      `Contest submitted by a visitor: ${name} — ${url}${organizer ? ` (${organizer})` : ''}${deadline ? `, deadline ${deadline}` : ''}${role ? ` [${role}]` : ''}`,
      details)

    const to = process.env.REPORT_TO_EMAIL || (await getSetting('report_to_email'))
    if (to) {
      sendPlainEmail({
        to,
        replyTo: email,
        kind: 'custom',
        subject: `New contest submission: ${name}`,
        text: [
          `Someone submitted a contest on aifilmcontests.com/submit.`, ``,
          `Contest:   ${name}`, `URL:       ${url}`, `Organizer: ${organizer || '-'}`, `Deadline:  ${deadline || '-'}`,
          `Prize:     ${prize || '-'}`, `Fee:       ${fee || '-'}`, `From:      ${email} (${role || 'not stated'})`, ``,
          `Notes:`, notes || '-', ``,
          `The research robot verifies it on its next run (5am) and lists it if it checks out. Reply to this email to answer the submitter.`,
        ].join('\n'),
      }).catch(err => console.error('[submit] notify email failed:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[submit] error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
