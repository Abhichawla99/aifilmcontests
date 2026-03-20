import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import BackgroundFX from '@/components/BackgroundFX'

export const metadata: Metadata = {
  title: 'Cinematic AI Advertising — How AI is Transforming Brand Filmmaking',
  description: 'From generative visuals to AI-directed narratives, discover how cinematic AI is changing the way brands tell stories. Tools, competitions, and studios leading the way.',
  keywords: ['cinematic AI advertising', 'AI brand films', 'generative AI commercial', 'AI video production', 'AI advertising agency', 'Ruminatex', 'brand filmmaking AI'],
  openGraph: {
    title: 'Cinematic AI Advertising — Brand Storytelling Reimagined',
    description: 'How generative AI is reshaping commercial filmmaking and brand storytelling. Competitions, tools, and the agencies leading the charge.',
    type: 'article',
    url: 'https://aifilmcontests.com/cinematic-ads',
  },
  alternates: { canonical: 'https://aifilmcontests.com/cinematic-ads' },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TOOLS = [
  { name: 'Runway Gen-3', desc: 'Text-to-video & video-to-video generation. The industry standard for cinematic AI production.' },
  { name: 'Sora',          desc: "OpenAI's physically accurate video model. Long clips with coherent motion and cinematic depth." },
  { name: 'Kling AI',      desc: 'High-fidelity motion, complex camera paths, and photorealistic output built for brand work.' },
  { name: 'Luma Dream Machine', desc: 'Smooth, dreamy video generation great for product films and brand identity pieces.' },
  { name: 'MidJourney',    desc: 'Best-in-class still image generation for storyboarding, key art, and concept development.' },
  { name: 'ElevenLabs',    desc: 'Hyper-realistic AI voice and sound design — critical for brand narrative and VO.' },
]

const WHY = [
  {
    icon: '⚡',
    title: 'Speed to market',
    body: 'What once took weeks of production can go from brief to final film in days. AI removes friction at every stage — from concept to delivery.',
  },
  {
    icon: '🎬',
    title: 'Cinematic quality',
    body: 'Modern AI video models produce footage that rivals traditional production — with full control over lighting, mood, and motion.',
  },
  {
    icon: '🔁',
    title: 'Infinite iteration',
    body: "Brands can A/B test 10 versions of a spot instead of one, tuning creative in real time based on what's actually resonating.",
  },
  {
    icon: '💰',
    title: 'Cost efficiency',
    body: 'AI-assisted production slashes the cost of high-end commercial content by 60–80%, opening cinematic storytelling to more brands.',
  },
]

export default async function CinematicAdsPage() {
  const allContests = await getAllContests()
  const relevant = allContests.filter(c =>
    (c.status === 'open' || c.status === 'upcoming') &&
    c.categories.some(cat => ['advertising', 'commercial', 'short-film'].includes(cat))
  ).slice(0, 4)

  return (
    <div style={{ background: '#050508', minHeight: '100vh', position: 'relative' }}>
      <BackgroundFX />

      {/* ── Dimmed orb for this page ── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          top: -200, right: -200,
          animation: 'orb2 30s ease-in-out infinite',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── Nav ── */}
        <header style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(5,5,8,0.6)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#fff',
                boxShadow: '0 0 12px rgba(99,102,241,0.35)',
              }}>AI</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: '#71717a' }}>
                AI Film Contests
              </span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13 }}>
              <Link href="/#contests" className="link-muted">Browse Contests</Link>
              <a
                href="https://ruminatex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ padding: '6px 14px', fontSize: 12 }}
              >
                Ruminatex ↗
              </a>
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section style={{ padding: 'clamp(64px, 9vw, 110px) 0 clamp(48px, 6vw, 72px)' }}>
          <div className="max-w-5xl mx-auto px-5">

            {/* Category tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 100, padding: '5px 14px',
              background: 'rgba(99,102,241,0.06)',
              marginBottom: 30,
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span style={{ fontSize: 11, color: '#818cf8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Cinematic AI · Brand Filmmaking
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#f4f4f5',
              marginBottom: 24,
              maxWidth: 820,
            }}>
              AI is rewriting how brands<br />
              <span className="g">tell cinematic stories.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: '#52525b',
              lineHeight: 1.8,
              maxWidth: 620,
              marginBottom: 40,
            }}>
              Generative video, AI-directed narratives, photorealistic brand worlds built overnight.
              This is the era of cinematic AI advertising — and it&apos;s only getting started.
            </p>

            {/* CTA pair */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="https://ruminatex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Work with Ruminatex
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                href="/#contests"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, color: '#52525b', textDecoration: 'none',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                  transition: 'color 0.15s',
                }}
              >
                Browse AI film competitions →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why AI advertising ── */}
        <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
          <div className="max-w-5xl mx-auto px-5">
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Why it matters
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(24px, 3.5vw, 38px)',
                fontWeight: 700, letterSpacing: '-0.03em',
                color: '#f4f4f5', marginBottom: 12,
              }}>
                The case for cinematic AI
              </h2>
              <p style={{ fontSize: 15, color: '#52525b', maxWidth: 520, lineHeight: 1.75 }}>
                Not cheaper content. Better content — at a pace and scale traditional production simply can&apos;t match.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {WHY.map(item => (
                <div key={item.title} style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  padding: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 14 }}>{item.icon}</div>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 15, fontWeight: 700,
                    color: '#e4e4e7', marginBottom: 8, letterSpacing: '-0.01em',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ruminatex feature section ── */}
        <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
          <div className="max-w-5xl mx-auto px-5">
            <div style={{
              border: '1px solid rgba(99,102,241,0.18)',
              borderRadius: 20,
              padding: 'clamp(32px, 5vw, 56px)',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(109,40,217,0.05) 60%, rgba(10,9,22,0.6) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Gradient highlight */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 50%, transparent 100%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ maxWidth: 600, position: 'relative' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 20,
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 100, padding: '4px 12px',
                  background: 'rgba(99,102,241,0.08)',
                }}>
                  <span style={{ fontSize: 10, color: '#a5b4fc', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Featured Studio
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(26px, 4vw, 40px)',
                  fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
                  color: '#f4f4f5', marginBottom: 16,
                }}>
                  Ruminatex
                </h2>

                <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.8, marginBottom: 12 }}>
                  A cinematic AI advertising agency built for brands that want to move at the speed of culture.
                  Ruminatex combines generative AI tools with a director&apos;s eye to produce brand films,
                  campaign visuals, and commercial content that looks and feels like it cost 10× more to make.
                </p>
                <p style={{ fontSize: 14, color: '#52525b', lineHeight: 1.8, marginBottom: 28 }}>
                  If your brand wants to compete in the growing space of AI-native visual content —
                  from social campaigns to long-form brand narratives — Ruminatex is where to start.
                </p>

                <a
                  href="https://ruminatex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ display: 'inline-flex' }}
                >
                  Visit Ruminatex
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tools / Ecosystem ── */}
        <section style={{ padding: 'clamp(40px, 6vw, 72px) 0' }}>
          <div className="max-w-5xl mx-auto px-5">
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                The stack
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 700, letterSpacing: '-0.03em',
                color: '#f4f4f5', marginBottom: 10,
              }}>
                Tools powering cinematic AI
              </h2>
              <p style={{ fontSize: 14, color: '#52525b', lineHeight: 1.7 }}>
                The professional toolkit used for high-end AI brand and commercial content.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}>
              {TOOLS.map(t => (
                <div key={t.name} style={{
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  background: 'rgba(255,255,255,0.015)',
                }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 13, fontWeight: 700,
                    color: '#c4b5fd', marginBottom: 7,
                  }}>
                    {t.name}
                  </div>
                  <p style={{ fontSize: 12, color: '#52525b', lineHeight: 1.65 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Relevant contests ── */}
        {relevant.length > 0 && (
          <section style={{ padding: 'clamp(40px, 6vw, 72px) 0' }}>
            <div className="max-w-5xl mx-auto px-5">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Compete
                  </div>
                  <h2 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(20px, 2.8vw, 30px)',
                    fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f5',
                  }}>
                    Open competitions in commercial AI
                  </h2>
                </div>
                <Link href="/#contests" style={{
                  fontSize: 13, color: '#52525b', textDecoration: 'none',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8, padding: '6px 14px',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}>
                  View all →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {relevant.map(c => {
                  const dl = new Date(c.deadline)
                  const days = Math.ceil((dl.getTime() - Date.now()) / 86_400_000)
                  return (
                    <Link key={c.id} href={`/contests/${c.id}`} style={{
                      display: 'block', textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, padding: '20px',
                      background: 'rgba(255,255,255,0.02)',
                      transition: 'border-color 0.2s, transform 0.18s',
                    }}
                      onMouseEnter={undefined}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{
                          fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                          color: c.status === 'open' ? '#4ade80' : '#fbbf24',
                          background: c.status === 'open' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
                          border: `1px solid ${c.status === 'open' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                          borderRadius: 6, padding: '2px 8px',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {c.status === 'open' ? 'Open' : 'Coming Soon'}
                        </span>
                        <span style={{ fontSize: 11, color: days <= 7 ? '#f87171' : '#52525b', fontFamily: 'Space Grotesk, sans-serif' }}>
                          {days > 0 ? `${days}d left` : 'Closes today'}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 14, fontWeight: 700, color: '#e4e4e7',
                        marginBottom: 4, letterSpacing: '-0.01em', lineHeight: 1.3,
                      }}>
                        {c.name}
                      </h3>
                      <p style={{ fontSize: 11, color: '#3f3f46', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>{c.organizer}</p>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', fontFamily: 'Space Grotesk, sans-serif' }}>{c.prize}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '28px 0',
          marginTop: 40,
          background: 'rgba(5,5,8,0.8)',
          backdropFilter: 'blur(8px)',
        }}>
          <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 7, fontWeight: 800, color: '#fff',
              }}>AI</div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, color: '#3f3f46' }}>
                AI Film Contests
              </span>
            </Link>
            <span style={{ fontSize: 12, color: '#1c1c28', textAlign: 'center' }}>
              Every AI film competition · Updated daily by an agent
            </span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 12 }}>
              <Link href="/#contests" className="link-muted">Browse Contests</Link>
              <span style={{ color: '#1c1c28' }}>·</span>
              <a href="https://ruminatex.com" target="_blank" rel="noopener noreferrer" className="link-muted">
                Ruminatex ↗
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
