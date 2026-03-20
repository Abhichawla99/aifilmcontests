import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder strings so createClient doesn't throw during
// Next.js build-time module evaluation. Real env vars are always present
// at runtime (server) and in Vercel's build environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Public client — for reading contests (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — for writing subscribers/contests, bypasses RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
