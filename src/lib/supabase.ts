import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder strings so createClient doesn't throw during
// Next.js build-time module evaluation. Real env vars are always present
// at runtime (server) and in Vercel's build environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Next.js 14 patches the global `fetch` and caches GET requests by default,
// including the ones supabase-js makes internally — so pages can serve a
// stale snapshot of the contests table even with `dynamic = 'force-dynamic'`
// set on the route. Force every read through this client to skip that cache
// so contest status/deadline changes show up immediately.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })

// Public client — for reading contests (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: noStoreFetch },
})

// Admin client — for writing subscribers/contests, bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: { fetch: noStoreFetch },
})
