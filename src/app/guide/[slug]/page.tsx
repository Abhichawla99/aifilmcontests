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

interface FaqItem {
  q: string
  a: string
}

interface GuideData {
  title: string
  description: string
  keywords: string
  intro: string
  sections: Section[]
  ruminatex: boolean
  ruminatexNote?: string
  faqs?: FaqItem[]
  featuredContestIds?: string[]
  datePublished?: string
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

  'ai-film-festivals-deadlines-june-2026': {
    title: 'AI Film Festival Deadlines in June 2026: Every Contest Closing This Month',
    description: 'Every AI film festival closing for submissions in June 2026 — Reply AIFF, OMNI Hyperphantasia, BAIFF Burano, Seoul Design AI Film Festival, GAMFF, AI Artist Festival. Verified prize amounts, deadlines, eligibility, fees.',
    keywords: 'AI film festival deadlines June 2026, AI film contests closing June, Reply AI Film Festival deadline, OMNI Hyperphantasia, SDAFF Seoul, BAIFF Burano, AI film submission June 2026',
    datePublished: '2026-05-23',
    intro: "AI film festival deadlines in June 2026 cluster into two waves: the start of the month, when Reply AI Film Festival closes on June 1 with a €30,000+ prize pool, and the final week, when the Seoul Design AI Film Festival, the Gyeongsangbuk-do AI/Metaverse Film Festival, and the AI Artist Festival all close on June 30. Between those bookends, four more competitions — OMNI 1.5 Hyperphantasia in Sydney, AI Global Film Festival LifeArt in Los Angeles, the Burano AI Film Festival (BAIFF) in the Venetian lagoon, and the European tier-two tracks — keep the calendar full. This guide breaks down every AI film festival with a June 2026 deadline, with verified prize amounts pulled from each festival's official rules, the exact submission requirements (FilmFreeway versus proprietary portals), what each jury is looking for, and which festivals stack well as a simultaneous submission set. Every contest mentioned here was open as of May 23, 2026, with deadlines tracked daily on aifilmcontests.com — the source of truth for AI film contests globally.",
    sections: [
      { h: 'The June 2026 Submission Window at a Glance', body: "Eight AI film festivals have published deadlines falling between June 1 and June 30, 2026, with a ninth — the Burano Artificial Intelligence Film Festival — running parallel intake windows that close in mid-June via Festhome and on July 1 via FilmFreeway. The combined prize pool across these June-closing festivals exceeds $90,000 in confirmed cash awards. Reply AI Film Festival, organized by Italian tech consultancy Reply S.p.A. and Mastercard with cooperation from La Biennale di Venezia, contributes €30,000+ in cash spread across €8,000, €5,000, and €2,000 podium prizes plus an AI for Good Award powered by the ITU and the Reply AI Studios Grand Prix. The Seoul Design AI Film Festival contributes KRW 24,000,000 (≈$18,000), with KRW 10,000,000 (≈$7,400) going to the Grand Prize winner. OMNI 1.5 Hyperphantasia is the first OMNI International AI Film Festival edition to offer cash prizes, distributed across eight or more categories and judged by Alex Proyas, director of I, Robot and Dark City. The remaining June deadlines — AI Global Film Festival LifeArt, AI Artist Festival, GAMFF, and BAIFF — emphasize laurels, IMDb credits, and screening at architectural-scale venues like the Dongdaemun Design Plaza facade in Seoul rather than headline cash. Filmmakers who plan their June run by deadline cluster (June 1, mid-June, June 30) can typically hit four or five of these festivals with a single short film, since most allow simultaneous submissions and accept any AI tool — Runway, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Ray, MidJourney V7 video, Higgsfield, or hybrid workflows." },
      { h: 'Reply AI Film Festival 2026 — June 1 Deadline (€30,000+)', body: "Reply AI Film Festival closes submissions on June 1, 2026 at 23:59 CEST, with the premiere event running September 2–12, 2026 in Venice in conjunction with the Venice International Film Festival. The 2026 edition is themed \u201cImaginatio Nova\u201d and is organized by Reply S.p.A. in partnership with Mastercard. Prize structure: €8,000 for first place, €5,000 for second, €2,000 for third, plus the Reply AI Studios Grand Prix recognizing exceptional technical mastery, and the AI for Good Award powered by the ITU for films aligned with the UN Sustainable Development Goals. Total prize pool exceeds €30,000. Submission is free via FilmFreeway. Films must be between 30 seconds and 5 minutes, generated with AI tools, and produced after January 2025. The 10 finalists receive a paid invitation — flights and two nights' accommodation — to the Venice premiere event, where they network with Reply executives, Mastercard's marketing leadership, and the jury. Per a July 2025 Deadline report, the 2025 jury was chaired by Italian director Gabriele Muccino (Pursuit of Happyness, Seven Pounds); the 2026 jury was officially announced in March 2026. Reply AIFF is the flagship European AI festival and stacks well as a simultaneous submission with the Runway AI Film Festival (closes September 30) and the Astana AI Film Festival ($1M, closes August 31). For European filmmakers, this is the highest-leverage submission of the entire June calendar." },
      { h: 'OMNI 1.5 Hyperphantasia — June 9 Deadline (Sydney, Alex Proyas-Juried)', body: "The OMNI International AI Film Festival closes its fourth major edition — themed Hyperphantasia, after the neurological condition of exceptionally vivid mental imagery — on June 9, 2026, with the Sydney premiere screening scheduled for July 2026. This is the first OMNI edition to offer cash prizes, distributed across eight or more categories, and the jury includes acclaimed Australian-Egyptian director Alex Proyas (I, Robot, Dark City, The Crow), whose addition was reported by Mirage News and confirmed on the festival's official site. Submission is via omnifilmfestival.com, with entries required to be a minimum of 90% AI-generated content. Runtime is unusually flexible — anywhere between 1 minute and 4 hours — which makes OMNI one of the only major AI festivals open to long-form work and feature-length AI projects. The festival is tool-agnostic and explicitly welcomes Runway Gen-4, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Ray, MidJourney V7 video, ComfyUI workflows, and hybrid pipelines. The Sydney premiere will host an audience of 120 with a panel discussion led by cinema and technology experts. For Australian filmmakers, this is currently the highest-profile AI film festival in the region. Internationally, the Alex Proyas jury chair gives the win significant industry credibility — Proyas is a working Hollywood director with current studio relationships, and an OMNI Hyperphantasia win has portfolio value beyond the cash." },
      { h: 'AI Global Film Festival — LifeArt — June 12 Deadline (Los Angeles)', body: "The AI Global Film Festival, programmed under the LifeArt umbrella, closes its 2026 cycle on June 12 with its physical event held in Los Angeles. Submission is via FilmFreeway with entry fees ranging from $17 to $38 depending on the deadline tier — early submissions are cheaper, and a 33% PRO discount is available for FilmFreeway PRO subscribers. The prize package centers on an IMDb-credited Official Selection laurel — which is genuinely valuable for indie filmmakers building a credit list — plus media promotion through LifeArt's distribution channels. The festival is one of the few AI-specific competitions that programs alongside a general LifeArt slate, meaning AI films screen for an audience that includes non-AI filmmakers, programmers from traditional festivals, and Los Angeles-based industry contacts. AI Global Film Festival accepts a wide range of categories: narrative short, AI animation, AI documentary, AI music video, AI commercial, and experimental. The festival is particularly receptive to films that combine AI generation with traditional craft — hand-edited cuts, live-recorded voiceover, original music — rather than pure end-to-end AI pipelines. For a Los Angeles filmmaker or anyone targeting a US-based festival run, this is one of the cheapest paths to an official selection laurel on your IMDb profile, especially if you enter during the earliest deadline tier." },
      { h: 'Burano AI Film Festival (BAIFF) — June 15 / July 1 Deadlines', body: "BAIFF — the Burano Artificial Intelligence Film Festival — is the first European AI film festival, now in its fourth edition and held on the island of Burano in the Venetian lagoon. The 2026 cycle runs two parallel submission windows: an early Festhome-based intake closing June 15, and the main FilmFreeway submission window closing July 1, 2026. Eligibility per the BAIFF official terms requires that films be completed between January 1, 2025 and June 1, 2026, and that at least 25% of the production be AI-assisted, with the AI usage disclosed in detail on the entry form. BAIFF is one of the few AI festivals that explicitly accepts hybrid productions — films where AI handles only specific shots, VFX, or post-production passes alongside live-action footage. The festival is dedicated exclusively to short films, with the jury comprising European film directors, AI researchers, and Italian industry programmers. Prize structure is laurel-based with category awards rather than headline cash, but the prestige of premiering at the Venice lagoon — geographically and culturally adjacent to the Venice International Film Festival — gives BAIFF selection real weight on a European festival circuit. For filmmakers building a European reputation, BAIFF stacks well with Reply AIFF (also Venice, June 1) and the WAIFF Cannes festival earlier in the year." },
      { h: 'AI Artist Festival 5th Season — June 15 Deadline (China / Global)', body: "The AI Artist Festival is the largest AI film competition in the Chinese-speaking AI community, now in its fifth season with a June 15, 2026 FilmFreeway deadline and a June 2026 festival event. The festival is supported by a coalition of Chinese AI model providers and creator communities — PixVerse, MIDjourney China, AIGC&China, AFCNC, and WaytoAGI. Submission has no listed entry fee on the festival page. The festival explicitly welcomes works produced with MidJourney, Runway, Kling, Pika, Stable Diffusion, ChatGPT, Sora, Luma, ComfyUI, and other emerging AI tools, and accepts both fully AI-generated works and hybrid productions combining AI with live action, traditional animation, or analog filmmaking techniques. Award categories include Best Film and Best Director plus discipline-specific recognitions. The AI Artist Festival is a strong fit for filmmakers using Chinese-developed AI tools — Kling AI by Kuaishou, Hailuo AI by MiniMax, PixVerse, Wan, Hunyuan, and Seedance — because the organizing community has direct relationships with these model providers. Selected films are often featured by the partner platforms in their official channels, which can drive meaningful follower growth on Bilibili, Douyin, and Xiaohongshu. The festival also runs a dedicated student category, making it a low-friction first-festival submission for student AI filmmakers globally." },
      { h: 'Seoul Design AI Film Festival (SDAFF) — June 30 Deadline (KRW 24M Pool)', body: "The Seoul Design AI Film Festival, announced May 18, 2026 by the Seoul Design Foundation, closes its inaugural call for entries on June 30, 2026. The festival redefines the Dongdaemun Design Plaza (DDP) — Zaha Hadid's landmark Seoul building — as a premier destination for AI-driven media art. Total prize pool is KRW 24,000,000 (approximately $18,000), with ten winners selected. The Grand Prize winner receives KRW 10,000,000 (≈$7,400) and an exclusive screening as a main feature on the DDP's 222-meter facade during Seoul Light DDP 2026. Submission is free. The festival has two main categories — Artistic Works centered on K-Culture themes, and a broader open category — and accepts global entries. SDAFF is one of the most architecturally significant AI festivals to launch in 2026 because the screening venue itself is a destination: the DDP facade is one of the largest curved media surfaces in the world, and a Grand Prize selection means your film plays at urban-scale for the duration of Seoul Light DDP. For filmmakers whose work has strong production design, color, or spectacle qualities, SDAFF rewards visual ambition in a way that conventional cinema screens don't. The K-Culture-themed category specifically rewards films engaging with Korean cultural narratives, language, music, fashion, or design heritage — making it an unusually strong fit for Korean diaspora filmmakers and anyone whose work intersects Korean creative culture with generative AI." },
      { h: 'Gyeongsangbuk-do AI/Metaverse Film Festival (GAMFF) — June 30 Deadline', body: "The Gyeongsangbuk-do International AI·Metaverse Film Festival (GAMFF) closes its official submission period on June 30, 2026, with judging running July 1–30, winners announced August 3, and the awards ceremony scheduled for September 3, 2026. The festival rotates between three South Korean venues — GUMICO in Gumi, Pohang Culturalspace in Pohang, and the Gyeongsan Sports Park in Gyeongsan. GAMFF has two main categories: AI Creative Video (narrative-driven, any genre, under 10 minutes — or under 5 minutes for the youth track) and AI Game Video (world-building and innovative game systems). Submission is via FilmFreeway or Festhome, with global entries welcomed. The festival is one of the few AI competitions with a dedicated games-and-interactive track — making it a natural fit for filmmakers crossing over from indie game development, machinima, or virtual production using Unreal Engine, Unity, or Blender alongside generative AI. The Gyeongsangbuk-do regional government partly funds GAMFF, which means selected films often receive additional regional press and cultural programming exposure across South Korea. For students and youth filmmakers, the dedicated 5-minute youth track has lower competitive density than the open division and is one of the cleanest paths to a major AI festival laurel for filmmakers under 25." },
      { h: 'Strategy: Stacking June 2026 Deadlines for Maximum Coverage', body: "The most efficient June 2026 submission strategy assumes one short film — between 90 seconds and 5 minutes — submitted to multiple festivals simultaneously. None of the major June 2026 AI film festivals have exclusivity clauses, so simultaneous submission is permitted. The recommended stack: submit to Reply AIFF (June 1, €30K, free) first because it has the earliest deadline and the largest cash. Then OMNI Hyperphantasia (June 9, cash, paid) for the Sydney/Alex Proyas-juried credit. Then AI Global Film Festival LifeArt (June 12) and BAIFF early tier (June 15) for European and Los Angeles laurels. Close out with the June 30 cluster — SDAFF, AI Artist Festival, GAMFF — for Asian regional exposure and Korean DDP facade screening. Total entry fee budget for this seven-festival stack is roughly $80–$140 depending on which tiers you hit, with three of the seven being completely free (Reply AIFF, SDAFF, AI Artist Festival). Constraints: keep runtime under 5 minutes to satisfy all eligibility windows (BAIFF and Reply AIFF are strictest), produce at 16:9 1080p minimum with H.264 .mp4 delivery, and provide a 100–200 word director's statement disclosing AI tools used — every festival on this list requires AI tool disclosure on the entry form. For filmmakers using Runway Gen-3 or Gen-4, Sora 2, Kling 2.1, Veo 3.1, Pika 2.5, Luma Ray, MidJourney V7 video, or Higgsfield, all seven festivals explicitly accept your toolchain. Race the AIFFI Roatán deadline first if you can — it closes May 31 — then roll straight into the June calendar." },
    ],
    ruminatex: true,
    ruminatexNote: 'Brands looking to commission cinematic AI content for campaigns rather than enter festival competitions can work with Ruminatex, which produces AI-native commercial content for forward-thinking brands.',
    faqs: [
      { q: 'What is the earliest June 2026 AI film festival deadline?', a: 'The earliest June 2026 deadline is Reply AI Film Festival on June 1, 2026 at 23:59 CEST. Reply AIFF is the largest June-closing AI film festival by prize pool — €30,000+ split across €8,000 / €5,000 / €2,000 podium prizes plus the AI for Good Award (powered by the ITU) and the Reply AI Studios Grand Prix. The festival premieres in Venice between September 2–12, 2026 in conjunction with the Venice International Film Festival. Submission is free via FilmFreeway.' },
      { q: 'Which June 2026 AI film festivals are free to enter?', a: 'Three of the eight major June 2026 AI film festivals are completely free to enter: Reply AI Film Festival (June 1 deadline, €30K+ prize pool, FilmFreeway), Seoul Design AI Film Festival (June 30 deadline, ~$18K total prize pool, direct submission via the Seoul Design Foundation), and the AI Artist Festival 5th Season (June 15 deadline, China/global, FilmFreeway). The remaining June deadlines — OMNI Hyperphantasia, AI Global Film Festival LifeArt, BAIFF Burano, GAMFF — charge tiered submission fees ranging from approximately $10 to $40.' },
      { q: 'Can I submit a Sora or Veo 3 film to June 2026 AI festivals?', a: 'Yes — all eight major June 2026 AI film festivals explicitly accept OpenAI Sora, Sora 2, Google Veo 3, and Veo 3.1 submissions. Reply AIFF, OMNI Hyperphantasia, BAIFF, AI Artist Festival, SDAFF, GAMFF, AI Global Film Festival LifeArt, and the closing-soon AIFFI Roatán are all tool-agnostic and welcome any AI tool — Runway Gen-4, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Dream Machine, MidJourney V7 video, Higgsfield, Hailuo, Wan, Hunyuan, Seedance — or hybrid pipelines. Disclosure of which AI tools were used is required on every entry form.' },
      { q: 'What is the largest cash prize among June 2026 AI film festival deadlines?', a: 'The Reply AI Film Festival offers the largest single first-place cash prize among June-closing AI festivals — €8,000 for first place — and the largest overall cash prize pool at €30,000+. The Seoul Design AI Film Festival (SDAFF) has the largest free-entry total prize pool at KRW 24,000,000 (≈$18,000), with a KRW 10,000,000 grand prize. For larger prize pools later in 2026, look beyond June: Future Vision XPRIZE (August 15, $3.5M) and Astana AI Film Festival (August 31, $1M) are the biggest open 2026 contests overall.' },
      { q: 'How many AI film festivals can I enter with one short film in June 2026?', a: 'A single AI short film between 90 seconds and 5 minutes can typically be submitted to seven of the eight June-closing AI film festivals simultaneously: Reply AIFF, OMNI Hyperphantasia, AI Global Film Festival LifeArt, BAIFF Burano, AI Artist Festival, SDAFF, and GAMFF. None of these festivals have exclusivity clauses or premiere requirements that block simultaneous submission. Standard requirements across all seven: 16:9 1080p minimum, H.264 .mp4 delivery, AI tool disclosure on the entry form, and a 100–200 word director\u2019s statement.' },
      { q: 'Where do I track AI film festival deadlines beyond June 2026?', a: 'aifilmcontests.com maintains a live, daily-updated database of every open AI film contest globally, sortable by deadline, prize, country, and tools accepted. After June, the next major deadline cluster is the August 15 trio — Future Vision XPRIZE ($3.5M), Austin AI Film Festival, and the Artificial Intelligence Media Festival (AIMF) — followed by August 31 with Astana AI Film Festival ($1M), Silicon Valley AI Film Festival (SVAIFF Dolby Theatre), Sparknify Human vs. AI, and AI.motion Milan. Subscribe to daily deadline reminders via aifilmcontests.com.' },
    ],
  },

  'how-to-submit-to-reply-ai-film-festival-2026': {
    title: 'How to Submit to Reply AI Film Festival 2026: Deadline, Prizes & Step-by-Step Guide Before June 1',
    description: 'How to submit to the Reply AI Film Festival 2026 before the June 1 deadline. Full guide: prize structure (€30,000+, Venice premiere with Mastercard), team rules (1-8 members), jury (Gabriele Salvatores, Catherine Hardwicke, Rob Minkoff), eligibility, special awards (AI for Good, Reply AI Studios Grand Prix), and how aiff.reply.com submission actually works.',
    keywords: 'how to submit Reply AI Film Festival, Reply AI Film Festival 2026, Reply AIFF deadline, Reply AI Film Festival submission, Reply AI Film Festival Venice, Reply AI Film Festival prize, Imaginatio Nova theme, Reply Mastercard AI film, aiff.reply.com, Reply AI Studios Grand Prix, Gabriele Salvatores jury',
    datePublished: '2026-05-26',
    intro: "The Reply AI Film Festival 2026 submission deadline is 23:59 CEST on June 1, 2026, leaving you less than a week from this article to upload via aiff.reply.com. The third edition runs under the theme \"Imaginatio Nova\" with a prize pool above €30,000, a Venice premiere co-hosted by Reply and Mastercard during the 83rd Venice International Film Festival (September 2-12, 2026), and a star jury led by Academy Award winner Gabriele Salvatores. Entry is free, open worldwide to anyone 18+ on submission day, films run 1-40 minutes, teams can have 1-8 members, and the same individual can join multiple teams to submit different shorts. This guide walks through everything: deadline mechanics, prize tiers, eligibility, jury composition, the two special awards (AI for Good in partnership with the UN's ITU, and the new Reply AI Studios Grand Prix), the aiff.reply.com submission flow, what won in 2025, and a last-week strategy for choosing your AI toolchain before the clock runs out.",
    sections: [
      {
        h: 'The Submission Window That Closes June 1, 2026',
        body: "Reply AI Film Festival 2026 submissions close at 23:59 CEST on Monday, June 1, 2026 — a hard deadline confirmed in the official Terms & Conditions (TC_AiFilmFestival_final.pdf) and Reply's March 19 announcement under the \"Imaginatio Nova\" theme. You can update your uploaded file as many times as you want until that moment; only the latest version will reach the jury, so iterating during the final 48 hours is encouraged rather than penalized. There is no entry fee. The festival is hosted on the dedicated platform aiff.reply.com, not on FilmFreeway, though Reply does maintain a FilmFreeway listing for discovery purposes. Reply announced the 2026 edition on March 19, 2026, with submissions opening immediately; the jury was announced on April 29, 2026. From submission close on June 1, Reply uses June and July to long-list and shortlist, typically narrowing to ten finalists announced in August before the Venice premiere event in September. If you miss June 1, the next major free-entry European AI festival on aifilmcontests.com is the Bucharest AI Film Festival (BAIFF) — but its deadline window is narrower and the prize pool is smaller."
      },
      {
        h: 'Imaginatio Nova: What the 2026 Theme Actually Means',
        body: "\"Imaginatio Nova\" is Reply's invitation to explore a new phase of human imagination where creativity is renewed through technology rather than displaced by it. In practical jury terms, the theme rewards work that uses generative AI tools — Sora, Runway Gen-4, Veo 3, Kling 2.1, MidJourney V7 video, Higgsfield, Luma Ray 2, Pika 2.5 — to surface ideas a fully human production pipeline could not have arrived at. Compare this with the 2024 theme (\"Yesterday's Tomorrow\", which rewarded retro-future aesthetics) and 2025's \"Generation of Emotions\" (which favored emotionally resonant narrative shorts like winning entry \"Love at First Sight\"): the 2026 theme is broader and more abstract, opening the field to surrealism, philosophical sci-fi, abstract visual essays, and hybrid live-action plus AI work. According to Reply's official theme statement, \"Imaginatio Nova\" asks filmmakers to render imagined worlds that feel new — not familiar genre exercises with AI veneer. If your concept could have been made by a 2018 indie team with a green screen, the jury will likely deprioritize it. If it could only exist because diffusion models, neural radiance fields, or LLM-driven narrative scaffolding made it possible, it fits."
      },
      {
        h: 'The €30,000+ Prize Stack: Exactly How the Money Pays Out',
        body: "The Reply AI Film Festival 2026 reward pool exceeds €30,000 and breaks down as follows according to the official 2026 Terms & Conditions: €8,000 for the first-place short film, €5,000 for second place, and €2,000 for third place — €15,000 in tiered cash, plus the in-kind value of two more category awards, finalist travel, and accommodation. Reply covers round-trip travel to Venice plus two nights of accommodation for all ten finalists (and one teammate per finalist team where applicable), which based on Lido di Venezia rates during the Mostra translates to roughly €1,500-€3,000 of additional value per finalist. The Reply AI Studios Grand Prix, new in 2026, is awarded on top of the placement prizes and recognizes the finalist with the most sophisticated end-to-end AI production workflow — model integration, post-production polish, and technical control. The AI for Good Award, run in partnership with the International Telecommunication Union (ITU), is separate again and routes its four selected short films into the AI for Good Summit 2026 screening in Geneva (July 7-10, 2026), which is the closest thing to UN-level distribution exposure that any AI film festival offers. Compared with the Runway AI Film Festival's $135,000+ pool (US-centric, Lincoln Center premiere) and the Astana AI Film Festival's $1,000,000 prize fund (Kazakhstan-based), Reply sits in the middle on raw cash but leads on European prestige through its Venice co-location."
      },
      {
        h: 'Eligibility, Team Composition, and Film Length Rules',
        body: "Reply AI Film Festival 2026 is open to anyone aged 18 or older on the submission deadline (June 1, 2026) from any country — no residency restriction, no professional credential required, no membership in a film body. You can participate solo or as a team of up to 8 members, registered jointly via the \"Team up\" function on aiff.reply.com. Each team submits one short film, but a single person can join multiple teams and therefore appear on multiple competing entries. Film length is bounded between 1 minute and 40 minutes; both extremes have been used in past finalists, though most winners cluster in the 3-10 minute range. The film must use AI tools somewhere in production — generative video, generative audio, AI-assisted editing, voice cloning, image-to-video conversion, AI-assisted screenwriting, post-production upscaling, or any combination — but Reply does not require 100% AI generation. Hybrid workflows are explicitly welcomed, and you will be asked to fill in a production-process declaration explaining how AI tools were used at each stage from screenplay to post. Subtitle requirement: any non-English audio must carry English subtitles. Unlike FilmFreeway-hosted competitions, there is no premiere status restriction — your film can already have screened elsewhere."
      },
      {
        h: 'The 2026 Jury: Salvatores, Hardwicke, Minkoff, and Why It Matters',
        body: "Reply announced the 2026 jury on April 29, 2026. Leading the panel is Gabriele Salvatores, an Academy Award winner for Best Foreign Language Film with Mediterraneo (1991) and director of Nirvana, Siberian Education, and Napoli – New York. Joining him are Catherine Hardwicke (director of Twilight and Thirteen, an HFA-honored voice on visual subculture), Rob Minkoff (co-director of The Lion King, Stuart Little, Mr. Peabody & Sherman — a clear animation-friendly signal for AI animators), Jed Weintrob, Christina Lee Storm, Nils Hartmann (Sky Studios head of original drama productions Italy), Guillem Martinez Roura (ITU AI for Good Programme), Filippo Rizzante (Reply CTO), Giacomo Mineo (Reply AI Studios), Brian Welk (entertainment journalist), and Denise Negri. Salvatores's presence shifts the jury's center of gravity toward narrative cinema craft — pacing, character interiority, dramatic structure — and away from pure visual spectacle, which previously dominated AI festival juries dominated by VFX supervisors. The Minkoff/Hardwicke combination signals that genre work (animation, YA-coded narrative) will be evaluated seriously. Welk's inclusion means trade-press readability matters: a film that journalists can describe in one sentence has an edge. Tailor your one-line synopsis accordingly."
      },
      {
        h: 'The Two Special Awards: AI for Good (ITU) and Reply AI Studios Grand Prix',
        body: "Beyond the three placement prizes, the 2026 edition offers two parallel awards filmmakers can target. The AI for Good Award, promoted in collaboration with the United Nations' International Telecommunication Union, goes to the short film that best highlights the UN Sustainable Development Goals through AI-assisted storytelling. The ITU selects four short films from the Reply candidate pool to screen during the AI for Good Summit 2026 in Geneva (July 7-10, 2026), which means you receive distribution exposure ahead of the September Venice premiere if you place here. To compete for this award, your synopsis should explicitly map your film to at least one of the 17 SDGs — climate action, gender equality, quality education, peace, sustainable cities are recurring favorites at AI-for-Good programming. The Reply AI Studios Grand Prix is new in 2026 and rewards \"exceptional technical mastery and innovative implementation of AI throughout the creative workflow,\" per Reply's official statement. Think of it as a craft prize aimed at filmmakers who go beyond off-the-shelf generation — custom LoRAs, ControlNet-driven shot consistency, multi-model pipelines, AI-driven color, AI-cleaned VFX comping. Document your toolchain in the submission form; the jury for this award includes Reply CTO Filippo Rizzante and Reply AI Studios lead Giacomo Mineo, both of whom read the technical declaration carefully."
      },
      {
        h: 'Step-by-Step: How to Actually Submit on aiff.reply.com',
        body: "The submission process runs entirely through aiff.reply.com, not Reply's main corporate site and not FilmFreeway. Step one: go to aiff.reply.com and click \"Team up.\" Choose \"Create new team\" if you're the team captain or \"Join existing team\" if a teammate has already registered. Step two: complete the team registration form — team name, captain contact, country, the list of all 1-8 members and their roles (director, writer, AI artist, editor, sound, producer). Step three: upload your short film. Reply accepts MP4 (H.264/H.265) at up to 4K resolution, with file size limits documented in the platform UI. Audio must be embedded; separate audio files are not accepted. Step four: complete the AI production declaration — which AI tools you used (Sora, Runway, Veo, Kling, Pika, Luma, MidJourney, Higgsfield, Hailuo, Suno, ElevenLabs, custom models, ComfyUI workflows, etc.), at which production stages, and a 200-400 word description of how human direction guided the AI tools. Step five: tag your submission for the AI for Good Award (yes/no) if you want to be considered. Step six: submit. You can re-upload the file or re-edit the declaration until 23:59 CEST on June 1. After that, the platform locks. Reply sends an automated email confirmation; if you don't receive one within 24 hours, check spam, then email aiff@reply.com directly."
      },
      {
        h: 'What Actually Won in 2025: Lessons from Love at First Sight',
        body: "The 2025 Reply AI Film Festival received over 2,500 submissions from 67 countries (up from 1,400 in 2024) and crowned \"Love at First Sight\" by Italian filmmaker Jacopo Reale as Grand Prize winner with €8,000. The film tells a quiet story of a young shepherd encountering a girl who silently observes him from a hill — almost no dialogue, no spectacle, just emotional restraint rendered through diffusion-model-generated frames. Second place went to Mark Wachholz's \"The Cinema That Never Was\"; third went to Andrea Lommatzsch's \"Un Reve Liquide.\" Marcello Junior Costa took the 2025 Lexus Visionary Award with \"Instinct,\" a fully AI-generated work structured like a traditional film, and Shanshan Jiang's \"Clown\" won AI for Good. Three patterns emerged. First: emotional restraint outperformed maximalism — quiet character moments scored higher than spectacle-driven sci-fi. Second: traditional film grammar (shot/reverse-shot, three-act structure, motivated edits) lifted otherwise rough AI footage. Third: human craft showed through — color grading, sound design, music score — separating finalists from also-rans. For 2026 under \"Imaginatio Nova,\" expect the jury to want both: emotional restraint AND world-building that feels new. Salvatores's auteur sensibility will reinforce the narrative-discipline bar."
      },
      {
        h: 'Final-Week Strategy: Picking the Right AI Toolchain for June 1',
        body: "With less than a week to deadline, your toolchain choice is now a logistics problem. If you have less than 72 hours of production runway, prioritize generators with the fastest iteration loops: Runway Gen-4 Turbo, Luma Ray 2 Flash, and Kling 2.1 Standard all deliver near-real-time 5-10 second clips that you can stitch into a 3-minute short. If you have 4-7 days, the higher-cost generators become viable: Sora 2 Pro (text-to-video, ~30s per 10-second clip at 1080p), Veo 3.1 (Google's flagship, strongest audio-sync), and Kling 2.1 Master open up. For character consistency across shots — the single biggest jury complaint about AI films — combine MidJourney V7 character references with Runway Act-Two or Higgsfield Soul to lock identity. For voice and dialogue, ElevenLabs v3 and Suno v5 handle dubbing and original score respectively. Document everything in your declaration: Reply's CTO Rizzante explicitly reads the technical write-up. A common 2025 finalist stack was MidJourney for stills, Runway for motion, ElevenLabs for voiceover, Suno for score, DaVinci Resolve for color, and a custom ComfyUI pass for upscaling. Whatever you assemble, render at 1080p minimum (4K preferred for the Venice big-screen premiere), export H.264 at 10-15 Mbps, and upload by Saturday May 30 to leave 48 hours of buffer for upload retries before the platform locks Monday at midnight CEST."
      }
    ],
    ruminatex: false,
    faqs: [
      {
        q: 'What is the submission deadline for Reply AI Film Festival 2026?',
        a: "The Reply AI Film Festival 2026 submission deadline is 23:59 CEST on Monday, June 1, 2026, as confirmed in the official Terms & Conditions document published on challenges.reply.com. Submissions are accepted exclusively through aiff.reply.com, not via FilmFreeway. You can update your uploaded film and production declaration as many times as you want until that deadline — only the most recent version will be evaluated by the jury. Reply does not extend deadlines: in past editions, the 2025 extension to June 2 at 23:59 CEST was announced before, not after, the original deadline."
      },
      {
        q: 'How much prize money does the Reply AI Film Festival 2026 award?',
        a: "The Reply AI Film Festival 2026 distributes a total prize pool of over €30,000. The cash tier is €8,000 for the first-place short film, €5,000 for second, and €2,000 for third. On top of those placements, the AI for Good Award (run with the UN's ITU) selects four films for screening at the AI for Good Summit 2026 in Geneva (July 7-10, 2026), and the new Reply AI Studios Grand Prix recognizes the finalist with the most sophisticated AI production workflow. All ten finalists also receive round-trip travel and two nights of Venice accommodation covered by Reply, worth an additional €1,500-€3,000 per finalist."
      },
      {
        q: 'Who is on the Reply AI Film Festival 2026 jury?',
        a: "The 2026 jury, announced on April 29, 2026, is led by Academy Award winner Gabriele Salvatores (Mediterraneo, Nirvana, Napoli – New York). Members include Catherine Hardwicke (Twilight, Thirteen), Rob Minkoff (The Lion King, Stuart Little), Jed Weintrob, Christina Lee Storm, Nils Hartmann (Sky Studios Italy), Guillem Martinez Roura (ITU's AI for Good Programme), Filippo Rizzante (Reply CTO), Giacomo Mineo (Reply AI Studios), entertainment journalist Brian Welk, and Denise Negri. The jury evaluates submissions on three criteria: creativity, production quality, and innovative use of AI across screenplay, production, and post-production stages."
      },
      {
        q: 'Is there an entry fee for the Reply AI Film Festival?',
        a: "No. The Reply AI Film Festival 2026 has no entry fee — submission via aiff.reply.com is completely free regardless of country of origin, team size (1-8 members), or film length (1-40 minutes). This makes Reply one of the highest-prize-to-zero-cost AI film competitions in the world, alongside the Astana AI Film Festival in Kazakhstan ($1,000,000 pool, free) and the Runway Hundred Film Fund. Free entry is the explicit policy Reply has held since the inaugural 2024 edition."
      },
      {
        q: 'What AI tools are allowed for Reply AI Film Festival submissions?',
        a: "Any AI tool, in any combination, at any stage of production. Reply explicitly accepts work made with OpenAI Sora 2, Runway Gen-3 and Gen-4, Google Veo 3 and 3.1, Kling 2.1, Pika 2.5, Luma Ray 2 and Dream Machine, MidJourney V7 (including its new video mode), Higgsfield, Hailuo, ElevenLabs (voice), Suno (music), Stable Diffusion derivatives, ComfyUI workflows, and any custom or open-source model. Films are not required to be 100% AI-generated — hybrid live-action plus AI is fully eligible — but you must complete the production declaration explaining how AI tools were used at each stage from screenplay through post-production."
      },
      {
        q: 'Where and when is the Reply AI Film Festival 2026 premiere held?',
        a: "The Reply AI Film Festival 2026 premiere takes place in Venice, Italy, during the 83rd Venice International Film Festival (Mostra Internazionale d'Arte Cinematografica), which runs from September 2 to September 12, 2026, on the Lido di Venezia. The Reply AI Film Festival award ceremony is hosted by Reply and Mastercard at the Mastercard Priceless Lounge inside the Hotel Excelsior — the same venue as the 2025 ceremony where Jacopo Reale's \"Love at First Sight\" won the Grand Prize. All ten finalists are flown in with two nights of accommodation covered. The exact ceremony date within the September 2-12 window will be announced when finalists are revealed in August 2026."
      },
      {
        q: 'Can a single person submit more than one short film to Reply AIFF 2026?',
        a: "Yes, indirectly. Each team (1-8 members) can submit only one short film, but a single person can join multiple teams and therefore appear on multiple competing entries. If you want to submit three different shorts as the director, you need three different teams — each with its own captain, registration, and team name on aiff.reply.com. You are allowed to be a member of as many teams as you want. The jury evaluates each submission on its own merits regardless of overlapping personnel, so submitting two strong films through two teams roughly doubles your chance of reaching the ten-finalist shortlist."
      }
    ]
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

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `https://aifilmcontests.com/guide/${slug}`,
    author: {
      '@type': 'Organization',
      name: 'AI Film Contests Editorial',
      url: 'https://aifilmcontests.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Film Contests',
      url: 'https://aifilmcontests.com',
    },
    datePublished: guide.datePublished ?? '2026-01-01',
    dateModified: guide.datePublished ?? new Date().toISOString().slice(0, 10),
    mainEntityOfPage: `https://aifilmcontests.com/guide/${slug}`,
  }

  const faqLd = guide.faqs && guide.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  const itemListLd = openContests.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: guide.title,
    itemListElement: openContests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://aifilmcontests.com/contests/${c.id}`,
      name: c.name,
    })),
  } : null

  const otherGuides = OTHER_GUIDES.filter(s => s !== slug).slice(0, 5)

  return (
    <InnerLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}

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

        {/* FAQ */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#f4f4f5',
              marginBottom: 24,
              letterSpacing: '-0.01em',
            }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {guide.faqs.map((f, i) => (
                <div key={i}>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#e4e4e7',
                    marginBottom: 8,
                  }}>
                    {f.q}
                  </h3>
                  <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.7 }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

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
