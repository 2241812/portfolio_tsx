# Devpost Submission — The WebMCP Challenge 2026

**Project Title**: Systems Engineering Portfolio with W3C WebMCP & Evidence Audit Demo
**Tagline**: An interactive portfolio implementing W3C WebMCP with live UI synchronization, declarative forms, and repository-grounded evidence summaries.

- **Live URL**: [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app)
- **GitHub Repository**: [https://github.com/narcisoJavier/larp-portfolio-vc](https://github.com/narcisoJavier/larp-portfolio-vc)
- **Open Source License**: [MIT License](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/LICENSE)

---

## 🎯 1. Why Your Use Case is a Strong Fit for WebMCP

Technical portfolios and candidate discovery represent the quintessential use case for the agent-native web:
1. **The Fragility of AI Scraping**: Traditional browsing agents rely on scraping raw HTML or capturing screenshots to parse developer resumes. This frequently breaks on Single-Page Applications (SPAs), WebGL canvas overlays, accordion tabs, and dynamic components.
2. **Missing Authoritative & Structured Grounding**: AI recruiters often hallucinate candidate experience or miss verified credentials because websites lack typed, schema-validated queries.
3. **The "Black Box" Problem**: When AI agents browse sites on behalf of users, the human spectator sees nothing. There is no visual collaboration or real-time feedback.

With **W3C WebMCP (`document.modelContext`)**, this portfolio becomes an **interactive, bi-directional collaboration surface** where AI agents can query declared profile data and reviewed project evidence while the human spectator sees the interaction in real time.

---

## ✨ 2. How It Creates a Better User Experience

- **Structured Discovery**: Rather than manually digging through projects or reading long bios, hiring managers and recruiters can have compatible AI agents inspect declared stacks and repository-backed project details.
- **Bi-Directional Visual Synchronization**: When an AI agent invokes tools, the portfolio's **Live UI Event Bus (`src/lib/webmcpEvents.ts`)** visually reacts on-screen — illuminating skills badges with glowing indicators, auto-focusing cards in the horizontal physics project deck, and pulsing the kinetic telemetry waveform.
- **Accessible Evidence Snapshot**: Visitors can run a multi-step audit and synthesize declared profile data, reviewed project proofs, limitations, and available GitHub activity into a structured, print-friendly snapshot.
- **In-Page Agent Simulator Drawer (Judge Fallback)**: For judges and spectators browsing without Chrome 149+ flags or ChatGPT in-app browsers, the built-in simulator drawer provides 1-click tool presets, custom JSON payload execution, and live response inspection.

---

## 🤝 3. What People and Agents Can Do Together That Was Difficult or Impossible Before

- **Collaborative Evidence Review**: A hiring manager and their AI agent can review a candidate simultaneously. While the agent queries profile data, project evidence, and available GitHub activity, the spectator watches matching visual components light up and expand in real time.
- **Multi-Tool Evidence Audit**: In a single click, the demo orchestrates 4 distinct WebMCP tools (`get_portfolio_overview`, `get_skills`, `get_project_details`, `get_github_stats`) to assemble a source-backed snapshot without assigning an arbitrary hiring score.
- **Agent-Driven Inquiry Dispatch**: An agent can dispatch a structured interview or collaboration request through the official **W3C Declarative HTML Forms API** (`toolname="send_inquiry"`), which forwards the inquiry through the configured email delivery service when Resend is configured.

---

## 🛠️ 4. How WebMCP Was Implemented

This project implements the challenge's **WebMCP surface** across both **Imperative JavaScript** and **Declarative HTML Forms** APIs:

### A. 11 Registered WebMCP Tools (`src/lib/webmcp.ts`)
Exposes typed, schema-validated, and annotated tools into `document.modelContext` (with backward compatibility fallback to `navigator.modelContext`):
- `get_portfolio_overview` — Read-only developer summary, specializations, and tool directory.
- `get_profile` — Declared profile data, listed credentials, and direct contact details.
- `get_skills` — Technical skills matrix with project-context descriptions and category filtering.
- `get_projects` & `get_project_details` — Case-insensitive project lookup with technical highlights.
- `get_education` — Academic credentials (Saint Louis University, BS CS '27) and certifications.
- `get_github_stats` — GitHub contribution counts and public activity when the external APIs respond; `get_telemetry` — portfolio runtime and architecture specifications.
- `search_portfolio` — Keyword search across skills, descriptions, credentials, and projects.
- `send_inquiry` — Mutating action tool allowing agents to dispatch structured inquiries through the configured email service (`readOnlyHint: false`).
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
- `webmcp:tool-call` — Records recent tool invocations for the spectator HUD and companion reactions.
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
  4. Repository-grounded evidence audit workflow in [`src/lib/webmcpWorkflow.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/lib/webmcpWorkflow.ts).
  5. Evidence Snapshot modal in [`CandidateDossierModal.tsx`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/components/ui/CandidateDossierModal.tsx).
  6. Floating In-Page Agent Simulator Drawer & HUD in [`WebMCPAgentHUD.tsx`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/components/WebMCPAgentHUD.tsx).
  7. Human-reviewed source evidence model in [`src/data/projectEvidence.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/data/projectEvidence.ts), including limitations where the sources are incomplete.
  8. Server-side Resend inquiry delivery in [`src/app/api/inquiry/route.ts`](https://github.com/narcisoJavier/larp-portfolio-vc/blob/main/src/app/api/inquiry/route.ts), with the API key kept out of client code and Git.
  9. All of the above are verifiable via timestamped git commit history on the `main` branch.

### Timestamped history anchors

- `ef4daaa` — 2026-08-28 21:24 (+08:00): initial WebMCP tools, recruiter workflow, and studio integration.
- `09c047c` — 2026-08-28 21:25 (+08:00): submission documentation aligned to the challenge prompts and rules.
- `4e1c32f` — 2026-08-28 21:40 (+08:00): simulator drawer, dispatch hub, and first Cyber Serpent interaction.
- `fbf40db` — 2026-08-28 21:48 (+08:00): telemetry morph, unified pet dock, and vector iconography.
- `45562cc` — 2026-08-28 23:22 (+08:00): repository-grounded evidence layer and server-side Resend inquiry delivery.

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
2. Click the floating **WebMCP Agent // Simulator** pill in the bottom-right corner.
3. Click **"Run Evidence Audit"** to watch the multi-step evidence review and open the Evidence Snapshot.
4. Try the 1-click presets (*Inspect Skills*, *Project Lookup*, *Live Telemetry*, *Send Inquiry*) or execute custom JSON tools directly from the drawer!

---

## 📹 Video Demo Script (2–3 Minutes)

- **0:00 – 0:30 (Problem & Intro)**: Show portfolio landing page. Explain the problem with AI scraping vs. structured W3C WebMCP tool calling.
- **0:30 – 1:00 (WebMCP Chrome Console Demo)**: Open Chrome DevTools console, run `getTools()`, call `search_portfolio('Docker')`, and show the skills badge glowing and inspector switching automatically.
- **1:00 – 1:40 (Evidence Audit Demo)**: Open the WebMCP HUD in the bottom corner. Click "Run Evidence Audit", showing the 4 steps resolving with live UI reactions, culminating in the Evidence Snapshot modal.
- **1:40 – 2:10 (Declarative HTML Forms & Inquiry Action)**: Show the contact form with `toolname="send_inquiry"`, submit an inquiry, and show the email-delivery confirmation.
- **2:10 – 2:30 (Conclusion & Spec Compliance)**: Recap the dual API surface, source-backed wording, and accessibility improvements.

## ✅ Submission-side checks still required

The repository can document and verify the implementation, but these final Devpost items must still be completed by the submitter:

- Publish the final demo as a **public YouTube video under three minutes**, with spoken audio, and paste that URL into the submission.
- Test the public Vercel URL in a supported WebMCP environment and confirm the page behaves as shown in the video.
- Add the Resend variables to Vercel Project Settings if the video demonstrates live inquiry delivery; `.env.local` is not deployed.
- Confirm the GitHub repository is public and the MIT license is visible in the repository's License/About metadata.
- Confirm all demo audio, visuals, and third-party marks are owned, permitted, or replaced with original/appropriately licensed material.
- Complete the Devpost submission before **September 3, 2026 at 1:00 PM PDT**.
