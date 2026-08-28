# Devpost Submission — WebMCP Challenge 2026

**Project Title**: Studio Portfolio with W3C WebMCP & Autonomous Recruiter Agent
**Tagline**: A high-performance systems engineering portfolio implementing W3C WebMCP with live UI synchronization, declarative forms, and an autonomous candidate screening engine.

- **Live URL**: [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app)
- **GitHub Repository**: [https://github.com/narcisoJavier/larp-portfolio-vc](https://github.com/narcisoJavier/larp-portfolio-vc)

---

## 🎯 Inspiration & The Problem

Technical hiring and portfolio discovery have a massive friction point:
1. **Recruiter & Agent Scraping Breakage**: Standard AI browsing agents rely on scraping raw HTML or screenshotting pages, which frequently breaks on SPAs, heavy WebGL/Three.js canvases, or dynamic tabs.
2. **Missing Structured Discovery**: Standard portfolio websites don't expose typed, callable tools for AI agents to query verified skills, examine architecture trade-offs, or check live GitHub telemetry.
3. **The "Black Box" Agent Experience**: When agents do call APIs, they typically run invisibly in the background with zero visual feedback for the human spectator.

We built this project to prove that **the official W3C WebMCP standard (`document.modelContext`)** transforms a portfolio into a bi-directional, collaborative human-agent workspace.

---

## 🚀 What It Does

This portfolio implements the complete **W3C WebMCP Specification** across both **Imperative JavaScript APIs** and **Declarative HTML Forms APIs**:

### 1. 🛠️ 11 Registered WebMCP Tools (`src/lib/webmcp.ts`)
Exposes typed, schema-validated, and annotated tools directly into the browser's model context:
- `get_portfolio_overview` — Read-only high-level developer summary & tool directory.
- `get_profile` — Full profile, verified credentials, and direct contact details.
- `get_skills` — Technical skills matrix with project-context descriptions and category filtering.
- `get_projects` & `get_project_details` — Case-insensitive project lookup with technical highlights.
- `get_education` — Academic credentials (Saint Louis University, BS CS '27) and certifications.
- `get_github_stats` & `get_telemetry` — Live GitHub contribution counts (240+ commits) and architecture telemetry.
- `search_portfolio` — Fuzzy keyword search across all portfolio content.
- `send_inquiry` — Action tool allowing agents to dispatch structured job opportunities.
- `download_resume` — Direct access to the PDF resume.

### 2. 📝 W3C Declarative HTML Forms API (`ContactSection.tsx`)
Annotated HTML form per the WebMCP specification:
```html
<form
  toolname="send_inquiry"
  tooldescription="Send a direct inquiry or collaboration message to Narciso III Javier"
  toolautosubmit="true"
>
  <input name="sender_name" toolparamdescription="Your full name or recruiting organization" />
  <input name="sender_email" toolparamdescription="Your contact email address" />
  <input name="subject" toolparamdescription="Subject line of the inquiry or role title" />
  <textarea name="message" toolparamdescription="Detailed message body" />
</form>
```

### 3. ⚡ Live UI Event Bus & Human-Agent Visual Collaboration
A real-time CustomEvent bus (`src/lib/webmcpEvents.ts`) coordinates live visual synchronization:
- **Skills Matrix Inspector**: When an agent searches for "Docker" or queries programming skills, matching badges illuminate with a pulsing green indicator, and the 2-pane inspector automatically switches to that capability.
- **Horizontal Physics Project Deck**: When an agent inspects projects like *Tether*, the physics deck expands and focuses the matching project card.
- **Anime.js Telemetry Card**: Pulses kinetic equalizer waveforms during telemetry queries.
- **Agent HUD Toast Alerts**: Notifies spectators in real time whenever an agent executes a tool.

### 4. 🤖 Autonomous Recruiter Screen & AI Candidate Dossier
A 1-click multi-tool agent workflow in the HUD that:
1. Verifies academic background & certifications (`get_portfolio_overview`).
2. Audits systems & infrastructure stack (`get_skills`, `search_portfolio`).
3. Cross-references project deliverables (`get_project_details`).
4. Verifies live GitHub commits & telemetry (`get_github_stats`, `get_telemetry`).
5. Synthesizes findings into an **Accessible AI Candidate Fit Dossier Modal** with role compatibility scores (Systems: 96%, Full Stack: 92%, Game Dev: 88%), Markdown export, print-to-PDF, and 1-click dispatch.

### 5. 🎛️ In-Page Agent Simulator Drawer (Judge Fallback)
For judges evaluating on browsers without Chrome 149+ flags or ChatGPT in-app browsers, the built-in simulator drawer allows 1-click presets, custom JSON tool execution, and raw response inspection.

---

## 🏗️ How We Built It

- **Framework**: Next.js 16 (Turbopack + React Compiler)
- **UI / Runtime**: React 19 + TypeScript 5.9 (Strict Mode)
- **Styling & Design System**: Tailwind CSS v4 + Syne & Geist Typography (Monochrome Studio Layout)
- **Graphics & Motion**: Three.js / WebGL Constellation + Framer Motion + Anime.js
- **Standard**: W3C WebMCP (`document.modelContext` / `navigator.modelContext`)
- **Hosting & CI/CD**: Vercel + GitHub Actions

---

## 🧪 How To Test (For Judges)

### Option A: Via Chrome 149+ with WebMCP Flag
1. Open `chrome://flags/#enable-webmcp-testing` in Chrome 149+ and enable it.
2. Visit [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app).
3. Open DevTools Console (`F12`):
```javascript
// Check registered tools
const tools = await document.modelContext.getTools();
console.table(tools.map(t => ({ name: t.name, description: t.description })));

// Run a search query (watch the Skills section react on screen!)
const searchTool = tools.find(t => t.name === 'search_portfolio');
await document.modelContext.executeTool(searchTool, { query: 'Docker' });
```

### Option B: Via the In-Page Agent Simulator Drawer (Any Browser)
1. Visit [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app).
2. Click the floating **`[🤖 WebMCP AGENT // SIMULATOR]`** pill in the bottom-left corner.
3. Click **"Run Full Recruiter Screen"** to watch the multi-step autonomous audit and open the AI Dossier.
4. Try the 1-click presets or execute custom tools directly from the drawer!

---

## 📹 Video Demo Script (2–3 Minutes)

- **0:00 – 0:30 (Problem & Intro)**: Show portfolio landing page. Explain the problem with AI scraping vs. structured W3C WebMCP tool calling.
- **0:30 – 1:00 (WebMCP Chrome Console Demo)**: Open Chrome DevTools console, run `getTools()`, call `search_portfolio('Docker')`, and show the skills badge glowing and inspector switching automatically.
- **1:00 – 1:40 (Autonomous Recruiter Screen)**: Open the WebMCP HUD in the bottom corner. Click "Run Full Recruiter Screen", showing the 4 steps resolving with live UI reactions, culminating in the AI Candidate Fit Dossier modal.
- **1:40 – 2:10 (Declarative HTML Forms & Inquiry Action)**: Show the contact form with `toolname="send_inquiry"`, submit an inquiry, show the success confirmation and local persistence.
- **2:10 – 2:30 (Conclusion & Spec Compliance)**: Recap dual API compliance, performance, and accessibility.
