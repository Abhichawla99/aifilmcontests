import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isMissingRelation, logAgentRun } from '@/lib/db-health'

// Vercel Cron — runs at 8:00 AM UTC daily
// Purely mechanical: auto-close expired contests, flip upcoming→open when the
// submission window opens, and un-feature paid listings whose 30 days are up.
// No AI, no external calls — fast and reliable.

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().slice(0, 10)
  const nowIso = new Date().toISOString()
  const results: Record<string, unknown> = { date: today, closed: [], opened: [], unfeatured: [] }

  // 1 — Auto-close contests whose deadline has passed
  const { data: closed, error: closeErr } = await supabaseAdmin
    .from('contests')
    .update({ status: 'closed' })
    .in('status', ['open', 'upcoming'])
    .lt('deadline', today)
    .select('id, name, deadline')
  if (closeErr) console.error('[Cron] Auto-close failed:', closeErr.message)
  else {
    results.closed = closed ?? []
    if (closed?.length) console.log(`[Cron] Auto-closed ${closed.length} contests:`, closed.map(c => c.id))
  }

  // 2 — Flip upcoming→open when submission_open date has arrived
  const { data: opened, error: openErr } = await supabaseAdmin
    .from('contests')
    .update({ status: 'open' })
    .eq('status', 'upcoming')
    .lte('submission_open', today)
    .not('submission_open', 'is', null)
    .select('id, name, submission_open')
  if (openErr) console.error('[Cron] Auto-open failed:', openErr.message)
  else {
    results.opened = opened ?? []
    if (opened?.length) console.log(`[Cron] Auto-opened ${opened.length} contests:`, opened.map(c => c.id))
  }

  // 3 — Paid featured listings expire (column exists only after the migration)
  const { data: unfeatured, error: featErr } = await supabaseAdmin
    .from('contests')
    .update({ featured: false })
    .eq('featured', true)
    .lt('featured_until', nowIso)
    .select('id, name')
  if (featErr && !isMissingRelation(featErr)) console.error('[Cron] Un-feature failed:', featErr.message)
  else if (!featErr) results.unfeatured = unfeatured ?? []

  // 4 — Final counts
  const [total, open, upcoming, closedCount] = await Promise.all([
    supabaseAdmin.from('contests').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabaseAdmin.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
    supabaseAdmin.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
  ])
  results.totals = { total: total.count, open: open.count, upcoming: upcoming.count, closed: closedCount.count }

  const c = (results.closed as unknown[]).length, o = (results.opened as unknown[]).length, u = (results.unfeatured as unknown[]).length
  await logAgentRun('maintenance', 'ok', `${open.count} open · closed ${c} · opened ${o} · un-featured ${u}`, results)
  console.log('[Cron] Daily maintenance complete:', results.totals)
  return NextResponse.json({ ok: true, ...results })
}
