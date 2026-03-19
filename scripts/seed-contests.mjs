/**
 * Seed all contests from contests.ts into Supabase.
 * Run AFTER creating the schema in the Supabase dashboard.
 *
 * Usage:
 *   node scripts/seed-contests.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local manually ─────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')

const env = {}
try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    env[key] = val
  }
} catch {
  console.error('❌ Could not read .env.local')
  process.exit(1)
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const serviceKey  = env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Contest data ─────────────────────────────────────────────
const contests = [
  { id: 'runway-aif-2026', name: 'Runway AI Festival 2026', organizer: 'Runway', description: "The world's largest AI film competition. Grand Prix $20K + 1M Runway credits. Screenings at Lincoln Center NYC and The Broad Stage LA.", deadline: '2026-03-31', prize: '$135,000+ Total Prize Pool', prize_details: ['$20,000 Grand Prix + 1M Runway credits', '$10,000–$15,000 per category winner', 'Screened at Alice Tully Hall, Lincoln Center (June 11)', 'Screened at The Broad Stage, LA (June 18)'], url: 'https://aif.runwayml.com', status: 'open', categories: ['short-film', 'animation', 'experimental', 'advertising', 'commercial'], ai_tools_allowed: ['Runway Gen-3', 'Runway Gen-4', 'Any generative video tool'], eligibility: 'Open globally, 18+. Film category requires generative video use, 3–15 min.', entry_fee: 'Free', featured: true, tags: ['free-entry', 'runway', 'prestigious', 'lincoln-center'], location: 'New York & Los Angeles', event_date: '2026-06-11' },
  { id: 'runway-gen48-2026', name: 'Runway Gen:48 — 48-Hour AI Film Challenge', organizer: 'Runway', description: '48 hours to create a 1–4 minute short film using Runway. Winning film screened at the AI Film Festival.', deadline: '2026-05-01', prize: '$5,000 Grand Prix + 1M Runway Credits', prize_details: ['$5,000 cash Grand Prix', '1,000,000 Runway Credits', 'Epidemic Sound annual license', 'Winning film screened at AI Film Festival'], url: 'https://runwayml.com/gen48', status: 'open', categories: ['short-film', 'experimental'], ai_tools_allowed: ['Runway (required)'], eligibility: 'Open globally where legally permitted, individual or team', entry_fee: 'Free', featured: true, tags: ['free-entry', 'runway', '48-hour', 'sprint'] },
  { id: 'luma-dream-brief-2026', name: 'Luma AI Dream Brief — $1M Cannes Lions', organizer: 'Luma AI × DE-YAN', description: 'Create a commercial using Luma AI that wins a 2026 Cannes Lions Gold Lion and take home $1,000,000.', deadline: '2026-03-22', prize: '$1,000,000', prize_details: ['$1,000,000 if your work wins a Cannes Lions Gold Lion', '18-person jury including Nike, HBO Max, Wieden+Kennedy'], url: 'https://lumalabs.ai/press/dream-brief', status: 'open', categories: ['commercial', 'advertising'], ai_tools_allowed: ['Luma AI (required)', 'Luma Dream Machine'], eligibility: 'Open to creatives worldwide; Cannes Lions entry fees apply separately', entry_fee: 'Free to Luma (Cannes Lions entry fees separate)', featured: true, tags: ['luma', 'cannes', 'advertising', 'massive-prize'] },
  { id: 'curious-refuge-animation-2026', name: 'Curious Refuge AI Animation Competition', organizer: 'Curious Refuge × Promise Studios', description: "The world's first AI animation competition. Win up to $10,000 and a chance to pitch for a real development deal.", deadline: '2026-03-28', prize: 'Up to $10,000 + Development Deal', prize_details: ['Up to $10,000 cash', 'Chance to pitch for a real development deal', 'Promise Studios partnership'], url: 'https://curiousrefuge.com/ai-animation-contest', status: 'open', categories: ['animation', 'short-film'], ai_tools_allowed: ['Any AI tools'], eligibility: 'Open worldwide', entry_fee: 'Free', featured: true, tags: ['free-entry', 'animation', 'development-deal', 'curious-refuge'] },
  { id: 'waiff-2026', name: 'World AI Film Festival (WAIFF)', organizer: 'WAIFF', description: "The world's premier AI film festival at Cannes' Palais des Festivals. Jury president Gong Li.", deadline: '2026-04-01', prize: '€10,000 Grand Prize (€20,000+ Total)', prize_details: ['€10,000 Grand Prize', '€20,000+ total awards', 'Screened at Palais des Festivals, Cannes (April 21)'], url: 'https://worldaifilmfestival.com', status: 'open', categories: ['short-film', 'feature', 'experimental', 'animation'], ai_tools_allowed: ['Must use 3+ generative AI tools incl. 1 image-generation tool'], eligibility: 'Global; English or with English subtitles; shorts 5–10 min, features 25+ min', entry_fee: 'See FilmFreeway', featured: true, tags: ['cannes', 'prestigious', 'international', 'gong-li'], location: 'Cannes, France', event_date: '2026-04-21' },
  { id: 'wsxa-hailuo-2026', name: 'WSXA × Hailuo AI Film Competition', organizer: 'MiniMax (Hailuo AI) × WSXA Amsterdam', description: 'Anti-War or Climate Resilience themed AI films using Hailuo AI. Finalists screened at WSXA Amsterdam and ARFF Berlin.', deadline: '2026-04-15', prize: '€2,500 + Festival Screenings', prize_details: ['€2,500 shared among 5 winners', '1-month unlimited Hailuo AI access for finalists'], url: 'https://www.minimax.io/news/wsxa-x-hailuo-ai-film-competition-is-live', status: 'open', categories: ['short-film', 'documentary', 'experimental'], ai_tools_allowed: ['Hailuo AI (50%+ required)', 'MiniMax Audio'], eligibility: 'Open worldwide; submit via FilmFreeway', entry_fee: 'Free', featured: false, tags: ['free-entry', 'hailuo', 'climate', 'anti-war', 'amsterdam'] },
  { id: 'metamorph-award-2026', name: 'MetaMorph AI Award 2026', organizer: 'MetaMorph', description: "UK-based AI film award. Judges include John Rhys-Davies, David Nutter, and Timbaland's Stage Zero team.", deadline: '2026-05-17', prize: "TBA (sponsored by Timbaland's Stage Zero)", prize_details: ['Cash prizes TBA', 'Judges: John Rhys-Davies, David Nutter, Stage Zero / Timbaland'], url: 'https://www.metamorph-award.com', status: 'open', categories: ['short-film', 'feature', 'experimental'], ai_tools_allowed: ['Any AI tools (50%+ of content must be AI)'], eligibility: 'Global, 18+', entry_fee: 'See website', featured: false, tags: ['uk', 'timbaland', 'horror', 'comedy', 'rhys-davies'] },
  { id: 'ai-for-good-film-festival-2026', name: 'AI for Good Film Festival 2026', organizer: 'ITU / UN AI for Good', description: 'UN-backed film festival. 4 finalists screened at the AI for Good Global Summit in Geneva.', deadline: '2026-05-01', prize: 'Official UN Selection + Geneva Screening', prize_details: ['4 finalists screened at AI for Good Global Summit', 'Cinéma du Grütli, Geneva — July 7–10'], url: 'https://aiforgood.itu.int/ai-for-good-film-festival', status: 'open', categories: ['short-film', 'documentary', 'experimental'], ai_tools_allowed: ['Any AI tools (scriptwriting, image, video, effects)'], eligibility: 'Films completed May 2025–May 2026; 1–10 minutes; global', entry_fee: 'Free', featured: false, tags: ['free-entry', 'un', 'geneva', 'cause-driven', 'prestige'], location: 'Geneva, Switzerland', event_date: '2026-07-07' },
  { id: 'aiffi-2026', name: 'AIFFI — International AI Film Festival', organizer: 'AIFFI', description: "Central America's first international AI film festival, in Roatán, Honduras. $10,000+ in prizes.", deadline: '2026-03-31', prize: '$10,000+ Total Prizes', prize_details: ['$10,000+ USD in prizes', 'Categories: storytelling, sound, design, visual innovation'], url: 'https://aiffi.org', status: 'open', categories: ['short-film', 'animation', 'experimental'], ai_tools_allowed: ['Any AI tools'], eligibility: 'Global; AI-generated short films', entry_fee: 'See FilmFreeway', featured: false, tags: ['honduras', 'latin-america', 'first-of-its-kind'], location: 'Roatán, Honduras', event_date: '2026-04-17' },
  { id: 'ai-international-film-festival-2026', name: 'AI International Film Festival — Hollywood', organizer: 'AI International Film Festival (est. 2021)', description: "The world's first AI film festival, now in Hollywood. Winners join the AI International Winners Guild.", deadline: '2026-03-25', prize: 'Awards + AI Winners Guild Membership', prize_details: ['Awards across all categories', 'Winners Guild: free tools + private filmmaker network'], url: 'https://aifilmfest.org', status: 'open', categories: ['short-film', 'feature', 'documentary', 'animation', 'experimental'], ai_tools_allowed: ['Any AI tools'], eligibility: 'Global; AI Films, Hybrid AI, Live-Action, Documentary, Animation', entry_fee: 'See FilmFreeway', featured: false, tags: ['hollywood', 'pioneer', 'winners-guild'], location: 'Hollywood, CA', event_date: '2026-04-08' },
  { id: 'runway-hundred-fund', name: 'Runway Hundred Film Fund', organizer: 'Runway', description: 'Rolling grant fund offering $5K–$1M+ per project plus up to $2M in Runway credits. Decisions within ~14 days.', deadline: '2026-12-31', prize: '$5,000–$1,000,000+ per project', prize_details: ['$5,000–$1,000,000+ per project', 'Up to $2,000,000 in Runway credits', '$5M total fund'], url: 'https://runwayml.com/hundred-film-fund', status: 'open', categories: ['short-film', 'feature', 'documentary', 'experimental', 'animation', 'music-video'], ai_tools_allowed: ['Runway (must be used in project)'], eligibility: 'Professional directors, producers, screenwriters, 18+, all nationalities', entry_fee: 'Free', featured: true, tags: ['grant', 'runway', 'rolling', 'free-entry', 'big-money'] },
  { id: 'kling-nextgen-2026', name: 'Kling AI NextGen Creative Contest 2026', organizer: 'Kling AI (Kuaishou)', description: 'Following 4,600+ entries from 122 countries in 2025, the 2026 edition is expected this summer.', deadline: '2026-09-01', prize: '$42,000+ Expected (based on 2025)', prize_details: ['$42,000 USD cash (2025 edition)', '1,250,000 Kling AI Credits', 'Festival screenings'], url: 'https://klingai.com', status: 'upcoming', categories: ['short-film', 'animation', 'experimental'], ai_tools_allowed: ['Kling AI (required)'], eligibility: 'Open worldwide', entry_fee: 'Free (expected)', featured: true, tags: ['kling', 'free-entry', 'international', 'oscar-jury'] },
  { id: 'ai-film-awards-cannes-2026', name: 'AI Film Awards Cannes 2026', organizer: 'AI Film Awards', description: "Screening and awards ceremony at Hotel Gray d'Albion in Cannes on May 22, 2026.", deadline: '2026-04-30', prize: 'Cannes Awards + Screening', prize_details: ["Official awards at Cannes", "Screened at Hotel Gray d'Albion", 'Networking with Cannes delegates'], url: 'https://filmfreeway.com/aifilmawards2025', status: 'upcoming', categories: ['short-film', 'feature', 'experimental', 'animation'], ai_tools_allowed: ['Any AI tools'], eligibility: 'Global', entry_fee: 'See FilmFreeway', featured: false, tags: ['cannes', 'prestigious', 'networking'], location: 'Cannes, France', event_date: '2026-05-22' },
  { id: 'seoul-ai-film-festival-2026', name: 'Seoul International AI Film Festival (SIAFF)', organizer: 'SIAFF', description: "South Korea's premier AI film showcase at the enTravel Cultural Complex in Seoul, June 28.", deadline: '2026-05-31', prize: 'Awards + Official Selection', prize_details: ['Official selection + awards', 'Screened at enTravel Cultural Complex, Seoul'], url: 'https://www.seoulaiff.com', status: 'upcoming', categories: ['short-film', 'animation', 'experimental'], ai_tools_allowed: ['Any AI tools'], eligibility: 'Global', entry_fee: 'See website', featured: false, tags: ['seoul', 'korea', 'international'], location: 'Seoul, South Korea', event_date: '2026-06-28' },
  { id: 'red-rocks-ai-film-2026', name: 'Red Rocks AI Film Festival', organizer: 'Red Rocks AI Film Festival', description: "Utah's AI film festival with a live event plus global streaming.", deadline: '2026-08-01', prize: 'Awards + Network Membership', prize_details: ['Awards across categories', 'Live + global streaming event'], url: 'https://filmfreeway.com/RedRocksAIFilmFestival', status: 'upcoming', categories: ['short-film', 'documentary', 'experimental'], ai_tools_allowed: ['Any AI tools; original AI-generated works'], eligibility: 'Global', entry_fee: 'Submission fee required', featured: false, tags: ['utah', 'streaming', 'uplift'], location: 'St. George, Utah', event_date: '2026-09-24' },
  { id: 'curious-refuge-feelgood-2026', name: 'Curious Refuge Feel Good AI Film Competition', organizer: 'Curious Refuge × Epidemic Sound', description: 'AI must be used in every shot. Max 3 minutes. Closed March 10, 2026.', deadline: '2026-03-10', prize: '$10,000 in Cash Prizes', prize_details: ['$10,000 in cash prizes', 'Epidemic Sound music partnership'], url: 'https://curiousrefuge.com/2026-ai-feel-good-film-competition', status: 'closed', categories: ['short-film', 'experimental'], ai_tools_allowed: ['Any AI tools (required in every shot)'], eligibility: 'Closed', entry_fee: 'Free', featured: false, tags: ['curious-refuge', 'closed'] },
  { id: 'google-gemini-billion-2026', name: 'Google Gemini Global AI Film Award', organizer: '1 Billion Followers Summit × Google Gemini', description: '$1M Grand Prize. 3,500 entries worldwide. Winner: Zoubeir ElJlassi (Tunisia) with "Lily."', deadline: '2025-12-01', prize: '$1,000,000 Grand Prize — CONCLUDED', prize_details: ['$1,000,000 Grand Prize (awarded)', 'Winner: Zoubeir ElJlassi (Tunisia) — "Lily"'], url: 'https://www.1billionsummit.com/ai-film-award', status: 'closed', categories: ['short-film', 'experimental'], ai_tools_allowed: ['Google AI / Gemini (70%+ required)'], eligibility: 'Closed', entry_fee: 'Free (was)', featured: false, tags: ['google', 'gemini', 'closed', 'million-dollar'] },
]

// ── Seed ─────────────────────────────────────────────────────
console.log(`\n🌱 Seeding ${contests.length} contests into Supabase...\n`)

const { data, error } = await supabase
  .from('contests')
  .upsert(contests, { onConflict: 'id' })
  .select('id, name, status')

if (error) {
  console.error('❌ Seed failed:', error.message)
  console.error('\n💡 Make sure you have run supabase/schema.sql in the Supabase Dashboard SQL Editor first.')
  process.exit(1)
}

console.log(`✅ Seeded ${data.length} contests:\n`)
for (const c of data) {
  const icon = c.status === 'open' ? '🟢' : c.status === 'upcoming' ? '🟡' : '⚫'
  console.log(`  ${icon}  ${c.name}`)
}
console.log('\n🎬 All done! Your Supabase contests table is live.\n')
