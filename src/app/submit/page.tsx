import type { Metadata } from 'next'
import Link from 'next/link'
import SubmitForm from './SubmitForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'

export const metadata: Metadata = {
  title: 'Submit an AI film contest — AI Film Contests',
  description: 'List your AI film festival, contest or challenge for free. We verify every listing against its official page and alert filmmakers when it opens.',
  alternates: { canonical: `${SITE_URL}/submit` },
}

export default function SubmitPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FBFAF8', color: '#26231E', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link href="/" style={{ fontSize: 12, color: '#4f46e5', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
          AI Film Contests
        </Link>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '20px 0 10px', color: '#1B1916' }}>
          List a contest. Free, always.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6F6A61', margin: '0 0 32px' }}>
          Running an AI film festival, contest or challenge? Or found one we missed? Give us the official page and we will verify it, list it, and alert filmmakers when it opens and before it closes.
          Organizers can also <Link href="/feature" style={{ color: '#4338CA' }}>feature a listing</Link> once it is live.
        </p>
        <SubmitForm />

        <aside style={{ marginTop: 40, paddingTop: 22, borderTop: '1px solid #ECE9E2', fontSize: 13.5, lineHeight: 1.65, color: '#6F6A61' }}>
          <p style={{ margin: '0 0 6px' }}>
            Prefer a person? Email Abhi at <a href="mailto:abhixchawla@gmail.com" style={{ color: '#4338CA' }}>abhixchawla@gmail.com</a> or message him on <a href="https://www.linkedin.com/in/abhixchawla" target="_blank" rel="noopener noreferrer" style={{ color: '#4338CA' }}>LinkedIn</a>.
          </p>
          <p style={{ margin: 0 }}>
            Running the contest and want more entries? <Link href="/feature" style={{ color: '#4338CA' }}>Feature it</Link>: pinned on the homepage, a Featured badge, and a slot in the next email to every subscriber.
          </p>
        </aside>
      </div>
    </main>
  )
}
