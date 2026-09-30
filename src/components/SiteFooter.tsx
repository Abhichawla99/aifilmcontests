import Link from 'next/link'
import LogoMark from './LogoMark'

/* The one footer. Until 2026-09-30 the site drew five of them: the homepage's
   column grid (rebuilt 09-20), InnerLayout's eight-link wrapping row, the
   contest page's four links with middot separators, a two-word stub on
   /tools and /categories, and the last glassmorphism on /cinematic-ads.
   Four were the same bug 09-20 fixed once — a row of phrases has no width to
   live in — so they are now this component, at the measure each page uses. */

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
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-muted"
            >
              Crafted by Ruminatex
            </a>
          </p>
        </div>

        <nav aria-labelledby="sfoot-browse">
          <h2 className="sfoot-head" id="sfoot-browse">Browse</h2>
          <div className="sfoot-links">
            {!atHome && <Link href="/" className="link-muted">All Contests</Link>}
            <Link href="/contests/closing-soon" className="link-muted">Closing Soon</Link>
            <Link href="/contests/free" className="link-muted">Free to Enter</Link>
            <Link href="/contests/cash-prizes" className="link-muted">Cash Prizes</Link>
          </div>
        </nav>

        <nav aria-labelledby="sfoot-more">
          <h2 className="sfoot-head" id="sfoot-more">More</h2>
          <div className="sfoot-links">
            <a href="/submit" className="link-muted">Submit a Contest</a>
            <Link href={featureHref} className="link-muted">{featureLabel}</Link>
            <Link href="/creators" className="link-muted">Featured Creators</Link>
            <Link href="/cinematic-ads" className="link-muted">Cinematic AI Ads</Link>
          </div>
        </nav>

        <nav aria-labelledby="sfoot-contact">
          <h2 className="sfoot-head" id="sfoot-contact">Contact</h2>
          <div className="sfoot-links">
            <a href="mailto:abhixchawla@gmail.com" className="link-muted">abhixchawla@gmail.com</a>
            <a href="https://www.linkedin.com/in/abhixchawla" target="_blank" rel="noopener noreferrer" className="link-muted">Abhi on LinkedIn</a>
          </div>
        </nav>
      </div>
    </footer>
  )
}
