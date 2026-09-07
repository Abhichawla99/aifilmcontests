import { supabaseAdmin } from './supabase'

// Helpers that let every new feature work BEFORE the migration is pasted
// and get better AFTER it. Nothing here should ever throw.

type PgErr = { code?: string; message?: string } | null | undefined

/** True when the error means "table or column doesn't exist yet". */
export function isMissingRelation(err: PgErr): boolean {
  if (!err) return false
  const code = err.code ?? ''
  if (['PGRST204', 'PGRST205', '42P01', '42703'].includes(code)) return true
  const m = (err.message ?? '').toLowerCase()
  return m.includes('does not exist') || m.includes('schema cache') || m.includes('could not find')
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.from('settings').select('value').eq('key', key).maybeSingle()
    if (error || !data) return null
    return (data as { value: string | null }).value ?? null
  } catch {
    return null
  }
}

export async function setSetting(key: string, value: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    return !error
  } catch {
    return false
  }
}

export async function migrationApplied(): Promise<boolean> {
  return (await getSetting('migration_2026_09_07')) === 'applied'
}

export type AgentTask =
  | 'research' | 'seo' | 'optimizer' | 'sales' | 'notify' | 'scorecard' | 'outreach' | 'sale' | 'maintenance' | 'vercel-research'
export type AgentStatus = 'ok' | 'failed' | 'skipped'

/** Best-effort: record what a robot did. Silently no-ops until the migration exists. */
export async function logAgentRun(
  task: AgentTask,
  status: AgentStatus,
  summary: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('agent_runs').insert({
      task,
      status,
      summary: summary.slice(0, 2000),
      details: details ?? null,
    })
    if (error && !isMissingRelation(error)) {
      console.error('[agent_runs] insert failed:', error.message)
    }
  } catch (e) {
    console.error('[agent_runs] insert threw:', e)
  }
}
