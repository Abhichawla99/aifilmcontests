#!/usr/bin/env node
// Ping IndexNow for every page added or changed since the last sweep, so the
// seo/optimizer robots don't have to list URLs by hand at the end of a run.
//
// "Added"   = any URL in the live sitemap that wasn't there on the previous sweep
//             (a new contest page, a new creator profile, a new guide/topic/tool/
//             vs/location/prize/category page, a new static route — whatever grew
//             the sitemap).
// "Changed" = an existing contest page whose Supabase created_at/updated_at falls
//             inside the lookback window. The sitemap's own lastModified for every
//             non-contest page is just "now" at request time (see src/app/sitemap.ts),
//             so it can't be used as a change signal — only the "added" check covers
//             those page families.
//
// State lives outside the repo, like seo-done.json, because every run works from a
// fresh clone with no history: reports/indexnow-sweep-state.json by default.
//
// Usage:
//   node scripts/indexnow-sweep.mjs                ping what changed since the last sweep
//   node scripts/indexnow-sweep.mjs --hours 48     widen/narrow the "changed contest" window (default 24)
//   node scripts/indexnow-sweep.mjs --dry-run       print what would be pinged, ping nothing, don't save state
//   node scripts/indexnow-sweep.mjs --state <path>  use a different state file
//
// First run ever: no previous state to compare against, so it saves a baseline and
// pings nothing (there is no "before" to diff) rather than ping the entire sitemap.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return
  try {
    for (const line of readFileSync('/Users/home/aifilmcontests/.env.cron', 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
    }
  } catch { /* rely on process.env */ }
}
loadEnv()

const BASE = 'https://aifilmcontests.com'
const scriptDir = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const hoursFlag = args.indexOf('--hours')
const hours = hoursFlag !== -1 ? Number(args[hoursFlag + 1]) : 24
const stateFlag = args.indexOf('--state')
const statePath = stateFlag !== -1
  ? args[stateFlag + 1]
  : (process.env.INDEXNOW_SWEEP_STATE || '/Users/home/aifilmcontests/reports/indexnow-sweep-state.json')

function loadState() {
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'))
  } catch {
    return null
  }
}

function saveState(urls) {
  try {
    mkdirSync(dirname(statePath), { recursive: true })
    writeFileSync(statePath, JSON.stringify({ urls: [...urls].sort(), updatedAt: new Date().toISOString() }, null, 2) + '\n')
  } catch (err) {
    console.error(`Could not save state to ${statePath}: ${err.message}`)
  }
}

async function fetchSitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`)
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  if (urls.length === 0) throw new Error('sitemap.xml parsed to 0 URLs')
  return urls
}

async function fetchRecentlyChangedContestIds(sinceIso) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: skipping the "changed contest" signal, added-page detection still runs.')
    return []
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase
    .from('contests')
    .select('id, created_at, updated_at')
    .or(`created_at.gte.${sinceIso},updated_at.gte.${sinceIso}`)
  if (error) {
    console.error(`Supabase query failed: ${error.message} — skipping the "changed contest" signal.`)
    return []
  }
  return (data || []).map(r => r.id)
}

let currentUrls
try {
  currentUrls = await fetchSitemapUrls()
} catch (err) {
  console.error(`Could not read the live sitemap: ${err.message}`)
  process.exit(1)
}
const currentSet = new Set(currentUrls)

const prevState = loadState()
const firstRun = !prevState
const prevSet = new Set(prevState?.urls || [])

const addedUrls = currentUrls.filter(u => !prevSet.has(u))

const since = new Date(Date.now() - hours * 3600 * 1000).toISOString()
const changedContestIds = await fetchRecentlyChangedContestIds(since)
const addedSet = new Set(addedUrls)
const changedUrls = changedContestIds
  .map(id => `${BASE}/contests/${id}`)
  .filter(u => currentSet.has(u) && !addedSet.has(u))

const toPing = [...new Set([...addedUrls, ...changedUrls])]

console.log(`Sitemap has ${currentUrls.length} URL(s).`)
console.log(firstRun
  ? 'No previous state — this is the first sweep.'
  : `${addedUrls.length} new since the last sweep, ${changedUrls.length} existing contest page(s) changed in the last ${hours}h.`)

if (firstRun) {
  console.log(`Saving a baseline to ${statePath}. Nothing pinged this time; future runs will ping only what changes from here.`)
  if (!dry) saveState(currentUrls)
  process.exit(0)
}

if (toPing.length === 0) {
  console.log('Nothing new or changed. Nothing to ping.')
  if (!dry) saveState(currentUrls)
  process.exit(0)
}

console.log(`Pinging IndexNow for ${toPing.length} URL(s):`)
for (const u of toPing) console.log(`  ${u}`)

if (dry) {
  console.log('(--dry-run: not pinging, not saving state)')
  process.exit(0)
}

const res = spawnSync('node', [`${scriptDir}/indexnow-ping.mjs`, ...toPing], { stdio: 'inherit' })
saveState(currentUrls)
process.exit(res.status ?? 1)
