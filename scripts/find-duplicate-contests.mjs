/**
 * Find likely duplicate contest rows in Supabase and print which one to keep.
 * Read-only: makes no writes. The weekly review robot merges based on this output.
 *
 * Run: node scripts/find-duplicate-contests.mjs
 *
 * Groups rows that are probably the same contest by two signals:
 *   1. Name match after stripping year/edition numbers and punctuation
 *   2. Same URL domain + same deadline
 * For each group, picks the "most complete" row to keep — the one with the
 * most non-empty fields (description, prize, prize_details, categories,
 * ai_tools_allowed, eligibility, entry_fee, tags, location, event_date) —
 * and prints the rest as extras.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

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

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (checked env and .env.cron)')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

// Strip year/edition numbers and punctuation so "AI Film Fest 2026" and
// "AI Film Fest — 3rd Edition" both normalize to "ai film fest".
function normalizeName(name) {
  return String(name)
    .toLowerCase()
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/\b\d+(st|nd|rd|th)\b/g, '')
    .replace(/\bedition\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Multi-tenant submission platforms: dozens of unrelated festivals share
// these domains, so "same domain" there means nothing — only the festival's
// own domain (or a platform subdomain unique to one festival) is a useful signal.
const SUBMISSION_PLATFORM_DOMAINS = new Set([
  'filmfreeway.com',
  'festhome.com',
  'filmmakers.festhome.com',
  'clickforentry.com',
  'withoutabox.com',
  'movibeta.com',
  'eventival.com',
])

function domainOf(u) {
  try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' }
}

// Generic words that appear in almost every contest name and carry no
// distinguishing signal on their own (every row here is an "AI film festival").
const NAME_STOPWORDS = new Set([
  'ai', 'film', 'films', 'festival', 'international', 'the', 'and', 'of',
  'for', 'awards', 'award', 'contest', 'competition', 'challenge', 'short',
  'shorts', 'movie', 'cinema', 'a', 'in',
])

function significantTokens(name) {
  return new Set(normalizeName(name).split(' ').filter(t => t && !NAME_STOPWORDS.has(t)))
}

// True Jaccard overlap (intersection / union) of the distinguishing words in
// two names — used to corroborate weaker signals (same host, same page),
// since one host or one hub page can carry several unrelated or differently
// timed programs. Requires at least 2 significant tokens per side: with only
// 1 (a name that reduces to just the host/company name once generic words
// are stripped), a single shared word looks like high overlap but proves
// nothing. Union (not the smaller side) in the denominator avoids letting a
// short, mostly-generic name inflate the score against a longer, specific one.
function nameTokenOverlap(nameA, nameB) {
  const a = significantTokens(nameA), b = significantTokens(nameB)
  if (a.size < 2 || b.size < 2) return 0
  let shared = 0
  for (const t of a) if (b.has(t)) shared++
  const union = new Set([...a, ...b]).size
  return shared / union
}
const DOMAIN_MATCH_MIN_NAME_OVERLAP = 0.5

const FIELDS_FOR_COMPLETENESS = [
  'description', 'prize', 'prize_details', 'categories', 'ai_tools_allowed',
  'eligibility', 'entry_fee', 'tags', 'location', 'event_date', 'organizer',
]

function completenessScore(row) {
  let score = 0
  for (const f of FIELDS_FOR_COMPLETENESS) {
    const v = row[f]
    if (v == null) continue
    if (Array.isArray(v)) { if (v.length > 0) score++ }
    else if (String(v).trim().length > 0) score++
  }
  return score
}

const { data: rows, error } = await supabase
  .from('contests')
  .select('*')
  .order('id', { ascending: true })

if (error) {
  console.error(`Failed to read contests: ${error.message}`)
  process.exit(1)
}

function daysBetween(a, b) {
  const da = new Date(a), db = new Date(b)
  if (isNaN(da) || isNaN(db)) return Infinity
  return Math.abs(da - db) / 86400000
}

// A name match only counts as a duplicate signal if the deadlines are close
// together (same edition, entered twice) — not ~1 year apart, which is just
// next year's edition of a recurring festival and belongs as its own row.
const NAME_MATCH_MAX_DEADLINE_GAP_DAYS = 60

// Group by normalized name (gated by deadline proximity), and separately by
// domain+deadline; merge groups that share any row so a contest caught by
// either signal ends up together.
const groups = new Map() // key -> Set of row ids
const rowById = new Map(rows.map(r => [r.id, r]))

function addToGroup(key, id) {
  if (!groups.has(key)) groups.set(key, new Set())
  groups.get(key).add(id)
}

const byNameKey = new Map()
for (const row of rows) {
  const nameKey = normalizeName(row.name)
  if (!nameKey) continue
  if (!byNameKey.has(nameKey)) byNameKey.set(nameKey, [])
  byNameKey.get(nameKey).push(row)
}
for (const [nameKey, group] of byNameKey) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      if (daysBetween(group[i].deadline, group[j].deadline) <= NAME_MATCH_MAX_DEADLINE_GAP_DAYS) {
        addToGroup(`name:${nameKey}:${group[i].deadline}`, group[i].id)
        addToGroup(`name:${nameKey}:${group[i].deadline}`, group[j].id)
      }
    }
  }
}

// Same page (domain + path, case-insensitive, ignoring trailing slash) is a
// useful signal, but not on its own: a generic hub page ("/competitions", a
// bare homepage) can list several distinct, differently-timed programs. So
// still require corroboration — either a close deadline (same round entered
// twice) or real name overlap (near-identical title, deadline just corrected).
const URL_MATCH_MAX_DEADLINE_GAP_DAYS = 14
function normalizedUrlKey(u) {
  try {
    const parsed = new URL(u)
    const host = parsed.hostname.replace(/^www\./, '')
    const path = parsed.pathname.replace(/\/+$/, '').toLowerCase()
    return `${host}${path}`
  } catch { return '' }
}
const byUrl = new Map()
for (const row of rows) {
  const key = normalizedUrlKey(row.url)
  if (!key) continue
  if (!byUrl.has(key)) byUrl.set(key, [])
  byUrl.get(key).push(row)
}
for (const [key, group] of byUrl) {
  if (group.length < 2) continue
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const closeDeadline = daysBetween(group[i].deadline, group[j].deadline) <= URL_MATCH_MAX_DEADLINE_GAP_DAYS
      const similarName = nameTokenOverlap(group[i].name, group[j].name) >= DOMAIN_MATCH_MIN_NAME_OVERLAP
      if (closeDeadline || similarName) {
        addToGroup(`url:${key}`, group[i].id)
        addToGroup(`url:${key}`, group[j].id)
      }
    }
  }
}

const byDomainDeadline = new Map()
for (const row of rows) {
  const domain = domainOf(row.url)
  if (!domain || !row.deadline || SUBMISSION_PLATFORM_DOMAINS.has(domain)) continue
  const key = `${domain}|${row.deadline}`
  if (!byDomainDeadline.has(key)) byDomainDeadline.set(key, [])
  byDomainDeadline.get(key).push(row)
}
for (const [key, group] of byDomainDeadline) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      // Same host + same deadline can still be two unrelated programs
      // (e.g. a company running both a music and a film challenge), so also
      // require their names to actually overlap.
      if (nameTokenOverlap(group[i].name, group[j].name) >= DOMAIN_MATCH_MIN_NAME_OVERLAP) {
        addToGroup(`domain-deadline:${key}`, group[i].id)
        addToGroup(`domain-deadline:${key}`, group[j].id)
      }
    }
  }
}

// Union-find-lite: merge any groups sharing a row id
const idToGroupIdx = new Map()
const merged = []
for (const idSet of groups.values()) {
  const ids = [...idSet]
  if (ids.length < 2) continue // not a duplicate signal on its own
  const touched = new Set(ids.map(id => idToGroupIdx.get(id)).filter(i => i !== undefined))
  if (touched.size === 0) {
    const idx = merged.length
    merged.push(new Set(ids))
    for (const id of ids) idToGroupIdx.set(id, idx)
  } else {
    const [first, ...rest] = [...touched]
    for (const id of ids) merged[first].add(id)
    for (const idx of rest) {
      for (const id of merged[idx]) { merged[first].add(id); idToGroupIdx.set(id, first) }
      merged[idx] = null
    }
    for (const id of ids) idToGroupIdx.set(id, first)
  }
}

const finalGroups = merged.filter(g => g && g.size > 1)

if (finalGroups.length === 0) {
  console.log('No likely duplicates found.')
  process.exit(0)
}

console.log(`Found ${finalGroups.length} likely duplicate group(s):\n`)

for (const idSet of finalGroups) {
  const ids = [...idSet]
  const rowsInGroup = ids.map(id => rowById.get(id)).filter(Boolean)
  rowsInGroup.sort((a, b) => completenessScore(b) - completenessScore(a))
  const keep = rowsInGroup[0]
  const extras = rowsInGroup.slice(1)
  console.log(`DUPLICATE: keep ${keep.id} — extras ${extras.map(r => r.id).join(', ')}`)
  console.log(`  keep:   "${keep.name}" (${keep.url}, deadline ${keep.deadline}, score ${completenessScore(keep)})`)
  for (const e of extras) {
    console.log(`  extra:  "${e.name}" (${e.url}, deadline ${e.deadline}, score ${completenessScore(e)})`)
  }
  console.log('')
}
