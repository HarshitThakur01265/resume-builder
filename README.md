# Resumify

Build and export professional resumes with templates and AI assistance.

## Environment

- Copy `.env.example` to `.env` and set:
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from Supabase Dashboard → Project Settings → API).

### AI Chatbot (Edge Function)

The AI assistant uses a Supabase Edge Function so the Gemini API key never lives in the frontend.

1. **Deploy the Edge Function** (required for the chatbot to work):
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase functions deploy ask-gemini
   ```
2. **Set the Gemini API key** in Supabase:
   - Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
   - Add secret: `GEMINI_API_KEY` = your key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Optionally add `GEMINI_MODEL` (e.g. `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash-lite`).

If you see *"Failed to send a request to the Edge Function"*, the function is not deployed or not reachable—complete step 1 and ensure `VITE_SUPABASE_URL` matches the linked project.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Enterprise-Complete Optional Enhancements

These additions help harden the app for enterprise readiness without changing existing features.

- **Legal & Compliance**
  - Terms of Service, Privacy Policy, Cookie consent banner
  - DPIA (if applicable), GDPR/CCPA data maps and records of processing activities
  - Third‑party license tracking (fonts/templates/datasets)

- **Data Rights & Privacy**
  - Self‑serve data export (portability) and account deletion flows
  - Data retention schedules per object; PII minimization and encryption at rest/in transit

- **Security & Governance**
  - Threat modeling (prompt injection, data exfiltration, rate abuse)
  - API security: rate limiting, CORS, CSRF, Helmet, input validation (Zod/Yup), HTML sanitization (DOMPurify)
  - Secrets management and rotation (Vault/Doppler/KMS); environment parity (dev/stage/prod)
  - SAST/SCA/DAST and secrets scanning in CI; SBOM generation

- **Access & Authentication**
  - SSO via OAuth/OIDC (e.g., Auth0/Clerk/Supabase Auth) with RBAC/ABAC
  - Audit logs for sensitive actions; session management and anomaly detection

- **Reliability & Operations**
  - Backups and disaster recovery (RPO/RTO), restore drills
  - Blue/green or canary releases; feature flags (Unleash/LaunchDarkly)
  - Queues for long‑running jobs (BullMQ/Redis) and scheduled tasks

- **Observability**
  - Structured logging with correlation IDs, distributed tracing (OpenTelemetry)
  - Metrics and dashboards (Prometheus/Grafana), error tracking (Sentry)
  - Cost monitoring (AI tokens, storage, egress)

- **Performance & UX**
  - Performance budgets (LCP/INP/TTI), Lighthouse CI
  - Code splitting, route‑level lazy loading, memoization; image and font optimization
  - Offline‑first autosave (Workbox, IndexedDB) and conflict resolution

- **Exports & Fidelity**
  - Server‑side PDF rendering fallback (Puppeteer/Playwright) for pixel‑perfect output
  - Font embedding licenses validated for PDF/Word exports

- **AI & Data**
  - RAG architecture with vector store (pgvector/Qdrant/FAISS) and re‑embedding cadence
  - Evaluation harness and golden datasets; bias/privacy reviews; prompt guardrails
  - Prompt/key governance and rotation; usage quotas and backoff

- **Search & Matching**
  - Job import/parsing from URLs; boilerplate removal
  - Similarity models with monitoring for drift and quality regression

- **Analytics & Growth**
  - Privacy‑first analytics (PostHog/Umami) with user opt‑out
  - In‑app feedback, NPS, and onboarding checklists

- **Payments (optional)**
  - Plans/quotas, metering, and Stripe integration with proration and invoices

- **Documentation & Process**
  - ADRs, architecture diagrams, API docs (OpenAPI/Swagger)
  - Definition of Done, PR templates, release notes/changelog automation
  - Status page and public uptime SLOs

