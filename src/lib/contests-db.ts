import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { supabaseAdmin, supabaseRead } from './supabase'
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
// threading an extra return value through every call site. The shared read
// records where its data came from, so this stays right on cache hits too.
// Best-effort: on a warm serverless instance handling overlapping requests
// this can show the status of a sibling request for a moment, which only
// affects this text, never which data is actually served.
let lastServedSnapshotAt: string | null = null
export function getSnapshotStatus(): { stale: boolean; generatedAt: string | null } {
  return { stale: lastServedSnapshotAt !== null, generatedAt: lastServedSnapshotAt }
}

// ── One read, shared by every page ──────────────────────────────────────────
//
// Every content page, the sitemap and llms.txt used to run their own
// `select *` against Supabase on every request: one full-table query per page
// view, on top of the daily robots. On the Free-plan instance that is what
// saturated the database (from Oct 8 2026; outages Oct 11-14 and Oct 19).
//
// Now the table is read once and shared through Next's data cache for
// CONTESTS_REVALIDATE_SECONDS. When that window passes, the next caller still
// gets the cached list at once and the refresh runs in the background, so no
// visitor waits on the database. A failed background refresh is not cached,
// so the last good list keeps being served. Only when nothing is cached yet
// does a request wait on the database: if that read fails or takes longer
// than LIVE_READ_TIMEOUT_MS, the request gets the build-time snapshot, which
// is not cached (until Nov 5 2026 it was, and a refresh that tripped over a
// frozen function's timer pinned the snapshot in place; see readAllContestsLive).
//
// A route handler that writes contests can call revalidateTag(CONTESTS_CACHE_TAG)
// to publish sooner. The robots write straight to Supabase over REST, so their
// changes take up to fifteen minutes to show.
//
// Two things defeat this cache, so leave them out of any page that reads
// through here. `export const fetchCache = 'force-no-store'` makes
// unstable_cache skip its own cache read, so every view hits Supabase.
// `export const dynamic = 'force-dynamic'` keeps the cache but turns every
// view into a function run, and Vercel's data cache warms per region: on
// Oct 19 2026 /feature paid a full 10s live read five times over twenty
// minutes while the database was down, once per region, before it served
// from cache. Pages belong on ISR (`revalidate = 900`); one that truly needs
// request-time data should read searchParams, which renders it per request
// without either setting.
export const CONTESTS_CACHE_TAG = 'contests'
const CONTESTS_REVALIDATE_SECONDS = 900
const LIVE_READ_TIMEOUT_MS = 10_000

type ContestsRead = { contests: Contest[]; snapshotGeneratedAt: string | null }

// Rejects after `ms`. Used only around reads a request is waiting on, never
// inside a cached function (see below).
function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    p,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`TimeoutError: ${what} took over ${ms}ms`)), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

// The read inside the cache: no timer and no snapshot fallback, and any
// failure is thrown. Two reasons, both from Nov 4-5 2026, when every page
// served the snapshot:
//  - When the cached list is stale, Next returns it and runs this in the
//    background. Vercel freezes the function once the response is sent, so a
//    timer started here kept running through the freeze and fired the moment
//    the function woke for its next request (the "10s" timeouts were logged
//    150ms into those requests). Without a timer the paused read just resumes.
//  - A thrown error is never cached: Next keeps serving the last good list and
//    tries again on the next call. The old version returned the snapshot,
//    which unstable_cache then cached for fifteen minutes as if it were live.
// A 0-row result is never an `error`: Supabase only sets `error` on a real
// transport/query failure, and an empty table is just `data: []`.
async function readAllContestsLive(): Promise<Contest[]> {
  const { data, error } = await supabaseRead
    .from('contests')
    .select('*')
    .order('deadline', { ascending: true })
  if (error) throw new Error(`Failed to fetch contests: ${error.message}`)
  return (data as Record<string, unknown>[]).map(rowToContest)
}

// React's cache() makes it one read per render: a page that asks for the
// contests in several places (the logs showed eight identical reads per page)
// shares one call. The key changed with this version so lists cached by the
// old reader, snapshots included, are not served.
const readAllContests = cache(unstable_cache(readAllContestsLive, ['contests', 'all', 'v2'], {
  revalidate: CONTESTS_REVALIDATE_SECONDS,
  tags: [CONTESTS_CACHE_TAG],
}))

// The timeout and the snapshot live out here, around the call a visitor's
// request is actually waiting on, where a freeze cannot trip them. This only
// waits on the database when nothing is cached yet (a cold cache after a
// deploy); otherwise the cached list comes back at once. The snapshot is not
// cached, so the next render tries the database again.
async function sharedContests(): Promise<ContestsRead> {
  try {
    const contests = await withTimeout(readAllContests(), LIVE_READ_TIMEOUT_MS, 'contests read')
    lastServedSnapshotAt = null
    return { contests, snapshotGeneratedAt: null }
  } catch (err) {
    const snapshot = loadSnapshot()
    const reason = err instanceof Error ? err.message : String(err)
    if (!snapshot) throw new Error(`Failed to fetch contests: ${reason}`)
    console.error(`getAllContests: live read failed (${reason}); serving snapshot from ${snapshot.generatedAt}`)
    lastServedSnapshotAt = snapshot.generatedAt
    return { contests: snapshot.contests, snapshotGeneratedAt: snapshot.generatedAt }
  }
}

export async function getAllContests(): Promise<Contest[]> {
  const { contests } = await sharedContests()
  return contests.slice().sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}

export async function getContestsByStatus(status: Contest['status']): Promise<Contest[]> {
  const { contests } = await sharedContests()
  return contests.filter(c => c.status === status)
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

// Fetch a single contest by ID (public read). Served from the shared list, so
// a contest page costs the database nothing. An id that is not in the list is
// either gone or was added in the last few minutes (the research robot curls
// a contest's page right after upserting it), and one cheap single-row read
// settles which — unless the shared list itself came from the snapshot, in
// which case the database was already unreachable and asking again only hangs.
const readContestByIdLive = unstable_cache(
  async (id: string): Promise<Contest | null> => {
    const { data, error } = await supabaseRead
      .from('contests')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    // Thrown rather than returned, so a failed read is never cached as "no such contest".
    if (error) throw new Error(`Failed to fetch contest "${id}": ${error.message}`)
    return data ? rowToContest(data as Record<string, unknown>) : null
  },
  ['contests', 'by-id'],
  { revalidate: CONTESTS_REVALIDATE_SECONDS, tags: [CONTESTS_CACHE_TAG] },
)

export async function getContestById(id: string): Promise<Contest | null> {
  const { contests, snapshotGeneratedAt } = await sharedContests()
  const found = contests.find(c => c.id === id)
  if (found) return found
  if (snapshotGeneratedAt) return null
  try {
    return await withTimeout(readContestByIdLive(id), LIVE_READ_TIMEOUT_MS, `contest "${id}" read`)
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    return null
  }
}

// Admin: mark a contest closed by id
export async function closeContest(id: string) {
  const { error } = await supabaseAdmin
    .from('contests')
    .update({ status: 'closed' })
    .eq('id', id)

  if (error) throw new Error(`Failed to close contest ${id}: ${error.message}`)
}
