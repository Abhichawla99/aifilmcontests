import Link from 'next/link'
import LogoMark from './LogoMark'

/* The one footer. Until 2026-09-30 the site drew five of them: the homepage's
   column grid (rebuilt 09-20), InnerLayout's eight-link wrapping row, the
   contest page's four links with middot separators, a two-word stub on
   /tools and /categories, and the last glassmorphism on /cinematic-ads.
   Four were the same bug 09-20 fixed once — a row of phrases has no width to
   live in — so they are now this component, at the measure each page uses.

   2026-11-08: the columns were Browse (6), More (11) and Contact (2). "More"
   was a catch-all, so every hub page the site built after 09-30 was filed
   there and that column grew to eleven while its two neighbours stayed at six
   and two — 349px of links beside 172px and 83px, measured at 1440px. The
   groups are now named for the part of the site each one is, so nothing has
   to absorb the leftovers: Browse is the contest lists, Index is the ways of
   slicing the directory plus the creator roster, Read is the written pages,
   Get in touch is the two forms and the two addresses. Same seventeen links,
   same labels, same URLs — only which heading each one sits under. */

export default function SiteFooter({
  container = 'max-w-5xl',
  /** The homepage does not link to itself; every other page needs the way back. */
  atHome = false,
  /** Contest pages carry the organizer straight to that listing's feature form. */
  featureContestId,
}: {
  container?: string
  atHome?: boolean
  featureContestId?: string
}) {
  const featureHref = featureContestId ? `/feature?contest=${featureContestId}` : '/feature'
  const featureLabel = featureContestId ? 'Feature this contest' : 'Feature a Contest'

  return (
    <footer className="sfoot">
      <div className={`${container} mx-auto px-5 sfoot-grid`}>
        <div className="sfoot-ident">
          <Link href="/" className="sfoot-mark">
            <LogoMark size={22} />
            <span className="sfoot-name">AI Film Contests</span>
          </Link>
          <p className="sfoot-tagline">
            {'Tracking every AI film competition · Updated daily'}
          </p>
          <p className="sfoot-credit">
            <a
              href="https://www.ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-muted"
            >
              Crafted by Ruminate X
            </a>
          </p>
        </div>

        {/* The directory itself, as the lists a visitor asks it for. */}
        <nav aria-labelledby="sfoot-browse">
          <h2 className="sfoot-head" id="sfoot-browse">Browse</h2>
          <div className="sfoot-links">
            {!atHome && <Link href="/" className="link-muted">All Contests</Link>}
            <Link href="/contests/closing-soon" className="link-muted">Closing Soon</Link>
            <Link href="/contests/free" className="link-muted">Free to Enter</Link>
            <Link href="/contests/cash-prizes" className="link-muted">Cash Prizes</Link>
            <Link href="/contests/student" className="link-muted">Student</Link>
            <Link href="/contests/new" className="link-muted">New</Link>
          </div>
        </nav>

        {/* The hub pages. Every one of these is the same directory indexed a
            different way, which is why they belong together rather than under
            whichever heading happened to have room. */}
        <nav aria-labelledby="sfoot-index">
          <h2 className="sfoot-head" id="sfoot-index">Index</h2>
          <div className="sfoot-links">
            <Link href="/categories" className="link-muted">Categories</Link>
            <Link href="/tools" className="link-muted">Tools</Link>
            <Link href="/vs" className="link-muted">Compare Tools</Link>
            <Link href="/prize" className="link-muted">By Prize</Link>
            <Link href="/location" className="link-muted">By Location</Link>
            <Link href="/creators" className="link-muted">Featured Creators</Link>
          </div>
        </nav>

        {/* The pages somebody wrote, as opposed to the ones the data builds. */}
        <nav aria-labelledby="sfoot-read">
          <h2 className="sfoot-head" id="sfoot-read">Read</h2>
          <div className="sfoot-links">
            <Link href="/guide" className="link-muted">Guides</Link>
            <Link href="/topics" className="link-muted">Topics</Link>
            <Link href="/cinematic-ads" className="link-muted">Cinematic AI Ads</Link>
          </div>
        </nav>

        {/* Two forms and two addresses — the four ways to reach the people who
            run this. /submit stays a plain <a>, as it was before. */}
        <nav aria-labelledby="sfoot-touch">
          <h2 className="sfoot-head" id="sfoot-touch">Get in touch</h2>
          <div className="sfoot-links">
            <a href="/submit" className="link-muted">Submit a Contest</a>
            <Link href={featureHref} className="link-muted">{featureLabel}</Link>
            <a href="mailto:abhixchawla@gmail.com" className="link-muted">abhixchawla@gmail.com</a>
            <a href="https://www.linkedin.com/in/abhixchawla" target="_blank" rel="noopener noreferrer" className="link-muted">Abhi on LinkedIn</a>
          </div>
        </nav>
      </div>
    </footer>
  )
}
