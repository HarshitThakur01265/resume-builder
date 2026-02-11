# Resumify — Project Review

## Project overview

- **Stack:** React 18, Vite 5, Supabase (auth + DB), Mantine, Framer Motion, html2pdf.js.
- **Features:** Auth, resume CRUD, 16 templates, PDF/JPG export, AI chatbot (Gemini), floating AI assistant, skill suggestions, voice/transcript resume parsing.
- **Data:** `resumes` table with RLS; app uses anon key and filters by `user_id` in code.

---

## 1. HIGH: API keys exposed in frontend

**Current behavior**

- `src/services/gemini.js` reads `VITE_GEMINI_API_KEY` and calls the Gemini API **from the browser** when the key is set.
- Fallback order: (1) direct Gemini with key in URL, (2) Supabase Edge Function `ask-gemini`, (3) REST to Supabase with anon key as `Authorization: Bearer`.
- `VITE_*` variables are compiled into the client bundle and are **public** (visible in DevTools/Network).

**Risks**

- Anyone can steal the Gemini key and burn quota / incur cost / get the key revoked.
- Sending the anon key as Bearer in fallback does not fix the key-exposure issue.

**What’s already in place**

- Supabase Edge Function `supabase/functions/ask-gemini/index.ts` exists and uses `Deno.env.get('GEMINI_API_KEY')` (server-side). It does not use the anon key.

**Required change**

- **Do not use `VITE_GEMINI_API_KEY` in the frontend.** Remove it from `.env` and from `gemini.js`.
- **Always** call Gemini via your backend:
  - Use **only** the Edge Function: frontend → `supabase.functions.invoke('ask-gemini', { body: { prompt } })` with the user’s Supabase session (no API key in client).
- Set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in Supabase Edge Function secrets (Dashboard → Project Settings → Edge Functions → Secrets), not in the client.
- Keep `SUPABASE_SERVICE_ROLE_KEY` only on the server (e.g. for admin or background jobs); do not expose it to the client.

**Concrete steps**

1. In `gemini.js`: remove the block that uses `PUBLIC_GEMINI_KEY` and the URL with `?key=`. Call only `supabase.functions.invoke('ask-gemini', { body: { prompt } })` (and optionally a REST fallback to the same function URL **without** putting any API key in the frontend).
2. In `.env`: remove `VITE_GEMINI_API_KEY` (and optionally move `VITE_GEMINI_MODEL` to Edge Function env if you want to configure model server-side).
3. In Supabase: set `GEMINI_API_KEY` (and `GEMINI_MODEL` if needed) as Edge Function secrets.
4. Rotate the Gemini API key that was previously in the frontend (it’s compromised once the app was run or built with it).

---

## 2. MEDIUM: Resume data access (RLS)

**Current behavior**

- All resume CRUD goes through the Supabase client using the **anon** key and relies on:
  - RLS policies in the DB.
  - Application code that filters by `user_id` (from `getCurrentUser()`).

**What’s already in place**

- `supabase/migrations/0001_create_resumes.sql` enables RLS and defines:
  - `resumes select own`, `resumes insert own`, `resumes update own`, `resumes delete own` with `auth.uid() = user_id`.
- So **RLS is correctly enabled**; without it, the anon key could read/write all rows.

**Recommendation**

- Keep RLS as-is. Optionally add a small comment in code or README that resume access is enforced by RLS on `resumes` with `auth.uid() = user_id`.
- For any admin or system-level operations, use the **service role** only in server/Edge Functions, never in the client.

---

## 3. MEDIUM: AI output not validated or limited

**Current behavior**

- **Editor (skill suggestions):** `suggestMissingSkills()` result is shown in `alert(\`AI Skill Suggestions:\n\n${suggestions}\`)` with no length limit or sanitization.
- **Chatbot / FloatingAITeaser:** AI response is rendered with `<ReactMarkdown>{msg.content}</ReactMarkdown>`. ReactMarkdown can reduce raw HTML risk but very long or malformed output can still affect UX or performance.

**Risks**

- Unbounded length can freeze the UI (e.g. huge alert or huge DOM).
- If the model returns HTML or unexpected formatting, it could be rendered in a way you didn’t intend (ReactMarkdown has its own escaping; the main issue is length and robustness).

**Recommended changes**

- **Editor – skill suggestions:**  
  - Replace `alert(...)` with an in-page UI (e.g. modal or inline section).  
  - Before displaying:  
    - Limit length, e.g. `const safeText = (suggestions || '').slice(0, 2000)`.  
    - Optionally strip HTML: `safeText.replace(/<[^>]*>/g, '')`.  
  - Render as plain text (or safe Markdown), not `innerHTML`.
- **Chatbot / FloatingAITeaser:**  
  - Cap response length before passing to ReactMarkdown, e.g. `(text || '').slice(0, 4000)`.  
  - Keep using ReactMarkdown (or a safe subset) and avoid rendering raw HTML from the model.

---

## 4. LOW: PDF export (long resumes)

**Current behavior**

- `src/pages/Preview.jsx`: For PDF, the code computes a scale so that the whole resume fits one A4 page (`scale = Math.min(scaleX, scaleY, 1)`). When the content is tall, everything is shrunk, which can make long resumes hard to read.

**Recommendation**

- Allow **multiple pages** instead of forcing one page:
  - Remove or relax the single-page scaling (avoid scaling down the entire content to one page).
  - Use CSS page breaks so content flows across pages, e.g.:
    - `page-break-before: always` or `break-before: page` for sections that should start on a new page.
    - `page-break-inside: avoid` on blocks you don’t want to split (e.g. a single experience entry).
  - Rely on html2pdf’s natural pagination (it already supports multi-page PDFs) and set `pagebreak` options as needed (e.g. `mode: ['css', 'legacy']` and avoid forcing a single canvas height).

This addresses the issue of the resume “showing on the 2nd page” by making the first page the first part of the resume and letting the rest flow to following pages instead of being squeezed onto one.

---

## 5. Critical: .env and secrets

**Current state**

- `.gitignore` does **not** include `.env`. If `.env` is committed, API keys and Supabase URL/keys will be in the repo.
- Your `.env` contains real keys (Gemini and Supabase). **Do not commit this file.**

**Required actions**

1. Add to `.gitignore`:
   ```
   .env
   .env.local
   .env.*.local
   ```
2. If `.env` was ever committed, rotate **all** keys in it (Gemini, Supabase anon key if you consider it sensitive, and any other secrets).
3. Use a `.env.example` with placeholder values (e.g. `VITE_SUPABASE_URL=`, `VITE_SUPABASE_ANON_KEY=`) and document in README that users copy it to `.env` and fill in values.

---

## Summary table

| Area              | Severity | Status / Action |
|-------------------|----------|------------------|
| API keys in client| HIGH     | Move all Gemini calls to Edge Function; remove `VITE_GEMINI_API_KEY`; set secrets in Supabase; rotate key. |
| RLS on resumes    | MEDIUM   | Already enabled and correct. Document and keep as-is. |
| AI output safety  | MEDIUM   | Limit length; sanitize; replace alert with in-app UI; keep ReactMarkdown with length cap. |
| PDF multi-page    | LOW      | Prefer multi-page PDF; use CSS page breaks; avoid single-page scale-down. |
| .env in repo      | Critical | Add `.env` to `.gitignore`; add `.env.example`; rotate keys if `.env` was committed. |

---

## File reference

- **Gemini (client):** `src/services/gemini.js` — remove direct API key usage; call only Edge Function.
- **Gemini (server):** `supabase/functions/ask-gemini/index.ts` — already uses env key; set secrets in dashboard.
- **Resume CRUD:** `src/services/resumes.js` — uses anon + `user_id`; RLS in `supabase/migrations/0001_create_resumes.sql`.
- **AI in UI:** `src/pages/Editor.jsx` (suggestions alert), `src/pages/Chatbot.jsx`, `src/components/FloatingAITeaser.jsx` — add length limits and safe rendering.
- **PDF:** `src/pages/Preview.jsx` — change export to multi-page with CSS page breaks.
