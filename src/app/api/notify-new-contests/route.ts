import { NextRequest, NextResponse } from 'next/server'
import { logAgentRun } from '@/lib/db-health'

// DEPRECATED. Agents used to POST here to email subscribers directly.
// Subscriber emails now go out ONLY from /api/cron/notify (one deduped email a
// day). This endpoint just records that an agent reported new contests.

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let ids: string[] = []
  try {
    const body = await request.json()
    ids = Array.isArray(body?.contestIds) ? body.contestIds : Array.isArray(body?.contests) ? body.contests.map((c: { id?: string }) => c.id).filter(Boolean) : []
  } catch { /* empty body is fine */ }
  await logAgentRun('research', 'ok', `Agent reported ${ids.length} new contests (emails handled by the daily notify cron)`, { ids })
  return NextResponse.json({ ok: true, deprecated: true, message: 'Emails are sent by /api/cron/notify once a day. Nothing sent from here.' })
}
