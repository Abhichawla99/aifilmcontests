import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { isMissingRelation, logAgentRun } from '@/lib/db-health'

// Stripe → us. When an organizer pays for a featured listing, flip the switch.
// Setup: Stripe → Payment Links → create the product. Stripe → Developers →
// Webhooks → add https://aifilmcontests.com/api/webhooks/stripe, event
// checkout.session.completed → copy signing secret → Vercel env STRIPE_WEBHOOK_SECRET.
// The /feature page sends the contest id as client_reference_id.
// No Stripe SDK needed: signature is HMAC-SHA256 over "t.body" (hex).

export const runtime = 'nodejs'
const FEATURE_DAYS = Number(process.env.FEATURED_DAYS || 30)

function verifyStripe(secret: string, header: string, body: string): boolean {
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=') as [string, string]))
  const t = parts.t
  if (!t) return false
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')
  const exp = Buffer.from(expected)
  return header.split(',').some(kv => {
    const [k, v] = kv.split('=')
    if (k !== 'v1' || !v) return false
    const got = Buffer.from(v)
    return got.length === exp.length && crypto.timingSafeEqual(got, exp)
  })
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const body = await request.text()
  if (!secret) return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not set' }, { status: 503 })
  const sig = request.headers.get('stripe-signature') ?? ''
  if (!sig || !verifyStripe(secret, sig, body)) return NextResponse.json({ error: 'Bad signature' }, { status: 401 })

  let evt: { type?: string; data?: { object?: Record<string, unknown> } }
  try { evt = JSON.parse(body) } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }) }
  if (evt.type !== 'checkout.session.completed') return NextResponse.json({ received: true, ignored: evt.type })

  const s = evt.data?.object ?? {}
  const meta = (s.metadata ?? {}) as Record<string, string>
  const contestId = (s.client_reference_id as string) || meta.contest_id || null
  const payer = ((s.customer_details as { email?: string } | undefined)?.email) ?? (s.customer_email as string) ?? null
  const amount = Number(s.amount_total ?? 0)
  const currency = String(s.currency ?? 'usd').toUpperCase()

  if (!contestId) {
    await logAgentRun('sale', 'failed', `Payment received (${amount / 100} ${currency}) but no contest id attached. Payer: ${payer ?? 'unknown'}`, { session: s.id })
    return NextResponse.json({ received: true, warning: 'no contest id' })
  }

  const now = new Date()
  const { data: existing } = await supabaseAdmin.from('contests').select('name,featured_until').eq('id', contestId).maybeSingle()
  const base = existing?.featured_until && new Date(existing.featured_until as string) > now ? new Date(existing.featured_until as string) : now
  const until = new Date(base.getTime() + FEATURE_DAYS * 86_400_000).toISOString()

  let { error } = await supabaseAdmin.from('contests')
    .update({ featured: true, featured_until: until, featured_paid_at: now.toISOString() })
    .eq('id', contestId)
  if (error && isMissingRelation(error)) {
    // Migration not applied yet: still honour the purchase.
    ;({ error } = await supabaseAdmin.from('contests').update({ featured: true }).eq('id', contestId))
  }

  const name = (existing?.name as string) ?? contestId
  if (error) {
    await logAgentRun('sale', 'failed', `Paid ${amount / 100} ${currency} for ${name} but could not mark featured: ${error.message}`, { contestId, payer })
    return NextResponse.json({ received: true, error: error.message }, { status: 500 })
  }

  await logAgentRun('sale', 'ok', `💰 Featured listing sold: ${name} — ${amount / 100} ${currency} from ${payer ?? 'unknown'} (featured until ${until.slice(0, 10)})`, { contestId, payer, amount, currency, until })
  return NextResponse.json({ received: true, contestId, featuredUntil: until })
}
