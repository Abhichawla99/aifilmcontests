import { NextRequest, NextResponse } from 'next/server'
import { supabaseRead } from '@/lib/supabase'

// TEMPORARY (Nov 2026): times reads of the contests table from inside a
// Vercel function, where the shared contests read keeps timing out while the
// same read from the build and from outside Vercel is fast. Remove once the
// cause is known. Same auth as the crons.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` }

async function time(label: string, fn: () => Promise<string>) {
  const t = Date.now()
  try {
    const detail = await fn()
    return { label, ms: Date.now() - t, ok: true, detail }
  } catch (err) {
    return { label, ms: Date.now() - t, ok: false, detail: err instanceof Error ? `${err.name}: ${err.message}` : String(err) }
  }
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const signal = () => AbortSignal.timeout(25_000)
  const results = []

  results.push(await time('fetch id, limit 1', async () => {
    const r = await fetch(`${URL_}/rest/v1/contests?select=id&limit=1`, { headers, cache: 'no-store', signal: signal() })
    return `${r.status} ${(await r.text()).length}B`
  }))

  results.push(await time('fetch full table: headers', async () => {
    const r = await fetch(`${URL_}/rest/v1/contests?select=*&order=deadline.asc`, { headers, cache: 'no-store', signal: signal() })
    const head = `${r.status} after headers`
    const t = Date.now()
    const body = await r.text()
    return `${head}; body ${body.length}B in ${Date.now() - t}ms`
  }))

  results.push(await time('supabase-js full table', async () => {
    const { data, error } = await supabaseRead.from('contests').select('*').order('deadline', { ascending: true }).abortSignal(signal())
    if (error) throw new Error(error.message)
    return `${data.length} rows`
  }))

  results.push(await time('8 parallel supabase-js full table', async () => {
    const all = await Promise.all(Array.from({ length: 8 }, () =>
      supabaseRead.from('contests').select('*').order('deadline', { ascending: true }).abortSignal(signal())))
    const bad = all.filter(r => r.error)
    if (bad.length) throw new Error(`${bad.length} of 8 failed: ${bad[0].error!.message}`)
    return '8 ok'
  }))

  return NextResponse.json({ node: process.version, region: process.env.VERCEL_REGION ?? null, results })
}
