import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'

export const dynamic = 'force-dynamic'

interface CriterionRow {
  label: string
  a: string
  b: string
}

interface ToolRef {
  name: string
  slug: string
  color: string
}

interface RankedTool {
  rank: number
  name: string
  slug: string
  why: string
}

interface PairwiseVS {
  type: 'pairwise'
  title: string
  description: string
  keywords: string
  toolA: ToolRef
  toolB: ToolRef
  criteria: CriterionRow[]
  verdict: string
  ruminatex?: boolean
  ruminatexNote?: string
}

interface RankedVS {
  type: 'ranked'
  title: string
  description: string
  keywords: string
  tools: RankedTool[]
  body: string
  ruminatex?: boolean
  ruminatexNote?: string
}

type VSData = PairwiseVS | RankedVS

const VS_PAGES: Record<string, VSData> = {
  'runway-vs-kling': {
    type: 'pairwise',
    title: 'Runway vs Kling AI: Which is Better for Film Competitions?',
    description: 'A detailed comparison of Runway Gen-3 and Kling AI for competitive AI filmmaking — quality, consistency, style, contest compatibility, and which tool to choose.',
    keywords: 'Runway vs Kling AI, Runway Gen-3 vs Kling, best AI video tool competition 2026',
    toolA: { name: 'Runway', slug: 'runway', color: '#4f46e5' },
    toolB: { name: 'Kling AI', slug: 'kling', color: '#7c3aed' },
    criteria: [
      { label: 'Visual Quality', a: 'Cinematic realism with consistent color science. Excellent for drama and narrative work.', b: 'Physical accuracy and photorealism. Stronger for complex scenes with object interaction.' },
      { label: 'Temporal Consistency', a: 'Industry-leading. Characters and objects hold appearance well across frames.', b: 'Very strong, particularly for character animation and movement.' },
      { label: 'Competition Support', a: "Runs its own festival ($135K prize pool, Lincoln Center). Direct competition integration.", b: "Runs NextGen Creative Contest (4,600+ entries, Tokyo Int'l Film Festival screenings)." },
      { label: 'Clip Duration', a: 'Up to 16 seconds per generation. Standard for competition work.', b: 'Up to 2 minutes. Significant advantage for longer scenes.' },
      { label: 'Accessibility', a: 'Subscription-based, widely available globally.', b: 'Available globally, competitive pricing.' },
      { label: 'Best For', a: 'Narrative short films, cinematic drama, festival-circuit work.', b: 'Action sequences, physically complex scenes, longer-form work.' },
    ],
    verdict: 'For most AI film competition entry, the choice between Runway and Kling comes down to content type. Narrative drama: Runway. Physical action or longer scenes: Kling. Both tools are accepted at all major open competitions.',
  },

  'runway-vs-sora': {
    type: 'pairwise',
    title: 'Runway vs Sora: Comparing the Top AI Video Tools for Filmmakers',
    description: 'Runway Gen-3 Alpha vs OpenAI Sora compared for competitive AI filmmaking — output quality, prompt control, availability, and competition use cases.',
    keywords: 'Runway vs Sora, Runway Gen-3 vs OpenAI Sora, best AI video generation film 2026',
    toolA: { name: 'Runway', slug: 'runway', color: '#4f46e5' },
    toolB: { name: 'Sora', slug: 'sora', color: '#059669' },
    criteria: [
      { label: 'Scene Coherence', a: 'Strong short-clip coherence, best in class for under 10 seconds.', b: 'Exceptional long-form coherence. Maintains scene consistency over minutes, not seconds.' },
      { label: 'Camera Control', a: 'Motion brush and camera direction tools give granular control.', b: 'Emergent camera behavior based on description. Less direct control, higher ceiling for unexpected results.' },
      { label: 'Availability', a: 'Widely available via subscription, accessible globally.', b: 'Gradually expanding access. Still limited compared to Runway.' },
      { label: 'Competition Support', a: "Runs the world's largest AI film competition ($135K prize pool).", b: 'Accepted at virtually all open competitions.' },
      { label: 'Output Style', a: 'Cinematic realism. Consistent with Hollywood production aesthetic.', b: 'Physically accurate, sometimes hyper-real. A distinct visual character.' },
      { label: 'Best For', a: 'Filmmakers needing reliable, controllable cinematic output at scale.', b: "Filmmakers willing to experiment with longer, less predictable generations." },
    ],
    verdict: "Runway wins on control and accessibility. Sora wins on coherence duration and physical accuracy. For competition work with deadlines, Runway's reliability is a significant advantage. For experimental work where unexpected results are a feature, Sora's higher ceiling matters more.",
  },

  'runway-vs-luma': {
    type: 'pairwise',
    title: 'Runway vs Luma Dream Machine: Which is Better for Brand and Commercial AI Film?',
    description: 'Runway Gen-3 vs Luma Dream Machine compared — with specific focus on commercial, advertising, and brand filmmaking use cases.',
    keywords: 'Runway vs Luma, Runway Gen-3 vs Luma Dream Machine, AI commercial film tools 2026',
    toolA: { name: 'Runway', slug: 'runway', color: '#4f46e5' },
    toolB: { name: 'Luma AI', slug: 'luma', color: '#0891b2' },
    criteria: [
      { label: 'Visual Aesthetic', a: 'Photorealistic, cinematic. Natural lighting and color science.', b: 'Dreamy, high-quality. Slightly stylized, distinctive visual character.' },
      { label: 'Commercial Competition', a: 'Strong general competition support, primarily festival-focused.', b: 'Ran the $1M Dream Brief — the largest AI commercial competition in history. Judged by Nike, Wieden+Kennedy.' },
      { label: 'Brand Work Suitability', a: 'Excellent for brand films requiring cinematic realism and precise control.', b: 'Excellent for brand films with a more emotive, impressionistic aesthetic.' },
      { label: 'Motion Quality', a: 'Very strong, consistent motion. Good for complex camera movements.', b: 'Distinctive fluid motion. Particularly strong for product visualization.' },
      { label: 'Best For', a: 'Narrative brand stories, cinematic product films, realistic environments.', b: 'Emotive brand campaigns, lifestyle content, abstract visual concepts.' },
    ],
    verdict: "For brand and commercial AI filmmaking, Luma's Dream Brief pedigree and distinctive aesthetic make it the choice for emotive, impressionistic brand content. Runway wins for cinematic realism and precise directorial control. Many commercial AI productions use both tools for different shots within the same project.",
    ruminatex: true,
    ruminatexNote: 'For brand teams that want to leverage both tools professionally, Ruminatex creates cinematic AI advertising content using the full production stack. See their work at ruminatex.com.',
  },

  'kling-vs-sora': {
    type: 'pairwise',
    title: 'Kling AI vs Sora: Physical Accuracy and Long-form Coherence Compared',
    description: 'Kling AI vs OpenAI Sora — detailed comparison of physical accuracy, long-form coherence, style, and competition applications.',
    keywords: 'Kling vs Sora, Kling AI vs OpenAI Sora comparison 2026, best AI video tool',
    toolA: { name: 'Kling AI', slug: 'kling', color: '#7c3aed' },
    toolB: { name: 'Sora', slug: 'sora', color: '#059669' },
    criteria: [
      { label: 'Physical Accuracy', a: 'Best in class. Objects interact with realistic physics. Excellent for action, sports, and complex motion.', b: 'Exceptional physical accuracy. Particularly strong for environmental and natural phenomena.' },
      { label: 'Clip Duration', a: 'Up to 2 minutes per generation — a major practical advantage.', b: "Long-form capability. One of Sora's defining characteristics." },
      { label: 'Character Consistency', a: "Very strong. One of Kling's primary strengths for competition animation.", b: 'Strong, improving with each release.' },
      { label: 'Competition Scene', a: "Runs NextGen Creative Contest (4,600+ entries, Tokyo Int'l Film Festival).", b: 'Accepted at all open competitions. No proprietary contest yet.' },
      { label: 'Best For', a: 'Competition films requiring physical realism, longer scenes, character animation.', b: 'Experimental long-form work, environmental/natural content, physically coherent world-building.' },
    ],
    verdict: "Kling and Sora are the closest competitors in terms of physical realism. Kling's longer clip duration is a practical advantage for narrative filmmaking. Sora's broader environmental coherence makes it better for world-building. For competition work, Kling has the edge due to its own contest circuit and longer clip support.",
  },

  'best-ai-video-tools-2026': {
    type: 'ranked',
    title: 'Best AI Video Tools for Filmmakers in 2026: Complete Comparison',
    description: 'The definitive comparison of every major AI video generation tool for filmmakers and competition entrants — Runway, Kling, Sora, Luma, Pika, and Hailuo ranked and compared.',
    keywords: 'best AI video tools 2026, AI video generation tools comparison, Runway Kling Sora Luma Pika comparison',
    tools: [
      { rank: 1, name: 'Runway Gen-3', slug: 'runway', why: 'Best overall for competition work. Cinematic quality, precise control, and its own major competition circuit.' },
      { rank: 2, name: 'Kling AI', slug: 'kling', why: 'Best physical accuracy and longest clip duration. Strong competition circuit via NextGen.' },
      { rank: 3, name: 'OpenAI Sora', slug: 'sora', why: 'Best long-form coherence. Highest ceiling for experimental and world-building work.' },
      { rank: 4, name: 'Luma Dream Machine', slug: 'luma', why: 'Best for brand/commercial work. The $1M Dream Brief established its commercial credibility.' },
      { rank: 5, name: 'Pika', slug: 'pika', why: 'Fast, accessible, good for rapid iteration. Strong for social-format and short-form content.' },
      { rank: 6, name: 'Hailuo AI', slug: 'hailuo', why: 'Strong WSXA competition circuit. Good for abstract and thematic content.' },
    ],
    body: 'The AI video generation landscape in 2026 has clear leaders for competition filmmaking. Runway remains the gold standard for reliability and cinematic quality. Kling has become a genuine first-choice tool for physical-reality content. Sora is the experimental filmmaker\'s tool of choice. Luma has carved out the commercial niche. Pika and Hailuo serve specific competition circuits and use cases. Most competition-winning films use 2-3 tools in combination, playing to each tool\'s strengths.',
    ruminatex: true,
    ruminatexNote: 'For brand teams looking to deploy these tools in commercial production, Ruminatex creates cinematic AI advertising content using the full production stack. Visit ruminatex.com.',
  },
}

export async function generateStaticParams() {
  return Object.keys(VS_PAGES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = VS_PAGES[slug]
  if (!page) return { title: 'Not Found' }

  return {
    title: `${page.title} | AI Film Contests`,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://aifilmcontests.com/vs/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    alternates: { canonical: `https://aifilmcontests.com/vs/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function VSPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = VS_PAGES[slug]
  if (!page) notFound()

  const all = await getAllContests()
  const openContests = all.filter(c => c.status === 'open').slice(0, 4)

  const jsonLd = page.type === 'pairwise'
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: page.title,
        description: page.description,
        url: `https://aifilmcontests.com/vs/${slug}`,
        mainEntity: page.criteria.map(criterion => ({
          '@type': 'Question',
          name: `${criterion.label}: ${page.toolA.name} vs ${page.toolB.name}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${page.toolA.name}: ${criterion.a} — ${page.toolB.name}: ${criterion.b}`,
          },
        })),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: page.title,
        description: page.description,
        url: `https://aifilmcontests.com/vs/${slug}`,
        numberOfItems: page.tools.length,
        itemListElement: page.tools.map(t => ({
          '@type': 'ListItem',
          position: t.rank,
          name: t.name,
          url: `https://aifilmcontests.com/tools/${t.slug}`,
          description: t.why,
        })),
      }

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span className="link-muted" style={{ cursor: 'default' }}>Compare</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{page.title}</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f4f4f5',
            marginBottom: 16,
          }}>
            {page.title}
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, maxWidth: 680 }}>
            {page.description}
          </p>
        </div>

        {/* Pairwise comparison */}
        {page.type === 'pairwise' && (
          <>
            {/* Tool headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 0,
              marginBottom: 0,
              borderRadius: '14px 14px 0 0',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Criteria</span>
              </div>
              <div style={{
                background: `rgba(${parseInt(page.toolA.color.slice(1, 3), 16)},${parseInt(page.toolA.color.slice(3, 5), 16)},${parseInt(page.toolA.color.slice(5, 7), 16)},0.12)`,
                padding: '16px 20px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <Link href={`/tools/${page.toolA.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#f4f4f5', textDecoration: 'none' }}>
                  {page.toolA.name}
                </Link>
              </div>
              <div style={{
                background: `rgba(${parseInt(page.toolB.color.slice(1, 3), 16)},${parseInt(page.toolB.color.slice(3, 5), 16)},${parseInt(page.toolB.color.slice(5, 7), 16)},0.12)`,
                padding: '16px 20px',
                textAlign: 'center',
              }}>
                <Link href={`/tools/${page.toolB.slug}`} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#f4f4f5', textDecoration: 'none' }}>
                  {page.toolB.name}
                </Link>
              </div>
            </div>

            {/* Comparison rows */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: 'none',
              borderRadius: '0 0 14px 14px',
              overflow: 'hidden',
              marginBottom: 40,
            }}>
              {page.criteria.map((row, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                }}>
                  <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#71717a', fontFamily: 'Space Grotesk, sans-serif' }}>{row.label}</span>
                  </div>
                  <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{row.a}</p>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>{row.b}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              padding: '24px 28px',
              marginBottom: 48,
            }}>
              <p style={{ fontSize: 12, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Verdict</p>
              <p style={{ fontSize: 15, color: '#a1a1aa', lineHeight: 1.7 }}>{page.verdict}</p>
            </div>

            {/* Tool links */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
              <Link href={`/tools/${page.toolA.slug}`} style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#a5b4fc',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                textDecoration: 'none',
              }}>
                {page.toolA.name} Contests →
              </Link>
              <Link href={`/tools/${page.toolB.slug}`} style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#a5b4fc',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 8,
                padding: '8px 16px',
                textDecoration: 'none',
              }}>
                {page.toolB.name} Contests →
              </Link>
            </div>
          </>
        )}

        {/* Ranked list */}
        {page.type === 'ranked' && (
          <>
            <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.75, maxWidth: 720, marginBottom: 40 }}>
              {page.body}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
              {page.tools.map(tool => (
                <div key={tool.rank} style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  background: 'rgba(10,9,22,0.6)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: tool.rank === 1 ? 'rgba(165,180,252,0.15)' : 'rgba(255,255,255,0.04)',
                    border: tool.rank === 1 ? '1px solid rgba(165,180,252,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: tool.rank === 1 ? '#a5b4fc' : '#52525b',
                    }}>
                      {tool.rank}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <Link href={`/tools/${tool.slug}`} style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#f4f4f5',
                        textDecoration: 'none',
                      }}>
                        {tool.name}
                      </Link>
                    </div>
                    <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>{tool.why}</p>
                  </div>
                  <Link href={`/tools/${tool.slug}`} style={{
                    fontSize: 12,
                    color: '#52525b',
                    textDecoration: 'none',
                    flexShrink: 0,
                    marginTop: 4,
                  }}>
                    View contests →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ruminatex callout */}
        {page.ruminatex && page.ruminatexNote && (
          <div style={{
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            padding: '24px 28px',
            marginBottom: 48,
          }}>
            <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, marginBottom: 12 }}>
              {page.ruminatexNote}
            </p>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc', textDecoration: 'none' }}
            >
              Visit Ruminatex →
            </a>
          </div>
        )}

        {/* Related open contests */}
        {openContests.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Open Contests Right Now
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openContests.map(c => {
                const dl = daysLeft(c.deadline)
                const isUrgent = dl <= 7
                return (
                  <Link key={c.id} href={`/contests/${c.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="dot dot-open live" />
                          {isUrgent && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{dl}d left</span>}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, color: '#f4f4f5', marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#52525b' }}>{c.organizer}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: 14 }}>{c.prize}</div>
                        <div style={{ fontSize: 12, color: '#52525b', marginTop: 2 }}>Due {fmt(c.deadline)}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href="/" className="link-muted" style={{ fontSize: 13 }}>View all open contests →</Link>
            </div>
          </section>
        )}

        {/* Other comparisons */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#52525b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}>
            More Comparisons
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(VS_PAGES).filter(([s]) => s !== slug).map(([s, p]) => (
              <Link key={s} href={`/vs/${s}`} style={{
                fontSize: 13,
                color: '#71717a',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {p.title.split(':')[0]}
              </Link>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <Link href="/" className="link-muted" style={{ fontSize: 13 }}>← Back to all AI film contests</Link>
        </div>

      </div>
    </InnerLayout>
  )
}
