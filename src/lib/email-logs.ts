import { supabaseAdmin } from './supabase'

export type EmailType = 'new_contest' | '3day_expiring' | '7day_reminder' | 'weekly_digest'

/**
 * Check if an email of this type has already been sent for this contest.
 * Returns true if already sent (should skip), false if not yet sent.
 */
export async function alreadySent(emailType: EmailType, contestId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('email_logs')
    .select('id')
    .eq('email_type', emailType)
    .eq('contest_id', contestId)
    .limit(1)
    .single()

  return !!data
}

/**
 * Log that an email was sent, so we don't send it again.
 */
export async function logEmailSent(
  emailType: EmailType,
  contestId: string | null,
  recipientCount: number,
): Promise<void> {
  await supabaseAdmin.from('email_logs').upsert(
    {
      email_type: emailType,
      contest_id: contestId,
      recipient_count: recipientCount,
    },
    { onConflict: 'email_type,contest_id' },
  )
}

/**
 * Filter out contests that have already been emailed for a given type.
 * Returns only the contests that haven't been notified yet.
 */
export async function filterUnnotified<T extends { id: string }>(
  emailType: EmailType,
  contests: T[],
): Promise<T[]> {
  if (!contests.length) return []

  const ids = contests.map(c => c.id)
  const { data: existing } = await supabaseAdmin
    .from('email_logs')
    .select('contest_id')
    .eq('email_type', emailType)
    .in('contest_id', ids)

  const alreadySentIds = new Set((existing ?? []).map(e => e.contest_id))
  return contests.filter(c => !alreadySentIds.has(c.id))
}
