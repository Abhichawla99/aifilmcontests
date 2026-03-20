import { supabaseAdmin } from './supabase'
import { sendNewContestAlerts } from './email'

export async function runResearch(): Promise<{
  ok: boolean
  date: string
  newContestsFound: number
  addedToDb: string[]
  model: string
  error?: string
}> {
  const today = new Date().toISOString().slice(0, 10)

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

HARD RULES:
- NEVER invent a deadline. If you cannot find it on the actual page, omit that contest.
- NEVER invent a prize amount. Only write what you read on the page.
- NEVER add a contest whose URL returns 404 or whose page you could not load.
- featured: true ONLY for prizes over $10,000 or contests run by Runway, Kling, Luma, Google, or major film festivals.
- Return ONLY the JSON array. Nothing else.`

  const userMessage = `Search the web for new AI film contests not already in our database.

Search for:
1. "AI film festival 2026 open submissions"
2. "AI film competition 2026 deadline prize"
3. "generative AI short film contest 2026"
4. "AI filmmaking award open call 2026"
5. "Runway Kling Luma Hailuo Pika AI film competition 2026"

For each result that looks like a real new AI film contest: visit the page, confirm deadline and prize are clearly stated, verify it's not already in the database, then include it in your JSON response.

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
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[Research] OpenRouter error:', response.status, err)
      return { ok: false, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro', error: `OpenRouter ${response.status}: ${err}` }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''
    console.log('[Research] Response length:', content.length)

    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        newContests = parsed.filter((c: Record<string, unknown>) => {
          if (!c.id || !c.name || !c.deadline || !c.url) return false
          if (existingIds.includes(c.id as string)) return false
          if (existingNames.includes((c.name as string).toLowerCase())) return false
          const deadline = new Date(c.deadline as string)
          if (isNaN(deadline.getTime()) || deadline < new Date()) return false
          return true
        })
      }
    }

    console.log(`[Research] ${newContests.length} new contests after filtering`)
  } catch (err) {
    console.error('[Research] Fetch failed:', err)
    return { ok: false, date: today, newContestsFound: 0, addedToDb: [], model: 'perplexity/sonar-pro', error: String(err) }
  }

  // Write to Supabase
  let addedIds: string[] = []
  if (newContests.length > 0) {
    const { data: upserted, error: upsertErr } = await supabaseAdmin
      .from('contests')
      .upsert(newContests, { onConflict: 'id' })
      .select('id, name')

    if (upsertErr) {
      console.error('[Research] Upsert failed:', upsertErr.message)
    } else {
      addedIds = (upserted ?? []).map(c => c.id)
      console.log('[Research] Added:', addedIds)
    }
  }

  // Email subscribers about new contests
  if (addedIds.length > 0) {
    try {
      const { data: newContestData } = await supabaseAdmin
        .from('contests')
        .select('name, organizer, prize, deadline, url, description')
        .in('id', addedIds)

      const { data: subs } = await supabaseAdmin
        .from('subscribers')
        .select('email')
        .eq('confirmed', true)

      if (newContestData?.length && subs?.length) {
        await sendNewContestAlerts(subs.map(s => s.email), newContestData)
      }
    } catch (err) {
      console.error('[Research] Notification failed:', err)
    }
  }

  return {
    ok: true,
    date: today,
    newContestsFound: newContests.length,
    addedToDb: addedIds,
    model: 'perplexity/sonar-pro',
  }
}
