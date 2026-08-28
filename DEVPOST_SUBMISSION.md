# Devpost Submission — The WebMCP Challenge 2026

**Project Title**: Systems Engineering Portfolio with W3C WebMCP & Autonomous Recruiter Agent  
**Tagline**: A high-performance portfolio implementing W3C WebMCP with live UI synchronization, declarative forms, and an autonomous candidate screening engine.  

- **Live URL**: [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app)
- **GitHub Repository**: [https://github.com/narcisoJavier/larp-portfolio-vc](https://github.com/narcisoJavier/larp-portfolio-vc)
- **Open Source License**: [MIT License](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/LICENSE)

---

## 🎯 1. Why Your Use Case is a Strong Fit for WebMCP

Technical portfolios and candidate discovery represent the quintessential use case for the agent-native web:
1. **The Fragility of AI Scraping**: Traditional browsing agents rely on scraping raw HTML or capturing screenshots to parse developer resumes. This frequently breaks on Single-Page Applications (SPAs), WebGL canvas overlays, accordion tabs, and dynamic components.
2. **Missing Authoritative & Structured Grounding**: AI recruiters often hallucinate candidate experience or miss verified credentials because websites lack typed, schema-validated queries.
3. **The "Black Box" Problem**: When AI agents browse sites on behalf of users, the human spectator sees nothing. There is no visual collaboration or real-time feedback.

With **W3C WebMCP (`document.modelContext`)**, this portfolio ceases to be a static page and becomes an **interactive, bi-directional collaboration engine** where AI agents can query verified competencies with 100% accuracy and coordinate with the human spectator in real time.

---

## ✨ 2. How It Creates a Better User Experience

- **Zero-Friction Discovery**: Rather than manually digging through projects or reading long bios, hiring managers and recruiters can have their AI agents instantly inspect specific stacks (e.g., Go concurrency, Docker containerization, Unity physics) in milliseconds.
- **Bi-Directional Visual Synchronization**: When an AI agent invokes tools, the portfolio's **Live UI Event Bus (`src/lib/webmcpEvents.ts`)** visually reacts on-screen — illuminating skills badges with glowing indicators, auto-focusing cards in the horizontal physics project deck, and pulsing the kinetic telemetry waveform.
- **Accessible AI Candidate Fit Dossier**: Agents can autonomously run a multi-step audit and synthesize the candidate's background into a structured evaluation dossier with role match breakdown, verified project proofs, print-to-PDF, and 1-click inquiry dispatch.
- **In-Page Agent Simulator Drawer (Judge Fallback)**: For judges and spectators browsing without Chrome 149+ flags or ChatGPT in-app browsers, the built-in simulator drawer provides 1-click tool presets, custom JSON payload execution, and live response inspection.

---

## 🤝 3. What People and Agents Can Do Together That Was Difficult or Impossible Before

- **Collaborative Candidate Screening**: A hiring manager and their AI agent can review a candidate simultaneously. While the agent executes deep queries against live GitHub stats, academic credentials, and project highlights, the spectator watches matching visual components on the website light up and expand in real time.
- **Automated Multi-Tool Candidate Fit Audit**: In a single click, an autonomous agent orchestrates 4 distinct WebMCP tools (`get_portfolio_overview`, `get_skills`, `get_project_details`, `get_github_stats`) to audit credentials, systems capabilities, project deliverables, and GitHub activity, generating a comprehensive, exportable evaluation dossier.
- **Agent-Driven Inquiry Dispatch**: An agent can negotiate or dispatch a structured interview or collaboration request directly through the official **W3C Declarative HTML Forms API** (`toolname="send_inquiry"`) without relying on brittle DOM clicks.

---

## 🛠️ 4. How WebMCP Was Implemented

This project implements the full **W3C WebMCP Specification** across both **Imperative JavaScript** and **Declarative HTML Forms** APIs:

### A. 11 Registered WebMCP Tools (`src/lib/webmcp.ts`)
Exposes typed, schema-validated, and annotated tools into `document.modelContext` (with backward compatibility fallback to `navigator.modelContext`):
- `get_portfolio_overview` — Read-only developer summary, specializations, and tool directory.
- `get_profile` — Full profile, verified credentials, and direct contact details.
- `get_skills` — Technical skills matrix with project-context descriptions and category filtering.
- `get_projects` & `get_project_details` — Case-insensitive project lookup with technical highlights.
- `get_education` — Academic credentials (Saint Louis University, BS CS '27) and certifications.
- `get_github_stats` & `get_telemetry` — Live GitHub contribution counts (240+ commits) and architecture telemetry.
- `search_portfolio` — Fuzzy keyword search across skills, descriptions, and projects.
- `send_inquiry` — Mutating action tool allowing agents to dispatch structured job opportunities (`readOnlyHint: false`).
- `download_resume` — Direct access to the PDF resume.

### B. W3C Declarative HTML Forms API (`ContactSection.tsx`)
```html
<form
  toolname="send_inquiry"
  tooldescription="Send a professional inquiry, role opportunity, or message to Narciso III Javier"
  toolautosubmit="true"
>
  <input name="sender_name" toolparamdescription="Your full name or recruiting organization" />
  <input name="sender_email" toolparamdescription="Your contact email address for correspondence" />
  <input name="subject" toolparamdescription="Subject line describing the inquiry, role, or proposal" />
  <textarea name="message" toolparamdescription="Detailed message body" />
</form>
```

### C. Live UI Event Bus (`src/lib/webmcpEvents.ts`)
CustomEvents dispatch tool activity across the UI:
- `webmcp:tool-call` — Emits real-time toast alerts to the spectator HUD.
- `webmcp:skill-highlight` — Highlights skill badges and updates the 2-pane inspector.
- `webmcp:project-highlight` — Expands and focuses the matching project card in the physics deck.
- `webmcp:telemetry-pulse` — Triggers kinetic equalizer waves in the Anime.js telemetry card.

---

## 📜 5. Distinction of Prior Work vs. New WebMCP Work

Per Hackathon Rules (Section 4), this project extends an existing 3D portfolio codebase:
- **Pre-existing Work**: Foundational Next.js 16 setup, Three.js constellation canvas, baseline resume data structures.
- **New Work Added During Hackathon (Aug 25 – Sept 3, 2026)**:
  1. Complete W3C WebMCP integration in [`src/lib/webmcp.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/lib/webmcp.ts) with 11 registered tools.
  2. Declarative HTML Forms API annotations in [`ContactSection.tsx`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/components/sections/ContactSection.tsx).
  3. Real-time human-agent visual synchronization event bus in [`src/lib/webmcpEvents.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/lib/webmcpEvents.ts).
  4. Autonomous recruiter audit workflow engine in [`src/lib/webmcpWorkflow.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/lib/webmcpWorkflow.ts).
  5. AI Candidate Fit Dossier modal in [`CandidateDossierModal.tsx`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/components/ui/CandidateDossierModal.tsx).
  6. Floating In-Page Agent Simulator Drawer & HUD in [`WebMCPAgentHUD.tsx`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/components/WebMCPAgentHUD.tsx).
  7. All verifiable via timestamped git commit history on `main` branch.

---

## 🧪 How To Test (For Judges)

### Option A: Via Chrome 149+ with WebMCP Flag
1. Open `chrome://flags/#enable-webmcp-testing` in Chrome 149+ and enable it.
2. Visit [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app).
3. Open DevTools Console (`F12`):
```javascript
// 1. Check registered tools
const tools = await document.modelContext.getTools();
console.table(tools.map(t => ({ name: t.name, description: t.description })));

// 2. Run a search query (watch the Skills section react on screen!)
const searchTool = tools.find(t => t.name === 'search_portfolio');
await document.modelContext.executeTool(searchTool, { query: 'Docker' });
```

### Option B: Via the In-Page Agent Simulator Drawer (Any Browser)
1. Visit [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app).
2. Click the floating **`[🤖 WebMCP AGENT // SIMULATOR]`** pill in the bottom-left corner.
3. Click **"Run Full Recruiter Screen"** to watch the multi-step autonomous audit and open the AI Dossier.
4. Try the 1-click presets (*Inspect Skills*, *Project Lookup*, *Live Telemetry*, *Send Inquiry*) or execute custom JSON tools directly from the drawer!

---

## 📹 Video Demo Script (2–3 Minutes)

- **0:00 – 0:30 (Problem & Intro)**: Show portfolio landing page. Explain the problem with AI scraping vs. structured W3C WebMCP tool calling.
- **0:30 – 1:00 (WebMCP Chrome Console Demo)**: Open Chrome DevTools console, run `getTools()`, call `search_portfolio('Docker')`, and show the skills badge glowing and inspector switching automatically.
- **1:00 – 1:40 (Autonomous Recruiter Screen)**: Open the WebMCP HUD in the bottom corner. Click "Run Full Recruiter Screen", showing the 4 steps resolving with live UI reactions, culminating in the AI Candidate Fit Dossier modal.
- **1:40 – 2:10 (Declarative HTML Forms & Inquiry Action)**: Show the contact form with `toolname="send_inquiry"`, submit an inquiry, show the success confirmation and local persistence.
- **2:10 – 2:30 (Conclusion & Spec Compliance)**: Recap dual API compliance, performance, and accessibility.
