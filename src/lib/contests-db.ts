import { unstable_cache } from 'next/cache'
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
// visitor waits on the database. A live read that fails, or hangs longer than
// LIVE_READ_TIMEOUT_MS, falls back to the build-time snapshot, and that
// fallback is cached like any other result: hammering a database that is
// already down only keeps it down.
//
// A route handler that writes contests can call revalidateTag(CONTESTS_CACHE_TAG)
// to publish sooner. The robots write straight to Supabase over REST, so their
// changes take up to fifteen minutes to show.
//
// Do not put `export const dynamic = 'force-dynamic'` on a page that reads
// through here: Next 14 treats it as fetchCache = 'force-no-store', under
// which unstable_cache never reads its cache, and every view hits Supabase
// again. A page that needs request-time data should read searchParams or
// headers instead; that renders per request and keeps this cache.
export const CONTESTS_CACHE_TAG = 'contests'
const CONTESTS_REVALIDATE_SECONDS = 900
const LIVE_READ_TIMEOUT_MS = 10_000

type ContestsRead = { contests: Contest[]; snapshotGeneratedAt: string | null }

// A 0-row result is never an `error` here — Supabase only populates `error` on
// a genuine transport/query failure (bad connection, DNS, 5xx, timeout). An
// empty table is just `data: []`. So any `error` means the read itself failed
// and must not be mistaken for "no contests": serve the snapshot, or throw and
// let the page/route fail loudly (a 5xx) instead of silently rendering as if
// nothing exists.
async function readAllContestsLive(): Promise<ContestsRead> {
  const { data, error } = await supabase
    .from('contests')
    .select('*')
    .order('deadline', { ascending: true })
    .abortSignal(AbortSignal.timeout(LIVE_READ_TIMEOUT_MS))

  if (error) {
    const snapshot = loadSnapshot()
    if (snapshot) {
      console.error(`getAllContests: live read failed (${error.message}); serving snapshot from ${snapshot.generatedAt}`)
      return { contests: snapshot.contests, snapshotGeneratedAt: snapshot.generatedAt }
    }
    throw new Error(`Failed to fetch contests: ${error.message}`)
  }

  return {
    contests: (data as Record<string, unknown>[]).map(rowToContest),
    snapshotGeneratedAt: null,
  }
}

const readAllContests = unstable_cache(readAllContestsLive, ['contests', 'all'], {
  revalidate: CONTESTS_REVALIDATE_SECONDS,
  tags: [CONTESTS_CACHE_TAG],
})

async function sharedContests(): Promise<ContestsRead> {
  const read = await readAllContests()
  lastServedSnapshotAt = read.snapshotGeneratedAt
  return read
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
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('id', id)
      .abortSignal(AbortSignal.timeout(LIVE_READ_TIMEOUT_MS))
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
    return await readContestByIdLive(id)
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
