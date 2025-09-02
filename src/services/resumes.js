import { supabase } from '../lib/supabaseClient'

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function saveResume(resume) {
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
  const list = await listResumes()
  return list[0] || null
}

