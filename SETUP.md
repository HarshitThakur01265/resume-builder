# Resumify Setup and Recovery Guide

Use this guide whenever auth/chatbot setup breaks again.

## 1) Required `.env` values

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Notes:
- Do not use `service_role` key in frontend.
- Do not add quotes around values.
- Keep URL without trailing slash.
- **Default in this repo:** cloud Supabase only (`https://…supabase.co`). Do not mix cloud URL with local keys, or vice versa.
- **Gemini:** never put API keys in `.env` as `VITE_*`. Use Edge Function secrets only.

## 2) Quick health checks

### A) DNS check
```powershell
nslookup YOUR_PROJECT_REF.supabase.co
```

If this fails with `Non-existent domain`, use a correct project URL from Supabase Dashboard.

### B) Reachability check
Open:

`https://YOUR_PROJECT_REF.supabase.co/auth/v1/health`

Expected: JSON response from Supabase (not browser DNS error).

## 3) Run app correctly

After any `.env` change, restart dev server:

```powershell
npm run dev
```

## 4) Supabase dashboard values

From Supabase Dashboard:
- `Project Settings -> API`
- Copy:
  - Project URL
  - `anon` key (or publishable key if you migrate code for it)

## 5) AI chatbot setup (server-side only)

Deploy edge function:

```powershell
npx supabase functions deploy ask-gemini
```

Set secrets in Supabase Dashboard:
- `GEMINI_API_KEY`
- optional `GEMINI_MODEL` (recommended: `gemini-2.5-flash`)

Do not keep `VITE_GEMINI_API_KEY` in frontend `.env`.

## 6) Common errors and fixes

- `Failed to fetch` on sign in:
  - Verify URL/key in `.env`
  - DNS + health checks above
  - Restart dev server

- `No API key found in request` in browser:
  - Normal when opening endpoints directly without headers.

- `Non-existent domain` in nslookup:
  - Wrong or inactive project ref.

