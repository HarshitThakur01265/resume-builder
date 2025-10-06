import { supabase } from '../lib/supabaseClient'

const PUBLIC_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

// --- 1) Greeting detector ---
function isGreeting(prompt) {
  const greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"]
  const lowerPrompt = prompt.toLowerCase().trim()
  return greetings.some(g => lowerPrompt.startsWith(g))
}

// --- 2) Resume filter ---
function isResumeRelated(prompt) {
  const keywords = [
    "resume", "cv", "curriculum vitae", "career",
    "skills", "job", "experience", "qualification",
    "cover letter", "profile", "summary", "interview"
  ]
  const lowerPrompt = prompt.toLowerCase()
  return keywords.some(k => lowerPrompt.includes(k))
}

// --- 3) Main chatbot function ---
export async function askGemini(prompt) {
  // Greeting response
  if (isGreeting(prompt)) {
    return "👋 Hello! I’m your Resume Assistant Bot. I can help you build, improve, and analyze resumes, suggest missing skills, and answer resume-related queries."
  }

  // Block unrelated queries
  if (!isResumeRelated(prompt)) {
    return "⚠️ I can only assist with resume-related questions, doubts, and queries."
  }

  // 1) Direct Gemini API call
  if (PUBLIC_GEMINI_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${PUBLIC_GEMINI_KEY}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(data?.error?.message || 'Gemini error')
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  // 2) Supabase Edge Function
  if (supabase) {
    const { data, error } = await supabase.functions.invoke('ask-gemini', { body: { prompt } })
    if (error) throw new Error(error.message || 'Edge function error')
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  // 3) Fallback REST call
  const bases = [SUPABASE_URL, 'http://127.0.0.1:54321', ''].filter(Boolean)
  const headers = {
    'Content-Type': 'application/json',
    ...(SUPABASE_ANON ? { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } : {})
  }
  let lastError
  for (const base of bases) {
    try {
      const resp = await fetch(`${base}/functions/v1/ask-gemini`, {
        method: 'POST', headers, body: JSON.stringify({ prompt })
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`)
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch (e) {
      lastError = e
    }
  }
  throw new Error(lastError?.message || 'AI request failed')
}

// --- 4) Example helper ---
export async function suggestMissingSkills(resumeText, jobDescription) {
  const prompt = `Here is a resume:\n${resumeText}\n\nHere is a job description:\n${jobDescription}\n\nSuggest 5 missing skills the resume should include. Return as a simple bullet list.`
  return askGemini(prompt)
}
