import Link from 'next/link'
import { COMMUNITY, GUIDE, OFFER_ENDS_LABEL, OVERS, OVERS_OFF_PERCENT, PACK_PATH } from '@/lib/creator-pack'

/* The homepage's pitch for the free creator pack: the three pieces side by
   side, with the claim going to the subscribe card in the hero (signing up is
   claiming it) and the full page one link away. */

const label: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F46E5', marginBottom: 10,
}
const title: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif', fontSize: 19, fontWeight: 700,
  letterSpacing: '-0.02em', color: '#1B1916', margin: '0 0 8px',
}
const body: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: '#4A463E', margin: '0 0 12px' }
const more: React.CSSProperties = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#4338CA', textDecoration: 'none' }

export default function CreatorPackSection() {
  return (
    <section className="home-pack" aria-labelledby="home-pack-title">
      <div className="max-w-6xl mx-auto px-5">
        <div className="home-pack-head">
          <div style={{ maxWidth: 620 }}>
            <div style={label}>Free creator pack</div>
            <h2 id="home-pack-title" style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
              lineHeight: 1.05, letterSpacing: '-0.035em', color: '#1B1916', margin: '0 0 12px',
            }}>
              Found a contest? Here&apos;s how to make the entry.
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#6F6A61', margin: 0 }}>
              Sign up for alerts and the pack comes with it: the tool, the guide and the people to ask.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="#subscribe" className="btn" style={{ padding: '11px 20px', fontSize: 14 }}>Claim the free pack</a>
            <Link href={PACK_PATH} style={{ ...more, alignSelf: 'center', padding: '0 4px' }}>What&apos;s inside →</Link>
          </div>
        </div>

        <div className="pack-grid" style={{ marginBottom: 0 }}>
          <div className="pack-item pack-item-lead">
            <div style={label}>{OVERS_OFF_PERCENT}% off</div>
            <h3 style={title}>Overs Pro for ${OVERS.monthlyUsd} a month</h3>
            <p style={body}>
              Type a shot and get the stills. Pick one and it becomes a clip that opens on that frame.
              ${OVERS.monthlyUsd} a month for {OVERS.months} months instead of ${OVERS.fullUsd}, on your own OpenRouter key.
              Ends {OFFER_ENDS_LABEL}.
            </p>
            <a href="#subscribe" style={more}>Claim it with your email →</a>
          </div>
          <div className="pack-item">
            <div style={label}>Guide</div>
            <h3 style={title}>{GUIDE.title}</h3>
            <p style={body}>
              Rules first, then a shot list, a look that holds, stills, clips, sound and the checks
              that get entries thrown out.
            </p>
            <Link href={GUIDE.path} style={more}>Read the guide →</Link>
          </div>
          <div className="pack-item">
            <div style={label}>Community</div>
            <h3 style={title}>{COMMUNITY.name}</h3>
            <p style={body}>
              A free community on Skool for people learning AI creative workflows. Ask, share, and see how
              others build their shots.
            </p>
            <a href={COMMUNITY.url} target="_blank" rel="noopener" style={more}>Join free →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
