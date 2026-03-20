import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWeeklyDigest, sendDeadlineReminders } from '@/lib/email'
import { runResearch } from '@/lib/research'
import { Resend } from 'resend'

function checkAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  return token === process.env.ADMIN_TOKEN
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, payload } = await request.json()

  // ── Run maintenance ────────────────────────────────────────────────────────
  if (action === 'maintenance') {
    const today = new Date().toISOString().slice(0, 10)

    const { data: closed } = await supabaseAdmin
      .from('contests')
      .update({ status: 'closed' })
      .in('status', ['open', 'upcoming'])
      .lt('deadline', today)
      .select('id, name')

    const { data: opened } = await supabaseAdmin
      .from('contests')
      .update({ status: 'open' })
      .eq('status', 'upcoming')
      .lte('submission_open', today)
      .not('submission_open', 'is', null)
      .select('id, name')

    return NextResponse.json({ ok: true, closed: closed ?? [], opened: opened ?? [] })
  }

  // ── Run research ───────────────────────────────────────────────────────────
  if (action === 'research') {
    const result = await runResearch()
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  }

  // ── Update contest status ──────────────────────────────────────────────────
  if (action === 'update-status') {
    const { id, status } = payload
    const { error } = await supabaseAdmin
      .from('contests')
      .update({ status })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  // ── Delete contest ─────────────────────────────────────────────────────────
  if (action === 'delete-contest') {
    const { id } = payload
    const { error } = await supabaseAdmin.from('contests').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  // ── Send weekly digest ─────────────────────────────────────────────────────
  if (action === 'send-digest') {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not set in environment variables' }, { status: 500 })
    }
    const [{ data: contests }, { data: subs }] = await Promise.all([
      supabaseAdmin.from('contests').select('name,organizer,prize,deadline,url,description').eq('status', 'open').order('deadline'),
      supabaseAdmin.from('subscribers').select('email').eq('confirmed', true),
    ])
    if (!contests?.length) return NextResponse.json({ error: 'No open contests to send' }, { status: 400 })
    if (!subs?.length) return NextResponse.json({ error: 'No confirmed subscribers' }, { status: 400 })

    const result = await sendWeeklyDigest(subs.map(s => s.email), contests)
    if (!result.success) {
      return NextResponse.json({ error: `Resend failed: ${JSON.stringify(result.error)}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, sent: subs.length, contests: contests.length })
  }

  // ── Send deadline reminders ────────────────────────────────────────────────
  if (action === 'send-reminders') {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not set in environment variables' }, { status: 500 })
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
    if (!urgent?.length) return NextResponse.json({ error: 'No contests closing in ≤7 days right now' }, { status: 400 })
    if (!subs?.length) return NextResponse.json({ error: 'No confirmed subscribers' }, { status: 400 })

    const withDays = urgent.map(c => ({
      ...c,
      daysLeft: Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 86_400_000),
    }))
    const result = await sendDeadlineReminders(subs.map(s => s.email), withDays)
    if (!result.success) {
      return NextResponse.json({ error: `Resend failed: ${JSON.stringify(result.error)}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true, sent: subs.length, contests: urgent.length })
  }

  // ── Send custom email ──────────────────────────────────────────────────────
  if (action === 'send-custom') {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not set in environment variables' }, { status: 500 })
    }
    const { subject, body } = payload
    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'Subject and body required' }, { status: 400 })
    }

    const { data: subs } = await supabaseAdmin
      .from('subscribers').select('email').eq('confirmed', true)
    if (!subs?.length) return NextResponse.json({ error: 'No confirmed subscribers' }, { status: 400 })

    const FROM_EMAIL = process.env.FROM_EMAIL || 'contests@updates.aifilmcontests.com'
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'
    const resend = new Resend(process.env.RESEND_API_KEY)

    const htmlBody = body
      .split('\n')
      .map((line: string) => line.trim() ? `<p style="color:#a1a1aa;font-size:15px;line-height:1.65;margin:0 0 14px 0;">${line}</p>` : '<br>')
      .join('')

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="background:#09090f;color:#fff;font-family:-apple-system,sans-serif;margin:0;padding:0;">
<div style="max-width:580px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px;"><span style="font-size:15px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4f46e5;">AI Film Contests</span></div>
  ${htmlBody}
  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">
  <div style="color:#3f3f46;font-size:12px;text-align:center;">
    <a href="${SITE_URL}" style="color:#3f3f46;text-decoration:none;">${SITE_URL}</a>
    &nbsp;·&nbsp;
    <a href="${SITE_URL}/unsubscribe" style="color:#3f3f46;text-decoration:underline;">Unsubscribe</a>
  </div>
</div></body></html>`

    const emails = subs.map(s => s.email)
    try {
      const batchSize = 50
      for (let i = 0; i < emails.length; i += batchSize) {
        const { error } = await resend.emails.send({
          from: `AI Film Contests <${FROM_EMAIL}>`,
          to: FROM_EMAIL,
          bcc: emails.slice(i, i + batchSize),
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<${SITE_URL}/unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
        if (error) {
          return NextResponse.json({ error: `Resend error: ${error.message}` }, { status: 500 })
        }
      }
    } catch (err) {
      return NextResponse.json({ error: `Send failed: ${String(err)}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, sent: emails.length })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
