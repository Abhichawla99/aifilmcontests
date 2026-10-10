/* ── The deadline, read the way the data actually writes it ──────────────────
   Every `deadline` in the contests table is a bare calendar day — all 240 rows
   are `YYYY-MM-DD`, with no time and no zone. `new Date('2026-10-10')` turns
   that into midnight UTC, which is an *instant*, and an instant lands on a
   different calendar day depending on where the reader is sitting. Because
   ContestCard, ContestBrowser and FeaturedSpotlight are all client components,
   that instant was being formatted in the visitor's own timezone:

     · Denver / New York, 2026-10-10 — a contest closing Oct 10 printed
       "Oct 9, 2026", a day already gone, while the server-rendered ticker at
       the top of the same page said "today · OCT 10". The page contradicted
       itself.
     · The countdown had the same fault one step worse: midnight UTC on the
       deadline day is the *start* of it, so a contest with all of Oct 11 still
       to run read "5 hours left", and the three closing that very day fell
       through `diff <= 0` to no countdown at all — the most urgent contests on
       the site were the only ones with nothing urgent on them.
     · "5 hours left" was never in the data to begin with. A date-only deadline
       cannot support an hour; the precision was an artefact of the parse.

   So a deadline is handled here as what it is — a day on a calendar, not a
   point on a clock. The printed date is built from the string's own numerals
   and formatted in UTC, so it reads the same in Auckland and in Denver. The
   count is a difference of two calendar days: the deadline's, and the one the
   reader is actually having. Whole days only, because whole days are all the
   data knows.                                                                */

const BARE_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

/** Noon UTC for a calendar day. Noon, not midnight, so no offset or DST seam
    can ever nudge the subtraction onto the day either side. */
function dayStamp(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d, 12)
}

/** The deadline as a calendar day, or null if it isn't a bare date. */
function deadlineDay(deadline: string): number | null {
  const m = BARE_DAY.exec(deadline.trim())
  if (!m) return null
  return dayStamp(Number(m[1]), Number(m[2]), Number(m[3]))
}

/** The calendar day the reader is having, in their own timezone. */
function today(now: Date): number {
  return dayStamp(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

/**
 * Whole days from the reader's today to the deadline day.
 * 0 is the day it closes, 1 is tomorrow, negative is past.
 * Anything that isn't a bare `YYYY-MM-DD` falls back to the old instant
 * arithmetic rather than throwing, so a stray timestamp still sorts sanely.
 */
export function daysUntilDeadline(deadline: string, now: Date = new Date()): number {
  const day = deadlineDay(deadline)
  if (day === null) return Math.ceil((new Date(deadline).getTime() - now.getTime()) / 86_400_000)
  return Math.round((day - today(now)) / 86_400_000)
}

/** "Oct 10, 2026" — the day the string names, in every timezone. */
export function formatDeadline(deadline: string): string {
  const m = BARE_DAY.exec(deadline.trim())
  if (!m) return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return new Date(dayStamp(Number(m[1]), Number(m[2]), Number(m[3]))).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** "Oct 10" — same thing without the year, for rows that are already dense. */
export function formatDeadlineShort(deadline: string): string {
  const m = BARE_DAY.exec(deadline.trim())
  if (!m) return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return new Date(dayStamp(Number(m[1]), Number(m[2]), Number(m[3]))).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}

/**
 * How long is left, in the one register the data supports.
 * Null once the day has passed — a card that can no longer promise time
 * should fall back to the date rather than count down to nothing.
 */
export function timeLeftPhrase(days: number): string | null {
  if (days < 0) return null
  if (days === 0) return 'Closes today'
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}
