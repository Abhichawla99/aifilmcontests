import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Vercel Cron — runs at 8:15 AM UTC daily
// Uses Perplexity Sonar Pro via OpenRouter to find new AI film contests.
// Perplexity has web search built in — no separate search API needed.
// Cost: ~$0.03–0.05 per run (~$1/month).

export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().slice(0, 10)

  // Get existing contests so we don't add duplicates
  const { data: existing } = await supabaseAdmin
    .from('contests')
    .select('id, name, url')

  const existingIds = (existing ?? []).map(c => c.id)
  const existingNames = (existing ?? []).map(c => c.name.toLowerCase())

  const systemPrompt = `You are a research agent for aifilmcontests.com, a website that tracks every AI film competition.

Today is ${today}.

CONTESTS ALREADY IN OUR DATABASE — do NOT return these:
${(existing ?? []).map(c => `- ${c.id}: ${c.name}`).join('\n')}

YOUR JOB:
Search the web for AI film contests and competitions that are NOT in our database above.
Only include a contest if:
1. AI-generated content is a CORE requirement (not just "AI tools are allowed as one option among many")
2. The deadline is in the future (after ${today})
3. You found the actual contest page and confirmed it is live
4. It is genuinely new — not a renamed version of something already in our list

RESPOND WITH ONLY a valid JSON array (no other text, no markdown, no explanation).
Return [] if nothing new is found — that is correct and expected.

Each object in the array must have ALL these exact fields:
{
  "id": "kebab-case-unique-id-2026",
  "name": "Exact Official Contest Name",
  "organizer": "Organisation that runs it",
  "description": "1-2 sentences. State: what AI tools are required, what the theme is, where it screens.",
  "deadline": "YYYY-MM-DD",
  "submission_open": null,
  "prize": "e.g. $10,000 Grand Prize or €5,000 Total",
  "prize_details": ["First place: $X", "Second place: $X"],
  "url": "https://the-exact-url-you-found",
  "status": "open",
  "categories": ["short-film"],
  "ai_tools_allowed": ["Specific tool required, or Any AI tools"],
  "eligibility": "Who can enter and any restrictions",
  "entry_fee": "Free or exact fee amount",
  "featured": false,
  "tags": [],
  "location": null,
  "event_date": null
}

HARD RULES — breaking these puts wrong data on a live website used by real filmmakers:
- NEVER invent a deadline. If you cannot find it on the actual page, omit that contest.
- NEVER invent a prize amount. Only write what you read on the page.
- NEVER add a contest whose URL returns 404 or whose page you could not load.
- featured should be true ONLY for prizes over $10,000 or contests run by Runway, Kling, Luma, Google, or major film festivals (Cannes, Venice, Berlin, SXSW).
- Return ONLY the JSON array. Nothing else.`

  const userMessage = `Search the web for new AI film contests not already in our database.

Search for:
1. "AI film festival 2026 open submissions"
2. "AI film competition 2026 deadline prize"
3. "generative AI short film contest 2026"
4. "AI filmmaking award open call 2026"
5. "Runway Kling Luma Hailuo Pika AI film competition 2026"

For each result that looks like a real new AI film contest: visit the page, check the deadline and prize are clearly stated, verify it's not already in our database, then include it in your JSON response.

Return a JSON array of new contests only. Return [] if nothing new is found.`

  let newContests: Record<string, unknown>[] = []

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aifilmcontests.com',
        'X-Title': 'AI Film Contests Research Agent',
      },
      body: JSON.stringify({
        model: 'perplexity/sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 4000,
        temperature: 0.1, // low temp = consistent structured output
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[Cron/Research] OpenRouter error:', response.status, err)
      return NextResponse.json({ ok: false, error: `OpenRouter ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    console.log('[Cron/Research] Raw response length:', content.length)

    // Extract JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        // Safety filter: remove anything already in the DB
        newContests = parsed.filter((c: Record<string, unknown>) => {
          if (!c.id || !c.name || !c.deadline || !c.url) return false
          if (existingIds.includes(c.id as string)) return false
          if (existingNames.includes((c.name as string).toLowerCase())) return false
          // Basic deadline sanity check
          const deadline = new Date(c.deadline as string)
          if (isNaN(deadline.getTime())) return false
          if (deadline < new Date()) return false
          return true
        })
      }
    }

    console.log(`[Cron/Research] Found ${newContests.length} new contests after filtering`)

  } catch (err) {
    console.error('[Cron/Research] Request failed:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }

  // Write to Supabase
  let addedIds: string[] = []
  if (newContests.length > 0) {
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('contests')
      .upsert(newContests, { onConflict: 'id' })
      .select('id, name')

    if (upsertErr) {
      console.error('[Cron/Research] Upsert failed:', upsertErr.message)
    } else {
      addedIds = (upserted ?? []).map(c => c.id)
      console.log('[Cron/Research] Added to DB:', addedIds)
    }
  }

  // Notify subscribers about new contests
  if (addedIds.length > 0) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifilmcontests.com'
      await fetch(`${baseUrl}/api/notify-new-contests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ contestIds: addedIds }),
      })
    } catch (err) {
      console.error('[Cron/Research] Notification fetch failed:', err)
    }
  }

  return NextResponse.json({
    ok: true,
    date: today,
    newContestsFound: newContests.length,
    addedToDb: addedIds,
    model: 'perplexity/sonar-pro',
  })
}
