import { supabase, supabaseAdmin } from './supabase'
import { Contest } from '@/data/contests'
import snapshotFile from '@/data/contests-snapshot.json'

// Map a DB row → the Contest interface the UI expects
function rowToContest(row: Record<string, unknown>): Contest {
  return {
    id: row.id as string,
    name: row.name as string,
    organizer: row.organizer as string,
    description: row.description as string,
    deadline: row.deadline as string,
    submissionOpen: row.submission_open as string | undefined,
    prize: row.prize as string,
    prizeDetails: row.prize_details as string[] | undefined,
    url: row.url as string,
    status: row.status as Contest['status'],
    categories: row.categories as Contest['categories'],
    aiToolsAllowed: row.ai_tools_allowed as string[],
    eligibility: row.eligibility as string,
    entryFee: row.entry_fee as string,
    featured: row.featured as boolean,
    featuredUntil: (row.featured_until as string | null) ?? undefined,
    featuredPaidAt: (row.featured_paid_at as string | null) ?? undefined,
    tags: row.tags as string[],
    location: row.location as string | undefined,
    eventDate: row.event_date as string | undefined,
    updatedAt: row.updated_at as string | undefined,
    createdAt: row.created_at as string | undefined,
  }
}

// Status sort order for display: open → upcoming → closed
const STATUS_ORDER: Record<string, number> = { open: 0, upcoming: 1, closed: 2 }

// Build-time snapshot of the contests table, refreshed by
// scripts/generate-contests-snapshot.mjs (wired up from next.config.js,
// since package.json is off-limits per robots/COMMON.md). Statically
// imported rather than read from disk at request time: Vercel's serverless
// bundler traces `require`/`import` calls reliably but can't resolve a
// `fs.readFileSync(path.join(process.cwd(), ...))` path at build time, which
// would risk the file silently not being in the deployed function bundle.
// A JSON import gets compiled straight into the function's JS, so there's
// nothing to trace. Used ONLY when a live read below comes back as a
// genuine transport/query failure — never for an empty table, which is a
// real, valid state handled by the callers.
const SNAPSHOT = (() => {
  const file = snapshotFile as { generatedAt: string; contests: Record<string, unknown>[] }
  if (!file?.contests?.length) return null
  return { generatedAt: file.generatedAt, contests: file.contests.map(rowToContest) }
})()

function loadSnapshot(): { generatedAt: string; contests: Contest[] } | null {
  return SNAPSHOT
}

// Set by every read below so a page that wants to tell visitors the data is
// a few hours stale (see the hero pill on src/app/page.tsx) can ask, without
// threading an extra return value through every call site. Best-effort: on a
// warm serverless instance handling overlapping requests this can show the
// status of a sibling request for a moment, which only affects this text,
// never which data is actually served.
let lastServedSnapshotAt: string | null = null
export function getSnapshotStatus(): { stale: boolean; generatedAt: string | null } {
  return { stale: lastServedSnapshotAt !== null, generatedAt: lastServedSnapshotAt }
}

// A 0-row result is never an `error` here — Supabase only populates `error` on
// a genuine transport/query failure (bad connection, DNS, 5xx, timeout). An
// empty table is just `data: []`. So any `error` means the read itself failed
// and must not be mistaken for "no contests": throw and let the page/route
// fail loudly (a 5xx) instead of silently rendering as if nothing exists.
export async function getAllContests(): Promise<Contest[]> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .order('deadline', { ascending: true })

  if (error) {
    const snapshot = loadSnapshot()
    if (snapshot) {
      console.error(`getAllContests: live read failed (${error.message}); serving snapshot from ${snapshot.generatedAt}`)
      lastServedSnapshotAt = snapshot.generatedAt
      return snapshot.contests.slice().sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    }
    throw new Error(`Failed to fetch contests: ${error.message}`)
  }

  lastServedSnapshotAt = null
  return (data as Record<string, unknown>[])
    .map(rowToContest)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}

export async function getContestsByStatus(status: Contest['status']): Promise<Contest[]> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .eq('status', status)
    .order('deadline', { ascending: true })

  if (error) {
    const snapshot = loadSnapshot()
    if (snapshot) {
      console.error(`getContestsByStatus(${status}): live read failed (${error.message}); serving snapshot from ${snapshot.generatedAt}`)
      lastServedSnapshotAt = snapshot.generatedAt
      return snapshot.contests.filter(c => c.status === status)
    }
    throw new Error(`Failed to fetch contests by status "${status}": ${error.message}`)
  }

  lastServedSnapshotAt = null
  return (data as Record<string, unknown>[]).map(rowToContest)
}

// Admin: upsert a contest (used by the daily agent)
export async function upsertContest(contest: Contest) {
  const { error } = await supabaseAdmin.from('contests').upsert({
    id: contest.id,
    name: contest.name,
    organizer: contest.organizer,
    description: contest.description,
    deadline: contest.deadline,
    submission_open: contest.submissionOpen ?? null,
    prize: contest.prize,
    prize_details: contest.prizeDetails ?? null,
    url: contest.url,
    status: contest.status,
    categories: contest.categories,
    ai_tools_allowed: contest.aiToolsAllowed,
    eligibility: contest.eligibility,
    entry_fee: contest.entryFee,
    featured: contest.featured,
    tags: contest.tags,
    location: contest.location ?? null,
    event_date: contest.eventDate ?? null,
  }, { onConflict: 'id' })

  if (error) throw new Error(`Failed to upsert contest ${contest.id}: ${error.message}`)
}

// Fetch a single contest by ID (public read). `.single()` makes PostgREST
// itself report "0 rows" as an error (code PGRST116) — that's the one error
// shape that means the row genuinely isn't there, so it maps to `null` the
// same as before. Any other error (network failure, DNS, 5xx, timeout — see
// getAllContests above) is a failed read, not a missing contest, and must
// throw instead of being mistaken for a 404.
export async function getContestById(id: string): Promise<Contest | null> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      lastServedSnapshotAt = null
      return null
    }
    const snapshot = loadSnapshot()
    if (snapshot) {
      console.error(`getContestById(${id}): live read failed (${error.message}); serving snapshot from ${snapshot.generatedAt}`)
      lastServedSnapshotAt = snapshot.generatedAt
      return snapshot.contests.find(c => c.id === id) ?? null
    }
    throw new Error(`Failed to fetch contest "${id}": ${error.message}`)
  }
  lastServedSnapshotAt = null
  if (!data) return null
  return rowToContest(data as Record<string, unknown>)
}

// Admin: mark a contest closed by id
export async function closeContest(id: string) {
  const { error } = await supabaseAdmin
    .from('contests')
    .update({ status: 'closed' })
    .eq('id', id)

  if (error) throw new Error(`Failed to close contest ${id}: ${error.message}`)
}
