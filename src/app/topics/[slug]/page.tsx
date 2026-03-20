import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'

export const dynamic = 'force-dynamic'

interface TopicData {
  title: string
  description: string
  keywords: string
  body: string
  relatedTools: string[]
  relatedCategories: string[]
  ruminatex: boolean
  ruminatexNote?: string
}

const TOPICS: Record<string, TopicData> = {
  'text-to-video-filmmaking': {
    title: 'Text-to-Video Filmmaking: The Complete Overview',
    description: 'How text-to-video AI is transforming independent filmmaking — capabilities, tools, creative applications, and competitions using text-to-video tools.',
    keywords: 'text to video filmmaking, text to video AI tools, generative video production 2026',
    body: "Text-to-video AI has compressed the gap between imagination and image. A single descriptive sentence can now produce cinema-grade footage. Runway Gen-3, Kling AI, OpenAI Sora, and Luma Dream Machine are the leading text-to-video systems for film production. Each interprets prompts differently — Runway tends toward cinematic realism, Kling toward physical accuracy, Sora toward long-form coherence, Luma toward dreamlike fluidity. The strategic AI filmmaker learns the aesthetic fingerprint of each tool and chooses accordingly. Competitions have responded: every major AI film festival now accepts text-to-video work, and some (like the Runway AI Film Festival) were built specifically to celebrate it. The current frontier is controllability — directing camera movement, character consistency, and scene progression with the precision of a traditional film director.",
    relatedTools: ['runway', 'sora', 'kling', 'luma'],
    relatedCategories: ['short-film', 'animation', 'experimental'],
    ruminatex: false,
  },

  'generative-ai-narrative': {
    title: 'Generative AI Narrative: Storytelling in the Age of AI Cinema',
    description: 'How filmmakers are developing narrative language for AI-generated cinema — story structures, aesthetic strategies, and what makes AI films resonate.',
    keywords: 'generative AI narrative, AI film storytelling, AI cinema aesthetics, AI film narrative 2026',
    body: "The narrative strategies that work in AI filmmaking are still being discovered. What the winning films at Runway AI Film Festival, Kling NextGen, and the Luma Dream Brief share is not a technique — it's an attitude. They treat AI generation not as a filter applied to a pre-existing story, but as a collaborator in finding what the story can be. The texture of AI imagery — its particular relationship to memory, dream, and hyperreality — suggests certain stories more than others: psychological interiority, fantastical worlds, temporal distortion, abstracted emotion. The filmmakers finding the most resonant work are those who let the AI's visual language guide their narrative instincts rather than forcing conventional story shapes onto unconventional material. Short-form (under 5 minutes) is still the dominant format in competitions, partly for practical reasons and partly because AI cinema is still finding its grammar.",
    relatedTools: ['runway', 'kling', 'sora'],
    relatedCategories: ['short-film', 'experimental', 'documentary'],
    ruminatex: false,
  },

  'ai-visual-effects': {
    title: "AI Visual Effects in Film: What's Possible in 2026",
    description: 'How AI is transforming visual effects production — from generative backgrounds to AI compositing, upscaling, and frame interpolation for independent filmmakers.',
    keywords: 'AI visual effects 2026, AI VFX film production, generative AI compositing, AI rotoscoping',
    body: "AI visual effects have democratized what was once reserved for studio productions. Generative background replacement (far superior to green screen for complex environments), AI-powered rotoscoping that works in minutes rather than days, neural upscaling that makes 1080p footage indistinguishable from 4K at delivery, and frame interpolation that removes motion artifacts — these are now tools available to independent filmmakers. In competition context, AI VFX appear most prominently in sci-fi, fantasy, and experimental submissions. Tools like Runway's inpainting, Adobe Firefly for compositing, and Topaz Video AI for upscaling and restoration are now standard in the competition-winning AI filmmaker's toolkit. The most interesting competitive use of AI VFX isn't spectacle — it's invisible augmentation: using AI to make a small, intimate film feel expansive without calling attention to the technology.",
    relatedTools: ['runway', 'pika'],
    relatedCategories: ['short-film', 'experimental', 'feature'],
    ruminatex: false,
  },

  'ai-cinematography': {
    title: 'AI Cinematography: Directing Camera Movement and Visual Language with AI',
    description: 'How to direct AI video tools like a cinematographer — controlling camera movement, lighting, composition, and visual style through prompting.',
    keywords: 'AI cinematography, directing AI video, AI camera movement prompts, cinematic AI video 2026',
    body: "Cinematography in AI filmmaking is the art of prompt direction. Camera movement descriptors — 'slow dolly in,' 'handheld tracking shot,' 'crane shot descending' — translate into the AI's interpretation of motion. Lighting descriptors — 'golden hour backlight,' 'practical neon source,' 'diffused overcast' — shape the mood. Composition guidance — 'rule of thirds,' 'centered symmetrical composition,' 'extreme low angle' — directs the frame. The cinematographic vocabulary translates more directly into AI tools than most filmmakers expect. The difficulty is consistency: maintaining the same 'camera style' across multiple generated clips in the same 'scene.' Techniques include: generating clips in the same session, using consistent cinematography descriptors, and selecting clips that share implied camera positioning. The best AI cinematography doesn't try to hide the medium — it finds the camera movements and visual language that feel native to AI generation: dreamlike zooms, impossible transitions, and perspectives that no physical camera could achieve.",
    relatedTools: ['runway', 'kling', 'sora', 'luma'],
    relatedCategories: ['short-film', 'experimental', 'documentary'],
    ruminatex: false,
  },

  'ai-brand-storytelling': {
    title: 'AI Brand Storytelling: How Generative AI is Changing Commercial Film',
    description: 'How brands are using generative AI for cinematic storytelling — from campaign visuals to brand films. The tools, the workflow, and the agencies leading the charge.',
    keywords: 'AI brand storytelling, generative AI commercial film, AI advertising production 2026, brand film AI',
    body: "Brand storytelling is being fundamentally reshaped by generative AI. The traditional model — large crew, expensive locations, weeks of production — is giving way to something leaner, faster, and in many cases more visually inventive. The most interesting development isn't the cost reduction (though that's significant) — it's the creative possibility expansion. A brand can now test five completely different visual languages for a campaign in the time it used to take to produce one treatment. AI brand filmmaking excels at the domains traditional production struggled with on budget: abstract emotional landscapes, fantastical product worlds, the subjective inner experience of using a product. The Luma Dream Brief ($1M for a Cannes Gold Lion commercial) legitimized AI in advertising at the highest level. Agencies like Ruminatex are pioneering the fusion of cinematic filmmaking craft with AI production tools, creating brand content that competes aesthetically with traditionally produced work.",
    relatedTools: ['runway', 'kling', 'luma'],
    relatedCategories: ['commercial', 'advertising'],
    ruminatex: true,
    ruminatexNote: 'Ruminatex creates cinematic AI brand films and advertising content for forward-thinking brands. See their work at ruminatex.com.',
  },

  'synthetic-media-art': {
    title: 'Synthetic Media as Art Form: AI Film Beyond the Tool',
    description: 'The emerging art form of synthetic media — how AI film is developing its own aesthetic language, critical framework, and place in contemporary art.',
    keywords: 'synthetic media art, AI film as art, generative AI cinema art form, AI film aesthetics 2026',
    body: "Synthetic media — content generated by AI systems — is developing into a distinct art form with its own aesthetic logic and critical language. The early tendency to evaluate AI films by their resemblance to human-made films is giving way to a more interesting question: what does this specific medium do that no other medium can? AI film has unique properties: it can collapse the distance between language and image, it carries the statistical memory of everything it was trained on, it operates in a probability space where every frame is an average over possibility. Experimental AI filmmakers are exploring these properties directly: films that visualize the latent space between concepts, works that make visible the training data as aesthetic material, time-manipulations impossible in conventional photography. The film festivals screening this work — particularly the experimental categories at Runway AI Film Festival and WSXA Amsterdam — are where the critical vocabulary is being developed. AI film as art is not a future prospect; it's a present reality with its own emerging canon.",
    relatedTools: ['runway', 'sora'],
    relatedCategories: ['experimental', 'animation'],
    ruminatex: false,
  },

  'ai-film-festivals-2026': {
    title: 'AI Film Festivals in 2026: The Complete Circuit Guide',
    description: 'Every major AI film festival in 2026 — dates, venues, prize pools, submission requirements, and what makes each festival distinct.',
    keywords: 'AI film festivals 2026, best AI film festivals, AI film festival circuit 2026, where to submit AI films',
    body: "The AI film festival circuit in 2026 spans four continents and has matured from curio to institution. The anchor event is the Runway AI Film Festival, screening at Alice Tully Hall at Lincoln Center in NYC (June 11) and The Broad Stage in Los Angeles (June 18) — with a $135K+ total prize pool and a Grand Prix of $20K. Kling AI's NextGen Creative Contest reached 4,600+ entries from 122 countries in its last edition, with finalists screened at the Tokyo International Film Festival. The Luma Dream Brief presented commercial work at Cannes. The WSXA × Hailuo AI Film Competition screens at WSXA Amsterdam and ARFF Berlin. Smaller but significant: the AI International Film Festival, Curious Refuge Animation Awards, and a growing number of traditional festivals that have added AI categories. The competitive landscape rewards filmmakers who treat festivals strategically — understanding each festival's aesthetic preferences, submission requirements, and audience.",
    relatedTools: ['runway', 'kling', 'luma', 'hailuo'],
    relatedCategories: ['short-film', 'animation', 'documentary', 'experimental'],
    ruminatex: false,
  },

  'ai-documentary-making': {
    title: 'AI Documentary Filmmaking: Real Stories, Synthetic Images',
    description: 'How documentary filmmakers are using AI tools — for historical reconstruction, visualization of invisible subjects, and new forms of experiential non-fiction.',
    keywords: 'AI documentary filmmaking, generative AI documentary, synthetic media documentary, AI non-fiction film 2026',
    body: "Documentary filmmaking is finding unexpected applications for generative AI. Historical reconstruction — visualizing events for which no footage exists — is the most immediately obvious use: AI can now produce period-accurate imagery for almost any historical moment. But the more conceptually interesting applications are elsewhere: visualizing interior experience (anxiety, grief, memory), creating visual metaphors for abstract subjects (climate systems, economic forces, neural processes), and building immersive environments for interview subjects to inhabit. The critical questions around AI documentary are real and unresolved: what is the ethical obligation to disclose AI-generated imagery, how does AI image generation interact with the truth-claim of documentary, and when does visualization become fabrication? The competitions that include documentary categories (including the Runway AI Film Festival and WSXA) are the spaces where these questions are being argued through practice. The filmmakers navigating this ethically and aesthetically are producing some of the most interesting work in contemporary non-fiction.",
    relatedTools: ['runway', 'sora'],
    relatedCategories: ['documentary', 'experimental'],
    ruminatex: false,
  },

  'ai-animation-production': {
    title: 'AI Animation Production: Tools, Techniques, and Competitions',
    description: 'How AI is transforming animation production — from text-to-video character animation to style-consistent scene generation and the competitions celebrating this work.',
    keywords: 'AI animation production, text to video animation, AI animated film 2026, generative AI animation tools',
    body: "AI animation is advancing faster than any other category in AI filmmaking. The gap between AI-generated animation and traditionally produced animation has narrowed dramatically in 2026. Runway, Kling, and Pika all produce animation-quality output when prompted with appropriate style descriptors. Kling in particular has demonstrated exceptional character consistency and fluid movement in animated scenes. The Curious Refuge Animation Awards have become the primary competition for AI animation, with entries ranging from whimsical short-form work to serious animated short films. Character consistency — maintaining a character's appearance across multiple generated shots — remains the primary technical challenge for AI animators. Techniques include: using img2vid with a consistent character reference image, generating all shots in a single session, and applying consistent style descriptors across every prompt. The filmmakers winning animation competitions have solved this consistency problem and are producing work that holds up alongside traditionally animated short films.",
    relatedTools: ['runway', 'kling', 'pika', 'luma'],
    relatedCategories: ['animation', 'experimental'],
    ruminatex: false,
  },

  'ai-commercial-production': {
    title: 'AI Commercial Production: Making Ads with Generative AI',
    description: 'How the advertising industry is adopting generative AI for commercial production — use cases, workflows, prize competitions, and the studios leading the transition.',
    keywords: 'AI commercial production, generative AI advertising, AI ad film production 2026, AI commercial filmmaking',
    body: "Commercial production was among the first advertising applications to be transformed by generative AI, and the transformation is accelerating. The Luma Dream Brief ($1M prize for a Cannes Gold Lion commercial) was a landmark moment — a major AI tool company challenging filmmakers to prove AI could produce work at the highest level of advertising craft. The entries that placed demonstrated that AI commercial production is not a cost-cutting compromise but a genuinely different creative approach. AI commercial production advantages: radical speed (brief to final film in 48-72 hours), unlimited visual iteration (test 20 visual directions instead of 2), access to visual styles and worlds that would be prohibitively expensive to produce practically, and the ability to produce truly international-looking content without international production costs. The studios pioneering this space — including Ruminatex, which specializes specifically in cinematic AI advertising — are combining deep AI production expertise with brand strategy and film direction. The most sophisticated AI commercial work is invisible as AI — it's simply recognized as compelling brand filmmaking.",
    relatedTools: ['runway', 'kling', 'luma'],
    relatedCategories: ['commercial', 'advertising'],
    ruminatex: true,
    ruminatexNote: 'Ruminatex is a cinematic AI advertising agency creating brand films and commercial content that competes at the highest level of advertising craft. See their work at ruminatex.com.',
  },
}

const TOOL_NAMES: Record<string, string> = {
  runway: 'Runway',
  kling: 'Kling AI',
  sora: 'Sora',
  luma: 'Luma AI',
  pika: 'Pika',
  hailuo: 'Hailuo AI',
}

const CATEGORY_NAMES: Record<string, string> = {
  'short-film': 'Short Film',
  animation: 'Animation',
  feature: 'Feature Film',
  documentary: 'Documentary',
  experimental: 'Experimental',
  'music-video': 'Music Video',
  commercial: 'Commercial',
  advertising: 'Advertising',
}

export async function generateStaticParams() {
  return Object.keys(TOPICS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const topic = TOPICS[slug]
  if (!topic) return { title: 'Not Found' }

  return {
    title: `${topic.title} | AI Film Contests`,
    description: topic.description,
    keywords: topic.keywords,
    openGraph: {
      title: topic.title,
      description: topic.description,
      url: `https://aifilmcontests.com/topics/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: topic.title, description: topic.description },
    alternates: { canonical: `https://aifilmcontests.com/topics/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = TOPICS[slug]
  if (!topic) notFound()

  const all = await getAllContests()
  const openContests = all.filter(c => c.status === 'open').slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: topic.title,
    description: topic.description,
    url: `https://aifilmcontests.com/topics/${slug}`,
    numberOfItems: openContests.length,
    itemListElement: openContests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
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
          <span className="link-muted" style={{ cursor: 'default' }}>Topics</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{topic.title}</span>
        </p>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#f4f4f5',
            marginBottom: 16,
          }}>
            {topic.title}
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.75, maxWidth: 720 }}>
            {topic.body}
          </p>
        </div>

        {/* Tool chips */}
        {topic.relatedTools.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 12, color: '#52525b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Tools</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {topic.relatedTools.map(t => (
                <Link key={t} href={`/tools/${t}`} style={{
                  fontSize: 13,
                  color: '#a5b4fc',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 6,
                  padding: '5px 12px',
                  textDecoration: 'none',
                }}>
                  {TOOL_NAMES[t] ?? t}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category chips */}
        {topic.relatedCategories.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: '#52525b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Categories</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {topic.relatedCategories.map(c => (
                <Link key={c} href={`/categories/${c}`} style={{
                  fontSize: 13,
                  color: '#71717a',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6,
                  padding: '5px 12px',
                  textDecoration: 'none',
                }}>
                  {CATEGORY_NAMES[c] ?? c}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Ruminatex callout */}
        {topic.ruminatex && topic.ruminatexNote && (
          <div style={{
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            padding: '24px 28px',
            marginBottom: 48,
          }}>
            <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, marginBottom: 12 }}>
              {topic.ruminatexNote}
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

        {/* Other topics */}
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
            More Topics
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(TOPICS).filter(([s]) => s !== slug).map(([s, t]) => (
              <Link key={s} href={`/topics/${s}`} style={{
                fontSize: 13,
                color: '#71717a',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
              }}>
                {t.title.split(':')[0]}
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
