import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseConfigError = (!supabaseUrl || !supabaseAnonKey)
  ? 'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.'
  : null

export async function supabaseDiagnostics() {
  if (!supabase) {
    return { ok: false, reason: supabaseConfigError || 'Supabase client not initialized' }
  }

  const startedAt = performance.now()
  try {
    // Lightweight read to verify REST and anon key access. The table exists in migration.
    const { error } = await supabase
      .from('resumes')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    const latencyMs = Math.round(performance.now() - startedAt)

    if (error) {
      return { ok: false, reason: error.message, latencyMs }
    }

    return { ok: true, latencyMs }
  } catch (e) {
    const latencyMs = Math.round(performance.now() - startedAt)
    return { ok: false, reason: e?.message || 'Unknown error', latencyMs }
  }
}

