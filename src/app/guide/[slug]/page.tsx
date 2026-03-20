import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getAllContests } from '@/lib/contests-db'
import InnerLayout from '@/components/InnerLayout'

export const dynamic = 'force-dynamic'

interface Section {
  h: string
  body: string
}

interface GuideData {
  title: string
  description: string
  keywords: string
  intro: string
  sections: Section[]
  ruminatex: boolean
  ruminatexNote?: string
}

const GUIDES: Record<string, GuideData> = {
  'how-to-enter-ai-film-contest': {
    title: 'How to Enter an AI Film Contest in 2026',
    description: 'A step-by-step guide to entering AI film competitions — from choosing the right contest to submitting your work.',
    keywords: 'how to enter AI film contest, AI film competition guide, submit AI film festival 2026',
    intro: 'AI film contests have exploded in 2026, with prize pools ranging from a few thousand dollars to over a million. But each contest has different rules, technical requirements, and judging criteria. Understanding the landscape before you start production can mean the difference between a disqualified entry and a festival screening.',
    sections: [
      { h: 'Step 1: Choose the Right Contest', body: 'Not all AI film contests are equal. Some require specific tools (like Runway or Kling), others accept any AI software. Match the contest to your strengths — if you excel at short narrative films, target short film categories. If you work in advertising or branded content, the Luma Dream Brief ($1M prize) or the Kling NextGen Contest are designed for you. Check the entry fee, eligibility requirements, and whether the contest allows international submissions.' },
      { h: 'Step 2: Read the Rules Carefully', body: 'Every contest has disqualifying technicalities. Common ones: minimum/maximum runtime, file format requirements (typically H.264 .mp4 or .mov), resolution standards (usually 1080p or 4K), and the percentage of AI-generated content required. Some contests require 100% AI generation; others just require AI to play a "significant role." Misunderstanding this is the most common reason submissions get rejected.' },
      { h: 'Step 3: Concept and Pre-production', body: 'The films that win AI competitions are almost always concept-first. Judges at Lincoln Center, Cannes, and the Tokyo International Film Festival have seen thousands of technically impressive AI films. What stands out is a strong idea with emotional resonance. Spend more time on your concept and script than on production — a simple idea executed perfectly beats a visually spectacular film with nothing to say.' },
      { h: 'Step 4: Production Workflow', body: 'A typical winning workflow: (1) Generate a storyboard with MidJourney or similar, (2) Generate video clips with Runway Gen-3 or Kling, (3) Edit in Premiere or DaVinci Resolve, (4) Add AI-generated voiceover or music with ElevenLabs/Suno. Time your production to leave at least 48 hours for render, review, and export before the deadline.' },
      { h: 'Step 5: Submission and After', body: "Submit through the official platform (most use FilmFreeway, Wufoo forms, or proprietary portals). Save your confirmation email. Some contests require a making-of or director statement — prepare this in advance. If you don't win, study the winning films. The best AI filmmakers iterate across multiple contests, improving with each submission." },
    ],
    ruminatex: true,
    ruminatexNote: 'For brands looking to commission cinematic AI content rather than compete themselves, Ruminatex specializes in AI-native commercial production.',
  },

  'ai-filmmaking-tools-guide': {
    title: 'The Complete Guide to AI Filmmaking Tools in 2026',
    description: 'Every major AI video generation tool compared — Runway, Kling, Sora, Luma, Pika, Hailuo and more. Which tool is right for which type of film?',
    keywords: 'AI filmmaking tools 2026, best AI video generation software, Runway vs Kling vs Sora comparison',
    intro: 'The AI filmmaking tool landscape in 2026 is both exciting and overwhelming. A dozen capable text-to-video and video generation systems exist, each with different strengths. This guide breaks down what each major tool does best — and which contest categories they are suited for.',
    sections: [
      { h: 'Runway Gen-3 Alpha', body: "Still the industry standard for AI filmmaking competitions. Runway's Gen-3 Alpha produces cinematic-quality footage with exceptional temporal consistency — meaning objects and characters hold their appearance across frames. It's the tool of choice for the Runway AI Film Festival, the world's largest AI film competition with a $135K prize pool screened at Lincoln Center. Runway also offers inpainting, interpolation, and a growing motion brush toolset." },
      { h: 'Kling AI', body: "Kling AI by Kuaishou has rapidly become a top-tier competitor. Its primary advantage is physical accuracy — objects move and interact with realistic physics. The Kling NextGen Creative Contest attracted 4,600+ entries from 122 countries and had a jury of Oscar-winning filmmakers. For complex scene compositions, many filmmakers now prefer Kling's results over Runway." },
      { h: 'OpenAI Sora', body: "Sora produces long-duration, physically coherent video with extraordinary scene consistency. It's particularly strong for establishing shots, natural environments, and cinematic camera movements. Access is still somewhat limited compared to Runway and Kling, but expect that to change rapidly through 2026. Most 'any AI tools' contests accept Sora." },
      { h: 'Luma Dream Machine', body: "Luma's primary strength is smooth, high-quality motion with a somewhat dreamy aesthetic quality. The Luma Dream Brief ($1M prize for a Cannes Gold Lion commercial) was judged by Nike and Wieden+Kennedy — cementing Luma's brand-film credibility. Good choice for advertising and brand content." },
      { h: 'Supporting Tools: MidJourney, ElevenLabs, Suno', body: "MidJourney remains the best tool for storyboards and concept art. ElevenLabs produces near-undetectable AI voiceovers. Suno generates original music at a level where festival audiences can't distinguish it from composed scores. A complete AI film production stack typically combines 3-4 tools." },
    ],
    ruminatex: true,
    ruminatexNote: 'Ruminatex uses the full AI production stack to create cinematic brand films and advertising content for major brands.',
  },

  'winning-strategies-ai-film-competitions': {
    title: 'How to Win AI Film Competitions: Strategies From Finalists',
    description: 'What separates winning AI films from the rest? Strategies, common mistakes, and what judges at Lincoln Center and Cannes are actually looking for.',
    keywords: 'how to win AI film competition, AI film contest tips, AI film festival judging criteria 2026',
    intro: "With thousands of entries across dozens of competitions, what makes a submission rise to the top? We've analyzed patterns from winners at the Runway AI Film Festival, Kling NextGen, and the Luma Dream Brief to identify what the judges are actually rewarding.",
    sections: [
      { h: 'Concept Is King', body: "Every judge panel — from Lincoln Center to Cannes to the Tokyo International Film Festival — says the same thing: technical quality is table stakes now. What they remember are films with a clear idea, genuine emotion, and a reason to exist. The $20K Runway Grand Prix winners are rarely the most technically impressive submissions; they're the ones with the most compelling point of view." },
      { h: 'Study the Judging Criteria', body: "Runway judges on narrative, visual quality, and originality. Kling judges on creativity, technical execution, and social impact. The Luma Dream Brief judges on commercial effectiveness — would this actually move product? Tailor your film to the specific judging criteria, not just general quality." },
      { h: 'The 30-Second Rule', body: "Judges see hundreds of submissions. If your film doesn't establish its world and hook the viewer within 30 seconds, it's at a disadvantage. Don't build slowly — open with your strongest image or most compelling moment. The first 10 seconds of a short AI film are more important than any other 10 seconds." },
      { h: 'Technical Precision Checklist', body: "Winning films consistently hit: (1) No temporal flickering or inconsistent object appearance, (2) Smooth transitions between AI-generated shots, (3) Professional audio mix — this is where amateurs lose, (4) Correct delivery specs — wrong file format or codec can disqualify you, (5) Clean, readable subtitles if needed." },
      { h: 'Enter Multiple Contests', body: "The filmmakers who consistently place in competitions enter consistently. Many of the recognized names in AI filmmaking have entered 10+ competitions. Each contest teaches you something about what works. Budget for multiple entry fees and treat each contest as a learning experiment." },
    ],
    ruminatex: false,
  },

  'ai-video-production-workflow': {
    title: 'AI Video Production Workflow: From Concept to Final Film',
    description: 'The complete production pipeline for AI filmmakers — concept, generation, editing, audio, and delivery. A practical workflow used by competition-winning filmmakers.',
    keywords: 'AI video production workflow, AI film production pipeline, how to make AI film 2026',
    intro: "Making an AI film for competition is a multi-stage process that combines traditional filmmaking principles with generative AI tools. Here's the production pipeline that competition-winning AI filmmakers use — from the first concept through final delivery.",
    sections: [
      { h: 'Pre-production: Concept and Storyboard', body: 'Before touching any video generation tool, write a one-paragraph synopsis. What is this film about? What is its mood? What is the single image you want audiences to remember? Use MidJourney or Adobe Firefly to generate reference images for each scene — this becomes your storyboard and your generation prompt guide.' },
      { h: 'Prompt Engineering for Video Generation', body: 'Video generation prompts need specifics: camera position ("low angle, wide shot"), lighting ("golden hour, dramatic side lighting"), movement ("slow push in"), style reference ("Terrence Malick, Days of Heaven"), and subject ("a woman in a red coat standing at the edge of a cliff"). Vague prompts produce generic results. Spend 60% of your generation time on prompt refinement.' },
      { h: 'Generation and Curation', body: "Generate 5-10 variations of each shot. Most will be unusable. You need 3-4 good options to choose from. Never use your first generation — always iterate. Keep a folder of all generated clips, including the 'failures' — sometimes a shot you discarded works perfectly in a different context." },
      { h: 'Editing and Post-production', body: "Edit in DaVinci Resolve or Premiere Pro. AI films often need more cuts than live-action films — the average AI short has a cut every 3-4 seconds because clip consistency degrades after 10-15 seconds. Color grade after all edits are locked. Add your audio mix last — get professional VO from ElevenLabs and original music from Suno or Udio." },
      { h: 'Export and Delivery', body: 'Most contests require H.264 .mp4 at 1080p minimum, often with a 500MB-2GB file size limit. Export at the highest bitrate your file size allows. Include closed captions as a separate .srt file — some contests require it and it helps judges who watch silently. Name your file clearly: YourName_FilmTitle_Contest.mp4.' },
    ],
    ruminatex: true,
    ruminatexNote: 'For brands that want this level of production applied to commercial content, Ruminatex handles the full AI production pipeline — from brief to final delivery.',
  },

  'ai-film-submission-tips': {
    title: 'AI Film Submission Tips: Everything You Need to Know Before You Submit',
    description: 'Avoid common submission mistakes. File formats, metadata, making-of statements, FilmFreeway tips, and what judges actually want to see.',
    keywords: 'AI film submission tips, FilmFreeway AI film, how to submit AI film festival, AI film competition entry guide',
    intro: "Submission errors eliminate more competition entries than bad filmmaking does. Here's how to make sure your film makes it through the technical gate and gets seen by the judges who matter.",
    sections: [
      { h: 'Read the Submission Guidelines Twice', body: 'Print them out if you have to. Highlight: runtime limits (hard cutoffs are common), file format requirements, resolution specs, aspect ratio (most contests want 16:9 but some accept 9:16 for social-first formats), audio requirements (stereo 48kHz is standard), and whether a making-of or director\'s statement is required. One missed requirement can disqualify an otherwise excellent film.' },
      { h: 'FilmFreeway Tips', body: "Most major AI film contests use FilmFreeway. Upload your film at least 24 hours before deadline — servers get overloaded in the final hours. Set your film's privacy to 'Festival Screener' not 'Public.' Include a high-resolution still image as your film's screener image — judges browse thumbnails before they click play, and a compelling image increases watch rates." },
      { h: "The Director's Statement", body: "Many contests ask for a 100-200 word director's statement or making-of note. This is not a technical description — it's your creative vision. Why did you make this film? What were you trying to explore or say? Which AI tools did you use and how did they shape the work? Judges often read statements before watching to orient their viewing. A strong statement primes them to look for what you intended." },
      { h: 'Technical Delivery Checklist', body: "Before submitting: (1) Watch your export from beginning to end — not your timeline, the export file, (2) Check that audio is present and synced, (3) Verify file size is within the limit, (4) Check that captions are correct if required, (5) Confirm the runtime matches what you stated in the entry form, (6) Save your submission confirmation." },
      { h: 'After Submission', body: "Set a calendar reminder for announcement dates. Follow the contest on social media — many announce shortlists there before official notification. If you're not selected, request feedback if the contest offers it. Some competitions provide judge notes for shortlisted entries — this is invaluable for improvement." },
    ],
    ruminatex: false,
  },

  'ai-film-festivals-explained': {
    title: 'AI Film Festivals Explained: What They Are and How They Work in 2026',
    description: 'A guide to the AI film festival circuit in 2026 — the major festivals, how selections work, screening opportunities, and what a festival credit means for your career.',
    keywords: 'AI film festival 2026, AI film festival circuit, Runway AI Film Festival, AI film screening',
    intro: 'The AI film festival circuit has evolved rapidly. What started as niche online showcases has grown into events at Lincoln Center NYC, The Broad Stage LA, Tokyo International Film Festival, and SXSW. Understanding how these festivals work is essential for any serious AI filmmaker.',
    sections: [
      { h: 'The Major AI Film Festivals in 2026', body: "The Runway AI Film Festival is the most prestigious, screening at Alice Tully Hall at Lincoln Center in June and The Broad Stage in LA. Kling NextGen screens at Tokyo International Film Festival. The WSXA × Hailuo Film Competition screens at WSXA Amsterdam and ARFF Berlin. The Luma Dream Brief presents winners at Cannes. Each has different prestige, audience, and industry connections." },
      { h: 'Festival Selection Process', body: 'Most AI film festivals use a tiered selection: automated technical review (file format, runtime, resolution) → program committee review → jury shortlisting → winner selection. Submission to selection takes 4-12 weeks depending on the festival. Some festivals notify all submitters; others only contact selected films.' },
      { h: 'What a Festival Credit Actually Means', body: "Being selected for a major AI film festival is increasingly valuable. Runway AI Film Festival selection is already recognized in the industry. As AI filmmaking matures, festival credits on your IMDb page will become meaningful. For freelancers and studios, festival selections are portfolio proof — they show that work holds up against international competition." },
      { h: 'Online vs. In-Person Festivals', body: "Most AI film festivals are hybrid — in-person screenings with an online audience. Online-only festivals have lower prestige but can reach larger audiences. The most valuable festivals involve in-person jury feedback, Q&A sessions, and networking with industry professionals. If travel is possible, attending your screening in person creates career opportunities that online-only viewing doesn't." },
      { h: 'Building Your Festival Strategy', body: "Treat your festival run strategically. Start with smaller competitions and work up to the majors. Use early placements to build confidence and generate credits for your FilmFreeway profile. Budget for multiple submissions — a strong film can run multiple festivals simultaneously (most allow simultaneous submissions). The goal isn't just winning; it's building a reputation across the emerging AI film community." },
    ],
    ruminatex: false,
  },

  'generative-ai-filmmaking-2026': {
    title: 'The State of Generative AI Filmmaking in 2026',
    description: 'Where AI filmmaking stands in 2026 — the tools, the prize pools, the festival circuit, the industry reception, and what comes next.',
    keywords: 'generative AI filmmaking 2026, AI film industry 2026, state of AI filmmaking, AI cinema 2026',
    intro: "In 2026, generative AI filmmaking has crossed a threshold. It's no longer a curiosity or an experiment — it's a legitimate creative discipline with its own festival circuit, prize pools exceeding $1M per competition, and recognition from legacy institutions including Lincoln Center and Cannes.",
    sections: [
      { h: 'The Prize Pool Revolution', body: "The scale of AI film prizes has exploded. Runway's AI Film Festival now offers $135K+ in prizes. Kling's NextGen Contest has distributed $42K+. Luma's Dream Brief offered $1M for a Cannes Gold Lion. These numbers have attracted serious filmmakers who previously wouldn't have considered AI-native competition. The result is a rapidly rising quality bar." },
      { h: 'Institutional Legitimacy', body: "The shift from skepticism to engagement at traditional film institutions has been swift. Lincoln Center hosts the Runway AI Film Festival. The Tokyo International Film Festival programs Kling NextGen. Cannes judged the Luma Dream Brief. This institutional embrace signals that AI filmmaking is no longer a tech story — it's a cinema story." },
      { h: 'The Tool Landscape', body: "Five tools dominate professional AI filmmaking: Runway, Kling, Sora, Luma, and Pika. Each has distinct aesthetic characteristics that experienced filmmakers leverage deliberately. The skill in AI filmmaking is no longer 'can I generate a video' but 'which tool, which settings, which prompt produces the specific visual language I want for this story.'" },
      { h: 'The Creative Debate', body: "The most interesting conversations in AI filmmaking in 2026 aren't about technology — they're about authorship, aesthetics, and what it means to direct a film when the 'camera' is a probability distribution. The filmmakers winning competitions have strong aesthetic positions and treat AI tools as collaborators with tendencies and preferences to understand and work with, not merely software to operate." },
      { h: 'What Comes Next', body: "Real-time generation, longer coherent sequences, controllable characters — the technical trajectory is clear. The more interesting question is what the film grammar of AI cinema looks like. We're still in the Lumière Brothers phase, figuring out what the medium is. The contests, festivals, and competitions happening right now are where that grammar is being written." },
    ],
    ruminatex: false,
  },

  'ai-brand-film-guide': {
    title: 'How to Make AI Brand Films: A Guide for Marketers and Creative Directors',
    description: 'Using generative AI to produce cinematic brand content — tools, workflows, and when to work with a specialist AI advertising studio.',
    keywords: 'AI brand film guide, AI advertising production, generative AI marketing video, cinematic AI commercial 2026',
    intro: "Brands are discovering that generative AI doesn't just reduce production costs — it changes what's possible. A small team can now produce brand films with the visual quality and emotional impact that previously required six-figure production budgets. But the difference between generic AI output and genuinely cinematic brand content is directorial thinking.",
    sections: [
      { h: 'What Makes a Brand Film "Cinematic"', body: "Cinematic brand content isn't defined by budget — it's defined by intentionality. Deliberate lighting, coherent visual language, a narrative arc, and emotional resonance. AI tools can produce all of these when directed by someone who understands both the craft of filmmaking and the requirements of brand communication. The risk with AI brand content isn't quality — it's genericness. Cinematic brand films require a directorial perspective, not just a prompt." },
      { h: 'The AI Brand Production Stack', body: "A professional AI brand film workflow: (1) Runway or Kling for hero video content, (2) MidJourney for concept development and key art, (3) ElevenLabs for voiceover, (4) Suno or licensed music, (5) DaVinci Resolve for color and finishing. A skilled team can produce broadcast-quality brand content in 48-72 hours from brief. That speed advantage is transformative for time-sensitive campaigns." },
      { h: 'When to Use AI vs. Traditional Production', body: "AI brand film production excels at: conceptual or abstract visual content, fantasy/imagination sequences, fast-turnaround content, content requiring visual styles that would be prohibitively expensive to produce practically, and A/B testing multiple creative directions without proportional cost increase. Traditional production still wins for: real people telling real stories, complex live action, and content where authenticity of human presence is core to the message." },
      { h: 'Working with an AI Advertising Studio', body: "As the category matures, specialized AI advertising studios have emerged that combine generative AI expertise with brand strategy and film direction. The advantage over doing it in-house is the combination of skills that's genuinely rare: deep understanding of AI tools + cinematographic thinking + brand communication strategy. Ruminatex is one of the agencies pioneering this space — creating cinematic AI content specifically built for brand campaigns." },
      { h: 'The Luma Dream Brief as a Case Study', body: "The Luma Dream Brief ($1M prize) asked entrants to create a commercial that could win a Cannes Gold Lion. Judged by Nike, HBO Max, and Wieden+Kennedy. The winning entries weren't technically impressive AI demos — they were well-crafted commercials that happened to be made with AI. This is the direction the industry is moving: AI as production method, not as the story." },
    ],
    ruminatex: true,
    ruminatexNote: 'Ruminatex is a cinematic AI advertising agency creating brand films, commercial content, and campaign visuals for forward-thinking brands. Visit ruminatex.com to discuss your next campaign.',
  },

  'building-ai-film-portfolio': {
    title: 'Building Your AI Filmmaker Portfolio: Competitions, Credits, and Credibility',
    description: 'How to build a credible AI filmmaking portfolio through competitions, festival submissions, and online presence.',
    keywords: 'AI filmmaker portfolio, AI film career, AI filmmaking career guide 2026, AI film credits',
    intro: "AI filmmaking careers are being built right now, in real time. The filmmakers who establish themselves through competition wins and festival selections in 2026 will have an enormous head start in a field that will be mainstream within five years. Here's how to build that foundation strategically.",
    sections: [
      { h: 'Why Competitions Are the Fastest Path', body: "In a field without established career pipelines, competitions are the primary credentialing mechanism. A Grand Prix at the Runway AI Film Festival carries real weight in the industry. A selection at Kling NextGen or a finalist placing at the Luma Dream Brief are portfolio items that open conversations. Competition is how the field identifies talent right now." },
      { h: 'Building Your FilmFreeway Profile', body: "FilmFreeway is the standard submission platform for AI film festivals. A well-maintained profile with multiple competition credits is your public filmmaking CV. Include: high-resolution stills from your films, your director's statement, the festival run for each film (including non-selections — it shows volume of work), and a link to your showreel." },
      { h: 'Online Presence and Community', body: "The AI filmmaking community lives on X (Twitter), Instagram, and Discord. Share your work — including work in progress. The people who become known in the field are the ones who show their process, engage with other filmmakers' work, and participate in the conversation about where AI cinema is going. Competitions are not the only path to visibility." },
      { h: 'What Clients and Studios Want to See', body: "As commercial demand for AI filmmaking grows, what does a portfolio need to show a prospective client? Consistency — multiple films, not just one hit. Range — different genres, moods, and visual approaches. Technical precision — no flickering, no artifacts, clean audio. Most importantly: evidence of directorial thinking, not just technical competence." },
      { h: 'The Long Game', body: "The AI filmmakers who will matter in five years are the ones building now. Enter every contest you can afford. Screen everywhere you're accepted. Build relationships with other filmmakers, judges, and festival programmers. The field is small enough that reputation compounds quickly. A win at the Runway AI Film Festival in 2026 is worth exponentially more than the same win in 2030." },
    ],
    ruminatex: false,
  },

  'ai-film-post-production': {
    title: 'AI Film Post-Production: Editing, Color, Audio, and Delivery',
    description: 'The complete post-production workflow for AI films — editing AI-generated footage, color grading, audio mixing, and delivery for festival and competition submission.',
    keywords: 'AI film post production, editing AI video, color grade AI film, AI film audio mix, DaVinci Resolve AI film',
    intro: "Post-production is where AI films are won or lost. Raw AI-generated footage is rarely submission-ready — it requires thoughtful editing, professional color grading, and a polished audio mix to compete at the highest level. This guide covers the complete post-production workflow for competition-level AI filmmaking.",
    sections: [
      { h: 'Editing AI-Generated Footage', body: "AI footage has specific editing challenges: clips are short (typically 4-10 seconds), temporal consistency can break down at shot boundaries, and not every generation is usable. Build your edit with a target of 3-5 second average shot duration — shorter than traditional film, but appropriate for the visual density of AI footage. Use J and L cuts to smooth audio across shot boundaries." },
      { h: 'Matching Shots Across Generations', body: "Getting visual consistency across AI-generated shots from the same 'scene' is the hardest problem in AI film editing. Techniques: generate all shots in the same session with minimal prompt variation, use consistent lighting descriptors, apply global color correction before scene-specific adjustments, and use subtle cross-dissolves rather than hard cuts when consistency is imperfect." },
      { h: 'Color Grading for AI Film', body: "AI footage often has stylistic inconsistencies in color and contrast across shots. Primary color correction (matching exposure and white balance) before creative grading is essential. In DaVinci Resolve, use the Color Match function to automatically harmonize shots, then apply a creative LUT for your film's specific aesthetic. AI footage generally handles aggressive grades well — the synthetic material has a tolerance that live-action doesn't." },
      { h: 'Audio: The Undervalued Competitive Advantage', body: "Most AI film submissions have generic or poorly mixed audio. This is your competitive edge. Commission original music through Suno or work with a composer. Use ElevenLabs for any voiceover — the quality gap between AI VO and amateur live recording is significant. Mix with a reference track to calibrate your levels. Submit at -23 LUFS for festivals, -16 LUFS for online platforms." },
      { h: 'Export Settings and Delivery', body: "Master export: ProRes 4444 or DNxHR for your master file, never delete. Delivery for festivals: H.264 at 20-40 Mbps for 1080p, H.265 for 4K. Frame rate should match your generation rate — don't convert unless required. Include captions as a separate .srt file. Name files clearly. Run your export through MediaInfo to verify specs before submission." },
    ],
    ruminatex: false,
  },
}

const OTHER_GUIDES = Object.keys(GUIDES)

export async function generateStaticParams() {
  return Object.keys(GUIDES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES[slug]
  if (!guide) return { title: 'Not Found' }

  return {
    title: `${guide.title} | AI Film Contests`,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://aifilmcontests.com/guide/${slug}`,
      siteName: 'AI Film Contests',
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description },
    alternates: { canonical: `https://aifilmcontests.com/guide/${slug}` },
  }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = GUIDES[slug]
  if (!guide) notFound()

  const all = await getAllContests()
  const openContests = all.filter(c => c.status === 'open').slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `https://aifilmcontests.com/guide/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'AI Film Contests',
      url: 'https://aifilmcontests.com',
    },
    mainEntityOfPage: `https://aifilmcontests.com/guide/${slug}`,
  }

  const otherGuides = OTHER_GUIDES.filter(s => s !== slug).slice(0, 5)

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 28 }}>
          <Link href="/" className="link-muted">AI Film Contests</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span className="link-muted" style={{ cursor: 'default' }}>Guides</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#52525b' }}>{guide.title}</span>
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
            {guide.title}
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.7, maxWidth: 680 }}>
            {guide.intro}
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginBottom: 56 }}>
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                color: '#f4f4f5',
                marginBottom: 12,
                letterSpacing: '-0.01em',
              }}>
                {section.h}
              </h2>
              <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.75 }}>
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Ruminatex callout */}
        {guide.ruminatex && guide.ruminatexNote && (
          <div style={{
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 14,
            background: 'rgba(99,102,241,0.05)',
            padding: '24px 28px',
            marginBottom: 56,
          }}>
            <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, marginBottom: 12 }}>
              {guide.ruminatexNote}
            </p>
            <a
              href="https://ruminatex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#a5b4fc',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Visit Ruminatex →
            </a>
          </div>
        )}

        {/* Related open contests */}
        {openContests.length > 0 && (
          <section style={{ marginBottom: 56 }}>
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

        {/* Related guides */}
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
            More Guides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {otherGuides.map(s => (
              <Link key={s} href={`/guide/${s}`} className="link-muted" style={{ fontSize: 14 }}>
                → {GUIDES[s].title}
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
