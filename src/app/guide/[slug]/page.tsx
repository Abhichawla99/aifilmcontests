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
  'ai-film-festivals-deadlines-july-2026': {
    "title": "AI Film Festival Deadlines in July 2026: Every Contest Closing Next Month",
    "description": "Seven AI film contests close in July 2026: BAIFF Burano, Neu Wave AI Film Festival and the AI for the Future HLPF edition on July 1, AIMagica on July 2, Inspiring Asia's $10,000 Best AI Film Award on July 6, BLACK AI FEST on July 15 and Kerala's KIAFF on July 20. Verified deadlines, prizes, fees and eligibility for every one — plus the August 15 monsters right behind them.",
    "keywords": "AI film festival deadlines July 2026, AI film contests closing July, July AI film contests, summer AI film submissions, BAIFF Burano deadline, Neu Wave AI Film Festival, Inspiring Asia Best AI Film Award, KIAFF 2026, BLACK AI FEST, AI film submission July 2026",
    "datePublished": "2026-06-12",
    "intro": "Seven AI film contests tracked in our live database close for submissions in July 2026. Three fall on July 1 alone: BAIFF, the Burano Artificial Intelligence Film Festival in the Venetian lagoon; the Neu Wave AI Film Festival, whose top five projects screen at a Hollywood gala during LA Tech Week; and the AI for the Future Festival's HLPF edition, which screens selections at a United Nations-adjacent event in New York. AIMagica's quarterly window closes July 2, the Inspiring Asia Micro Film Festival's $10,000 Best AI Film Award closes July 6, the UK's BLACK AI FEST closes July 15, and the Kerala International AI Film Festival (KIAFF) closes July 20. Two of the seven — Inspiring Asia and KIAFF — are completely free to enter. Beyond the hard deadlines, two tier dates also land in July: Red Rocks AI Film Festival's late deadline on July 6 and the Berlin AI Film Festival's late tier on July 31. The strategic picture matters as much as the list: July is the staging month before the biggest single deadline date in AI film history, August 15, 2026, when the $1,000,000 Astana AI Film Festival and the $3,500,000-plus Future Vision XPRIZE both close alongside Austin, KCAIF Seoul, AIMF Los Angeles and Bochnia. This guide breaks down every July deadline with verified prizes, fees, runtimes and eligibility, pulled from each festival's official rules and tracked daily on aifilmcontests.com. Every contest listed was open as of June 12, 2026.",
    "sections": [
        {
            "h": "The July 2026 Submission Window at a Glance",
            "body": "July 2026 deadlines cluster into three waves. The first wave is the July 1 triple deadline — BAIFF Burano, Neu Wave and AI for the Future HLPF — followed within days by AIMagica on July 2 and Inspiring Asia on July 6. The second wave is mid-month: BLACK AI FEST on July 15. The third is KIAFF on July 20, the last hard AI-festival deadline of the month in our database, with the Berlin AI Film Festival's July 31 late tier closing out the calendar for filmmakers willing to pay the higher FilmFreeway fee rather than wait for its final December window. The largest confirmed cash prize attached to a July deadline is Inspiring Asia's $10,000 Best AI Film Award, decided at the Manila grand final on October 25. The geographic spread is unusually wide for a single month: Venice, Hollywood, New York's UN circuit, Manila and seven other Asian regional editions, Kent in the UK, and Thiruvananthapuram in India. Tool policy is near-uniform — every festival in this guide accepts work made with any AI toolchain, whether that is Runway Gen-4 and Aleph, Sora, Veo 3.1, Kling, Pika, Luma, MidJourney video or Higgsfield, though Inspiring Asia and BAIFF both require you to disclose exactly which tools you used and how. None of the seven enforces an exclusivity clause, so a single short film of the right length can realistically hit five or more of these deadlines simultaneously. If you only have bandwidth for one submission this month, the decision tree is simple: chase cash at Inspiring Asia, chase industry access at Neu Wave, or chase European festival prestige at BAIFF."
        },
        {
            "h": "BAIFF Burano — July 1 (Venice Lagoon, 4th Edition)",
            "body": "The Burano Artificial Intelligence Film Festival closes its main FilmFreeway submission window on July 1, 2026, with the fourth edition running October 13–17, 2026 on the island of Burano in the Venetian lagoon. BAIFF bills itself as the first European festival dedicated exclusively to short films made with the aid of artificial intelligence, and its official rules contain two eligibility clauses that disqualify more films than anything else: the film must have been completed between January 1, 2025 and June 1, 2026, and at least 25% of the production must have been made with AI software, declared in detail on the entry form. That 25% floor makes BAIFF one of the friendliest major festivals for hybrid work — a live-action short where Runway Aleph handled VFX passes qualifies just as cleanly as a fully generated piece. The festival's accepted-tools list names Runway, Sora, Kling, Veo, MidJourney, Higgsfield and Luma explicitly, alongside any other AI tool. Entry fees are tiered through FilmFreeway from earlybird through final deadline, so submitting before July 1 rather than at it saves real money. Prizes are jury, honorary and category awards combining cash and screening rather than a single headline check; the festival's currency is its address. Premiering twenty minutes by vaporetto from the Venice International Film Festival gives a BAIFF laurel disproportionate weight on a European circuit run, and it stacks naturally with the Reply AI Film Festival, whose Venice premiere happens that same September."
        },
        {
            "h": "Neu Wave AI Film Festival — July 1 (Hollywood, LA Tech Week)",
            "body": "The Neu Wave AI Film Festival closes submissions July 1, 2026, and is structured unlike any other contest on this list: it is a multi-round elimination competition that ends with the top five projects screening at a Hollywood gala on October 14–15, timed to LA Tech Week, in front of industry executives, agents and producers. Categories per the festival's official site span AI Long Film (10+ minutes), AI TV Commercial, AI Music Video, Experimental, and a 2-minute Vertical Drama category that requires Topview.ai in the pipeline — the only tool-mandated category in this guide. The rounds are the strategic wrinkle: projects selected in Round 2, announced in July, must create an additional two minutes continuing the same story for a four-minute total, and finalists in the August round add two more for a complete six-minute narrative. That format punishes one-off spectacle and rewards filmmakers with a story engine that can sustain escalation, so submit a film whose world has somewhere to go. Films must be fully completed before submission and are sent via private link rather than a public platform, and entry fees vary by category. For US-based filmmakers the calculus is straightforward: no other July deadline buys a possible screening in front of working Hollywood representation. Pair it with the Silicon Valley AI Film Festival's August 31 deadline — whose selections screen at the Dolby Theatre — and a single strong short anchors an entire American fall circuit."
        },
        {
            "h": "AI for the Future (UN HLPF) — July 1, and AIMagica — July 2",
            "body": "Two quieter deadlines round out the opening week. The AI for the Future Festival's HLPF edition closes July 1 on FilmFreeway, aligned to the United Nations High-Level Political Forum in New York in July 2026. The festival screens selected works at UN-adjacent and partner venues across the year's major convenings — CSW, HLPF, UNGA and COP — and its brief covers the SDGs, digital inclusion, inequality, youth futures, migration, climate mobility and the governance of emerging technologies. It accepts three kinds of work: films about AI's impact on society, films made significantly with AI tools, and non-AI films that resonate strongly with UN-aligned themes. There is no cash prize; the value is a screening credit inside international policy rooms that AI filmmakers almost never reach, which matters disproportionately for documentary and social-impact work. AIMagica closes its September 2026 Awards window on July 2. It is a quarterly online competition — submissions accepted year-round, winners announced every quarter — with a flat $19 fee per film, a 2-to-15-minute runtime band, and delivery specs of MP4 or MOV at 1080p minimum and 24 or 30fps. Awards come with distribution opportunities, and the quarterly cadence makes it one of the lowest-stakes ways to put a first laurel on a new film while you wait on bigger juries. Neither of these two will headline a press release, but both are cheap, fast and additive to a July stack built around BAIFF, Neu Wave or Inspiring Asia."
        },
        {
            "h": "Inspiring Asia Micro Film Festival — July 6 ($10,000 Best AI Film Award)",
            "body": "The biggest confirmed cash prize attached to any July 2026 deadline belongs to the Inspiring Asia Micro Film Festival, whose submission window closes July 6. The festival's Best AI Film Award pays USD 10,000 and entry is completely free. The format is micro: films must run 3 to 6 minutes and focus on community empowerment and social impact — this is not a venue for abstract tech demos, and the festival's own materials say AI Film Award applicants must identify the AI tools used and explain how AI was integrated into the filmmaking process. The structure is what makes the prize unusually reachable: Inspiring Asia 2026 runs through eight regional film festivals — the Philippines, China, Indonesia, Mongolia, Thailand, Vietnam, Hong Kong and more — whose top entries advance to the grand final and award ceremony in Manila on October 25. Regional heats mean your film is first judged against a regional pool rather than a single global pile, and coverage from the Bangkok Post and the Tanoto Foundation's Indonesia edition confirms organizers are actively recruiting first-time and community filmmakers, not just established AI creators. For a filmmaker anywhere in Asia, this is the highest-expected-value July submission, full stop; for filmmakers elsewhere, the 3-to-6-minute social-impact brief is narrow enough that forcing an existing film into it rarely works, but purpose-built entries are competing against a smaller field than anything else at this prize level. Our complete guide to AI film festivals across Asia maps how Inspiring Asia fits the region's broader 2026 calendar."
        },
        {
            "h": "BLACK AI FEST — July 15 (UK, 21 Award Categories)",
            "body": "BLACK AI FEST — formally the International A.I Film Academy Festival & Awards — closes submissions on July 15, 2026, with its inaugural live event in Kent, England on August 1–2, 2026, barely two weeks later. The compressed gap between deadline and ceremony means July 15 is genuinely final; there is no late tier behind it. The festival's defining feature is breadth: 21 competitive categories spanning live-action shorts, feature films, documentaries, commercials and animated productions, including seven Jury-Audience Choice awards explicitly designed to celebrate the best AI film talent across each of the seven continents, and a dedicated category for films made by kids aged 7 to 17 — the only children's AI filmmaking category among the major 2026 festivals. The event itself combines in-person screenings, exhibitions, workshops and panel discussions in Kent with virtual elements for global participants, so selected filmmakers who cannot travel to the UK still get a screening. Entry fees are tiered on FilmFreeway. Twenty-one categories across a young festival means the math favors submitters: the per-category competitive density is a fraction of what a single-award festival carries, and category wins convert into laurels and IMDb-listable credits at an unusually high rate. For UK and European filmmakers it slots neatly between BAIFF's July 1 deadline and the London-based 01 A.I. | New Media | Experimental festival's August 6 close, giving the region three submission beats in five weeks."
        },
        {
            "h": "Kerala International AI Film Festival (KIAFF) — July 20 (Free, India)",
            "body": "The Kerala International AI Film Festival closes submissions on July 20, 2026, and it is the last hard July deadline in our database. Entry is free. KIAFF — run by the School of Storytelling and also styled the AI International Film Festival of Kerala — opened its submission window on June 1 and runs its festival September 18–20, 2026 in Thiruvananthapuram, with judging through July and August. Per the official festival page, eligible submissions are audiovisual short formats with a minimum duration of two minutes that showcase innovative use of AI in the conception, design or production of content, judged across six award tracks: Best AI Film, Best Narration, Best Art & Design, Sound Design, Visual Effects and Special Awards. The separate craft categories are worth reading as a judging signal — a film with exceptional AI sound design or art direction can win at KIAFF even if it isn't the strongest overall narrative in the pool, which is not true at most general AI festivals. KIAFF arrives as part of a genuine Indian AI-festival wave: IFFI Goa's government-backed AI Film Festival closes August 31 with free submission, and the two stack naturally for any filmmaker targeting the subcontinent. South Asia's festival infrastructure for AI film barely existed eighteen months ago; a free deadline attached to a physical three-day festival in a state capital, with named craft awards, is exactly the kind of low-cost, real-venue credit that fills out a young film's laurel bar before the heavyweight juries see it."
        },
        {
            "h": "Reading This Before June 30? Five Contests Close First",
            "body": "If you are planning a July submission run in mid-June, five deadlines land before the month even starts, and several are stronger opportunities than anything in July. The AI Shortest Film Competition — a free LTX Studio × Forward Festival Berlin contest paying $3,000 cash plus a Berlin premiere — closes June 28 and requires LTX Studio for primary visuals. June 30 is a four-way pileup: the Seoul Design AI Film Festival (free entry, KRW 24,000,000 — roughly $18,000 — in total prizes, winner screened on the 222-meter Dongdaemun Design Plaza facade), the Hong Kong AI International Film Festival, the Gyeongsangbuk-do AI/Metaverse Film Festival and the AI Artist Festival's fifth season all close that day. HKAIIFF deserves particular attention: it markets itself as the world's first AI-native film festival, carries $1,000,000 in total festival prize support against a $99 entry fee, and its festival runs July 17–23, 2026 — meaning filmmakers who submit by June 30 could be screening in Hong Kong three weeks later. Our June 2026 deadlines guide covers that month's full calendar in the same depth as this one. The practical takeaway for a filmmaker with one finished short: submit to the free June 30 trio first (SDAFF, GAMFF, AI Artist Festival), make a judgment call on HKAIIFF's $99 fee against its prize pool, then roll the same film into the July 1 triple deadline the next morning. Five festivals in 48 hours is a realistic, affordable sprint with a single file and a prepared director's statement."
        },
        {
            "h": "After July: The August 15 Wall, and How to Sequence the Summer",
            "body": "Every July submission decision should be made with August 15, 2026 in view, because that date is the largest single deadline in AI film history: the Astana AI Film Festival's $1,000,000 prize fund and the Future Vision XPRIZE's $3,500,000-plus pool both close that day — both free to enter — alongside the Austin AI Film Festival, K-Culture AI International Film Festival in Seoul, AIMF in Los Angeles and Poland's Bochnia festival. August 31 brings a second wall: Silicon Valley AI Film Festival's Dolby Theatre selections, IFFI Goa, AI.motion at IULM Milan with its RAI Cinema Channel prize, Sparknify's Human vs. AI festival and the AI Media Award in Zurich, with London's 01 A.I. | New Media festival on August 6 in between. We maintain dedicated step-by-step submission guides for both Astana and the Future Vision XPRIZE. The sequencing logic for the summer is therefore: spend June finishing your film, spend the July 1–20 window collecting the deadlines in this guide — they are cheap or free, fast, and their laurels compound — and reserve your serious preparation time for the August 15 majors, which demand more than a file upload: XPRIZE wants a treatment and a structured pitch, and Astana's $1,000,000 brief rewards films built to its theme. A filmmaker who hits Inspiring Asia, KIAFF and two July 1 festivals enters August with four pending selections and a polished package, at a total spend under $150. Our free AI film contests roundup tracks which of these stay open if July gets away from you. The full database at aifilmcontests.com updates every deadline on this page daily."
        }
    ],
    "ruminatex": true,
    "ruminatexNote": "Brands looking to commission cinematic AI content for campaigns rather than enter festival competitions can work with Ruminatex, which produces AI-native commercial content for forward-thinking brands.",
    "faqs": [
        {
            "q": "Which AI film festivals have deadlines in July 2026?",
            "a": "Seven AI film contests close in July 2026: BAIFF — the Burano Artificial Intelligence Film Festival (July 1), the Neu Wave AI Film Festival in Hollywood (July 1), the AI for the Future Festival HLPF edition aligned to the UN forum in New York (July 1), AIMagica's quarterly online competition (July 2), the Inspiring Asia Micro Film Festival's $10,000 Best AI Film Award (July 6), the UK's BLACK AI FEST (July 15) and the Kerala International AI Film Festival, KIAFF (July 20). Two late-tier dates also land in July: Red Rocks AI Film Festival on July 6 and the Berlin AI Film Festival's late tier on July 31."
        },
        {
            "q": "Which July 2026 AI film contests are free to enter?",
            "a": "Two of the seven July-closing contests are completely free: the Inspiring Asia Micro Film Festival (July 6 deadline, $10,000 Best AI Film Award, 3-to-6-minute films on community empowerment) and the Kerala International AI Film Festival (July 20 deadline, six award categories, festival held September 18–20 in Thiruvananthapuram). AIMagica charges a flat $19, while BAIFF, Neu Wave and BLACK AI FEST use tiered or category-based fees. If you want more free deadlines, the August 15 giants — the $1,000,000 Astana AI Film Festival and the $3,500,000+ Future Vision XPRIZE — are both free to enter."
        },
        {
            "q": "What is the biggest prize among July 2026 AI film festival deadlines?",
            "a": "The largest confirmed cash prize attached to a July 2026 deadline is the Inspiring Asia Micro Film Festival's $10,000 Best AI Film Award, which closes July 6 and is decided at the Manila grand final on October 25, 2026. Entry is free, films must run 3 to 6 minutes with a community-empowerment focus, and entrants must disclose which AI tools they used and how. The far larger pools come one month later: the Astana AI Film Festival ($1,000,000) and Future Vision XPRIZE ($3,500,000+) both close August 15, 2026."
        },
        {
            "q": "Can I submit the same film to multiple July 2026 AI festivals?",
            "a": "Yes. None of the seven July-closing festivals — BAIFF, Neu Wave, AI for the Future, AIMagica, Inspiring Asia, BLACK AI FEST or KIAFF — enforces an exclusivity or premiere clause that blocks simultaneous submission. The practical constraints are runtime and brief: a 3-to-6-minute film with a social-impact angle can plausibly hit all seven, while a 10-minute film fits Neu Wave's AI Long Film category and AIMagica's 15-minute ceiling but exceeds Inspiring Asia's 6-minute cap. Every festival on the list requires AI-tool disclosure on the entry form, so keep a 100–200 word toolchain statement ready."
        },
        {
            "q": "What is the next big AI film deadline after July 2026?",
            "a": "August 15, 2026 — the largest single deadline date in AI film history. The Astana AI Film Festival's $1,000,000 prize fund and the Future Vision XPRIZE's $3,500,000+ pool both close that day, both free to enter, alongside the Austin AI Film Festival, K-Culture AI International Film Festival in Seoul, AIMF Los Angeles and Bochnia in Poland. London's 01 A.I. | New Media festival closes August 6, and August 31 brings the Silicon Valley AI Film Festival (Dolby Theatre screening), IFFI Goa, AI.motion Milan and the AI Media Award Zurich."
        },
        {
            "q": "How does the Neu Wave AI Film Festival's round structure work?",
            "a": "Neu Wave is a multi-round elimination contest rather than a single-submission festival. Submissions close July 1, 2026. Projects selected for Round 2 in July must create an additional two minutes continuing the same story, bringing the total to four minutes; finalists in the August round add two more minutes to complete a six-minute narrative. The top five projects screen at a Hollywood gala on October 14–15, 2026, timed to LA Tech Week, in front of industry executives, agents and producers. Categories include AI Long Film (10+ minutes), AI TV Commercial, AI Music Video, Experimental and a Topview.ai-required 2-minute Vertical Drama."
        },
        {
            "q": "When is the Kerala International AI Film Festival and what are its categories?",
            "a": "KIAFF closes submissions July 20, 2026, and holds its festival September 18–20, 2026 in Thiruvananthapuram, India, with judging through July and August. Entry is free. Eligible films are audiovisual short formats of at least two minutes showcasing innovative AI use in conception, design or production. Awards run across six tracks: Best AI Film, Best Narration, Best Art & Design, Sound Design, Visual Effects and Special Awards — the separate craft categories mean a film can win for exceptional AI sound design or art direction without being the strongest overall narrative."
        }
    ],
    "featuredContestIds": [
        "burano-baiff-italy-2026",
        "neu-wave-ai-film-festival-2026",
        "inspiring-asia-micro-film-festival-2026",
        "kerala-international-ai-film-festival-2026",
        "black-ai-fest-2026"
    ]
},
  'how-to-apply-to-runway-hundred-film-fund-2026': {
    "title": "How to Apply to the Runway Hundred Film Fund in 2026: Grants, Eligibility and the Four-Step Application",
    "description": "How to apply to the Runway Hundred Film Fund: free entry, grants from $5,000 to $1,000,000+ per project plus up to $2M in Runway credits, decisions in ~14 days. Full guide to eligibility (your film must use Runway in the pipeline), the four-step application form, the advisory panel (Jane Rosenthal, will.i.am, Richard Kerris), IP rights, and how the rolling fund fits a 2026 festival strategy.",
    "keywords": "Runway Hundred Film Fund, how to apply Runway Hundred Film Fund, the hundred film fund, runway film fund, runway ai grant $1 million, runway ai contest grant, AI film grant 2026, Runway Studios film funding, AI filmmaking grant, runwayml.com hundred film fund",
    "intro": "To apply to the Runway Hundred Film Fund, submit an AI-augmented film that is still in pre- or post-production through the official form at runwayml.com/hundred-film-fund/submit. Entry is free, grants range from $5,000 to $1,000,000-plus per project alongside up to $2 million in Runway credits, and the team typically returns a decision within roughly 14 days. That speed is the single most important thing to understand about this fund: it is not an annual festival with one deadline and a six-month wait, but a rolling grant program that Runway and Runway Studios launched on September 26, 2024 to help produce one hundred films made with AI. The fund sits at $5 million today with room to grow to $10 million as more projects come in, according to Runway's launch announcement and reporting from TechCrunch and IndieWire. This guide walks a working director or producer through exactly who qualifies, how much you can realistically ask for, what the four-step application demands, who sits on the advisory panel reading your pitch, and how the fund should fit alongside prize festivals like the Runway AI Film Festival, Astana AIFF, and the Future Vision XPRIZE.",
    "sections": [
        {
            "h": "What the Hundred Film Fund Pays — and Why It Is Not a Contest",
            "body": "The Hundred Film Fund is a grant program, not a prize competition, and the distinction changes how you should approach it. There is no jury ranking films against each other for a single top award; instead, Runway evaluates each project on its own merits and writes a check sized to the project. Funding grants run from $5,000 to $1,000,000-plus per project, and every selected film can also receive a share of $2 million in Runway platform credits to cover the actual cost of generating shots. Runway CEO Cristobal Valenzuela framed the goal plainly at launch: traditional funding mechanisms overlook emerging visions, and the fund exists to put resources behind artist-led storytelling. Because the pool is $5 million with headroom to $10 million and the stated ambition is one hundred films, the implied average grant is modest — most awards will land far below the $1 million ceiling. Treat the seven-figure figure as the exception for an ambitious feature, not the expectation for a short. The practical takeaway: ask for what your specific production actually needs to finish, justified line by line, rather than anchoring to the headline number that made the press."
        },
        {
            "h": "Who Is Eligible: The Runway-in-the-Pipeline Rule",
            "body": "Eligibility hinges on one non-negotiable requirement: your project must use generative media technology developed by Runway somewhere in its pipeline. Runway's submission guidelines state that submitted projects must, to some degree, employ Runway tools — so a film built entirely in a competitor like Sora, Kling, or Veo with no Runway in the stack does not qualify, while a hybrid live-action film that uses Runway's Aleph for a few VFX shots does. Beyond that, the call is open to professional directors, producers, screenwriters, and creative professionals from any background worldwide, wherever participation is permitted by US and local law, and applicants must be at least 18 or the local age of majority. The project itself has to be in the late-development or early-production stage, or in post-production and short of funds to finish — completed films are explicitly not accepted. All formats are welcome: features, shorts, documentaries, animation, scripted fiction, experimental work, and music videos. Two categories are excluded outright: branded content gets no funding, and the work must be original and free of third-party rights encumbrances. If your film is finished, your move is a festival submission, not this fund."
        },
        {
            "h": "Grant Sizes: From $5K Finishing Funds to Seven-Figure Features",
            "body": "Think of the grant range as three practical tiers. A $5,000 to $25,000 award is a finishing fund — it covers credits, a sound mix, a colorist, or a few weeks of an editor's time to get a short across the line. The middle band, roughly $25,000 to $250,000, supports a serious short or a proof-of-concept for a feature, paying for a small crew, performance capture with Runway's Act-Two, or a longer post schedule. The top tier, $250,000 to $1,000,000-plus, is reserved for features or episodic work with a real production plan, named talent, and a producer who can absorb that capital responsibly. The $2 million in Runway credits sits on top of cash and is significant on its own: Gen-4.5, Runway's flagship text-to-video model released December 1, 2025, and the Aleph editing suite consume credits fast at feature scale, so a large credit allocation can be worth as much as the cash to a generation-heavy project. Size your ask to your tier honestly. The committee reads thousands of words of pitch text and a video; an inflated number with no production logic behind it is the fastest way to a polite rejection."
        },
        {
            "h": "The 14-Day Decision and the Rolling Calendar",
            "body": "Unlike the Reply AI Film Festival's hard June 1 cutoff or the Astana AI Film Festival's August deadline, the Hundred Film Fund has no single date — applications are accepted on a rolling basis and decisions typically arrive within about 14 days of submission. That cadence is a genuine strategic advantage. You can apply the moment your project is funding-ready rather than waiting for an annual window, and a two-week turnaround means you are not holding your production hostage to a slow grant cycle. There is one important throttle: an applicant who has been selected once within the annual rolling period cannot apply again with another project that year, and a rejected project can only be resubmitted if the committee explicitly approves it. So you effectively get one strong shot per year. The other clock that matters is downstream — once you receive a grant, your production timeline cannot exceed 12 months. Plan backward from that 12-month ceiling before you apply: if your feature realistically needs 18 months to finish, either scope the funded milestone down to something deliverable in a year or wait until you are closer to a 12-month finish line."
        },
        {
            "h": "Step by Step: How the Four-Part Application Works",
            "body": "The application form runs in four steps and, critically, does not save as you go — it must be completed in a single session, so Runway itself recommends drafting everything in a separate document first and pasting it in. Step one is Project info: a title capped at 150 characters plus several longer fields running to 1,000 and 1,500 characters covering the logline, synopsis, the role AI and Runway play in the production, and your funding need. Step two is Filmmaker info, a 500-character space to establish who you are and why you can deliver this film. Step three is Producer info, another 500-character field — and if you are a director without a producer attached, this gap is worth closing before you apply, because the panel co-produces select projects and wants to see production capacity. Step four is the video pitch, the most decisive element: a short film by you, about your film, that shows the actual look you are chasing rather than describing it. Films may be in any language but the finished work must ship with English subtitles, and the application must be written in English. Read every FAQ and all twelve submission guidelines before you start; the form punishes omissions, and there are no second drafts once you submit."
        },
        {
            "h": "What the Advisory Panel Is Looking For",
            "body": "Your pitch is read against an advisory panel of established industry figures who, in Runway's words, help amplify projects, offer advice, and co-produce select films. The panel includes Jane Rosenthal, the producer behind The Irishman and co-founder of the Tribeca Festival; Christina Lee Storm, a creative producer and Governor of the Television Academy's Emerging Media Programming group; Stefan Sonnenfeld, founder and senior colorist of the post house Company 3; will.i.am, the Black Eyed Peas artist and producer; Joel Kuwahara, co-founder of Bento Box Entertainment, the studio behind Bob's Burgers; Richard Kerris, NVIDIA's VP and GM of Media and Entertainment with prior runs at Apple and Lucasfilm; and David Sheldon-Hicks, founder of the visual-effects house Territory Studio. Read that roster as a signal: these are producers, colorists, and post leaders, not prompt engineers. They reward films with a clear authorial point of view, a believable production plan, and craft — story, performance, color, sound — over raw model novelty. A technically impressive reel with no narrative spine reads as a demo; a modest-looking film with a real idea and a producer who can finish it reads as fundable. Pitch the story and the plan first, the tools second."
        },
        {
            "h": "Rights, Ownership, and the Fine Print Most Applicants Miss",
            "body": "The ownership terms are creator-friendly but not unconditional, and you should understand them before signing. Creators retain full intellectual-property rights over their projects — Runway does not take your copyright — but in accepting a grant you grant Runway permission to showcase and distribute the finished product, which in practice means your film may appear in Runway's channels and marketing. Your project must be wholly your own authorship and free of third-party rights problems, so clear your music, fonts, likenesses, and any source footage before you apply rather than after. No purchase or payment of any kind is ever required to enter, and the fund does not bankroll branded content, so a thinly disguised commercial will not pass. One easy-to-miss limit: a project can be submitted only once to the call, and being selected once in the annual rolling period bars you from applying again that year with a different film. If you have two projects, lead with the one closest to a fundable, finishable state. Treat the grant agreement the way you would any production financing document — read the distribution-permission clause closely, and if a future traditional distributor would balk at Runway showcasing the film first, raise it during the conversation rather than discovering it at delivery."
        },
        {
            "h": "How the Fund Fits Your 2026 Strategy: Funding vs. Festivals",
            "body": "The smartest way to use the Hundred Film Fund is as the front end of a festival run, not a replacement for one. Because the fund pays before or during production and prize festivals reward finished films, the two stack cleanly: a Hundred Film Fund grant can finance the very film you later enter into the Runway AI Film Festival, whose 2026 edition carries a $25,000-plus prize, or into a major prize competition like the $1,000,000 Astana AI Film Festival or the $3,500,000 Future Vision XPRIZE. Sequence it deliberately — secure finishing money now, deliver inside the 12-month window, then submit the completed film to the deadline festivals that fit its genre and length. The fund is also the cleanest fit for filmmakers already committed to Runway's stack, since the in-pipeline requirement that excludes pure-Sora or pure-Veo films is a non-issue if you are building in Gen-4.5 and Aleph anyway. For a fuller map of where Runway work wins, see our guide to the best AI film festivals for Runway users and our roundup of AI film festivals with million-dollar prizes, and our step-by-step guide to submitting to the Future Vision XPRIZE if your project leans optimistic science fiction. Apply when your project is genuinely funding-ready and your producer paperwork is in order — with a 14-day decision, there is little cost to a well-prepared application and real money on the other side."
        }
    ],
    "ruminatex": false,
    "faqs": [
        {
            "q": "How much money can you get from the Runway Hundred Film Fund?",
            "a": "Grants from the Runway Hundred Film Fund range from $5,000 to $1,000,000-plus per project, and selected films can also receive a share of up to $2 million in Runway platform credits to cover generation costs. The overall fund sits at $5 million with the potential to grow to $10 million. Because the stated goal is to support roughly one hundred films, most awards land well below the $1 million ceiling — the seven-figure figure is the exception for an ambitious feature, not the norm. Size your request to what your production actually needs to finish."
        },
        {
            "q": "Is there an entry fee or a deadline to apply?",
            "a": "No. Applying to the Hundred Film Fund is completely free — Runway's guidelines state that no purchase or payment of any kind is necessary to enter. There is also no single deadline: applications are accepted on a rolling basis and Runway typically returns a decision within about 14 days of submission. The one limit is that an applicant selected once within the annual rolling period cannot apply again that year with another project, so you effectively get one strong submission per year."
        },
        {
            "q": "Do you have to use Runway to qualify for the fund?",
            "a": "Yes. The defining eligibility rule is that your project must, to some degree, employ generative media technology developed by Runway somewhere in its production pipeline. A film made entirely in a competing tool such as Sora, Kling, or Veo with no Runway in the stack does not qualify. A hybrid project that uses Runway's Gen-4.5 model or the Aleph editing suite for even part of the work does. The fund is open worldwide to directors, producers, screenwriters, and creative professionals who are at least 18."
        },
        {
            "q": "Can a finished film apply to the Hundred Film Fund?",
            "a": "No. Completed projects are explicitly not accepted. The fund supports films in the late-development or early-production stage, or in post-production and short of the money to finish. If your film is already done, the right path is a festival submission rather than this grant. The fund also excludes branded content entirely, and once you receive a grant your production timeline cannot exceed 12 months, so apply when you can realistically deliver within a year."
        },
        {
            "q": "Who decides which films the fund supports?",
            "a": "Applications are read against an advisory panel of established industry figures including Jane Rosenthal (producer and Tribeca Festival co-founder), Christina Lee Storm (Television Academy EMPG Governor), Stefan Sonnenfeld (Company 3 founder and colorist), will.i.am, Joel Kuwahara (Bento Box Entertainment co-founder), Richard Kerris (NVIDIA VP, Media and Entertainment), and David Sheldon-Hicks (Territory Studio founder). The panel also helps amplify and, for select projects, co-produce. Because these are producers and post-production leaders, they reward a clear story and a credible production plan over raw model novelty."
        },
        {
            "q": "Does Runway take ownership of your film if you get a grant?",
            "a": "No — creators retain full intellectual-property rights to their projects. However, by accepting a grant you give Runway permission to showcase and distribute the finished film, so it may appear in Runway's channels and marketing. Your work must also be wholly your own authorship and free of third-party rights issues, so clear music, fonts, likenesses, and any source footage before applying. Read the distribution-permission clause closely, especially if you plan a later traditional distribution deal."
        },
        {
            "q": "How is the Hundred Film Fund different from the Runway AI Film Festival?",
            "a": "They are separate programs. The Hundred Film Fund is a rolling grant that pays you before or during production to make a film, with awards from $5,000 to $1,000,000-plus. The Runway AI Film Festival (AIFF) is an annual competition that screens and awards finished films, with a 2026 prize pool of $25,000-plus and a deadline-based submission window. The smart strategy is to use the fund to finance a film and then enter the completed work into the festival — they stack rather than compete."
        }
    ],
    "featuredContestIds": [
        "runway-hundred-fund",
        "runway-ai-film-festival-2026",
        "astana-aiff-2026",
        "future-vision-xprize-2026",
        "svaiff-awards-2026"
    ],
    "datePublished": "2026-06-09"
},
  'how-to-enter-ai-film-contest': {
    title: 'How to Enter an AI Film Contest in 2026',
    description: 'A step-by-step guide to entering AI film competitions â from choosing the right contest to submitting your work.',
    keywords: 'how to enter AI film contest, AI film competition guide, submit AI film festival 2026',
    intro: 'AI film contests have exploded in 2026, with prize pools ranging from a few thousand dollars to over a million. But each contest has different rules, technical requirements, and judging criteria. Understanding the landscape before you start production can mean the difference between a disqualified entry and a festival screening.',
    sections: [
      { h: 'Step 1: Choose the Right Contest', body: 'Not all AI film contests are equal. Some require specific tools (like Runway or Kling), others accept any AI software. Match the contest to your strengths â if you excel at short narrative films, target short film categories. If you work in advertising or branded content, the Luma Dream Brief ($1M prize) or the Kling NextGen Contest are designed for you. Check the entry fee, eligibility requirements, and whether the contest allows international submissions.' },
      { h: 'Step 2: Read the Rules Carefully', body: 'Every contest has disqualifying technicalities. Common ones: minimum/maximum runtime, file format requirements (typically H.264 .mp4 or .mov), resolution standards (usually 1080p or 4K), and the percentage of AI-generated content required. Some contests require 100% AI generation; others just require AI to play a "significant role." Misunderstanding this is the most common reason submissions get rejected.' },
      { h: 'Step 3: Concept and Pre-production', body: 'The films that win AI competitions are almost always concept-first. Judges at Lincoln Center, Cannes, and the Tokyo International Film Festival have seen thousands of technically impressive AI films. What stands out is a strong idea with emotional resonance. Spend more time on your concept and script than on production â a simple idea executed perfectly beats a visually spectacular film with nothing to say.' },
      { h: 'Step 4: Production Workflow', body: 'A typical winning workflow: (1) Generate a storyboard with MidJourney or similar, (2) Generate video clips with Runway Gen-3 or Kling, (3) Edit in Premiere or DaVinci Resolve, (4) Add AI-generated voiceover or music with ElevenLabs/Suno. Time your production to leave at least 48 hours for render, review, and export before the deadline.' },
      { h: 'Step 5: Submission and After', body: "Submit through the official platform (most use FilmFreeway, Wufoo forms, or proprietary portals). Save your confirmation email. Some contests require a making-of or director statement â prepare this in advance. If you don't win, study the winning films. The best AI filmmakers iterate across multiple contests, improving with each submission." },
    ],
    ruminatex: true,
    ruminatexNote: 'For brands looking to commission cinematic AI content rather than compete themselves, Ruminatex specializes in AI-native commercial production.',
  },

  'ai-filmmaking-tools-guide': {
    title: 'The Complete Guide to AI Filmmaking Tools in 2026',
    description: 'Every major AI video generation tool compared â Runway, Kling, Sora, Luma, Pika, Hailuo and more. Which tool is right for which type of film?',
    keywords: 'AI filmmaking tools 2026, best AI video generation software, Runway vs Kling vs Sora comparison',
    intro: 'The AI filmmaking tool landscape in 2026 is both exciting and overwhelming. A dozen capable text-to-video and video generation systems exist, each with different strengths. This guide breaks down what each major tool does best â and which contest categories they are suited for.',
    sections: [
      { h: 'Runway Gen-3 Alpha', body: "Still the industry standard for AI filmmaking competitions. Runway's Gen-3 Alpha produces cinematic-quality footage with exceptional temporal consistency â meaning objects and characters hold their appearance across frames. It's the tool of choice for the Runway AI Film Festival, the world's largest AI film competition with a $135K prize pool screened at Lincoln Center. Runway also offers inpainting, interpolation, and a growing motion brush toolset." },
      { h: 'Kling AI', body: "Kling AI by Kuaishou has rapidly become a top-tier competitor. Its primary advantage is physical accuracy â objects move and interact with realistic physics. The Kling NextGen Creative Contest attracted 4,600+ entries from 122 countries and had a jury of Oscar-winning filmmakers. For complex scene compositions, many filmmakers now prefer Kling's results over Runway." },
      { h: 'OpenAI Sora', body: "Sora produces long-duration, physically coherent video with extraordinary scene consistency. It's particularly strong for establishing shots, natural environments, and cinematic camera movements. Access is still somewhat limited compared to Runway and Kling, but expect that to change rapidly through 2026. Most 'any AI tools' contests accept Sora." },
      { h: 'Luma Dream Machine', body: "Luma's primary strength is smooth, high-quality motion with a somewhat dreamy aesthetic quality. The Luma Dream Brief ($1M prize for a Cannes Gold Lion commercial) was judged by Nike and Wieden+Kennedy â cementing Luma's brand-film credibility. Good choice for advertising and brand content." },
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
      { h: 'Concept Is King', body: "Every judge panel â from Lincoln Center to Cannes to the Tokyo International Film Festival â says the same thing: technical quality is table stakes now. What they remember are films with a clear idea, genuine emotion, and a reason to exist. The $20K Runway Grand Prix winners are rarely the most technically impressive submissions; they're the ones with the most compelling point of view." },
      { h: 'Study the Judging Criteria', body: "Runway judges on narrative, visual quality, and originality. Kling judges on creativity, technical execution, and social impact. The Luma Dream Brief judges on commercial effectiveness â would this actually move product? Tailor your film to the specific judging criteria, not just general quality." },
      { h: 'The 30-Second Rule', body: "Judges see hundreds of submissions. If your film doesn't establish its world and hook the viewer within 30 seconds, it's at a disadvantage. Don't build slowly â open with your strongest image or most compelling moment. The first 10 seconds of a short AI film are more important than any other 10 seconds." },
      { h: 'Technical Precision Checklist', body: "Winning films consistently hit: (1) No temporal flickering or inconsistent object appearance, (2) Smooth transitions between AI-generated shots, (3) Professional audio mix â this is where amateurs lose, (4) Correct delivery specs â wrong file format or codec can disqualify you, (5) Clean, readable subtitles if needed." },
      { h: 'Enter Multiple Contests', body: "The filmmakers who consistently place in competitions enter consistently. Many of the recognized names in AI filmmaking have entered 10+ competitions. Each contest teaches you something about what works. Budget for multiple entry fees and treat each contest as a learning experiment." },
    ],
    ruminatex: false,
  },

  'ai-video-production-workflow': {
    title: 'AI Video Production Workflow: From Concept to Final Film',
    description: 'The complete production pipeline for AI filmmakers â concept, generation, editing, audio, and delivery. A practical workflow used by competition-winning filmmakers.',
    keywords: 'AI video production workflow, AI film production pipeline, how to make AI film 2026',
    intro: "Making an AI film for competition is a multi-stage process that combines traditional filmmaking principles with generative AI tools. Here's the production pipeline that competition-winning AI filmmakers use â from the first concept through final delivery.",
    sections: [
      { h: 'Pre-production: Concept and Storyboard', body: 'Before touching any video generation tool, write a one-paragraph synopsis. What is this film about? What is its mood? What is the single image you want audiences to remember? Use MidJourney or Adobe Firefly to generate reference images for each scene â this becomes your storyboard and your generation prompt guide.' },
      { h: 'Prompt Engineering for Video Generation', body: 'Video generation prompts need specifics: camera position ("low angle, wide shot"), lighting ("golden hour, dramatic side lighting"), movement ("slow push in"), style reference ("Terrence Malick, Days of Heaven"), and subject ("a woman in a red coat standing at the edge of a cliff"). Vague prompts produce generic results. Spend 60% of your generation time on prompt refinement.' },
      { h: 'Generation and Curation', body: "Generate 5-10 variations of each shot. Most will be unusable. You need 3-4 good options to choose from. Never use your first generation â always iterate. Keep a folder of all generated clips, including the 'failures' â sometimes a shot you discarded works perfectly in a different context." },
      { h: 'Editing and Post-production', body: "Edit in DaVinci Resolve or Premiere Pro. AI films often need more cuts than live-action films â the average AI short has a cut every 3-4 seconds because clip consistency degrades after 10-15 seconds. Color grade after all edits are locked. Add your audio mix last â get professional VO from ElevenLabs and original music from Suno or Udio." },
      { h: 'Export and Delivery', body: 'Most contests require H.264 .mp4 at 1080p minimum, often with a 500MB-2GB file size limit. Export at the highest bitrate your file size allows. Include closed captions as a separate .srt file â some contests require it and it helps judges who watch silently. Name your file clearly: YourName_FilmTitle_Contest.mp4.' },
    ],
    ruminatex: true,
    ruminatexNote: 'For brands that want this level of production applied to commercial content, Ruminatex handles the full AI production pipeline â from brief to final delivery.',
  },

  'ai-film-submission-tips': {
    title: 'AI Film Submission Tips: Everything You Need to Know Before You Submit',
    description: 'Avoid common submission mistakes. File formats, metadata, making-of statements, FilmFreeway tips, and what judges actually want to see.',
    keywords: 'AI film submission tips, FilmFreeway AI film, how to submit AI film festival, AI film competition entry guide',
    intro: "Submission errors eliminate more competition entries than bad filmmaking does. Here's how to make sure your film makes it through the technical gate and gets seen by the judges who matter.",
    sections: [
      { h: 'Read the Submission Guidelines Twice', body: 'Print them out if you have to. Highlight: runtime limits (hard cutoffs are common), file format requirements, resolution specs, aspect ratio (most contests want 16:9 but some accept 9:16 for social-first formats), audio requirements (stereo 48kHz is standard), and whether a making-of or director\'s statement is required. One missed requirement can disqualify an otherwise excellent film.' },
      { h: 'FilmFreeway Tips', body: "Most major AI film contests use FilmFreeway. Upload your film at least 24 hours before deadline â servers get overloaded in the final hours. Set your film's privacy to 'Festival Screener' not 'Public.' Include a high-resolution still image as your film's screener image â judges browse thumbnails before they click play, and a compelling image increases watch rates." },
      { h: "The Director's Statement", body: "Many contests ask for a 100-200 word director's statement or making-of note. This is not a technical description â it's your creative vision. Why did you make this film? What were you trying to explore or say? Which AI tools did you use and how did they shape the work? Judges often read statements before watching to orient their viewing. A strong statement primes them to look for what you intended." },
      { h: 'Technical Delivery Checklist', body: "Before submitting: (1) Watch your export from beginning to end â not your timeline, the export file, (2) Check that audio is present and synced, (3) Verify file size is within the limit, (4) Check that captions are correct if required, (5) Confirm the runtime matches what you stated in the entry form, (6) Save your submission confirmation." },
      { h: 'After Submission', body: "Set a calendar reminder for announcement dates. Follow the contest on social media â many announce shortlists there before official notification. If you're not selected, request feedback if the contest offers it. Some competitions provide judge notes for shortlisted entries â this is invaluable for improvement." },
    ],
    ruminatex: false,
  },

  'ai-film-festivals-explained': {
    title: 'AI Film Festivals Explained: What They Are and How They Work in 2026',
    description: 'A guide to the AI film festival circuit in 2026 â the major festivals, how selections work, screening opportunities, and what a festival credit means for your career.',
    keywords: 'AI film festival 2026, AI film festival circuit, Runway AI Film Festival, AI film screening',
    intro: 'The AI film festival circuit has evolved rapidly. What started as niche online showcases has grown into events at Lincoln Center NYC, The Broad Stage LA, Tokyo International Film Festival, and SXSW. Understanding how these festivals work is essential for any serious AI filmmaker.',
    sections: [
      { h: 'The Major AI Film Festivals in 2026', body: "The Runway AI Film Festival is the most prestigious, screening at Alice Tully Hall at Lincoln Center in June and The Broad Stage in LA. Kling NextGen screens at Tokyo International Film Festival. The WSXA Ã Hailuo Film Competition screens at WSXA Amsterdam and ARFF Berlin. The Luma Dream Brief presents winners at Cannes. Each has different prestige, audience, and industry connections." },
      { h: 'Festival Selection Process', body: 'Most AI film festivals use a tiered selection: automated technical review (file format, runtime, resolution) â program committee review â jury shortlisting â winner selection. Submission to selection takes 4-12 weeks depending on the festival. Some festivals notify all submitters; others only contact selected films.' },
      { h: 'What a Festival Credit Actually Means', body: "Being selected for a major AI film festival is increasingly valuable. Runway AI Film Festival selection is already recognized in the industry. As AI filmmaking matures, festival credits on your IMDb page will become meaningful. For freelancers and studios, festival selections are portfolio proof â they show that work holds up against international competition." },
      { h: 'Online vs. In-Person Festivals', body: "Most AI film festivals are hybrid â in-person screenings with an online audience. Online-only festivals have lower prestige but can reach larger audiences. The most valuable festivals involve in-person jury feedback, Q&A sessions, and networking with industry professionals. If travel is possible, attending your screening in person creates career opportunities that online-only viewing doesn't." },
      { h: 'Building Your Festival Strategy', body: "Treat your festival run strategically. Start with smaller competitions and work up to the majors. Use early placements to build confidence and generate credits for your FilmFreeway profile. Budget for multiple submissions â a strong film can run multiple festivals simultaneously (most allow simultaneous submissions). The goal isn't just winning; it's building a reputation across the emerging AI film community." },
    ],
    ruminatex: false,
  },

  'generative-ai-filmmaking-2026': {
    title: 'The State of Generative AI Filmmaking in 2026',
    description: 'Where AI filmmaking stands in 2026 â the tools, the prize pools, the festival circuit, the industry reception, and what comes next.',
    keywords: 'generative AI filmmaking 2026, AI film industry 2026, state of AI filmmaking, AI cinema 2026',
    intro: "In 2026, generative AI filmmaking has crossed a threshold. It's no longer a curiosity or an experiment â it's a legitimate creative discipline with its own festival circuit, prize pools exceeding $1M per competition, and recognition from legacy institutions including Lincoln Center and Cannes.",
    sections: [
      { h: 'The Prize Pool Revolution', body: "The scale of AI film prizes has exploded. Runway's AI Film Festival now offers $135K+ in prizes. Kling's NextGen Contest has distributed $42K+. Luma's Dream Brief offered $1M for a Cannes Gold Lion. These numbers have attracted serious filmmakers who previously wouldn't have considered AI-native competition. The result is a rapidly rising quality bar." },
      { h: 'Institutional Legitimacy', body: "The shift from skepticism to engagement at traditional film institutions has been swift. Lincoln Center hosts the Runway AI Film Festival. The Tokyo International Film Festival programs Kling NextGen. Cannes judged the Luma Dream Brief. This institutional embrace signals that AI filmmaking is no longer a tech story â it's a cinema story." },
      { h: 'The Tool Landscape', body: "Five tools dominate professional AI filmmaking: Runway, Kling, Sora, Luma, and Pika. Each has distinct aesthetic characteristics that experienced filmmakers leverage deliberately. The skill in AI filmmaking is no longer 'can I generate a video' but 'which tool, which settings, which prompt produces the specific visual language I want for this story.'" },
      { h: 'The Creative Debate', body: "The most interesting conversations in AI filmmaking in 2026 aren't about technology â they're about authorship, aesthetics, and what it means to direct a film when the 'camera' is a probability distribution. The filmmakers winning competitions have strong aesthetic positions and treat AI tools as collaborators with tendencies and preferences to understand and work with, not merely software to operate." },
      { h: 'What Comes Next', body: "Real-time generation, longer coherent sequences, controllable characters â the technical trajectory is clear. The more interesting question is what the film grammar of AI cinema looks like. We're still in the LumiÃ¨re Brothers phase, figuring out what the medium is. The contests, festivals, and competitions happening right now are where that grammar is being written." },
    ],
    ruminatex: false,
  },

  'ai-brand-film-guide': {
    title: 'How to Make AI Brand Films: A Guide for Marketers and Creative Directors',
    description: 'Using generative AI to produce cinematic brand content â tools, workflows, and when to work with a specialist AI advertising studio.',
    keywords: 'AI brand film guide, AI advertising production, generative AI marketing video, cinematic AI commercial 2026',
    intro: "Brands are discovering that generative AI doesn't just reduce production costs â it changes what's possible. A small team can now produce brand films with the visual quality and emotional impact that previously required six-figure production budgets. But the difference between generic AI output and genuinely cinematic brand content is directorial thinking.",
    sections: [
      { h: 'What Makes a Brand Film "Cinematic"', body: "Cinematic brand content isn't defined by budget â it's defined by intentionality. Deliberate lighting, coherent visual language, a narrative arc, and emotional resonance. AI tools can produce all of these when directed by someone who understands both the craft of filmmaking and the requirements of brand communication. The risk with AI brand content isn't quality â it's genericness. Cinematic brand films require a directorial perspective, not just a prompt." },
      { h: 'The AI Brand Production Stack', body: "A professional AI brand film workflow: (1) Runway or Kling for hero video content, (2) MidJourney for concept development and key art, (3) ElevenLabs for voiceover, (4) Suno or licensed music, (5) DaVinci Resolve for color and finishing. A skilled team can produce broadcast-quality brand content in 48-72 hours from brief. That speed advantage is transformative for time-sensitive campaigns." },
      { h: 'When to Use AI vs. Traditional Production', body: "AI brand film production excels at: conceptual or abstract visual content, fantasy/imagination sequences, fast-turnaround content, content requiring visual styles that would be prohibitively expensive to produce practically, and A/B testing multiple creative directions without proportional cost increase. Traditional production still wins for: real people telling real stories, complex live action, and content where authenticity of human presence is core to the message." },
      { h: 'Working with an AI Advertising Studio', body: "As the category matures, specialized AI advertising studios have emerged that combine generative AI expertise with brand strategy and film direction. The advantage over doing it in-house is the combination of skills that's genuinely rare: deep understanding of AI tools + cinematographic thinking + brand communication strategy. Ruminatex is one of the agencies pioneering this space â creating cinematic AI content specifically built for brand campaigns." },
      { h: 'The Luma Dream Brief as a Case Study', body: "The Luma Dream Brief ($1M prize) asked entrants to create a commercial that could win a Cannes Gold Lion. Judged by Nike, HBO Max, and Wieden+Kennedy. The winning entries weren't technically impressive AI demos â they were well-crafted commercials that happened to be made with AI. This is the direction the industry is moving: AI as production method, not as the story." },
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
      { h: 'Building Your FilmFreeway Profile', body: "FilmFreeway is the standard submission platform for AI film festivals. A well-maintained profile with multiple competition credits is your public filmmaking CV. Include: high-resolution stills from your films, your director's statement, the festival run for each film (including non-selections â it shows volume of work), and a link to your showreel." },
      { h: 'Online Presence and Community', body: "The AI filmmaking community lives on X (Twitter), Instagram, and Discord. Share your work â including work in progress. The people who become known in the field are the ones who show their process, engage with other filmmakers' work, and participate in the conversation about where AI cinema is going. Competitions are not the only path to visibility." },
      { h: 'What Clients and Studios Want to See', body: "As commercial demand for AI filmmaking grows, what does a portfolio need to show a prospective client? Consistency â multiple films, not just one hit. Range â different genres, moods, and visual approaches. Technical precision â no flickering, no artifacts, clean audio. Most importantly: evidence of directorial thinking, not just technical competence." },
      { h: 'The Long Game', body: "The AI filmmakers who will matter in five years are the ones building now. Enter every contest you can afford. Screen everywhere you're accepted. Build relationships with other filmmakers, judges, and festival programmers. The field is small enough that reputation compounds quickly. A win at the Runway AI Film Festival in 2026 is worth exponentially more than the same win in 2030." },
    ],
    ruminatex: false,
  },

  'ai-film-post-production': {
    title: 'AI Film Post-Production: Editing, Color, Audio, and Delivery',
    description: 'The complete post-production workflow for AI films â editing AI-generated footage, color grading, audio mixing, and delivery for festival and competition submission.',
    keywords: 'AI film post production, editing AI video, color grade AI film, AI film audio mix, DaVinci Resolve AI film',
    intro: "Post-production is where AI films are won or lost. Raw AI-generated footage is rarely submission-ready â it requires thoughtful editing, professional color grading, and a polished audio mix to compete at the highest level. This guide covers the complete post-production workflow for competition-level AI filmmaking.",
    sections: [
      { h: 'Editing AI-Generated Footage', body: "AI footage has specific editing challenges: clips are short (typically 4-10 seconds), temporal consistency can break down at shot boundaries, and not every generation is usable. Build your edit with a target of 3-5 second average shot duration â shorter than traditional film, but appropriate for the visual density of AI footage. Use J and L cuts to smooth audio across shot boundaries." },
      { h: 'Matching Shots Across Generations', body: "Getting visual consistency across AI-generated shots from the same 'scene' is the hardest problem in AI film editing. Techniques: generate all shots in the same session with minimal prompt variation, use consistent lighting descriptors, apply global color correction before scene-specific adjustments, and use subtle cross-dissolves rather than hard cuts when consistency is imperfect." },
      { h: 'Color Grading for AI Film', body: "AI footage often has stylistic inconsistencies in color and contrast across shots. Primary color correction (matching exposure and white balance) before creative grading is essential. In DaVinci Resolve, use the Color Match function to automatically harmonize shots, then apply a creative LUT for your film's specific aesthetic. AI footage generally handles aggressive grades well â the synthetic material has a tolerance that live-action doesn't." },
      { h: 'Audio: The Undervalued Competitive Advantage', body: "Most AI film submissions have generic or poorly mixed audio. This is your competitive edge. Commission original music through Suno or work with a composer. Use ElevenLabs for any voiceover â the quality gap between AI VO and amateur live recording is significant. Mix with a reference track to calibrate your levels. Submit at -23 LUFS for festivals, -16 LUFS for online platforms." },
      { h: 'Export Settings and Delivery', body: "Master export: ProRes 4444 or DNxHR for your master file, never delete. Delivery for festivals: H.264 at 20-40 Mbps for 1080p, H.265 for 4K. Frame rate should match your generation rate â don't convert unless required. Include captions as a separate .srt file. Name files clearly. Run your export through MediaInfo to verify specs before submission." },
    ],
    ruminatex: false,
  },

  'ai-film-festivals-deadlines-june-2026': {
    title: 'AI Film Festival Deadlines in June 2026: Every Contest Closing This Month',
    description: 'Every AI film festival closing for submissions in June 2026 â Reply AIFF, OMNI Hyperphantasia, BAIFF Burano, Seoul Design AI Film Festival, GAMFF, AI Artist Festival. Verified prize amounts, deadlines, eligibility, fees.',
    keywords: 'AI film festival deadlines June 2026, AI film contests closing June, Reply AI Film Festival deadline, OMNI Hyperphantasia, SDAFF Seoul, BAIFF Burano, AI film submission June 2026',
    datePublished: '2026-05-23',
    intro: "AI film festival deadlines in June 2026 cluster into two waves: the start of the month, when Reply AI Film Festival closes on June 1 with a â¬30,000+ prize pool, and the final week, when the Seoul Design AI Film Festival, the Gyeongsangbuk-do AI/Metaverse Film Festival, and the AI Artist Festival all close on June 30. Between those bookends, four more competitions â OMNI 1.5 Hyperphantasia in Sydney, AI Global Film Festival LifeArt in Los Angeles, the Burano AI Film Festival (BAIFF) in the Venetian lagoon, and the European tier-two tracks â keep the calendar full. This guide breaks down every AI film festival with a June 2026 deadline, with verified prize amounts pulled from each festival's official rules, the exact submission requirements (FilmFreeway versus proprietary portals), what each jury is looking for, and which festivals stack well as a simultaneous submission set. Every contest mentioned here was open as of May 23, 2026, with deadlines tracked daily on aifilmcontests.com â the source of truth for AI film contests globally.",
    sections: [
      { h: 'The June 2026 Submission Window at a Glance', body: "Eight AI film festivals have published deadlines falling between June 1 and June 30, 2026, with a ninth â the Burano Artificial Intelligence Film Festival â running parallel intake windows that close in mid-June via Festhome and on July 1 via FilmFreeway. The combined prize pool across these June-closing festivals exceeds $90,000 in confirmed cash awards. Reply AI Film Festival, organized by Italian tech consultancy Reply S.p.A. and Mastercard with cooperation from La Biennale di Venezia, contributes â¬30,000+ in cash spread across â¬8,000, â¬5,000, and â¬2,000 podium prizes plus an AI for Good Award powered by the ITU and the Reply AI Studios Grand Prix. The Seoul Design AI Film Festival contributes KRW 24,000,000 (â$18,000), with KRW 10,000,000 (â$7,400) going to the Grand Prize winner. OMNI 1.5 Hyperphantasia is the first OMNI International AI Film Festival edition to offer cash prizes, distributed across eight or more categories and judged by Alex Proyas, director of I, Robot and Dark City. The remaining June deadlines â AI Global Film Festival LifeArt, AI Artist Festival, GAMFF, and BAIFF â emphasize laurels, IMDb credits, and screening at architectural-scale venues like the Dongdaemun Design Plaza facade in Seoul rather than headline cash. Filmmakers who plan their June run by deadline cluster (June 1, mid-June, June 30) can typically hit four or five of these festivals with a single short film, since most allow simultaneous submissions and accept any AI tool â Runway, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Ray, MidJourney V7 video, Higgsfield, or hybrid workflows." },
      { h: 'Reply AI Film Festival 2026 â June 1 Deadline (â¬30,000+)', body: "Reply AI Film Festival closes submissions on June 1, 2026 at 23:59 CEST, with the premiere event running September 2â12, 2026 in Venice in conjunction with the Venice International Film Festival. The 2026 edition is themed \u201cImaginatio Nova\u201d and is organized by Reply S.p.A. in partnership with Mastercard. Prize structure: â¬8,000 for first place, â¬5,000 for second, â¬2,000 for third, plus the Reply AI Studios Grand Prix recognizing exceptional technical mastery, and the AI for Good Award powered by the ITU for films aligned with the UN Sustainable Development Goals. Total prize pool exceeds â¬30,000. Submission is free via FilmFreeway. Films must be between 30 seconds and 5 minutes, generated with AI tools, and produced after January 2025. The 10 finalists receive a paid invitation â flights and two nights' accommodation â to the Venice premiere event, where they network with Reply executives, Mastercard's marketing leadership, and the jury. Per a July 2025 Deadline report, the 2025 jury was chaired by Italian director Gabriele Muccino (Pursuit of Happyness, Seven Pounds); the 2026 jury was officially announced in March 2026. Reply AIFF is the flagship European AI festival and stacks well as a simultaneous submission with the Runway AI Film Festival (closes September 30) and the Astana AI Film Festival ($1M, closes August 31). For European filmmakers, this is the highest-leverage submission of the entire June calendar." },
      { h: 'OMNI 1.5 Hyperphantasia â June 9 Deadline (Sydney, Alex Proyas-Juried)', body: "The OMNI International AI Film Festival closes its fourth major edition â themed Hyperphantasia, after the neurological condition of exceptionally vivid mental imagery â on June 9, 2026, with the Sydney premiere screening scheduled for July 2026. This is the first OMNI edition to offer cash prizes, distributed across eight or more categories, and the jury includes acclaimed Australian-Egyptian director Alex Proyas (I, Robot, Dark City, The Crow), whose addition was reported by Mirage News and confirmed on the festival's official site. Submission is via omnifilmfestival.com, with entries required to be a minimum of 90% AI-generated content. Runtime is unusually flexible â anywhere between 1 minute and 4 hours â which makes OMNI one of the only major AI festivals open to long-form work and feature-length AI projects. The festival is tool-agnostic and explicitly welcomes Runway Gen-4, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Ray, MidJourney V7 video, ComfyUI workflows, and hybrid pipelines. The Sydney premiere will host an audience of 120 with a panel discussion led by cinema and technology experts. For Australian filmmakers, this is currently the highest-profile AI film festival in the region. Internationally, the Alex Proyas jury chair gives the win significant industry credibility â Proyas is a working Hollywood director with current studio relationships, and an OMNI Hyperphantasia win has portfolio value beyond the cash." },
      { h: 'AI Global Film Festival â LifeArt â June 12 Deadline (Los Angeles)', body: "The AI Global Film Festival, programmed under the LifeArt umbrella, closes its 2026 cycle on June 12 with its physical event held in Los Angeles. Submission is via FilmFreeway with entry fees ranging from $17 to $38 depending on the deadline tier â early submissions are cheaper, and a 33% PRO discount is available for FilmFreeway PRO subscribers. The prize package centers on an IMDb-credited Official Selection laurel â which is genuinely valuable for indie filmmakers building a credit list â plus media promotion through LifeArt's distribution channels. The festival is one of the few AI-specific competitions that programs alongside a general LifeArt slate, meaning AI films screen for an audience that includes non-AI filmmakers, programmers from traditional festivals, and Los Angeles-based industry contacts. AI Global Film Festival accepts a wide range of categories: narrative short, AI animation, AI documentary, AI music video, AI commercial, and experimental. The festival is particularly receptive to films that combine AI generation with traditional craft â hand-edited cuts, live-recorded voiceover, original music â rather than pure end-to-end AI pipelines. For a Los Angeles filmmaker or anyone targeting a US-based festival run, this is one of the cheapest paths to an official selection laurel on your IMDb profile, especially if you enter during the earliest deadline tier." },
      { h: 'Burano AI Film Festival (BAIFF) â June 15 / July 1 Deadlines', body: "BAIFF â the Burano Artificial Intelligence Film Festival â is the first European AI film festival, now in its fourth edition and held on the island of Burano in the Venetian lagoon. The 2026 cycle runs two parallel submission windows: an early Festhome-based intake closing June 15, and the main FilmFreeway submission window closing July 1, 2026. Eligibility per the BAIFF official terms requires that films be completed between January 1, 2025 and June 1, 2026, and that at least 25% of the production be AI-assisted, with the AI usage disclosed in detail on the entry form. BAIFF is one of the few AI festivals that explicitly accepts hybrid productions â films where AI handles only specific shots, VFX, or post-production passes alongside live-action footage. The festival is dedicated exclusively to short films, with the jury comprising European film directors, AI researchers, and Italian industry programmers. Prize structure is laurel-based with category awards rather than headline cash, but the prestige of premiering at the Venice lagoon â geographically and culturally adjacent to the Venice International Film Festival â gives BAIFF selection real weight on a European festival circuit. For filmmakers building a European reputation, BAIFF stacks well with Reply AIFF (also Venice, June 1) and the WAIFF Cannes festival earlier in the year." },
      { h: 'AI Artist Festival 5th Season â June 15 Deadline (China / Global)', body: "The AI Artist Festival is the largest AI film competition in the Chinese-speaking AI community, now in its fifth season with a June 15, 2026 FilmFreeway deadline and a June 2026 festival event. The festival is supported by a coalition of Chinese AI model providers and creator communities â PixVerse, MIDjourney China, AIGC&China, AFCNC, and WaytoAGI. Submission has no listed entry fee on the festival page. The festival explicitly welcomes works produced with MidJourney, Runway, Kling, Pika, Stable Diffusion, ChatGPT, Sora, Luma, ComfyUI, and other emerging AI tools, and accepts both fully AI-generated works and hybrid productions combining AI with live action, traditional animation, or analog filmmaking techniques. Award categories include Best Film and Best Director plus discipline-specific recognitions. The AI Artist Festival is a strong fit for filmmakers using Chinese-developed AI tools â Kling AI by Kuaishou, Hailuo AI by MiniMax, PixVerse, Wan, Hunyuan, and Seedance â because the organizing community has direct relationships with these model providers. Selected films are often featured by the partner platforms in their official channels, which can drive meaningful follower growth on Bilibili, Douyin, and Xiaohongshu. The festival also runs a dedicated student category, making it a low-friction first-festival submission for student AI filmmakers globally." },
      { h: 'Seoul Design AI Film Festival (SDAFF) â June 30 Deadline (KRW 24M Pool)', body: "The Seoul Design AI Film Festival, announced May 18, 2026 by the Seoul Design Foundation, closes its inaugural call for entries on June 30, 2026. The festival redefines the Dongdaemun Design Plaza (DDP) â Zaha Hadid's landmark Seoul building â as a premier destination for AI-driven media art. Total prize pool is KRW 24,000,000 (approximately $18,000), with ten winners selected. The Grand Prize winner receives KRW 10,000,000 (â$7,400) and an exclusive screening as a main feature on the DDP's 222-meter facade during Seoul Light DDP 2026. Submission is free. The festival has two main categories â Artistic Works centered on K-Culture themes, and a broader open category â and accepts global entries. SDAFF is one of the most architecturally significant AI festivals to launch in 2026 because the screening venue itself is a destination: the DDP facade is one of the largest curved media surfaces in the world, and a Grand Prize selection means your film plays at urban-scale for the duration of Seoul Light DDP. For filmmakers whose work has strong production design, color, or spectacle qualities, SDAFF rewards visual ambition in a way that conventional cinema screens don't. The K-Culture-themed category specifically rewards films engaging with Korean cultural narratives, language, music, fashion, or design heritage â making it an unusually strong fit for Korean diaspora filmmakers and anyone whose work intersects Korean creative culture with generative AI." },
      { h: 'Gyeongsangbuk-do AI/Metaverse Film Festival (GAMFF) â June 30 Deadline', body: "The Gyeongsangbuk-do International AIÂ·Metaverse Film Festival (GAMFF) closes its official submission period on June 30, 2026, with judging running July 1â30, winners announced August 3, and the awards ceremony scheduled for September 3, 2026. The festival rotates between three South Korean venues â GUMICO in Gumi, Pohang Culturalspace in Pohang, and the Gyeongsan Sports Park in Gyeongsan. GAMFF has two main categories: AI Creative Video (narrative-driven, any genre, under 10 minutes â or under 5 minutes for the youth track) and AI Game Video (world-building and innovative game systems). Submission is via FilmFreeway or Festhome, with global entries welcomed. The festival is one of the few AI competitions with a dedicated games-and-interactive track â making it a natural fit for filmmakers crossing over from indie game development, machinima, or virtual production using Unreal Engine, Unity, or Blender alongside generative AI. The Gyeongsangbuk-do regional government partly funds GAMFF, which means selected films often receive additional regional press and cultural programming exposure across South Korea. For students and youth filmmakers, the dedicated 5-minute youth track has lower competitive density than the open division and is one of the cleanest paths to a major AI festival laurel for filmmakers under 25." },
      { h: 'Strategy: Stacking June 2026 Deadlines for Maximum Coverage', body: "The most efficient June 2026 submission strategy assumes one short film â between 90 seconds and 5 minutes â submitted to multiple festivals simultaneously. None of the major June 2026 AI film festivals have exclusivity clauses, so simultaneous submission is permitted. The recommended stack: submit to Reply AIFF (June 1, â¬30K, free) first because it has the earliest deadline and the largest cash. Then OMNI Hyperphantasia (June 9, cash, paid) for the Sydney/Alex Proyas-juried credit. Then AI Global Film Festival LifeArt (June 12) and BAIFF early tier (June 15) for European and Los Angeles laurels. Close out with the June 30 cluster â SDAFF, AI Artist Festival, GAMFF â for Asian regional exposure and Korean DDP facade screening. Total entry fee budget for this seven-festival stack is roughly $80â$140 depending on which tiers you hit, with three of the seven being completely free (Reply AIFF, SDAFF, AI Artist Festival). Constraints: keep runtime under 5 minutes to satisfy all eligibility windows (BAIFF and Reply AIFF are strictest), produce at 16:9 1080p minimum with H.264 .mp4 delivery, and provide a 100â200 word director's statement disclosing AI tools used â every festival on this list requires AI tool disclosure on the entry form. For filmmakers using Runway Gen-3 or Gen-4, Sora 2, Kling 2.1, Veo 3.1, Pika 2.5, Luma Ray, MidJourney V7 video, or Higgsfield, all seven festivals explicitly accept your toolchain. Race the AIFFI RoatÃ¡n deadline first if you can â it closes May 31 â then roll straight into the June calendar." },
    ],
    ruminatex: true,
    ruminatexNote: 'Brands looking to commission cinematic AI content for campaigns rather than enter festival competitions can work with Ruminatex, which produces AI-native commercial content for forward-thinking brands.',
    faqs: [
      { q: 'What is the earliest June 2026 AI film festival deadline?', a: 'The earliest June 2026 deadline is Reply AI Film Festival on June 1, 2026 at 23:59 CEST. Reply AIFF is the largest June-closing AI film festival by prize pool â â¬30,000+ split across â¬8,000 / â¬5,000 / â¬2,000 podium prizes plus the AI for Good Award (powered by the ITU) and the Reply AI Studios Grand Prix. The festival premieres in Venice between September 2â12, 2026 in conjunction with the Venice International Film Festival. Submission is free via FilmFreeway.' },
      { q: 'Which June 2026 AI film festivals are free to enter?', a: 'Three of the eight major June 2026 AI film festivals are completely free to enter: Reply AI Film Festival (June 1 deadline, â¬30K+ prize pool, FilmFreeway), Seoul Design AI Film Festival (June 30 deadline, ~$18K total prize pool, direct submission via the Seoul Design Foundation), and the AI Artist Festival 5th Season (June 15 deadline, China/global, FilmFreeway). The remaining June deadlines â OMNI Hyperphantasia, AI Global Film Festival LifeArt, BAIFF Burano, GAMFF â charge tiered submission fees ranging from approximately $10 to $40.' },
      { q: 'Can I submit a Sora or Veo 3 film to June 2026 AI festivals?', a: 'Yes â all eight major June 2026 AI film festivals explicitly accept OpenAI Sora, Sora 2, Google Veo 3, and Veo 3.1 submissions. Reply AIFF, OMNI Hyperphantasia, BAIFF, AI Artist Festival, SDAFF, GAMFF, AI Global Film Festival LifeArt, and the closing-soon AIFFI RoatÃ¡n are all tool-agnostic and welcome any AI tool â Runway Gen-4, Sora 2, Veo 3.1, Kling 2.1, Pika 2.5, Luma Dream Machine, MidJourney V7 video, Higgsfield, Hailuo, Wan, Hunyuan, Seedance â or hybrid pipelines. Disclosure of which AI tools were used is required on every entry form.' },
      { q: 'What is the largest cash prize among June 2026 AI film festival deadlines?', a: 'The Reply AI Film Festival offers the largest single first-place cash prize among June-closing AI festivals â â¬8,000 for first place â and the largest overall cash prize pool at â¬30,000+. The Seoul Design AI Film Festival (SDAFF) has the largest free-entry total prize pool at KRW 24,000,000 (â$18,000), with a KRW 10,000,000 grand prize. For larger prize pools later in 2026, look beyond June: Future Vision XPRIZE (August 15, $3.5M) and Astana AI Film Festival (August 31, $1M) are the biggest open 2026 contests overall.' },
      { q: 'How many AI film festivals can I enter with one short film in June 2026?', a: 'A single AI short film between 90 seconds and 5 minutes can typically be submitted to seven of the eight June-closing AI film festivals simultaneously: Reply AIFF, OMNI Hyperphantasia, AI Global Film Festival LifeArt, BAIFF Burano, AI Artist Festival, SDAFF, and GAMFF. None of these festivals have exclusivity clauses or premiere requirements that block simultaneous submission. Standard requirements across all seven: 16:9 1080p minimum, H.264 .mp4 delivery, AI tool disclosure on the entry form, and a 100â200 word director\u2019s statement.' },
      { q: 'Where do I track AI film festival deadlines beyond June 2026?', a: 'aifilmcontests.com maintains a live, daily-updated database of every open AI film contest globally, sortable by deadline, prize, country, and tools accepted. After June, the next major deadline cluster is the August 15 trio â Future Vision XPRIZE ($3.5M), Austin AI Film Festival, and the Artificial Intelligence Media Festival (AIMF) â followed by August 31 with Astana AI Film Festival ($1M), Silicon Valley AI Film Festival (SVAIFF Dolby Theatre), Sparknify Human vs. AI, and AI.motion Milan. Subscribe to daily deadline reminders via aifilmcontests.com.' },
    ],
  },

  'how-to-submit-to-reply-ai-film-festival-2026': {
    title: 'How to Submit to Reply AI Film Festival 2026: Deadline, Prizes & Step-by-Step Guide Before June 1',
    description: 'How to submit to the Reply AI Film Festival 2026 before the June 1 deadline. Full guide: prize structure (â¬30,000+, Venice premiere with Mastercard), team rules (1-8 members), jury (Gabriele Salvatores, Catherine Hardwicke, Rob Minkoff), eligibility, special awards (AI for Good, Reply AI Studios Grand Prix), and how aiff.reply.com submission actually works.',
    keywords: 'how to submit Reply AI Film Festival, Reply AI Film Festival 2026, Reply AIFF deadline, Reply AI Film Festival submission, Reply AI Film Festival Venice, Reply AI Film Festival prize, Imaginatio Nova theme, Reply Mastercard AI film, aiff.reply.com, Reply AI Studios Grand Prix, Gabriele Salvatores jury',
    datePublished: '2026-05-26',
    intro: "The Reply AI Film Festival 2026 submission deadline is 23:59 CEST on June 1, 2026, leaving you less than a week from this article to upload via aiff.reply.com. The third edition runs under the theme \"Imaginatio Nova\" with a prize pool above â¬30,000, a Venice premiere co-hosted by Reply and Mastercard during the 83rd Venice International Film Festival (September 2-12, 2026), and a star jury led by Academy Award winner Gabriele Salvatores. Entry is free, open worldwide to anyone 18+ on submission day, films run 1-40 minutes, teams can have 1-8 members, and the same individual can join multiple teams to submit different shorts. This guide walks through everything: deadline mechanics, prize tiers, eligibility, jury composition, the two special awards (AI for Good in partnership with the UN's ITU, and the new Reply AI Studios Grand Prix), the aiff.reply.com submission flow, what won in 2025, and a last-week strategy for choosing your AI toolchain before the clock runs out.",
    sections: [
      {
        h: 'The Submission Window That Closes June 1, 2026',
        body: "Reply AI Film Festival 2026 submissions close at 23:59 CEST on Monday, June 1, 2026 â a hard deadline confirmed in the official Terms & Conditions (TC_AiFilmFestival_final.pdf) and Reply's March 19 announcement under the \"Imaginatio Nova\" theme. You can update your uploaded file as many times as you want until that moment; only the latest version will reach the jury, so iterating during the final 48 hours is encouraged rather than penalized. There is no entry fee. The festival is hosted on the dedicated platform aiff.reply.com, not on FilmFreeway, though Reply does maintain a FilmFreeway listing for discovery purposes. Reply announced the 2026 edition on March 19, 2026, with submissions opening immediately; the jury was announced on April 29, 2026. From submission close on June 1, Reply uses June and July to long-list and shortlist, typically narrowing to ten finalists announced in August before the Venice premiere event in September. If you miss June 1, the next major free-entry European AI festival on aifilmcontests.com is the Bucharest AI Film Festival (BAIFF) â but its deadline window is narrower and the prize pool is smaller."
      },
      {
        h: 'Imaginatio Nova: What the 2026 Theme Actually Means',
        body: "\"Imaginatio Nova\" is Reply's invitation to explore a new phase of human imagination where creativity is renewed through technology rather than displaced by it. In practical jury terms, the theme rewards work that uses generative AI tools â Sora, Runway Gen-4, Veo 3, Kling 2.1, MidJourney V7 video, Higgsfield, Luma Ray 2, Pika 2.5 â to surface ideas a fully human production pipeline could not have arrived at. Compare this with the 2024 theme (\"Yesterday's Tomorrow\", which rewarded retro-future aesthetics) and 2025's \"Generation of Emotions\" (which favored emotionally resonant narrative shorts like winning entry \"Love at First Sight\"): the 2026 theme is broader and more abstract, opening the field to surrealism, philosophical sci-fi, abstract visual essays, and hybrid live-action plus AI work. According to Reply's official theme statement, \"Imaginatio Nova\" asks filmmakers to render imagined worlds that feel new â not familiar genre exercises with AI veneer. If your concept could have been made by a 2018 indie team with a green screen, the jury will likely deprioritize it. If it could only exist because diffusion models, neural radiance fields, or LLM-driven narrative scaffolding made it possible, it fits."
      },
      {
        h: 'The â¬30,000+ Prize Stack: Exactly How the Money Pays Out',
        body: "The Reply AI Film Festival 2026 reward pool exceeds â¬30,000 and breaks down as follows according to the official 2026 Terms & Conditions: â¬8,000 for the first-place short film, â¬5,000 for second place, and â¬2,000 for third place â â¬15,000 in tiered cash, plus the in-kind value of two more category awards, finalist travel, and accommodation. Reply covers round-trip travel to Venice plus two nights of accommodation for all ten finalists (and one teammate per finalist team where applicable), which based on Lido di Venezia rates during the Mostra translates to roughly â¬1,500-â¬3,000 of additional value per finalist. The Reply AI Studios Grand Prix, new in 2026, is awarded on top of the placement prizes and recognizes the finalist with the most sophisticated end-to-end AI production workflow â model integration, post-production polish, and technical control. The AI for Good Award, run in partnership with the International Telecommunication Union (ITU), is separate again and routes its four selected short films into the AI for Good Summit 2026 screening in Geneva (July 7-10, 2026), which is the closest thing to UN-level distribution exposure that any AI film festival offers. Compared with the Runway AI Film Festival's $135,000+ pool (US-centric, Lincoln Center premiere) and the Astana AI Film Festival's $1,000,000 prize fund (Kazakhstan-based), Reply sits in the middle on raw cash but leads on European prestige through its Venice co-location."
      },
      {
        h: 'Eligibility, Team Composition, and Film Length Rules',
        body: "Reply AI Film Festival 2026 is open to anyone aged 18 or older on the submission deadline (June 1, 2026) from any country â no residency restriction, no professional credential required, no membership in a film body. You can participate solo or as a team of up to 8 members, registered jointly via the \"Team up\" function on aiff.reply.com. Each team submits one short film, but a single person can join multiple teams and therefore appear on multiple competing entries. Film length is bounded between 1 minute and 40 minutes; both extremes have been used in past finalists, though most winners cluster in the 3-10 minute range. The film must use AI tools somewhere in production â generative video, generative audio, AI-assisted editing, voice cloning, image-to-video conversion, AI-assisted screenwriting, post-production upscaling, or any combination â but Reply does not require 100% AI generation. Hybrid workflows are explicitly welcomed, and you will be asked to fill in a production-process declaration explaining how AI tools were used at each stage from screenplay to post. Subtitle requirement: any non-English audio must carry English subtitles. Unlike FilmFreeway-hosted competitions, there is no premiere status restriction â your film can already have screened elsewhere."
      },
      {
        h: 'The 2026 Jury: Salvatores, Hardwicke, Minkoff, and Why It Matters',
        body: "Reply announced the 2026 jury on April 29, 2026. Leading the panel is Gabriele Salvatores, an Academy Award winner for Best Foreign Language Film with Mediterraneo (1991) and director of Nirvana, Siberian Education, and Napoli â New York. Joining him are Catherine Hardwicke (director of Twilight and Thirteen, an HFA-honored voice on visual subculture), Rob Minkoff (co-director of The Lion King, Stuart Little, Mr. Peabody & Sherman â a clear animation-friendly signal for AI animators), Jed Weintrob, Christina Lee Storm, Nils Hartmann (Sky Studios head of original drama productions Italy), Guillem Martinez Roura (ITU AI for Good Programme), Filippo Rizzante (Reply CTO), Giacomo Mineo (Reply AI Studios), Brian Welk (entertainment journalist), and Denise Negri. Salvatores's presence shifts the jury's center of gravity toward narrative cinema craft â pacing, character interiority, dramatic structure â and away from pure visual spectacle, which previously dominated AI festival juries dominated by VFX supervisors. The Minkoff/Hardwicke combination signals that genre work (animation, YA-coded narrative) will be evaluated seriously. Welk's inclusion means trade-press readability matters: a film that journalists can describe in one sentence has an edge. Tailor your one-line synopsis accordingly."
      },
      {
        h: 'The Two Special Awards: AI for Good (ITU) and Reply AI Studios Grand Prix',
        body: "Beyond the three placement prizes, the 2026 edition offers two parallel awards filmmakers can target. The AI for Good Award, promoted in collaboration with the United Nations' International Telecommunication Union, goes to the short film that best highlights the UN Sustainable Development Goals through AI-assisted storytelling. The ITU selects four short films from the Reply candidate pool to screen during the AI for Good Summit 2026 in Geneva (July 7-10, 2026), which means you receive distribution exposure ahead of the September Venice premiere if you place here. To compete for this award, your synopsis should explicitly map your film to at least one of the 17 SDGs â climate action, gender equality, quality education, peace, sustainable cities are recurring favorites at AI-for-Good programming. The Reply AI Studios Grand Prix is new in 2026 and rewards \"exceptional technical mastery and innovative implementation of AI throughout the creative workflow,\" per Reply's official statement. Think of it as a craft prize aimed at filmmakers who go beyond off-the-shelf generation â custom LoRAs, ControlNet-driven shot consistency, multi-model pipelines, AI-driven color, AI-cleaned VFX comping. Document your toolchain in the submission form; the jury for this award includes Reply CTO Filippo Rizzante and Reply AI Studios lead Giacomo Mineo, both of whom read the technical declaration carefully."
      },
      {
        h: 'Step-by-Step: How to Actually Submit on aiff.reply.com',
        body: "The submission process runs entirely through aiff.reply.com, not Reply's main corporate site and not FilmFreeway. Step one: go to aiff.reply.com and click \"Team up.\" Choose \"Create new team\" if you're the team captain or \"Join existing team\" if a teammate has already registered. Step two: complete the team registration form â team name, captain contact, country, the list of all 1-8 members and their roles (director, writer, AI artist, editor, sound, producer). Step three: upload your short film. Reply accepts MP4 (H.264/H.265) at up to 4K resolution, with file size limits documented in the platform UI. Audio must be embedded; separate audio files are not accepted. Step four: complete the AI production declaration â which AI tools you used (Sora, Runway, Veo, Kling, Pika, Luma, MidJourney, Higgsfield, Hailuo, Suno, ElevenLabs, custom models, ComfyUI workflows, etc.), at which production stages, and a 200-400 word description of how human direction guided the AI tools. Step five: tag your submission for the AI for Good Award (yes/no) if you want to be considered. Step six: submit. You can re-upload the file or re-edit the declaration until 23:59 CEST on June 1. After that, the platform locks. Reply sends an automated email confirmation; if you don't receive one within 24 hours, check spam, then email aiff@reply.com directly."
      },
      {
        h: 'What Actually Won in 2025: Lessons from Love at First Sight',
        body: "The 2025 Reply AI Film Festival received over 2,500 submissions from 67 countries (up from 1,400 in 2024) and crowned \"Love at First Sight\" by Italian filmmaker Jacopo Reale as Grand Prize winner with â¬8,000. The film tells a quiet story of a young shepherd encountering a girl who silently observes him from a hill â almost no dialogue, no spectacle, just emotional restraint rendered through diffusion-model-generated frames. Second place went to Mark Wachholz's \"The Cinema That Never Was\"; third went to Andrea Lommatzsch's \"Un Reve Liquide.\" Marcello Junior Costa took the 2025 Lexus Visionary Award with \"Instinct,\" a fully AI-generated work structured like a traditional film, and Shanshan Jiang's \"Clown\" won AI for Good. Three patterns emerged. First: emotional restraint outperformed maximalism â quiet character moments scored higher than spectacle-driven sci-fi. Second: traditional film grammar (shot/reverse-shot, three-act structure, motivated edits) lifted otherwise rough AI footage. Third: human craft showed through â color grading, sound design, music score â separating finalists from also-rans. For 2026 under \"Imaginatio Nova,\" expect the jury to want both: emotional restraint AND world-building that feels new. Salvatores's auteur sensibility will reinforce the narrative-discipline bar."
      },
      {
        h: 'Final-Week Strategy: Picking the Right AI Toolchain for June 1',
        body: "With less than a week to deadline, your toolchain choice is now a logistics problem. If you have less than 72 hours of production runway, prioritize generators with the fastest iteration loops: Runway Gen-4 Turbo, Luma Ray 2 Flash, and Kling 2.1 Standard all deliver near-real-time 5-10 second clips that you can stitch into a 3-minute short. If you have 4-7 days, the higher-cost generators become viable: Sora 2 Pro (text-to-video, ~30s per 10-second clip at 1080p), Veo 3.1 (Google's flagship, strongest audio-sync), and Kling 2.1 Master open up. For character consistency across shots â the single biggest jury complaint about AI films â combine MidJourney V7 character references with Runway Act-Two or Higgsfield Soul to lock identity. For voice and dialogue, ElevenLabs v3 and Suno v5 handle dubbing and original score respectively. Document everything in your declaration: Reply's CTO Rizzante explicitly reads the technical write-up. A common 2025 finalist stack was MidJourney for stills, Runway for motion, ElevenLabs for voiceover, Suno for score, DaVinci Resolve for color, and a custom ComfyUI pass for upscaling. Whatever you assemble, render at 1080p minimum (4K preferred for the Venice big-screen premiere), export H.264 at 10-15 Mbps, and upload by Saturday May 30 to leave 48 hours of buffer for upload retries before the platform locks Monday at midnight CEST."
      }
    ],
    ruminatex: false,
    faqs: [
      {
        q: 'What is the submission deadline for Reply AI Film Festival 2026?',
        a: "The Reply AI Film Festival 2026 submission deadline is 23:59 CEST on Monday, June 1, 2026, as confirmed in the official Terms & Conditions document published on challenges.reply.com. Submissions are accepted exclusively through aiff.reply.com, not via FilmFreeway. You can update your uploaded film and production declaration as many times as you want until that deadline â only the most recent version will be evaluated by the jury. Reply does not extend deadlines: in past editions, the 2025 extension to June 2 at 23:59 CEST was announced before, not after, the original deadline."
      },
      {
        q: 'How much prize money does the Reply AI Film Festival 2026 award?',
        a: "The Reply AI Film Festival 2026 distributes a total prize pool of over â¬30,000. The cash tier is â¬8,000 for the first-place short film, â¬5,000 for second, and â¬2,000 for third. On top of those placements, the AI for Good Award (run with the UN's ITU) selects four films for screening at the AI for Good Summit 2026 in Geneva (July 7-10, 2026), and the new Reply AI Studios Grand Prix recognizes the finalist with the most sophisticated AI production workflow. All ten finalists also receive round-trip travel and two nights of Venice accommodation covered by Reply, worth an additional â¬1,500-â¬3,000 per finalist."
      },
      {
        q: 'Who is on the Reply AI Film Festival 2026 jury?',
        a: "The 2026 jury, announced on April 29, 2026, is led by Academy Award winner Gabriele Salvatores (Mediterraneo, Nirvana, Napoli â New York). Members include Catherine Hardwicke (Twilight, Thirteen), Rob Minkoff (The Lion King, Stuart Little), Jed Weintrob, Christina Lee Storm, Nils Hartmann (Sky Studios Italy), Guillem Martinez Roura (ITU's AI for Good Programme), Filippo Rizzante (Reply CTO), Giacomo Mineo (Reply AI Studios), entertainment journalist Brian Welk, and Denise Negri. The jury evaluates submissions on three criteria: creativity, production quality, and innovative use of AI across screenplay, production, and post-production stages."
      },
      {
        q: 'Is there an entry fee for the Reply AI Film Festival?',
        a: "No. The Reply AI Film Festival 2026 has no entry fee â submission via aiff.reply.com is completely free regardless of country of origin, team size (1-8 members), or film length (1-40 minutes). This makes Reply one of the highest-prize-to-zero-cost AI film competitions in the world, alongside the Astana AI Film Festival in Kazakhstan ($1,000,000 pool, free) and the Runway Hundred Film Fund. Free entry is the explicit policy Reply has held since the inaugural 2024 edition."
      },
      {
        q: 'What AI tools are allowed for Reply AI Film Festival submissions?',
        a: "Any AI tool, in any combination, at any stage of production. Reply explicitly accepts work made with OpenAI Sora 2, Runway Gen-3 and Gen-4, Google Veo 3 and 3.1, Kling 2.1, Pika 2.5, Luma Ray 2 and Dream Machine, MidJourney V7 (including its new video mode), Higgsfield, Hailuo, ElevenLabs (voice), Suno (music), Stable Diffusion derivatives, ComfyUI workflows, and any custom or open-source model. Films are not required to be 100% AI-generated â hybrid live-action plus AI is fully eligible â but you must complete the production declaration explaining how AI tools were used at each stage from screenplay through post-production."
      },
      {
        q: 'Where and when is the Reply AI Film Festival 2026 premiere held?',
        a: "The Reply AI Film Festival 2026 premiere takes place in Venice, Italy, during the 83rd Venice International Film Festival (Mostra Internazionale d'Arte Cinematografica), which runs from September 2 to September 12, 2026, on the Lido di Venezia. The Reply AI Film Festival award ceremony is hosted by Reply and Mastercard at the Mastercard Priceless Lounge inside the Hotel Excelsior â the same venue as the 2025 ceremony where Jacopo Reale's \"Love at First Sight\" won the Grand Prize. All ten finalists are flown in with two nights of accommodation covered. The exact ceremony date within the September 2-12 window will be announced when finalists are revealed in August 2026."
      },
      {
        q: 'Can a single person submit more than one short film to Reply AIFF 2026?',
        a: "Yes, indirectly. Each team (1-8 members) can submit only one short film, but a single person can join multiple teams and therefore appear on multiple competing entries. If you want to submit three different shorts as the director, you need three different teams â each with its own captain, registration, and team name on aiff.reply.com. You are allowed to be a member of as many teams as you want. The jury evaluates each submission on its own merits regardless of overlapping personnel, so submitting two strong films through two teams roughly doubles your chance of reaching the ten-finalist shortlist."
      }
    ]
  },

  'how-to-submit-to-berlin-ai-film-festival-2026': {
    title: "How to Submit to the Berlin AI Film Festival 2026: Deadlines, Fees, Categories and Step-by-Step Guide (2nd Edition)",
    description: "The Berlin AI Film Festival 2026 (2nd edition) submission guide: every deadline tier from earlybird March 31 through the December 31, 2026 extended close, $10-$40 fee schedule, Best AI Film and Best Mixed AI Film award categories, FilmFreeway workflow at filmfreeway.com/AIBerlin, and the February 9-11, 2027 festival in Berlin, Germany.",
    keywords: "Berlin AI Film Festival 2026, AI Berlin festival submission, how to submit Berlin AI film, Berlin AI Film Festival deadline, AI film festival Berlin 2027, FilmFreeway AIBerlin, Best AI Film Berlin, Best Mixed AI Film, hybrid AI film festival, Berlin AI Film Festival entry fee, AI film festival Germany",
    datePublished: "2026-05-27",
    intro: "The Berlin AI Film Festival 2026 is the second edition of a Berlin-based, FilmFreeway-managed competition for both 100 percent AI-generated and AI-hybrid films, with submissions open from February 1, 2026 through an extended December 31, 2026 deadline, entry fees that climb from $10 at earlybird to $40 at the final tier, and the live festival running February 9 to 11, 2027 in Berlin, Germany. Submissions are accepted through one channel only: filmfreeway.com/AIBerlin. The festival awards three prizes by category - Best AI Film for fully AI-generated work, Best Mixed AI Film for hybrid live-action and AI work, and a Jury Special Mention - alongside category awards across short film, feature, experimental, animation, and documentary. This guide walks through every deadline tier, eligibility rule, award category, and the FilmFreeway workflow step by step so you can ship your submission before the next tier increase and avoid the most common reasons films get cut at the first jury pass.",
    sections: [
      {
        h: "The Berlin AI Film Festival 2026 in One Snapshot: Dates, Venue, and Why It Matters",
        body: "The Berlin AI Film Festival is now in its second edition after a 2026 inaugural year, and it has positioned itself as one of three European AI film festivals running on FilmFreeway alongside Burano BAIFF in Italy and Bucharest BAIFF in Romania. The 2026 submission window runs from February 1, 2026 to December 31, 2026 in five tiered deadlines, with the live festival event held February 9 to 11, 2027 in Berlin, Germany. The notification date for selected filmmakers is January 31, 2027 - roughly nine days before opening night. Berlin matters in the AI festival map because it is the only AI-dedicated festival running in Germany, the country where the Berlinale (Berlin International Film Festival) became, in 2026, the first major-market festival to ask every submitter the question 'Have you used AI in any way in the making of this?' on its official entry form. The Berlinale uses the data only for research and has not banned AI, but the proximity matters: filmmakers who screen at the Berlin AI Film Festival in February 2027 get a small but real adjacency to the Berlinale industry programming running the same month at Potsdamer Platz. The festival is organized through the AIBerlin FilmFreeway listing and accepts submissions in five categories: Short Film, Feature, Experimental, Animation, and Documentary."
      },
      {
        h: "Eligibility: Who Can Submit, and What Counts as an 'AI Film'",
        body: "The Berlin AI Film Festival accepts films of any genre and length that use artificial intelligence in any part of their creative process - scriptwriting, image generation, sound design, editing, character consistency - or that address AI as a theme or subject. There is no national restriction and no producer-credits requirement, which separates Berlin from European festivals like the Cannes Lions adjacent Luma Dream Brief or the Reply AI Film Festival, both of which have tighter eligibility scaffolds. The festival splits its competitive program into three internal classifications. Fully AI-Generated Films are works where the moving image and audio come from AI tools like OpenAI Sora 2, Runway Gen-4, Google Veo 3.1, Kling 3.0, Luma Ray, Pika 2.5, Higgsfield, or Hailuo - with the human creative work concentrated in prompting, editing, story structure, and direction. Films About AI are documentaries or narratives that explore artificial intelligence thematically, regardless of whether AI was used to make them. Experimental and Hybrid Works covers cross-media, interactive, or installation-based projects involving AI - this is the only path for filmmakers who want to enter VR, XR, or browser-based interactive work. Eligibility is open internationally, but every submission must include a streamable online screener of the full film. FilmFreeway does not accept DVD, Blu-ray, or file uploads as a screener path. The minimum required deliverable is a working private Vimeo or YouTube link with the password embedded in the submission form, plus a synopsis, full credits, and at least one promotional still."
      },
      {
        h: "The Five Deadline Tiers and What Each Costs",
        body: "Pricing on the Berlin AI Film Festival follows the standard FilmFreeway tiered escalator. The Opening Date is February 1, 2026, at which point submissions go live at the earlybird rate of $10. The Earlybird Deadline closes March 31, 2026 - if you finish your film before April Fool's Day, you pay the lowest fee in the festival's structure. The Regular Deadline runs from April 1 to May 31, 2026 at a higher tier. The Late Deadline runs from June 1 to July 31, 2026. The Extended Deadline runs from August 1 to December 31, 2026 and tops out at $40 for standard submissions. FilmFreeway Gold members receive additional discounts at each tier, and FilmFreeway often runs 25 percent and 50 percent discount codes for AI festivals in the back half of the year. The cheapest path is to finish before March 31 and submit at earlybird; the most expensive is to wait until late December, when you will pay roughly four times what an earlybird entry costs for identical jury treatment. Notification for all tiers happens on a single date: January 31, 2027. Submitting earlier does not improve your selection odds - the jury reads everything in the final two months before notification - but it does cut your fee by up to 75 percent. Entry fees are non-refundable across all FilmFreeway festivals, including Berlin."
      },
      {
        h: "Categories, Awards, and the 'Mixed AI' Distinction That Defines Berlin",
        body: "The Berlin AI Film Festival is one of only a handful of AI festivals globally that explicitly carves out a competitive lane for hybrid films - it awards Best Full AI Film for work where 100 percent of the moving image is AI-generated, and Best Mixed AI Film for work where AI is meaningfully integrated alongside live-action footage. That distinction matters because it is the opposite of the Sparknify Human vs AI Film Festival, where hybrid submissions are explicitly disqualified, and it is more generous than the AI Film Awards at Cannes 2026, which restrict the Short Film category to 100 percent AI-generated work only. Berlin's third award is the Jury Special Mention, which is typically used to recognize technical innovation or thematic ambition that did not place first in either main lane. Cash prize amounts for the 2026 second edition are listed as TBA on the official festival page - Berlin has historically been a prestige-and-laurels festival rather than a cash-heavy one, in contrast to the WAIFF (€10,000 Grand Prize in Cannes) or the Astana AIFF ($1,000,000). Selected films receive theatrical screening in Berlin across the three-day February 2027 event, a FilmFreeway 'Official Selection' laurel, and exposure during Berlinale week - which is arguably worth more than a small cash prize for filmmakers building a festival run. Categories on the submission form are Short Film, Feature, Experimental, Animation, and Documentary; the jury may reclassify your film if your selected category does not fit the work."
      },
      {
        h: "The FilmFreeway Submission Workflow, Step by Step",
        body: "Submission is single-channel - filmfreeway.com/AIBerlin - and the workflow takes roughly fifteen minutes if your project is already set up on FilmFreeway. Step one: create a project on FilmFreeway if you have not already, and fill in the project profile completely (title, synopsis, language, country of origin, completion date, runtime, director and producer credits, at least one still). FilmFreeway's own best-practice guidance is to fill in every field on the project profile, because incomplete projects get screened out by some festivals before they reach a jury reader. Step two: upload your screener as a private Vimeo or YouTube link and embed the password in the FilmFreeway project page so the AIBerlin jury can view it without contacting you. Step three: navigate to filmfreeway.com/AIBerlin and click Submit Now. Step four: choose your category. Berlin's categories - Short Film, Feature, Experimental, Animation, Documentary - each have their own fee at each deadline tier. Submit to the category that best matches your finished work; if your film genuinely sits in two categories, FilmFreeway guidance is to pick the narrower documentary, animation, or narrative category over the broader experimental category, since juries will reclassify upward if needed. Step five: confirm the deadline tier you are paying for - the FilmFreeway summary screen shows the price and the next price-up date. Step six: pay and submit. Step seven: bookmark the project page so you can refresh status as the January 31, 2027 notification date approaches."
      },
      {
        h: "Selection Criteria: What the Berlin Jury Actually Rewards",
        body: "The festival's official selection committee evaluates submissions on three published axes: artistic quality, innovation, and relevance to the festival's theme. In practice, looking at the first edition's selections and at festival peer feedback collected on FilmFreeway, three additional signals matter. First, technical control with AI tools - jurors look for evidence that the filmmaker is driving the model rather than letting the model dictate the look. Films that read as default Sora 2 or default Runway Gen-4 aesthetic - that 'AI sheen' - typically score lower than films where the prompting, post-production, and edit decisions create a distinct visual signature. Second, narrative legibility - the festival prizes work where a viewer can follow what is happening, who the characters are, and what the stakes are. Pure abstraction can win Experimental, but it rarely wins Best AI Film or Best Mixed AI Film. Third, thematic seriousness - work that uses AI to interrogate AI itself, or to address subjects (memory, identity, embodiment, displacement) that gain new shape under generative tools, tends to be programmed over work that uses AI as a stylistic substitute for what could have been shot live. The jury's published evaluation language - 'pioneering' and 'groundbreaking' - signals their preference: they are looking for films that could not exist outside the AI moment, not for traditional filmmaking warmed over with generative pixels."
      },
      {
        h: "Tool Strategy: Sora 2, Runway Gen-4, Veo 3.1, Kling 3.0 and What Berlin Selects",
        body: "Berlin allows any AI tools - the festival's stated policy is 'Any AI tools - either 100 percent AI-generated or meaningful AI integration.' That openness puts the strategic question back on the filmmaker: which tool stack gives you the best shot at Best AI Film versus Best Mixed AI Film? For fully AI-generated submissions in 2026, the dominant choices are Google Veo 3.1 (highest prompt adherence, native audio, 4K landscape and portrait output), OpenAI Sora 2 (until OpenAI's announced sunset - the Sora web and app experiences were planned for discontinuation on April 26, 2026, with the API closing September 24, 2026), Runway Gen-4 and Gen-4.5 (the pro choice for camera-move control, motion brush, and reference-driven character consistency), Kling 3.0 (cinematic lighting, fluid simulation, and a multi-shot storyboard mode at roughly 65 percent the cost of Sora and 44 percent the cost of Runway), and Seedance 2.0 (multi-shot native generation with synchronized audio in a single pass - the strongest narrative-driven model in 2026). For Mixed AI Film entries, the typical winning workflow is live-action capture combined with Runway Gen-4 inpainting, Topaz upscaling, ElevenLabs voice work, Suno or Udio scoring, and CapCut or DaVinci Resolve finishing. The festival does not require tool disclosure on the submission form, but the EU AI Act Article 50 disclosure requirement does apply to the film itself once you screen it publicly in Europe."
      },
      {
        h: "EU AI Act Article 50: Disclosure Requirements That Apply to Your Submission",
        body: "Every filmmaker submitting to the Berlin AI Film Festival 2026 should know that EU AI Act Article 50 - the deepfake and synthetic media disclosure rule - became fully enforceable on August 2, 2026, six months before the festival's live event. The law requires a clear notice to viewers when AI is used to generate or change an image, audio, or video in a way that could be mistaken for real people, events, or places. For festival submissions, the practical effect is that your film should carry an AI disclosure in either the opening titles, the end credits, or both. The EU legislator included a derogation for evidently artistic, creative, satirical, fictional, or similar works that permits the disclosure to be made in a way that does not hamper the display or enjoyment of the work - a card in the credits that reads 'This film was made with AI tools' or 'Generated in part with [tool list]' satisfies the rule. The Berlin AI Film Festival does not require AI disclosure on the FilmFreeway submission form, but the legal risk of screening an undisclosed AI film in Germany after August 2, 2026 sits with the filmmaker, not the festival. Per the German legal commentary published by Bird and Bird in 2026, the disclosure also serves as evidence in any subsequent copyright dispute over AI-generated content. Add the disclosure card; it is one line of text and it removes a meaningful legal exposure for almost no creative cost."
      },
      {
        h: "Where Berlin Sits on the European AI Festival Circuit",
        body: "If you are planning a 2026-2027 European festival run for one AI film, Berlin sits at the end of the calendar, which makes it a natural finishing slot for a film that has already screened earlier in the year. The European AI festival circuit opens roughly in March with the +RAIN Film Festival in Barcelona (free entry, €5,000 prize pool, screened at UPF Poblenou and CCCB Theatre), then runs through the Luma AI Dream Brief at Cannes Lions in late March, World AI Film Festival (WAIFF) in Cannes in April (€10,000 Grand Prize at the Palais des Festivals), AI Movie Awards Mallorca in April, Reply AI Film Festival in Venice in June (€30,000-plus prize stack, Mastercard partnership, three-day festival on the Lido during the Venice Biennale), Bucharest BAIFF in May (€2,500 cash prize), the two Burano AI Film Festivals in June and July (Burano, Venice, Italy), Bochnia International AI Film Festival in Poland in August ($2,500 USD cash pool), AI.motion at IULM Milan in August (RAI Cinema Channel Prize), AI Film Fest Monaco in December ($10,000), and then Berlin in February 2027 to close the cycle. Submitting to Berlin earlybird (by March 31, 2026) makes the most sense if you are running a single festival film through the entire calendar - the FilmFreeway concurrent-submission rules at Berlin do not require the film to be a Berlin premiere. For deeper context on each of these festivals, see our guide to AI film festivals in Europe and our roundup of AI film festivals with million-dollar prizes."
      }
    ],
    ruminatex: false,
    faqs: [
      {
        q: "What is the Berlin AI Film Festival 2026 deadline?",
        a: "The Berlin AI Film Festival 2026 has five tiered deadlines on FilmFreeway: Earlybird March 31, 2026, Regular May 31, 2026, Late July 31, 2026, and Extended December 31, 2026, with an Opening Date of February 1, 2026 and a Notification Date of January 31, 2027. The festival itself takes place February 9 to 11, 2027 in Berlin, Germany."
      },
      {
        q: "How much does it cost to submit to the Berlin AI Film Festival?",
        a: "Entry fees range from $10 at the Earlybird tier (closing March 31, 2026) to $40 at the Extended Deadline tier (closing December 31, 2026). FilmFreeway Gold members receive additional discounts at every tier. The exact fee depends on category - Short Film, Feature, Experimental, Animation, or Documentary - and on the deadline tier active when you submit. All entry fees are non-refundable per FilmFreeway policy."
      },
      {
        q: "Can you submit a hybrid live-action and AI film to the Berlin AI Film Festival?",
        a: "Yes. The Berlin AI Film Festival explicitly accepts both 100 percent AI-generated films and AI-hybrid works with meaningful AI integration. It is one of the few AI film festivals globally that awards a dedicated Best Mixed AI Film prize alongside Best Full AI Film, which makes it more hospitable to hybrid filmmakers than competitions like the Sparknify Human vs AI Film Festival (which disqualifies hybrid work) or the 100 percent AI category at AI Film Awards Cannes."
      },
      {
        q: "What AI tools are allowed at the Berlin AI Film Festival?",
        a: "Any AI tools are allowed. The official festival statement is 'Any AI tools - either 100 percent AI-generated or meaningful AI integration.' That covers OpenAI Sora 2, Runway Gen-4 and Gen-4.5, Google Veo 3.1, Kling 3.0, Luma Ray and Dream Machine, Pika 2.5, Higgsfield, Hailuo, Seedance 2.0, Adobe Firefly Video, Stable Diffusion Video, MidJourney V7 Video, ElevenLabs voice, Suno and Udio music, and any text-to-image or text-to-video model. The festival does not require tool disclosure on the FilmFreeway submission form, though the EU AI Act Article 50 disclosure rule applies to the film itself once you screen it in Europe."
      },
      {
        q: "Where is the Berlin AI Film Festival 2026 held?",
        a: "The festival is held in Berlin, Germany. The 2nd edition takes place February 9 to 11, 2027. The exact venue for the 2027 edition is announced closer to the event date through the official FilmFreeway page at filmfreeway.com/AIBerlin and through the festival's social channels. Berlin's selection as host city puts the festival in adjacency to Berlinale week, which runs in the same month at Potsdamer Platz."
      },
      {
        q: "What is the prize at the Berlin AI Film Festival 2026?",
        a: "The Berlin AI Film Festival awards Best AI Film, Best Mixed AI Film, and a Jury Special Mention, with category awards across Short Film, Feature, Experimental, Animation, and Documentary. Cash prize amounts for the 2026 second edition are listed as TBA on the official festival page. The festival has historically been a prestige and laurels event - selected filmmakers receive theatrical screening across the three-day February 2027 event in Berlin, a FilmFreeway 'Official Selection' laurel, and exposure during Berlinale week."
      },
      {
        q: "How does the Berlin AI Film Festival differ from the Berlinale?",
        a: "The Berlin AI Film Festival is a separate, AI-dedicated competition organized through FilmFreeway at filmfreeway.com/AIBerlin. The Berlinale (Berlin International Film Festival) is the 76-year-old Tier 1 international festival that awards the Golden Bear and accepts films of any production method - including AI - but does not run a dedicated AI competition. In 2026 the Berlinale began asking every submitter on the entry form 'Have you used AI in any way in the making of this?' as research only. Both festivals run in Berlin in February, but they are independent organizations with different juries, different selection criteria, and different audiences."
      }
    ],
    featuredContestIds: [
      "berlin-ai-film-festival-2026",
      "reply-ai-film-festival-2026",
      "burano-baiff-italy-2026",
      "baiff-2026",
      "ai-film-fest-monaco-2026"
    ]
  },
'how-to-submit-to-astana-ai-film-festival-2026': {
    title: "How to Submit to the Astana AI Film Festival 2026: $1,000,000 Prize, August 15 Deadline, Step-by-Step Guide",
    description: "How to submit to the Astana AI Film Festival (AAIFF) 2026 before the August 15 deadline. Full guide: $1,000,000 prize fund distributed across 25 finalists, free entry via YouTube link with #SpecialForAAIFF hashtag, two competitions (Thematic 'The Future Worth Living In' + Open), five Open-section awards (Direction, Visual Language, Story, Concept, Character), 10-minute Full AI rule, English-subtitle requirement, and the September 28 to October 1 Astana AI Week premiere.",
    keywords: "how to submit to Astana AI Film Festival, Astana AI Film Festival 2026, AAIFF submission, AAIFF deadline, Astana AIFF prize, $1 million AI film prize, Astana AI Week, Future Worth Living In, AAIFF YouTube submission, SpecialForAAIFF hashtag, Kazakhstan AI film festival, aaiff.ai submission",
    datePublished: "2026-05-29",
    intro: "The Astana AI Film Festival 2026 submission deadline is August 15, 2026, with submissions open since May 25, 2026 via a single public or unlisted YouTube link tagged #SpecialForAAIFF, entry is free, and the $1,000,000 total prize fund is distributed across roughly 25 finalists rather than awarded as a single jackpot. Founded as Kazakhstan's first international AI-only film festival, AAIFF 2026 runs September 28 to October 1, 2026 in Astana as part of Astana AI Week, programs two parallel competitions (a Thematic Competition tied to the annual brief \"The Future Worth Living In\" and an Open Competition that accepts films of any subject), caps runtime at 10 minutes, requires generative AI to be integral to creation (not just VFX or upscaling), and asks every team to declare its model and pipeline at submission. Selection narrows down to 25 winners total: 10 films in the Main (Thematic) section and 15 films in the Open section, with the Open section structured around five named craft awards for Best Direction, Best Visual Language, Best Story, Best Concept, and Best Character. Organizers expect roughly 3,000 applications, which means the per-film selection odds are favorable compared to the Runway AI Film Festival or Reply AIFF but the craft bar is set by an international jury of directors, producers, and creative-technology experts assembled by founders Aizatulla Hussain (Ozen media) and Almas Zhali (Brave Talents). This guide walks through every step: the May 25 to August 15 submission window, the YouTube delivery flow, the #SpecialForAAIFF hashtag requirement, the Thematic vs Open competition split, the five Open-section award definitions, the 10-minute Full AI rule, the English-subtitle obligation, the model and pipeline disclosure, and a tool-stack strategy for the final eight weeks before the platform locks at aaiff.ai.",
    sections: [
      {
        h: "The August 15 Deadline and Why AAIFF 2026 Matters",
        body: "The Astana AI Film Festival 2026 submission window opened on May 25, 2026 and closes at the end of August 15, 2026, leaving roughly eleven weeks from this article to film, finish, upload, tag, and submit. The Astana Times confirmed the dates in its April 2026 announcement of the festival, and the official AAIFF platform at aaiff.ai mirrors the 25.05.26 to 15.08.26 window. Why this festival matters: AAIFF is the first international AI-only film competition hosted in Central Asia, the prize pool is among the largest in the entire global AI festival landscape (alongside Future Vision XPRIZE's $3.5M and the Runway Hundred Film Fund's $5K-$1M per project), and the organizers have committed to distributing the $1,000,000 across multiple winners rather than concentrating it in a single Grand Prize. That distribution model means realistic submission expected-value is meaningfully higher than at festivals where one winner takes everything. The festival is part of Astana AI Week, an ecosystem event organized around Astana Hub that programs an AI-focused content conference, pitch sessions for creators and producers, and the four-day public screening run from September 28 to October 1, 2026 in Astana. Per Qazinform's April 22 press conference coverage, organizers expect approximately 3,000 applications worldwide. If you finish your short film between now and the second week of August, AAIFF should be the highest expected-value AI festival on your 2026 calendar."
      },
      {
        h: "Free Entry, YouTube Delivery, and the #SpecialForAAIFF Hashtag Rule",
        body: "AAIFF 2026 is free to enter. Submissions are accepted exclusively via a single YouTube link, posted either public or unlisted, with the password-equivalent access control handled by YouTube's unlisted setting rather than by a separate platform. Google Drive links with view access for anyone with the link are also accepted as a backup channel. There is one hard format rule that disqualifies more first-time submitters than any other: the YouTube video description must include the hashtag #SpecialForAAIFF. Entries posted without that hashtag in the description field are filtered out before reaching the jury. The hashtag should appear in the YouTube description (not the title, not the comments, not the video itself), and the platform parses for that exact string. After the YouTube link is posted, you submit through the official form on aaiff.ai, which requests the link, the project description, the team or solo creator credits, and the model and pipeline disclosure (which AI tools you used at which production stages). Unlike FilmFreeway-hosted competitions such as Berlin AI Film Festival or Burano BAIFF, you do not pay per submission tier, you do not face deadline escalators, and you do not need to maintain a FilmFreeway project profile. The single-link, single-form, free-entry model is closer to what Reply AI Film Festival does at aiff.reply.com than to the Cannes-circuit FilmFreeway model."
      },
      {
        h: "Thematic Competition vs Open Competition: How the $1M Splits",
        body: "AAIFF 2026 runs two parallel competitions and selects 25 finalists across both. The Thematic Competition selects 10 finalist films under the annual brief \"The Future Worth Living In\" and rewards works that present an original vision of the future shaped by artificial intelligence. The brief is intentionally broad to admit dystopia, utopia, post-scarcity, climate adaptation, embodiment, longevity, multi-planet, social-fabric speculation, and abstract philosophical work, but it asks filmmakers to render an imagined future, not a reference to the present moment. Films that read as commentary on 2026 AI culture (LLM jokes, deepfake satire, generative-art-discourse pieces) tend to be deprioritized in favor of work that pictures a world that does not yet exist. The Thematic Competition strongly favors original works made for the festival within the eligibility period and developed in response to the brief. The Open Competition selects 15 finalist films of any theme, including previously completed works and films that have already been programmed at other festivals or competitions, which makes it the natural pathway for filmmakers who already have a strong recent AI short and want to enter without re-cutting for the brief. The five named Open-section awards (Direction, Visual Language, Story, Concept, Character) function as craft categories, so a film that is structurally weak but visually astonishing can win Visual Language without contending for Best Direction. The 10-Thematic plus 15-Open structure means total finalist selection is 25 films from an expected 3,000 entries, or roughly 0.83 percent selection."
      },
      {
        h: "The Five Open-Section Awards: Direction, Visual Language, Story, Concept, Character",
        body: "The Open Competition's five named craft awards are how the prize money is distributed across the 15 Open-section finalists. Best Direction rewards the filmmaker who most clearly drives the AI tools rather than letting the tools dictate the look, with the jury reading the production declaration alongside the film to verify that creative decisions are human-led. Best Visual Language goes to the film that achieves a coherent, distinctive visual signature across shots, which in practice means consistent palette, lensing, lighting, and the absence of the default Sora 2 or default Runway Gen-4 aesthetic that the festival jury sees over and over. Best Story rewards narrative legibility and dramatic structure, with the bar set by traditional film grammar: a clear opening situation, a complication, an arc, and an ending that lands. Best Concept rewards the strongest single original idea, irrespective of whether the execution is the highest-craft in the field, which makes it the most accessible award for solo creators with limited generation budget. Best Character is the most distinctively AI-festival category: it rewards character consistency across shots, the believability of the character's interiority, and the use of AI tools (MidJourney V7 character references, Runway Act-Two, Higgsfield Soul, custom LoRAs) to lock identity across a 10-minute runtime. The five awards stack: a single film can theoretically win multiple categories if the jury reads it as outstanding on multiple craft axes, although in practice prize-distribution rules generally spread awards across more films to align with the festival's distribution philosophy."
      },
      {
        h: "Eligibility, Team Composition, and the 10-Minute Full AI Rule",
        body: "AAIFF 2026 is open globally with no national restriction and no professional credential requirement. Both professionals and amateurs of any age can enter, and submissions are accepted from teams and from individual creators on the same terms. Film runtime is capped at 10 minutes, which differs from Reply AI Film Festival's 1-to-40-minute range and is closer to the short-form windows at AIFFI and Bucharest BAIFF. The festival uses the phrase \"Full AI\" to describe the required AI integration: artificial intelligence must be the main technology used to make the film, not just a tool applied after live-action filming. In practice this means hybrid live-action plus AI films are eligible only if AI is the central creative engine rather than a post-production layer. Films built primarily on live-action capture with AI used for upscaling, color, or VFX cleanup will not satisfy the rule. The festival requires the team to declare which generative AI tools were used (OpenAI Sora 2, Runway Gen-4 or 4.5, Google Veo 3.1, Kling 3.0, Pika 2.5, Luma Ray 2, MidJourney V7, Higgsfield, Hailuo, Seedance 2.0, ElevenLabs, Suno, or any combination) and to describe the pipeline at each stage from screenplay through post-production. Films may be in any language but English subtitles must be embedded directly in the video; separate subtitle files (SRT, VTT) are not accepted. All contributors must be credited in the submission form, and the festival uses the credit list to determine team eligibility for accommodation and travel during the September 28 to October 1 event."
      },
      {
        h: "How the Prize Distributes and What Past AI-Film Money Tells Us to Expect",
        body: "AAIFF organizers have committed to spreading the $1,000,000 across multiple winners rather than handing it to a single Grand Prize taker. The exact per-award amount has not been published, but the structural logic of 25 finalists (10 Thematic plus 15 Open with five named craft categories) suggests a tiered distribution that pays a larger placement at the top of the Thematic Competition, mid-tier amounts to the five Open-section craft winners, and smaller distribution payments to the remaining finalists. By way of comparison: the Luma AI Dream Brief structured its $1,000,000 as a single Cannes Lions production prize judged by Nike and Wieden+Kennedy; the Reply AI Film Festival distributes its EUR 30,000+ pool as EUR 8,000, EUR 5,000, EUR 2,000 plus the new Reply AI Studios Grand Prix and the ITU AI for Good Award; Future Vision XPRIZE allocates its $3,500,000+ across milestone awards over a multi-year track. AAIFF's distribution model is closer to a festival-circuit grant program than to a single-winner brand contest, which favors filmmakers building a body of work and disfavors purely speculation-driven solo entries. Free entry plus a distributed prize plus a structured craft-category framework means expected value per submitted film is the highest of any free 2026 AI film festival. Organizers also program an AI-focused content conference and producer pitch sessions during the festival week, so a finalist screening at AAIFF carries real meet-and-greet value alongside the cash."
      },
      {
        h: "Step-by-Step: How to Actually Submit on aaiff.ai",
        body: "The submission process is short. Step one: finish your film, including English subtitles burned into the video, at a maximum runtime of 10 minutes, exported as MP4 (H.264) at 1080p minimum and 4K preferred for the festival's projection setup. Step two: upload to YouTube as Public or Unlisted, with the description field set to include the hashtag #SpecialForAAIFF on its own line. Without that hashtag the platform will not surface your entry to the jury. Step three: navigate to aaiff.ai and open the submission form. Step four: paste the YouTube link, complete the project description (we recommend 200-400 words covering concept, theme alignment to The Future Worth Living In if you are entering the Thematic Competition, and any production context), and credit every contributor. Step five: complete the AI tools and pipeline declaration, listing every model you used (Sora 2, Runway Gen-4, Veo 3.1, Kling 3.0, Pika 2.5, Luma Ray 2, MidJourney V7, Higgsfield, Hailuo, Seedance 2.0, ElevenLabs, Suno, custom LoRAs, ComfyUI workflows, etc.) and a brief description of how each was used. Step six: choose which competition to enter (Thematic or Open) or both if your work fits both. Step seven: submit and watch for the confirmation email. If you do not receive one within 24 hours, check spam, then email the festival via the contact form on aaiff.ai. Re-uploads to YouTube after submission are allowed, but the link in the AAIFF form is the link the jury will watch, so confirm that link still resolves before the August 15 deadline."
      },
      {
        h: "Tool Stack Strategy: Sora 2, Runway Gen-4, Veo 3.1, Kling 3.0, Seedance 2.0 for AAIFF",
        body: "With 11 weeks to the August 15 deadline and a 10-minute maximum runtime, the tool stack you pick will determine whether you finish at all. For full AI generation in 2026, the practical choices are Google Veo 3.1 (highest prompt adherence, native audio, 4K landscape and portrait output, strongest for the Thematic Competition's future-worth-living-in brief because it handles complex environments well), OpenAI Sora 2 (causal-logic prompting, strongest narrative coherence for the Best Story award track, with the caveat that the consumer Sora web and app were sunset on April 26, 2026 and the API closed September 24, 2026, so 2026 work has to route through partner platforms), Runway Gen-4 and Gen-4.5 (the strongest tool for camera-move control and reference-driven character consistency, which targets Best Direction and Best Character), Kling 3.0 (cinematic lighting and fluid simulation at roughly 65 percent the cost of Sora and 44 percent the cost of Runway, the budget choice for indie teams), and Seedance 2.0 (multi-shot native generation with synchronized audio in a single pass, the strongest narrative-driven model in 2026 for filmmakers who want to lock continuity across the full 10-minute runtime). For character consistency on a Best Character submission, combine MidJourney V7 character references with Runway Act-Two, or use Higgsfield Soul as a single-tool consistency engine. For audio, ElevenLabs v3 handles dialogue dubbing in any source language with English subtitles burned in, and Suno v5 generates original score. Document every model, every pipeline step, every prompt template iteration in the submission declaration: the jury reads this field carefully and rewards filmmakers who can articulate their craft."
      },
      {
        h: "Where AAIFF Sits on the Global AI Festival Map and What to Submit Alongside",
        body: "If your film is finished and eligible for AAIFF, it is almost certainly eligible for two or three other festivals on the same August timeline, and submitting to all of them roughly multiplies your expected value at no additional production cost. The Future Vision XPRIZE also closes on August 15, 2026 with a $3,500,000+ prize pool oriented around sci-fi and speculative AI filmmaking under the same future-facing brief umbrella as AAIFF's The Future Worth Living In. The Bochnia International AI Film Festival in Poland closes on the same August 15 date with a smaller $2,500 cash pool but a European festival laurel that complements an AAIFF screening. The Silicon Valley AI Film Festival (SVAIFF) Awards 2026 closes on August 31, 2026 with a Dolby Theatre screening prize. The Runway Hundred Film Fund (open year-round through December 31, 2026 with $5,000 to $1,000,000+ per project funding) and the Chroma Awards Season 2 ($175,000+ cash and over $1M in tool credits, deadline December 31, 2026) are the strongest two grant-style follow-up tracks for a film that places at AAIFF but does not win the top tier. For a deeper view of the global AI festival circuit, see our roundup of AI film festivals with million-dollar prizes (which covers AAIFF, Luma Dream Brief, Future Vision XPRIZE, and the Google Gemini 1M-class events) and our 2026 ranking of the best AI film festivals overall. If your film is more narrative or character-driven, also see our guide to how to submit to Reply AI Film Festival 2026 for the next major European deadline window after AAIFF closes."
      }
    ],
    ruminatex: false,
    faqs: [
      {
        q: "What is the submission deadline for the Astana AI Film Festival 2026?",
        a: "The Astana AI Film Festival 2026 submission deadline is August 15, 2026. Submissions opened on May 25, 2026 and the platform closes at the end of August 15, 2026. The festival itself runs September 28 to October 1, 2026 in Astana, Kazakhstan as part of Astana AI Week. Finalist notification happens between mid-August and late September. The submission form is hosted at aaiff.ai and accepts a single YouTube link plus the project description and AI tools and pipeline declaration."
      },
      {
        q: "How much prize money does the Astana AI Film Festival 2026 award?",
        a: "AAIFF 2026 awards a total of $1,000,000, making it one of the largest AI film prize pools in the world alongside Future Vision XPRIZE's $3.5M and the Luma AI Dream Brief's $1M. Unlike single-winner-takes-all contests, AAIFF organizers distribute the $1,000,000 across roughly 25 finalists: 10 films in the Thematic Competition and 15 films in the Open Competition. The exact per-award amount has not been published, but the structural logic suggests a tiered distribution with a larger top placement in the Thematic Competition and mid-tier amounts across the five named Open-section craft categories (Best Direction, Visual Language, Story, Concept, and Character)."
      },
      {
        q: "Is there an entry fee for AAIFF 2026?",
        a: "No. The Astana AI Film Festival 2026 has no entry fee. Submission via aaiff.ai is completely free regardless of country of origin, team size, or whether you submit to the Thematic Competition, the Open Competition, or both. This puts AAIFF in the same free-entry tier as the Reply AI Film Festival 2026 and the Bucharest BAIFF, and it is the largest free-entry AI film prize in the world. Free entry plus distributed prize money plus an expected 3,000 applications means selection odds (25 of 3,000) sit around 0.83 percent."
      },
      {
        q: "What is the maximum film length for AAIFF 2026?",
        a: "The maximum runtime for AAIFF 2026 is 10 minutes. There is no minimum runtime specified, so a 90-second short and a 9-minute 59-second short are both eligible. Films must be created entirely using AI as the main production technology, not just AI-assisted live-action footage. Both films in any language are accepted, but English subtitles must be burned directly into the video; separate subtitle files (SRT, VTT) are not accepted by the platform. Films must be uploaded to YouTube (Public or Unlisted), and the YouTube video description must include the hashtag #SpecialForAAIFF or the entry will not reach the jury."
      },
      {
        q: "What AI tools are allowed for AAIFF submissions?",
        a: "Any generative AI tool, in any combination, at any stage of production. Films can be made with OpenAI Sora 2, Runway Gen-4 and Gen-4.5, Google Veo 3 and Veo 3.1, Kling 2.1 and 3.0, Pika 2.5, Luma Ray 2 and Dream Machine, MidJourney V7 (including video mode), Higgsfield, Hailuo, Seedance 2.0, ElevenLabs (voice), Suno (music), Stable Diffusion derivatives, ComfyUI workflows, and custom open-source or in-house models. The only constraint is that AI must be the main technology used to make the film, not just an editing or VFX tool layered over conventional live-action footage. The submission form requires every team to declare which models and pipeline stages were used, so document your workflow as you build."
      },
      {
        q: "What is the theme of AAIFF 2026?",
        a: "The 2026 theme of the Thematic Competition is \"The Future Worth Living In.\" The brief invites filmmakers to present an original vision of the future shaped by artificial intelligence and to share how they imagine the world of tomorrow. Films entered to the Thematic Competition must be created within the eligibility window (May 25 to August 15, 2026) and developed specifically in response to this brief. The Open Competition has no thematic restriction and accepts films of any subject, including previously completed work, so filmmakers with a strong recent AI short can enter the Open Competition without re-cutting for the brief."
      },
      {
        q: "Where and when is the Astana AI Film Festival 2026 held?",
        a: "AAIFF 2026 is held in Astana, Kazakhstan from September 28 to October 1, 2026 as part of Astana AI Week. The four-day program includes film screenings, an AI-focused content conference, and pitch sessions for creators and producers. Founders Aizatulla Hussain of media company Ozen and Almas Zhali of Brave Talents organize the event with sponsorship and partnership contributions, and the program is part of the broader Astana AI Week ecosystem coordinated through Astana Hub. The festival is the first international AI-only film competition hosted in Central Asia, positioning Astana alongside Lincoln Center, Venice, and Cannes as a major AI film destination."
      }
    ],
    featuredContestIds: [
      "astana-aiff-2026",
      "future-vision-xprize-2026",
      "reply-ai-film-festival-2026",
      "runway-hundred-fund",
      "chroma-awards-season-2-2026"
    ]
  },
'how-to-submit-to-future-vision-xprize-2026': {
    title: "How to Submit to the Future Vision XPRIZE 2026: $3.5M Optimistic Sci-Fi Film Competition, August 15 Deadline, Step-by-Step Guide",
    description: "How to submit to the Future Vision XPRIZE before the August 15, 2026 deadline. Full guide: $3.5M+ prize pool ($2.5M production funding + $100K cash for Grand Prize, $100K each for 4 finalists, $10K for Top 10), free entry, 3-minute trailer plus 12-page treatment with logline / 300-word synopsis / 300-word personal statement on a one-page coversheet, MP4 or MOV at 1080p+, English subtitles, public unlisted YouTube delivery with #FutureVisionXPRIZE hashtag, the Astro Teller / Cathie Wood / Rod Roddenberry / Anousheh Ansari jury, the September 10 Top-10 script deadline, and the September 25 Moonshot Gathering finals in Los Angeles.",
    keywords: "how to submit Future Vision XPRIZE, Future Vision XPRIZE 2026, XPRIZE film submission, XPRIZE Future Vision treatment template, $3.5M sci-fi film contest, Peter Diamandis XPRIZE film, optimistic sci-fi film prize, Astro Teller film jury, Cathie Wood XPRIZE, Rod Roddenberry XPRIZE, Anousheh Ansari XPRIZE, Range Media 100 Zeros, Google AI film competition, Moonshot Gathering Los Angeles, futurevisionxprize.com submission",
    datePublished: "2026-06-02",
    intro: "The Future Vision XPRIZE submission deadline is August 15, 2026 at 11:59 PM PST, and any creator on Earth can enter for free by registering at futurevisionxprize.com, uploading a maximum-three-minute trailer (plus the required 15-second sponsor end card) as an Unlisted YouTube video, and submitting a one-page coversheet plus a treatment of up to twelve pages through the official portal. The total prize pool is $3,500,000+: the Grand Prize is $2,500,000 in production funding granted as equity investment toward the feature film plus a $100,000 cash award, the four runner-up finalists each receive $100,000 in cash, the broader Top 10 each receive $10,000, and an additional $500,000 in prizes is to be announced over the competition window. The competition is convened by Peter Diamandis and the XPRIZE Foundation in partnership with Google and Range Media Partners (operating through their 100 Zeros initiative, with backing from Jed McCaleb, Rod Roddenberry, Cathie Wood, and the Abundance360 Community), and the jury combines Google X Captain of Moonshots Astro Teller, ARK Invest CEO Cathie Wood, Roddenberry Foundation chair Rod Roddenberry, and XPRIZE CEO Anousheh Ansari, with the Range Media team driving the initial cull. The competition opened on March 9, 2026 with submissions running through August 15, the Top 10 finalists must deliver a first-draft script by September 10, and the Grand Prize is announced live at the Moonshot Gathering in downtown Los Angeles on September 25, 2026. The brief is narrow in tone (optimistic, technology-forward, Star Trek lineage rather than Terminator lineage) but wide in form (live action, animation, AI-generated, hybrid, any tool, any language with English subtitles or dubbing). This guide walks through every step: the registration flow that unlocks the official 15-second sponsor trailer, the video specifications that disqualify the largest share of first-time entrants, the coversheet and treatment structure the jury actually reads, the YouTube posting workflow with the #FutureVisionXPRIZE hashtag requirement, the engagement metrics that factor into evaluation, the rights and exclusivity agreement that grants Range a first-look window through September 25, the four-criteria evaluation rubric (Concept Quality and Execution, Scale and Ambition, Mission Alignment, Technology-Forward Storytelling), and a tool-stack strategy for the final ten weeks before the platform locks.",
    sections: [
      {
        h: "The August 15 Deadline and Why Future Vision XPRIZE Is the Largest AI-Eligible Film Prize of 2026",
        body: "The Future Vision XPRIZE submission window opened on March 9, 2026 and closes at 11:59 PM Pacific Standard Time on August 15, 2026, leaving roughly ten and a half weeks from this article to register, produce, finish, upload, and submit. The Variety announcement on March 9 framed the contest as one of the world's largest film competitions, and the Hollywood Reporter confirmed the $3.5 million figure alongside the Google and Range Media partnership through the 100 Zeros initiative (the name derives from googol, a 1 followed by 100 zeros, and is the joint film and TV production company Google and Range stood up in 2026 to push a more optimistic cultural framing of emerging technology). Why this competition matters more than any other 2026 AI-eligible prize: the $2,500,000 Grand Prize is not a cash check but production equity backed by Range's commitment to arrange financing and produce the winning film at a total budget of up to $15 million or more (depending on additional fan financing through Republic Film), with Google attached as producing partner contributing creative technology and tools, and a public investment campaign on the Republic platform layered on top to potentially add another $1M+ in production capital. That is materially different from the Astana AI Film Festival's $1,000,000 distribution model or the Luma AI Dream Brief's $1,000,000 Cannes Lions production prize because what you are competing for is not just money but a fully financed Hollywood feature with industry-standard producers attached. If you finish a strong three-minute trailer and a defensible twelve-page treatment between now and the second week of August, Future Vision XPRIZE has the highest career-trajectory expected value of any film competition currently open, AI-only or otherwise."
      },
      {
        h: "Free Entry, the Registration Flow, and the 15-Second Sponsor Trailer You Receive After Registering",
        body: "Future Vision XPRIZE is free to enter. Entry begins at futurevisionxprize.com/register, where you complete the registration form (contact information, background details, initial project information). Registration is not a token formality; it enrolls you in the creator support workflow, which is the only legitimate way to receive the 15-second sponsor trailer that must be appended to every video submission. The sponsor trailer features XPRIZE Foundation, PHD Ventures (Diamandis's holding company that operates the Moonshots brand), Google, Range, and any additional corporate sponsors added during the competition window; the rules explicitly note that new sponsors may join and that participants may be asked to update their sponsor trailer with new assets supplied with simple instructions. Once registered, you receive access to the detailed rules document, submission reminders, production guidelines, and resources covering Abundance and exponential technologies (the worldview that informs the optimistic-sci-fi brief). Eligibility is open worldwide with the standard US sanctions exclusions (Crimea, Cuba, Iran, North Korea, Syria), no professional film experience is required, both individuals and teams of unlimited size are welcome, participants must be 18 or older to receive prize money (minors may participate with parental or guardian consent and a guardian co-signing for any prize), and you must not have existing exclusive or first-look deals or similar commitments that would block participation. The registration step is non-skippable: a submission uploaded without the supplied sponsor end card or without the registration on file will not enter the jury pipeline."
      },
      {
        h: "Video Submission Specs: Three Minutes, MP4 or MOV at 1080p+, Sponsor End Card, English",
        body: "The video file rules are short and strict, and missing any one of them disqualifies an otherwise strong submission. Maximum length is three minutes plus the fifteen-second sponsor trailer appended to the end. Acceptable formats are trailer or short film (most strong submissions are structured as a teaser-trailer with voice-over and selected scenes rather than a complete short, because three minutes is too tight to deliver a full narrative arc and a trailer reads as a feature pitch which is what the jury is selecting for). Any production approach is welcome: live action, traditional animation, AI-generated content, or hybrid formats, and any tool is permitted (Runway Gen-4 and Gen-4.5, Google Veo 3 and Veo 3.1, OpenAI Sora 2 via partner platforms, Kling 3.0, Pika 2.5, Luma Ray 2 and Dream Machine, MidJourney V7, Higgsfield, Hailuo, Seedance 2.0, ElevenLabs voice, Suno music, ComfyUI workflows, custom LoRAs). Note one important caveat in the rules: if your submission is selected as a winner or finalist, development of that project will require the use of Google tools (Google's AI tools, phones, tablets, computers as called for in the production) as called for during production, which means your treatment should not architect itself around a competing platform's exclusive capability. Technical format must be MP4 or MOV with minimum 1080p resolution. Content must be appropriate for general audiences with no explicit violence, language, or sexual content (the brief skews PG-13 leaning PG given the audience the Moonshot Gathering targets). All submissions must be voiced or subtitled in English, even if the original dialogue is in another language. Derivative or copyrighted material is not permitted: no copyrighted characters, no recognizable brands or intellectual property without explicit permission, and all stock music and footage must be properly licensed (this is where AI-generated music from Suno or licensed libraries from Artlist or Soundstripe wins on time and risk versus pulling a tempting needle drop)."
      },
      {
        h: "The Written Submission: Coversheet (Logline + 300-Word Synopsis + 300-Word Personal Statement) Plus the 12-Page Treatment",
        body: "The written submission is where most three-minute trailers actually rise or fall, because the trailer sells the vision and the treatment proves it can become a feature. The coversheet is exactly one page and contains three elements: a logline that captures the story's essence in one sentence following the classic protagonist plus inciting incident plus goal plus central conflict formula, a synopsis that summarizes the full film or series concept in no more than 300 words covering the world, the protagonist, the inciting incident, the second-act complication, and the resolution, and a personal statement in no more than 300 words explaining the creator's motivation and philosophy for this specific optimistic vision. The personal statement is the single highest-leverage section of the written submission: judges including Anousheh Ansari and Rod Roddenberry are explicitly screening for filmmakers who can articulate why the future they are depicting is worth building toward, not just describe what it looks like. The treatment itself is up to twelve pages (StudioBinder, MasterClass, and Shore Scripts all converge on 10-12 pages as the professional industry length for a feature treatment, so the cap is generous), written in present tense, in English, single-spaced in a tried-and-true font such as Courier 12 or Times 12, broken into three acts with the inciting incident closing Act One around page three or four, the midpoint complication landing around page six or seven, and the climax and resolution covering the back four pages. The strongest treatments lean into specific scenes rather than narrating world-building paragraphs; the jury reads dozens of treatments and the ones that get remembered are the ones with concrete moments (a single image, a single line of dialogue, a single character beat) that survive a single-page skim."
      },
      {
        h: "YouTube Posting, the #FutureVisionXPRIZE Hashtag, and the Public-Visibility Workflow",
        body: "All video submissions must be uploaded to YouTube. The flow has two steps: you first publish the video as an Unlisted YouTube link (created by you, on your own channel) and submit that link through the futurevisionxprize.com portal for compliance review, and after the review team confirms appropriateness of content you are asked to flip the video to Public visibility on your own channel. You retain ownership and control of the YouTube channel throughout, and all qualifying submissions are featured in the official Future Vision XPRIZE curated playlist on YouTube. Three rules in this section disqualify more entries than any other: the supplied sponsor end card must be present at the end of every video, the hashtag #FutureVisionXPRIZE must appear in the video title or the description (place it in the description on its own line near the top to be safe; the platform parses for the exact string and entries without it can be filtered before reaching the jury), and the video description must include a link to the official competition website and should tag competition partners when possible. Engagement metrics (views, likes, comments, shares) are factored into evaluation but the rules explicitly state that view count will play a role without giving significant advantage to participants with large existing audiences. The spirit of the engagement metric is signal of resonance rather than reward for celebrity, so a smaller creator with a video that earns 50,000 views via word-of-mouth and Twitter sharing has been weighted comparably to a million-follower creator whose audience auto-views everything. Diamandis told TechCrunch he expects to flood YouTube with submissions to seed public conversation about the future, so plan your promotion: share the YouTube URL on X, Threads, LinkedIn, Reddit, and any film-specific community you belong to, and ask collaborators to do the same in the first 72 hours after publication."
      },
      {
        h: "The Four Evaluation Criteria the Jury Actually Uses",
        body: "The Future Vision XPRIZE rules document specifies four primary dimensions used to screen submissions and identify the films that move forward through the cull, and writing your treatment and trailer explicitly against these four criteria is the single highest-ROI prep step. Criterion one is concept quality and execution: is the story compelling and well-realized within the three-minute production constraint, with a clear hook in the first ten seconds, a stake in the first sixty seconds, and a resolution or open question in the final twenty seconds; can the jury imagine the feature it implies. Criterion two is scale and ambition: does the vision think big enough about humanity's future, meaning does it reach for civilization-scale or species-scale stakes rather than a single neighborhood vignette; the brief is explicitly about humanity's technology-enabled future so a story that depicts a meaningful change to how humans live, work, love, govern, build, or relate to non-human intelligence is the right size, and a story that is essentially a present-day drama with one futuristic prop is the wrong size. Criterion three is mission alignment: does the submission genuinely portray a compelling and technology-enabled future where everyone can thrive (the explicit word the rules use), which excludes dystopian work and excludes critique-of-tech work; Peter Diamandis was unambiguous in the Fortune profile that he is tired of doomsday scenarios from Terminator and Ex Machina, and the jury will read tonally pessimistic work as outside the brief regardless of craft. Criterion four is technology-forward storytelling: is advanced technology meaningfully integrated into the narrative as a story driver rather than a backdrop, which means AI, robotics, neural interfaces, space travel, longevity, climate adaptation, or other technologies should be load-bearing for the plot, not just visual texture. Trailers and treatments that score highest pass all four criteria simultaneously; trailers that score above-average on craft but fail mission alignment because they read pessimistic are screened out at the cull stage."
      },
      {
        h: "The Jury: Astro Teller, Cathie Wood, Rod Roddenberry, Anousheh Ansari, and the Range Media First Cull",
        body: "The jury combines four high-visibility principals with the operational Range Media review team. Astro Teller is the Captain of Moonshots at Google X (the company's deep-tech research lab) and brings a technology-feasibility lens; he will read whether your treatment's tech could plausibly exist along the trajectory the field is already on. Cathie Wood is the CEO and Chief Investment Officer of ARK Invest, the firm that built its thesis around disruptive innovation in AI, robotics, genomic sequencing, energy storage, and blockchain; she brings the investor lens (would this future be reachable and is it commercially storyworthy). Rod Roddenberry is the chair of the Roddenberry Foundation and the son of Star Trek creator Gene Roddenberry, and he is the most important jury member to write for because the entire competition is explicitly framed by Diamandis as an attempt to manifest a new Star Trek; treatments that lean into Trek's optimistic-humanism-meets-exploration tone will score well with Roddenberry. Anousheh Ansari is the CEO of XPRIZE and the first female private space explorer (she flew to the International Space Station in 2006); she brings the prize-philanthropy lens and is closely attentive to mission alignment and beneficial impact on humanity. The Range Media team conducts the initial cull, narrowing thousands of entries down to the Top 10 finalists, and Range's commercial-feature lens (Range Media Partners is the management and production company representing major filmmakers and built the AI On Screen short film initiative with Google) means the cull stage explicitly screens for treatments that look producible at a $15M budget through Range's distribution channels. Write your treatment for both audiences: a vision that Roddenberry would champion at Trek scale, and a script Range could actually shoot."
      },
      {
        h: "Rights, Exclusivity, and What Range Plus Google Actually Receive for Top 10 Finalists",
        body: "Read the rights section carefully because it is the most common reason filmmakers hesitate to submit. From the moment of submission until the Grand Prize winner announcement on September 25, 2026, you grant Range exclusive rights to your submission, which means: Range has first right to develop selected projects, you cannot shop your concept to other studios or producers during this exclusivity window, and Range maintains rights protection if your submission gains viral attention before the September 25 announcement. If you are selected as a Top 10 finalist and your project is adapted to a feature, Google serves as a producing partner on the project, Google receives an on-screen production company credit, Google receives up to three individual Executive Producer credits for individuals designated by Google (with specific terms negotiated in good faith at feature production time), and Google will use reasonable efforts to provide relevant tools and technical resources to the production at no cost subject to availability and Google's discretion. What you keep is also explicit: full ownership of your original work, control of your YouTube channel, and the right to promote your work. The rights structure is materially different from a typical first-look deal because it is time-boxed (it expires at announcement on September 25 regardless of outcome) and it applies only to the submission itself, not to your broader portfolio. If you are not selected to the Top 10, the exclusivity window closes at the September 25 announcement and you regain full freedom to take the concept elsewhere. The $2.5M equity investment that funds the Grand Prize feature production explicitly comes with attached producers from Range and Google, script development support, talent attachment assistance, industry connections for additional financing, and a full scholarship to the Moonshot Summit, plus the Republic Film fan investment campaign layered on top. For the four runner-up finalists, $100K cash plus full Moonshot Gathering scholarship plus featured YouTube promotion plus Hollywood producer visibility plus Google creative tool credits, with no requirement to enter feature production through Range."
      },
      {
        h: "The Three Dates You Cannot Miss: August 15 Submission, September 10 Script, September 25 Moonshot Gathering",
        body: "Three dates structure the back half of the competition timeline and missing any one of them disqualifies an otherwise winning team. The submission deadline is 11:59 PM Pacific Standard Time on August 15, 2026, which is the latest moment the YouTube link, sponsor end card, hashtag, coversheet, and twelve-page treatment must all be uploaded and the submission form completed; the platform does not extend, the timezone matters (8 AM August 16 in Europe is past the deadline), and last-minute YouTube uploads occasionally fail processing so do not push the upload to the final hour. The Top 10 script delivery deadline is September 10, 2026, at which point all ten finalists must deliver a first-draft feature script based on the submitted treatment; the rules specify this as a required obligation, not a bonus, so finalists should already be drafting script pages immediately on notification rather than treating it as a separate process; for a 90-to-120-page feature first draft in roughly two weeks the practical play is to outline the script during the August 15 submission window and write the pages during the post-submission grace period. The Grand Prize announcement and finals event is September 25, 2026 at the Moonshot Gathering in downtown Los Angeles, where the Top 10 finalists present their visions live and the Grand Prize winner is announced; the rules explicitly state that in order to win a cash prize or the Grand Prize, participants must be able to attend in person on September 25, so factor a Los Angeles travel commitment for late September into your submission planning (Moonshot Gathering full scholarship covers travel, hotel, and access for finalists and runner-up finalists, so the cost is covered but the calendar is a hard requirement)."
      },
      {
        h: "Tool Stack, Trailer Architecture, and How to Survive the Three-Minute Constraint",
        body: "Three minutes plus a fifteen-second sponsor card is too short for a complete short film and too long for a teaser, so the trailer architecture that wins is closer to a sizzle-reel feature pitch than to a short. The structure that has scored best at adjacent AI festivals (Reply AIFF, Astana AIFF, the Luma Dream Brief) and that fits the Future Vision XPRIZE brief is: ten seconds to establish the world (a single iconic image plus one sentence of voice-over that lands the optimistic premise), forty seconds to establish the protagonist and the stake (who is in this future, what do they want, what is at risk), ninety seconds to deliver the strongest two or three scenes from the implied feature (the moments that the twelve-page treatment will be selling), forty seconds to deliver the protagonist's commitment or victory beat (the moment that earns the optimistic ending), the final ten seconds for a title card and tagline, and the fifteen-second sponsor end card appended after. Tool-stack-wise, the practical choices for full-AI production in 2026 are Google Veo 3.1 (highest prompt adherence, native audio in 4K landscape and portrait, the obvious anchor model given Google's role as competition partner and the rule that feature development requires Google tools), Runway Gen-4 and Gen-4.5 (the strongest tool for camera-move control and reference-driven character consistency, which targets the technology-forward and concept-quality criteria), Kling 3.0 (cinematic lighting and fluid simulation at materially lower cost for indie teams), OpenAI Sora 2 routed through partner platforms (causal-logic prompting and the strongest narrative coherence for hooking the first ten seconds), Seedance 2.0 (multi-shot native generation with synchronized audio for filmmakers who need to lock continuity across the three-minute runtime), MidJourney V7 plus Runway Act-Two for character consistency, ElevenLabs v3 for dialogue dubbing and voice-over (English subtitles are required, so a non-English performance dubbed into English via ElevenLabs is fully eligible), and Suno v5 for original score (Suno-generated music sidesteps the no-copyrighted-music rule cleanly). Document every model and every pipeline stage in the registration submission record because it informs both the jury cull and the post-selection Google-tools development requirement."
      }
    ],
    ruminatex: false,
    faqs: [
      {
        q: "What is the submission deadline for the Future Vision XPRIZE 2026?",
        a: "The Future Vision XPRIZE submission deadline is August 15, 2026 at 11:59 PM Pacific Standard Time. Submissions opened on March 9, 2026, and the platform closes hard at the end of August 15. Top 10 finalists then have until September 10, 2026 to deliver a first-draft feature script based on their submitted treatment. The Grand Prize is announced live on September 25, 2026 at the Moonshot Gathering in downtown Los Angeles. The submission form is hosted at futurevisionxprize.com and requires a registration on file (which is also how you receive the required 15-second sponsor end card)."
      },
      {
        q: "How much prize money does the Future Vision XPRIZE award and how is it distributed?",
        a: "The Future Vision XPRIZE awards $3,500,000+ across a tiered structure. The Grand Prize is $2,500,000 in production funding granted as equity investment toward producing the winner's film as a feature (with Range Media Partners committing best efforts to arrange financing at up to $15 million or more total budget depending on the Republic Film fan-investment layer) plus a $100,000 cash award to the Grand Prize winner. The four runner-up finalists each receive $100,000 in cash plus Moonshot Gathering scholarships, featured YouTube promotion, Hollywood producer visibility, and Google creative tool credits. The Top 10 finalists each receive $10,000 in cash. An additional $500,000 in prizes will be announced over the competition window. The Grand Prize winner also receives attached producers from Range and Google, script development support, and talent-attachment assistance."
      },
      {
        q: "Is there an entry fee for the Future Vision XPRIZE?",
        a: "No. The Future Vision XPRIZE is free to enter for all creators worldwide (excluding the standard US sanctions list: Crimea, Cuba, Iran, North Korea, Syria). There is no submission fee, no FilmFreeway tier, and no deadline escalator. Registration at futurevisionxprize.com/register is required because that is how you receive the 15-second sponsor end card that must be appended to your submission, and registration is also where you confirm your contact information for finalist notification."
      },
      {
        q: "What format and length should the video submission be?",
        a: "Maximum video length is three minutes plus the fifteen-second sponsor end card appended at the end. Acceptable formats are trailer or short film. Technical specifications: MP4 or MOV container, minimum 1080p resolution, English dialogue or English subtitles required, and content appropriate for general audiences (no explicit violence, language, or sexual content). Any production approach is welcome (live action, animation, AI-generated, hybrid) and any tool is permitted (Runway, Veo, Sora, Kling, Pika, Luma, MidJourney, Higgsfield, Hailuo, Seedance, ElevenLabs, Suno, custom workflows). No derivative or copyrighted material is permitted; content must be 100% original including music and stock footage."
      },
      {
        q: "What is the treatment requirement and what goes on the coversheet?",
        a: "Every submission must include a written treatment of up to twelve pages plus a one-page coversheet. The coversheet has exactly three elements: a logline that captures the story's essence in one sentence, a synopsis providing a brief summary of the full film or series concept in no more than 300 words, and a personal statement explaining the creator's motivation and philosophy for this vision in no more than 300 words. All written materials must be in English. Treatments should be written in present tense with three-act structure, and the strongest treatments lean into specific scenes (concrete moments, single lines of dialogue, single character beats) rather than narrating world-building paragraphs. If selected as a Top 10 finalist, you have until September 10, 2026 to deliver a first-draft feature script based on the treatment."
      },
      {
        q: "Who are the judges for the Future Vision XPRIZE?",
        a: "The judging panel is Astro Teller (Captain of Moonshots at Google X, the company's deep-tech research lab), Cathie Wood (CEO and Chief Investment Officer of ARK Invest), Rod Roddenberry (chair of the Roddenberry Foundation and son of Star Trek creator Gene Roddenberry), and Anousheh Ansari (CEO of XPRIZE and the first female private space explorer). The Range Media team conducts the initial cull from thousands of entries down to the Top 10 finalists. Funding partners include Google through the 100 Zeros initiative with Range Media Partners, Republic Film for fan financing, and philanthropic backers Jed McCaleb, Rod Roddenberry, Cathie Wood, and the Abundance360 Community."
      },
      {
        q: "What are the evaluation criteria the jury uses?",
        a: "The rules document specifies four primary evaluation dimensions: (1) Concept quality and execution: is the story compelling and well-realized within the three-minute production constraint; (2) Scale and ambition: does the vision think big enough about humanity's future at civilization or species scale; (3) Mission alignment: does the submission genuinely portray a compelling and technology-enabled future where everyone can thrive (the brief explicitly excludes dystopian or critique-of-tech work); (4) Technology-forward storytelling: is advanced technology meaningfully integrated into the narrative as a story driver rather than visual backdrop. YouTube engagement metrics (views, likes, comments, shares) are also factored in but the rules state view count will not give significant advantage to large existing audiences."
      },
      {
        q: "What rights does Range receive when I submit?",
        a: "By submitting, you grant Range Media Partners exclusive rights to your submission from the moment of submission until the Grand Prize winner announcement on September 25, 2026. This means Range has first right to develop selected projects, you cannot shop your concept to other studios or producers during this window, and Range maintains rights protection if the submission gains viral attention. If selected as a Top 10 finalist and your project is adapted to a feature, Google serves as producing partner with an on-screen production company credit and up to three individual Executive Producer credits. You retain full ownership of your original work, control of your YouTube channel, and the right to promote your work throughout. If you are not selected to the Top 10, the exclusivity window closes at the September 25 announcement and you regain full freedom to take the concept elsewhere."
      }
    ],
    featuredContestIds: [
      "future-vision-xprize-2026",
      "astana-aiff-2026",
      "runway-hundred-fund",
      "chroma-awards-season-2-2026",
      "runway-ai-film-festival-2026"
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
          <span style={{ margin: '0 6px' }}>âº</span>
          <span className="link-muted" style={{ cursor: 'default' }}>Guides</span>
          <span style={{ margin: '0 6px' }}>âº</span>
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
              Visit Ruminatex â
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
              <Link href="/" className="link-muted" style={{ fontSize: 13 }}>View all open contests â</Link>
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
                â {GUIDES[s].title}
              </Link>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <Link href="/" className="link-muted" style={{ fontSize: 13 }}>â Back to all AI film contests</Link>
        </div>

      </div>
    </InnerLayout>
  )
}
