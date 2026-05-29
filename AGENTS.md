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
| `/` | static | Main portfolio page |
| `/break` | static | Typing challenge game |
| `/admin` | static | CMS editor — saves overrides to `localStorage` |
| `/api/chat` | dynamic | OpenRouter chatbot — requires `OPENROUTER_API_KEY` env |
| `/api/github-stats` | dynamic | Fetches GitHub contributions (public API fallback) |
| `/api/resume` | dynamic | Resume download stub |

## Architecture (non-obvious)

- **All interactive components** use `"use client"` — sections, 3D, game, chat, etc.
- **Every section** wrapped with `memo()` — don't skip this.
- **Framer Motion variants** live in `src/components/sections/shared.ts` — always import from there, never inline variants.
- **Data source**: `src/data/resumeData.ts` is the single source of truth. Also exports `credentials` array used by ContactSection and FooterSection. **Content can be overridden at runtime** via `localStorage['resume-content-overrides']` — the `/admin` page and `useContent` hook handle this.
- **Loading screen** extracted to `src/components/ui/LoadingScreen.tsx` — manages own state and calls `onComplete` callback when settled. `page.tsx` only coordinates settled content.
- **Chatbot system prompt** is built dynamically in `src/app/api/chat/route.ts:buildPortfolioContext()` from `resumeData`. If you change resume data, the chatbot personality changes too.
- **3D Canvas** uses `frameloop="demand"` — only renders on frame changes. Don't change to `"always"`.
- **SWR pattern**: Data fetching hooks (`useGitHubData`) pass `isInView ? url : null` to defer fetching until the section scrolls into view.
- **3D model**: `public/models/keyboard.glb` — keyboard press events map DOM `keydown`/`keyup` to mesh nodes via `useFrame` + `lerp`.

## Framework Versions & Quirks

- Next.js 16 + Turbopack — uses `reactCompiler: true` in `next.config.mjs`
- React 19 — stable, no special migration concerns
- Tailwind CSS v4 — uses `@tailwindcss/postcss` (not v3 `tailwindcss` package)
- TypeScript strict mode, `@/*` path alias maps to `./src/*`
- Google Fonts: Geist (sans), Geist Mono, Orbitron, Rajdhani — loaded via `next/font` in `layout.tsx`

## Key Constraints (agent often misses)

- **Job titles are career aspirations, not current positions.** Never claim "AI Development Intern" or "currently working as X" in chatbot responses or displayed text. Use "aspiring X" or "career interest in X".
- **"OpenCode" is not a skill/framework** — removed from skills. The OpenCode-VSCode-Setup project is a real repo about Docker setup for the tool, not a skill claim.
- **Chatbot must not claim TensorFlow/PyTorch experience** unless verified. The hand sign recognition project uses a CNN but doesn't use those frameworks.
- **README.md should not contain unverified performance claims** (Lighthouse scores, build sizes, Core Web Vitals). These were already removed.

## Dead Code (safe to remove)

- `src/components/ui/GlitchTitle.tsx` — never imported anywhere
- `src/hooks/useContributionGame.ts` — never imported (`ContributionCalendar.tsx` uses its own inline state)
- `src/hooks/useCustomHooks.ts` — never imported anywhere (all 11 hooks were dead code)

## AchievementToast Bug Pattern

The `AchievementToast` component tracks individual toast instances by unique key to avoid the bug where multiple achievements all fire `onDismiss()` on the first timeout. Each toast independently dismisses via `useEffect` timeout + key tracking. Don't revert to the old `onAnimationComplete` + single `onDismiss` pattern.

## Game Architecture

The contribution "break" game is embedded in `ContributionCalendar.tsx` (not a separate component). The `useGameStats` hook persists stats to `localStorage['contribution-game-stats']`. Level definitions and achievements are in `src/constants/gameConstants.ts`.

## Git & Deploy

- CI runs on `main` and `develop` branches (`.github/workflows/build.yml`)
- Auto-deploys to Vercel on `main` push (requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets)
- Repo: `github.com/2241812/larp-portfolio-vc`
