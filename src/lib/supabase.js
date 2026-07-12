import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  throw new Error('Missing Supabase env: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

// Public catalog read only — no login, no realtime, no session persistence
export const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
})
