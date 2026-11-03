/* The free creator pack: what a subscriber gets the moment they sign up.

   Three things, all run by Abhi, who also runs AI Film Contests:
   - Overs Pro at the founding price, on overs.studio/filmmakers
   - the guide to making an AI film for a contest, on this site
   - Creatives Club, his free community on Skool

   Every page and email that mentions the pack reads these numbers, so the
   price is written once. They are the founding offer's own numbers
   (BYOKcreativesplatform/app/lib/founding.ts); change both together. */

export const PACK_PATH = '/starter-pack'

export const OVERS = {
  url: 'https://www.overs.studio/filmmakers',
  monthlyUsd: 3,
  months: 3,
  fullUsd: 39,
  /** Founding places; the FOUNDING promo in Stripe stops after this many. */
  places: 700,
}

/** 92: $3 instead of $39. Rounded down, so it never claims more than it is. */
export const OVERS_OFF_PERCENT = Math.floor(((OVERS.fullUsd - OVERS.monthlyUsd) / OVERS.fullUsd) * 100)

export const COMMUNITY = {
  name: 'Creatives Club',
  url: 'https://www.skool.com/creatives-club-4046',
}

export const GUIDE = {
  path: '/guide/make-an-ai-film-for-a-contest',
  title: 'How to make an AI film for a contest',
}

/** The Overs link with where it was clicked, so Overs can tell which placement works. */
export function oversHref(placement: string): string {
  return `${OVERS.url}?utm_source=aifilmcontests&utm_medium=site&utm_campaign=${encodeURIComponent(placement)}`
}

export const OVERS_LINE = `Overs Pro for $${OVERS.monthlyUsd} a month for ${OVERS.months} months, ${OVERS_OFF_PERCENT}% off`

/** The last moment the founding price can be claimed: Nov 30, end of day in
    California. Stripe has to agree (the FOUNDING promo stops then), or the
    emails promise a deadline that isn't real. Move both together. */
export const OFFER_ENDS = new Date('2026-12-01T07:59:59Z')
export const OFFER_ENDS_LABEL = OFFER_ENDS.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' })

export function offerOpen(now = new Date()): boolean {
  return now.getTime() <= OFFER_ENDS.getTime()
}

/** Whole days left to claim, counting today: 1 on the last day, 0 once it's over. */
export function offerDaysLeft(now = new Date()): number {
  return Math.max(0, Math.ceil((OFFER_ENDS.getTime() - now.getTime()) / 86_400_000))
}
