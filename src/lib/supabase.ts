import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder strings so createClient doesn't throw during
// Next.js build-time module evaluation. Real env vars are always present
// at runtime (server) and in Vercel's build environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Next.js 14 patches the global `fetch` and caches GET requests by default,
// including the ones supabase-js makes internally. The admin client opts out
// of that explicitly: it runs in route handlers and crons, which are dynamic.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })

// Public client (respects RLS). The contests reads no longer use it (see
// supabaseRead below). It keeps the plain fetch, as supabaseRead does, for
// the reason the contests readers need it: unstable_cache already makes every
// fetch inside its callback bypass Next's fetch cache, and an explicit
// `cache: 'no-store'` in there is treated as dynamic usage while a page is
// being statically generated (the build, and every ISR refresh after it).
// supabase-js reports that thrown error as a failed read, which would make the
// readers cache the snapshot instead of the live table.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server read client for the shared contests readers in contests-db.ts: the
// plain fetch, with the service key. On Nov 4-5 2026 (as far back as the logs
// go) every read of the contests table with the anon key timed out on Vercel,
// in every region and on every deploy, so the site served the build snapshot.
// The build's own read with the service key worked from Vercel throughout.
// Server-only, like supabaseAdmin: never import it into a client component.
export const supabaseRead = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Admin client — for writing subscribers/contests, bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: { fetch: noStoreFetch },
})
