#!/usr/bin/env node
// Build-time snapshot of the `contests` table, used by src/lib/contests-db.ts
// to keep pages readable (and indexable) during a Supabase outage instead of
// throwing — see OPTIMIZER_BACKLOG.md's "Serve the last known contest list
// when the database will not answer" item (2026-10-11 to 15 outage).
//
// Never fails the build: any problem here just leaves whatever snapshot (or
// lack of one) is already on disk and logs a warning. It is invoked from
// next.config.js, not package.json (package.json is off-limits per
// robots/COMMON.md rule 3), only on an actual `next build`.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SNAPSHOT_PATH = path.join(__dirname, '..', 'src', 'data', 'contests-snapshot.json')

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('[snapshot] Missing Supabase env vars — skipping; previous snapshot (if any) kept.')
    return
  }

  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/contests?select=*&order=deadline.asc`
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })

  if (!res.ok) {
    console.warn(`[snapshot] Supabase responded ${res.status} — skipping; previous snapshot (if any) kept.`)
    return
  }

  const rows = await res.json()
  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('[snapshot] Supabase returned no rows — skipping; previous snapshot (if any) kept.')
    return
  }

  fs.writeFileSync(
    SNAPSHOT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), contests: rows }, null, 2) + '\n'
  )
  console.log(`[snapshot] Wrote ${rows.length} contests to ${path.relative(process.cwd(), SNAPSHOT_PATH)}`)
}

main().catch(err => {
  console.warn('[snapshot] Failed, previous snapshot (if any) kept:', err.message)
})
