# Resumify — Product Review Report

**Product name:** Resumify  
**Version:** 1.0.0  
**Report type:** Feature overview, UI/UX summary, and technology stack

---

## 1. What We Deliver to the Customer

### 1.1 Core Features

| Feature | Description |
|--------|-------------|
| **Resume creation** | Create resumes from scratch with guided forms (personal info, summary, education, experience, skills, projects). |
| **Profile-based flow** | Choose a profile (Software/IT, Creative, Marketing, Business, Student, General) for a tailored editing experience. |
| **17 resume templates** | Classic, Modern, Minimal, Professional, Creative, Compact, Academic, Fresher/Student ATS, Business, Technical, Sidebar, Elegant, Gradient, Timeline, Two Column, ATS, Infographic. |
| **Live preview** | See the resume update as you type; switch templates on the fly. |
| **Export** | Download resume as **PDF** or **JPG**. |
| **Save & manage** | Save multiple resumes to the cloud; list, open, and delete from “My Resumes.” |
| **AI assistant** | In-app AI (Gemini) for resume-related help: tips, wording, missing skills, and Q&A. |
| **Account & auth** | Sign up, sign in, sign out; resumes are stored per user. |
| **Public project showcase** | Optional public page to showcase projects with links (Figma, GitHub, live site). |

### 1.2 User Journey

1. **Home** → Landing with value proposition, template previews, and CTAs.  
2. **Profile selection** → Choose career profile (or skip).  
3. **Editor** → Fill sections; use “Suggest missing skills” (AI); save.  
4. **Preview** → View final layout; change template; export PDF/JPG.  
5. **My Resumes** → List, open, or delete saved resumes.  
6. **AI Assistant** → Chat for resume help (from nav or floating button).

---

## 2. UI/UX Overview

### 2.1 Design System

- **Typography:** DM Sans (primary), with system fallbacks for performance and consistency.  
- **Theme:** Light and dark mode; preference stored in `localStorage`; toggle in side drawer (keyboard shortcut supported).  
- **Layout:** Responsive; mobile-friendly navigation via hamburger menu and side drawer.  
- **Visual style:**  
  - Clean, professional look (no playful gradients or flashy effects).  
  - Buttons: solid primary blue, 6px radius, subtle hover (slight lift, soft shadow).  
  - Cards/panels: glass-style surfaces with blur and light borders.  
  - Navigation: text links with 6px rounded active state; no pill shapes or heavy animation.

### 2.2 Key Screens

- **Home:** Hero, rotating quotes, template grid, primary/secondary CTAs.  
- **Profile select:** Grid of profile cards (Software, Creative, Marketing, etc.).  
- **Editor:** Form sections (personal, links, summary, education, experience, skills, projects) with optional AI suggestions.  
- **Preview:** Full resume preview, template selector, export format (PDF/JPG), export button.  
- **My Resumes:** List of saved resumes with open/edit and delete.  
- **Auth:** Centered card with email/password and Sign Up / Sign In / Sign Out.  
- **AI Assistant:** Chat interface with markdown-rendered AI replies.

### 2.3 Accessibility & Polish

- Smooth scrolling; reduced-motion respected where applicable.  
- Semantic structure and ARIA where relevant (e.g. drawer, FAB).  
- Touch-friendly targets on mobile; responsive breakpoints.

---

## 3. Technology Stack

### 3.1 Frontend

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build tool** | Vite 5 |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form |
| **UI / theming** | Mantine v7 (core + hooks) |
| **Animations** | Framer Motion, Lottie (Lottie React), Typed.js |
| **Export (client)** | html2pdf.js, html2canvas (for JPG) |
| **Markdown (AI chat)** | React Markdown |

### 3.2 Backend & Services

| Service | Role |
|---------|------|
| **Supabase** | Auth (email/password), PostgreSQL database; resumes stored per user. |
| **Supabase Edge Functions** | Server-side proxy to Gemini API (API key not exposed to frontend). |

### 3.3 AI

| Component | Role |
|-----------|------|
| **Google Gemini** | Resume-focused AI: chat answers, suggestions, missing-skills helper. |
| **Integration** | Frontend calls Supabase Edge Function; Edge Function calls Gemini. |

### 3.4 Fonts & Assets

- **Font:** DM Sans (Google Fonts).  
- **Assets:** SVG hero, Lottie JSON (loading, success, writing), static images as needed.

---

## 4. Summary Table for Quick Reference

| Area | Details |
|------|---------|
| **Product** | Resumify — browser-based resume builder with templates, export, and AI help. |
| **UI** | Clean, professional; DM Sans; light/dark; glass-style panels; solid buttons; responsive. |
| **Frameworks** | React 18, Vite 5, React Router v6, Mantine v7, React Hook Form, Framer Motion. |
| **Backend** | Supabase (auth + database). |
| **AI** | Google Gemini via Supabase Edge Functions. |
| **Export** | PDF, JPG. |
| **Templates** | 17 (ATS-friendly and design-focused). |

---

*This document can be used in proposals, internal docs, or customer-facing material to describe what Resumify offers, its UI/UX approach, and the technologies used.*
