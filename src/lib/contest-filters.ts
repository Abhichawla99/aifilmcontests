// Shared predicates for the open-contest list routes under src/app/contests/
// (closing-soon, free, cash-prizes, new, student). Pulled out to a shared,
// non-page module so sitemap.ts can reuse the exact same matching logic for
// each route's lastModified -- a page.tsx can only export the fields Next's
// route-segment config recognizes (default, metadata, dynamic, etc.), so
// these can't live there as named exports.

export const CLOSING_SOON_WINDOW_DAYS = 14
export const NEW_WINDOW_DAYS = 14

const FREE_ENTRY_TERMS = ['free', 'no fee', 'no entry fee', '$0', 'none']

export function isFree(entryFee: string): boolean {
  if (!entryFee) return true
  const lower = entryFee.toLowerCase()
  return FREE_ENTRY_TERMS.some(t => lower.includes(t))
}

const CURRENCY_PATTERN = /[$€£¥]\s?\d|\d\s?(usd|cad|eur|gbp|aud)/i

export function hasCashPrize(prize: string): boolean {
  if (!prize) return false
  return CURRENCY_PATTERN.test(prize)
}

export function isRecent(createdAt: string | undefined): boolean {
  if (!createdAt) return false
  const cutoff = Date.now() - NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
  return new Date(createdAt).getTime() >= cutoff
}

export function isForStudents(eligibility: string): boolean {
  if (!eligibility) return false
  return /student/i.test(eligibility)
}
