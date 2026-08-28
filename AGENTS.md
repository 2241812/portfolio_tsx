# AGENTS.md — larp-portfolio-vc

## Build & Run (order matters)

```sh
npm run dev          # Turbopack dev server at :3000
npm run lint -- --max-warnings 69   # CI threshold (not just `npm run lint`)
npm run build        # Next.js production build
npm ci --legacy-peer-deps           # Install for Vercel deploy
```

## Routes

| Path | Type | Note |
|------|------|------|
| `/` | static | Main portfolio page (Monochrome Studio Layout) |
| `/admin` | static | CMS editor — saves overrides to `localStorage` |
| `/api/chat` | dynamic | OpenRouter chatbot — requires `OPENROUTER_API_KEY` env |
| `/api/github-stats` | dynamic | Fetches GitHub contributions (public API fallback) |
| `/api/resume` | dynamic | Resume download redirect stub |

## Architecture (non-obvious)

- **All interactive components** use `"use client"` — sections, 3D particles, WebMCP HUD, etc.
- **Every section** wrapped with `memo()` — don't skip this.
- **Framer Motion variants** live in `src/components/sections/shared.ts` — always import from there, never inline variants.
- **Data source**: `src/data/resumeData.ts` is the single source of truth. Also exports `credentials` array used by ContactSection and FooterSection. **Content can be overridden at runtime** via `localStorage['resume-content-overrides']` — the `/admin` page and `useContent` hook handle this.
- **Loading screen** extracted to `src/components/ui/LoadingScreen.tsx` — manages own state and calls `onComplete` callback when settled. `page.tsx` only coordinates settled content.
- **Chatbot system prompt** is built dynamically in `src/app/api/chat/route.ts:buildPortfolioContext()` from `resumeData`. If you change resume data, the chatbot personality changes too.
- **WebGL Background**: `src/components/3d/HeroThreeBackground.tsx` — lightweight constellation particle field.
- **SWR pattern**: Data fetching hooks (`useGitHubAnalyzer`) pass `isInView ? url : null` to defer fetching until the section scrolls into view.
- **WebMCP Integration**:
  - `src/lib/webmcp.ts` — Registers 11 tools into `document.modelContext` with `readOnlyHint` annotations.
  - `src/lib/webmcpEvents.ts` — Live UI Event Bus for real-time human-agent visual synchronization (skill highlights, project focus, telemetry wave).
  - `src/components/WebMCPAgentHUD.tsx` — Floating live agent activity pill and judge simulator drawer.
  - `src/components/sections/ContactSection.tsx` — W3C Declarative HTML Form attributes (`toolname="send_inquiry"`, `toolautosubmit="true"`).

## Framework Versions & Quirks

- Next.js 16 + Turbopack — uses `reactCompiler: true` in `next.config.mjs`
- React 19 — stable, no special migration concerns
- Tailwind CSS v4 — uses `@tailwindcss/postcss` (not v3 `tailwindcss` package)
- TypeScript strict mode, `@/*` path alias maps to `./src/*`
- Google Fonts: Syne, Geist (sans), Geist Mono — loaded via `next/font` in `layout.tsx`

## Key Constraints (agent often misses)

- **Job titles are career aspirations, not current positions.** Never claim "AI Development Intern" or "currently working as X" in chatbot responses or displayed text. Use "aspiring X" or "career interest in X".
- **"OpenCode" is not a skill/framework** — removed from skills. The OpenCode-VSCode-Setup project is a real repo about Docker setup for the tool, not a skill claim.
- **Chatbot must not claim TensorFlow/PyTorch experience** unless verified. The hand sign recognition project uses a CNN but doesn't use those frameworks.
- **README.md should not contain unverified performance claims** (Lighthouse scores, build sizes, Core Web Vitals).

## Git & Deploy

- CI runs on `main` and `develop` branches (`.github/workflows/build.yml`)
- Auto-deploys to Vercel on `main` push (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)
- Live: `https://narcisojavier.vercel.app`
- Repo: `github.com/2241812/larp-portfolio-vc`
