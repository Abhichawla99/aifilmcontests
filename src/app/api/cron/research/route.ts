import { NextRequest, NextResponse } from 'next/server'
import { runResearch } from '@/lib/research'

// Vercel Cron — runs at 8:15 AM UTC daily
// Logic lives in /lib/research.ts so admin panel can call it directly too.
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runResearch()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
