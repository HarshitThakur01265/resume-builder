import { supabase } from '../lib/supabaseClient'

function assertSupabaseConfigured() {
  if (!supabase) {
    throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and restart.')
  }
}

export async function getCurrentUser() {
  assertSupabaseConfigured()
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function saveResume(resume) {
  assertSupabaseConfigured()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('resumes')
    .insert([{ user_id: user.id, title: resume.title, content: resume }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function listResumes() {
  assertSupabaseConfigured()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function deleteResume(id) {
  assertSupabaseConfigured()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  return true
}

export async function getResume(id) {
  assertSupabaseConfigured()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  if (error) throw error
  return data
}

export async function updateResume(id, resume) {
  assertSupabaseConfigured()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('resumes')
    .update({ title: resume.title, content: resume })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
  if (error) throw error
  return data?.[0]
}

export async function getLatestResume() {
  assertSupabaseConfigured()
  const list = await listResumes()
  return list[0] || null
}

