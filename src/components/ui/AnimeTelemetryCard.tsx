"use client";
import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { animate } from 'animejs';
import { useInView } from '@/hooks/useInView';
import { Activity, GitCommit, Terminal, ExternalLink, Cpu, Radio, Layers } from 'lucide-react';
import { useGitHubActivity, useGitHubContributions, useGitHubUser } from '@/hooks/useGitHubData';

const TELEMETRY_REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export const AnimeTelemetryCard = memo(function AnimeTelemetryCard() {
  const { ref: containerRef, isInView } = useInView({ rootMargin: '100px', once: true });
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const commitCountRef = useRef<HTMLSpanElement>(null);
  const repoCountRef = useRef<HTMLSpanElement>(null);

  // Details are deliberate: hovering the card never changes its size.
  const isExpanded = isPinnedOpen;

  // Real-time GitHub Activity fallback
  const { events, isLoading: isActivityLoading, isError: isActivityError } = useGitHubActivity('narcisoJavier', isInView);
  const { user, isLoading: isUserLoading, isError: isUserError } = useGitHubUser('narcisoJavier', isInView);
  const { contributions, isLoading: isContributionsLoading, isError: isContributionsError } = useGitHubContributions('narcisoJavier', isInView);

  const latestCommit = events?.[0]?.payload?.commits?.[0]?.message || 'No recent public commit available';
  const latestSha = events?.[0]?.payload?.commits?.[0]?.sha?.substring(0, 7) || '—';
  const latestRepo = events?.[0]?.repo?.name?.split('/')[1] || 'GitHub activity';
  const lastYearContributions = contributions?.total?.lastYear;
  const publicRepositoryCount = user?.public_repos;
  const isSyncing = isInView && (isActivityLoading || isUserLoading || isContributionsLoading);
  const hasTelemetryData = typeof lastYearContributions === 'number' || typeof publicRepositoryCount === 'number' || events.length > 0;
  const hasTelemetryError = isActivityError || isUserError || isContributionsError;
  const telemetryState = !isInView
    ? 'STANDBY'
    : isSyncing
    ? 'SYNCING'
    : hasTelemetryData
    ? 'SYNCED'
    : hasTelemetryError
    ? 'PARTIAL'
    : 'NO DATA';
  const activitySamples = contributions?.contributions?.slice(-8) || [];
  const maxActivity = Math.max(...activitySamples.map((sample) => sample.count), 1);
  const signalBars = Array.from({ length: 8 }, (_, index) => {
    const sample = activitySamples[index];
    return sample ? Math.max(0.18, Math.min(sample.count / maxActivity, 1)) : 0.18;
  });
  const signalPath = signalBars
    .map((level, index) => `${index * 6 + 1.5},${18 - level * 14}`)
    .join(' ');

  useEffect(() => {
    if (!isInView) return;

    // 1. Animate only values returned by GitHub; do not invent a fallback count.
    const hasCommitCount = typeof lastYearContributions === 'number';
    const hasRepositoryCount = typeof publicRepositoryCount === 'number';
    if (prefersReducedMotion) {
      if (commitCountRef.current && hasCommitCount) {
        commitCountRef.current.textContent = `${lastYearContributions}`;
      }
      if (repoCountRef.current && hasRepositoryCount) {
        repoCountRef.current.textContent = `${publicRepositoryCount}`;
      }
      return;
    }

    const countObj = { commits: 0, repos: 0 };

    animate(countObj, {
      commits: hasCommitCount ? lastYearContributions : 0,
      repos: hasRepositoryCount ? publicRepositoryCount : 0,
      duration: 1600,
      ease: 'outExpo',
      onUpdate: () => {
        if (commitCountRef.current && hasCommitCount) {
          commitCountRef.current.textContent = `${Math.round(countObj.commits)}`;
        }
        if (repoCountRef.current && hasRepositoryCount) {
          repoCountRef.current.textContent = `${Math.round(countObj.repos)}`;
        }
      },
    });

  }, [isInView, lastYearContributions, prefersReducedMotion, publicRepositoryCount]);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
    >
      {/* Compact telemetry card; details open only after an intentional click. */}
      <motion.div
        layout
        transition={{
          layout: {
            duration: prefersReducedMotion ? 0 : 0.44,
            ease: TELEMETRY_REVEAL_EASE,
          },
        }}
        className={`blk-card relative w-full max-w-[330px] cursor-pointer p-3 transition-colors duration-300 sm:p-4 ${
          isExpanded
            ? 'bg-[#07070b]/98 border-white/30 shadow-2xl shadow-black/90'
            : 'bg-[#0c0c11]/80 hover:border-white/20'
        }`}
      >
        {/* Corner Crosshairs that smoothly move with the card boundaries */}
        <span className="blk-crosshair-tl">+</span>
        <span className="blk-crosshair-tr">+</span>
        <span className="blk-crosshair-bl">+</span>
        <span className="blk-crosshair-br">+</span>
        <div className="kokonut-spotlight-layer" />

        {/* Top Header: Always visible metrics + kinetic waveform */}
        <motion.button
          type="button"
          aria-label="Toggle telemetry details"
          aria-expanded={isExpanded}
          aria-controls="telemetry-intel-details"
          onClick={() => setIsPinnedOpen((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsPinnedOpen(false);
          }}
          className="w-full appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
        >
          <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_96px] items-center gap-3">
            {/* Left: Key Metrics */}
            <div className="grid min-w-0 grid-cols-2 divide-x divide-white/10 font-mono">
              {/* Metric 1: Commits */}
              <div className="min-w-0 space-y-0.5 pr-3 sm:pr-5">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-zinc-400">
                  <Activity className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="truncate">COMMITS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span ref={commitCountRef} className="text-lg font-extrabold text-white sm:text-xl">
                    {typeof lastYearContributions === 'number' ? `${lastYearContributions}` : '—'}
                  </span>
                  <span className="truncate text-[8px] text-zinc-500 sm:text-[9px]">LAST YEAR</span>
                </div>
              </div>

              {/* Metric 2: Repos */}
              <div className="min-w-0 space-y-0.5 pl-3 sm:pl-5">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-zinc-400">
                  <Layers className="h-2.5 w-2.5 text-cyan-400" />
                  <span className="truncate">REPOS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span ref={repoCountRef} className="text-lg font-extrabold text-white sm:text-xl">
                    {typeof publicRepositoryCount === 'number' ? publicRepositoryCount : '—'}
                  </span>
                  <span className="text-[8px] text-zinc-500 sm:text-[9px]">PUBLIC</span>
                </div>
              </div>
            </div>

            {/* Right: Functional signal state and recent-activity waveform */}
            <div className="flex min-w-0 flex-col items-end gap-1">
              <div className="flex max-w-full items-center gap-1 text-[7px] font-mono tracking-[0.08em] text-zinc-400">
                <Radio className={`h-2.5 w-2.5 ${isExpanded ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className="truncate">SIGNAL // {telemetryState}</span>
              </div>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="overflow-visible">
                <path d="M 0 18 H 48" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                {signalBars.map((level, index) => (
                  <rect
                    key={index}
                    x={index * 6}
                    y={18 - level * 14}
                    width="3"
                    height={level * 14}
                    rx="1"
                    fill={hasTelemetryData ? index % 3 === 1 ? '#00B4AB' : '#ffffff' : '#71717a'}
                    fillOpacity={hasTelemetryData ? 0.42 + level * 0.48 : 0.35}
                  />
                ))}
                <motion.polyline
                  points={signalPath}
                  fill="none"
                  stroke={hasTelemetryData ? '#34d399' : '#71717a'}
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: isExpanded ? 1 : 0.35, opacity: isExpanded ? 0.95 : 0.5 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: TELEMETRY_REVEAL_EASE }}
                />
                {isExpanded && !prefersReducedMotion && (
                  <motion.line
                    x1="0"
                    y1="1"
                    x2="0"
                    y2="19"
                    stroke="#d7fff0"
                    strokeWidth="0.8"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: [0, 48], opacity: [0, 0.9, 0] }}
                    transition={{ duration: 0.9, ease: TELEMETRY_REVEAL_EASE }}
                  />
                )}
              </svg>
            </div>
          </div>
        </motion.button>

        {/* Details grow out of the compact card instead of appearing as a separate panel. */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id="telemetry-intel-details"
              layout
              initial={{ opacity: 0, height: 0, scaleY: 0.96, y: -6 }}
              animate={{ opacity: 1, height: 'auto', scaleY: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, scaleY: 0.98, y: -3 }}
              transition={{
                height: { duration: prefersReducedMotion ? 0 : 0.48, ease: TELEMETRY_REVEAL_EASE },
                scaleY: { duration: prefersReducedMotion ? 0 : 0.48, ease: TELEMETRY_REVEAL_EASE },
                y: { duration: prefersReducedMotion ? 0 : 0.48, ease: TELEMETRY_REVEAL_EASE },
                opacity: {
                  duration: prefersReducedMotion ? 0 : 0.22,
                  delay: prefersReducedMotion ? 0 : 0.06,
                  ease: 'easeOut',
                },
              }}
              style={{ transformOrigin: 'top center' }}
              className="overflow-hidden space-y-3 pt-3.5 mt-3 border-t border-white/10 relative z-10"
            >
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 0.8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: TELEMETRY_REVEAL_EASE }}
              />

              {/* Origin Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  TELEMETRY INTEL // {telemetryState}
                </span>
                <span className="text-zinc-400 text-[9px]">BAGUIO CITY</span>
              </div>

              {/* Latest Public Commit Stream */}
              <div className="space-y-1 font-mono">
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <GitCommit className="w-2.5 h-2.5 text-white" />
                  <span>LATEST PUBLIC COMMIT</span>
                </div>
                <div className="p-2 bg-[#050508] border border-white/10 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-[11px]">* {latestSha}</span>
                    <span className="text-zinc-400 text-[10px]">[{latestRepo}]</span>
                  </div>
                  <div className="text-zinc-300 text-[10px] truncate">{latestCommit}</div>
                </div>
              </div>

              {/* Architecture Ecosystem Ratios */}
              <div className="space-y-1 font-mono">
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-white" />
                  <span>ARCHITECTURE ECOSYSTEM</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="p-1.5 bg-[#050508] border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00ADD8]" />
                    <span className="text-white font-bold">Go</span>
                    <span className="text-zinc-500 text-[8.5px]">Routing</span>
                  </div>
                  <div className="p-1.5 bg-[#050508] border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00B4AB]" />
                    <span className="text-white font-bold">Dart</span>
                    <span className="text-zinc-500 text-[8.5px]">Mobile SSH</span>
                  </div>
                  <div className="p-1.5 bg-[#050508] border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3572A5]" />
                    <span className="text-white font-bold">Python</span>
                    <span className="text-zinc-500 text-[8.5px]">PyQt6 &amp; CNN</span>
                  </div>
                  <div className="p-1.5 bg-[#050508] border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#384d54]" />
                    <span className="text-white font-bold">Docker</span>
                    <span className="text-zinc-500 text-[8.5px]">DevContainers</span>
                  </div>
                </div>
              </div>

              {/* Direct GitHub Hub Action Link */}
              <a
                href="https://github.com/narcisoJavier"
                target="_blank"
                rel="noopener noreferrer"
                className="blk-btn-secondary w-full py-1.5 text-[10px] flex items-center justify-center gap-2 mt-1"
              >
                <Terminal className="w-3 h-3 text-white" />
                <span>Explore GitHub Repository Hub</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

export default AnimeTelemetryCard;
