import { supabase } from '../lib/supabaseClient'

const PUBLIC_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function askGemini(prompt) {
  // If a public key is present, call Gemini directly from the browser (NOT SECURE)
  if (PUBLIC_GEMINI_KEY) {
    const model = 'gemini-1.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${PUBLIC_GEMINI_KEY}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error?.message || 'Gemini error')
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
  // Fallback: use Supabase Edge Function (secure)
  const { data, error } = await supabase.functions.invoke('ask-gemini', { body: { prompt } })
  if (error) throw error
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function suggestMissingSkills(resumeText, jobDescription) {
  const prompt = `Here is a resume:\n${resumeText}\n\nHere is a job description:\n${jobDescription}\n\nSuggest 5 missing skills the resume should include. Return as a simple bullet list.`
  return askGemini(prompt)
}

