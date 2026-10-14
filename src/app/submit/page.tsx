import type { Metadata } from 'next'
import Link from 'next/link'
import InnerLayout from '@/components/InnerLayout'
import SubmitForm from './SubmitForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

export const metadata: Metadata = {
  title: 'Submit an AI film contest — AI Film Contests',
  description: 'List your AI film festival, contest or challenge for free. We verify every listing against its official page and alert filmmakers when it opens.',
  alternates: { canonical: `${SITE_URL}/submit` },
}

export default function SubmitPage() {
  return (
    <InnerLayout>
      <div className="max-w-5xl mx-auto px-5 sbp-wrap">
        <p className="sbp-label">Submit a contest</p>
        <h1 className="sbp-title">List a contest. Free, always.</h1>
        <p className="sbp-body">
          Running an AI film festival, contest or challenge? Or found one we missed? Give us the official page and we will verify it, list it, and alert filmmakers when it opens and before it closes.
          Organizers can also <Link href="/feature">feature a listing</Link> once it is live.
        </p>
        <SubmitForm />

        {/* Two different offers were sharing one unlabelled block of fine print: the
            only human contact route on the page, and the paid placement. Each now
            carries the caption idiom the rest of the site uses, and sits in body ink
            at a reading size — an address a stranger is meant to write to should not
            be the palest thing on the page. Captions reuse the footer's own words. */}
        <aside className="sbp-aside">
          <div className="sbp-aside-block">
            <p className="sbp-aside-caption">Contact</p>
            <p>
              Prefer a person? Email Abhi at <a href="mailto:abhixchawla@gmail.com">abhixchawla@gmail.com</a> or message him on <a href="https://www.linkedin.com/in/abhixchawla" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
            </p>
          </div>
          <div className="sbp-aside-block">
            <p className="sbp-aside-caption">Featured listings</p>
            <p>
              Running the contest and want more entries? <Link href="/feature">Feature it</Link>: pinned on the homepage, a Featured badge, and a slot in the next email to every subscriber.
            </p>
          </div>
        </aside>
      </div>
    </InnerLayout>
  )
}
