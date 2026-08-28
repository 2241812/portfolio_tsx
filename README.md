# Narciso III Javier | Studio Portfolio with WebMCP

A modern interactive engineering portfolio built with **Next.js 16**, **React 19**, **Three.js / WebGL**, **Anime.js**, **Framer Motion**, and the official **W3C WebMCP Standard** (`document.modelContext`).

- **Live URL**: [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app)
- **Hackathon Submission**: [WebMCP Challenge on Devpost](https://webmcp.devpost.com/)

---

## 🏆 WebMCP Integration (Hackathon Work // Aug 25 – Sept 3, 2026)

This portfolio implements both the **Imperative JavaScript API** and **Declarative HTML Forms API** of the [W3C WebMCP specification](https://webmachinelearning.github.io/webmcp/), allowing compatible AI agents to inspect declared profile data, reviewed project evidence, and live telemetry when available. The inquiry action sends through the configured Resend email service.

### 1. Dual API Implementation

#### A. Imperative JavaScript Tools (`document.modelContext.registerTool`)
Registered via `src/lib/webmcp.ts` with explicit input schemas and `readOnlyHint` annotations:

| Tool | Mode | Description |
|------|------|-------------|
| `get_portfolio_overview` | Read-only | Developer summary, top languages, project count, and tool directory |
| `get_profile` | Read-only | Full profile, contact info (email, LinkedIn, GitHub, phone), education, and credentials |
| `get_skills` | Read-only | Categorized skills matrix with project-context descriptions (optional `category` filter) |
| `get_projects` | Read-only | All 6 portfolio projects with titles, roles, descriptions, links, and reviewed evidence snapshots |
| `get_project_details` | Read-only | Look up a specific project by name with case-insensitive search (`project_name`) |
| `get_education` | Read-only | Declared academic background (Saint Louis University, BS CS, Class of 2027) and listed certifications |
| `get_github_stats` | Read-only | GitHub contributions, pinned repositories, and recent public activity when the external APIs respond |
| `search_portfolio` | Read-only | Keyword search across skills, descriptions, projects, and credentials (`query`) |
| `send_inquiry` | Action | Send a structured inquiry or job opportunity through the configured Resend email delivery service |
| `download_resume` | Read-only | Direct link to download the developer's resume in PDF format |
| `get_telemetry` | Read-only | Portfolio runtime specifications, project counts, and available telemetry values |

#### B. Declarative HTML Forms API
In `ContactSection.tsx`, the direct dispatch form is annotated with official W3C declarative attributes:
- `<form toolname="send_inquiry" tooldescription="Send a direct inquiry or collaboration message to Narciso III Javier" toolautosubmit="true">`
- Form inputs tagged with `toolparamdescription` for `sender_name`, `sender_email`, `subject`, and `message`.

---

### 2. Live UI Event Bus & Human-Agent Visual Collaboration

When an AI agent invokes tools, the portfolio's **Live UI Event Bus** (`src/lib/webmcpEvents.ts`) coordinates real-time visual reactions on screen:
- **Skills Matrix Inspector**: When an agent calls `get_skills` or `search_portfolio`, matching skill badges glow with a pulsing indicator, and the 2-pane inspector switches to that capability.
- **Physics Project Deck**: When an agent queries projects, the matching project card in the physics deck expands and scrolls into focus.
- **Anime.js Telemetry Card**: Pulses kinetic equalizer waves upon telemetry queries.
- **Live Agent HUD**: Displays real-time toast alerts showing active tool executions.

---

### 3. In-Page Agent Simulator Drawer (Judge Fallback)

Judges on browsers without Chrome 149+ flags or ChatGPT in-app browsers can test the WebMCP experience directly via the **built-in Agent Simulator Drawer** in the bottom-right corner:
- **1-Click Presets**:
  - *Inspect Skills*: Searches Docker and Go skills, highlights badges, and updates inspector.
  - *Project Lookup*: Inspects Campus Navigator and focuses the project deck.
  - *Live Telemetry*: Fetches runtime architecture and available GitHub telemetry.
  - *Send Inquiry*: Opens the dispatch form; submission requires configured email variables.
- **Direct Tool Runner**: Select any of the 11 tools, customize JSON input arguments, and inspect the raw response payload.

---

## 🎨 Pre-existing Studio Features

- **Monochrome Studio Architecture**: High-contrast, dark-mode design with Syne and Geist typography.
- **WebGL Constellation Background**: Three.js particle field with pointer interaction.
- **Hero Showcase Reel**: Kinetic vector visual animations for flagship projects.
- **Horizontal Momentum Physics Deck**: Interactive physics-based project exploration deck.
- **2-Pane Skills Matrix Inspector**: Live skill definition inspection linked to project deliverables.
- **Direct Channels & Dispatch Specs**: Fast clipboard copy with response time telemetry.
- **CMS Editor (`/admin`)**: Runtime content override editor with `localStorage` persistence.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Runtime / UI**: React 19 + TypeScript 5.9
- **Graphics**: Three.js + React Three Fiber (WebGL)
- **Animations**: Anime.js + Framer Motion
- **Styling**: Tailwind CSS v4
- **Smooth Scroll**: Lenis
- **AI Standard**: W3C WebMCP (`document.modelContext`)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/narcisoJavier/larp-portfolio-vc.git
cd larp-portfolio-vc
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Email inquiry configuration

The contact form and WebMCP `send_inquiry` tool use the server-side Resend route at `/api/inquiry`. Copy `.env.example` to `.env.local`, replace `re_xxxxxxxxx` with your real Resend API key, and keep the secret out of Git. Set `INQUIRY_TO_EMAIL=renzoj156@gmail.com`. For production, set `INQUIRY_FROM_EMAIL` to a sender on a domain verified in Resend; `onboarding@resend.dev` is suitable for initial testing.

Vercel deployments need the same variables in **Project Settings → Environment Variables** for the environments you deploy.

### Verification & Production Build

```bash
npm run lint -- --max-warnings 69
npm run build
```

---

## 🧪 Testing WebMCP in Chrome 149+

1. Open `chrome://flags/#enable-webmcp-testing` in Chrome 149+
2. Enable the flag and relaunch Chrome
3. Navigate to [https://narcisojavier.vercel.app](https://narcisojavier.vercel.app)
4. Open DevTools Console (`F12`):
   ```javascript
   // 1. List registered tools
   const tools = await document.modelContext.getTools();
   console.table(tools.map(t => ({ name: t.name, description: t.description })));

   // 2. Execute a tool
   const searchTool = tools.find(t => t.name === 'search_portfolio');
   const results = await document.modelContext.executeTool(searchTool, { query: 'Docker' });
   console.log(results);
   ```

---

## 📝 License

Distributed under the [MIT License](LICENSE).
