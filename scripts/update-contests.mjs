/**
 * Update Supabase contests table with verified data from live research.
 * Run: node scripts/update-contests.mjs
 *
 * Today: 2026-03-19
 * - Closes contests whose deadlines have passed
 * - Adds newly discovered festivals
 * - Corrects status on existing entries
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
const env = {}
try {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i === -1) continue
    env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim()
  }
} catch { console.error('Cannot read .env.local'); process.exit(1) }

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'],
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── STATUS CORRECTIONS on existing contests ────────────────────────────────
// wsxa-hailuo was a 2025 contest — close it
// luma-dream-brief closes March 22 — still open for 3 days
// kling-nextgen 2025 edition is done — close it, 2026 TBD
const statusFixes = [
  { id: 'wsxa-hailuo-2026',    status: 'closed' },
  { id: 'kling-nextgen-2026',  status: 'closed' },  // 2025 edition concluded; 2026 not announced
  { id: 'waiff-2026',          status: 'upcoming' }, // main call closed Feb 27; festival April 21
]

// ─── NEW CONTESTS (verified via live research March 19, 2026) ────────────────
const newContests = [

  // ── OPEN ──────────────────────────────────────────────────────────────────

  {
    id: 'aima-mallorca-2026',
    name: 'AI Movie Awards (AIMA) — Mallorca',
    organizer: 'AIMA Productions',
    description: 'First-ever AI Movie Awards held at Meliá Calviá Beach, Mallorca. Films must be at least 70% AI-generated. 17+ award categories across shorts, features, animation, music video, documentary, and more.',
    deadline: '2026-04-10',
    prize: 'AIMA Trophy + Nikki Beach Day + Distribution Deal',
    prize_details: [
      'Official AIMA trophy + certificate per category',
      'Best AI Short Film: hosted day at Nikki Beach Mallorca',
      'Optional distribution deal for selected shorts (revenue-sharing)',
      'Selected filmmakers receive 2 free festival passes',
    ],
    url: 'https://www.aimovieawards.org/',
    status: 'open',
    categories: ['short-film', 'feature', 'animation', 'documentary', 'music-video'],
    ai_tools_allowed: ['Any AI tools — minimum 70% AI creative output'],
    eligibility: 'Global; 2–15 min for shorts; features 10+ min; any language with English subtitles; min 1920×1080',
    entry_fee: '€25–€50 (varies by deadline tier)',
    featured: true,
    tags: ['mallorca', 'spain', 'awards-ceremony', 'international', 'distribution'],
    location: 'Meliá Calviá Beach, Mallorca, Spain',
    event_date: '2026-04-24',
  },

  {
    id: 'lifeart-ai-global-film-festival-2026',
    name: 'AI Global Film Festival — LifeArt',
    organizer: 'LifeArt Festival',
    description: 'Leading international AI film platform in Hollywood with IMDb-qualifying credits. Judges from Netflix, National Geographic, and Apple TV. Accepts AI films, documentaries, music videos, advertising, and AI-assisted post-production.',
    deadline: '2026-06-12',
    submission_open: '2026-02-14',
    prize: 'IMDb Official Selection + Media Promotion',
    prize_details: [
      'IMDb-qualifying official selection credit',
      'Category winner certificates',
      'Media promotion via CNN and Fox affiliates',
      'Judges from Netflix, National Geographic, Apple TV',
    ],
    url: 'https://filmmakers.festhome.com/en/festival/ai-global-film-festival-lifeart',
    status: 'open',
    categories: ['short-film', 'feature', 'documentary', 'music-video', 'commercial', 'advertising', 'experimental'],
    ai_tools_allowed: ['Any AI tools — must disclose AI use; artistic merit required'],
    eligibility: 'Any nationality; any language with English subtitles; school projects accepted',
    entry_fee: '$17–$38 (varies by deadline tier; 33% PRO discount available)',
    featured: false,
    tags: ['hollywood', 'imdb', 'multi-category', 'los-angeles', 'netflix-judges'],
    location: 'Los Angeles, CA',
    event_date: '2026-06-20',
  },

  {
    id: 'baiff-2026',
    name: 'BAIFF — Burano AI Film Festival (4th Edition)',
    organizer: 'BAIFF',
    description: "Europe's first festival dedicated exclusively to AI short films, held on the island of Burano near Venice. Films must be at least 25% AI-generated. Accepts shorts, music videos, documentaries, animation, and episodic series.",
    deadline: '2026-06-01',
    prize: 'BAIFF Trophy (no cash prizes)',
    prize_details: [
      'Best AI Film, Best AI Music Video, Best AI Documentary',
      'Best AI Animation, Best AI Episodic Series, Hybrid Film',
      'Emotional Award, Photography Award',
      'No monetary prizes — in-kind trophies only',
    ],
    url: 'https://baiff.eu/',
    status: 'open',
    categories: ['short-film', 'music-video', 'documentary', 'animation', 'experimental'],
    ai_tools_allowed: ['Any AI tools — minimum 25% AI-generated'],
    eligibility: 'Films completed Jan 1 2024–Jun 1 2026; Italian subtitles (.SRT) required; any nationality',
    entry_fee: 'See FilmFreeway',
    featured: false,
    tags: ['italy', 'venice', 'burano', 'european', 'trophy-only'],
    location: 'Burano, Venice, Italy',
    event_date: '2026-10-13',
  },

  {
    id: 'berlin-ai-film-festival-2026',
    name: 'Berlin AI Film Festival (2nd Edition)',
    organizer: 'Berlin AI Film Festival',
    description: 'Second edition of the Berlin AI film festival accepting both 100% AI-generated films and hybrid works with meaningful AI integration. Low entry fees ($10–$25). Event in February 2027.',
    deadline: '2026-12-31',
    prize: 'TBA',
    prize_details: ['Awards across categories', 'Best Full AI Film', 'Best Mixed AI Film'],
    url: 'https://filmfreeway.com/AIBerlin',
    status: 'open',
    categories: ['short-film', 'feature', 'experimental', 'animation', 'documentary'],
    ai_tools_allowed: ['Any AI tools — either 100% AI-generated or meaningful AI integration'],
    eligibility: 'Open internationally; FilmFreeway submissions',
    entry_fee: '$10–$25 (varies by deadline tier)',
    featured: false,
    tags: ['berlin', 'germany', 'hybrid', 'low-entry-fee'],
    location: 'Berlin, Germany',
    event_date: '2027-02-09',
  },

  // ── UPCOMING ──────────────────────────────────────────────────────────────

  {
    id: 'ai-film-festival-japan-2026',
    name: 'AI Film Festival Japan 2026 — LOOP 2126',
    organizer: 'AI Film Japan Inc.',
    description: "Japan's largest AI cinema celebration themed \"Imagine the World of 2126!\" Top 10 works screened on Kabukicho Tower Vision (200m² outdoor LED) in Shinjuku and at Tokyo Innovation Base. Bold experiments and works-in-progress welcome.",
    deadline: '2026-04-10',
    prize: 'Best AI Creative Recognition + Kabukicho Tower Screening',
    prize_details: [
      'Top 10 works screened on Kabukicho Tower Vision (Shinjuku)',
      'Screening at Tokyo Innovation Base',
      'Potential selection for 2nd Annual AI Film Festival Japan (November)',
    ],
    url: 'https://aifilm.jp/',
    status: 'upcoming',
    categories: ['short-film', 'experimental'],
    ai_tools_allowed: ['Any generative AI technology — bold experiments welcome'],
    eligibility: 'Open call; 90 sec–5 min; individual or group; 1 submission per team',
    entry_fee: 'See website',
    featured: false,
    tags: ['japan', 'tokyo', 'shinjuku', 'outdoor-screening', 'loop-2126'],
    location: 'Kabukicho Tower Vision + Tokyo Innovation Base, Tokyo, Japan',
    event_date: '2026-04-26',
  },

  {
    id: 'ai-film-3-arizona-2026',
    name: 'AI Film 3 Festival (Arizona)',
    organizer: 'Prometheus Productions LLC',
    description: 'Third annual AI film and art festival in Arizona from a veteran-owned production company. Accepts AI-generated or AI-assisted music videos, documentaries, shorts, and experimental works. Family-friendly with AR poster activation.',
    deadline: '2026-08-15',
    prize: 'TBA',
    prize_details: [
      'Best Music Video', 'Best AI Documentary', 'Best AI Short Form',
      'Best Long Form', 'Best AI Experimental', 'Bailey Award (Special Selection)',
    ],
    url: 'https://aifilm3.com/',
    status: 'upcoming',
    categories: ['short-film', 'documentary', 'music-video', 'experimental'],
    ai_tools_allowed: ['Any AI tools — AI-generated or AI-assisted'],
    eligibility: 'Open internationally; FilmFreeway submissions',
    entry_fee: 'See FilmFreeway',
    featured: false,
    tags: ['arizona', 'veteran-owned', 'family-friendly'],
    location: 'Arizona, USA',
    event_date: '2026-09-17',
  },

  // ── CLOSED ────────────────────────────────────────────────────────────────

  {
    id: 'rain-film-festival-barcelona-2026',
    name: '+RAIN Film Festival 2026 — Barcelona',
    organizer: 'Universitat Pompeu Fabra (UPF)',
    description: "Europe's first university-run AI film festival. Films using AI in their creative process, screened at UPF Poblenou and CCCB Theatre. Also shown at Sónar+D. Jury Award €3,000 + Audience Award €2,000. Closed March 8.",
    deadline: '2026-03-08',
    prize: '€5,000 Total (Jury + Audience Awards)',
    prize_details: [
      'Jury Award: €3,000',
      'Audience Award: €2,000',
      'All selected filmmakers: €250 + travel/accommodation',
      'Screening at Sónar+D',
    ],
    url: 'https://www.upf.edu/en/web/rainfilmfest',
    status: 'closed',
    categories: ['short-film', 'experimental', 'documentary'],
    ai_tools_allowed: ['Any AI tools in creative process; EU AI Act compliance required'],
    eligibility: 'Closed',
    entry_fee: 'Free (was)',
    featured: false,
    tags: ['barcelona', 'spain', 'europe', 'academic', 'sonar-d', 'eu-ai-act', 'closed'],
    location: 'UPF Poblenou Campus + CCCB Theatre, Barcelona, Spain',
    event_date: '2026-06-15',
  },
]

// ─── RUN ────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n🔄 Applying status fixes to existing contests...\n')
  for (const fix of statusFixes) {
    const { error } = await supabase.from('contests').update({ status: fix.status }).eq('id', fix.id)
    if (error) {
      console.error(`  ❌ Failed to update ${fix.id}: ${error.message}`)
    } else {
      const icon = fix.status === 'closed' ? '⚫' : fix.status === 'open' ? '🟢' : '🟡'
      console.log(`  ${icon}  ${fix.id} → ${fix.status}`)
    }
  }

  console.log(`\n➕ Upserting ${newContests.length} new contests...\n`)
  const { data, error } = await supabase
    .from('contests')
    .upsert(newContests, { onConflict: 'id' })
    .select('id, name, status')

  if (error) {
    console.error('❌ Upsert failed:', error.message)
    process.exit(1)
  }

  for (const c of data) {
    const icon = c.status === 'open' ? '🟢' : c.status === 'upcoming' ? '🟡' : '⚫'
    console.log(`  ${icon}  ${c.name}`)
  }

  // Final count
  const { count: total } = await supabase.from('contests').select('*', { count: 'exact', head: true })
  const { count: openCount } = await supabase.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'open')
  const { count: upcomingCount } = await supabase.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'upcoming')
  const { count: closedCount } = await supabase.from('contests').select('*', { count: 'exact', head: true }).eq('status', 'closed')

  console.log(`\n✅ Supabase now has ${total} total contests:`)
  console.log(`   🟢  ${openCount} open`)
  console.log(`   🟡  ${upcomingCount} upcoming`)
  console.log(`   ⚫  ${closedCount} closed\n`)
}

run()
