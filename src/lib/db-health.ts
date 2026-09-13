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

// ─── Supabase hiccups ─────────────────────────────────────────────────────────
//
// Since Sep 2026 Supabase sometimes answers "Gateway Timeout" or drops the
// connection. supabase-js hands those back as { error } instead of throwing,
// so a failed read looks exactly like an empty table unless the caller checks.
// withDbRetry gives each try a time limit and retries the failures worth retrying.

type DbResult = { error: PgErr; status?: number }

export interface DbRetryOptions {
  /** Total tries, including the first. */
  attempts?: number
  /** Time limit per try, so one hung request can't use up the function's budget. */
  timeoutMs?: number
  /** Pause before each retry; the last value repeats. */
  backoffMs?: number[]
}

/** Timeouts, 5xx, rate limits and dropped connections. Not bad queries or constraint errors. */
export function isTransientDbError(res: DbResult): boolean {
  if (!res.error) return false
  const status = res.status ?? 0
  if (status === 0 || status === 429 || status >= 500) return true
  return /timeout|timed out|gateway|fetch failed|econnreset|socket hang up/i.test(res.error.message ?? '')
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/** Runs a Supabase call with a time limit and retries transient failures. Pass `signal` to `.abortSignal()`. */
export async function withDbRetry<T extends DbResult>(
  run: (signal: AbortSignal) => PromiseLike<T>,
  { attempts = 3, timeoutMs = 8_000, backoffMs = [1_000, 3_000] }: DbRetryOptions = {},
): Promise<T> {
  let res = await run(AbortSignal.timeout(timeoutMs))
  for (let i = 1; i < attempts && isTransientDbError(res); i++) {
    await sleep(backoffMs[Math.min(i - 1, backoffMs.length - 1)] ?? 0)
    res = await run(AbortSignal.timeout(timeoutMs))
  }
  return res
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
  | 'research' | 'seo' | 'optimizer' | 'sales' | 'design' | 'weekly' | 'submission' | 'notify' | 'scorecard' | 'outreach' | 'sale' | 'maintenance' | 'vercel-research'
export type AgentStatus = 'ok' | 'failed' | 'skipped'

/** Best-effort: record what a robot did. Silently no-ops until the migration exists. */
export async function logAgentRun(
  task: AgentTask,
  status: AgentStatus,
  summary: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    const { error } = await withDbRetry(signal => supabaseAdmin.from('agent_runs').insert({
      task,
      status,
      summary: summary.slice(0, 2000),
      details: details ?? null,
    }).abortSignal(signal))
    if (error && !isMissingRelation(error)) {
      console.error('[agent_runs] insert failed:', error.message)
    }
  } catch (e) {
    console.error('[agent_runs] insert threw:', e)
  }
}
