'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import { ClapperDrawing } from '@/components/Illustrations'

// Every thrown render on the site lands here. Since 2026-10-12 that is almost always one
// thing: src/lib/contests-db.ts now throws when Supabase cannot be reached instead of
// returning [], so a transport failure fails the render rather than printing zeros.
// That was the right fix — but with no error.tsx the result was Next's own fallback,
// "Application error: a server-side exception has occurred", centred on a blank page with
// no header, no footer, no brand and no way out. Every visitor saw it all day on 10-11
// and 10-12. This is the same object as not-found.tsx and reuses its .nf-* setting:
// the site kept around a plain statement, then ruled rows.
//
// The ways out are NOT the 404's. Checked against a live outage (Supabase 522, every
// route curled): / , /creators , /feature , /cinematic-ads , /contests/* , /topics/* and
// /tools/* all return 500, because they all read the contest table. Offering "Browse every
// contest" here would hand someone a second identical failure. Only the two pages below
// render without touching the listings, so only those two are listed.
const STILL_LOADING = [
  { href: '/submit', title: 'Submit a contest', note: 'Send us the official page of one we are missing' },
  { href: '/unsubscribe', title: 'Unsubscribe from alerts', note: 'Stop the deadline emails' },
]

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Surfaces the real cause in the Vercel function log, where the digest below is the
  // string that matches this render to that entry.
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <InnerLayout>
      <div className="max-w-4xl mx-auto px-5 nf-wrap">
        <div className="nf-head">
          <div>
            <p className="nf-label">Error · This page did not load</p>
            <h1 className="nf-title">Something failed on our side.</h1>
            <p className="nf-body">
              This is not a page that has gone missing. Nearly every page here reads from one
              contest database, and when that is unreachable the pages that list contests fail
              like this one just did. The contests themselves are untouched.
            </p>
          </div>
          <div className="nf-drawing" aria-hidden="true">
            <ClapperDrawing />
          </div>
        </div>

        <div className="err-actions">
          <button type="button" className="btn" onClick={() => reset()}>
            Try again
          </button>
          <p className="err-actions-note">
            Retrying re-reads the live data. If it keeps failing, the database is down and the
            listing pages will not load until it is back.
          </p>
        </div>

        <p className="err-caption">These do not read the database, so they still load</p>
        <ul className="nf-list">
          {STILL_LOADING.map(w => (
            <li key={w.href}>
              <Link href={w.href} className="nf-row">
                <span>
                  <span className="nf-row-title">{w.title}</span>
                  <span className="nf-row-note">{w.note}</span>
                </span>
                <span className="nf-row-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Next's own digest for this render. Quoting it is what makes a report actionable,
            so it is printed rather than hidden — quietly, since it means nothing to most people. */}
        {error.digest && (
          <p className="err-digest">
            Reference <span>{error.digest}</span>
          </p>
        )}
      </div>
    </InnerLayout>
  )
}
