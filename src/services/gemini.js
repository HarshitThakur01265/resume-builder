const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

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

  const edgeFunctionHelp = [
    '1) Deploy the Edge Function: run "supabase functions deploy ask-gemini" from the project root.',
    '2) In Supabase Dashboard → Project Settings → Edge Functions → Secrets, add GEMINI_API_KEY (get a key from Google AI Studio).'
  ].join(' ')

  // Call Edge Function via fetch so we can read the exact error body on non-2xx
  const base = SUPABASE_URL || 'http://127.0.0.1:54321'
  const url = `${base}/functions/v1/ask-gemini`
  const headers = { 'Content-Type': 'application/json' }
  if (SUPABASE_ANON_KEY) headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt })
    })
    
    // Read response as text first to handle empty/invalid JSON
    const responseText = await resp.text()
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from Edge Function. Check Edge Function logs in Supabase Dashboard.')
    }
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(`Invalid response from Edge Function: ${responseText.substring(0, 200)}`)
    }
    
    if (!resp.ok) {
      // Extract error message from response body
      let errMsg = data?.error || `HTTP ${resp.status}`
      if (data?.details) {
        if (typeof data.details === 'string') {
          errMsg = data.details
        } else if (data.details?.error?.message) {
          errMsg = data.details.error.message
        } else if (data.details?.message) {
          errMsg = data.details.message
        } else {
          errMsg = JSON.stringify(data.details)
        }
      }
      
      if (resp.status === 401) {
        throw new Error('Authentication failed (401). Use the correct Supabase anon key: Supabase Dashboard → Project Settings → API → copy the "anon public" key (a long JWT starting with eyJ...). Put it in .env as VITE_SUPABASE_ANON_KEY and restart the app.')
      }
      if (errMsg === 'GEMINI_API_KEY not configured' || /not configured/i.test(errMsg)) {
        throw new Error(`AI not configured. ${edgeFunctionHelp}`)
      }
      if (data?.error === 'Gemini error' && data?.details) {
        const detail = data.details?.error?.message || (typeof data.details === 'string' ? data.details : JSON.stringify(data.details))
        throw new Error(`Gemini API: ${detail}`)
      }
      if (errMsg === 'Bad request' && data?.details) {
        throw new Error(`Edge Function error: ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}`)
      }
      throw new Error(errMsg)
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (e) {
    if (e?.message?.includes('AI not configured') || e?.message?.includes('Edge Function not reachable') || e?.message?.startsWith('Gemini API:')) throw e
    if (/failed to fetch|network|Load failed/i.test(e?.message || '') || e?.name === 'TypeError') {
      throw new Error(`Edge Function not reachable. ${edgeFunctionHelp}`)
    }
    throw e
  }
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