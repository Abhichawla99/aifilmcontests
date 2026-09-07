#!/usr/bin/env node
// Log what a robot did so the daily report can say it in plain words.
//
// Usage:
//   node scripts/log-run.mjs <task> <ok|failed|skipped> "<one-line summary>" ['{"any":"json details"}']
//
// Tasks we use: research | seo | optimizer | sales | notify | scorecard | outreach | sale
// Works from any directory. Reads Supabase creds from env, falling back to
// /Users/home/aifilmcontests/.env.cron. Always appends a local copy to
// /Users/home/aifilmcontests/cron-logs/agent-runs.jsonl, even if Supabase is unavailable.

import { readFileSync, appendFileSync, mkdirSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const [task, status, summary = '', detailsRaw] = process.argv.slice(2)
if (!task || !['ok', 'failed', 'skipped'].includes(status)) {
  console.error('usage: node scripts/log-run.mjs <task> <ok|failed|skipped> "<summary>" [details-json]')
  process.exit(2)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    for (const line of readFileSync('/Users/home/aifilmcontests/.env.cron', 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
    }
  } catch { /* no local env file; rely on process.env */ }
}

let details = null
if (detailsRaw) {
  try { details = JSON.parse(detailsRaw) } catch { details = { note: detailsRaw } }
}

const row = { task, status, summary: String(summary).slice(0, 2000), details, ran_at: new Date().toISOString() }

try {
  mkdirSync('/Users/home/aifilmcontests/cron-logs', { recursive: true })
  appendFileSync('/Users/home/aifilmcontests/cron-logs/agent-runs.jsonl', JSON.stringify(row) + '\n')
} catch { /* local log is best-effort */ }

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.warn('[log-run] No Supabase credentials found; logged locally only.')
  process.exit(0)
}

const sb = createClient(url, key, { auth: { persistSession: false } })
const { error } = await sb.from('agent_runs').insert(row)
if (error) {
  console.warn(`[log-run] Supabase insert failed (${error.code ?? 'no code'}): ${error.message}. Logged locally only.`)
  if (/does not exist|schema cache|could not find/i.test(error.message)) {
    console.warn('[log-run] The agent_runs table is missing. Paste supabase/migrations/2026-09-07-autopilot.sql into the Supabase SQL editor.')
  }
  process.exit(0)
}
console.log(`[log-run] ${task} ${status}: ${row.summary}`)
