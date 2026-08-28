"use client";
import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { useInView } from '@/hooks/useInView';
import { Activity, GitCommit, Terminal, ExternalLink, Cpu, Radio, Layers } from 'lucide-react';
import { useGitHubActivity, useGitHubContributions, useGitHubUser } from '@/hooks/useGitHubData';

export const AnimeTelemetryCard = memo(function AnimeTelemetryCard() {
  const { ref: containerRef, isInView } = useInView({ rootMargin: '100px', once: true });
  const [isHovered, setIsHovered] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commitCountRef = useRef<HTMLSpanElement>(null);
  const repoCountRef = useRef<HTMLSpanElement>(null);
  const waveBarsRef = useRef<SVGGElement>(null);

  // Subtle intent-based hover debounce
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 140);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const isExpanded = isHovered || isPinnedOpen;

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Real-time GitHub Activity fallback
  const { events } = useGitHubActivity('narcisoJavier', isInView);
  const { user } = useGitHubUser('narcisoJavier', isInView);
  const { contributions } = useGitHubContributions('narcisoJavier', isInView);

  const latestCommit = events?.[0]?.payload?.commits?.[0]?.message || 'No recent public commit available';
  const latestSha = events?.[0]?.payload?.commits?.[0]?.sha?.substring(0, 7) || '—';
  const latestRepo = events?.[0]?.repo?.name?.split('/')[1] || 'GitHub activity';
  const lastYearContributions = contributions?.total?.lastYear;
  const publicRepositoryCount = user?.public_repos;

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

    // 2. Continuous kinetic equalizer wave animation using Anime.js
    if (waveBarsRef.current) {
      const bars = waveBarsRef.current.querySelectorAll('rect');
      animate(bars, {
        scaleY: [
          () => 0.2 + Math.random() * 0.3,
          () => 0.7 + Math.random() * 0.3,
          () => 0.3 + Math.random() * 0.4,
          () => 0.8 + Math.random() * 0.2,
        ],
        transformOrigin: 'bottom',
        duration: 1200,
        ease: 'easeInOutSine',
        delay: stagger(90),
        loop: true,
        alternate: true,
      });
    }
  }, [isInView, lastYearContributions, prefersReducedMotion, publicRepositoryCount]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative select-none"
    >
      {/* Morphing & Enlarging Telemetry Card (Rectangle ➔ Enlarged Square Box) */}
      <motion.div
        layout
        transition={{
          layout: { duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] },
        }}
        className={`blk-card p-3 sm:p-4 relative cursor-pointer group transition-colors duration-300 ${
          isExpanded
            ? 'w-full sm:w-[380px] bg-[#07070b]/98 border-white/30 shadow-2xl shadow-black/90'
            : 'w-full sm:w-[330px] bg-[#0c0c11]/80 hover:border-white/20'
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
          layout="position"
          aria-label="Toggle telemetry details"
          aria-expanded={isExpanded}
          aria-controls="telemetry-intel-details"
          onClick={() => setIsPinnedOpen((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsPinnedOpen(false);
          }}
          className="w-full appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
        >
          <div className="flex items-center justify-between gap-4 relative z-10">
          {/* Left: Key Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono divide-x divide-white/10">
            {/* Metric 1: Commits */}
            <div className="space-y-0.5">
              <div className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-emerald-400" />
                <span>COMMITS</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span ref={commitCountRef} className="text-lg sm:text-xl font-extrabold text-white">
                  {typeof lastYearContributions === 'number' ? `${lastYearContributions}` : '—'}
                </span>
                <span className="text-[9px] text-zinc-500">/ LAST YEAR</span>
              </div>
            </div>

            {/* Metric 2: Repos */}
            <div className="pl-4 sm:pl-6 space-y-0.5">
              <div className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-2.5 h-2.5 text-cyan-400" />
                <span>REPOSITORIES</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span ref={repoCountRef} className="text-lg sm:text-xl font-extrabold text-white">
                  {typeof publicRepositoryCount === 'number' ? publicRepositoryCount : '—'}
                </span>
                <span className="text-[9px] text-zinc-500">PUBLIC</span>
              </div>
            </div>
          </div>

          {/* Right: Waveform & Live Pulse */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-400 tracking-wider">
              <Radio className={`w-2.5 h-2.5 ${isExpanded ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
              <span>TELEMETRY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="overflow-visible">
              <g ref={waveBarsRef}>
                <rect x="0" y="2" width="3" height="16" rx="1" fill="#ffffff" fillOpacity="0.4" />
                <rect x="6" y="2" width="3" height="16" rx="1" fill="#00ADD8" fillOpacity="0.8" />
                <rect x="12" y="2" width="3" height="16" rx="1" fill="#ffffff" fillOpacity="0.6" />
                <rect x="18" y="2" width="3" height="16" rx="1" fill="#00B4AB" fillOpacity="0.9" />
                <rect x="24" y="2" width="3" height="16" rx="1" fill="#3572A5" fillOpacity="0.8" />
                <rect x="30" y="2" width="3" height="16" rx="1" fill="#ffffff" fillOpacity="0.5" />
                <rect x="36" y="2" width="3" height="16" rx="1" fill="#00ADD8" fillOpacity="0.7" />
                <rect x="42" y="2" width="3" height="16" rx="1" fill="#ffffff" fillOpacity="0.3" />
              </g>
            </svg>
          </div>
          </div>
        </motion.button>

        {/* Morphed Internal Content: Expands organically inside the enlarging card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="telemetry-intel-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: prefersReducedMotion ? 0 : 0.2 },
              }}
              className="overflow-hidden space-y-3 pt-3.5 mt-3 border-t border-white/10 relative z-10"
            >
              {/* Origin Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  TELEMETRY INTEL // LIVE WHEN AVAILABLE
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
