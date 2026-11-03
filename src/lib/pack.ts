import { supabaseAdmin } from './supabase'
import { getContestsByStatus } from './contests-db'
import { FEATURED_SETTING, featuredContest, sendPackEmail, type ContestEmailItem, type Recipient, type SendResult } from './email'
import { markPackSent } from './subscribers'

/* Delivering the creator pack: pick this week's contest, send, and stamp
   pack_sent_at so nobody gets it twice. Used by the confirm link and by the
   one-off send to people who were on the list before the pack existed. */

/** The contest pinned in the admin panel, if any. */
export async function pinnedContestId(): Promise<string | null> {
  const { data, error } = await supabaseAdmin.from('settings').select('value').eq('key', FEATURED_SETTING).maybeSingle()
  if (error) console.error('[Pack] featured setting read failed:', error.message)
  return data?.value || null
}

export async function setPinnedContest(id: string | null): Promise<{ error?: string }> {
  const { error } = id
    ? await supabaseAdmin.from('settings').upsert({ key: FEATURED_SETTING, value: id, updated_at: new Date().toISOString() })
    : await supabaseAdmin.from('settings').delete().eq('key', FEATURED_SETTING)
  return error ? { error: error.message } : {}
}

/** This week's contest. A failed read leaves it out rather than failing the pack. */
export async function thisWeeksContest(): Promise<ContestEmailItem | null> {
  try {
    const [open, pinned] = await Promise.all([getContestsByStatus('open'), pinnedContestId()])
    return featuredContest(open, pinned)
  } catch (err) {
    console.error('[Pack] featured contest failed:', err)
    return null
  }
}

export async function deliverPack(
  recipients: Recipient[],
  opts: { existing?: boolean; test?: boolean } = {},
): Promise<SendResult & { featured: string | null }> {
  const featured = await thisWeeksContest()
  const result = await sendPackEmail(recipients, featured, {
    existing: opts.existing,
    subjectPrefix: opts.test ? '[Test] ' : undefined,
  })
  // A test goes to Abhi, who isn't one of the recipients being marked.
  if (!opts.test && result.sent > 0) {
    const failed = new Set(result.dropped ?? [])
    await markPackSent(recipients.map(r => r.email).filter(e => !failed.has(e)))
  }
  return { ...result, featured: featured?.name ?? null }
}
