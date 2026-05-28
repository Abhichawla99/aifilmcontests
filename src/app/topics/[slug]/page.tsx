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

  'ai-film-festivals-with-million-dollar-prizes': {
    title: 'AI Film Festivals With Million-Dollar Prizes: The 2026 List',
    description: 'The five AI film festivals offering $1 million or more in prizes during 2026 — XPRIZE Future Vision ($3.5M), Astana AIFF ($1M), Luma Dream Brief ($1M), Google Gemini Global AI Film Award ($1M), and Runway Hundred Film Fund (up to $1M+). Eligibility, deadlines, judges, and submission strategy.',
    keywords: 'million dollar AI film prize, AI film contest $1 million, biggest AI film festival prizes 2026, XPRIZE Future Vision, Astana AIFF, Luma Dream Brief, Runway Hundred Film Fund',
    body: "Five AI film festivals offer prize pools of $1 million or more in 2026: the Future Vision XPRIZE ($3.5M+), the Astana AI Film Festival ($1M), the Luma AI Dream Brief ($1M), the Google Gemini Global AI Film Award ($1M, now concluded), and the Runway Hundred Film Fund (grants from $5K to $1M+). Each is funded by a different stakeholder in the AI film ecosystem — a non-profit moonshot organization, a national government, two AI tool companies, and a fifth AI tool company through a rolling production fund — and each rewards a different style of work. This page lists every contest with a million-dollar tier, breaks down what they actually pay, names the people who judge them, and explains which one fits which kind of filmmaker.\n\n## Future Vision XPRIZE — $3.5 Million for Optimistic Sci-Fi\n\nThe Future Vision XPRIZE is the single largest AI film prize ever announced. Launched on March 9, 2026 by XPRIZE founder Peter Diamandis in partnership with Google and Range Media Partners, it offers a grand prize of $2.5 million in feature production funding plus a $100,000 cash prize to one filmmaker, alongside $100,000 cash awards to four additional finalists. Per the official rules at futurevisionxprize.com, entrants submit a three-minute short film or trailer and a treatment of no more than twelve pages — including a one-page cover sheet with logline, synopsis, and personal statement. Entry is free, open globally, and the contest accepts live action, animation, AI, or any hybrid approach. The submission window closes August 15, 2026, with finalists named and the winner announced at a live Los Angeles event on September 25, 2026. The thematic ask is unusual and specific: portray AI not as the villain of the future but as the hero of it — what Diamandis calls a modern 'Star Trek' moment. Variety has called the prize 'the largest sci-fi film competition in history,' and the production support package — Range Media's development pipeline plus Google's creative-tech stack — is arguably worth more than the cash. The XPRIZE is the right target for filmmakers who can write to a treatment, think in feature-length scope, and align with a hopeful, technology-positive vision of the future.\n\n## Astana AI Film Festival — $1 Million From Kazakhstan\n\nThe Astana AI Film Festival (AAIFF) is the largest single-jurisdiction AI film prize fund in the world: $1 million in total prize money, organized by the government of Kazakhstan in its capital Astana. According to the Astana Times' April 2026 announcement, the festival opened its global call for submissions in May 2026 and accepts entries through the end of August 2026, with the festival itself taking place in autumn 2026. The format is a short film of up to ten minutes, generated using AI tools, uploaded with a project description to the festival's landing platform. Entry is free and open to creators worldwide regardless of country of origin, experience level, or studio affiliation. The festival program goes beyond the competition: an AI content conference, pitch sessions for creators and producers, and curated screenings. Astana is the right target for international filmmakers who want a flagship festival run on a fresh, well-funded circuit without the gatekeeping of older film institutions. The $1 million total fund is split across categories, so winning isn't a single-shot moonshot — there are multiple awards to compete for. Because this is the inaugural edition, jury composition and historical winning patterns don't yet exist; entries will be judged on their merits without a long bias track-record to game.\n\n## Luma AI Dream Brief — $1 Million for a Cannes Gold Lion\n\nThe Luma Dream Brief, announced in February 2026, offers $1 million to the team that wins a 2026 Cannes Lions Gold Lion using Luma AI. Developed by Luma in collaboration with experiential creative agency DE-YAN, the brief challenges creatives to use Luma's platform to produce a fully-realized commercial for a Luma-branded product. Submissions closed March 22, 2026, but the prize itself is decided by results at the Cannes Lions festival in June 2026 — meaning the work is still in the field, still being assessed, and the $1 million has not yet been paid out at the time of writing. Entries had to be at least 70% AI-generated using Luma AI, at least ten seconds long, and built around Luma-branded creative. Selected finalists receive paid media support to ensure the work runs publicly within the eligibility period. The jury is unusually star-heavy for an AI tool competition: leaders from Nike, HBO Max, Wieden+Kennedy, Chili's, and Boston Beer, plus Simpsons writer Bill Oakley and Old Spice spokesman Isaiah Mustafa. The Dream Brief is shorthand for what serious commercial AI looks like in 2026: not a hobbyist contest, but a brief written by an AI company to convince the advertising establishment that Luma can hit Gold Lion craft. Filmmakers who treat this prize as a creative-direction challenge (rather than a tool-demo) are the ones who win it.\n\n## Google Gemini Global AI Film Award — $1 Million (Concluded)\n\nThe Google Gemini Global AI Film Award was a $1 million grand-prize competition run as part of the 1 Billion Followers Summit and tied to Google's Gemini and Veo lineage of AI tools. Its submission window closed in December 2025; the award is included on this list because it remains the only AI film prize to have actually paid out $1 million in cash to a single winner during the current cycle. The contest required films generated primarily with Google's AI tools (the Veo family and Gemini), and was used by Google as a signature marketing moment to credential Veo against Runway and Sora. Submissions are no longer open, but the award is relevant for two reasons: first, it sets the precedent that AI tool companies are now willing to write seven-figure checks to filmmakers who use their tools at flagship competitions; and second, watching what won — and how the winning film was made — is the most accurate guide to what large AI tool companies value when they put their own brand on a $1M prize. A reissue of the program is widely expected in late 2026, and filmmakers should monitor the 1 Billion Followers Summit announcements.\n\n## Runway Hundred Film Fund — $5K to $1M+, Rolling\n\nThe Runway Hundred Film Fund is structurally different from the other four entries on this list. It is not a contest with a single deadline and a single grand-prize ceremony — it is a rolling production fund that has committed to producing up to one hundred AI-augmented films, with individual grants ranging from $5,000 at the low end to more than $1 million at the upper end, plus up to $2 million in Runway platform credits per project. The fund currently holds $5 million in committed capital and Runway has stated publicly it may grow to $10 million. Application decisions are typically made within fourteen days of submission, a turnaround that is unheard of in traditional film grants. Eligibility is broader than most: professional directors, producers, screenwriters, and creative professionals can apply, and every format qualifies — features, shorts, documentaries, experimental projects, and music videos. The advisory panel includes Tribeca Festival founder Jane Rosenthal, Company 3 founder Stefan Sonnenfeld, will.i.am, NVIDIA VP Richard Kerris, and TV Academy governor Christina Lee Storm. For filmmakers with a developed treatment and a clear AI-augmented production plan, the Hundred Film Fund is the highest-EV target on this list because it can be approached at any time, it does not require a competition win to receive money, and the upper end of the grant range matches a full feature-film budget.\n\n## Comparing the Five: Which Million-Dollar Prize Is Right for You\n\nThe five million-dollar tiers serve different filmmakers. The XPRIZE rewards writers who can develop a feature treatment around an optimistic AI premise and present a three-minute taste — it is the target for sci-fi-leaning, narrative-feature-track filmmakers. The Astana AIFF rewards short-form AI cinema of any genre and is the right call for filmmakers who already have or can rapidly produce a ten-minute AI short and who want a flagship festival win on their résumé. The Luma Dream Brief rewards commercial-craft creatives operating at agency level, where Cannes Lions Gold is a realistic outcome; it is the wrong target for narrative filmmakers and the right target for senior creative directors at AI-native production studios. The Google Gemini Award (when it returns) will reward tool-specific virtuosity with Veo and Gemini. The Runway Hundred Film Fund rewards developed projects with a clear AI production plan and is the right target for filmmakers who have a treatment they want to actually produce, rather than a finished film they want to enter.\n\n## Eligibility, Tools, and Submission Materials\n\nThe million-dollar contests have surprisingly little overlap in their eligibility requirements. XPRIZE accepts any production approach including pure live-action — AI is allowed, not required. Astana requires AI-generated work and caps duration at ten minutes. Luma's Dream Brief required 70% Luma-AI generation and a Luma-branded commercial focus. Google Gemini required predominant use of Google's tool family. Runway's Hundred Fund accepts any AI-augmented production plan but explicitly favors projects using Runway tools. None of these prizes charge entry fees, and all five are open to international filmmakers. Submission materials diverge: XPRIZE wants a treatment plus short film, Astana wants a film plus project description, Luma wanted a fully-finished commercial, Google wanted a finished film, and Runway wants a treatment plus production plan plus director's reel.\n\n## Strategic Submission Planning for 2026\n\nA filmmaker who wants to seriously compete for million-dollar AI film money in 2026 should think of these five prizes as a portfolio, not a lottery. The Astana deadline (August 31, 2026) and the XPRIZE deadline (August 15, 2026) are two weeks apart — close enough that the same film, recut, can target both if the work is short-form and thematically aligned. The Luma Dream Brief is past for 2026 but will likely return; commercial-track creatives should already be drafting concepts. The Runway Hundred Film Fund can be applied to immediately and again later in the year if rejected. The Google Gemini reissue is expected in late 2026. The strategically best position is to have one finished short ready by August (for Astana and the AI International Film Festival route), one treatment ready (for XPRIZE), and one project pitch (for the Hundred Film Fund). According to Fortune's March 2026 coverage of the XPRIZE launch, billionaire Peter Diamandis framed the prize as a deliberate counter to AI doom narratives — meaning the strongest XPRIZE submissions will lean into agency-positive, problem-solving futures rather than dystopia. According to Variety's coverage of the Runway fund, the strongest Hundred Fund applications come from filmmakers with a clear directorial voice already evident in prior work.\n\n## Beyond the Million-Dollar Tier\n\nWhile $1 million is the headline number, several adjacent contests pay near-million sums and deserve mention: the Runway AI Film Festival has a $135,000+ total prize pool with a $20,000 Grand Prix, the World AI Film Festival (WAIFF) carries €20,000+ in total awards judged by a jury that has included Gong Li, and the Reply AI Film Festival distributes €30,000+ in cash. The Curious Refuge Animation Awards offer up to $10,000 plus a development deal. For filmmakers whose work doesn't fit the specific eligibility of the million-dollar prizes — for example, a narrative short that's neither sci-fi nor commercial — these mid-tier festivals are higher-probability targets with prize pools that still pay rent. The complete circuit, ranked by prize size and updated daily, is what aifilmcontests.com tracks.",
    relatedTools: ['runway', 'luma', 'sora'],
    relatedCategories: ['short-film', 'feature', 'experimental', 'commercial'],
    ruminatex: false,
  },
  'best-ai-film-festivals-for-sora-users': {
    title: 'Best AI Film Festivals That Accept Sora Submissions in 2026',
    description: 'The definitive list of AI film festivals that accept OpenAI Sora and Sora 2 work in 2026 — prizes, deadlines, disclosure rules, and which festivals reward Sora aesthetics. Cited from live contest data.',
    keywords: 'AI film festivals that accept Sora, Sora film contests 2026, OpenAI Sora festival submissions, where to submit Sora film, Sora 2 video competitions, Sora short film festival',
    body: 'OpenAI Sora and Sora 2 films are eligible for nearly every major AI film festival running in 2026, including the $1 million Astana AI Film Festival, the $3.5 million Future Vision XPRIZE, the €30,000+ Reply AI Film Festival in Venice, the Runway AI Festival, the AI Artist Festival, BAIFF Burano, AIFFI, IFFI Goa AI Film Festival, Silicon Valley AIFF at the Dolby Theatre, and the Austin AI Film Festival. Of the 36 currently open AI film contests tracked in our live database, 32 explicitly accept Sora or any AI tool. The catch is in the fine print: each festival has its own disclosure rules, percentage-of-AI thresholds, audio requirements, and human-in-the-loop tests that determine whether your Sora short actually scores.\n\nThis guide is built for the filmmaker holding a Sora 2 clip and a Sora API key. It is sorted by prize size, lists the eligibility nuance for each, and tells you where Sora aesthetics tend to win versus where they get marked down. Every contest cited here comes from our live database, which is rebuilt nightly from organizer announcements and filmmaker community feedback.\n\n## What counts as a Sora-eligible festival in 2026\n\nA Sora-eligible festival is any AI film contest whose rules either (a) name Sora in an accepted-tools list, (b) say "any AI tools," "any generative video model," or "any AI software," or (c) require a minimum AI-generated percentage that Sora can satisfy on its own. Almost no festival in 2026 excludes Sora specifically — the only structural exclusions in the wild are tool-specific contests like the Google Gemini Global AI Film Award (now concluded) and Luma\'s Dream Brief, both of which are walled gardens for their host platform. Sora\'s competitive advantage at festivals comes from three traits OpenAI shipped with Sora 2 in 2026: 25-second clips with synchronized dialogue and ambient audio, the Character Cameos feature for consistent characters across shots, and an upgraded physics engine that judges read as "cinematic" rather than "AI-looking." The Sora 2 Pro tier extends this further with longer-form generation, the model OpenAI itself describes as a leap in controllability.\n\nTwo practical constraints to know going in. First, every Sora video carries C2PA provenance metadata and a visible watermark by default — festivals generally allow you to remove the watermark for a final submission cut, but they expect you to disclose Sora in your director\'s statement. Second, the OpenAI consumer Sora app was wound down to focus the team on the API, so production-grade work now flows through the Sora 2 Video API that OpenAI opened to all developers earlier in 2026 — programmatic generation is officially the path.\n\n## The $3.5M Future Vision XPRIZE — Sora-eligible, deadline August 15, 2026\n\nThe Future Vision XPRIZE is the largest film prize in the world that explicitly welcomes AI tools. Backed by Google and Range Media Partners with a $3.5 million pool, it asks filmmakers worldwide to submit a three-minute short or trailer plus a twelve-page treatment depicting an optimistic, technology-enabled future. Per XPRIZE\'s official rules, "creators may use any production tools, including live action, animation, AI, or hybrid approaches," which makes Sora 2 fair game for the entire film if you can keep it within the three-minute runtime. The structural rule to watch: founder Peter Diamandis has stated the films must remain human-driven — "we\'re not looking for an AI to write a script and an AI to make a film without a human in the loop" — so a Sora submission needs a credible written treatment, named director, and clear authorial intent. Grand prize is $2.5 million in production funding plus $100,000 cash to develop the short into a feature, with four runner-up finalists each receiving $100,000. Judges include Astro Teller (Google X), Cathie Wood (ARK Invest), Rod Roddenberry (Roddenberry Foundation), and XPRIZE CEO Anousheh Ansari. Finalists pitch live at the Moonshot Gathering in Los Angeles on September 25, 2026. Sora 2\'s strength on sci-fi-adjacent worldbuilding and its 25-second clip ceiling map well to a three-minute structured short.\n\n## The $1M Astana AI Film Festival — Sora-eligible, deadline August 31, 2026\n\nAstana AI Film Festival is Kazakhstan\'s inaugural international AI festival and carries a $1 million total prize fund — one of the largest cash pools in AI cinema. According to the Astana Times announcement, the competition is open to any filmmaker worldwide regardless of experience or access to professional studios, and submissions are AI-generated short films of up to ten minutes uploaded to the festival platform with a project description. Entry is free. The rules do not restrict tool choice, which makes Sora and Sora 2 fully eligible — particularly competitive because Sora\'s audio-synced output reduces the post-production load on solo filmmakers competing against agency-backed entries. The festival event is scheduled for autumn 2026 in Astana, with applications open from May through end of August. For a Sora filmmaker, Astana is the highest expected-value contest of the year by prize per submission: a $1M pool against an applicant field still small enough that high-craft Sora work can rank.\n\n## The €30,000+ Reply AI Film Festival — Sora-eligible, deadline June 1, 2026\n\nReply AI Film Festival is the European flagship and the closest the AI film world has to a Venice Film Festival counterpart. Its 2026 edition closes June 1 and hosts its premiere event September 2 through 12 at Lido di Venezia, parallel to the 83rd Venice International Film Festival proper. The prize structure pays €8,000 for first place, €5,000 for second, and €2,000 for third, plus a Production Excellence Award, a Lexus Visionary Award, an AI for Good Award co-developed with the International Telecommunication Union, and a Best Use of AI in Filmmaking prize — total pool exceeds €30,000. Per Reply\'s official FAQ, films should incorporate AI-powered tools in the creation process but are explicitly not required to be 100% AI-generated, which makes Sora-plus-live-action hybrids legal. Director Gabriele Muccino chairs the 2026 jury. Reply is the right festival for narratively confident Sora work that uses generative video as part of a larger production, not the only ingredient. Entry is free.\n\n## The Runway AI Film Festival accepts Sora work too — deadline cycle February to April\n\nAlthough the Runway AI Festival is sponsored and named by a competing platform, its rules accept any AI tools. The 2026 entry window ran January 28 to April 27, with ten winning teams or individual entrants announced on or about April 30, finalists screened at gala events in New York and Los Angeles, and selected work shown at partner festivals worldwide. The 2027 edition will open in early 2027 on the same cycle; if you have Sora work right now, your path is to begin a 12-month festival run targeting 2027 Runway AIF in addition to nearer-deadline contests. Runway\'s jury and curators have historically rewarded craft over tool brand — past selections have included films made with mixed pipelines — so Sora submissions are competitive on their own merits.\n\n## AI Artist Festival 5th Season — Sora listed explicitly, deadline June 30, 2026\n\nAI Artist Festival is the rare 2026 contest that names Sora in its accepted-tools list alongside Midjourney, Runway, Kling, Pika, Stable Diffusion, ComfyUI, Luma, and PixVerse. Open globally to filmmakers 18 and over, the rules require fully AI or hybrid AI-plus-live-action films completed between January 1, 2025 and June 1, 2026. Categories cover short film, animation, documentary, experimental, music video, and commercial work. Prizes are festival laurels and community recognition rather than large cash awards, which makes this a credibility-building contest — useful if your Sora portfolio needs official-selection laurels before you submit to Astana or XPRIZE. Sora 2\'s anime and stylized capabilities give it an edge in the experimental and music video tracks.\n\n## BAIFF Burano Artificial Intelligence Film Festival — deadline July 1, 2026\n\nBAIFF, the Burano Artificial Intelligence Film Festival held in Venice, Italy, explicitly lists Sora alongside Runway, Kling, Veo, Midjourney, Higgsfield, Luma, and any AI tool. Open to filmmakers 18 and older worldwide, the rules require films at least 25% AI-generated and completed between January 1, 2025 and June 1, 2026. Jury, honorary, and category awards include both cash prizes and screening slots. The Burano edition has built a curatorial reputation for rewarding atmosphere and visual specificity over technical novelty — Sora 2\'s photoreal lighting and motion stability play well here. A separate 4th edition fourth-cycle BAIFF closes June 15, 2026 for short films, music video, documentary, animation, and experimental — also any-tool-accepted with a 25% minimum AI threshold.\n\n## AIFFI International Festival for AI-Generated Short Films — deadline May 31, 2026\n\nAIFFI is closing imminently — May 31, 2026 — and accepts any AI tools, making it the most time-sensitive Sora-eligible contest in this guide. The prize pool is over $10,000 USD in awards, the category is short film, and the entry fee varies by category. AIFFI is run by an established organizer with festival programming in the AI short film space and has built credibility through selectivity. If you have a finished Sora short, this is the deadline to hit.\n\n## Silicon Valley AI Film Festival (SVAIFF) Awards — Dolby Theatre, deadline August 31, 2026\n\nSVAIFF is a US-focused AI festival that culminates in screenings at the Dolby Theatre in Hollywood. It accepts any AI tools across short film, narrative, experimental, and advertising categories. The prize is festival selection plus Dolby Theatre screening plus industry exposure — not large cash, but the venue is unique in AI film: there is no other contest that puts a Sora short on the Dolby Theatre screen. For a US filmmaker building credentials in the entertainment industry, SVAIFF has structural value beyond the prize.\n\n## Other open Sora-eligible contests closing in 2026\n\nBeyond the headline festivals, our live database lists 25 additional open contests in 2026 that accept Sora as part of any-AI-tool rules. The most notable are Austin AI Film Festival (deadline August 15, 2026 — second annual edition, cash prizes plus festival screening), Artificial Intelligence Media Festival (AIMF, deadline August 15, 2026 — 501c3-run with LA screening, includes a student track), IFFI Goa AI Film Festival 2026 (deadline August 31, 2026 — operated by India\'s National Film Development Corporation Ministry of Information and Broadcasting with WAVES Film Bazaar and LTIMindtree, free submission via FilmFreeway, includes a Cinema AI Hackathon track), Seoul Design AI Film Festival (deadline June 30, 2026 — KRW 24 million prize plus DDP Facade screening, free entry), OMNI 1.5 HYPERPHANTASIA in Sydney (deadline June 9, 2026 — Sydney\'s first cash-prize AI film festival across eight-plus categories), Gyeongsangbuk-do International AI/Metaverse Film Festival (GAMFF, deadline June 30, 2026 — cash prizes plus festival selection), AI for the Future Festival HLPF Edition (deadline July 1, 2026 — selections screen at the United Nations HLPF event in NYC), Bochnia International AI Film Festival in Poland (deadline August 15, 2026 — $2,500 USD cash pool), BLACK AI FEST (deadline July 15, 2026 — 21-category academy awards format), AI.motion at IULM Milan (deadline August 31, 2026 — RAI Cinema Channel Prize plus PROMPT Magazine Prize, free entry), Sparknify Human vs. AI Film Festival (deadline August 31, 2026 — $3,000 Humanity Award plus expanding entry-fee-funded pool), AIGC for Future Global Challenge (deadline August 31, 2026 — $10,000 total pool), and the AI ZONE International AI Film Festival (deadline September 30, 2026 — cash award for Best AI Mini Movie).\n\n## How to position a Sora film for selection\n\nThree practical positioning notes for Sora 2 filmmakers. First, lead the director\'s statement with intent — what your film argues, who directed it, what creative decisions you made about prompt selection, edit, and sound — because programmers read these looking for evidence of authorial choice rather than tool novelty. Second, name Sora 2 explicitly in your tech credits along with any other tools (editing software, voice models, music generation); festivals that require AI disclosure expect specificity, and being vague reads as evasive. Third, treat Sora\'s 25-second clip ceiling as a structural strength: it forces clean shot decisions in three-act shorts and rewards filmmakers who plan in scenes rather than continuous takes. The Sora films that won early Tribeca "Sora Shorts" slots — work by Bonnie Discepolo, Ellie Foumbi, Nikyatu Jusu, Reza Sixo Safai, and Michaela Ternasky-Holland — succeeded because they were treated as directed shorts, not generative experiments. That same standard applies at the 2026 festivals listed in this guide.\n\n## The festivals where Sora does not yet apply\n\nTwo notable exclusions to plan around. The Google Gemini Global AI Film Award required submissions made on Google\'s own Flow / Veo platform — Sora work was not eligible there, and the inaugural cycle has now concluded. Luma AI Dream Brief, the $1 million Cannes Lions-aligned commercial competition, restricts entries to Luma Dream Machine and Ray outputs. Beyond those two platform-walled contests, every other major 2026 AI film prize accepts Sora.\n\n## Bottom line — where to focus this season\n\nIf you have one Sora 2 short ready to submit in the next 90 days, the highest expected-value combination is Astana AIFF for prize size ($1M pool, free entry, August 31 deadline), Future Vision XPRIZE for prize and prestige ($3.5M pool, free entry, August 15 deadline, requires a treatment), Reply AIFF for European visibility (€30K pool, free entry, June 1 deadline, Venice premiere), and AIFFI for an immediate-deadline domestic win ($10K+ pool, May 31 deadline). Add AI Artist Festival and BAIFF Burano for laurels that strengthen later applications. That is the realistic Sora festival run for the second half of 2026.',
    relatedTools: ['sora', 'runway', 'kling', 'veo'],
    relatedCategories: ['short-film', 'experimental', 'narrative'],
    ruminatex: false,
  },  'best-ai-film-festivals-2026-ranked': {
    title: 'Best AI Film Festivals 2026: The Definitive Ranking',
    description: 'The 20 best AI film festivals of 2026 ranked by prize pool, jury prestige, screening venue, and eligibility — from the $3.5M Future Vision XPRIZE and $1M Astana AIFF down to high-leverage regional contests. Updated from live contest data.',
    keywords: 'best AI film festivals 2026, top AI film festivals 2026, AI film festival rankings, most prestigious AI film festival, AI film contest list 2026, AI film festival circuit',
    body: "The best AI film festivals of 2026 are the Future Vision XPRIZE ($3.5 million pool), the Astana AI Film Festival ($1 million pool), the Luma AI Dream Brief ($1 million Cannes Lions prize), the Runway AI Film Festival at Lincoln Center, the Reply AI Film Festival in Venice, the World AI Film Festival in Cannes, the Kling NextGen Creative Contest, BAIFF Burano, the AI Artist Festival in Beijing, and the Silicon Valley AI Film Festival at the Dolby Theatre. This ranking is built from live contest data updated daily on aifilmcontests.com, cross-checked against organizer announcements and recent industry coverage in Variety, Deadline, Screen Daily, and Fortune. It is not a vanity list — it is the order in which a serious AI filmmaker should consider where to submit work in the second half of 2026.\n\nAI film festivals matured into a real industry circuit in 2026. The total publicly-announced prize pool across the top twenty contests now exceeds $7 million, and the venues have moved from rented hotel ballrooms to Alice Tully Hall at Lincoln Center, the Dolby Theatre in Hollywood, the Palais des Festivals in Cannes, and the Hotel Excelsior on the Venice Lido. Submissions to flagship contests have scaled accordingly: the Kling AI NextGen Creative Contest alone received over 4,600 entries from creators in 122 countries in its most recent edition, and the Runway AI Film Festival drew roughly 6,000 entries in 2025 before expanding into five additional disciplines for 2026.\n\n## How We Ranked the 2026 AI Film Festivals\n\nFour factors decide the order. Prize pool is the heaviest weight at the top of the list because seven-figure money structurally changes who shows up — and the five contests with $1 million or more in publicly committed prizes are a different category from everything else. Jury prestige is the second factor, measured by the recognizability of the named jury members and the quality of the institutions they represent. Screening venue is the third factor, because a Lincoln Center or Dolby Theatre or Cannes premiere creates industry follow-on that a YouTube screening cannot. Eligibility breadth is the fourth factor: festivals that are free to enter, open globally, and accept any AI tool (not just one vendor) score higher because they create the most competitive fields and the most legitimate wins. A fifth, lighter factor is production-deal upside — festivals that include feature development, theatrical distribution, or platform credits as prizes get a bump because the actual career value often exceeds the cash component.\n\n## Tier 1 — The Five Million-Dollar Festivals\n\nThe five biggest prize pools of 2026 are not interchangeable. Each rewards a different kind of filmmaker, and a serious submitter should treat them as a portfolio rather than a lottery.\n\nFuture Vision XPRIZE leads the entire ranking with a $3.5 million total prize pool — the largest in AI film history. Launched March 9, 2026 by XPRIZE founder Peter Diamandis with backing from Google and Range Media Partners, the contest asks for a three-minute short film or trailer plus a twelve-page treatment depicting an optimistic, technology-enabled future. Submissions close August 15, 2026 and are free worldwide. The grand prize is $2.5 million in feature production funding plus a $100,000 cash prize, with four additional finalists each receiving $100,000. Judges include Astro Teller of Google X, Cathie Wood of ARK Invest, Rod Roddenberry of the Roddenberry Foundation, and XPRIZE CEO Anousheh Ansari. Finalists pitch live at the Moonshot Gathering in Los Angeles on September 25, 2026. Variety called it the largest sci-fi film competition in history.\n\nAstana AI Film Festival (AAIFF) is the second-largest with a $1 million total prize fund — the biggest single-jurisdiction AI film prize in the world. Per the Astana Times announcement, AAIFF accepts short films up to ten minutes generated using AI tools, uploaded with a project description and a single YouTube link. The submission window runs May 25 through August 15, 2026 and is free for the inaugural edition. The 2026 theme is The Future Worth Living In and the festival itself runs October 26 through November 1, 2026 in Kazakhstan's capital, Astana. Unlike single-winner mega-prizes, the $1 million pool is distributed across multiple awards, which both lowers the variance for submitters and broadens the recognized field. Kazakhstan's national tourism push and the absence of a long jury-bias track-record make this the highest expected-value contest of the year for international filmmakers.\n\nLuma AI Dream Brief is the commercial-craft entry on the million-dollar tier — $1 million to the team whose Luma-AI-generated commercial wins a 2026 Cannes Lions Gold Lion. Announced February 2, 2026 in partnership with experiential agency DE-YAN, the brief required at least 70% Luma-AI generation and a Luma-branded product focus, with submissions closing March 22, 2026. The winner is determined by results at Cannes Lions in June 2026 — meaning the contest is decided by an external festival jury, not Luma itself. Finalists receive paid media support to run the work publicly. The 18-person evaluation jury includes leaders from Nike, HBO Max, Wieden+Kennedy, Chili's, and Boston Beer, plus Simpsons writer Bill Oakley and Old Spice spokesman Isaiah Mustafa. This is the right contest for senior creative directors operating at advertising-agency level, not narrative short filmmakers.\n\nGoogle Gemini Global AI Film Award awarded $1 million for its inaugural cycle as part of the 1 Billion Followers Summit. Submissions closed December 2025; the award is included on this ranking because it remains the only AI film prize to have actually paid out $1 million in cash to a single winner during the current cycle and is widely expected to return in late 2026. The contest required films made primarily with Google's Veo and Gemini tools.\n\nRunway Hundred Film Fund rounds out Tier 1 as a structurally different vehicle. It is a rolling production fund — not a fixed-deadline contest — that has committed up to $5 million in capital to produce roughly one hundred AI-augmented films, with individual grants from $5,000 at the low end to more than $1 million at the upper end plus up to $2 million in Runway platform credits per project. Decisions ship within fourteen days of submission, which is unheard of in traditional film grants. The advisory panel includes Tribeca Festival founder Jane Rosenthal, Company 3's Stefan Sonnenfeld, will.i.am, NVIDIA VP Richard Kerris, and TV Academy governor Christina Lee Storm. Filmmakers with a developed treatment and a clear AI-augmented production plan should treat the Hundred Film Fund as the always-open backup to dated contests.\n\n## Tier 2 — Major Flagships With Prestige and Craft\n\nBelow the million-dollar tier sit five festivals that punch above their cash weight on jury caliber, screening venue, or industry coverage.\n\nRunway AI Film Festival 2026 — the New York and Los Angeles flagship — pays $15,000 to the first-place filmmaker plus $10,000 to each winner across five new categories Runway added for 2026 (Design, New Media, Fashion, Advertising, Gaming), all on top of significant Runway platform credits. The NYC edition screens at Alice Tully Hall at Lincoln Center, the same hall that hosts the New York Film Festival each fall, and the LA edition runs at The Broad Stage. Submission ran January 28 through April 27, 2026 with ten film-category winners announced on or around April 30, 2026. Per Deadline's January coverage, Runway is positioning AIF as a multi-discipline creative festival rather than a film-only competition, which raises both the prestige and the competition for selection.\n\nReply AI Film Festival is the European flagship and the AI world's nearest counterpart to a Venice-tier prestige event. The 2026 edition closes June 1 and hosts its premiere September 2 through 12 at Lido di Venezia, parallel to the 83rd Venice International Film Festival. Prizes pay €8,000 for first place, €5,000 for second, €2,000 for third, plus a Production Excellence Award, a Lexus Visionary Award, an AI for Good Award co-developed with the International Telecommunication Union, and a Best Use of AI in Filmmaking prize — total pool exceeds €30,000. Per Deadline's coverage of the 2025 cycle, director Gabriele Muccino chairs the jury, joined by Rob Minkoff, Dave Clark, Charlie Fink, Caroline Ingeborn, and Reply CTO Filippo Rizzante among others. Entry is free.\n\nWorld AI Film Festival (WAIFF) Cannes pulls the highest celebrity-jury wattage of any AI festival. The 2026 edition ran April 21 through 22 at the Palais des Festivals, the same venue that hosts the Cannes Film Festival in May. Gong Li serves as 2026 Festival President; Claude Lelouch as Jury President; Agnès Jaoui led the awards panel. Total prizes exceed €20,000 with a €10,000 Grand Prix. The WAIFF 2026 program added a Road to Cannes regional qualifier circuit that feeds finalists into the main competition. For filmmakers building a European résumé, a WAIFF official selection carries name-recognition weight that few other 2026 festivals match.\n\nKling AI NextGen Creative Contest is the largest open-call AI film contest by submission volume — 4,600 entries from 122 countries in the most recent cycle, with a $42,000 cash prize pool plus 1.25 million Kling AI credits. The Awards Ceremony and Screening was held October 29 at a Tokyo cinema; the 2026 Grand Prix winner Cao Yizhe's film Alzheimer was reported by Variety alongside coverage of Oscar-winning art director Tim Yip's keynote on human direction in AI filmmaking. The structural advantage of NextGen is reach — Kling pushes finalist work through partner festivals globally — which compounds the resume value of a finalist slot.\n\nSilicon Valley AI Film Festival (SVAIFF) is the US industry-network play. The inaugural edition ran January 10 through 11, 2026 in Silicon Valley, and the 2026 Awards Ceremony is scheduled for October at the Dolby Theatre in Hollywood — the same venue that hosts the Academy Awards. Categories span short film, narrative, experimental, and advertising, all accepting any AI tool. The prize is not large cash; the value is the Dolby Theatre screening and the proximity to Bay Area technology investors and Los Angeles entertainment executives in the same week.\n\n## Tier 3 — High-Leverage Regional and Category Festivals\n\nTier 3 contains contests that win on a single dimension — geography, category specialization, or curatorial reputation — and that often pay better expected value per submission than Tier 2 because the fields are smaller.\n\nBAIFF Burano Artificial Intelligence Film Festival in Venice has built a curatorial reputation for rewarding atmosphere and visual specificity. The 4th edition closes June 15, 2026, with the next BAIFF cycle closing July 1, 2026 — both accepting work that is at least 25% AI-generated and any tool (Sora, Runway, Kling, Veo, Midjourney, Higgsfield, Luma). AI Artist Festival 5th Season runs June 27 through 28, 2026 at UCCA 798 in Beijing's Chaoyang district, with submission deadline June 30, 2026 and explicit acceptance of Sora, Midjourney, Runway, Kling, Pika, Stable Diffusion, ChatGPT, Luma, and ComfyUI work. AIFFI International Festival for AI-Generated Short Films closes May 31, 2026 with over $10,000 USD in awards — the most immediate deadline in this list. IFFI Goa AI Film Festival 2026, operated by India's National Film Development Corporation through Ministry of Information and Broadcasting alongside WAVES Film Bazaar and LTIMindtree, closes August 31, 2026, includes a Cinema AI Hackathon track, and is free to submit via FilmFreeway. Seoul Design AI Film Festival pays KRW 24 million (~$18,000) plus a DDP Facade screening for free entries closing June 30, 2026.\n\n## Specialty and Mission-Driven Festivals\n\nA handful of festivals win on mission rather than money. AI for the Future Festival HLPF Edition selects films that screen at the United Nations High-Level Political Forum in New York; the submission deadline is July 1, 2026. AI for Good Film Festival, run by the International Telecommunication Union, premieres finalists at Cinema du Grutli in Geneva during the AI for Good Global Summit and is the right call for documentary and social-impact work. Curious Refuge's 2026 Feel Good AI Film Competition pays $10,000 in cash prizes, and Curious Refuge's AI Animation Competition (run with Promise Studios) pays up to $10,000 plus a real-world development deal — the only animation-specific AI contest with a pitched development outcome. Frame Forward Animated AI Film Festival, run by Modern Uprising Studios and Screenvision Media, places winners on Screenvision's 14,000-screen Front + Center theatrical network across 2,300 US theaters. MetaMorph AI Award 2026 is the UK's flagship and judged by John Rhys-Davies, David Nutter, and Timbaland's Stage Zero team. AI International Film Festival (AIIFF) is included on every credible list because it was the world's first AI film festival, founded in 2021, and has scaled into monthly Hollywood screening events.\n\n## Where to Focus by Filmmaker Profile\n\nA narrative short filmmaker with a finished AI piece in hand should target Astana AIFF (deadline August 15, 2026), Future Vision XPRIZE (August 15, 2026, treatment-driven), Reply AIFF for Venice visibility (closed June 1, 2026 — plan for 2027), and AIFFI for the immediate-deadline win (May 31, 2026). A commercial creative operating at agency level should target the Luma Dream Brief reissue when announced, Reply AIFF's Lexus Visionary and AI for Good tracks, and the commercial categories at Runway AIF 2027. An animation specialist should target Frame Forward (Screenvision theatrical run), the Curious Refuge AI Animation Competition (development deal), the AI Artist Festival animation category, and BAIFF Burano. A documentary or social-impact filmmaker should target AI for Good Film Festival, AI for the Future HLPF and UNGA editions, and Reply's AI for Good Award. A first-time AI filmmaker building laurels should stack AI Artist Festival, BAIFF Burano, AIFFI, and IAIFA before submitting to the Tier 1 prizes.\n\n## What This Ranking Will Not Tell You\n\nTwo deliberate omissions. We do not rank by submission popularity or social-media buzz, because those metrics correlate with marketing budget rather than career value. We also exclude tool-locked single-vendor contests (the Google Gemini Award when restricted to Veo, the Luma Dream Brief when restricted to Luma) from the general competitive ranking — they appear in Tier 1 for prize size but they are not options for filmmakers without the specific tool stack. The full live calendar of every open AI film contest, updated daily from organizer announcements, is what this site exists to maintain. Bookmark the homepage and the monthly deadline guides for the closing-soon view, and use this ranking when you are deciding where to invest your strongest piece of work.",
    relatedTools: ['runway', 'sora', 'kling', 'luma'],
    relatedCategories: ['short-film', 'animation', 'experimental', 'commercial'],
    ruminatex: false,
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

  const pageUrl = `https://aifilmcontests.com/topics/${slug}`
  const nowIso = new Date().toISOString()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: { '@type': 'Organization', name: 'AI Film Contests', url: 'https://aifilmcontests.com' },
    publisher: {
      '@type': 'Organization',
      name: 'AI Film Contests',
      url: 'https://aifilmcontests.com',
      logo: { '@type': 'ImageObject', url: 'https://aifilmcontests.com/logo.png' },
    },
    datePublished: nowIso,
    dateModified: nowIso,
    keywords: topic.keywords,
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: topic.title,
    description: topic.description,
    url: pageUrl,
    numberOfItems: openContests.length,
    itemListElement: openContests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://aifilmcontests.com/contests/${c.id}`,
    })),
  }

  // Topic-specific FAQs (extendable per page). Default falls back to a generic FAQ.
  const FAQS_BY_SLUG: Record<string, { q: string; a: string }[]> = {
    'ai-film-festivals-with-million-dollar-prizes': [
      {
        q: 'Which AI film festival has the biggest prize in 2026?',
        a: 'The Future Vision XPRIZE has the single largest AI film prize pool in 2026 at over $3.5 million. The grand prize is $2.5 million in feature production funding plus a $100,000 cash prize, with four additional $100,000 finalist awards. Submissions close August 15, 2026 and the winner is announced at a live Los Angeles event on September 25, 2026.',
      },
      {
        q: 'How many AI film festivals offer a $1 million prize in 2026?',
        a: 'Five: the Future Vision XPRIZE ($3.5M total), the Astana AI Film Festival ($1M total prize fund), the Luma AI Dream Brief ($1M for a Cannes Lions Gold winner), the Google Gemini Global AI Film Award ($1M grand prize, now concluded for the 2025 cycle), and the Runway Hundred Film Fund (grants from $5K to $1M+ per project).',
      },
      {
        q: 'How do I submit to the Astana AI Film Festival?',
        a: 'The Astana AI Film Festival accepts AI-generated short films up to ten minutes in length. Filmmakers upload the film and a project description to the festival landing platform between May and the end of August 2026. Entry is free, open globally, and the festival itself takes place in autumn 2026 in Astana, Kazakhstan.',
      },
      {
        q: 'Is the Future Vision XPRIZE free to enter?',
        a: 'Yes. The Future Vision XPRIZE is free to enter and open globally. Submissions require a three-minute short film or trailer plus a treatment of up to twelve pages with a one-page cover sheet containing a logline, synopsis, and personal statement. The competition accepts live action, animation, AI, or any hybrid production approach.',
      },
      {
        q: 'When does the Luma Dream Brief pay out the $1 million?',
        a: 'The $1 million Luma Dream Brief grand prize is decided by results at the Cannes Lions festival in June 2026. Submissions closed March 22, 2026; finalists receive paid media support to run the work publicly. The prize is awarded to the team whose Luma-AI-generated commercial wins a 2026 Cannes Lions Gold Lion.',
      },
      {
        q: 'How does the Runway Hundred Film Fund differ from the other million-dollar prizes?',
        a: 'The Runway Hundred Film Fund is a rolling production fund, not a fixed-deadline contest. Grants range from $5,000 to $1 million+ per project plus up to $2 million in Runway credits. Applications are reviewed within fourteen days, and every format qualifies — features, shorts, documentaries, experimental projects, and music videos.',
      },
      {
        q: 'Which million-dollar AI film prize is best for a first-time filmmaker?',
        a: 'The Astana AI Film Festival is the most accessible for newcomers: free entry, no studio affiliation required, a short-film format capped at ten minutes, and no historical jury bias because it is the inaugural edition. Filmmakers with a finished AI short should target Astana first and use the XPRIZE for a more ambitious treatment-driven submission.',
      },
    ],
    'best-ai-film-festivals-for-sora-users': [
      {
        q: 'Which AI film festivals in 2026 accept Sora films?',
        a: 'Almost every major AI film festival in 2026 accepts Sora and Sora 2 work, including the $1M Astana AI Film Festival (deadline August 31, 2026), the $3.5M Future Vision XPRIZE (August 15, 2026), the €30,000+ Reply AI Film Festival in Venice (June 1, 2026), the Runway AI Festival, AI Artist Festival, BAIFF Burano, AIFFI, IFFI Goa, SVAIFF at the Dolby Theatre, and Austin AIFF. Of 36 open AI film contests tracked in our live database, 32 explicitly accept Sora or any AI tool. The two platform-locked exceptions are Luma Dream Brief (Luma-only) and the now-concluded Google Gemini Global AI Film Award (Flow / Veo only).',
      },
      {
        q: 'Does the Future Vision XPRIZE allow Sora-generated films?',
        a: 'Yes. Per Future Vision XPRIZE official rules, creators may use any production tools including live action, animation, AI, or hybrid approaches, which makes Sora 2 eligible for the entire film. The structural requirement is that the film must remain human-driven — founder Peter Diamandis has explicitly stated that purely AI-generated films without a human in the loop are not the goal. A Sora submission needs a named director, a written 12-page treatment, and clear authorial intent. The submission deadline is August 15, 2026 and the grand prize is $2.5 million in production funding plus $100,000 cash.',
      },
      {
        q: 'Do I have to disclose that my film used Sora when submitting to festivals?',
        a: 'Yes — both for legal reasons and selection reasons. Every Sora video carries C2PA provenance metadata and a visible watermark by default. Most festivals allow watermark removal for the final cut but require AI disclosure in the director\'s statement and tech credits. Be specific: name Sora 2 alongside any other tools used (editing software, voice models, music generation, manual rotoscoping). Programmers read disclosure statements looking for evidence of authorial choice and risk mitigation, and vague disclosure reads as evasive.',
      },
      {
        q: 'What is the largest cash prize for a Sora-eligible AI film festival in 2026?',
        a: 'The Future Vision XPRIZE has the largest prize pool at $3.5 million total, with $2.5 million in production funding plus a $100,000 cash grand prize and four runner-up finalists at $100,000 each. Sora 2 is eligible for the entire production. The Astana AI Film Festival is the next largest at $1 million total prize fund, also Sora-eligible and free to enter. Both close in August 2026.',
      },
      {
        q: 'Can I submit the same Sora film to multiple festivals at the same time?',
        a: 'Generally yes, with two exceptions to check per festival. Most AI festivals accept simultaneous submissions and have no premiere requirement, which is different from traditional film festival circuits. The two situations to watch are festivals that explicitly require world or regional premieres in their rules, and contests like Reply AIFF and Runway AIF where becoming a finalist may include a premiere obligation for the gala screening. Read each festival\'s rules section on premiere status before paying late-tier entry fees, and keep your director\'s statement consistent across applications so the same Sora film is described the same way at every contest.',
      },
      {
        q: 'Are there Sora-specific film festivals run by OpenAI?',
        a: 'Not as a recurring annual festival. OpenAI ran the Sora Shorts initiative in partnership with Tribeca Festival to showcase early Sora work from invited filmmakers including Bonnie Discepolo, Ellie Foumbi, Nikyatu Jusu, Reza Sixo Safai, and Michaela Ternasky-Holland, but Sora Shorts was a curated showcase rather than an open competition. The OpenAI consumer Sora app has been wound down to refocus on the Sora 2 Video API. For competitive submission opportunities, Sora filmmakers compete in the general AI film festival circuit listed above rather than in a tool-walled OpenAI-only contest.',
      },
    ],
    'best-ai-film-festivals-2026-ranked': [
      {
        q: 'What are the best AI film festivals in 2026?',
        a: 'The best AI film festivals of 2026 are the Future Vision XPRIZE ($3.5M prize pool), the Astana AI Film Festival ($1M pool), the Luma AI Dream Brief ($1M Cannes Lions prize), the Runway AI Film Festival at Lincoln Center, the Reply AI Film Festival in Venice, the World AI Film Festival in Cannes, the Kling NextGen Creative Contest, BAIFF Burano, the AI Artist Festival in Beijing, and the Silicon Valley AI Film Festival at the Dolby Theatre. The ranking is built from prize pool, jury prestige, screening venue, and eligibility breadth.',
      },
      {
        q: 'Which AI film festival has the largest prize pool in 2026?',
        a: 'The Future Vision XPRIZE has the largest AI film prize pool of 2026 at over $3.5 million. The grand prize is $2.5 million in feature production funding plus $100,000 cash, with four additional finalists each receiving $100,000. Submissions close August 15, 2026 and the winner is announced live at the Moonshot Gathering in Los Angeles on September 25, 2026. Entry is free and open globally.',
      },
      {
        q: 'How is this ranking different from other AI film festival lists?',
        a: 'This ranking weighs four objective factors — prize pool, jury prestige, screening venue, and eligibility breadth — rather than ranking by social-media popularity or submission volume. The underlying data is pulled live from aifilmcontests.com, which is rebuilt daily from organizer announcements and cross-checked against industry coverage in Variety, Deadline, Screen Daily, and Fortune. Tool-locked single-vendor contests are flagged so filmmakers without the required tool stack can deprioritize them.',
      },
      {
        q: 'Which AI film festivals are free to enter in 2026?',
        a: 'Many of the most prestigious AI film festivals are free to enter in 2026, including the Future Vision XPRIZE, the Astana AI Film Festival, the Reply AI Film Festival, IFFI Goa AI Film Festival 2026, Seoul Design AI Film Festival, AI for the Future Festival HLPF Edition, and AI.motion at IULM Milan. Free entry plus seven-figure prizes is structurally unusual in film and is unique to the 2026 AI festival circuit, where AI tool companies and government tourism authorities are subsidizing the entry economics.',
      },
      {
        q: 'Which AI film festival is the most prestigious to win?',
        a: 'The most prestigious AI film festival win in 2026 depends on the filmmaker profile. The Future Vision XPRIZE wins on cash and Hollywood industry attention. The Runway AI Film Festival wins on venue prestige (Lincoln Center). The World AI Film Festival in Cannes wins on jury prestige (Gong Li, Claude Lelouch, Agnès Jaoui). The Reply AI Film Festival wins on European cinema credibility (Venice premiere, Gabriele Muccino jury chair). The Silicon Valley AI Film Festival wins on US industry-network proximity (Dolby Theatre, Bay Area tech investors). A filmmaker building a circuit run should aim for at least one Tier 1 and one Tier 2 selection.',
      },
      {
        q: 'When do most AI film festival deadlines fall in 2026?',
        a: 'The highest density of AI film festival deadlines in 2026 falls in late August through September, driven by the Astana AIFF (August 15), Future Vision XPRIZE (August 15), IFFI Goa (August 31), AI.motion Milan (August 31), Bochnia (August 15), and Sparknify (August 31). June is the second-densest month with Reply AIFF (June 1), AIFFI (May 31), OMNI HYPERPHANTASIA (June 9), BAIFF 4th edition (June 15), AI Artist Festival (June 30), Seoul Design AI Film Festival (June 30), and GAMFF (June 30). Filmmakers planning a submission run should map deadlines monthly on aifilmcontests.com.',
      },
      {
        q: 'How often is this AI film festival ranking updated?',
        a: 'The underlying contest data on aifilmcontests.com is rebuilt daily from organizer announcements, FilmFreeway listings, and industry coverage. This ranking page is reviewed at least once per quarter when major announcements land (new festival opens, prize pool changes, jury reveals) and whenever a Tier 1 or Tier 2 festival closes its submission window. The shipped order reflects the state of the circuit as of late May 2026.',
      },
    ],
  }

  const faqs = FAQS_BY_SLUG[slug] || []

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  const jsonLd = [articleSchema, itemListSchema, faqSchema].filter(Boolean)

  return (
    <InnerLayout>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

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
          {topic.body.split('\n\n').map((block, i) => {
            const trimmed = block.trim()
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={i} style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: '#f4f4f5',
                  marginTop: 28,
                  marginBottom: 12,
                  maxWidth: 720,
                }}>{trimmed.slice(3)}</h2>
              )
            }
            return (
              <p key={i} style={{ fontSize: 16, color: '#71717a', lineHeight: 1.75, maxWidth: 720, marginBottom: 16 }}>
                {trimmed}
              </p>
            )
          })}
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

        {/* FAQ section (visible to readers, mirrors FAQPage JSON-LD) */}
        {faqs.length > 0 && (
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
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {faqs.map((f, i) => (
                <div key={i} style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: 18,
                }}>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#f4f4f5',
                    marginBottom: 8,
                  }}>{f.q}</h3>
                  <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, maxWidth: 720 }}>{f.a}</p>
                </div>
              ))}
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
