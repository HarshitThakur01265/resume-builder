import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseConfigError = (!supabaseUrl || !supabaseAnonKey)
  ? 'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.'
  : null

export function getSupabaseStartupWarnings() {
  const warnings = []

  if (!supabaseUrl) {
    warnings.push('Missing VITE_SUPABASE_URL in .env')
  } else {
    try {
      const parsed = new URL(supabaseUrl)
      if (parsed.protocol !== 'https:' && parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
        warnings.push('VITE_SUPABASE_URL should use https for cloud projects')
      }
      if (!/supabase\.co$/i.test(parsed.hostname) && parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
        warnings.push(`Unexpected Supabase host: ${parsed.hostname}`)
      }
    } catch {
      warnings.push('VITE_SUPABASE_URL is not a valid URL')
    }
  }

  if (!supabaseAnonKey) {
    warnings.push('Missing VITE_SUPABASE_ANON_KEY in .env')
  } else if (supabaseAnonKey.split('.').length < 3) {
    warnings.push('VITE_SUPABASE_ANON_KEY format looks invalid')
  }

  if (import.meta.env.VITE_GEMINI_API_KEY) {
    warnings.push('VITE_GEMINI_API_KEY is set in frontend env. Prefer Supabase Edge Function secrets only.')
  }

  return warnings
}

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

