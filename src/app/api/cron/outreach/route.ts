import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildOrganizerOutreach, sendPlainEmail } from '@/lib/email'
import { getSetting, isMissingRelation, logAgentRun } from '@/lib/db-health'

// Vercel Cron — the "selling" job. For every newly listed, open contest whose
// organizer email is known and hasn't been contacted: one polite email that
// says "you're listed (free), here's how to feature it (paid)".
//
// Modes (env OUTREACH_MODE, or settings.outreach_mode; default 'draft'):
//   draft → write the email to outreach_log so Abhi can read it in the report
//   live  → actually send (max 10/day), mark contest outreach_sent_at
//
// Organizer emails are found by the local "sales" scheduled task and written
// to contests.organizer_email. This job never guesses addresses.

export const maxDuration = 120
const DAILY_CAP = 10
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'hello@aifilmcontests.com'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mode = (process.env.OUTREACH_MODE || (await getSetting('outreach_mode')) || 'draft').toLowerCase()
  const priceLabel = process.env.FEATURED_PRICE_LABEL || '$49 for 30 days'
  const today = new Date().toISOString().slice(0, 10)

  const { data: cands, error } = await supabaseAdmin
    .from('contests')
    .select('id,name,organizer,deadline,organizer_email')
    .eq('status', 'open')
    .gte('deadline', today)
    .is('outreach_sent_at', null)
    .not('organizer_email', 'is', null)
    .order('created_at', { ascending: false })
    .limit(DAILY_CAP)

  if (error) {
    const why = isMissingRelation(error) ? 'Migration not applied yet (organizer_email column missing)' : `Query failed: ${error.message}`
    await logAgentRun('outreach', 'skipped', why)
    return NextResponse.json({ ok: true, skipped: true, reason: why })
  }
  if (!cands?.length) {
    await logAgentRun('outreach', 'skipped', `No organizers to contact (mode ${mode})`)
    return NextResponse.json({ ok: true, skipped: true, reason: 'No candidates', mode })
  }

  const { count: subscriberCount } = await supabaseAdmin
    .from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true)

  let sent = 0, drafted = 0, skipped = 0
  const touched: string[] = []

  for (const c of cands) {
    const email = String(c.organizer_email ?? '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { skipped++; continue }

    const draft = buildOrganizerOutreach(
      { id: c.id, name: c.name, organizer: c.organizer, deadline: c.deadline },
      { subscriberCount: subscriberCount ?? 0, priceLabel },
    )

    if (mode === 'live') {
      const r = await sendPlainEmail({ to: email, subject: draft.subject, text: draft.text, replyTo: REPLY_TO, kind: 'outreach' })
      if (!r.success) {
        await logAgentRun('outreach', 'failed', r.quotaExceeded ? 'Resend quota exceeded' : `Send to ${email} failed`, { contest: c.id })
        break
      }
      await supabaseAdmin.from('contests').update({ outreach_sent_at: new Date().toISOString(), outreach_status: 'sent' }).eq('id', c.id)
      await supabaseAdmin.from('outreach_log').insert({ contest_id: c.id, organizer_email: email, mode: 'sent', subject: draft.subject, body: draft.text })
      sent++
      touched.push(c.name)
    } else {
      const { data: existing } = await supabaseAdmin
        .from('outreach_log').select('id').eq('contest_id', c.id).eq('mode', 'draft').limit(1)
      if (existing?.length) { skipped++; continue }
      const { error: insErr } = await supabaseAdmin
        .from('outreach_log').insert({ contest_id: c.id, organizer_email: email, mode: 'draft', subject: draft.subject, body: draft.text })
      if (insErr) { skipped++; continue }
      await supabaseAdmin.from('contests').update({ outreach_status: 'draft' }).eq('id', c.id)
      drafted++
      touched.push(c.name)
    }
  }

  const summary = mode === 'live'
    ? `LIVE: sent ${sent} organizer emails${touched.length ? ` (${touched.slice(0, 5).join(', ')})` : ''}`
    : `DRAFT: ${drafted} new drafts waiting for your OK${touched.length ? ` (${touched.slice(0, 5).join(', ')})` : ''}`
  await logAgentRun('outreach', 'ok', summary, { mode, sent, drafted, skipped })
  return NextResponse.json({ ok: true, mode, sent, drafted, skipped })
}
