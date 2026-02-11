import { supabase } from '../lib/supabaseClient'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
// API key is only on the server (Edge Function). No VITE_GEMINI_* in frontend.

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
export async function askGemini(prompt, options = {}) {
  const { skipGuards = false } = options
  // Only apply small-talk and topicality guards for the chatbot use case
  if (!skipGuards) {
    // Greeting response
    if (isGreeting(prompt)) {
      return "👋 Hello! I’m your Resume Assistant Bot. I can help you build, improve, and analyze resumes, suggest missing skills, and answer resume-related queries."
    }

    // Block unrelated queries
    if (!isResumeRelated(prompt)) {
      return "⚠️ I can only assist with resume-related questions, doubts, and queries."
    }
  }

  // 1) Supabase Edge Function (API key stays on server)
  if (supabase) {
    const { data, error } = await supabase.functions.invoke('ask-gemini', { body: { prompt } })
    if (error) throw new Error(error.message || 'Edge function error')
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  // 2) Fallback: REST to Edge Function (no API key in client)
  const base = SUPABASE_URL || 'http://127.0.0.1:54321'
  const resp = await fetch(`${base}/functions/v1/ask-gemini`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) throw new Error(data?.error?.message || data?.error || `HTTP ${resp.status}`)
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// --- 4) Sanitize AI output for safe display (limit length, strip HTML) ---
export function sanitizeAiText(text, maxLength = 2000) {
  if (text == null || typeof text !== 'string') return ''
  const stripped = text.replace(/<[^>]*>/g, '').trim()
  return stripped.slice(0, maxLength)
}

// --- 5) Example helper ---
export async function suggestMissingSkills(resumeText, jobDescription) {
  const prompt = `Here is a resume:\n${resumeText}\n\nHere is a job description:\n${jobDescription}\n\nSuggest 5 missing skills the resume should include. Return as a simple bullet list.`
  return askGemini(prompt)
}

// --- 5) Parse multilingual transcript into structured English resume fields ---
// Returns an object like:
// {
//   template: string,
//   title: string,
//   content: {
//     personal: { name, email, phone },
//     links: { github, linkedin, website },
//     summary: string,
//     education: [{ degree, year }],
//     experience: [{ role, company, period, summary }],
//     skills: string[]
//   }
// }
export async function parseTranscriptToResume(transcript, sourceLocale) {
  const system = `You are a resume structuring assistant. You will receive a possibly multilingual or mixed-language spoken transcript of a person's resume details. Your job is to:
1) Detect and translate content to professional English.
2) Extract fields into a strict JSON schema (no extra keys!).
3) Keep concise, professional tone.
4) Infer reasonable defaults if missing (empty strings or arrays).

Strict JSON schema to return (and ONLY the JSON):
{
  "template": string,
  "title": string,
  "content": {
    "personal": { "name": string, "email": string, "phone": string },
    "links": { "github": string, "linkedin": string, "website": string },
    "summary": string,
    "education": [ { "degree": string, "year": string } ],
    "experience": [ { "role": string, "company": string, "period": string, "summary": string } ],
    "skills": string[]
  }
}`

  const prompt = `${system}\n\nSpoken transcript (locale=${sourceLocale}):\n"""\n${transcript}\n"""\n\nReturn ONLY the JSON.`
  // Bypass chatbot guards because this is a structured parsing task, not chat
  const text = await askGemini(prompt, { skipGuards: true })
  try {
    // Extract JSON block if model returns prose
    // Match a JSON block at the end without escaping unnecessary characters
    const jsonMatch = text.match(/\{[\s\S]*\}\s*$/)
    const jsonText = jsonMatch ? jsonMatch[0] : text
    const parsed = JSON.parse(jsonText)
    // Normalize to ensure the app never receives undefined fields
    const norm = {
      template: parsed?.template || 'classic',
      title: parsed?.title || 'Resume',
      content: {
        personal: {
          name: parsed?.content?.personal?.name || '',
          email: parsed?.content?.personal?.email || '',
          phone: parsed?.content?.personal?.phone || ''
        },
        links: {
          github: parsed?.content?.links?.github || '',
          linkedin: parsed?.content?.links?.linkedin || '',
          website: parsed?.content?.links?.website || ''
        },
        summary: parsed?.content?.summary || '',
        education: Array.isArray(parsed?.content?.education) && parsed.content.education.length
          ? parsed.content.education
          : [{ degree: '', year: '' }],
        experience: Array.isArray(parsed?.content?.experience) && parsed.content.experience.length
          ? parsed.content.experience
          : [{ role: '', company: '', period: '', summary: '' }],
        skills: Array.isArray(parsed?.content?.skills)
          ? parsed.content.skills
          : (typeof parsed?.content?.skills === 'string' && parsed.content.skills
            ? parsed.content.skills.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
            : [])
      }
    }
    return norm
  } catch {
    // Fallback minimal structure to avoid crashing UI
    return {
      template: 'classic',
      title: 'Resume',
      content: {
        personal: { name: '', email: '', phone: '' },
        links: { github: '', linkedin: '', website: '' },
        summary: transcript.slice(0, 400),
        education: [{ degree: '', year: '' }],
        experience: [{ role: '', company: '', period: '', summary: '' }],
        skills: []
      }
    }
  }
}