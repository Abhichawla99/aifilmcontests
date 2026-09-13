import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import { ClapperDrawing } from '@/components/Illustrations'

// Every notFound() on the site lands here: a mistyped URL, a guide that moved, or a contest
// id the weekly review merged into its duplicate. Keep the site chrome and give real ways out.
const WAYS_OUT = [
  { href: '/', title: 'Browse every contest', note: 'The full directory, open and coming soon' },
  { href: '/contests/closing-soon', title: 'Closing soon', note: 'Open contests with a deadline in the next 14 days' },
  { href: '/contests/free', title: 'Free to enter', note: 'Open contests with no entry fee' },
  { href: '/submit', title: 'Submit a contest', note: 'Send us the official page of one we are missing' },
]

export default function NotFound() {
  return (
    <InnerLayout>
      <div className="max-w-4xl mx-auto px-5 nf-wrap">
        <div className="nf-head">
          <div>
            <p className="nf-label">404 · Page not found</p>
            <h1 className="nf-title">Nothing is showing at this address.</h1>
            <p className="nf-body">
              If you followed a link to a contest, that listing may have moved or been merged with a
              duplicate. One of these will get you back to the programme.
            </p>
          </div>
          <div className="nf-drawing" aria-hidden="true">
            <ClapperDrawing />
          </div>
        </div>

        <ul className="nf-list">
          {WAYS_OUT.map(w => (
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
      </div>
    </InnerLayout>
  )
}
