import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { isMissingRelation } from '@/lib/db-health'

// Resend → us. Turns "did anyone read this?" from a mystery into a number.
// Setup: Resend → Webhooks → add https://aifilmcontests.com/api/webhooks/resend
// (select all email.* events) → copy the signing secret → Vercel env RESEND_WEBHOOK_SECRET.
// Signature scheme is Svix (HMAC-SHA256 over "id.timestamp.body", base64).

export const runtime = 'nodejs'

function verifySvix(secret: string, id: string, ts: string, sig: string, body: string): boolean {
  const ageSec = Math.abs(Date.now() / 1000 - Number(ts))
  if (!Number.isFinite(ageSec) || ageSec > 300) return false
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = crypto.createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64')
  const exp = Buffer.from(expected)
  return sig.split(' ').some(part => {
    const [version, value] = part.split(',')
    if (version !== 'v1' || !value) return false
    const got = Buffer.from(value)
    return got.length === exp.length && crypto.timingSafeEqual(got, exp)
  })
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const body = await request.text()
  if (!secret) return NextResponse.json({ error: 'RESEND_WEBHOOK_SECRET not set' }, { status: 503 })

  const id = request.headers.get('svix-id') ?? ''
  const ts = request.headers.get('svix-timestamp') ?? ''
  const sig = request.headers.get('svix-signature') ?? ''
  if (!id || !ts || !sig || !verifySvix(secret, id, ts, sig, body)) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 401 })
  }

  let evt: { type?: string; created_at?: string; data?: Record<string, unknown> }
  try { evt = JSON.parse(body) } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }) }

  const type = (evt.type ?? '').replace(/^email\./, '') || 'unknown'
  const data = evt.data ?? {}
  const toField = data.to
  const recipient = (Array.isArray(toField) ? String(toField[0] ?? '') : String(toField ?? '')).toLowerCase() || null
  const click = data.click as { link?: string } | undefined

  const { error } = await supabaseAdmin.from('email_events').insert({
    event_type: type,
    recipient,
    resend_email_id: (data.email_id as string) ?? null,
    subject: (data.subject as string) ?? null,
    clicked_url: click?.link ?? null,
    created_at: evt.created_at ?? new Date().toISOString(),
    raw: evt,
  })
  if (error && !isMissingRelation(error)) console.error('[resend webhook] insert failed:', error.message)

  if (recipient) {
    const nowIso = new Date().toISOString()
    if (type === 'opened' || type === 'clicked') {
      await supabaseAdmin.from('subscribers').update({ last_engaged_at: nowIso }).eq('email', recipient)
    } else if (type === 'complained') {
      // They marked us as spam. Stop emailing them immediately.
      await supabaseAdmin.from('subscribers').update({ confirmed: false }).eq('email', recipient)
    } else if (type === 'bounced') {
      await supabaseAdmin.from('subscribers').update({ confirmed: false, bounced_at: nowIso }).eq('email', recipient)
    }
  }

  return NextResponse.json({ received: true })
}
